import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  color: string;
}

export function StatsCard({ icon: Icon, title, value, color }: StatsCardProps) {
  return (
    <Card
      className={`bg-opacity-50 bg-zinc-800 backdrop-blur-md border-${color}-500/20 hover:border-${color}-500/40 transition-all`}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-3 rounded-full bg-${color}-500/10`}>
          <Icon className={`text-${color}-400`} />
        </div>
        <div>
          <p className="text-xs text-zinc-400">{title}</p>
          <p className={`text-xl font-bold text-${color}-300`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
