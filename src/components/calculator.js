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

  const previewHistory = () => {
    const doc = new jsPDF();

    // Set font and title
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Historial de Cálculos", 10, 10);

    // Add a border around the PDF to mimic a receipt look
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287); // Border of the ticket

    const startY = 60; // Ajustar el espacio para que no se sobreponga con el logo

    // Add the date (optional)
    doc.setFontSize(12);
    doc.text("Fecha: " + new Date().toLocaleDateString(), 10, startY);

    // Add history entries
    let y = startY + 10;
    history.forEach((entry, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}: ${entry}`, 10, y);
      y += 10;

      if (y < 270) {
        doc.line(10, y, 200, y); // Horizontal line to separate entries
      }
      y += 5;
    });

    // Footer
    doc.setFontSize(10);
    doc.text("¡Gracias por usar nuestra calculadora!", 10, y + 10);

    // Get the PDF data as a data URL (for preview)
    const pdfDataUrl = doc.output("datauristring");

    // Open the preview in an iframe
    const previewWindow = window.open("", "", "width=800,height=600");
    previewWindow.document.write(
      `<iframe src="${pdfDataUrl}" width="100%" height="100%" frameborder="0"></iframe>`
    );
  };

  const exportHistory = () => {
    const doc = new jsPDF();

    // Set the font
    doc.setFont("Helvetica", "normal");

    // Title: Ticket de Venta
    doc.setFontSize(16);
    doc.text("Historial de Cálculos", 10, 10);

    // Add a border around the PDF to mimic a receipt look
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287); // Border of the ticket

    // Add some padding between content and borders
    const startY = 30;

    // Print a sample operation or date for context (optional)
    doc.setFontSize(12);
    doc.text("Fecha: " + new Date().toLocaleDateString(), 10, startY);

    // Add the history entries to the PDF with some nice formatting
    let y = startY + 10; // Position for first entry
    history.forEach((entry, index) => {
      // Use the current index and entry for printing
      doc.setFontSize(12);
      doc.text(`${index + 1}: ${entry}`, 10, y);
      y += 10; // Move down for the next entry

      // Add a line after each entry
      if (y < 270) {
        // To avoid overflowing
        doc.line(10, y, 200, y); // Horizontal line to separate entries
      }
      y += 5; // Add space after the line
    });

    // Add footer (optional)
    doc.setFontSize(10);
    doc.text("¡Gracias por usar nuestra calculadora!", 10, y + 10);

    // Save the PDF with a dynamic name
    doc.save("historial_calculos.pdf");
  };

  return (
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
        <div>
          <button onClick={printHistory} className="button button-print">
            Imprimir
          </button>
        </div>
        <div>
          <button onClick={exportHistory} className="button button-export">
            Exportar
          </button>
        </div>
        <div>
          <button onClick={previewHistory} className="button button-preview">
            Previsualizar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
