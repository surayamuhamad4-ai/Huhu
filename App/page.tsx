import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import LoveLetter from "@/components/LoveLetter";
import Timeline from "@/components/Timeline";
import Reasons from "@/components/Reasons";
import Countdown from "@/components/Countdown";
import Navigation from "@/components/Navigation";
import DailyLoveMessage from "@/components/DailyLoveMessage";
import Footer from "@/components/Footer";

// The two always-visible global layers — loaded immediately
const PixelSpaceBackground = dynamic(() => import("@/components/PixelSpaceBackground"), { ssr: false });
const FloatingStickers     = dynamic(() => import("@/components/FloatingStickers"),     { ssr: false });
const CursorTeddy          = dynamic(() => import("@/components/CursorTeddy"),          { ssr: false });
const AchievementsPanel    = dynamic(() => import("@/components/AchievementsPanel"),    { ssr: false });

// Below-the-fold sections — code-split so the hero + letter load first
const LoveMeter        = dynamic(() => import("@/components/LoveMeter"));
const WishJar          = dynamic(() => import("@/components/WishJar"));
const LuckyWheel       = dynamic(() => import("@/components/LuckyWheel"));
const CatchHearts      = dynamic(() => import("@/components/CatchHearts"));
const PromiseSection   = dynamic(() => import("@/components/PromiseSection"));
const WeddingDream     = dynamic(() => import("@/components/WeddingDream"));
const OpenWhenLetters  = dynamic(() => import("@/components/OpenWhenLetters"));
const FortuneCookie    = dynamic(() => import("@/components/FortuneCookie"));
const MusicPlayer      = dynamic(() => import("@/components/MusicPlayer"));
const EasterEgg        = dynamic(() => import("@/components/EasterEgg"));

export default function HomePage() {
  return (
    <>
      {/* Fixed full-page layers */}
      <PixelSpaceBackground />
      <FloatingStickers />
      <Navigation />
      <CursorTeddy />
      <AchievementsPanel />

      <main id="main-content">
        <Hero />
        <DailyLoveMessage />
        <LoveLetter />
        <Timeline />
        <Reasons />
        <Countdown />
        <LoveMeter />
        <WishJar />
        <LuckyWheel />
        <CatchHearts />
        <PromiseSection />
        <WeddingDream />
        <OpenWhenLetters />
        <FortuneCookie />
        <MusicPlayer />
        <EasterEgg />
      </main>
      <Footer />
    </>
  );
}
