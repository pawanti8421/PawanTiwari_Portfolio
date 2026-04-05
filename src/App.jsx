import { useState, lazy, Suspense } from "react";
import { Cursor, ScrollBar, Loader, Navbar, Footer } from "@/components";

const Hero = lazy(() => import("@/sections/Hero"));
const About = lazy(() => import("@/sections/About"));
const Skills = lazy(() => import("@/sections/Skills"));
const Experience = lazy(() => import("@/sections/Experience"));
const Projects = lazy(() => import("@/sections/Projects"));
const Terminal = lazy(() => import("@/sections/Terminal"));
const GitHub = lazy(() => import("@/sections/GitHub"));
const Resume = lazy(() => import("@/sections/Resume"));
const Contact = lazy(() => import("@/sections/Contact"));
const Education = lazy(() => import("@/sections/Education"));
const GameIntro = lazy(() => import("@/sections/GameIntro"));

function SectionFallback() {
  return (
    <div
      style={{
        height: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text3)",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
      }}
    >
      Loading...
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Cursor />
      <ScrollBar />
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease",
          pointerEvents: loaded ? "auto" : "none",
          animation: "fadeIn 0.8s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <Navbar />
        <main>
          <Suspense fallback={<SectionFallback />}>
            <Hero />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <About />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Education />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Skills />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Experience />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Projects />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Terminal />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <GameIntro />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <GitHub />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Resume />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
