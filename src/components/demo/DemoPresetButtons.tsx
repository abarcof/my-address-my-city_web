import { DEMO_PRESETS, DEMO_PRESETS_ENABLED } from '../../content/demo-presets';
import { useAddressStore } from '../../store/address-store';

const PRESET_ICONS: Record<string, string> = {
  downtown: '🏛️',
  residential: '🏡',
  outside: '📍',
};

export function DemoPresetButtons() {
  const setLocation = useAddressStore((s) => s.setLocation);
  const coordinates = useAddressStore((s) => s.coordinates);

  if (!DEMO_PRESETS_ENABLED) return null;

  function isActive(lat: number, lng: number): boolean {
    if (!coordinates) return false;
    return Math.abs(coordinates.lat - lat) < 1e-4 && Math.abs(coordinates.lng - lng) < 1e-4;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
        <span aria-hidden>▶</span> Try a demo location
      </span>
      {DEMO_PRESETS.map((preset) => {
        const active = isActive(preset.lat, preset.lng);
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => setLocation({ lat: preset.lat, lng: preset.lng }, preset.description)}
            className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
              active
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-700 hover:shadow-sm'
            }`}
            title={preset.description}
            aria-label={`Demo preset: ${preset.label}`}
            aria-pressed={active}
          >
            <span aria-hidden>{PRESET_ICONS[preset.id] ?? '📍'}</span>
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}
