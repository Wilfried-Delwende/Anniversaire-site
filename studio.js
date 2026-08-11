/* ============================================
   STUDIO — studio.js
   Authentification (Firebase Auth) + contenu (Firestore)
   + fichiers (Cloudinary). Voir GUIDE-CONFIGURATION.md
   pour la mise en place des deux services.
   ============================================ */

import { firebaseConfig, cloudinaryConfig } from './config.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  getFirestore, enableIndexedDbPersistence,
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, where, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch(() => {
  // Plusieurs onglets ouverts ou navigateur non compatible :
  // le studio continue de fonctionner, juste sans cache hors-ligne.
});

const ROOMS = [
  { id: 1, name: 'Le Mystère' },
  { id: 2, name: 'Melody' },
  { id: 3, name: 'Manga & Énigmes' },
  { id: 4, name: 'La Mangue d\u2019Or' },
  { id: 5, name: '\u00ab Nous \u00bb' },
  { id: 6, name: 'Révélation' }
];

const STORAGE_BUDGET_MO = 500;
const TYPE_ICONS = { texte: '✏️', photo: '🖼️', video: '🎬', audio: '🎵' };

let currentRoom = 1;
let currentBlocks = [];
let unsubscribeRoom = null;
let unsubscribeAll = null;
let editingBlockId = null;
let pickedType = null;

/* ---------- Éléments DOM ---------- */
const loginScreen = document.getElementById('loginScreen');
const appEl = document.getElementById('app');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

const roomTabsEl = document.getElementById('roomTabs');
const storageFillEl = document.getElementById('storageFill');
const storageLabelEl = document.getElementById('storageLabel');
const blockListEl = document.getElementById('blockList');

const formScrim = document.getElementById('formScrim');
const formSheet = document.getElementById('formSheet');
const formTitle = document.getElementById('formTitle');
const formError = document.getElementById('formError');
const typePicker = document.getElementById('typePicker');
const blockForm = document.getElementById('blockForm');

const fieldLabel = document.getElementById('fieldLabel');
const fieldText = document.getElementById('fieldText');
const fieldFile = document.getElementById('fieldFile');
const fieldLegende = document.getElementById('fieldLegende');
const fieldTextWrap = document.getElementById('fieldTextWrap');
const fieldFileWrap = document.getElementById('fieldFileWrap');
const fieldFileHint = document.getElementById('fieldFileHint');
const fieldLegendeWrap = document.getElementById('fieldLegendeWrap');

const submitBtn = document.getElementById('submitBtn');
const uploadProgress = document.getElementById('uploadProgress');
const uploadFill = document.getElementById('uploadFill');
const uploadPct = document.getElementById('uploadPct');

const lightbox = document.getElementById('lightbox');
const lightboxScrim = document.getElementById('lightboxScrim');
const lightboxContent = document.getElementById('lightboxContent');

/* ---------- Authentification ---------- */

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    loginError.textContent = "Connexion impossible. Vérifie l'email et le mot de passe.";
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginScreen.classList.add('hidden');
    appEl.classList.remove('hidden');
    initRoomTabs();
    selectRoom(currentRoom);
    listenStorageTotal();
  } else {
    appEl.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    if (unsubscribeRoom) unsubscribeRoom();
    if (unsubscribeAll) unsubscribeAll();
  }
});

/* ---------- Onglets des salles ---------- */

function initRoomTabs() {
  roomTabsEl.innerHTML = '';
  ROOMS.forEach((r) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'room-tab';
    btn.dataset.room = String(r.id);
    btn.textContent = r.id + '. ' + r.name;
    btn.addEventListener('click', () => selectRoom(r.id));
    roomTabsEl.appendChild(btn);
  });
}

function selectRoom(id) {
  currentRoom = id;
  document.querySelectorAll('.room-tab').forEach((b) => {
    b.classList.toggle('is-active', Number(b.dataset.room) === id);
  });
  listenRoomBlocks(id);
}

function roomName(id) {
  const r = ROOMS.find((r) => r.id === id);
  return r ? r.name : '';
}

/* ---------- Firestore : écoute en direct ---------- */

function listenRoomBlocks(roomId) {
  if (unsubscribeRoom) unsubscribeRoom();
  const q = query(collection(db, 'blocs'), where('salle', '==', roomId));
  unsubscribeRoom = onSnapshot(q, (snap) => {
    const blocks = [];
    snap.forEach((d) => blocks.push({ id: d.id, ...d.data() }));
    blocks.sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));
    currentBlocks = blocks;
    renderBlocks(blocks);
  }, (err) => {
    blockListEl.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'empty-state';
    p.textContent = "Impossible de charger cette salle. Vérifie ta connexion, ou les identifiants dans config.js.";
    blockListEl.appendChild(p);
    console.error(err);
  });
}

function listenStorageTotal() {
  if (unsubscribeAll) unsubscribeAll();
  unsubscribeAll = onSnapshot(collection(db, 'blocs'), (snap) => {
    let totalBytes = 0;
    snap.forEach((d) => {
      const data = d.data();
      if (typeof data.taille === 'number') totalBytes += data.taille;
    });
    updateStorageMeter(totalBytes);
  });
}

function updateStorageMeter(bytes) {
  const mo = bytes / (1024 * 1024);
  const pct = Math.min(100, (mo / STORAGE_BUDGET_MO) * 100);
  storageFillEl.style.width = pct + '%';
  storageFillEl.classList.toggle('is-warning', pct > 80);
  storageLabelEl.textContent = Math.round(mo) + ' Mo utilisés sur ' + STORAGE_BUDGET_MO + ' Mo';
}

function nextOrder() {
  if (currentBlocks.length === 0) return 1;
  return Math.max(...currentBlocks.map((b) => b.ordre ?? 0)) + 1;
}

/* ---------- Affichage des blocs ---------- */

function renderBlocks(blocks) {
  blockListEl.innerHTML = '';

  if (blocks.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Aucun contenu dans cette salle pour l\u2019instant. Touche « Ajouter à cette salle » pour commencer.';
    blockListEl.appendChild(empty);
    return;
  }

  blocks.forEach((b, i) => {
    const card = document.createElement('article');
    card.className = 'block-card';

    const head = document.createElement('div');
    head.className = 'block-head';
    const icon = document.createElement('span');
    icon.className = 'block-icon';
    icon.textContent = TYPE_ICONS[b.type] || '\u2022';
    const label = document.createElement('p');
    label.className = 'block-label';
    label.textContent = b.etiquette || '(sans étiquette)';
    head.append(icon, label);
    card.appendChild(head);

    const preview = document.createElement('div');
    preview.className = 'block-preview';

    if (b.type === 'texte') {
      preview.classList.add('is-text');
      preview.textContent = b.contenu || '';
    } else if (b.type === 'photo' && b.url) {
      const img = document.createElement('img');
      img.src = b.url;
      img.loading = 'lazy';
      img.alt = b.etiquette || '';
      img.addEventListener('click', () => openLightbox(b));
      preview.appendChild(img);
    } else if (b.type === 'video' && b.url) {
      const vid = document.createElement('video');
      vid.src = b.url;
      vid.muted = true;
      vid.playsInline = true;
      vid.preload = 'metadata';
      vid.addEventListener('click', () => openLightbox(b));
      preview.appendChild(vid);
    } else if (b.type === 'audio' && b.url) {
      const audio = document.createElement('audio');
      audio.src = b.url;
      audio.controls = true;
      preview.appendChild(audio);
    } else {
      preview.classList.add('is-text');
      preview.textContent = 'Fichier en cours d\u2019envoi ou manquant.';
    }
    card.appendChild(preview);

    if (b.legende) {
      const legende = document.createElement('p');
      legende.className = 'block-legende';
      legende.textContent = '\uD83D\uDCAC ' + b.legende;
      card.appendChild(legende);
    }

    const actions = document.createElement('div');
    actions.className = 'block-actions';

    const upBtn = iconButton('\u2191', 'Monter', i === 0, () => moveBlock(i, -1));
    const downBtn = iconButton('\u2193', 'Descendre', i === blocks.length - 1, () => moveBlock(i, 1));
    const editBtn = iconButton('\u270F\uFE0F', 'Modifier', false, () => openEditForm(b));
    const delBtn = iconButton('\uD83D\uDDD1\uFE0F', 'Supprimer', false, () => confirmDelete(b));
    delBtn.classList.add('icon-btn--danger');

    actions.append(upBtn, downBtn, editBtn, delBtn);
    card.appendChild(actions);

    blockListEl.appendChild(card);
  });
}

function iconButton(symbol, ariaLabel, disabled, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'icon-btn';
  btn.textContent = symbol;
  btn.setAttribute('aria-label', ariaLabel);
  btn.disabled = disabled;
  btn.addEventListener('click', onClick);
  return btn;
}

async function moveBlock(index, direction) {
  const other = currentBlocks[index + direction];
  const current = currentBlocks[index];
  if (!other || !current) return;
  const a = current.ordre ?? 0;
  const b = other.ordre ?? 0;
  await updateDoc(doc(db, 'blocs', current.id), { ordre: b });
  await updateDoc(doc(db, 'blocs', other.id), { ordre: a });
}

async function confirmDelete(block) {
  const sure = window.confirm(
    'Supprimer « ' + (block.etiquette || 'ce bloc') + ' » ? Cette action est définitive.\n\n' +
    (block.url ? 'Le fichier restera sur Cloudinary : supprime-le aussi là-bas si besoin d\u2019espace.' : '')
  );
  if (!sure) return;
  await deleteDoc(doc(db, 'blocs', block.id));
}

/* ---------- Formulaire d'ajout / édition ---------- */

document.getElementById('addBlockBtn').addEventListener('click', openAddForm);
document.getElementById('formClose').addEventListener('click', closeForm);
formScrim.addEventListener('click', closeForm);

typePicker.querySelectorAll('.type-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    pickedType = btn.dataset.type;
    typePicker.classList.add('hidden');
    blockForm.classList.remove('hidden');
    blockForm.reset();
    showFieldsForType(pickedType, false);
  });
});

blockForm.addEventListener('submit', handleSubmit);

function openAddForm() {
  editingBlockId = null;
  pickedType = null;
  formTitle.textContent = 'Nouveau bloc \u2014 ' + roomName(currentRoom);
  formError.textContent = '';
  blockForm.reset();
  blockForm.classList.add('hidden');
  typePicker.classList.remove('hidden');
  openSheet();
}

function openEditForm(block) {
  editingBlockId = block.id;
  pickedType = block.type;
  formTitle.textContent = 'Modifier \u2014 ' + (block.etiquette || '');
  formError.textContent = '';
  typePicker.classList.add('hidden');
  blockForm.classList.remove('hidden');
  blockForm.reset();
  fieldLabel.value = block.etiquette || '';
  fieldText.value = block.contenu || '';
  fieldLegende.value = block.legende || '';
  showFieldsForType(pickedType, true);
  openSheet();
}

function showFieldsForType(type, isEdit) {
  fieldTextWrap.classList.toggle('hidden', type !== 'texte');
  fieldFileWrap.classList.toggle('hidden', type === 'texte');
  fieldLegendeWrap.classList.toggle('hidden', type === 'texte');
  fieldFileHint.classList.toggle('hidden', !isEdit);
  if (type !== 'texte') {
    fieldFile.accept = type === 'photo' ? 'image/*' : type === 'video' ? 'video/*' : 'audio/*';
  }
}

function openSheet() {
  formScrim.classList.add('is-visible');
  formSheet.classList.add('is-open');
}
function closeForm() {
  formScrim.classList.remove('is-visible');
  formSheet.classList.remove('is-open');
}

async function handleSubmit(e) {
  e.preventDefault();
  formError.textContent = '';

  const etiquette = fieldLabel.value.trim();
  if (!etiquette) {
    formError.textContent = 'Remplis d\u2019abord l\u2019étiquette, en haut du formulaire.';
    fieldLabel.focus();
    return;
  }

  submitBtn.disabled = true;

  try {
    if (pickedType === 'texte') {
      const contenu = fieldText.value.trim();
      if (editingBlockId) {
        await updateDoc(doc(db, 'blocs', editingBlockId), { etiquette, contenu });
      } else {
        await addDoc(collection(db, 'blocs'), {
          salle: currentRoom, type: 'texte', etiquette, contenu,
          ordre: nextOrder(), creeLe: serverTimestamp()
        });
      }
    } else {
      const legende = fieldLegende.value.trim();
      const file = fieldFile.files[0];
      let mediaData = null;

      if (file) {
        uploadProgress.classList.remove('hidden');
        mediaData = await uploadToCloudinary(file, (pct) => {
          uploadFill.style.width = pct + '%';
          uploadPct.textContent = pct + '%';
        });
      } else if (!editingBlockId) {
        throw new Error('Choisis un fichier avant d\u2019enregistrer.');
      }

      if (editingBlockId) {
        const updates = { etiquette, legende };
        if (mediaData) Object.assign(updates, mediaData);
        await updateDoc(doc(db, 'blocs', editingBlockId), updates);
      } else {
        await addDoc(collection(db, 'blocs'), {
          salle: currentRoom, type: pickedType, etiquette, legende,
          ...mediaData, ordre: nextOrder(), creeLe: serverTimestamp()
        });
      }
    }
    closeForm();
  } catch (err) {
    console.error(err);
    formError.textContent = err.message || 'Une erreur est survenue. Réessaie.';
  } finally {
    submitBtn.disabled = false;
    uploadProgress.classList.add('hidden');
    uploadFill.style.width = '0%';
    uploadPct.textContent = '0%';
  }
}

/* ---------- Envoi vers Cloudinary ---------- */

function uploadToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const url = 'https://api.cloudinary.com/v1_1/' + cloudinaryConfig.cloudName + '/auto/upload';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('folder', 'anniversaire/salle-' + currentRoom);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({ url: data.secure_url, publicId: data.public_id, taille: data.bytes });
      } else {
        let detail = '';
        try {
          const errData = JSON.parse(xhr.responseText);
          if (errData && errData.error && errData.error.message) detail = errData.error.message;
        } catch (parseErr) {
          // Réponse non-JSON : on garde le message générique ci-dessous.
        }
        reject(new Error(
          'Envoi impossible (code ' + xhr.status + ')' + (detail ? ' \u2014 ' + detail : '') +
          '. Vérifie le cloud name et le preset dans config.js.'
        ));
      }
    };
    xhr.onerror = () => reject(new Error('Erreur réseau pendant l\u2019envoi. Vérifie ta connexion.'));
    xhr.send(formData);
  });
}

/* ---------- Aperçu plein écran ---------- */

function openLightbox(block) {
  lightboxContent.innerHTML = '';
  if (block.type === 'photo') {
    const img = document.createElement('img');
    img.src = block.url;
    img.alt = block.etiquette || '';
    lightboxContent.appendChild(img);
  } else if (block.type === 'video') {
    const vid = document.createElement('video');
    vid.src = block.url;
    vid.controls = true;
    vid.autoplay = true;
    vid.playsInline = true;
    lightboxContent.appendChild(vid);
  }
  lightbox.classList.add('is-open');
  lightboxScrim.classList.add('is-visible');
}
function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightboxScrim.classList.remove('is-visible');
  lightboxContent.innerHTML = '';
}
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightboxScrim.addEventListener('click', closeLightbox);
      
