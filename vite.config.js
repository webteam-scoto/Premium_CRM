import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
base: '/Premier_crm/public/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})