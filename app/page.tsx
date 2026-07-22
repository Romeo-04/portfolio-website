import Sidebar from "@/components/sidebar";
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
    <div className="flex justify-center px-4 py-7 sm:px-6 lg:px-7">
      <div className="flex w-full max-w-[1180px] flex-col gap-5 lg:flex-row">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col gap-5">
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <GithubSection />
          <Achievements />
          <Certifications />
          <Contact />
          <Footer />
        </main>
      </div>
    </div>
  );
}
