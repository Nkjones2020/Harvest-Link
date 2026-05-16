import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from './config';
import { useAuthStore } from '../store/authStore';

export function useMyListings() {
  const token = useAuthStore(state => state.token);
  
  return useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/listings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch listings');
      return res.json();
    },
    staleTime: 30 * 1000,
    enabled: !!token,
  });
}

export function useMarketplaceListings() {
  const token = useAuthStore(state => state.token);

  return useQuery({
    queryKey: ['marketplace-listings'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/listings/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch marketplace');
      return res.json();
    },
    staleTime: 60 * 1000,
    enabled: !!token,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  const token = useAuthStore(state => state.token);
  
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`${API_BASE_URL}/listings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create listing');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  const token = useAuthStore(state => state.token);
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });
      if (!res.ok) throw new Error('Failed to delete listing');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
    },
  });
}
