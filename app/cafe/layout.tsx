import { Caveat_Brush, Courier_Prime, Nunito } from "next/font/google";

const chalk = Caveat_Brush({ variable: "--font-caveat-brush", subsets: ["latin"], weight: "400", display: "swap" });
const receipt = Courier_Prime({ variable: "--font-courier-prime", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const cafe = Nunito({ variable: "--font-nunito", subsets: ["latin"], display: "swap" });

export default function CafeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${chalk.variable} ${receipt.variable} ${cafe.variable} font-cafe min-h-screen bg-[#1b120c] text-[#f5e9da]`}>
      {children}
    </div>
  );
}
