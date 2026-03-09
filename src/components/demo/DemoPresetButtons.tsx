import { DEMO_PRESETS, DEMO_PRESETS_ENABLED } from '../../content/demo-presets';
import { useAddressStore } from '../../store/address-store';

export function DemoPresetButtons() {
  const setLocation = useAddressStore((s) => s.setLocation);

  if (!DEMO_PRESETS_ENABLED) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-3 sm:px-4 py-1.5 bg-gray-50 border-b border-gray-200">
      <span className="text-xs text-gray-500 self-center mr-1">Demo:</span>
      {DEMO_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => setLocation({ lat: preset.lat, lng: preset.lng }, preset.description)}
          className="text-xs px-2 py-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={preset.description}
          aria-label={`Demo preset: ${preset.label}`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
