import { useEffect, useState } from "react";
import { apiService } from "@/frontend/api/apiService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ItemCategory } from "@/frontend/shared/data/wms";
import { buildFilterQuery } from "@/frontend/shared/utils/build-filter-query";
import ItemCategoryEditorDialog from "./ItemCategoryEditorDialog";
import DeleteResourceDialog from "@/frontend/shared/components/forms/DeleteResourceDialog";

export default function ItemCategoriesTable() {
	const [categories, setCategories] = useState<ItemCategory[]>([]);
	const [filters, setFilters] = useState({ name: "" });
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [reloadKey, setReloadKey] = useState(0);
	const retry = () => setReloadKey((current) => current + 1);
	const query = buildFilterQuery(filters);

	useEffect(() => {
		let isCurrent = true;
		setIsLoading(true);
		setError(null);

		apiService
			.get<ItemCategory[]>(`/item-categories${query}`)
			.then((response) => {
				if (isCurrent) {
					setCategories(response);
				}
			})
			.catch((loadError) => {
				if (isCurrent) {
					setError(loadError instanceof Error ? loadError.message : "Failed to load categories.");
				}
			})
			.finally(() => {
				if (isCurrent) {
					setIsLoading(false);
				}
			});

		return () => {
			isCurrent = false;
		};
	}, [query, reloadKey]);

	const tableBody = categories.length ? (
		categories.map((category) => (
			<TableRow key={category.id}>
				<TableCell>{category.name}</TableCell>
				<TableCell className="text-right flex justify-end gap-2">
					<ItemCategoryEditorDialog category={category} onSaved={retry} />
                    <DeleteResourceDialog 
                        endpoint={`/item-categories/${category.id}`}
                        label="category"
                        name={category.name}
                        onDeleted={retry}
                    />
				</TableCell>
			</TableRow>
		))
	) : (
		<TableRow>
			<TableCell colSpan={2} className="p-8 text-center text-muted-foreground">
				No categories.
			</TableCell>
		</TableRow>
	);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between gap-3">
				<CardTitle>Item Categories</CardTitle>
				<ItemCategoryEditorDialog onSaved={retry} />
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="grid gap-2 md:grid-cols-4">
					<Input
						aria-label="Filter category name"
						placeholder="Name"
						value={filters.name}
						onChange={(event) => setFilters((current) => ({ ...current, name: event.target.value }))}
					/>
				</div>
                {error ? (
                    <div role="alert" className="grid justify-items-center gap-3 p-8 text-center text-destructive">
                        <p>{error}</p>
                        <Button variant="outline" onClick={retry}>Retry</Button>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg border">
                        {isLoading ? <p className="p-4 text-sm text-muted-foreground">Loading categories...</p> : null}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>{tableBody}</TableBody>
                        </Table>
                    </div>
                )}
			</CardContent>
		</Card>
	);
}
