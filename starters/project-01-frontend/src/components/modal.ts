/**
 * Simple modal using <dialog>. Use for confirmations, forms, or details.
 * Open with modal.showModal(), close with modal.close() or close button.
 */

export function createModal(options: {
  title: string;
  body: string | HTMLElement;
  onClose?: () => void;
}): HTMLDialogElement {
  const dialog = document.createElement('dialog');
  dialog.classList.add(
    'relative',
    'rounded-lg',
    'p-6',
    'shadow-xl',
    'backdrop:bg-black/50',
    'max-w-md',
    'w-full'
  );

  const titleEl = document.createElement('h2');
  titleEl.className = 'text-xl font-semibold mb-4';
  titleEl.textContent = options.title;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'absolute top-4 right-4 text-gray-500 hover:text-gray-700';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', () => {
    dialog.close();
    options.onClose?.();
  });

  dialog.appendChild(titleEl);
  dialog.appendChild(closeBtn);
  if (typeof options.body === 'string') {
    const p = document.createElement('p');
    p.textContent = options.body;
    dialog.appendChild(p);
  } else {
    dialog.appendChild(options.body);
  }

  return dialog;
}
