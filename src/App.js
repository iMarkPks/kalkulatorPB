import React, { useState, useRef } from "react";
import "./App.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const assessments = [
  { id: "quiz1", label: "Quiz 1", max: 100, weight: 5 },
  { id: "quiz2", label: "Quiz 2", max: 100, weight: 5 },
  { id: "test1", label: "Test 1", max: 100, weight: 10 },
  { id: "test2", label: "Test 2", max: 100, weight: 10 },
  { id: "practical", label: "Practical Exercise", max: 100, weight: 10 },
  { id: "caseStudy", label: "Case Study", max: 100, weight: 10 }
];

function App() {
  const [name, setName] = useState("");
  const [scores, setScores] = useState({});
  const [total, setTotal] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [course, setCourse] = useState("Telecommunication Network (DEP30083)");
  const slipRef = useRef();

  const handleScore = (e) => {
    setScores({ ...scores, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    let sum = 0;
    assessments.forEach(({ id, max, weight }) => {
      const raw = parseFloat(scores[id]);
      if (!isNaN(raw)) {
        const pct = (raw / max) * 100;
        sum += (pct * weight) / 100;
      }
    });
    const final = +sum.toFixed(2);
     const converted = +((final / 50) * 100).toFixed(2);
     setTotal(converted);

    if (converted < 40) setFeedback("🔴 Markah anda di bawah kelayakan.");
    
    else setFeedback("🟢 Tahniah! Anda layak.");
  };

  const reset = () => {
    setName("");
    setScores({});
    setTotal(null);
    setFeedback("");
  };

  const savePDF = () => {
    if (!slipRef.current) return;
    html2canvas(slipRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 190;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
      const fileName = name ? `Slip_${name}.pdf` : "Slip_Markah.pdf";
      pdf.save(fileName);
    });
  };

  return (
    <div className="container">
      <img src="/logo-pks.png" alt="Logo PKS" className="logo" />
      <h2>📘 iMark Kalkulator</h2>
      <h3>Kira Markah PB • Layak menduduki final?</h3>

      <div className="row">
        <label>Pilih Course </label>
        <select value={course} onChange={(e) => setCourse(e.target.value)}
          className="course-select">

      
          
          <option value="Financial Accounting 3(DPA30053)">
            Financial Accounting 3(DPA30053)
          </option>
          <option value="Financial Accounting 5 (DPA50143)">
            Financial Accounting 5 (DPA50143)
          </option>
        </select>
      </div>

      <div className="row">
        <label>Nama Pelajar </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Ali Bin Abu"
        />
      </div>

      {/* TABLE UNTUK MARKAH */}
      <table className="mark-table">
        <thead>
          <tr>
            <th>Assessment</th>
            <th>Max</th>
            <th>Weight (%)</th>
            <th>Markah</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map(({ id, label, max, weight }) => (
            <tr key={id}>
              <td>{label}</td>
              <td>{max}</td>
              <td>{weight}</td>
              <td>
                <input
                  type="number"
                  name={id}
                  value={scores[id] || ""}
                  onChange={handleScore}
                  placeholder={`0-${max}`}
                  min="0"
                  max={max}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={calculate}>Kira Jumlah</button>
      <button className="secondary" onClick={reset}>
        Reset
      </button>

      {total !== null && (
        <div className="result" ref={slipRef}>
          <h3>Slip Markah • {name || "Tanpa Nama"}</h3>
          <h4>Subjek: {course}</h4>
          <p>
            Jumlah Berwajaran: <strong>{total}%</strong>
          </p>
          <p>{feedback}</p>
        </div>
      )}

      {total !== null && (
        <button className="pdf" onClick={savePDF}>
          💾 Save ke PDF
        </button>
      )}
    </div>
  );
}

export default App;
