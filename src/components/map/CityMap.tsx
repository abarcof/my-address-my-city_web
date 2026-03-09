import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useAddressStore } from '../../store/address-store';
import { useClosest } from '../../features/closest/use-closest';
import { useEffect } from 'react';
import { reverseGeocode } from '../../services/search/geocode';
import { MONTGOMERY_BOUNDS } from '../../utils/boundary';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MONTGOMERY_CENTER: [number, number] = [32.3668, -86.3];
const DEFAULT_ZOOM = 12;
const MAX_BOUNDS = L.latLngBounds(
  MONTGOMERY_BOUNDS.southWest as [number, number],
  MONTGOMERY_BOUNDS.northEast as [number, number],
);

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const resourceIcon = L.divIcon({
  className: 'resource-marker',
  html: '<div style="background:#16a34a;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

function ClickHandler() {
  const setLocation = useAddressStore((s) => s.setLocation);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const coords = { lat, lng };
      setLocation(coords, `${lat.toFixed(5)}, ${lng.toFixed(5)}`);

      reverseGeocode(coords).then((label) => {
        setLocation(coords, label);
      });
    },
  });

  return null;
}

function FlyToSelected() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.flyTo([coordinates.lat, coordinates.lng], 15, { duration: 0.8 });
    }
  }, [coordinates, map]);

  return null;
}

export function CityMap() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const { data } = useClosest();
  const closestItems = data?.categories?.filter((c) => c.item) ?? [];

  return (
    <MapContainer
      center={MONTGOMERY_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
      zoomControl={true}
      maxBounds={MAX_BOUNDS}
      maxBoundsViscosity={0.5}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler />
      <FlyToSelected />
      {coordinates && (
        <Marker
          position={[coordinates.lat, coordinates.lng]}
          icon={defaultIcon}
        />
      )}
      {closestItems.map((c) =>
        c.item ? (
          <Marker
            key={c.item.id}
            position={[c.item.lat, c.item.lng]}
            icon={resourceIcon}
            title={c.item.name}
          />
        ) : null
      )}
    </MapContainer>
  );
}
