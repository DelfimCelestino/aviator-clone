import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  title: "Aviator Clone | Jogo de Apostas Multiplayer",
  description:
    "Um emocionante jogo de apostas multiplayer em tempo real onde você decide quando o avião decola! Faça suas apostas, acompanhe o multiplicador e ganhe grandes prêmios.",
  keywords: "aviator, jogo de apostas, multiplayer, apostas online, crash game",
  authors: [{ name: "Delfim Celestino" }],
  creator: "Delfim Celestino",
  openGraph: {
    title: "Aviator Clone | Jogo de Apostas Multiplayer",
    description:
      "Um emocionante jogo de apostas multiplayer em tempo real onde você decide quando o avião decola!",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${robotoCondensed.variable} font-roboto antialiased`}>
        {children}
      </body>
    </html>
  );
}
