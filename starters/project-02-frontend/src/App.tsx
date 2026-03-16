import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProtectedExample } from './pages/ProtectedExample';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <nav className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex gap-4">
            <Link to="/" className="text-primary hover:underline">Home</Link>
            <Link to="/protected" className="text-primary hover:underline">Protected (example)</Link>
          </div>
        </nav>
        <main className="p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/protected" element={<ProtectedExample />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
