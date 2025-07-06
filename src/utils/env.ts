export const POCKETBASE_URL = import.meta.env.DEV
  ? "http://localhost:8090"
  : (import.meta.env.VITE_POCKETBASE_URL ?? "/");
