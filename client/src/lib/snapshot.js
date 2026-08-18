const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;

export const SNAPSHOT_URL = `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/portfolio/snapshot.json`;

// Fetches the static snapshot instantly (CDN, no backend cold start).
// Returns null on failure so callers can just fall back to the live API.
export const fetchSnapshot = async () => {
  try {
    const res = await fetch(`${SNAPSHOT_URL}?t=${Date.now()}`); // bypass browser cache only
    if (!res.ok) throw new Error("Snapshot not available");
    return await res.json();
  } catch (error) {
    console.warn("Snapshot fetch failed, will rely on live API:", error.message);
    return null;
  }
};
