"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Coins, Users, TrendingUp } from "lucide-react";
import { faker } from "@faker-js/faker";
import Image from "next/image";

// Tipo para as apostas
interface Bet {
  id: number;
  amount: number;
  multiplier: number;
  total: number;
  username: string;
  avatar: string;
  timestamp: Date;
  isWin: boolean;
}

export default function AviatorGame() {
  const [multiplier, setMultiplier] = useState(1.0);
  const [betAmount1, setBetAmount1] = useState(1.0);
  const [betAmount2, setBetAmount2] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBets, setActiveBets] = useState({ bet1: false, bet2: false });
  const [gameResult, setGameResult] = useState<number | null>(null);
  const [winnings, setWinnings] = useState({ bet1: 0, bet2: 0 });
  const [showWinnings, setShowWinnings] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const [bets, setBets] = useState<Bet[]>([]);

  // Novo estado para estatísticas
  const [stats, setStats] = useState({
    onlinePlayers: 0,
    totalBets: 0,
    highestMultiplier: 0,
  });

  // Adicionar novo estado para o temporizador
  const [countdown, setCountdown] = useState<number | null>(null);

  // Modificar os estados de controle
  const [isStarting, setIsStarting] = useState(false);

  // Função para gerar uma aposta fake
  const generateFakeBet = (): Bet => {
    const amount = faker.number.float({
      min: 10,
      max: 1000,
      fractionDigits: 2,
    });
    const multiplier = faker.number.float({
      min: 1.1,
      max: 50,
      fractionDigits: 2,
    });

    return {
      id: Date.now(),
      amount,
      multiplier,
      total: amount * multiplier,
      username: faker.internet.userName(),
      avatar: faker.image.avatar(),
      timestamp: new Date(),
      isWin: faker.datatype.boolean(),
    };
  };

  // Simular apostas em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const newBet = generateFakeBet();
      newBet.total = newBet.amount * newBet.multiplier;

      setBets((prev) => [newBet, ...prev.slice(0, 49)]); // Manter últimas 50 apostas

      // Atualizar estatísticas
      setStats((prev) => ({
        onlinePlayers: faker.number.int({ min: 1000, max: 5000 }),
        totalBets: prev.totalBets + 1,
        highestMultiplier: Math.max(prev.highestMultiplier, newBet.multiplier),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const startGame = () => {
    if (!isPlaying && !isStarting && countdown === null) {
      setIsStarting(true);
      setCountdown(5);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            setIsStarting(false);
            setIsPlaying(true);
            setMultiplier(1.0);
            setGameResult(null);
            setShowWinnings(false);
            const crashPoint = 1 + Math.random() * 99;
            animateGame(crashPoint);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const animateGame = (crashPoint: number) => {
    const startTime = Date.now();
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      const currentMultiplier = Math.pow(Math.E, elapsed * 0.35);

      setMultiplier(currentMultiplier);

      if (currentMultiplier < crashPoint) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setGameResult(crashPoint);
        setIsPlaying(false);
        calculateWinnings(crashPoint);
        setActiveBets({ bet1: false, bet2: false });

        // Aguardar um tempo antes de iniciar nova rodada
        setTimeout(() => {
          if (!isStarting) {
            startGame();
          }
        }, 3000);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const calculateWinnings = (crashPoint: number) => {
    const newWinnings = {
      bet1: activeBets.bet1 ? betAmount1 * crashPoint : 0,
      bet2: activeBets.bet2 ? betAmount2 * crashPoint : 0,
    };
    setWinnings(newWinnings);
    setShowWinnings(true);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const placeBet = (betSide: 1 | 2) => {
    if (!isPlaying && !isStarting && countdown !== null) {
      setActiveBets((prev) => ({
        ...prev,
        [`bet${betSide}`]: true,
      }));
    }
  };

  // Modificar o useEffect de início automático
  useEffect(() => {
    if (!isPlaying && !isStarting && countdown === null) {
      const timer = setTimeout(() => {
        startGame();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, isStarting, countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
      <div className="container mx-auto p-4 max-w-[1920px]">
        {/* Stats Bar - Agora com 4 cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card className="bg-opacity-50 bg-zinc-800 backdrop-blur-md border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-full bg-purple-500/10">
                <Users className="text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">JOGADORES ONLINE</p>
                <p className="text-xl font-bold text-purple-300">
                  {stats.onlinePlayers.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-opacity-50 bg-zinc-800 backdrop-blur-md border-emerald-500/20 hover:border-emerald-500/40 transition-all">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-full bg-emerald-500/10">
                <TrendingUp className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">MAIOR MULTIPLICADOR</p>
                <p className="text-xl font-bold text-emerald-300">
                  {stats.highestMultiplier.toFixed(2)}x
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Novos cards de estatísticas */}
          <Card className="bg-opacity-50 bg-zinc-800 backdrop-blur-md border-blue-500/20 hover:border-blue-500/40 transition-all">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-500/10">
                <Coins className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">TOTAL APOSTADO</p>
                <p className="text-xl font-bold text-blue-300">
                  {(stats.totalBets * 1000).toLocaleString()} BRL
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-opacity-50 bg-zinc-800 backdrop-blur-md border-amber-500/20 hover:border-amber-500/40 transition-all">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-full bg-amber-500/10">
                <TrendingUp className="text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">MAIOR GANHO</p>
                <p className="text-xl font-bold text-amber-300">
                  {(stats.highestMultiplier * 1000).toFixed(2)} BRL
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-[400px_1fr] gap-6">
          {/* Bets Panel - Versão melhorada */}
          <Card className="bg-opacity-50 bg-zinc-800 backdrop-blur-md border-zinc-700 md:sticky md:top-4 md:h-[calc(100vh-8rem)]">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  APOSTAS AO VIVO
                </h2>
                <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-full">
                  Últimas 50 apostas
                </span>
              </div>
              <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-auto custom-scrollbar">
                {bets.map((bet) => (
                  <div
                    key={bet.id}
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
                      <span className="text-sm text-zinc-400">
                        {bet.total.toFixed(2)} MT
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Game Display */}
          <Card className="bg-opacity-30 bg-zinc-900 backdrop-blur-md border-zinc-700">
            <CardContent className="p-4">
              <div className="relative h-[600px] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                {isPlaying ? (
                  <>
                    <div
                      className={`absolute transform plane-animation ${
                        !isPlaying && gameResult ? "plane-crash" : ""
                      }`}
                      style={
                        {
                          "--multiplier": multiplier,
                          "--crash-point": gameResult || 1,
                        } as { [key: `--${string}`]: number }
                      }
                    >
                      <div className="relative w-24 h-24">
                        <div className="absolute inset-0 bg-purple-500/30 blur-xl"></div>
                        <Plane
                          className="text-purple-400 drop-shadow-glow animate-pulse transform rotate-[135deg]"
                          size={96}
                        />
                      </div>
                    </div>
                    <div className="absolute top-8 text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 glow z-10">
                      {multiplier.toFixed(2)}x
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-2xl text-zinc-500">
                      {gameResult ? (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-4xl font-bold text-purple-400">
                            AVIÃO DECOLOU @ {gameResult.toFixed(2)}x
                          </span>
                          <span className="text-lg text-zinc-400">
                            Nova rodada começando...
                          </span>
                        </div>
                      ) : countdown ? (
                        <span className="text-4xl font-bold text-purple-400">
                          {countdown}s PARA APOSTAR
                        </span>
                      ) : (
                        "AGUARDANDO PRÓXIMA RODADA"
                      )}
                    </div>
                    {showWinnings && (
                      <div className="flex flex-col items-center animate-bounce">
                        {winnings.bet1 > 0 && (
                          <div className="flex items-center gap-2 text-green-500">
                            <Coins />
                            <span>
                              +{winnings.bet1.toFixed(2)} BRL (Aposta 1)
                            </span>
                          </div>
                        )}
                        {winnings.bet2 > 0 && (
                          <div className="flex items-center gap-2 text-green-500">
                            <Coins />
                            <span>
                              +{winnings.bet2.toFixed(2)} BRL (Aposta 2)
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Betting Controls com novo design */}
              <div className="grid grid-cols-2 gap-6 mt-6">
                {[1, 2].map((side) => (
                  <div
                    key={side}
                    className="space-y-4 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
                  >
                    <Input
                      type="number"
                      value={side === 1 ? betAmount1 : betAmount2}
                      onChange={(e) =>
                        side === 1
                          ? setBetAmount1(Number(e.target.value))
                          : setBetAmount2(Number(e.target.value))
                      }
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
                          onClick={() =>
                            side === 1
                              ? setBetAmount1(value)
                              : setBetAmount2(value)
                          }
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
                      onClick={() => placeBet(side as 1 | 2)}
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
                          ? `APOSTA ${betAmount1.toFixed(2)} MT`
                          : "AGUARDE"
                        : activeBets.bet2
                        ? "APOSTADO"
                        : countdown
                        ? `APOSTA ${betAmount2.toFixed(2)} MT`
                        : "AGUARDE"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        .glow {
          text-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
          animation: pulse 1s infinite;
        }

        .drop-shadow-glow {
          filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.5));
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        .plane-animation {
          --multiplier: 1;
          --crash-point: 1;
          position: absolute;
          left: 0;
          bottom: 20%;
          animation: fly 1s infinite ease-in-out;
          transform: translate(
            min(calc(var(--multiplier) * 100px), 600px),
            max(calc(var(--multiplier) * -50px), -300px)
          );
          filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.5));
          transition: all 200ms linear;
        }

        .plane-crash {
          animation: takeoff 1s forwards cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fly {
          0%,
          100% {
            transform: translate(
                min(calc(var(--multiplier) * 100px), 600px),
                max(calc(var(--multiplier) * -50px), -300px)
              )
              rotate(-45deg);
          }
          50% {
            transform: translate(
                min(calc(var(--multiplier) * 100px), 600px),
                max(calc(var(--multiplier) * -50px - 10px), -310px)
              )
              rotate(-45deg);
          }
        }

        @keyframes takeoff {
          0% {
            transform: translate(
                min(calc(var(--crash-point) * 100px), 600px),
                max(calc(var(--crash-point) * -50px), -300px)
              )
              rotate(-45deg);
            opacity: 1;
          }
          100% {
            transform: translate(calc(100% + 200px), -100%);
            opacity: 0;
          }
        }

        .bg-grid-pattern {
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
          background-size: 20px 20px;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.2);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.4);
        }

        /* Melhorar a visibilidade dos inputs */
        input[type="number"] {
          background: rgba(24, 24, 27, 0.9) !important;
          color: white !important;
          font-size: 1.25rem !important;
          height: 3rem !important;
          text-align: center !important;
          font-weight: 600 !important;
          letter-spacing: 0.05em !important;
          border-width: 2px !important;
        }

        input[type="number"]:focus {
          border-color: rgb(168, 85, 247) !important;
          box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
        }

        input[type="number"]::placeholder {
          color: rgb(113, 113, 122) !important;
        }

        /* Remover as setas do input number */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
