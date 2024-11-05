import logo from "./logo.svg";
import "./App.css";
import Calculator from "./components/calculator";
import DollarPrice from "./components/price";

function App() {
  return (
    (
      <div className="App">
        <Calculator /> {/* Usa el componente aquí */}
      </div>
    ),
    (
      <div>
        <h1>Dollar Price Checker</h1>
        <DollarPrice />
      </div>
    )
  );
}

export default App;
