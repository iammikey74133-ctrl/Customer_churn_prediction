import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { modelPerformance, featureImportance } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { CheckCircle, Clock, Database, Cpu } from "lucide-react";

const metrics = [
  { label: "Accuracy", value: modelPerformance.accuracy },
  { label: "Precision", value: modelPerformance.precision },
  { label: "Recall", value: modelPerformance.recall },
  { label: "F1-Score", value: modelPerformance.f1 },
  { label: "ROC-AUC", value: modelPerformance.rocAuc },
];

const trendData = [
  { month: "Sep", auc: 0.84 },
  { month: "Oct", auc: 0.86 },
  { month: "Nov", auc: 0.87 },
  { month: "Dec", auc: 0.88 },
  { month: "Jan", auc: 0.9 },
  { month: "Feb", auc: 0.91 },
];

export default function ModelPerformance() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Model Performance</h1>
            <p className="text-sm text-muted-foreground">XGBoost · Last trained Feb 15, 2026</p>
          </div>
          <Badge variant="outline" className="bg-success/15 text-success border-success/30 gap-1">
            <CheckCircle className="h-3 w-3" /> No Drift Detected
          </Badge>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {metrics.map((m) => (
            <Card key={m.label} className="animate-fade-in">
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold font-mono">{(m.value * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Confusion Matrix */}
          <Card className="animate-fade-in">
            <CardHeader><CardTitle className="text-sm">Confusion Matrix</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <div className="p-5 rounded-md bg-success/15 text-center">
                  <div className="text-xs text-muted-foreground">True Negative</div>
                  <div className="text-3xl font-bold font-mono">{modelPerformance.confusionMatrix.tn}</div>
                </div>
                <div className="p-5 rounded-md bg-danger/15 text-center">
                  <div className="text-xs text-muted-foreground">False Positive</div>
                  <div className="text-3xl font-bold font-mono">{modelPerformance.confusionMatrix.fp}</div>
                </div>
                <div className="p-5 rounded-md bg-warning/15 text-center">
                  <div className="text-xs text-muted-foreground">False Negative</div>
                  <div className="text-3xl font-bold font-mono">{modelPerformance.confusionMatrix.fn}</div>
                </div>
                <div className="p-5 rounded-md bg-success/15 text-center">
                  <div className="text-xs text-muted-foreground">True Positive</div>
                  <div className="text-3xl font-bold font-mono">{modelPerformance.confusionMatrix.tp}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AUC Trend */}
          <Card className="animate-fade-in">
            <CardHeader><CardTitle className="text-sm">Model AUC Trend Over Time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0.8, 0.95]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="auc" stroke="hsl(210,80%,45%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Feature Importance */}
        <Card className="animate-fade-in">
          <CardHeader><CardTitle className="text-sm">Feature Importance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureImportance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="feature" type="category" width={160} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="importance" fill="hsl(168,60%,40%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Model Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="animate-fade-in">
            <CardContent className="pt-4 flex items-center gap-3">
              <Cpu className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">XGBoost v1.7</p>
                <p className="text-xs text-muted-foreground">Best performing model</p>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-fade-in">
            <CardContent className="pt-4 flex items-center gap-3">
              <Database className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm font-medium">200 Samples</p>
                <p className="text-xs text-muted-foreground">Training dataset size</p>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-fade-in">
            <CardContent className="pt-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">4 days ago</p>
                <p className="text-xs text-muted-foreground">Last retrained</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
