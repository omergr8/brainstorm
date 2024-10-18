import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AudioStream from "./components/AudioStream";

function App() {
  return (
    <div className="App">
      <Navbar />
      <AudioStream />
      <Footer />
    </div>
  );
}

export default App;
