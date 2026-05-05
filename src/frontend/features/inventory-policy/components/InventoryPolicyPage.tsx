import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInventoryPolicy, useSaveInventoryPolicy } from "../hooks/useInventoryPolicy";
import SelectCombobox from "@/frontend/shared/components/forms/SelectCombobox";
import { toast } from "sonner";

export default function InventoryPolicyPage() {
	const { data: policy, isLoading, error } = useInventoryPolicy();
	const saveMutation = useSaveInventoryPolicy();
	const [lowStockMode, setLowStockMode] = useState<"reorder_point" | "low_stock_threshold">("reorder_point");
	const [lowStockThreshold, setLowStockThreshold] = useState("0");

	useEffect(() => {
		if (policy) {
			setLowStockMode(policy.lowStockMode);
			setLowStockThreshold(policy.lowStockThreshold.toString());
		}
	}, [policy]);

	function handleSave() {
		saveMutation.mutate({
			lowStockMode,
			lowStockThreshold: parseInt(lowStockThreshold, 10) || 0,
		}, {
            onSuccess: () => {
                toast.success("Inventory policy saved.");
            },
            onError: (err) => {
                toast.error(err instanceof Error ? err.message : "Failed to save policy");
            }
        });
	}

	if (isLoading) return <p>Loading policy...</p>;
	if (error) return <p>Error loading policy.</p>;

	return (
		<div className="max-w-2xl mx-auto py-8">
			<Card>
				<CardHeader>
					<CardTitle>Inventory Policy</CardTitle>
					<CardDescription>
						Configure how low stock is calculated across all inventory.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-6">
					<div className="grid gap-2">
						<Label>Low stock mode</Label>
						<SelectCombobox
							ariaLabel="Low stock mode"
							value={lowStockMode}
							options={[
								{ label: "Use reorder point by item", value: "reorder_point" },
								{ label: "Use low stock threshold", value: "low_stock_threshold" },
							]}
							placeholder="Select mode"
							onChange={(val) => setLowStockMode(val as any)}
						/>
					</div>
					{lowStockMode === "low_stock_threshold" && (
						<div className="grid gap-2">
							<Label htmlFor="lowStockThreshold">Low stock threshold</Label>
							<Input
								id="lowStockThreshold"
								type="number"
								value={lowStockThreshold}
								onChange={(e) => setLowStockThreshold(e.target.value)}
							/>
						</div>
					)}
				</CardContent>
				<CardFooter>
					<Button disabled={saveMutation.isPending} onClick={handleSave}>
						{saveMutation.isPending ? "Saving..." : "Save"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
