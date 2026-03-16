/**
 * Example protected route. Use auth store (Zustand) to check token and redirect if not logged in.
 */
export function ProtectedExample() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Protected route</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Add a Zustand auth store and guard this route. Redirect to /login when not authenticated.
      </p>
    </div>
  );
}
