import { UserRole, Block, EventType, CollectionEvent } from './types';

export const INITIAL_GENESIS_BLOCK: Block = {
  index: 0,
  timestamp: new Date().toISOString(),
  data: {
    resourceType: EventType.COLLECTION,
    id: "GENESIS",
    timestamp: new Date().toISOString(),
    actor: { id: "000", name: "System", role: UserRole.ADMIN },
    species: "Ayurveda Protocol Init",
    partUsed: "N/A",
    quantityKg: 0,
    location: { latitude: 0, longitude: 0 },
    method: 'Cultivated'
  } as CollectionEvent,
  previousHash: "0",
  hash: "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
  validatorSignature: "SYSTEM_INIT"
};

export const MOCK_USERS = [
  { id: 'u1', name: 'Ramesh Gupta', role: UserRole.FARMER, location: 'Madhya Pradesh' },
  { id: 'u2', name: 'Dr. Priya Singh', role: UserRole.LAB_TECHNICIAN, location: 'AyurLab Delhi' },
  { id: 'u3', name: 'PureGreens Processing', role: UserRole.PROCESSOR, location: 'Pune' },
  { id: 'u4', name: 'Anjali (Customer)', role: UserRole.CONSUMER, location: 'Mumbai' },
];

export const SPECIES_LIST = [
  "Withania somnifera (Ashwagandha)",
  "Ocimum sanctum (Tulsi)",
  "Curcuma longa (Turmeric)",
  "Emblica officinalis (Amla)",
  "Bacopa monnieri (Brahmi)"
];
