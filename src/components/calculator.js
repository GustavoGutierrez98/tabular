import React, { useState, useEffect, useCallback } from "react";
import "./calculator.css";
import jsPDF from "jspdf"; // Importa jsPDF

function Calculator() {
  const [display, setDisplay] = useState("");
  const [history, setHistory] = useState([]);

  const handleButtonClick = (value) => {
    setDisplay(display + value);
  };

  const clearDisplay = () => setDisplay("");

  const calculateResult = () => {
    try {
      // Using a safer approach to evaluate the mathematical expression
      const result = Function('"use strict";return (' + display + ")")();
      setDisplay(result.toString());
      setHistory([...history, `${display} = ${result}`]);
    } catch {
      setDisplay("Error");
    }
  };

  // Use useCallback to memoize handleKeyPress and avoid unnecessary rerenders
  const handleKeyPress = useCallback(
    (event) => {
      const key = event.key;
      if (!isNaN(key) || ["+", "-", "*", "/"].includes(key)) {
        handleButtonClick(key);
      } else if (key === "Enter") {
        calculateResult();
      } else if (key === "Backspace") {
        setDisplay(display.slice(0, -1));
      } else if (key === "Escape") {
        clearDisplay();
      }
    },
    [display, calculateResult]
  );

  // Escucha eventos de teclado
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const printHistory = () => {
    const printContent = document.createElement("div");
    printContent.innerHTML = `<h3>Historial de Operaciones</h3><ul>${history
      .map((entry) => `<li>${entry}</li>`)
      .join("")}</ul>`;

    const newWin = window.open("", "", "height=400,width=600");
    newWin.document.write(printContent.innerHTML);
    newWin.document.close();
    newWin.print();
  };

  const exportHistory = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    // Título del ticket
    doc.text("Historial de Cálculos", 10, 10);

    // Agrega cada entrada del historial al PDF
    history.forEach((entry, index) => {
      doc.text(`${index + 1}: ${entry}`, 10, 20 + index * 10);
    });

    // Descarga el PDF
    doc.save("historial_calculos.pdf");
  };

  return (
    <div className="calculator">
      <div className="calculator-display">{display}</div>
      <div className="calculator-buttons">
        {[1, 2, 3, "+", 4, 5, 6, "-", 7, 8, 9, "*", "C", 0, "=", "/"].map(
          (btn) => (
            <button
              key={btn}
              onClick={() =>
                btn === "="
                  ? calculateResult()
                  : btn === "C"
                  ? clearDisplay()
                  : handleButtonClick(btn)
              }
              className={`button ${isNaN(btn) ? "operator" : "number"}`}
            >
              {btn}
            </button>
          )
        )}
        <button onClick={printHistory} className={`button button-print`}>
          Imprimir
        </button>
        <button onClick={exportHistory} className={`button button-export`}>
          Exportar Historial
        </button>
      </div>
      <div className="calculator-history">
        <h3>Historial de Operaciones</h3>
        <ul>
          {history.length > 0 ? (
            history.map((entry, index) => <li key={index}>{entry}</li>)
          ) : (
            <li>No hay historial de cálculos.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Calculator;
