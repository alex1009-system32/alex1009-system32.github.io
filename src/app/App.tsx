import { GITHUB_USERNAME } from "@/lib/config";
import Header from "@/sections/Header";
import About from "@/sections/About";
import Skills from "@/sections/Skills";
import Projects from "@/sections/Projects";

function App() {
  return (
    <>
      <div className="bg-sand-500 bg-[https://www.transparenttextures.com/patterns/p6-mini.png]">
        <div className="max-w-4xl mx-auto px-6 py-3 font-mono text-wood-950 selection:bg-wood-950 selection:text-sand-500 selection:decoration-sand-500">
          <Header username={GITHUB_USERNAME} />
          <About username={GITHUB_USERNAME} />
          <Skills />
          <Projects username={GITHUB_USERNAME} />
        </div>
      </div>
    </>
  );
}

export default App;
