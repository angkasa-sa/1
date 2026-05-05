import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/frontend/api/apiService";
import type { Warehouse, Item } from "@/frontend/shared/data/wms";

export function useInventoryOptions(enabled = true) {
    const warehousesQuery = useQuery({
        queryKey: ["warehouses-options"],
        queryFn: () => apiService.get<{ data: Warehouse[] }>("/warehouses?page=1&limit=100&sort=code&order=ASC"),
        enabled
    });

    const itemsQuery = useQuery({
        queryKey: ["items-options"],
        queryFn: () => apiService.get<{ data: Item[] }>("/items?page=1&limit=100&sort=sku&order=ASC"),
        enabled
    });

    return {
        warehouses: warehousesQuery.data?.data || [],
        items: itemsQuery.data?.data || [],
        loading: warehousesQuery.isLoading || itemsQuery.isLoading,
        error: warehousesQuery.error || itemsQuery.error
    };
}
