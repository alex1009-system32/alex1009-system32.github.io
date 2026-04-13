import About from "./components/About";
import Header from "./components/Header";
import Skills from "./components/Skills";
import Projects from "./components/Projects";

function App() {
  return (
    <>
      <div className="bg-sand-500 bg-[https://www.transparenttextures.com/patterns/p6-mini.png]">
        <div className="px-96 py-9 font-mono text-wood-950 selection:bg-wood-950 selection:text-sand-500">
          <Header />
          <About />
          <Skills />
          <Projects />
        </div>
      </div>
    </>
  );
}

export default App;
