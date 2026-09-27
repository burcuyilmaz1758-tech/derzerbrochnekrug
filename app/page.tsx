"use client";

import { useMemo, useState } from "react";

type Level = "foerder" | "basis" | "erweitert";
type Step = 1 | 2 | 3;

type PlotCard = {
  id: number;
  act: string;
  title: string;
  text: string;
};

const plotSolution: PlotCard[] = [
  { id: 8, act: "8", title: "Getränke", text: "Adam lässt Wasser bringen und bietet Walter Wasser oder Wein an." },
  { id: 9, act: "9", title: "Eves Aussage", text: "Eve entlastet Ruprecht. Frau Brigitte soll als Zeugin geholt werden." },
  { id: 10, act: "10", title: "Pause und Nachfragen", text: "Licht holt Brigitte. Adam bewirtet Walter und sucht das Gespräch mit Eve." },
  { id: 11, act: "11", title: "Entlarvung", text: "Brigittes Funde weisen auf Adam. Eve bricht ihr Schweigen; Adam flieht." },
  { id: 12, act: "12", title: "Amtsmissbrauch", text: "Adams Täuschung und sein Versuch, in Eves Zimmer zu gelangen, werden aufgeklärt." },
  { id: 125, act: "V", title: "Variant zum 12. Auftritt", text: "Die längere ursprüngliche Fassung erklärt Eves Lage, Adams Täuschung und die Vertrauensfrage ausführlicher." },
  { id: 13, act: "13", title: "Offener Krugfall", text: "Über den Krug wird nicht abschließend geurteilt; Marthe wird an ein höheres Gericht verwiesen." },
];

const initialPlot = [plotSolution[3], plotSolution[0], plotSolution[5], plotSolution[2], plotSolution[6], plotSolution[1], plotSolution[4]];

const relationTokens = [
  { id: "family", text: "Schwester von Veit · Tante von Ruprecht" },
  { id: "evidence", text: "findet Perücke und verfolgt Fußspuren" },
  { id: "eve", text: "entlastet Ruprecht und beschuldigt Adam" },
  { id: "authority", text: "Adams Autorität bricht zusammen" },
];

const relationSlots = [
  { id: "family", label: "Frau Brigitte ↔ Veit/Ruprecht", className: "slot-family" },
  { id: "evidence", label: "Frau Brigitte → Adam", className: "slot-evidence" },
  { id: "eve", label: "Eve → Adam/Ruprecht", className: "slot-eve" },
  { id: "authority", label: "Folge der Aufklärung", className: "slot-authority" },
];

const levelHints: Record<Level, { figure: string; plot: string; question: string }> = {
  foerder: {
    figure: "Ordnet zuerst die Verwandtschaft zu. Fragt danach: Wer liefert welches Wissen?",
    plot: "Start: Adam bewirtet Walter. Ende: Über den Krug wird noch nicht geurteilt.",
    question: "Satzstarter: Unklar geblieben ist mir … / Ich denke, dass …, weil …",
  },
  basis: {
    figure: "Ergänzt nur die Beziehungen, die sich durch die Auftritte 8–13 neu ergeben.",
    plot: "Ordnet danach, wie sich der Verdacht Schritt für Schritt zur Entlarvung verdichtet.",
    question: "Formuliert eine echte Verständnis- oder Deutungsfrage zur Ganzlektüre.",
  },
  erweitert: {
    figure: "Achtet zusätzlich darauf, wer durch Brigittes Aussage Autorität gewinnt oder verliert.",
    plot: "Erklärt anschließend, warum Kleist die vollständige Aufklärung bis zum Schluss verzögert.",
    question: "Verbindet eure Frage mit Gerechtigkeit, Macht oder Vertrauen in die Rechtsprechung.",
  },
};

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  const [level, setLevel] = useState<Level>("basis");
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [figureChecked, setFigureChecked] = useState(false);
  const [plot, setPlot] = useState(initialPlot);
  const [dragPlot, setDragPlot] = useState<number | null>(null);
  const [plotChecked, setPlotChecked] = useState(false);
  const [variantAnswer, setVariantAnswer] = useState("");
  const [variantChecked, setVariantChecked] = useState(false);
  const [prompt, setPrompt] = useState("Was ist dir nach der Lektüre unklar geblieben?");
  const [question, setQuestion] = useState("");

  const figureCorrect = useMemo(
    () => relationSlots.every((slot) => assignments[slot.id] === slot.id),
    [assignments],
  );
  const plotCorrect = useMemo(
    () => plot.every((card, index) => card.id === plotSolution[index].id),
    [plot],
  );

  const placeRelation = (slotId: string, tokenId = selectedToken) => {
    if (!tokenId) return;
    const next = { ...assignments };
    for (const key of Object.keys(next)) if (next[key] === tokenId) delete next[key];
    next[slotId] = tokenId;
    setAssignments(next);
    setSelectedToken(null);
    setFigureChecked(false);
  };

  const returnRelation = (slotId: string) => {
    const next = { ...assignments };
    delete next[slotId];
    setAssignments(next);
    setFigureChecked(false);
  };

  const movePlot = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= plot.length) return;
    const next = [...plot];
    [next[index], next[target]] = [next[target], next[index]];
    setPlot(next);
    setPlotChecked(false);
  };

  const dropPlot = (targetId: number) => {
    if (dragPlot === null || dragPlot === targetId) return;
    const next = [...plot];
    const from = next.findIndex((card) => card.id === dragPlot);
    const to = next.findIndex((card) => card.id === targetId);
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setPlot(next);
    setDragPlot(null);
    setPlotChecked(false);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <strong>Der zerbrochne Krug</strong>
          <span>Ganzlektüre sichern · Q1</span>
        </div>
        <label>
          Hilfe
          <select value={level} onChange={(event) => setLevel(event.target.value as Level)}>
            <option value="foerder">Förder</option>
            <option value="basis">Basis</option>
            <option value="erweitert">Erweitert</option>
          </select>
        </label>
      </header>

      <nav className="stepper" aria-label="Arbeitsschritte">
        <button className={step === 1 ? "active" : ""} onClick={() => setStep(1)}><b>1</b><span>Figuren</span><small>7 Min.</small></button>
        <i />
        <button className={step === 2 ? "active" : ""} onClick={() => setStep(2)}><b>2</b><span>Handlung</span><small>10 Min.</small></button>
        <i />
        <button className={step === 3 ? "active" : ""} onClick={() => setStep(3)}><b>3</b><span>Fragen</span><small>15 Min.</small></button>
      </nav>

      {step === 1 && (
        <section className="activity">
          <div className="activity-head">
            <div><span>AUFGABE 1 · PARTNERARBEIT</span><h1>Figurenkonstellation ergänzen</h1><p>Das Schaubild zeigt euren Stand bis zum 7. Auftritt. Ergänzt nur die vier neuen Beziehungen.</p></div>
            <div className="time">7 <small>Min.</small></div>
          </div>

          <div className="hint">{levelHints[level].figure}</div>

          <div className="token-tray" aria-label="Zuordnungskarten">
            {relationTokens.filter((token) => !Object.values(assignments).includes(token.id)).map((token) => (
              <button
                key={token.id}
                className={selectedToken === token.id ? "token selected" : "token"}
                draggable
                onDragStart={() => setSelectedToken(token.id)}
                onClick={() => setSelectedToken(token.id)}
              >{token.text}</button>
            ))}
          </div>
          <p className="micro-help">Karte anklicken und anschließend das passende gestrichelte Feld wählen – oder direkt hineinziehen.</p>

          <div className="diagram-scroll">
            <div className="figure-diagram">
              <div className="node marthe">Frau Marthe<small>Mutter · Klägerin</small></div>
              <div className="node eve">Eve<small>Tochter · unter Druck</small></div>
              <div className="node ruprecht">Ruprecht<small>Verlobter · beschuldigt</small></div>
              <div className="node walter">Walter<small>kontrolliert Adam</small></div>
              <div className="node adam">Adam<small>Richter ↔ Täter</small></div>
              <div className="node licht">Licht<small>beobachtet Adam</small></div>
              <div className="node brigitte">Frau Brigitte<small>neue Zeugin</small></div>
              <div className="node veit">Veit Tümpel<small>Ruprechts Vater</small></div>

              <span className="known k1">Mutter / Tochter</span>
              <span className="known k2">verlobt · Konflikt</span>
              <span className="known k3">beschuldigt</span>
              <span className="known k4">setzt unter Druck</span>
              <span className="known k5">Vorgesetzter</span>
              <span className="known k6">beobachtet</span>
              <span className="known k7">Vater / Sohn</span>

              {relationSlots.map((slot) => {
                const tokenId = assignments[slot.id];
                const token = relationTokens.find((item) => item.id === tokenId);
                const wrong = figureChecked && tokenId !== slot.id;
                const right = figureChecked && tokenId === slot.id;
                return (
                  <button
                    key={slot.id}
                    className={`dropzone ${slot.className} ${wrong ? "wrong" : ""} ${right ? "right" : ""}`}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => placeRelation(slot.id)}
                    onClick={() => token ? returnRelation(slot.id) : placeRelation(slot.id)}
                  >
                    <small>{slot.label}</small>
                    <strong>{token ? token.text : "+ Karte ablegen"}</strong>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="actionbar">
            <button className="check" onClick={() => setFigureChecked(true)}>Lösung prüfen</button>
            {figureChecked && <span className={figureCorrect ? "ok" : "no"}>{figureCorrect ? "Richtig! Jetzt Screenshot erstellen und in OneNote hochladen." : "Noch nicht ganz – vertauschte Karten zurücknehmen und neu zuordnen."}</span>}
            <button className="next" onClick={() => setStep(2)}>Weiter zur Handlung →</button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="activity">
          <div className="activity-head">
            <div><span>AUFGABE 2 · EINZELARBEIT, DANN VERGLEICH</span><h1>Handlung 8–13 ordnen</h1><p>Bringt die Karten in die richtige Reihenfolge. Der Variant gehört als Alternative direkt zum 12. Auftritt.</p></div>
            <div className="time">10 <small>Min.</small></div>
          </div>

          <div className="hint">{levelHints[level].plot}</div>

          <div className="sort-list">
            {plot.map((card, index) => (
              <article
                key={card.id}
                className="sort-card"
                draggable
                onDragStart={() => setDragPlot(card.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => dropPlot(card.id)}
              >
                <span className="handle">⋮⋮</span>
                <span className="order">{plotChecked && plotCorrect ? card.act : index + 1}</span>
                <div><strong>{card.title}</strong><p>{card.text}</p></div>
                <div className="arrows"><button onClick={() => movePlot(index, -1)} disabled={index === 0}>↑</button><button onClick={() => movePlot(index, 1)} disabled={index === plot.length - 1}>↓</button></div>
              </article>
            ))}
          </div>

          <div className="actionbar">
            <button className="check" onClick={() => setPlotChecked(true)}>Reihenfolge prüfen</button>
            {plotChecked && <span className={plotCorrect ? "ok" : "no"}>{plotCorrect ? "Richtig! Screenshot erstellen und in OneNote unter ‚Handlungsverlauf‘ hochladen." : "Noch nicht richtig. Die Bewirtung eröffnet den zweiten Teil; der Krugfall bleibt zuletzt offen."}</span>}
            <button className="next" onClick={() => setStep(3)}>Weiter zu den Fragen →</button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="activity compact-activity">
          <div className="activity-head">
            <div><span>AUFGABE 3 · THINK–PAIR–SHARE</span><h1>Offene Fragen klären</h1><p>Wählt einen Impuls, notiert eure Antwort und übertragt die wichtigste Frage in OneNote.</p></div>
            <div className="time">15 <small>Min.</small></div>
          </div>

          <div className="hint">{levelHints[level].question}</div>

          <div className="prompt-row">
            {["Was ist dir nach der Lektüre unklar geblieben?", "Welche Figur beurteilst du anders als zu Beginn?", "Wer trägt welche Schuld?", "Was hat dir gefallen oder nicht gefallen?"].map((item) => (
              <button key={item} className={prompt === item ? "prompt active" : "prompt"} onClick={() => setPrompt(item)}>{item}</button>
            ))}
          </div>
          <label className="question-box"><span>{prompt}</span><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Notiere hier deine Antwort oder offene Frage …" /></label>
          <div className="one-note">1. still notieren · 2. zu zweit vergleichen · 3. wichtigste Frage in OneNote eintragen</div>

          <div className="variant-check">
            <div><b>Variant-Check</b><span>Was ist der Variant?</span></div>
            <button className={variantAnswer === "fourteen" ? "chosen" : ""} onClick={() => { setVariantAnswer("fourteen"); setVariantChecked(false); }}>ein zusätzlicher 14. Auftritt</button>
            <button className={variantAnswer === "original" ? "chosen" : ""} onClick={() => { setVariantAnswer("original"); setVariantChecked(false); }}>die längere ursprüngliche Fassung des 12. Auftritts</button>
            <button className="small-check" onClick={() => setVariantChecked(true)}>prüfen</button>
          </div>
          {variantChecked && <div className={variantAnswer === "original" ? "variant-result ok" : "variant-result no"}>{variantAnswer === "original" ? "Richtig. Der Variant erklärt vor allem Eves Lage, Adams Täuschung und die Vertrauensfrage ausführlicher." : "Nicht ganz. Der Variant ist kein neuer Auftritt, sondern eine alternative Langfassung des 12. Auftritts."}</div>}

          <div className="finish-box"><b>Exit-Ticket</b><span>„In der nächsten Stunde möchte ich vor allem klären, …“</span></div>
        </section>
      )}

      <footer>
        <span>45 Minuten · Figuren → Handlung → offene Fragen</span>
        <a href="https://learningapps.org/53819527" target="_blank" rel="noreferrer">Sprinter: weitere LearningApp ↗</a>
      </footer>
    </main>
  );
}
