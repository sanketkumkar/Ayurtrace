import React, { useState } from 'react';
import { MapPin, Loader, Sprout, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { UserRole, EventType, CollectionEvent } from '../types';
import { SPECIES_LIST } from '../constants';
import QRCodeGenerator from './QRCodeGenerator';

interface CollectionFormProps {
  user: { id: string; name: string; role: UserRole };
  onSubmit: (data: CollectionEvent) => void;
  isLoading: boolean;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ user, onSubmit, isLoading }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [species, setSpecies] = useState(SPECIES_LIST[0]);
  const [quantity, setQuantity] = useState(100);
  const [method, setMethod] = useState<'WildCrafted' | 'Cultivated'>('Cultivated');
  
  // New state for success view
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleGetLocation = () => {
    setLocLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocLoading(false);
        },
        (error) => {
          console.error("Error getting location", error);
          // Fallback for demo if permission denied/localhost issues
          setLocation({ lat: 23.4733, lng: 77.9479 }); // Example: Sanchi, India
          setLocLoading(false);
        }
      );
    } else {
      setLocLoading(false);
      alert("Geolocation not supported");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    const newId = `COL-${Date.now()}`;
    const eventData: CollectionEvent = {
      resourceType: EventType.COLLECTION,
      id: newId,
      timestamp: new Date().toISOString(),
      actor: user,
      species,
      partUsed: 'Root',
      quantityKg: quantity,
      location: { latitude: location.lat, longitude: location.lng },
      method
    };

    onSubmit(eventData);
    setSubmittedId(newId);
  };

  const resetForm = () => {
    setSubmittedId(null);
    setQuantity(100);
    // Keep location as farmer likely stays in one place
  };

  // Success View with QR Code
  if (submittedId && !isLoading) {
      return (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-stone-200 text-center animate-fade-in">
              <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-4 rounded-full">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">Harvest Recorded Successfully!</h2>
              <p className="text-stone-500 mb-8">The batch has been hashed to the blockchain ledger.</p>
              
              <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 mb-8 inline-block">
                  <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Batch Identification Label</h3>
                  <QRCodeGenerator data={submittedId} size={180} />
              </div>

              <div>
                  <button 
                    onClick={resetForm}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-medium flex items-center mx-auto"
                  >
                      <Plus className="w-5 h-5 mr-2" /> Record Another Harvest
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-stone-200">
      <div className="flex items-center mb-6">
        <div className="bg-emerald-100 p-3 rounded-full mr-4">
          <Sprout className="h-8 w-8 text-emerald-700" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-800">New Collection Event</h2>
          <p className="text-stone-500">Record a new harvest on the blockchain.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Botanical Species</label>
          <select 
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full border-stone-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-3 border"
          >
            {SPECIES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Quantity (Kg)</label>
                <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full border-stone-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-3 border"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Method</label>
                <select 
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full border-stone-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-3 border"
                >
                    <option value="Cultivated">Cultivated</option>
                    <option value="WildCrafted">Wild Crafted</option>
                </select>
            </div>
        </div>

        <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-stone-700">Geo-Tagging</label>
            <button 
              type="button" 
              onClick={handleGetLocation}
              className="text-emerald-700 text-sm font-medium flex items-center hover:text-emerald-900"
            >
              {locLoading ? <Loader className="animate-spin h-4 w-4 mr-1"/> : <MapPin className="h-4 w-4 mr-1"/>}
              {location ? 'Update Location' : 'Get GPS Coordinates'}
            </button>
          </div>
          {location ? (
            <div className="text-sm text-stone-600 font-mono bg-white p-2 rounded border border-stone-100">
              Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
            </div>
          ) : (
            <div className="text-sm text-amber-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1"/> Location is required for Smart Contract validation.
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={!location || isLoading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
            ${!location || isLoading ? 'bg-stone-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800'}`}
        >
          {isLoading ? 'Hashing to Ledger...' : 'Securely Record Harvest'}
        </button>
      </form>
    </div>
  );
};

export default CollectionForm;