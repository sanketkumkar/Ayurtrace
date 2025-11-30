import { Block, TransactionData, EventType, QualityTestEvent } from '../types';

// Simple hash function for simulation
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const createBlock = async (
  previousBlock: Block,
  data: TransactionData
): Promise<Block> => {
  const index = previousBlock.index + 1;
  const timestamp = new Date().toISOString();
  const rawString = `${index}${previousBlock.hash}${timestamp}${JSON.stringify(data)}`;
  const hash = await sha256(rawString);

  return {
    index,
    timestamp,
    data,
    previousHash: previousBlock.hash,
    hash,
    validatorSignature: `SIG_${Math.random().toString(36).substring(7).toUpperCase()}`
  };
};

// Smart Contract: Validation Logic
export const validateTransaction = (data: TransactionData): { valid: boolean; error?: string } => {
  // 1. Sustainability & Geo-fencing Checks (Simulated)
  if (data.resourceType === EventType.COLLECTION) {
    if (data.quantityKg > 500) {
      return { valid: false, error: "SC_ERR: Harvest quantity exceeds sustainable limit for this region." };
    }
    // Simulate Geo-fencing check (e.g. must be within India rough bounds)
    if (data.location.latitude < 8 || data.location.latitude > 37 || data.location.longitude < 68 || data.location.longitude > 97) {
       return { valid: false, error: "SC_ERR: GPS coordinates outside authorized Ayurvedic cultivation zones." };
    }
  }

  // 2. Quality Gate Checks
  if (data.resourceType === EventType.QUALITY_TEST) {
    const test = data as QualityTestEvent;
    if (test.parameters.moistureContent > 12) {
      return { valid: false, error: "SC_ERR: Moisture content > 12%. Batch rejected to prevent fungal growth." };
    }
    if (!test.parameters.dnaVerified) {
      return { valid: false, error: "SC_ERR: DNA Barcoding failed. Authenticity not verified." };
    }
  }

  return { valid: true };
};
