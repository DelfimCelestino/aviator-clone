export interface Bet {
  id: number;
  amount: number;
  multiplier: number;
  total: number;
  username: string;
  avatar: string;
  timestamp: Date;
  isWin: boolean;
}

export interface GameStats {
  onlinePlayers: number;
  totalBets: number;
  highestMultiplier: number;
}
