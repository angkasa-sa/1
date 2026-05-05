import type { ItemCategory, ItemCategoryPayload } from "@/frontend/shared/data/wms";
import { useSaveResource } from "@/frontend/shared/hooks/useSaveResource";

interface UseSaveItemCategoryParams {
	category?: ItemCategory;
	onError: (message: string) => void;
	onSaved: () => void;
}

export function useSaveItemCategory({ category, onError, onSaved }: UseSaveItemCategoryParams) {
	return useSaveResource<ItemCategory, ItemCategoryPayload>({
		endpoint: "/item-categories",
		entity: category,
		failureMessage: "Failed to save category.",
		onError,
		onSaved,
	});
}
