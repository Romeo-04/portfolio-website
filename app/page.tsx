import IntroOverlay from "@/components/intro-overlay";
import GalaxyBackground from "@/components/galaxy-background";
import OrbNavigator from "@/components/orb-navigator";
import TopNav from "@/components/top-nav";
import Marquee from "@/components/marquee";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Skills from "@/components/sections/skills";
import Experience from "@/components/sections/experience";
import Projects from "@/components/sections/projects";
import GithubSection from "@/components/sections/github";
import Achievements from "@/components/sections/achievements";
import Certifications from "@/components/sections/certifications";
import Contact from "@/components/sections/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <GalaxyBackground />
      <TopNav />

      <main className="relative">
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <GithubSection />
        <Certifications />
        <Contact />
        <Footer />
      </main>

      <OrbNavigator />
    </>
  );
}
