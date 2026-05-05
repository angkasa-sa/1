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
import type { Inventory } from "@/frontend/shared/data/wms";
import { formatStatus } from "@/frontend/shared/data/wms";
import { buildFilterQuery } from "@/frontend/shared/utils/build-filter-query";
import InventoryEditorDialog from "./InventoryEditorDialog";
import DeleteResourceDialog from "@/frontend/shared/components/forms/DeleteResourceDialog";
import SelectCombobox from "@/frontend/shared/components/forms/SelectCombobox";

export default function InventoryTable() {
	const [data, setData] = useState<{ data: Inventory[], total: number, totalPages: number, page: number }>({ data: [], total: 0, totalPages: 0, page: 1 });
	const [filters, setFilters] = useState({ warehouseCode: "", itemSku: "", status: "" });
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
			.get<{ data: Inventory[], total: number, totalPages: number, page: number }>(`/inventory${query}${query ? '&' : '?'}page=${page}&limit=10`)
			.then((response) => {
				if (isCurrent) {
					setData(response);
				}
			})
			.catch((loadError) => {
				if (isCurrent) {
					setError(loadError instanceof Error ? loadError.message : "Failed to load inventory.");
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
		data.data.map((inv) => (
			<TableRow key={inv.id}>
				<TableCell>
                    <div className="font-medium">{inv.warehouseCode}</div>
                    <div className="text-xs text-muted-foreground">{inv.warehouseName}</div>
                </TableCell>
				<TableCell>
                    <div className="font-medium">{inv.itemSku}</div>
                    <div className="text-xs text-muted-foreground">{inv.itemName}</div>
                </TableCell>
				<TableCell>{inv.category}</TableCell>
				<TableCell className="text-right">{inv.quantityOnHand}</TableCell>
				<TableCell className="text-right">{inv.reorderPoint}</TableCell>
				<TableCell>
					<Badge variant={inv.status === "in_stock" ? "secondary" : "destructive"}>
						{formatStatus(inv.status)}
					</Badge>
				</TableCell>
				<TableCell className="text-right flex justify-end gap-2">
					<InventoryEditorDialog inventory={inv} onSaved={retry} />
                    <DeleteResourceDialog 
                        endpoint={`/inventory/${inv.id}`}
                        label="inventory row"
                        name={`${inv.warehouseCode} / ${inv.itemSku}`}
                        onDeleted={retry}
                    />
				</TableCell>
			</TableRow>
		))
	) : (
		<TableRow>
			<TableCell colSpan={7} className="p-8 text-center text-muted-foreground">
				No inventory records.
			</TableCell>
		</TableRow>
	);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between gap-3">
				<CardTitle>Inventory</CardTitle>
				<InventoryEditorDialog onSaved={retry} />
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="grid gap-2 md:grid-cols-4">
					<Input
						aria-label="Filter warehouse code"
						placeholder="Warehouse Code"
						value={filters.warehouseCode}
						onChange={(event) => { setFilters((current) => ({ ...current, warehouseCode: event.target.value })); setPage(1); }}
					/>
					<Input
						aria-label="Filter item SKU"
						placeholder="Item SKU"
						value={filters.itemSku}
						onChange={(event) => { setFilters((current) => ({ ...current, itemSku: event.target.value })); setPage(1); }}
					/>
					<SelectCombobox
                        ariaLabel="Filter inventory by status"
                        value={filters.status}
                        options={[
                            { label: "All Statuses", value: "" },
                            { label: "In Stock", value: "in_stock" },
                            { label: "Low Stock", value: "low_stock" },
                            { label: "Out Of Stock", value: "out_of_stock" },
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
                            {isLoading ? <p className="p-4 text-sm text-muted-foreground">Loading inventory...</p> : null}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Warehouse</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Reorder</TableHead>
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
