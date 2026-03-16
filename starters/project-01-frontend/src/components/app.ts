import { createModal } from './modal';

export function renderApp(root: HTMLElement): void {
  root.innerHTML = '';
  root.className = 'min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6';

  const heading = document.createElement('h1');
  heading.className = 'text-2xl font-bold mb-4';
  heading.textContent = 'Project 01 — Front-End Application';

  const sub = document.createElement('p');
  sub.className = 'text-gray-600 dark:text-gray-400 mb-6';
  sub.textContent = 'Replace this with your app. Add APIs in src/api/, components in src/components/, and use src/utils/storage.ts for localStorage.';

  const openModalBtn = document.createElement('button');
  openModalBtn.type = 'button';
  openModalBtn.className = 'px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90';
  openModalBtn.textContent = 'Open example modal';
  const modal = createModal({
    title: 'Example modal',
    body: 'Build your custom modals here. Use <dialog> or a positioned div.',
  });
  document.body.appendChild(modal);
  openModalBtn.addEventListener('click', () => modal.showModal());

  root.appendChild(heading);
  root.appendChild(sub);
  root.appendChild(openModalBtn);
}
