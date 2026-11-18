import { Badge } from "@/components/ui/badge";
import type { RiskLevel } from "@/data/mockData";

const styles: Record<RiskLevel, string> = {
  Low: "bg-success/15 text-success border-success/30 hover:bg-success/20",
  Medium: "bg-warning/15 text-warning border-warning/30 hover:bg-warning/20",
  High: "bg-danger/15 text-danger border-danger/30 hover:bg-danger/20",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <Badge variant="outline" className={styles[level]}>{level} Risk</Badge>;
}
