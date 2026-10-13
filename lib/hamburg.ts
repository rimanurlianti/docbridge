export type Specialty = 'GP' | 'Dermatology' | 'ENT' | 'Gynaecology' | 'Eye care';
export type Insurance = 'Statutory' | 'Private' | 'Unknown';
export type NewPatients = 'Yes' | 'No' | 'Unknown';
export type Practice = {
  id: string;
  name: string;
  district: string;
  specialty: Specialty;
  german: string;
  insurance: Insurance;
  newPatients: NewPatients;
  english: boolean | null;
  nearby: string;
};
export const practices: Practice[] = [
  {
    id: 'altona-gp',
    name: 'Hausarztpraxis am Bahnhof',
    district: 'Altona',
    specialty: 'GP',
    german: 'Allgemeinmedizin',
    insurance: 'Statutory',
    newPatients: 'Yes',
    english: true,
    nearby: 'Altona station',
  },
  {
    id: 'eimsbuettel-gp',
    name: 'Gemeinschaftspraxis Eimsbüttel',
    district: 'Eimsbüttel',
    specialty: 'GP',
    german: 'Allgemeinmedizin',
    insurance: 'Statutory',
    newPatients: 'Unknown',
    english: true,
    nearby: 'Osterstraße',
  },
  {
    id: 'mitte-skin',
    name: 'Hautpraxis an der Binnenalster',
    district: 'Hamburg-Mitte',
    specialty: 'Dermatology',
    german: 'Haut- und Geschlechtskrankheiten',
    insurance: 'Statutory',
    newPatients: 'Unknown',
    english: true,
    nearby: 'Jungfernstieg',
  },
  {
    id: 'nord-ent',
    name: 'HNO-Praxis Winterhude',
    district: 'Hamburg-Nord',
    specialty: 'ENT',
    german: 'Hals-Nasen-Ohrenheilkunde',
    insurance: 'Private',
    newPatients: 'Yes',
    english: true,
    nearby: 'Borgweg',
  },
  {
    id: 'wandsbek-gyn',
    name: 'Frauenarztpraxis Wandsbek',
    district: 'Wandsbek',
    specialty: 'Gynaecology',
    german: 'Frauenheilkunde',
    insurance: 'Statutory',
    newPatients: 'No',
    english: null,
    nearby: 'Wandsbek Markt',
  },
  {
    id: 'harburg-eye',
    name: 'Augenärztliche Gemeinschaftspraxis Harburg',
    district: 'Harburg',
    specialty: 'Eye care',
    german: 'Augenheilkunde',
    insurance: 'Unknown',
    newPatients: 'Yes',
    english: null,
    nearby: 'Harburg Rathaus',
  },
];
export const specialties: Specialty[] = ['GP', 'Dermatology', 'ENT', 'Gynaecology', 'Eye care'];
export const districts = [
  'All Hamburg',
  'Altona',
  'Eimsbüttel',
  'Hamburg-Mitte',
  'Hamburg-Nord',
  'Wandsbek',
  'Harburg',
  'Bergedorf',
];
export const resources = {
  directory: 'https://www.kvhh.net/de/physicianfinder.html',
  appointments: 'https://www.116117-termine.de/',
  referral: 'https://www.kvhh.net/de/patienten/terminservicestelle.html',
  english: 'https://www.116117.de/de/englisch.php',
  onCall: 'https://www.116117.de/de/praxen-finden.php',
};
export function getPractice(id?: string | string[]) {
  return practices.find((p) => p.id === id);
}
export function referralGuidance(specialty: Specialty) {
  return specialty === 'GP' || specialty === 'Eye care' || specialty === 'Gynaecology'
    ? 'For 116117 appointment booking, this route does not require a referral. Ask the practice about requirements for your specific visit.'
    : 'For 116117 specialist booking, you need a referral with a Vermittlungscode (appointment code). Direct practice booking has different rules: ask the practice first.';
}
