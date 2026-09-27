"use client";

import { useMemo, useState } from "react";

type Level = "foerder" | "basis" | "erweitert";
type Step = 1 | 2;

type PlotCard = {
  id: number;
  act: string;
  title: string;
  text: string;
};

const knownPlot: PlotCard[] = [
  {
    id: 1,
    act: "1",
    title: "Die angekündigte Revision",
    text: "Licht findet Adam verletzt vor und kündigt die Revision durch Gerichtsrat Walter an. Adam glaubt ihm zunächst nicht, dann versucht er, Licht mit dem Versprechen einer Beförderung auf seine Seite zu ziehen (V. 129–133).",
  },
  {
    id: 2,
    act: "2",
    title: "Adam in Schwierigkeiten",
    text: "Als ein Bediensteter des Gerichtsrats dessen Ankunft meldet, gerät Adam in Panik. Er will sich ankleiden, dann entschuldigen lassen und schließlich den Besucher üppig bewirten. Seine Verwundung und die fehlende Perücke, für die er sich Ersatz vom Küster erhofft, bringen ihn in Erklärungsnot.",
  },
  {
    id: 3,
    act: "3",
    title: "Adams Traum",
    text: "Adam erzählt Licht, dass er im Traum als Richter angeklagt worden sei und sich selbst verurteilt habe.",
  },
  {
    id: 4,
    act: "4",
    title: "Ankunft des Gerichtsrats",
    text: "Nachdem ihn Adam übertrieben herzlich begrüßt hat, erklärt Walter, die ländliche Rechtspflege erkunden und verbessern zu wollen. Von dem Vorfall im Nachbardorf unangenehm berührt, stellt der Gerichtsrat auch in Huisum Unstimmigkeiten fest.",
  },
  {
    id: 5,
    act: "5",
    title: "Fehlende Perücke",
    text: "Da Adam keine Perücke zur Verfügung steht und Walter nicht warten kann, muss der Richter ohne sie die Verhandlung beginnen. Der Gerichtsrat bedauert Adam wegen dessen Verletzungen.",
  },
  {
    id: 6,
    act: "6",
    title: "Die Gegner",
    text: "Marthe Rull sucht Recht wegen eines zerbrochenen Krugs, den sie für unersetzlich hält. Die Umstände, wie es zu dem Schaden kam, veranlassen Ruprecht, die Verlobung mit Eve, Marthes Tochter, aufzukündigen und sie als „Metze“ zu beschimpfen. Eve will vermitteln, aber ihre Mutter den Ruf der jungen Frau retten.",
  },
  {
    id: 7,
    act: "7",
    title: "Verhandlung I: Frau Marthe, Ruprecht",
    text: "Der erschrockene Richter redet auf Eve ein, bis ihn Walter ermahnt, die Verhandlung ordnungsgemäß zu führen. In deren Verlauf muss der Gerichtsrat immer wieder eingreifen und drohen, das Verfahren Licht zu übergeben. Denn Adam beschuldigt Ruprecht und beruft sich auf die rechtlichen Gepflogenheiten in Huisum. Frau Marthe beschreibt die zerstörte Abbildung und die Geschichte des Krugs und schildert die Ereignisse der vergangenen Nacht in Eves Zimmer aus ihrer Sicht. Der Schuldige sei Ruprecht, was ihre Tochter zu bestätigen scheint, der Verlobte jedoch bestreitet. Dieser erzählt nun seinerseits, wie er das Geschehen erlebt hat, und verdächtigt den Schuster Lebrecht. Marthe dagegen verlangt, dass Eve die Überzeugung der Mutter mit ihrer Aussage beweise.",
  },
];

const plotSolution: PlotCard[] = [
  { id: 8, act: "8", title: "Getränke", text: "Adam lässt sich ein Glas Wasser bringen und bietet Walter ebenfalls eines oder Wein an." },
  { id: 9, act: "9", title: "Verhandlung II: Eve", text: "Von Adam, der die Verhandlung schnell beenden will, und Marthe, die von ihrer Auffassung, wer den Krug zerbrochen hat, nicht abrückt, unter Druck gesetzt, beteuert Eve, dass es ihr Verlobter nicht gewesen sei. Ihre Mutter verdächtigt das Paar nun, seine Flucht vorbereitet zu haben: Frau Brigitte habe es in Marthes Garten beobachtet und solle es bezeugen." },
  { id: 10, act: "10", title: "Bewirtung und Zwischenfragen", text: "Während Licht Frau Brigitte herbeiholt, nutzt Adam die Verhandlungspause, um Walter zu bewirten, und sucht nach einer Gelegenheit, um mit Eve allein zu sprechen. Fragen des Gerichtsrats kommen dem Dorfrichter als Täter immer näher, der sich dem Verdacht weiterhin zu entziehen versucht." },
  { id: 11, act: "11", title: "Entlarvung", text: "Frau Brigitte berichtet vom Fund der Perücke vor Eves Fenster, von der Spur zweier ungleicher Füße und weiteren Anzeichen, die auf Adam deuten. Der Dorfrichter gesteht aber immer noch nicht und will Ruprecht bestrafen. Deshalb schweigt dessen Verlobte nicht länger. Sie fordert den zu Unrecht Verurteilten auf, mit Gewalt gegen Adam vorzugehen, der aber entkommt, sodass die Prügel nur den Mantel treffen." },
  { id: 12, act: "12", title: "Amtsmissbrauch", text: "Es stellt sich heraus, dass Adam sich durch Betrug Zugang zu Eves Zimmer verschaffen wollte." },
  { id: 13, act: "13", title: "Der Krug", text: "Da wegen des zerbrochenen Krugs kein Urteil gefällt worden ist, verweist der Gerichtsrat Frau Marthe an eine höhere Instanz." },
];

const initialPlot = [plotSolution[3], plotSolution[0], plotSolution[5], plotSolution[2], plotSolution[1], plotSolution[4]];
const completePlot = [...knownPlot, ...plotSolution];

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

const levelHints: Record<Level, { figure: string; plot: string }> = {
  foerder: {
    figure: "Ordnet zuerst die Verwandtschaft zu. Fragt danach: Wer liefert welches Wissen?",
    plot: "Start: Adam bewirtet Walter. Ende: Über den Krug wird noch nicht geurteilt.",
  },
  basis: {
    figure: "Ergänzt nur die Beziehungen, die sich durch die Auftritte 8–13 neu ergeben.",
    plot: "Ordnet danach, wie sich der Verdacht Schritt für Schritt zur Entlarvung verdichtet.",
  },
  erweitert: {
    figure: "Achtet zusätzlich darauf, wer durch Brigittes Aussage Autorität gewinnt oder verliert.",
    plot: "Erklärt anschließend, warum Kleist die vollständige Aufklärung bis zum Schluss verzögert.",
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
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">K</div>
          <div>
            <span className="course-code">GK Deutsch Q1 · Erd</span>
            <strong>Der zerbrochne Krug</strong>
            <span>Figuren verstehen · Handlung ordnen</span>
          </div>
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

      <section className="student-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span>Heinrich von Kleist</span>
          <h1 id="hero-title">Wer zerbrach den Krug – und was zerbricht noch?</h1>
          <p>Ergänzt das Beziehungsnetz der Figuren und bringt anschließend den zweiten Teil der Handlung in die richtige Reihenfolge.</p>
        </div>
        <div className="jug-scene" aria-hidden="true">
          <div className="jug-handle" />
          <div className="jug">
            <i className="crack c1" /><i className="crack c2" /><i className="crack c3" />
          </div>
          <div className="jug-shadow" />
        </div>
      </section>

      <nav className="stepper" aria-label="Arbeitsschritte">
        <button className={step === 1 ? "active" : ""} onClick={() => setStep(1)}><b>1</b><span>Figuren</span><small>7 Min.</small></button>
        <i />
        <button className={step === 2 ? "active" : ""} onClick={() => setStep(2)}><b>2</b><span>Handlung</span><small>12 Min.</small></button>
      </nav>

      {step === 1 && (
        <section className="activity">
          <div className="activity-head">
            <div><span>AUFGABE 1 · PARTNERARBEIT</span><h1>Figurenkonstellation ergänzen</h1><p>Das Schaubild zeigt euren Stand bis zum 7. Auftritt. Ergänzt nur die vier neuen Beziehungen.</p></div>
            <div className="time">7 <small>Min.</small></div>
          </div>

          <ol className="instructions">
            <li>Vergleicht das Schaubild mit eurem bisherigen Ergebnis zu den Auftritten 1–7.</li>
            <li>Ordnet die vier Ergänzungskarten den passenden gestrichelten Feldern zu.</li>
            <li>Wählt <strong>„Lösung prüfen“</strong> und verbessert eure Zuordnung, falls nötig.</li>
            <li>Fotografiert die <strong>richtige Figurenkonstellation</strong> und ladet das Bild in OneNote unter <strong>„Figurenkonstellation“</strong> hoch.</li>
          </ol>

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
            {figureChecked && <span className={figureCorrect ? "ok" : "no"}>{figureCorrect ? "Richtig! Jetzt fotografieren und in OneNote hochladen." : "Noch nicht ganz – vertauschte Karten zurücknehmen und neu zuordnen."}</span>}
            <button className="next" onClick={() => setStep(2)}>Weiter zur Handlung →</button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="activity">
          <div className="activity-head">
            <div><span>AUFGABE 2 · EINZELARBEIT, DANN PARTNERVERGLEICH</span><h1>Den Handlungsverlauf vervollständigen</h1><p>Auftritt 1–7 ist bereits vorgegeben. Ihr ordnet ausschließlich die Auftritte 8–13.</p></div>
            <div className="time">12 <small>Min.</small></div>
          </div>

          <ol className="instructions">
            <li>Lest zunächst die vorgegebene Übersicht zu den Auftritten 1–7.</li>
            <li>Bringt anschließend die sechs Karten zu den Auftritten 8–13 in die richtige Reihenfolge.</li>
            <li>Vergleicht eure Reihenfolge kurz mit einer Partnerin oder einem Partner.</li>
            <li>Wählt <strong>„Reihenfolge prüfen“</strong> und verbessert sie, falls nötig.</li>
            <li>Lest anschließend den vollständigen Handlungsverlauf zu Auftritt 1–13. Erstellt davon eine Ganzseitenaufnahme und ladet sie in OneNote unter <strong>„Handlungsverlauf“</strong> hoch.</li>
          </ol>

          <div className="hint">{levelHints[level].plot}</div>

          {!(plotChecked && plotCorrect) ? (
            <>
              <section className="prior-plot" aria-labelledby="prior-heading">
                <h2 id="prior-heading">Schon bekannt: Auftritt 1–7</h2>
                <div className="plot-table">
                  <div className="plot-row plot-header"><span>Auftritt</span><span>Überschrift</span><span>Inhalt</span></div>
                  {knownPlot.map((card) => (
                    <div className="plot-row" key={card.id}>
                      <b>{card.act}</b><strong>{card.title}</strong><p>{card.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="new-plot" aria-labelledby="new-heading">
                <h2 id="new-heading">Jetzt ordnen: Auftritt 8–13</h2>
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
                      <span className="order">{index + 1}</span>
                      <div><strong>{card.title}</strong><p>{card.text}</p></div>
                      <div className="arrows"><button onClick={() => movePlot(index, -1)} disabled={index === 0}>↑</button><button onClick={() => movePlot(index, 1)} disabled={index === plot.length - 1}>↓</button></div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="complete-plot" aria-labelledby="complete-heading">
              <div className="solution-title">
                <div><span>RICHTIGE REIHENFOLGE</span><h2 id="complete-heading">Der vollständige Handlungsverlauf: Auftritt 1–13</h2></div>
                <b>✓ geprüft</b>
              </div>
              <div className="plot-table complete-table">
                <div className="plot-row plot-header"><span>Auftritt</span><span>Überschrift</span><span>Inhalt</span></div>
                {completePlot.map((card) => (
                  <div className="plot-row" key={card.id}>
                    <b>{card.act}</b><strong>{card.title}</strong><p>{card.text}</p>
                  </div>
                ))}
              </div>
              <aside className="variant-note">
                <strong>Was bedeutet „Variant“?</strong>
                <span>Der Variant ist Kleists ursprüngliche, ungekürzte Fassung des 12. Auftritts. Nach dem Misserfolg der Uraufführung 1808 kürzte Kleist diesen Auftritt stark. Der Buchausgabe von 1811 fügte er die Langfassung als Anhang wieder bei. Darin werden Eves Bericht, die Vorgeschichte des Attests und Adams Täuschung ausführlicher entfaltet.</span>
              </aside>
              <div className="screenshot-note">Erstellt jetzt eine Ganzseitenaufnahme dieser vollständigen Übersicht und ladet sie in OneNote unter <strong>„Handlungsverlauf“</strong> hoch.</div>
            </section>
          )}

          <div className="actionbar">
            {!(plotChecked && plotCorrect) && <button className="check" onClick={() => setPlotChecked(true)}>Reihenfolge prüfen</button>}
            {plotChecked && <span className={plotCorrect ? "ok" : "no"}>{plotCorrect ? "Richtig! Der vollständige Handlungsverlauf ist jetzt eingeblendet." : "Noch nicht richtig. Die Bewirtung eröffnet den zweiten Teil; der Krugfall bleibt zuletzt offen."}</span>}
          </div>
        </section>
      )}

      <footer>
        <span>Figurenkonstellation → Handlungsverlauf → Upload in OneNote</span>
      </footer>
    </main>
  );
}
