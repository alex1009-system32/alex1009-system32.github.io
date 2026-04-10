import About from "./components/About";
import Header from "./components/Header";

function App() {
  return (
    <>
      <div className="bg-sand-500 bg-[https://www.transparenttextures.com/patterns/p6-mini.png]">
        <div className="px-96 py-9">
          <Header />
          <About />
        </div>
      </div>
    </>
  );
}

export default App;
