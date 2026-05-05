import { useEffect, useState } from "react";
import { apiService } from "@/frontend/api/apiService";
import { Badge } from "@/components/ui/badge";
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
import type { Item } from "@/frontend/shared/data/wms";
import { formatStatus } from "@/frontend/shared/data/wms";
import { buildFilterQuery } from "@/frontend/shared/utils/build-filter-query";
import ItemEditorDialog from "./ItemEditorDialog";
import DeleteResourceDialog from "@/frontend/shared/components/forms/DeleteResourceDialog";
import SelectCombobox from "@/frontend/shared/components/forms/SelectCombobox";

export default function ItemsTable() {
	const [data, setData] = useState<{ data: Item[], total: number, totalPages: number, page: number }>({ data: [], total: 0, totalPages: 0, page: 1 });
	const [filters, setFilters] = useState({ sku: "", name: "", status: "" });
    const [page, setPage] = useState(1);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [reloadKey, setReloadKey] = useState(0);
	const retry = () => setReloadKey((current) => current + 1);
	const query = buildFilterQuery(filters, { exactKeys: ["status"] });

	useEffect(() => {
		let isCurrent = true;
		setIsLoading(true);
		setError(null);

		apiService
			.get<{ data: Item[], total: number, totalPages: number, page: number }>(`/items${query}${query ? '&' : '?'}page=${page}&limit=10`)
			.then((response) => {
				if (isCurrent) {
					setData(response);
				}
			})
			.catch((loadError) => {
				if (isCurrent) {
					setError(loadError instanceof Error ? loadError.message : "Failed to load items.");
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
	}, [query, reloadKey, page]);

	const tableBody = data.data.length ? (
		data.data.map((item) => (
			<TableRow key={item.id}>
				<TableCell className="font-mono text-xs text-slate-500">{item.sku}</TableCell>
				<TableCell className="font-medium">{item.name}</TableCell>
				<TableCell>{item.categoryName || item.categoryId}</TableCell>
				<TableCell>{item.unit}</TableCell>
				<TableCell>
					<Badge variant={item.status === "active" ? "secondary" : "outline"}>
						{formatStatus(item.status)}
					</Badge>
				</TableCell>
				<TableCell className="text-right flex justify-end gap-2">
					<ItemEditorDialog item={item} onSaved={retry} />
                    <DeleteResourceDialog 
                        endpoint={`/items/${item.id}`}
                        label="item"
                        name={item.sku}
                        onDeleted={retry}
                    />
				</TableCell>
			</TableRow>
		))
	) : (
		<TableRow>
			<TableCell colSpan={6} className="p-8 text-center text-muted-foreground">
				No items found.
			</TableCell>
		</TableRow>
	);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between gap-3">
				<CardTitle>Item Master</CardTitle>
				<ItemEditorDialog onSaved={retry} />
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="grid gap-2 md:grid-cols-4">
					<Input
						aria-label="Filter SKU"
						placeholder="Filter SKU"
						value={filters.sku}
						onChange={(event) => { setFilters((current) => ({ ...current, sku: event.target.value })); setPage(1); }}
					/>
					<Input
						aria-label="Filter Name"
						placeholder="Filter Name"
						value={filters.name}
						onChange={(event) => { setFilters((current) => ({ ...current, name: event.target.value })); setPage(1); }}
					/>
					<SelectCombobox
                        ariaLabel="Filter by status"
                        value={filters.status}
                        options={[
                            { label: "All Statuses", value: "" },
                            { label: "Active", value: "active" },
                            { label: "Discontinued", value: "discontinued" },
                        ]}
                        placeholder="Status"
                        onChange={(val) => { setFilters(f => ({ ...f, status: val })); setPage(1); }}
                    />
				</div>
                {error ? (
                    <div role="alert" className="grid justify-items-center gap-3 p-8 text-center text-destructive">
                        <p>{error}</p>
                        <Button variant="outline" onClick={retry}>Retry</Button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-hidden rounded-lg border">
                            {isLoading ? <p className="p-4 text-sm text-muted-foreground">Loading items...</p> : null}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>{tableBody}</TableBody>
                            </Table>
                        </div>
                        {data.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-muted-foreground">Page {data.page} of {data.totalPages}</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                                    <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
			</CardContent>
		</Card>
	);
}
