import { Pencil, Plus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectCombobox from "@/frontend/shared/components/forms/SelectCombobox";
import type { Inventory, InventoryPayload } from "@/frontend/shared/data/wms";
import { useSaveInventory } from "../hooks/useSaveInventory";
import { useInventoryOptions } from "../hooks/useInventoryOptions";

interface InventoryEditorDialogProps {
	inventory?: Inventory;
	onSaved: () => void;
}

export default function InventoryEditorDialog({ inventory, onSaved }: InventoryEditorDialogProps) {
	const [open, setOpen] = useState(false);
	const { warehouses, items, loading } = useInventoryOptions(open);
	const [form, setForm] = useState<InventoryPayload>(() => ({
		warehouseId: inventory?.warehouseId || "",
		itemId: inventory?.itemId || "",
		quantityOnHand: inventory?.quantityOnHand || 0,
		reorderPoint: inventory?.reorderPoint || 0,
	}));
	const [error, setError] = useState<string | null>(null);
	const isEditing = Boolean(inventory);
	const saveMutation = useSaveInventory({
		inventory,
		onError: setError,
		onSaved: () => {
			setOpen(false);
			onSaved();
		},
	});
	const isSaving = saveMutation.isPending;
	const title = isEditing ? "Edit inventory" : "Add inventory";
	const description = isEditing ? "Update inventory row." : "Add a new item to a warehouse.";
	const submitText = isSaving ? "Saving..." : "Save";
	const trigger = isEditing ? (
		<Button type="button" variant="ghost" size="icon-sm" aria-label={`Edit ${inventory?.warehouseCode} ${inventory?.itemSku}`}>
			<Pencil aria-hidden="true" />
		</Button>
	) : (
		<Button type="button">
			<Plus aria-hidden="true" />
			Add inventory
		</Button>
	);

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen);
		setError(null);
		setForm({
			warehouseId: inventory?.warehouseId || "",
			itemId: inventory?.itemId || "",
			quantityOnHand: inventory?.quantityOnHand || 0,
			reorderPoint: inventory?.reorderPoint || 0,
		});
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		saveMutation.mutate(form);
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<div className="grid gap-3 py-2">
						<div className="grid gap-1">
							<Label>Warehouse</Label>
							<SelectCombobox
								ariaLabel="Inventory warehouse"
								value={form.warehouseId}
								disabled={loading || isEditing}
								options={warehouses.map(w => ({ label: `${w.code} - ${w.name}`, value: w.id }))}
								placeholder="Select warehouse"
								onChange={(val) => setForm(f => ({ ...f, warehouseId: val }))}
							/>
						</div>
						<div className="grid gap-1">
							<Label>Item</Label>
							<SelectCombobox
								ariaLabel="Inventory item"
								value={form.itemId}
								disabled={loading || isEditing}
								options={items.map(i => ({ label: `${i.sku} - ${i.name}`, value: i.id }))}
								placeholder="Select item"
								onChange={(val) => setForm(f => ({ ...f, itemId: val }))}
							/>
						</div>
						<div className="grid gap-1">
							<Label htmlFor="quantity-on-hand">Quantity on hand</Label>
							<Input
								id="quantity-on-hand"
								type="number"
								min={0}
								value={form.quantityOnHand}
								required
								onChange={(event) => setForm(f => ({ ...f, quantityOnHand: parseInt(event.target.value, 10) || 0 }))}
							/>
						</div>
						<div className="grid gap-1">
							<Label htmlFor="reorder-point">Reorder point</Label>
							<Input
								id="reorder-point"
								type="number"
								min={0}
								value={form.reorderPoint}
								required
								onChange={(event) => setForm(f => ({ ...f, reorderPoint: parseInt(event.target.value, 10) || 0 }))}
							/>
						</div>
						{error ? <p className="text-sm text-destructive">{error}</p> : null}
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSaving || loading}>
							{submitText}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
