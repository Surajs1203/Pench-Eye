import L from 'leaflet';

// Leaflet's default icon URLs break under bundlers; point them at the CDN copies.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const SATELLITE_TILES =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
export const SATELLITE_ATTRIBUTION =
  'Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community';

// Transparent OSM labels/roads/places over satellite imagery. This layer is
// what makes real villages, hotels, gates, roads and nearby services visible.
export const PLACES_TILES =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png';
export const PLACES_ATTRIBUTION = '&copy; OpenStreetMap contributors &copy; CARTO';

export const MARKER_COLORS: Record<string, string> = {
  active: '#22c55e',
  recent_detection: '#f97316',
  warning: '#eab308',
  offline: '#ef4444',
  maintenance: '#38bdf8',
};

export const MARKER_LABELS: Record<string, string> = {
  active: 'Active',
  recent_detection: 'Detection <24 h',
  warning: 'Warning',
  offline: 'Offline',
  maintenance: 'Maintenance',
};

/** Camera marker: coloured ring, pulsing when a detection is fresh. */
export function cameraIcon(state: string): L.DivIcon {
  const color = MARKER_COLORS[state] ?? MARKER_COLORS.active;
  const pulse = state === 'recent_detection';
  return L.divIcon({
    className: 'pench-marker',
    html: `<span class="pench-camera-dot${pulse ? ' pench-pulse' : ''}" style="--marker-color:${color}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

/** Sighting marker: diamond for tigers, small dot for other wildlife. */
export function sightingIcon(isTiger: boolean, highlighted = false): L.DivIcon {
  const color = isTiger ? '#f59e0b' : '#94a3b8';
  const size = isTiger ? 14 : 10;
  return L.divIcon({
    className: 'pench-marker',
    html: `<span class="pench-sighting${isTiger ? ' pench-sighting-tiger' : ''}${
      highlighted ? ' pench-sighting-active' : ''
    }" style="--marker-color:${color};width:${size}px;height:${size}px"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export function gateIcon(): L.DivIcon {
  return L.divIcon({
    className: 'pench-marker',
    html: '<span class="pench-gate"></span>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6],
  });
}

/** GeoJSON polygons use [lon, lat]; Leaflet wants [lat, lon]. */
export function geometryToLatLngs(
  geometry: { type: string; coordinates: number[][][] } | null
): [number, number][][] {
  if (!geometry || geometry.type !== 'Polygon') return [];
  return geometry.coordinates.map((ring) =>
    ring.map(([lon, lat]) => [lat, lon] as [number, number])
  );
}
