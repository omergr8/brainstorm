import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AudioStream from "./components/AudioStream";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <AudioStream />
        <Home />
      </div>
      <Footer />
    </div>
  );
}

export default App;
