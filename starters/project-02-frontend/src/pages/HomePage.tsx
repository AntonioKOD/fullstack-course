import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL ?? '';

function fetchHealth() {
  return fetch(`${API_URL}/health`).then((res) => {
    if (!res.ok) throw new Error(String(res.status));
    return res.json() as Promise<{ ok: boolean; message: string }>;
  });
}

export function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    enabled: !!API_URL,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Project 02 — Full-Stack App</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Add routes, TanStack Query hooks, and Zustand stores. Connect to your API.
      </p>
      {API_URL && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
          {isLoading && <p>Checking API…</p>}
          {error && <p className="text-red-600">API error: {String(error)}</p>}
          {data && <p className="text-green-600">API: {data.message}</p>}
        </div>
      )}
    </div>
  );
}
