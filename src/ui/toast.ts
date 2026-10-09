export function showToast(message: string): void {
  const toast = document.createElement('div');
  toast.className =
    'animate-toast-in fixed left-1/2 top-5 z-[100] -translate-x-1/2 rounded-full bg-slate-900 px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2)] dark:bg-white dark:text-zinc-950';
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2800);
}