import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:3001/api'; // In real app, use env var

export function useMyListings() {
  return useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/listings`);
      if (!res.ok) throw new Error('Failed to fetch listings');
      return res.json();
    },
    staleTime: 30 * 1000,
  });
}

export function useMarketplaceListings() {
  return useQuery({
    queryKey: ['marketplace-listings'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/listings/all`);
      if (!res.ok) throw new Error('Failed to fetch marketplace');
      return res.json();
    },
    staleTime: 60 * 1000,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`${API_BASE_URL}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
