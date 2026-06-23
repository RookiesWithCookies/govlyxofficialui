import { useQuery } from "@tanstack/react-query";
import { billingApi } from "../api/billing";

/**
 * Hook to retrieve and cache the authenticated user's billing/subscription tier information.
 */
export const useMyBilling = () => {
  return useQuery({
    queryKey: ["myBilling"],
    queryFn: billingApi.getMyBilling,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
