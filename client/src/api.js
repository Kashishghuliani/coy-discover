async function request(url, options) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Request failed (${res.status})`);
  return res.json();
}
export const getFeed = () => request("/api/feed");
export const swipe = (profileId, action) => request("/api/swipe", { method: "POST", body: JSON.stringify({ profileId, action }) });
export const getMatches = () => request("/api/matches");
export const resetDemo = () => request("/api/reset", { method: "POST" });
