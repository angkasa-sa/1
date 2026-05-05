import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/frontend/api/apiService";
import type { ItemCategory } from "@/frontend/shared/data/wms";

export function useItemCategoryOptions(enabled = true) {
    return useQuery({
        queryKey: ["item-categories-options"],
        queryFn: async () => {
            const res = await apiService.get<ItemCategory[]>("/item-categories");
            return res;
        },
        enabled
    });
}
