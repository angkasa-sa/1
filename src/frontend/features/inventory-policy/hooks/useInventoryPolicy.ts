import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/frontend/api/apiService";
import type { InventoryPolicy } from "@/frontend/shared/data/wms";

export function useInventoryPolicy() {
	return useQuery({
		queryKey: ["inventory-policy"],
		queryFn: () => apiService.get<InventoryPolicy>("/inventory-policy"),
	});
}

export function useSaveInventoryPolicy() {
    const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: Pick<InventoryPolicy, "lowStockMode" | "lowStockThreshold">) =>
			apiService.put<InventoryPolicy>("/inventory-policy", payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory-policy"] });
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
        }
	});
}
