import Image from "next/image";
import { Bet } from "@/types/game";

interface BetCardProps {
  bet: Bet;
}

export function BetCard({ bet }: BetCardProps) {
  return (
    <div
      className={`flex items-center justify-between ${
        bet.isWin ? "bg-emerald-500/10" : "bg-zinc-800/50"
      } p-4 rounded-xl transition-all hover:scale-[1.02] border border-zinc-700/50`}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500">
          <Image
            src={bet.avatar}
            alt={bet.username}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-zinc-300">
            {bet.username}
          </span>
          <span className="text-xs text-zinc-500">
            {bet.amount.toFixed(2)} MT
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span
          className={`text-lg font-bold ${
            bet.isWin ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {bet.multiplier.toFixed(2)}x
        </span>
        <span className="text-sm text-zinc-400">{bet.total.toFixed(2)} MT</span>
      </div>
    </div>
  );
}
