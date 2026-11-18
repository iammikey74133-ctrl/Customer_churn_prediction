import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RiskBadge } from "@/components/RiskBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCustomers } from "@/data/mockData";
import { Phone, MapPin, MessageSquare, Gift, ArrowUpRight, Users } from "lucide-react";

const strategies = {
  High: {
    color: "border-danger/30",
    actions: [
      { icon: MapPin, label: "Immediate field visit by officer" },
      { icon: ArrowUpRight, label: "Flexible repayment restructuring" },
      { icon: Gift, label: "Retention incentive offer" },
    ],
  },
  Medium: {
    color: "border-warning/30",
    actions: [
      { icon: MessageSquare, label: "SMS reminder campaign" },
      { icon: Phone, label: "Phone follow-up call" },
      { icon: Users, label: "Loyalty engagement program" },
    ],
  },
  Low: {
    color: "border-success/30",
    actions: [
      { icon: Gift, label: "Cross-sell new loan product" },
      { icon: ArrowUpRight, label: "Offer savings scheme" },
      { icon: Users, label: "Early renewal benefit" },
    ],
  },
};

export default function Interventions() {
  const grouped = useMemo(() => {
    const high = mockCustomers.filter((c) => c.Risk_Level === "High").slice(0, 8);
    const med = mockCustomers.filter((c) => c.Risk_Level === "Medium").slice(0, 6);
    const low = mockCustomers.filter((c) => c.Risk_Level === "Low").slice(0, 4);
    return { High: high, Medium: med, Low: low } as const;
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Intervention Engine</h1>
          <p className="text-sm text-muted-foreground">Automated retention strategies by risk segment</p>
        </div>

        {(["High", "Medium", "Low"] as const).map((level) => (
          <Card key={level} className={`animate-fade-in ${strategies[level].color}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <RiskBadge level={level} />
                <span className="text-sm text-muted-foreground">{grouped[level].length} customers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recommended actions */}
              <div className="flex flex-wrap gap-3">
                {strategies[level].actions.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-sm">
                    <a.icon className="h-4 w-4 text-muted-foreground" />
                    {a.label}
                  </div>
                ))}
              </div>

              {/* Customer list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {grouped[level].map((c) => (
                  <div key={c.Customer_ID} className="flex items-center justify-between p-2 rounded border bg-card">
                    <span className="font-mono text-xs">{c.Customer_ID}</span>
                    <span className="font-mono text-xs text-muted-foreground">{(c.Churn_Probability! * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
