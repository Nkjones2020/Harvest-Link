import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from './config';
import { useAuthStore } from '../store/authStore';

function useAuthHeaders() {
  const token = useAuthStore(state => state.token);
  return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}

/** Farmer: get all incoming offers on their listings */
export function useIncomingOffers() {
  const headers = useAuthHeaders();
  return useQuery({
    queryKey: ['incoming-offers'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/offers/incoming`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 15_000,
  });
}

/** Buyer: get status of their own offers */
export function useMyOffers() {
  const headers = useAuthHeaders();
  return useQuery({
    queryKey: ['my-offers'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/offers/my`, { headers });
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 15_000,
  });
}

/** Farmer: accept or decline an offer */
export function useRespondToOffer() {
  const headers = useAuthHeaders();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ offerId, status }: { offerId: string; status: 'accepted' | 'declined' }) => {
      const res = await fetch(`${API_BASE_URL}/offers/${offerId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to respond to offer');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incoming-offers'] });
      qc.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

/** Buyer: submit an offer on a listing */
export function useSubmitOffer() {
  const headers = useAuthHeaders();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { listing_id: string; quantity_kg: number; max_price: number }) => {
      const res = await fetch(`${API_BASE_URL}/offers`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit offer');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-offers'] }),
  });
}
