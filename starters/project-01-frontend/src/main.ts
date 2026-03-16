import './style.css';
import { renderApp } from './components/app';

const root = document.getElementById('app');
if (root) {
  renderApp(root);
}
