import About from "./components/About";
import Header from "./components/Header";
import Skills from "./components/Skills";
import Projects from "./components/Project";

function App() {
  const username = "alex1009-system32";

  return (
    <>
      <div className="bg-sand-500 bg-[https://www.transparenttextures.com/patterns/p6-mini.png]">
        <div className="max-w-4xl mx-auto px-6 py-3 font-mono text-wood-950 selection:bg-wood-950 selection:text-sand-500 selection:decoration-sand-500">
          <Header username={username} />
          <About username={username} />
          <Skills />
          <Projects username={username} />
        </div>
      </div>
    </>
  );
}

export default App;
