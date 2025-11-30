// Blockchain & Data Types

export enum UserRole {
  FARMER = 'FARMER',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',
  PROCESSOR = 'PROCESSOR',
  CONSUMER = 'CONSUMER',
  ADMIN = 'ADMIN'
}

export enum EventType {
  COLLECTION = 'CollectionEvent',
  QUALITY_TEST = 'QualityTest',
  PROCESSING = 'ProcessingStep',
  FORMULATION = 'Formulation'
}

// FHIR-like resource structure
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface Actor {
  id: string;
  name: string;
  role: UserRole;
}

export interface BaseEvent {
  resourceType: EventType;
  id: string;
  timestamp: string; // ISO string
  actor: Actor;
}

export interface CollectionEvent extends BaseEvent {
  resourceType: EventType.COLLECTION;
  species: string;
  partUsed: string; // e.g., Root, Leaf
  quantityKg: number;
  location: GeoLocation;
  method: 'WildCrafted' | 'Cultivated';
}

export interface QualityTestEvent extends BaseEvent {
  resourceType: EventType.QUALITY_TEST;
  batchId: string; // Links to Collection ID
  labName: string;
  parameters: {
    moistureContent: number; // Percentage
    pesticidesDetected: boolean;
    heavyMetalsPassed: boolean;
    dnaVerified: boolean;
  };
  result: 'PASS' | 'FAIL';
}

export interface ProcessingEvent extends BaseEvent {
  resourceType: EventType.PROCESSING;
  batchId: string;
  processType: 'Drying' | 'Grinding' | 'Extraction' | 'Packaging';
  facilityLocation: string;
  temperature?: number;
}

export type TransactionData = CollectionEvent | QualityTestEvent | ProcessingEvent;

export interface Block {
  index: number;
  timestamp: string;
  data: TransactionData;
  previousHash: string;
  hash: string;
  validatorSignature: string; // Simulated signature
}

export interface ChainState {
  chain: Block[];
  pendingTransactions: TransactionData[];
}
