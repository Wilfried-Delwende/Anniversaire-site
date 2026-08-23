import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT : "base" doit correspondre EXACTEMENT au nom de ton dépôt
// GitHub, entre slashs. Comme ton adresse est
// https://wilfried-delwende.github.io/Anniversaire-site/
// alors le nom du dépôt est "Anniversaire-site" (respecte la majuscule).
// Si un jour tu renommes le dépôt, il faut aussi changer cette ligne.
export default defineConfig({
  base: '/Anniversaire-site/',
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
});
