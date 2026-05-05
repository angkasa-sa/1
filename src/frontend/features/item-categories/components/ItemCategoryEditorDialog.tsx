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
import type { ItemCategory, ItemCategoryPayload } from "@/frontend/shared/data/wms";
import { useSaveItemCategory } from "../hooks/useSaveItemCategory";

interface ItemCategoryEditorDialogProps {
	category?: ItemCategory;
	onSaved: () => void;
}

export default function ItemCategoryEditorDialog({ category, onSaved }: ItemCategoryEditorDialogProps) {
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState<ItemCategoryPayload>({ name: category?.name || "" });
	const [error, setError] = useState<string | null>(null);
	const isEditing = Boolean(category);
	const saveMutation = useSaveItemCategory({
		category,
		onError: setError,
		onSaved: () => {
			setOpen(false);
			onSaved();
		},
	});
	const isSaving = saveMutation.isPending;
	const title = isEditing ? "Edit category" : "Add category";
	const description = isEditing ? "Update item category." : "Create a new item category.";
	const submitText = isSaving ? "Saving..." : "Save";
	const trigger = isEditing ? (
		<Button type="button" variant="ghost" size="icon-sm" aria-label={`Edit ${category?.name}`}>
			<Pencil aria-hidden="true" />
		</Button>
	) : (
		<Button type="button">
			<Plus aria-hidden="true" />
			Add category
		</Button>
	);

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen);
		setError(null);
		setForm({ name: category?.name || "" });
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
							<Label htmlFor="category-name">Name</Label>
							<Input
								id="category-name"
								value={form.name}
								maxLength={100}
								required
								onChange={(event) => setForm({ name: event.target.value })}
							/>
						</div>
						{error ? <p className="text-sm text-destructive">{error}</p> : null}
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSaving}>
							{submitText}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
