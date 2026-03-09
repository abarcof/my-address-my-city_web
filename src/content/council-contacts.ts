/**
 * Montgomery City Council district contact info.
 * Source: Montgomery City Council Official Directory 2026.
 * montgomeryal.gov/government/city-government/city-council
 * General council: (334) 625-2096
 */

export interface CouncilContact {
  district: string;
  name: string;
  phone?: string;
  email?: string;
}

export const COUNCIL_CONTACTS: CouncilContact[] = [
  { district: '1', name: 'Ed Grimes', phone: '334-544-0248', email: 'egrimes@montgomeryal.gov' },
  { district: '2', name: 'Julie Turner Beard', phone: '334-868-7196', email: 'jbeard@montgomeryal.gov' },
  { district: '3', name: 'Marche Johnson', phone: '334-721-6003', email: 'mtjohnson@montgomeryal.gov' },
  { district: '4', name: 'Franetta Delayne Riley', phone: '334-414-5305', email: 'friley@montgomeryal.gov' },
  { district: '5', name: 'Cornelius "CC" Calhoun', phone: '334-399-3360', email: 'cccalhoun@montgomeryal.gov' },
  { district: '6', name: 'Oronde K. Mitchell', phone: '334-221-5975', email: 'omitchell@montgomeryal.gov' },
  { district: '7', name: 'Andrew Szymanski', phone: '334-209-4757', email: 'aszymanski@montgomeryal.gov' },
  { district: '8', name: 'Glen O. Pruitt, Jr.', phone: '334-300-3611', email: 'gpruitt@montgomeryal.gov' },
  { district: '9', name: 'Charles W. Jinright', phone: '334-625-2097', email: 'cjinright@montgomeryal.gov' },
];

export const COUNCIL_GENERAL_PHONE = '334-625-2096';

export function getCouncilContact(district: string): CouncilContact | undefined {
  const num = String(district).replace(/\D/g, '');
  return COUNCIL_CONTACTS.find((c) => c.district === num);
}
