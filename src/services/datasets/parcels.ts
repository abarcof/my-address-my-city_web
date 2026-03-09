import { queryByPoint } from '../api/arcgis-client';
import type { Coordinates } from '../../types/address';
import type { ParcelResult } from '../../types/snapshot';

const SERVICE_PATH = 'Parcels/FeatureServer/0';

const OUT_FIELDS =
  'ParcelNo,PID,OwnerName,PropertyAddr1,PropertyCity,PropertyState,PropertyZip,TotalValue,Calc_Acre,AssessmentClass';

function trim(s: unknown): string {
  return typeof s === 'string' ? s.trim() : '';
}

function formatPropertyAddress(addr: string, city: string, state: string, zip: string): string {
  const parts = [addr, city, state, zip].filter(Boolean).map((s) => s.trim());
  return parts.join(', ');
}

export async function fetchParcel(
  coordinates: Coordinates,
): Promise<ParcelResult | null> {
  const feature = await queryByPoint({
    servicePath: SERVICE_PATH,
    coordinates,
    outFields: OUT_FIELDS,
  });

  if (!feature) return null;

  const {
    ParcelNo,
    PID,
    OwnerName,
    PropertyAddr1,
    PropertyCity,
    PropertyState,
    PropertyZip,
    TotalValue,
    Calc_Acre,
  } = feature.attributes;

  const parcelId =
    typeof ParcelNo === 'string' && ParcelNo.trim()
      ? ParcelNo.trim()
      : typeof PID === 'number' || typeof PID === 'string'
        ? String(PID).trim()
        : null;

  if (!parcelId) return null;

  const owner = trim(OwnerName);
  const addr1 = trim(PropertyAddr1);
  const city = trim(PropertyCity);
  const state = trim(PropertyState);
  const zip = trim(PropertyZip);
  const propertyAddress =
    addr1 || city || state || zip
      ? formatPropertyAddress(addr1, city, state, zip)
      : undefined;

  const assessedValue =
    typeof TotalValue === 'number' && TotalValue >= 0 ? TotalValue : undefined;
  const landAcres =
    typeof Calc_Acre === 'number' && Calc_Acre > 0 ? Calc_Acre : undefined;
  const ac = typeof AssessmentClass === 'string'
    ? AssessmentClass.trim().charAt(0)
    : '';
  const propertyType = ac && PROPERTY_TYPES[ac] ? PROPERTY_TYPES[ac] : undefined;

  return {
    parcelId,
    ...(owner && { owner }),
    ...(propertyAddress && { propertyAddress }),
    ...(propertyType && { propertyType }),
    ...(assessedValue !== undefined && { assessedValue }),
    ...(landAcres !== undefined && { landAcres }),
  };
}
