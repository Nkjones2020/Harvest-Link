import { create } from 'zustand';

interface Listing {
  id: string;
  crop_type: string;
  quantity_kg: number;
  harvest_date: string;
  storage_method: string;
  spoilage_days: number;
  spoilage_risk: 'green' | 'amber' | 'red';
  spoilage_score: number;
  status: string;
}

interface PendingListing {
  local_id: string;
  cropType: string;
  quantityKg: number;
  harvestDate: string;
  storageMethod: string;
  latitude: number;
  longitude: number;
}

interface FarmerStore {
  listings: Listing[];
  pendingSync: PendingListing[];
  setListings: (listings: Listing[]) => void;
  addPendingListing: (listing: PendingListing) => void;
  syncPending: () => Promise<void>;
}

export const useFarmerStore = create<FarmerStore>((set, get) => ({
  listings: [],
  pendingSync: [],
  setListings: (listings) => set({ listings }),
  addPendingListing: (listing) => {
    // For immediate feedback in demo, we map the pending to a full Listing object
    const optimisticListing: Listing = {
      id: listing.local_id,
      crop_type: listing.cropType,
      quantity_kg: listing.quantityKg,
      harvest_date: listing.harvestDate,
      storage_method: listing.storageMethod,
      spoilage_days: 14, // Placeholder until sync
      spoilage_risk: 'green', // Placeholder until sync
      spoilage_score: 100, // Placeholder
      status: 'pending',
    };

    set((state) => ({ 
      pendingSync: [...state.pendingSync, listing],
      listings: [optimisticListing, ...state.listings]
    }));
  },
  syncPending: async () => {
    const pending = get().pendingSync;
    if (pending.length === 0) return;

    // This would call the API
    console.log('Syncing pending listings...', pending);
    
    // Reset after "sync"
    set({ pendingSync: [] });
  },
}));
