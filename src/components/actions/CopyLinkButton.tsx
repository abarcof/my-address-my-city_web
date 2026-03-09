import { useState } from 'react';
import { useAddressStore } from '../../store/address-store';
import { buildShareUrl } from '../../utils/url-state';

export function CopyLinkButton() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const label = useAddressStore((s) => s.label);
  const activeTab = useAddressStore((s) => s.activeTab);
  const [copied, setCopied] = useState(false);

  const disabled = coordinates == null;

  async function handleCopy() {
    if (!coordinates) return;
    const url = buildShareUrl({
      lat: coordinates.lat,
      lng: coordinates.lng,
      tab: activeTab,
      label: label || undefined,
    });
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (disabled) return null;

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-xs text-gray-600 hover:text-blue-600 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      aria-label="Copy link to this location"
      title="Copy link to share this location"
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  );
}
