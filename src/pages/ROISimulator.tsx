import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calculator, TrendingUp, DollarSign, Users } from "lucide-react";
import { Cell } from "recharts";

export default function ROISimulator() {
  const [customers, setCustomers] = useState(5000);
  const [avgLoan, setAvgLoan] = useState(25000);
  const [churnRate, setChurnRate] = useState(28);
  const [successRate, setSuccessRate] = useState(40);
  const [margin, setMargin] = useState(15);

  const result = useMemo(() => {
    const atRisk = Math.round(customers * (churnRate / 100));
    const retained = Math.round(atRisk * (successRate / 100));
    const revenueRetained = retained * avgLoan * (margin / 100);
    const interventionCost = atRisk * 150; // ₹150 per customer intervention cost
    const netBenefit = revenueRetained - interventionCost;
    const roi = interventionCost > 0 ? ((netBenefit / interventionCost) * 100).toFixed(0) : "0";
    const parReduction = ((retained / customers) * 100).toFixed(1);

    return { atRisk, retained, revenueRetained, interventionCost, netBenefit, roi, parReduction };
  }, [customers, avgLoan, churnRate, successRate, margin]);

  const chartData = [
    { name: "Intervention Cost", value: result.interventionCost, fill: "hsl(0, 72%, 51%)" },
    { name: "Revenue Saved", value: result.revenueRetained, fill: "hsl(168, 60%, 40%)" },
    { name: "Net Benefit", value: Math.max(0, result.netBenefit), fill: "hsl(210, 80%, 45%)" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">ROI & Impact Simulator</h1>
          <p className="text-sm text-muted-foreground">Estimate the financial impact of churn intervention</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <Card className="animate-fade-in">
            <CardHeader><CardTitle className="text-sm">Simulation Parameters</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label>Total Customer Base: {customers.toLocaleString()}</Label>
                <Slider value={[customers]} onValueChange={([v]) => setCustomers(v)} min={500} max={50000} step={500} className="mt-2" />
              </div>
              <div>
                <Label>Average Loan Value (₹): {avgLoan.toLocaleString()}</Label>
                <Slider value={[avgLoan]} onValueChange={([v]) => setAvgLoan(v)} min={5000} max={200000} step={5000} className="mt-2" />
              </div>
              <div>
                <Label>Current Churn Rate: {churnRate}%</Label>
                <Slider value={[churnRate]} onValueChange={([v]) => setChurnRate(v)} min={5} max={60} step={1} className="mt-2" />
              </div>
              <div>
                <Label>Intervention Success Rate: {successRate}%</Label>
                <Slider value={[successRate]} onValueChange={([v]) => setSuccessRate(v)} min={10} max={80} step={5} className="mt-2" />
              </div>
              <div>
                <Label>Profit Margin: {margin}%</Label>
                <Slider value={[margin]} onValueChange={([v]) => setMargin(v)} min={5} max={40} step={1} className="mt-2" />
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="animate-fade-in">
                <CardContent className="pt-4 text-center">
                  <Users className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <div className="text-xl font-bold font-mono">{result.retained.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Customers Retained</p>
                </CardContent>
              </Card>
              <Card className="animate-fade-in">
                <CardContent className="pt-4 text-center">
                  <DollarSign className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <div className="text-xl font-bold font-mono">₹{(result.revenueRetained / 100000).toFixed(1)}L</div>
                  <p className="text-xs text-muted-foreground">Revenue Saved</p>
                </CardContent>
              </Card>
              <Card className="animate-fade-in">
                <CardContent className="pt-4 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <div className="text-xl font-bold font-mono">{result.roi}%</div>
                  <p className="text-xs text-muted-foreground">ROI</p>
                </CardContent>
              </Card>
              <Card className="animate-fade-in">
                <CardContent className="pt-4 text-center">
                  <Calculator className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <div className="text-xl font-bold font-mono">{result.parReduction}%</div>
                  <p className="text-xs text-muted-foreground">PAR Reduction</p>
                </CardContent>
              </Card>
            </div>

            <Card className="animate-fade-in">
              <CardHeader><CardTitle className="text-sm">Cost vs Benefit</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

