
export const CTGROUP_OFFICE_LAT = 10.8332697;
export const CTGROUP_OFFICE_LON = 106.7794546;

export function ctgroupOfficeOsmEmbedSrc(): string {
  const lat = CTGROUP_OFFICE_LAT;
  const lon = CTGROUP_OFFICE_LON;
  const bbox = `${lon - 0.008},${lat - 0.006},${lon + 0.008},${lat + 0.006}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`;
}

export const CTGROUP_GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${CTGROUP_OFFICE_LAT},${CTGROUP_OFFICE_LON}`;
