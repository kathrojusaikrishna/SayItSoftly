export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Something went wrong.");
  return result;
}