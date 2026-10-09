/**
 * Tailwind theme extensions.
 *
 * This is the config for the Tailwind CDN script that `index.html` loads. Vite
 * injects it into the document (see `vite.config.ts`) right after that script,
 * so the CDN reads it while it scans the page - exactly the position the inline
 * config used to have.
 */
export const tailwindConfig = {
  darkMode: 'media',
  theme: {
    extend: {
      keyframes: {
        eqBounce: {
          '0%, 100%': { transform: 'scaleY(0.2)' },
          '50%': { transform: 'scaleY(1)' }
        },
        toastIn: {
          from: { transform: 'translate(-50%, -20px)', opacity: '0' },
          to: { transform: 'translate(-50%, 0)', opacity: '1' }
        }
      },
      animation: {
        'eq-bounce': 'eqBounce 0.9s ease-in-out infinite',
        'toast-in': 'toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }
    }
  }
};