import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ListChecks, 
  Settings, 
  ClipboardList,
  Bell,
  Search,
  Box
} from "lucide-react";
import { DashboardPage } from "./frontend/features/dashboard";
import { InventoryTable } from "./frontend/features/inventory";
import { ItemsTable } from "./frontend/features/items";
import { InventoryPolicyPage } from "./frontend/features/inventory-policy";
import { ItemCategoriesTable } from "./frontend/features/item-categories";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";

type Page = "dashboard" | "inventory" | "items" | "categories" | "settings";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");

  const NavItem = ({ id, label, icon: Icon }: { id: Page, label: string, icon: any }) => (
    <button
      onClick={() => setActivePage(id)}
      className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors w-full text-left cursor-pointer ${
        activePage === id 
          ? "bg-slate-800 text-white border-r-2 border-indigo-400" 
          : "text-slate-400 hover:text-white hover:bg-slate-800"
      }`}
    >
      <Icon className="size-4 opacity-70" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900 border border-slate-200">
      {/* Sidebar Navigation */}
      <aside className="w-60 bg-slate-900 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-500 rounded-sm flex items-center justify-center">
              <Box className="size-4 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight uppercase">Mini WMS</span>
          </div>
        </div>
        
        <nav className="flex-1 py-4">
          <div className="px-6 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Management</div>
          <NavItem id="dashboard" label="Overview" icon={LayoutDashboard} />
          <NavItem id="inventory" label="Inventory" icon={ClipboardList} />
          <NavItem id="items" label="Item Master" icon={Package} />
          <NavItem id="categories" label="Categories" icon={ListChecks} />
          
          <div className="px-6 py-2 mt-6 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Configuration</div>
          <NavItem id="settings" label="Inventory Policy" icon={Settings} />
        </nav>

        <div className="p-6">
          <div className="p-4 bg-slate-800 rounded-lg">
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-2">Environment</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs text-white">Live Operations</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-900">
              {activePage === "dashboard" && "Dashboard Overview"}
              {activePage === "inventory" && "Inventory Management"}
              {activePage === "items" && "Item Master Data"}
              {activePage === "categories" && "Item Categories"}
              {activePage === "settings" && "Inventory Policy"}
            </h1>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded uppercase">Status: Connected</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
              <Search className="size-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="bg-transparent border-none text-xs focus:ring-0 w-32 focus:w-48 transition-all outline-none"
              />
            </div>
            
            <div className="text-right border-l pl-4 border-slate-200 hidden sm:block">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Build ID</div>
              <div className="text-xs font-mono font-bold">SHA-WMS-2024</div>
            </div>
            
            <Button size="icon" variant="ghost" className="relative cursor-pointer">
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
          <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
            {activePage === "dashboard" && <DashboardPage />}
            {activePage === "inventory" && <InventoryTable />}
            {activePage === "items" && <ItemsTable />}
            {activePage === "categories" && <ItemCategoriesTable />}
            {activePage === "settings" && <InventoryPolicyPage />}
          </div>
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}
