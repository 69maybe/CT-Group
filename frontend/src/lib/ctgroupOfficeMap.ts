/**
 * Trụ sở CT GROUP — Tòa Léman, 20 Trương Định, Q.3, TP.HCM.
 * Dùng OSM embed thay vì Google `embed?pb=` (dễ Invalid pb, Embed API cần API key).
 */
export const CTGROUP_OFFICE_LAT = 10.777862;
export const CTGROUP_OFFICE_LON = 106.687359;

export function ctgroupOfficeOsmEmbedSrc(): string {
  const lat = CTGROUP_OFFICE_LAT;
  const lon = CTGROUP_OFFICE_LON;
  const bbox = `${lon - 0.008},${lat - 0.006},${lon + 0.008},${lat + 0.006}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`;
}

export const CTGROUP_GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${CTGROUP_OFFICE_LAT},${CTGROUP_OFFICE_LON}`;
