import { useEffect, useState } from "react";
import { apiService } from "@/frontend/api/apiService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatStatus, Inventory } from "@/frontend/shared/data/wms";

interface Summary {
    totalRows: number;
    inStockRows: number;
    lowStockRows: number;
    outOfStockRows: number;
}

interface CategoryCount {
    category: string;
    count: number;
}

export default function DashboardPage() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [lowStockByCategory, setLowStockByCategory] = useState<CategoryCount[]>([]);
    const [lowStockItems, setLowStockItems] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [s, c, i] = await Promise.all([
                    apiService.get<Summary>("/dashboard/inventory-status-summary"),
                    apiService.get<CategoryCount[]>("/dashboard/low-stock-by-category"),
                    apiService.get<Inventory[]>("/dashboard/low-stock-items?limit=5")
                ]);
                setSummary(s);
                setLowStockByCategory(c);
                setLowStockItems(i);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <p>Loading dashboard...</p>;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Inventory Rows</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary?.totalRows}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">In Stock</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">{summary?.inStockRows}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Low Stock</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-indigo-600">{summary?.lowStockRows}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Out Of Stock</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{summary?.outOfStockRows}</div>
                </CardContent>
            </Card>

            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Low Stock Items</CardTitle>
                    <CardDescription>Top 5 items needing immediate attention.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lowStockItems.length > 0 ? (
                                lowStockItems.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="font-medium">{item.itemSku}</div>
                                            <div className="text-xs text-muted-foreground">{item.warehouseCode}</div>
                                        </TableCell>
                                        <TableCell className="text-right">{item.quantityOnHand}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 'out_of_stock' ? 'destructive' : 'outline'}>
                                                {formatStatus(item.status)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">All items in stock!</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Low Stock by Category</CardTitle>
                    <CardDescription>Distribution of low stock alerts across categories.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Alerts</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lowStockByCategory.length > 0 ? (
                                lowStockByCategory.map(c => (
                                    <TableRow key={c.category}>
                                        <TableCell className="font-medium">{c.category}</TableCell>
                                        <TableCell className="text-right">{c.count}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-muted-foreground">No alerts.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
