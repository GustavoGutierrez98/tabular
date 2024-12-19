import React, { useState, useEffect, useCallback } from "react";
import "./calculator.css";
import jsPDF from "jspdf";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, Box } from "@mui/material";

function Calculator() {
  const [display, setDisplay] = useState("");
  const [history, setHistory] = useState([]);

  const handleButtonClick = (value) => {
    setDisplay(display + value);
  };

  const clearDisplay = () => setDisplay("");

  const calculateResult = () => {
    try {
      const result = Function('"use strict";return (' + display + ")")();
      setDisplay(result.toString());
      setHistory([...history, `${display} = ${result}`]);
    } catch {
      setDisplay("Error");
    }
  };

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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const exportHistory = () => {
    const doc = new jsPDF();

    // Title and Date
    const date = new Date().toLocaleDateString();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Historial de Cálculos`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Fecha: ${date}`, 150, 10);

    // Draw Ticket Border
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287);

    // Add History Entries
    doc.setFontSize(12);
    let y = 30; // Starting Y position
    history.forEach((entry, index) => {
      doc.text(`${index + 1}: ${entry}`, 10, y);
      y += 10;
    });

    // Footer
    doc.setFontSize(10);
    doc.text("¡Gracias por usar nuestra calculadora!", 10, y + 10);

    // Save the PDF
    doc.save("historial_calculos.pdf");
  };

  const printHistory = () => {
    const printWindow = window.open("", "_blank");
    const content = `
      <h2>Historial de Cálculos</h2>
      <p>Fecha: ${new Date().toLocaleDateString()}</p>
      <ul>
        ${history.map((entry) => `<li>${entry}</li>`).join("")}
      </ul>
      <footer>¡Gracias por usar nuestra calculadora!</footer>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      {/* AppBar Section */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            My Calculator App
          </Typography>
          <Button color="inherit" onClick={exportHistory}>
            Export History
          </Button>
          <Button color="inherit" onClick={printHistory}>
            Print
          </Button>
        </Toolbar>
      </AppBar>

      {/* Calculator Section */}
      <div className="calculator-container">
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
          </div>
        </div>

        {/* Sidebar for History */}
        <div className="calculator-sidebar">
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
      </div>
    </div>
  );
}

export default Calculator;
