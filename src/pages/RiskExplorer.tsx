import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RiskBadge } from "@/components/RiskBadge";
import { mockCustomers, type Customer, type RiskLevel } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";

export default function RiskExplorer() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return mockCustomers.filter((c) => {
      if (search && !c.Customer_ID.toLowerCase().includes(search.toLowerCase())) return false;
      if (riskFilter !== "all" && c.Risk_Level !== riskFilter) return false;
      if (regionFilter !== "all" && c.Region !== regionFilter) return false;
      return true;
    });
  }, [search, riskFilter, regionFilter]);

  const downloadCSV = () => {
    const highRisk = filtered.filter((c) => c.Risk_Level === "High");
    const headers = ["Customer_ID", "Churn_Probability", "Risk_Level", "Top_Risk_Drivers"];
    const rows = highRisk.map((c) => [c.Customer_ID, c.Churn_Probability, c.Risk_Level, c.Top_Risk_Drivers?.join("; ")].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "high_risk_customers.csv";
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Risk Explorer</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} customers matching filters</p>
          </div>
          <Button onClick={downloadCSV} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export High Risk
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search Customer ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Risk Level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Region" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="Urban">Urban</SelectItem>
                  <SelectItem value="Rural">Rural</SelectItem>
                  <SelectItem value="Semi-Urban">Semi-Urban</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-auto max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky top-0 bg-card">Customer ID</TableHead>
                    <TableHead className="sticky top-0 bg-card">Region</TableHead>
                    <TableHead className="sticky top-0 bg-card">Occupation</TableHead>
                    <TableHead className="sticky top-0 bg-card text-right">Churn Prob</TableHead>
                    <TableHead className="sticky top-0 bg-card">Risk Level</TableHead>
                    <TableHead className="sticky top-0 bg-card">Top Risk Drivers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.slice(0, 50).map((c) => (
                    <TableRow key={c.Customer_ID}>
                      <TableCell className="font-mono text-sm">{c.Customer_ID}</TableCell>
                      <TableCell>{c.Region}</TableCell>
                      <TableCell>{c.Occupation_Type}</TableCell>
                      <TableCell className="text-right font-mono">{(c.Churn_Probability! * 100).toFixed(1)}%</TableCell>
                      <TableCell><RiskBadge level={c.Risk_Level!} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[250px] truncate">{c.Top_Risk_Drivers?.join(", ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
