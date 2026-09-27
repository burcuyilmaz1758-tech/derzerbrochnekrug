"use client";

import { useEffect, useMemo, useState } from "react";

type Level = "foerder" | "basis" | "erweitert";
type Section = "start" | "schnellstart" | "material" | "lehrkraft";

type PlotCard = {
  id: number;
  act: number;
  title: string;
  summary: string;
};

const plotSolution: PlotCard[] = [
  { id: 8, act: 8, title: "Getränke", summary: "Adam lässt Wasser bringen und bietet Walter Wasser oder Wein an." },
  { id: 9, act: 9, title: "Eves Aussage", summary: "Eve entlastet Ruprecht. Frau Marthe vermutet Fluchtpläne; Frau Brigitte soll als Zeugin kommen." },
  { id: 10, act: 10, title: "Pause und Nachfragen", summary: "Licht holt Brigitte. Adam bewirtet Walter, sucht das Gespräch mit Eve und gerät durch Walters Fragen unter Druck." },
  { id: 11, act: 11, title: "Entlarvung", summary: "Brigittes Funde weisen auf Adam. Eve bricht ihr Schweigen, Adam flieht und verliert seine Autorität." },
  { id: 12, act: 12, title: "Amtsmissbrauch", summary: "Adams Täuschung und sein Versuch, Zugang zu Eves Zimmer zu erhalten, werden aufgeklärt." },
  { id: 13, act: 13, title: "Offener Rechtsfall", summary: "Über den Krug wird nicht abschließend geurteilt; Marthe wird an ein höheres Gericht verwiesen." },
];

const shuffledPlot = [plotSolution[2], plotSolution[0], plotSolution[4], plotSolution[1], plotSolution[5], plotSolution[3]];

const figurePrompts = [
  { id: "brigitte-veit", lead: "Frau Brigitte ist …", answer: "die Schwester von Veit und die Tante von Ruprecht.", options: ["Eves Nachbarin.", "die Schwester von Veit und die Tante von Ruprecht.", "Walters Schreiberin."] },
  { id: "brigitte-adam", lead: "Für Adams Entlarvung …", answer: "liefert sie mit Perücke und Fußspuren entscheidende Indizien.", options: ["liefert sie mit Perücke und Fußspuren entscheidende Indizien.", "bestätigt sie seine Sturzgeschichte.", "belastet sie Ruprecht endgültig."] },
  { id: "eve", lead: "Eve verändert die Konstellation, weil sie …", answer: "Ruprecht entlastet und Adam beschuldigt.", options: ["Ruprecht entlastet und Adam beschuldigt.", "weiter schweigt.", "Frau Marthe beschuldigt."] },
  { id: "walter", lead: "Walter wird zum Gegenpol Adams, indem er …", answer: "die Amtsführung kontrolliert und die Aufklärung ermöglicht.", options: ["Adam bei der Flucht hilft.", "die Amtsführung kontrolliert und die Aufklärung ermöglicht.", "den Krug reparieren lässt."] },
];

const lessons = [
  {
    no: 1,
    eyebrow: "Auftritte 8–9",
    title: "Eve unter Druck",
    question: "Warum schweigt Eve, obwohl ihr Schweigen Ruprecht belastet?",
    target: "Die Lernenden rekonstruieren Eves Dilemma und analysieren asymmetrische Kommunikation als Mittel von Macht und Manipulation.",
    timing: ["10′ Einstieg: Eves Schweigen", "20′ Textspur 8–9", "30′ Dilemma-Dreieck", "20′ Urteil", "10′ Sicherung"],
    material: "M1 · Dilemma-Dreieck und Gesprächsbeobachtung",
    kit: ["Textausgabe: Auftritte 8–9", "Dilemma-Karten: sprechen / schweigen / ausweichen", "Raster: Gesprächshandlung – Machtmittel – Wirkung"],
    product: "Ein Dilemma-Dreieck mit belegter Deutung von Eves Schweigen.",
    levels: {
      foerder: "Ordne vorgegebene Folgen den drei Handlungsoptionen Eves zu. Nutze den Wortschatz: Drohung, Scham, Schutz, Vertrauen.",
      basis: "Rekonstruiere Eves Handlungsoptionen und erkläre mit zwei Textbelegen, weshalb keine Option für sie folgenlos ist.",
      erweitert: "Prüfe, ob Eves Schweigen eher als Ohnmacht, Widerstand oder Schutzhandlung zu deuten ist.",
    },
  },
  {
    no: 2,
    eyebrow: "Auftritte 10–11",
    title: "Spuren werden zu Beweisen",
    question: "Wie verändert Frau Brigitte das Kräfteverhältnis im Gericht?",
    target: "Die Lernenden unterscheiden Indiz, Aussage und Deutung und erklären Brigittes Funktion für die schrittweise Wahrheitsfindung.",
    timing: ["8′ Spurensicherung", "22′ Brigitte lesen", "25′ Beweiskette", "25′ Gegenrede Adams", "10′ Urteil"],
    material: "M2 · Digitale Beweiskette",
    kit: ["Textausgabe: Auftritte 10–11", "Indizkarten: Perücke, Spur, Verletzungen, Aussagen", "Prüfraster: Beobachtung – Schluss – Beweiskraft"],
    product: "Eine geordnete Beweiskette mit begründetem Urteil zur Beweiskraft.",
    levels: {
      foerder: "Verbinde Fund, Beobachtung und Schlussfolgerung mit farbigen Satzanfängen.",
      basis: "Ordne die Indizien und bewerte ihre Beweiskraft im Zusammenhang.",
      erweitert: "Untersuche, wie aus Zeichen erst durch Deutung Wissen entsteht und welche Fehlurteile möglich bleiben.",
    },
  },
  {
    no: 3,
    eyebrow: "Auftritte 11–13",
    title: "Entlarvt – aber gerecht?",
    question: "Ist die wiederhergestellte Ordnung am Ende wirklich gerecht?",
    target: "Die Lernenden analysieren Adams Entlarvung, Flucht und das offene Urteil über den Krug als Kritik an personaler und institutioneller Rechtsprechung.",
    timing: ["10′ Wendepunkt", "25′ Rollenprotokoll", "20′ Ende 12–13", "25′ Gerechtigkeitswaage", "10′ Exit"],
    material: "M3 · Gerechtigkeitswaage",
    kit: ["Textausgabe: Auftritte 11–13", "Karten: geklärt / ungeklärt / folgenlos", "Urteilswaage für Eve, Ruprecht, Marthe und das Gericht"],
    product: "Eine Gerechtigkeitswaage mit einem differenzierten Schlussurteil.",
    levels: {
      foerder: "Sortiere Ergebnisse in ‚geklärt‘ und ‚ungeklärt‘ und begründe eine Zuordnung.",
      basis: "Beurteile, für welche Figuren Gerechtigkeit hergestellt wird und für welche nicht.",
      erweitert: "Erörtere, ob Walters Eingreifen das System repariert oder lediglich eine Einzelperson ersetzt.",
    },
  },
  {
    no: 4,
    eyebrow: "Variant · Teil I",
    title: "Warum eine zweite Fassung?",
    question: "Was verändert der Variant an unserem Verständnis des Geschehens?",
    target: "Die Lernenden vergleichen die knappe Aufklärung des 12. Auftritts mit dem ausführlicheren Variant und leiten Funktionen der Kürzung ab.",
    timing: ["10′ Hypothese", "25′ arbeitsteiliger Vergleich", "25′ Vergleichsmatrix", "20′ Regieentscheidung", "10′ Sicherung"],
    material: "M4 · Vergleich 12. Auftritt / Variant",
    kit: ["Knapper 12. Auftritt in der Lektüre", "Variant in der Lektüre", "Vergleich: Information – Figurenwirkung – Tempo – Bühnenwirkung"],
    product: "Eine Vergleichsmatrix und eine begründete Regieentscheidung.",
    levels: {
      foerder: "Markiere: neue Information, bereits bekannt, ausführlicher erklärt.",
      basis: "Vergleiche Informationsgehalt, Figurenwirkung und Tempo beider Fassungen.",
      erweitert: "Entscheide begründet, welche Fassung du für eine heutige Aufführung wählen würdest.",
    },
  },
  {
    no: 5,
    eyebrow: "Variant · Teil II",
    title: "Vertrauen in Staat und Recht",
    question: "Wem kann Eve glauben, wenn der Richter selbst täuscht?",
    target: "Die Lernenden untersuchen Eves Bericht über Adams Täuschung sowie die Bedingungen, unter denen Walter staatliches Vertrauen neu begründen kann.",
    timing: ["8′ Vertrauensbarometer", "27′ Eves Bericht", "25′ Walter–Eve", "20′ Staatsbild", "10′ Transfer"],
    material: "M5 · Vertrauensbarometer",
    kit: ["Ausgewählte Passagen aus dem Variant", "Vertrauenskarten zu Adam, Walter und dem Staat", "Skala: Behauptung – Versprechen – überprüfbare Handlung"],
    product: "Ein Vertrauensbarometer mit Kriterien für glaubwürdiges staatliches Handeln.",
    levels: {
      foerder: "Ordne Äußerungen zu: zerstört Vertrauen / versucht Vertrauen herzustellen.",
      basis: "Analysiere, wie Sprache und Handeln Adams Vertrauen zerstören und Walter es wiederzugewinnen versucht.",
      erweitert: "Prüfe, ob persönliches Wohlwollen institutionelles Versagen ausgleichen kann.",
    },
  },
  {
    no: 6,
    eyebrow: "Figuren · Kommunikation",
    title: "Macht, Geschlecht und Sprache",
    question: "Wer darf sprechen – und wem wird geglaubt?",
    target: "Die Lernenden untersuchen Gesprächsmacht, Zuschreibungen und Abhängigkeiten und differenzieren die Figurenkonstellation nach der Ganzlektüre.",
    timing: ["10′ Figurenbild", "25′ Kommunikationsanalyse", "25′ Expertengruppen", "20′ Netz revidieren", "10′ These"],
    material: "M6 · Sprechmacht-Matrix",
    kit: ["Revidiertes Figurenbild", "Dialogauszüge aus Stück und Variant", "Matrix: sprechen – unterbrechen – drohen – schweigen – geglaubt werden"],
    product: "Eine differenzierte Figurenkonstellation mit markierten Machtachsen.",
    levels: {
      foerder: "Nutze Rollen- und Beziehungskarten sowie vorgegebene Verben für Machtbeziehungen.",
      basis: "Belege zwei asymmetrische Beziehungen an Gesprächshandlungen.",
      erweitert: "Untersuche, wie soziale Rolle, Geschlecht und Amt bestimmen, wessen Aussage als glaubwürdig gilt.",
    },
  },
  {
    no: 7,
    eyebrow: "Komik · Symbolik · Bühne",
    title: "Lachen über ein kaputtes Gericht",
    question: "Wie kann Komik Kritik sichtbar machen?",
    target: "Die Lernenden verbinden Krug-, Perücken- und Fallmotiv mit Formen der Komik und untersuchen eine szenische Deutung hinsichtlich ihrer Wirkung.",
    timing: ["10′ Komik-Check", "25′ Symbolstationen", "20′ Sprachkomik", "25′ Inszenierungsvergleich", "10′ Urteil"],
    material: "M7 · Symbol- und Komikstationen",
    kit: ["Stationen: Krug, Perücke, Fallmotiv", "Karten zu Wort-, Situations- und Figurenkomik", "Beobachtungsbogen für eine Inszenierung"],
    product: "Eine Wirkungsanalyse, die Komik und Justizkritik zusammenführt.",
    levels: {
      foerder: "Ordne Beispiele den Kategorien Wort-, Situations- und Figurenkomik zu.",
      basis: "Erkläre an zwei Beispielen, wie Komik zugleich unterhält und kritisiert.",
      erweitert: "Bewerte, ob das Lachen das Leid Eves verdeckt oder die Kritik an Adam verschärft.",
    },
  },
  {
    no: 8,
    eyebrow: "Synthese · Klausurtraining",
    title: "Ein Urteil über das Lustspiel",
    question: "Was zerbricht – und was bleibt am Ende unversehrt?",
    target: "Die Lernenden bündeln Figuren-, Sprach-, Struktur- und Inszenierungswissen in einer begründeten Deutung und planen eine Dramenszenenanalyse.",
    timing: ["10′ Deutungsthese", "25′ Szenenanalyse", "20′ Schreibplan", "25′ Peer-Feedback", "10′ Reihenbilanz"],
    material: "M8 · Schreibplan und Kriterienraster",
    kit: ["Klausurnaher Szenenausschnitt", "Schreibplan: Einordnung – Analyse – Deutung", "Peer-Raster für Textbeleg, Wirkung und Gesamtbezug"],
    product: "Ein vollständiger Schreibplan plus ausgearbeiteter Analyseabschnitt.",
    levels: {
      foerder: "Arbeite mit Satzgerüst und Belegliste; formuliere einen Deutungsabschnitt.",
      basis: "Plane und verfasse eine kohärente Teilanalyse mit Einordnung in den Gesamtzusammenhang.",
      erweitert: "Vergleiche zwei Deutungsansätze oder Text und Inszenierung in einem wertenden Schluss.",
    },
  },
];

const levelCopy: Record<Level, { label: string; short: string; note: string }> = {
  foerder: { label: "Förder", short: "mehr Halt", note: "Hilfen, Wortschatz und kleinere Denkschritte" },
  basis: { label: "Basis", short: "Standard", note: "selbstständige Analyse mit klaren Operatoren" },
  erweitert: { label: "Erweitert", short: "mehr Tiefe", note: "Transfer, Urteil und zusätzliche Offenheit" },
};

const navItems: { id: Section; label: string }[] = [
  { id: "start", label: "Start" },
  { id: "schnellstart", label: "Stunde · 45 Min" },
  { id: "material", label: "Materialien" },
  { id: "lehrkraft", label: "Lehrkraft" },
];

const quickDifferentiation: Record<Level, { figures: string; plot: string; reflection: string }> = {
  foerder: {
    figures: "Nutzt die Verwandtschaftsangaben und fragt bei jedem Satz: Wer weiß oder beweist was?",
    plot: "Orientierung: Zuerst bewirtet Adam Walter; am Schluss bleibt das Urteil über den Krug offen.",
    reflection: "Wählt einen Impuls und antwortet in zwei vollständigen Sätzen. Nutzt: Ich denke …, weil …",
  },
  basis: {
    figures: "Ordnet die neuen Beziehungen und Veränderungen nach der Ganzlektüre selbstständig zu.",
    plot: "Ordnet nach dem Erkenntnisfortschritt: Was weiß das Publikum nach jedem Auftritt mehr?",
    reflection: "Beantwortet zwei Impulse und begründet euer Urteil mit einem Ereignis aus dem Stück.",
  },
  erweitert: {
    figures: "Ergänzt nach der Zuordnung eine Machtachse: Wer verliert, wer gewinnt durch Brigittes Aussage Autorität?",
    plot: "Ordnet und formuliert anschließend eine These dazu, wie Kleist die Entlarvung verzögert.",
    reflection: "Verbindet euer Urteil mit der Frage, ob Adams Entlarvung bereits Gerechtigkeit herstellt.",
  },
};

function KrugMark({ small = false }: { small?: boolean }) {
  return (
    <span className={small ? "krug-mark small" : "krug-mark"} aria-hidden="true">
      <span className="krug-handle" />
      <span className="krug-body"><i /><b /></span>
    </span>
  );
}

export default function Home() {
  const [active, setActive] = useState<Section>("start");
  const [level, setLevel] = useState<Level>("basis");
  const [plot, setPlot] = useState<PlotCard[]>(shuffledPlot);
  const [dragId, setDragId] = useState<number | null>(null);
  const [plotChecked, setPlotChecked] = useState(false);
  const [figureAnswers, setFigureAnswers] = useState<Record<string, string>>({});
  const [figureChecked, setFigureChecked] = useState(false);
  const [reflection, setReflection] = useState({ liked: "", open: "", verdict: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("krug-reflexion");
    if (stored) {
      try { setReflection(JSON.parse(stored)); } catch { /* ignore malformed local data */ }
    }
  }, []);

  const plotCorrect = useMemo(() => plot.every((card, index) => card.id === plotSolution[index].id), [plot]);
  const figuresCorrect = useMemo(
    () => figurePrompts.every((item) => figureAnswers[item.id] === item.answer),
    [figureAnswers],
  );

  const scrollTo = (section: Section) => {
    setActive(section);
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const movePlot = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= plot.length) return;
    const next = [...plot];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    setPlot(next);
    setPlotChecked(false);
  };

  const dropPlot = (targetId: number) => {
    if (dragId === null || dragId === targetId) return;
    const next = [...plot];
    const from = next.findIndex((item) => item.id === dragId);
    const to = next.findIndex((item) => item.id === targetId);
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setPlot(next);
    setPlotChecked(false);
    setDragId(null);
  };

  const saveReflection = () => {
    window.localStorage.setItem("krug-reflexion", JSON.stringify(reflection));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <main>
      <header className="site-header">
        <button className="brand" onClick={() => scrollTo("start")} aria-label="Zum Anfang">
          <KrugMark small />
          <span><strong>Der zerbrochne Krug</strong><small>Lernportal · Q1 Grundkurs</small></span>
        </button>
        <nav aria-label="Hauptnavigation">
          {navItems.map((item) => (
            <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => scrollTo(item.id)}>{item.label}</button>
          ))}
        </nav>
      </header>

      <section id="start" className="hero section-anchor">
        <div className="hero-copy">
          <p className="kicker">Heinrich von Kleist · Ganzlektüre</p>
          <h1>Wahrheit entsteht<br /><em>aus den Scherben.</em></h1>
          <p className="hero-text">Eine interaktive 45‑Minuten-Stunde zur Sicherung der Ganzlektüre: Figurenbild ergänzen, Auftritte 8–13 ordnen, Ergebnisse sichern und erste Rezeptionsfragen klären.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => scrollTo("schnellstart")}>45‑Minuten-Stunde starten <span>→</span></button>
            <button className="secondary" onClick={() => scrollTo("material")}>Material ansehen</button>
          </div>
          <div className="facts" aria-label="Überblick">
            <span><strong>45</strong> Min Schnellstart</span>
            <span><strong>2</strong> digitale Sicherungen</span>
            <span><strong>3</strong> Niveaustufen</span>
          </div>
        </div>
        <div className="hero-art" aria-label="Abstrakte Darstellung eines zerbrochenen Kruges">
          <div className="sun-disc" />
          <KrugMark />
          <div className="evidence-tag tag-a">WAHRHEIT</div>
          <div className="evidence-tag tag-b">SCHULD</div>
          <div className="evidence-tag tag-c">RECHT</div>
        </div>
      </section>

      <section className="level-bar" aria-label="Differenzierungsniveau wählen">
        <div><span className="micro">DEIN LERNWEG</span><strong>Wähle dein Niveau</strong></div>
        <div className="segmented">
          {(Object.keys(levelCopy) as Level[]).map((key) => (
            <button key={key} className={level === key ? "selected" : ""} onClick={() => setLevel(key)}>
              {levelCopy[key].label}<small>{levelCopy[key].short}</small>
            </button>
          ))}
        </div>
        <p>{levelCopy[level].note}</p>
      </section>

      <section id="schnellstart" className="paper-section section-anchor">
        <div className="section-head">
          <div><p className="kicker">Schnellstart · 45 Minuten</p><h2>Vom Figurenbild zur ganzen Handlung</h2></div>
          <div className="lesson-clock"><strong>45</strong><span>MIN</span></div>
        </div>
        <p className="lead">Ihr kennt die Handlung bis zum 7. Auftritt. Ergänzt jetzt das Beziehungsnetz, ordnet die Auftritte 8–13 und sichert euer Ergebnis als Screenshot.</p>

        <div className="level-instruction"><b>{levelCopy[level].label} · Arbeitsweise</b><span>{quickDifferentiation[level].figures}</span></div>

        <div className="runline" aria-label="Stundenverlauf">
          <span><b>03′</b> Ankommen</span><i />
          <span><b>07′</b> Figuren</span><i />
          <span><b>08′</b> Handlung</span><i />
          <span><b>08′</b> Sicherung</span><i />
          <span><b>12′</b> Rezeption</span><i />
          <span><b>07′</b> Variant</span>
        </div>

        <article className="task-card figure-task">
          <div className="task-number">01</div>
          <div className="task-content">
            <p className="task-label">FIGURENKONSTELLATION · 5–8 MIN</p>
            <h3>Was muss sich nach dem 7. Auftritt verändern?</h3>
            <p>Wählt die passende Ergänzung. Euer bisheriges Figurenbild bleibt bestehen; neu sind Frau Brigitte und die Folgen der Aufklärung.</p>
            <div className="figure-stage">
              <div className="figure-column left">
                <span className="person purple">Ruprecht<small>Verlobter · zunächst beschuldigt</small></span>
                <span className="person green">Frau Marthe<small>Mutter · Klägerin</small></span>
                <span className="person rose">Eve<small>Tochter · unter Druck</small></span>
              </div>
              <div className="center-person"><span>ADAM</span><small>Richter<br />und Täter</small></div>
              <div className="figure-column right">
                <span className="person blue">Walter<small>kontrolliert das Amt</small></span>
                <span className="person amber">Licht<small>Schreiber · beobachtet</small></span>
                <span className="person new">Frau Brigitte<small>Zeugin · bringt Indizien</small></span>
              </div>
            </div>
            <div className="match-grid">
              {figurePrompts.map((item) => {
                const isRight = figureAnswers[item.id] === item.answer;
                return (
                  <label key={item.id} className={figureChecked ? (isRight ? "right" : "wrong") : ""}>
                    <span>{item.lead}</span>
                    <select value={figureAnswers[item.id] || ""} onChange={(e) => { setFigureAnswers({ ...figureAnswers, [item.id]: e.target.value }); setFigureChecked(false); }}>
                      <option value="">Ergänzung wählen …</option>
                      {item.options.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                );
              })}
            </div>
            <div className="task-actions">
              <button className="primary compact" onClick={() => setFigureChecked(true)}>Figurenbild prüfen</button>
              {figureChecked && <p className={figuresCorrect ? "feedback success" : "feedback error"}>{figuresCorrect ? "Stimmt. Frau Brigitte macht aus Verdacht eine belastbare Beweiskette." : "Noch nicht ganz. Fragt: Wer ist verwandt – und wer liefert welches Wissen?"}</p>}
            </div>
          </div>
        </article>

        <article className="task-card plot-task">
          <div className="task-number">02</div>
          <div className="task-content">
            <p className="task-label">HANDLUNG 8–13 · 5–8 MIN</p>
            <h3>Bringt die Post-its in die richtige Reihenfolge.</h3>
            <p>Zieht die Karten oder nutzt die Pfeile. Entscheidend ist der Erkenntnisfortschritt: Was weiß das Publikum nach jedem Auftritt mehr?</p>
            <div className="level-hint"><b>{levelCopy[level].label}</b><span>{quickDifferentiation[level].plot}</span></div>
            <div className="plot-list">
              {plot.map((card, index) => (
                <div
                  key={card.id}
                  className="plot-card"
                  draggable
                  onDragStart={() => setDragId(card.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dropPlot(card.id)}
                >
                  <div className="grip" aria-hidden="true">⋮⋮</div>
                  <div><span>AUFTRITT ?</span><strong>{card.title}</strong><p>{card.summary}</p></div>
                  <div className="move-buttons">
                    <button aria-label={`${card.title} nach oben`} onClick={() => movePlot(index, -1)} disabled={index === 0}>↑</button>
                    <button aria-label={`${card.title} nach unten`} onClick={() => movePlot(index, 1)} disabled={index === plot.length - 1}>↓</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="task-actions">
              <button className="primary compact" onClick={() => setPlotChecked(true)}>Reihenfolge prüfen</button>
              <button className="text-button" onClick={() => { setPlot(shuffledPlot); setPlotChecked(false); }}>Neu mischen</button>
              {plotChecked && <p className={plotCorrect ? "feedback success" : "feedback error"}>{plotCorrect ? "Richtig geordnet. Die Aufklärung verdichtet sich von der Pause zur Entlarvung." : "Noch nicht. Beginnt mit Adams Bewirtung; der offene Krugfall steht ganz am Schluss."}</p>}
            </div>
          </div>
        </article>

        <article className="task-card screenshot-task">
          <div className="task-number">03</div>
          <div className="task-content">
            <p className="task-label">SICHERUNG · SCREENSHOT</p>
            <h3>Euer Ergebnis in einem Bild</h3>
            <p>Wenn beide Prüfungen grün sind, öffnet die Sicherungsansicht und macht einen Screenshot für eure Unterlagen.</p>
            <details className="solution-panel" open={plotChecked && plotCorrect && figureChecked && figuresCorrect}>
              <summary>Sicherungsansicht öffnen</summary>
              <div className="screenshot-sheet">
                <div className="sheet-head"><KrugMark small /><div><b>Der zerbrochne Krug</b><span>Handlung und Figuren · Ganzlektüre</span></div></div>
                <div className="sheet-figures">
                  <div><b>Wahrheitssuche</b><span>Walter kontrolliert · Licht beobachtet · Brigitte liefert Indizien</span></div>
                  <div className="adam-seal">ADAM<small>Richter ↔ Täter</small></div>
                  <div><b>Betroffene</b><span>Eve entlastet Ruprecht · Marthe klagt · Ruprecht wird rehabilitiert</span></div>
                </div>
                <ol className="sheet-timeline">
                  {plotSolution.map((item) => <li key={item.id}><b>{item.act}</b><span><strong>{item.title}</strong>{item.summary}</span></li>)}
                </ol>
                <p className="sheet-takeaway">Vom Verdacht zum Beweis: Die Tat ist aufgeklärt – die beschädigte Rechtsordnung noch nicht vollständig repariert.</p>
              </div>
            </details>
          </div>
        </article>

        <article className="task-card reflection-task">
          <div className="task-number">04</div>
          <div className="task-content">
            <p className="task-label">REZEPTION · PERSÖNLICHER ZUGANG</p>
            <h3>Was bleibt nach der Ganzlektüre?</h3>
            <div className="level-hint"><b>{levelCopy[level].label}</b><span>{quickDifferentiation[level].reflection}</span></div>
            <div className="reflection-grid">
              <label><span>Das fand ich überzeugend oder irritierend:</span><textarea value={reflection.liked} onChange={(e) => setReflection({ ...reflection, liked: e.target.value })} placeholder="Eine Szene, eine Figur, eine Wirkung …" /></label>
              <label><span>Diese Frage ist noch offen:</span><textarea value={reflection.open} onChange={(e) => setReflection({ ...reflection, open: e.target.value })} placeholder="Was möchtest du in der Reihe klären?" /></label>
              <label><span>Mein vorläufiges Urteil:</span><textarea value={reflection.verdict} onChange={(e) => setReflection({ ...reflection, verdict: e.target.value })} placeholder="Wer trägt welche Schuld? Wem glaubst du?" /></label>
            </div>
            <div className="prompt-chips" aria-label="Gesprächsimpulse">
              <span>Wen favorisiert ihr?</span><span>Wer ist schuldig?</span><span>Was blieb unklar?</span><span>Warum gibt es den Variant?</span>
            </div>
            <button className="primary compact" onClick={saveReflection}>{saved ? "Auf diesem Gerät gesichert ✓" : "Antworten auf diesem Gerät sichern"}</button>
          </div>
        </article>

        <div className="two-col-callout">
          <div><span className="micro">SPRINTERAUFGABE</span><h3>Handlung noch einmal spielerisch prüfen</h3><p>Öffne die bestehende LearningApp in einem neuen Tab. Sie ist Zusatztraining; eure verbindliche Sicherung bleibt die Ansicht oben.</p></div>
          <a className="launch-link" href="https://learningapps.org/53819527" target="_blank" rel="noreferrer">LearningApps öffnen <span>↗</span></a>
        </div>
        <div className="variant-note">
          <div className="variant-letter">V</div>
          <div><span className="micro">KURZ GEKLÄRT</span><h3>Was ist der Variant?</h3><p>Der <strong>Variant</strong> ist Kleists ausführlichere ursprüngliche Fassung des 12. Auftritts. Sie erzählt Eves Perspektive, Adams Täuschung und die Vertrauensfrage erheblich genauer. Kleist kürzte die Szene später für die Bühnenfassung; die längere Version blieb als Anhang erhalten.</p></div>
        </div>
      </section>

      <section id="material" className="paper-section materials section-anchor">
        <div className="section-head"><div><p className="kicker">Material der 45‑Minuten-Stunde</p><h2>Alles an einem Ort</h2></div><button className="secondary" onClick={() => window.print()}>Stundenübersicht drucken</button></div>
        <div className="material-grid">
          <article className="material-card featured"><span>M1</span><h3>Interaktive Schüleransicht</h3><p>Figuren ergänzen, Handlung 8–13 sortieren, Screenshot sichern und offene Fragen sammeln.</p><button onClick={() => scrollTo("schnellstart")}>Stunde öffnen →</button></article>
          <article className="material-card"><span>M2</span><h3>Figurenkonstellation</h3><p>Der Stand bis Auftritt 7 bleibt erhalten. Frau Brigitte, neue Wissensstände und veränderte Machtbeziehungen werden ergänzt.</p><button onClick={() => scrollTo("schnellstart")}>Zum Figurenbild →</button></article>
          <article className="material-card"><span>M3</span><h3>Handlung 8–13</h3><p>Sechs knappe Post-its bilden den Erkenntnisfortschritt von der Bewirtung bis zum offenen Krugurteil ab.</p><button onClick={() => scrollTo("schnellstart")}>Zur Sortierung →</button></article>
          <article className="material-card"><span>M4</span><h3>Rezeption & Variant</h3><p>Persönlicher Zugang, offene Fragen, Schuldurteil und eine kurze, fachlich klare Erklärung des Variants.</p><button onClick={() => scrollTo("schnellstart")}>Zu den Impulsen →</button></article>
          <article className="material-card external"><span>↗</span><h3>LearningApps</h3><p>Direkter Zugang zu ergänzenden Übungen ohne Umweg über das Portal.</p><div className="link-stack"><a href="https://learningapps.org/53819527" target="_blank" rel="noreferrer">Handlungsverlauf</a><a href="https://learningapps.org/53796413" target="_blank" rel="noreferrer">Adam und Licht</a><a href="https://learningapps.org/38085603" target="_blank" rel="noreferrer">Auftritte 1–7</a></div></article>
        </div>
        <p className="source-note">Hinweis: Längere Textpassagen werden bewusst nicht auf der Webseite vervielfältigt. Arbeitet bei den Analyseaufgaben mit eurer eigenen Textausgabe und den angegebenen Auftritten.</p>
      </section>

      <section id="lehrkraft" className="teacher-section section-anchor">
        <div className="section-head"><div><p className="kicker">Lehrkraftbereich</p><h2>Didaktische Architektur</h2></div><div className="teacher-stamp">Q1 · GK<br />NRW</div></div>
        <div className="teacher-grid">
          <article><span className="micro">STUNDENZIEL</span><h3>Gemeinsamer Wissensstand nach der Ganzlektüre</h3><p>Die Lernenden ergänzen ihre bis zum 7. Auftritt entwickelte Figurenkonstellation, ordnen die Handlung der Auftritte 8–13 und formulieren erste Rezeptionsfragen. Die Stunde schafft Orientierung; sie vertieft bewusst noch keine Einzelfigur.</p></article>
          <article><span className="micro">CURRICULARE ANBINDUNG</span><h3>Kompetenzen aus dem schulinternen Curriculum</h3><ul><li>Figuren-, Handlungs-, Dialog- und Sprachgestaltung untersuchen</li><li>Mehrdeutigkeit und Kontextbezüge erklären</li><li>verbale, nonverbale und paraverbale Strategien analysieren</li><li>Inszenierungen in Gestaltung und Wirkung beurteilen</li><li>eine Dramenszene analysieren und interpretieren</li></ul></article>
          <article><span className="micro">DIFFERENZIERUNG</span><h3>Gleiches Ziel, drei Zugänge</h3><div className="level-legend"><b>Förder</b><span>reduzierte Auswahl, Wortschatz, Satzstarter</span><b>Basis</b><span>textnahe Standardaufgabe</span><b>Erweitert</b><span>Mehrdeutigkeit, Transfer, Urteil</span></div></article>
          <article><span className="micro">DIAGNOSE & SICHERUNG</span><h3>Zwei sichtbare Lernprodukte</h3><p>Die geprüfte Figurenkonstellation und die geordnete Handlungsübersicht werden in einer gemeinsamen Sicherungsansicht gebündelt. Der Screenshot dient unmittelbar als Grundlage für die folgende Unterrichtsarbeit.</p></article>
        </div>
        <div className="teacher-plan">
          <div><span className="micro">45-MINUTEN-BRÜCKE</span><h3>Der Montag ist bewusst keine neue Analyse-Stunde.</h3><p>Die Hausaufgabe war die Ganzlektüre. Deshalb werden Figuren und Handlung zügig gesichert; die restliche Zeit macht Rezeptionsfragen sichtbar und klärt die Funktion des Variants. So startet Doppelstunde 1 mit einem belastbaren gemeinsamen Wissensstand.</p></div>
          <div className="mini-table"><span>Teil 1</span><b>16′</b><p>Figuren + Handlung</p><span>Teil 2</span><b>8′</b><p>Screenshot-Sicherung</p><span>Teil 3</span><b>21′</b><p>Rezeption + Variant</p></div>
        </div>
      </section>

      <footer>
        <KrugMark small /><div><strong>Der zerbrochne Krug · Lernportal</strong><span>Q1 Grundkurs · Unterrichtsmaterial auf Grundlage der schulischen Reihenplanung</span></div><button onClick={() => scrollTo("start")}>Nach oben ↑</button>
      </footer>
    </main>
  );
}
