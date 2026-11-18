import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { KpiCard } from "@/components/KpiCard";
import { RiskBadge } from "@/components/RiskBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCustomers, getStats, featureImportance, modelPerformance } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, Legend
} from "recharts";

const COLORS = {
  primary: "hsl(210, 80%, 45%)",
  secondary: "hsl(168, 60%, 40%)",
  warning: "hsl(38, 92%, 50%)",
  danger: "hsl(0, 72%, 51%)",
  muted: "hsl(220, 10%, 46%)",
};

export default function Dashboard() {
  const stats = useMemo(() => getStats(mockCustomers), []);

  const riskPieData = [
    { name: "Low Risk", value: stats.lowRisk, color: COLORS.secondary },
    { name: "Medium Risk", value: stats.medRisk, color: COLORS.warning },
    { name: "High Risk", value: stats.highRisk, color: COLORS.danger },
  ];

  const rocData = Array.from({ length: 20 }, (_, i) => {
    const fpr = i / 19;
    const tpr = Math.min(1, fpr * 0.3 + Math.pow(fpr, 0.4) * 0.85);
    return { fpr: +fpr.toFixed(2), tpr: +tpr.toFixed(2) };
  });

  const dpdScatter = mockCustomers.slice(0, 80).map((c) => ({
    dpd: c.Avg_Days_Past_Due,
    prob: c.Churn_Probability,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Portfolio overview · {stats.total} customers analyzed
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Total Customers" value={stats.total.toLocaleString()} icon="users" variant="primary" />
          <KpiCard title="Churn Rate" value={`${stats.churnRate}%`} icon="activity" trend="up" trendValue="+2.3% vs last quarter" variant="danger" />
          <KpiCard title="High Risk" value={stats.highRisk} icon="alert" subtitle="customers need attention" variant="warning" />
          <KpiCard title="Model ROC-AUC" value={modelPerformance.rocAuc.toFixed(2)} icon="shield" subtitle="XGBoost selected" variant="success" />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Risk Distribution */}
          <Card className="animate-fade-in">
            <CardHeader><CardTitle className="text-sm">Risk Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={riskPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                    {riskPieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Churn by Region */}
          <Card className="animate-fade-in">
            <CardHeader><CardTitle className="text-sm">Churn by Region</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.byRegion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
                  <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="total" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Total" />
                  <Bar dataKey="churned" fill={COLORS.danger} radius={[4, 4, 0, 0]} name="Churned" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Churn by Loan Cycle */}
          <Card className="animate-fade-in">
            <CardHeader><CardTitle className="text-sm">Churn by Loan Cycle</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.byLoanCycle}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
                  <XAxis dataKey="cycle" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="total" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Total" />
                  <Bar dataKey="churned" fill={COLORS.warning} radius={[4, 4, 0, 0]} name="Churned" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ROC Curve */}
          <Card className="animate-fade-in">
            <CardHeader><CardTitle className="text-sm">ROC Curve (AUC = {modelPerformance.rocAuc})</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={rocData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
                  <XAxis dataKey="fpr" label={{ value: "FPR", position: "bottom", fontSize: 11 }} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="tpr" label={{ value: "TPR", angle: -90, position: "insideLeft", fontSize: 11 }} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="tpr" stroke={COLORS.primary} strokeWidth={2} dot={false} />
                  <Line type="linear" dataKey="fpr" stroke={COLORS.muted} strokeDasharray="5 5" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* DPD vs Churn Scatter */}
          <Card className="animate-fade-in">
            <CardHeader><CardTitle className="text-sm">Avg DPD vs Churn Probability</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
                  <XAxis dataKey="dpd" name="Avg DPD" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="prob" name="Churn Prob" tick={{ fontSize: 11 }} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={dpdScatter} fill={COLORS.primary} fillOpacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Confusion Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="animate-fade-in">
            <CardHeader><CardTitle className="text-sm">Confusion Matrix</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                <div className="p-4 rounded-md bg-success/15 text-center">
                  <div className="text-xs text-muted-foreground">True Neg</div>
                  <div className="text-2xl font-bold font-mono">{modelPerformance.confusionMatrix.tn}</div>
                </div>
                <div className="p-4 rounded-md bg-danger/15 text-center">
                  <div className="text-xs text-muted-foreground">False Pos</div>
                  <div className="text-2xl font-bold font-mono">{modelPerformance.confusionMatrix.fp}</div>
                </div>
                <div className="p-4 rounded-md bg-warning/15 text-center">
                  <div className="text-xs text-muted-foreground">False Neg</div>
                  <div className="text-2xl font-bold font-mono">{modelPerformance.confusionMatrix.fn}</div>
                </div>
                <div className="p-4 rounded-md bg-success/15 text-center">
                  <div className="text-xs text-muted-foreground">True Pos</div>
                  <div className="text-2xl font-bold font-mono">{modelPerformance.confusionMatrix.tp}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Importance */}
          <Card className="animate-fade-in">
            <CardHeader><CardTitle className="text-sm">Feature Importance (XGBoost)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={featureImportance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="feature" type="category" width={140} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="importance" fill={COLORS.secondary} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
