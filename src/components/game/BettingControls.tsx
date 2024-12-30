import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BettingControlsProps {
  side: 1 | 2;
  betAmount: number;
  setBetAmount: (value: number) => void;
  isPlaying: boolean;
  countdown: number | null;
  activeBets: { bet1: boolean; bet2: boolean };
  placeBet: (side: 1 | 2) => void;
}

export function BettingControls({
  side,
  betAmount,
  setBetAmount,
  isPlaying,
  countdown,
  activeBets,
  placeBet,
}: BettingControlsProps) {
  return (
    <div className="space-y-4 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <Input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        disabled={isPlaying || countdown === null}
        className="bg-zinc-900/90 border-zinc-700 focus:border-purple-500 text-white text-lg font-bold h-12 placeholder:text-zinc-500"
        placeholder="Valor da aposta"
      />
      <div className="grid grid-cols-4 gap-2">
        {[50, 100, 500, 1000].map((value) => (
          <Button
            key={`${side}-${value}`}
            variant="outline"
            className="bg-zinc-900/80 border-zinc-700 hover:bg-purple-500/20 hover:border-purple-500 text-white font-bold"
            onClick={() => setBetAmount(value)}
            disabled={isPlaying || countdown === null}
          >
            {value}
          </Button>
        ))}
      </div>
      <Button
        className={`w-full ${
          isPlaying || countdown === null
            ? "bg-zinc-700 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        }`}
        onClick={() => placeBet(side)}
        disabled={
          isPlaying ||
          countdown === null ||
          (side === 1 ? activeBets.bet1 : activeBets.bet2)
        }
      >
        {side === 1
          ? activeBets.bet1
            ? "APOSTADO"
            : countdown
            ? `APOSTA ${betAmount.toFixed(2)} MT`
            : "AGUARDE"
          : activeBets.bet2
          ? "APOSTADO"
          : countdown
          ? `APOSTA ${betAmount.toFixed(2)} MT`
          : "AGUARDE"}
      </Button>
    </div>
  );
}
