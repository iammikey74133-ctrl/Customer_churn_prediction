import { TrendingUp, TrendingDown, Users, AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "danger" | "primary";
  icon?: "users" | "alert" | "shield" | "activity";
}

const iconMap = {
  users: Users,
  alert: AlertTriangle,
  shield: ShieldCheck,
  activity: Activity,
};

const variantStyles = {
  default: "border-border",
  success: "border-success/30 bg-success/5",
  warning: "border-warning/30 bg-warning/5",
  danger: "border-danger/30 bg-danger/5",
  primary: "border-primary/30 bg-primary/5",
};

export function KpiCard({ title, value, subtitle, trend, trendValue, variant = "default", icon }: KpiCardProps) {
  const Icon = icon ? iconMap[icon] : null;

  return (
    <Card className={`animate-fade-in ${variantStyles[variant]}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {trend === "up" && <TrendingUp className="h-3 w-3 text-danger" />}
          {trend === "down" && <TrendingDown className="h-3 w-3 text-success" />}
          {trendValue && <span className="text-xs text-muted-foreground">{trendValue}</span>}
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
