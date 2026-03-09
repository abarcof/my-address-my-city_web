import { useState, useEffect } from 'react';
import { useAddressStore } from '../../store/address-store';
import { OutOfBoundsNotice } from '../../components/feedback/OutOfBoundsNotice';
import { OfficialLiveContextCard } from '../official-live-context/OfficialLiveContextCard';
import { APP_CONFIG } from '../../config/app-config';
import { buildShareUrl } from '../../utils/url-state';
import { BRIGHT_DATA_ENABLED } from '../../config/feature-flags';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xbdzdgge';

function GetAlertsSection() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const label = useAddressStore((s) => s.label);
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (coordinates) {
      setStatus('idle');
      setIsExpanded(false);
      setEmail('');
    }
  }, [coordinates?.lat, coordinates?.lng]);

  if (!coordinates) return null;

  const selectedCoordinates = coordinates;
  const snapshotUrl = buildShareUrl({
    lat: selectedCoordinates.lat,
    lng: selectedCoordinates.lng,
    tab: 'next-steps',
    label: label || undefined,
  });

  const subject = `Alert request: ${(label || `${selectedCoordinates.lat}, ${selectedCoordinates.lng}`).slice(0, 60)}`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement | null;
    const emailValue = (emailInput?.value ?? email).trim();
    if (!emailValue) return;
    setStatus('submitting');
    const body = new URLSearchParams({
      email: emailValue,
      address: label || '',
      lat: String(selectedCoordinates.lat),
      lng: String(selectedCoordinates.lng),
      snapshot_url: snapshotUrl,
      _subject: subject,
      _replyto: emailValue,
    });
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: body.toString(),
      });

      if (!res.ok) {
        throw new Error(`Formspree returned ${res.status}`);
      }

      await res.json();
      setStatus('success');
      setEmail('');
      setIsExpanded(false);
    } catch {
      setStatus('idle');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-gray-200 bg-green-50 p-4">
        <p className="text-sm text-green-800">
          Thanks! We&apos;ll notify you when alerts are available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900">Get alerts for this location</h3>
      <p className="text-sm text-gray-500 mt-0.5">
        Want future updates about permits, code violations, and city activity near this address? Request alerts.
      </p>
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        >
          Request alerts
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            autoComplete="email"
            disabled={status === 'submitting'}
            className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {status === 'submitting' ? 'Sending…' : 'Request alerts'}
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              disabled={status === 'submitting'}
              className="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function NextSteps() {
  const coordinates = useAddressStore((s) => s.coordinates);
  const isWithinMontgomery = useAddressStore((s) => s.isWithinMontgomery);

  if (!coordinates) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">
          Select a location to see official city resources and next steps.
        </p>
      </div>
    );
  }

  if (!isWithinMontgomery) {
    return (
      <div className="space-y-3">
        <OutOfBoundsNotice />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Use these official city resources to take the next step for this location.
      </p>
      {APP_CONFIG.nextStepsLinks.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noreferrer noopener"
          className="block rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <h3 className="text-sm font-medium text-gray-900">{link.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{link.description}</p>
          <span className="text-xs text-blue-600 mt-1 inline-block">Open official page</span>
        </a>
      ))}
      <GetAlertsSection />
      {BRIGHT_DATA_ENABLED && (
        <div className="pt-2 border-t border-gray-100">
          <OfficialLiveContextCard />
        </div>
      )}
      <p className="text-xs text-gray-400 pt-2">
        This app provides informational content only. It does not replace official city services or decisions.
      </p>
    </div>
  );
}
