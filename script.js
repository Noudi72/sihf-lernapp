let scheduleElement, focusFilter, blockFilter, questionList, questionFilter, formatFilter, questionSearch;
let glossaryList, glossaryFilter, glossarySearch, installButton, iosInstructionsButton;

let deferredInstallPrompt = null;

function initApp() {
  scheduleElement = document.getElementById("schedule");
  focusFilter = document.getElementById("focus-filter");
  blockFilter = document.getElementById("block-filter");
  questionList = document.getElementById("question-list");
  questionFilter = document.getElementById("question-filter");
  formatFilter = document.getElementById("format-filter");
  questionSearch = document.getElementById("question-search");
  glossaryList = document.getElementById("glossary-list");
  glossaryFilter = document.getElementById("glossary-filter");
  glossarySearch = document.getElementById("glossary-search");
  installButton = document.getElementById("install-button");
  iosInstructionsButton = document.getElementById("ios-instructions");

  if (installButton) {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      installButton.classList.remove("hidden");
      if (iosInstructionsButton) {
        iosInstructionsButton.classList.add("hidden");
      }
    });

    installButton.addEventListener("click", async () => {
      if (!deferredInstallPrompt) {
        return;
      }
      installButton.disabled = true;
      await deferredInstallPrompt.prompt();
      const result = await deferredInstallPrompt.userChoice;
      if (result.outcome !== "accepted") {
        installButton.disabled = false;
      } else {
        installButton.classList.add("hidden");
      }
      deferredInstallPrompt = null;
    });

    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      installButton.classList.add("hidden");
    });
  }

  const isIos =
    /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) && !window.MSStream;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

  if (isIos && !isStandalone && iosInstructionsButton) {
    iosInstructionsButton.classList.remove("hidden");
    iosInstructionsButton.addEventListener("click", () => {
      alert("Öffne das Teilen-Menü in Safari und wähle \"Zum Home-Bildschirm\".");
    });
  }

  if (questionFilter) {
    questionFilter.addEventListener("change", renderQuestionBank);
  }
  if (formatFilter) {
    formatFilter.addEventListener("change", renderQuestionBank);
  }
  if (questionSearch) {
    questionSearch.addEventListener("input", renderQuestionBank);
  }
  if (questionList) {
    questionList.addEventListener("click", toggleAnswer);
    renderQuestionBank();
  }

  if (glossaryFilter) {
    glossaryFilter.addEventListener("change", renderGlossary);
  }
  if (glossarySearch) {
    glossarySearch.addEventListener("input", renderGlossary);
  }
  if (glossaryList) {
    renderGlossary();
  }

  if (focusFilter) {
    focusFilter.addEventListener("change", renderSchedule);
  }
  if (blockFilter) {
    blockFilter.addEventListener("change", renderSchedule);
  }
  if (scheduleElement) {
    renderSchedule();
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.error("Service Worker Registrierung fehlgeschlagen:", error);
    });
  });
}

const schedule = [
  {
    day: "Tag 1",
    title: "Überblick & Planung",
    focus: ["Technik", "Psyche", "Coaching"],
    blocks: [
      {
        label: "Block 1",
        focus: "Organisation",
        title: "Planung & Materialsammlung",
        details:
          "Lernplan im Detail ausarbeiten, Unterlagen aus Physis 1/2, Coaching 1/2, Psyche-Broschüre, Orientierungsfragen organisieren."
      },
      {
        label: "Block 2",
        focus: "Technik",
        title: "Keypoints Basis-Techniken",
        details:
          "Schlittschuhlaufen, Scheibenführung, Passen: Mindmap erstellen, Karteikarten mit Keypoints anlegen."
      },
      {
        label: "Block 3",
        focus: "Psyche",
        title: "Mentale Grundlagen",
        details:
          "Flow, Visualisieren (Innen-/Außensicht), SMART-Ziele. Beispielantworten formulieren, kurze Selbstchecks."
      }
    ],
    reflection:
      "Was fällt mir leicht? Welche Unterlagen fehlen noch? Nächste Schritte festhalten."
  },
  {
    day: "Tag 2",
    title: "Technik Vertiefung",
    focus: ["Technik"],
    blocks: [
      {
        label: "Block 1",
        focus: "Technik",
        title: "Keypoints Spezialtechniken",
        details:
          "Schusstechnik, Körperspiel (Check geben & annehmen), Blockshot, Face-Off. Übersicht erstellen."
      },
      {
        label: "Block 2",
        focus: "Planung",
        title: "Techniktraining strukturieren",
        details:
          "Aufbau & Ablauf von Techniktrainings, Saisonplanung inkl. Sommer, Altersstufen reflektieren."
      },
      {
        label: "Block 3",
        focus: "Technik",
        title: "Spielformen Schlittschuhlauf",
        details:
          "Mindestens 3 Spielformen/Übungen zur Verbesserung der Lauftechnik skizzieren, inklusive Coaching-Punkte."
      }
    ],
    reflection:
      "Welche Technikbereiche sind noch unsicher? Eventuell Videoanalyse zur Vertiefung einplanen."
  },
  {
    day: "Tag 3",
    title: "Taktik Basics",
    focus: ["Taktik"],
    blocks: [
      {
        label: "Block 1",
        focus: "Taktik",
        title: "Grundbegriffe",
        details:
          "GAP-Kontrolle, Transition-Spiel, Switch Quick, Dump vs. Chip definieren und Beispiele sammeln."
      },
      {
        label: "Block 2",
        focus: "Taktik",
        title: "1-gegen-1 Verhalten",
        details:
          "Defensiv & Offensiv, Puckprotection, Spielrollen (4 Rollen) analysieren und Keypoints notieren."
      },
      {
        label: "Block 3",
        focus: "Taktik",
        title: "Tempo & Entscheidungen",
        details:
          "Tempo-Prinzip (Footspeed/Headspeed/Puckspeed/Gapspeed), 1-2-3-4 Prinzip, Entscheidungstraining mit Praxisbeispielen."
      }
    ],
    reflection:
      "Wie setze ich die taktischen Konzepte im Training um? Notiere Ideen für Übungsreihen."
  },
  {
    day: "Tag 4",
    title: "Physis Grundlagen",
    focus: ["Physis"],
    blocks: [
      {
        label: "Block 1",
        focus: "Physis",
        title: "Basiswissen Physis",
        details:
          "3 Leistungsfaktoren, Energiequellen, Aerob vs. Anaerob, RSA inklusive Trainingsbeispiele."
      },
      {
        label: "Block 2",
        focus: "Physis",
        title: "Superkompensation & Zyklen",
        details:
          "Methodisches Modell, Mikro-/Meso-/Makrozyklen. Sommer-Kraftplanung für 10 Wochen skizzieren."
      },
      {
        label: "Block 3",
        focus: "Physis",
        title: "Ausdauer & Regeneration",
        details:
          "Ausdauerplanung (Intervall, Intermittierend, Dauermethoden), Warm-up & Cool-down begründen."
      }
    ],
    reflection:
      "Welche Trainingsmethoden setze ich aktuell ein? Passen sie zu den Anforderungen der Mannschaft?"
  },
  {
    day: "Tag 5",
    title: "Mental & Coaching",
    focus: ["Psyche", "Coaching"],
    blocks: [
      {
        label: "Block 1",
        focus: "Psyche",
        title: "Mentale Tools",
        details:
          "Grundtechniken, Selbstgespräche, Atemregulation, Visualisierungsübungen aus der Broschüre sammeln."
      },
      {
        label: "Block 2",
        focus: "Coaching",
        title: "Kommunikation & Feedback",
        details:
          "Konfliktgespräch strukturieren, 4 Coachhüte (Trainer/Coach/Berater) mit Feedbackarten zuordnen, Sender-Empfänger-Modell anwenden."
      },
      {
        label: "Block 3",
        focus: "Coaching",
        title: "Ziele & Kultur",
        details:
          "SMART-Ziel konkret formulieren, Charakterplakat & Respect on/off the Ice analysieren."
      }
    ],
    reflection:
      "Welche Kommunikationsstrategien funktionieren gut? Welche möchte ich verbessern?"
  },
  {
    day: "Tag 6",
    title: "Anwendungspraxis",
    focus: ["Technik", "Taktik", "Coaching"],
    blocks: [
      {
        label: "Block 1",
        focus: "Technik & Taktik",
        title: "Trainingseinheit entwerfen",
        details:
          "Technik- und Taktik-Schwerpunkt kombinieren. Ablauf mit Coaching-Punkten und Belastung beschreiben."
      },
      {
        label: "Block 2",
        focus: "Taktik",
        title: "Problemorientierte Anpassungen",
        details:
          "Strategien gegen Torflaute und zu viele Slot-Abschlüsse analysieren. Konkrete Maßnahmen für Drittelpausen planen."
      },
      {
        label: "Block 3",
        focus: "Coaching",
        title: "FTEM & Sicherheit",
        details:
          "FTEM-Eishockey zusammenfassen, Sicherheitsaspekte/Merkblatt Unfallprävention notieren, Handlungsfelder „Vermitteln“ ausarbeiten."
      }
    ],
    reflection:
      "Welche Praxisbeispiele eignen sich für meine Mannschaft? Wo brauche ich weiteres Material?"
  },
  {
    day: "Tag 7",
    title: "Wiederholung & Prüfungsfragen",
    focus: ["Technik", "Taktik", "Physis", "Psyche", "Coaching"],
    blocks: [
      {
        label: "Block 1",
        focus: "Technik & Taktik",
        title: "Kurztest schreiben",
        details:
          "Technik- und Taktikfragen unter Zeitdruck beantworten. Ergebnisse dokumentieren."
      },
      {
        label: "Block 2",
        focus: "Physis",
        title: "Physis-Check",
        details:
          "Fragen zu Superkompensation, Trainingszyklen, Diagramm Intensität–Erholung–Umfang zeichnen."
      },
      {
        label: "Block 3",
        focus: "Psyche & Coaching",
        title: "Mentale & Coaching-Fragen",
        details:
          "Antworten schriftlich ausarbeiten, anschließend laut erklären (Selbstprüfung)."
      }
    ],
    reflection:
      "Welche Themen waren noch schwierig? Erstelle eine Prioritätenliste für Tag 8."
  },
  {
    day: "Tag 8",
    title: "Simulation & Lücken schließen",
    focus: ["Technik", "Taktik", "Physis", "Psyche", "Coaching"],
    blocks: [
      {
        label: "Block 1",
        focus: "Gesamtüberblick",
        title: "60-Minuten-Prüfungssimulation",
        details:
          "Gemischte Fragen aus allen Bereichen beantworten. Zeitmanagement üben."
      },
      {
        label: "Block 2",
        focus: "Analyse",
        title: "Ergebnisse auswerten",
        details:
          "Fehler analysieren, offene Fragen markieren, gezielte Nacharbeitung planen."
      },
      {
        label: "Block 3",
        focus: "Psyche",
        title: "Mentales Training",
        details:
          "Antizipations-, Visualisierungs- und Motivationsübungen aus Broschüre anwenden."
      }
    ],
    reflection:
      "Welche Lücken bestehen noch? Wie kann ich sie in den nächsten zwei Tagen schließen?"
  },
  {
    day: "Tag 9",
    title: "Praxistransfer",
    focus: ["Technik", "Taktik", "Coaching"],
    blocks: [
      {
        label: "Block 1",
        focus: "Planung",
        title: "Saisonplanung erstellen",
        details:
          "Technik- und Physis-Schwerpunkte über die Saison skizzieren, Sommerphase berücksichtigen."
      },
      {
        label: "Block 2",
        focus: "Taktik & Coaching",
        title: "Spielnahes Training",
        details:
          "Session mit Teaching-the-game Ansatz planen, Torhüterintegration und Puckmanagement einbauen."
      },
      {
        label: "Block 3",
        focus: "Coaching",
        title: "Feedback-Rollenspiele",
        details:
          "Coachhüte an Beispielen üben, Kommunikationsstrategie für Team-Meetings definieren."
      }
    ],
    reflection:
      "Bin ich bereit, Konzepte im Training anzuwenden? Welche Ressourcen brauche ich noch?"
  },
  {
    day: "Tag 10",
    title: "Finale Wiederholung & Regeneration",
    focus: ["Technik", "Taktik", "Physis", "Psyche", "Coaching"],
    blocks: [
      {
        label: "Block 1",
        focus: "Review",
        title: "Karteikarten & Keypoints",
        details:
          "Alle Keypoints und zentralen Begriffe kurz wiederholen, letzte Notizen ergänzen."
      },
      {
        label: "Block 2",
        focus: "Klärung",
        title: "Offene Fragen schließen",
        details:
          "Checkliste durchgehen: Kann ich jede Prüfungsfrage beantworten? Unsicherheiten gezielt klären."
      },
      {
        label: "Block 3",
        focus: "Psyche",
        title: "Mentale Vorbereitung",
        details:
          "Entspannungstechnik üben, leichte Bewegungseinheit absolvieren, Tagesablauf für Prüfungstag planen."
      }
    ],
    reflection:
      "Wie fühle ich mich vor der Prüfung? Positive Routinen festlegen und Vertrauen stärken."
  }
];

const questionBank = [
  {
    id: "q1",
    category: "Methodik",
    format: "Kurzantwort",
    question: "Was ist der „Constraints-Led Approach“ (CLA) im Training?",
    answer:
      "Verhalten wird über Aufgaben-, Umwelt- und Organismus-Constraints gesteuert. Der Coach verändert Regeln, Feldgröße oder Anreize, damit Spieler Lösungen selbst organisieren und ihre Entscheidungskompetenz steigt."
  },
  {
    id: "q2",
    category: "Methodik",
    format: "Kurzantwort",
    question: "Blocked vs. Random Practice – Unterschied & Einsatz?",
    answer:
      "Blocked Practice = gleiche Aufgabe hintereinander für Technikgefühl und Automatisierung. Random Practice = Aufgaben wechseln, fördert Transfer und Entscheidungsfähigkeit. Kombination je nach Lernziel und Leistungsniveau."
  },
  {
    id: "q3",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Wie sieht eine 60-Minuten-U11-Einheit zur Puckführung aus?",
    answer:
      "8′ aktivierende Spiele, 15′ Technik-Stationen (Kopf hoch, Blattwinkel), 15′ Anwendung (1v1/2v2 mit Gates), 15′ Small-Area-Game mit Bonus für Täuschungen, 7′ Cool-down und kurze Reflexion."
  },
  {
    id: "q4",
    category: "Taktik",
    format: "Kurzantwort",
    question: "Dein Team steckt offensiv fest – drei Sofortmaßnahmen?",
    answer:
      "Mehr Net-Front-Traffic und Rebounds, Puckspeed erhöhen (One-Touch, Positionswechsel), Rush-Chancen forcieren durch schnelle First Pässe und breite Mitteldrittelnutzung."
  },
  {
    id: "q5",
    category: "Taktik",
    format: "Kurzantwort",
    question: "Nenne Forecheck-Prinzipien im 1-2-2, 2-1-2 und 1-1-3.",
    answer:
      "1-2-2: F1 lenkt außen, F2/F3 lesen Druck, Verteidiger halten blaue Linie. 2-1-2: Zwei Stürmer setzen tief Druck, höheres Risiko. 1-1-3: Neutralzone verengen, gut gegen starke Breakouts. Trigger sind schwacher First Pass oder schlechte Körperposition."
  },
  {
    id: "q6",
    category: "Taktik",
    format: "Kurzantwort",
    question: "Breakout-Basics (Up, Over, Wheel, Reverse) – wann nutze ich was?",
    answer:
      "Up: an die starke Seite bei geringem Druck. Over: Seitenwechsel, wenn starke Seite zugestellt ist. Wheel: Verteidiger trägt hinter dem Tor weg bei freier Bahn. Reverse: Druck umlenken, wenn F1 aggressiv kommt."
  },
  {
    id: "q7",
    category: "Taktik",
    format: "Kurzantwort",
    question: "Neutral-Zone-Play – Grundideen offensiv und defensiv?",
    answer:
      "Offensiv: Mit oder ohne Scheibenkontrolle einlaufen, Breite schaffen, Mittellinie schnell überqueren. Defensiv: 1-3-1 oder 1-2-2 kompakt, Inside-Lanes schließen, Turnover forcieren."
  },
  {
    id: "q8",
    category: "Spezialsituationen",
    format: "Kurzantwort",
    question: "Powerplay – Kernprinzipien und Rollen?",
    answer:
      "Struktur z. B. 1-3-1, schnelle Puckbewegung, Net-Front-Screen/Tip. Bumper verbindet, Flügel drohen Schuss/Seam-Pass, Point sorgt für lateral movement und Schussqualität."
  },
  {
    id: "q9",
    category: "Spezialsituationen",
    format: "Kurzantwort",
    question: "Penalty-Kill – Kernprinzipien?",
    answer:
      "Box oder Diamond, Stockbahnen schließen, Schüsse von außen erlauben, konsequente Clears, vorbereitete Face-off-Plays und schnelle Wechsel."
  },
  {
    id: "q10",
    category: "Organisation",
    format: "Kurzantwort",
    question: "Line-Change – Sicherheitsregeln?",
    answer:
      "Scheibe tief oder kontrolliert, Wechsel spätestens nach 40–45 Sekunden, klare Kommunikation, keine riskanten Querwechsel bei Gegenstößen."
  },
  {
    id: "q11",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Bench-Management – drei Grundsätze?",
    answer:
      "Klare Reihen und Rollen, situatives Matching (Zonen/Face-offs), Belastung über Spielverlauf steuern (Hot-Hand nutzen, Ermüdung erkennen)."
  },
  {
    id: "q12",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Videoanalyse – Best Practices?",
    answer:
      "Kurz und fokussiert (3–5 Clips), eine Kernaussage, positive Beispiele betonen, Handlungsziel definieren und im Training verankern."
  },
  {
    id: "q13",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Drei praxisnahe Team-KPIs im Spiel?",
    answer:
      "Slot-Abschlüsse, kontrollierte Zonen-Eintritte/-Ausgänge und gewonnene Defensivzonen-Face-offs bzw. Turnover in der neutralen Zone reduzieren."
  },
  {
    id: "q14",
    category: "Physis",
    format: "Kurzantwort",
    question: "Einfache In-Season-Belastungssteuerung?",
    answer:
      "sRPE (RPE × Dauer) erfassen, Monotonie im Auge behalten, nach harten Spielen Belastung reduzieren, gezielt Regeneration und Taper einplanen."
  },
  {
    id: "q14b",
    category: "Physis",
    format: "Kurzantwort",
    question: "Was umfasst die konditionelle Substanz laut BASPO?",
    answer:
      "Die konditionelle Substanz gliedert sich in Kraft, Ausdauer, Schnelligkeit und Beweglichkeit. Diese Leistungsfaktoren interagieren über Mischformen wie Kraftausdauer, Schnelligkeitsausdauer oder Schnellkraft und bilden das Fundament der physischen Leistungsfähigkeit."
  },
  {
    id: "q15",
    category: "Kommunikation",
    format: "Kurzantwort",
    question: "Elterngespräch – Leitlinien?",
    answer:
      "Transparenz und Kind im Fokus, klare Regeln und Erwartungen, lösungsorientiert bleiben, Gespräche strukturiert und terminiert führen."
  },
  {
    id: "q16",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Spielerauswahl – fair und entwicklungsorientiert?",
    answer:
      "Mehrkriterielle Bewertung (Einsatz, Lernfortschritt, Teamverhalten), Kommunikation offen halten, Chancen rotieren – besonders im Nachwuchs."
  },
  {
    id: "q17",
    category: "Organisation",
    format: "Kurzantwort",
    question: "Code of Conduct / Ethik – Kernpunkte?",
    answer:
      "Respekt gegenüber allen Beteiligten, Sicherheit als Priorität, Gleichbehandlung, Nulltoleranz bei Diskriminierung und gefährlichem Körperspiel."
  },
  {
    id: "q17b",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Welche Elemente bilden die emotionale Substanz nach BASPO?",
    answer:
      "Motivation, Selbstvertrauen und die Art der Ursachenerklärung beeinflussen einander wechselseitig. Coaches fördern positive Attribution, klare Motivation und bauen dadurch stabiles Selbstvertrauen auf."
  },
  {
    id: "q18",
    category: "Physis",
    format: "Kurzantwort",
    question: "Warm-up: dynamisch vs. statisch – wann setze ich was ein?",
    answer:
      "Dynamisch vor der Belastung zum Aktivieren und Mobilisieren. Statisch nach dem Training oder separat zur Beweglichkeitsverbesserung."
  },
  {
    id: "q19",
    category: "Physis",
    format: "Kurzantwort",
    question: "Match-Ernährung und Hydration – Basics?",
    answer:
      "Vor dem Spiel leicht verdauliche Kohlenhydrate, währenddessen in Drittelpausen trinken, nach dem Spiel Kohlenhydrate plus Protein – keine Experimente am Spieltag."
  },
  {
    id: "q20",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Goalies sinnvoll integrieren – zwei Beispiele?",
    answer:
      "Geplante Schussserien mit klarer Qualität und Erholungszeit, Rush-Läufe mit definierten Winkeln; Feldspieler erhalten Feedback vom Goalie-Coach."
  },
  {
    id: "q20b",
    category: "Physis",
    format: "Kurzantwort",
    question: "Wie liest du einen BASPO-Leistungstest (z. B. Magglingen)?",
    answer:
      "Testprotokoll prüfen (z. B. 20-m-Sprint, T-Test, Jump-Tests, Laktatstufentest). Ergebnisse mit Normtabellen/Percentilen vergleichen, Verlauf früherer Tests betrachten, Stärken/Defizite pro konditionellem Faktor ableiten und Trainingsschwerpunkte formulieren."
  },
  {
    id: "q21",
    category: "Spezialsituationen",
    format: "Kurzantwort",
    question: "PK-Face-off-Play in der eigenen Zone – Ablauf?",
    answer:
      "Center blockt, Winger sprintet zur Bande, Verteidiger räumt den Net-Front. Ziel ist der sofortige Clear oder ein Chip für den Wechsel."
  },
  {
    id: "q22",
    category: "Spezialsituationen",
    format: "Kurzantwort",
    question: "Extra-Angreifer (6. Mann) – Prinzipien?",
    answer:
      "Net-Front besetzen, Überzahl an der starken Seite schaffen, Schussqualität mit Traffic sichern, gleichzeitig Absicherung gegen Clears organisieren."
  },
  {
    id: "q23",
    category: "Spezialsituationen",
    format: "Kurzantwort",
    question: "Empty-Net verteidigen – Prinzipien?",
    answer:
      "Innen verdichten, Schussbahnen schließen, Boards nutzen, sichere Clears statt riskanter Icing-Versuche wählen."
  },
  {
    id: "q24",
    category: "Taktik",
    format: "Kurzantwort",
    question: "Drittelende: eigener D-Zonen-Face-off bei -1 Tor – Setup?",
    answer:
      "Stärkster Center, Winger mit klarer Block-/Shot-Lane-Aufgabe, Point-Schüsse verhindern, schnellen Ausbruchweg vorbereiten."
  },
  {
    id: "q25",
    category: "Organisation",
    format: "Kurzantwort",
    question: "Emergency Action Plan (EAP) – fünf Kernpunkte?",
    answer:
      "Rollen verteilen (Einsatzleitung, Ersthelfer, Notruf), Zugang zu Defi/Ausrüstung kennen, Kommunikationskette sichern, Eisfläche räumen, Vorfall dokumentieren und nachbesprechen."
  },
  {
    id: "q26",
    category: "Methodik",
    format: "Multiple Choice",
    question: "Welche Aussage beschreibt Random Practice am treffendsten?",
    answer: "Richtig ist Option C: Aufgaben variieren ständig, was Transfer und Entscheidungsfähigkeit verbessert.",
    options: [
      "Spieler wiederholen eine Technik ohne Variation, um Gefühl aufzubauen.",
      "Spieler trainieren ausschließlich taktische Konzepte ohne Technikanteil.",
      "Spieler wechseln Aufgaben häufig, sodass Entscheidungen unter wechselnden Bedingungen geübt werden.",
      "Spieler trainieren konditionelle Inhalte zwischen technischen Stationen."
    ],
    correctIndex: 2
  },
  {
    id: "q27",
    category: "Physis",
    format: "Multiple Choice",
    question: "Welches Element gehört NICHT zu den drei physischen Leistungsfaktoren im Eishockey?",
    answer: "Richtig ist Option D: Beweglichkeit ist wichtig, zählt aber nicht zu den drei Hauptleistungsfaktoren (Schnelligkeit, Ausdauer, Kraft).",
    options: ["Schnelligkeit", "Ausdauer", "Kraft", "Beweglichkeit"],
    correctIndex: 3
  },
  {
    id: "q27b",
    category: "Psyche",
    format: "Multiple Choice",
    question: "SMART-Ziele – was steht für den Buchstaben „A“?",
    answer: "Richtig ist Option C: Attraktiv – das Ziel soll motivierend und lohnend sein.",
    options: ["Ausdauerorientiert", "Angepasst", "Attraktiv", "Anstrengend"],
    correctIndex: 2
  },
  {
    id: "q27c",
    category: "Psyche",
    format: "Multiple Choice",
    question: "Welcher Punkt gehört NICHT zu SMART?",
    answer: "Richtig ist Option D: „Transparent“ ist hilfreich, zählt aber nicht zur klassischen SMART-Definition.",
    options: ["Spezifisch", "Messbar", "Realistisch", "Transparent"],
    correctIndex: 3
  },
  {
    id: "q28",
    category: "Coaching",
    format: "Multiple Choice",
    question: "Welcher Schritt gehört NICHT zu einer strukturierten Videoanalyse?",
    answer: "Richtig ist Option B: Lange unkommentierte Videosequenzen wirken ermüdend und unklar.",
    options: [
      "Clips auf 3–5 Sequenzen begrenzen.",
      "Lange unkommentierte Spielszenen zeigen, damit Spieler selbst interpretieren.",
      "Eine klare Botschaft formulieren.",
      "Handlungsziel für das nächste Training definieren."
    ],
    correctIndex: 1
  },
  {
    id: "q29",
    category: "Technik",
    format: "Quizkarte",
    question: "3 Schlüsselelemente für sauberen Abdruck beim Skating?",
    answer: "Tiefe Hüfte, ganzer Kufenabdruck, kompletter Follow-through."
  },
  {
    id: "q30",
    category: "Technik",
    format: "Quizkarte",
    question: "Training „Kopf hoch“ beim Puckhandling – ein Ansatz?",
    answer: "Constraints wie peripheres Ziel oder Coach-Calls, hohe Puckfrequenz und kleine Felder mit Druck."
  },
  {
    id: "q31",
    category: "Technik",
    format: "Quizkarte",
    question: "Wichtigste Vorbedingung für harte flache Pässe?",
    answer: "Saubere Gewichtsverlagerung und Blatt-Follow-through zum Ziel."
  },
  {
    id: "q32",
    category: "Technik",
    format: "Quizkarte",
    question: "Zwei Korrekturhinweise für Quick-Release-Schüsse?",
    answer: "Puck vor dem Körper halten und minimale Ausholbewegung mit kurzer Hüft-/Schulterrotation."
  },
  {
    id: "q33",
    category: "Taktik",
    format: "Quizkarte",
    question: "Definiere „Gap“.",
    answer: "Spielbarer Abstand Verteidiger–Angreifer, der Druck zulässt, ohne geschlagen zu werden."
  },
  {
    id: "q34",
    category: "Taktik",
    format: "Quizkarte",
    question: "1-2-2 Forecheck – Rolle von F1?",
    answer: "Lenkt Spiel nach außen, zwingt Gegner zum langsamen First Pass."
  },
  {
    id: "q35",
    category: "Taktik",
    format: "Quizkarte",
    question: "Zwei Kennzeichen guten Puckmanagements?",
    answer: "Risiko in der Mitte gering halten, unter Druck einfache Entscheidungen (Chip/Glass) treffen."
  },
  {
    id: "q36",
    category: "Taktik",
    format: "Quizkarte",
    question: "Wozu dient der Bumper im 1-3-1 Powerplay?",
    answer: "Als Verbindungspunkt für schnelle Richtungswechsel und Seam-Pässe."
  },
  {
    id: "q37",
    category: "Physis",
    format: "Quizkarte",
    question: "Wann platzierst du Schnelligkeitstraining im Ablauf?",
    answer: "Früh im Training, wenn Spieler frisch sind; Qualität vor Umfang, vollständige Pausen."
  },
  {
    id: "q38",
    category: "Physis",
    format: "Quizkarte",
    question: "RSA – typisches Set?",
    answer: "6–10 Sprints à 10–40 m, 5–10 Sekunden Dauer, unvollständige Pausen, 2–4 Serien."
  },
  {
    id: "q39",
    category: "Physis",
    format: "Quizkarte",
    question: "Hypertrophie – grobe Trainingsrichtwerte?",
    answer: "6–12 Wiederholungen, ca. 60–80 % 1RM, 2–4 Sätze."
  },
  {
    id: "q40",
    category: "Physis",
    format: "Quizkarte",
    question: "Intermittierendes Training – Beispiel auf dem Eis?",
    answer: "15 Sekunden Belastung, 15 Sekunden Pause in Serien, anschließend 2–3 Minuten Serienpause."
  },
  {
    id: "q41",
    category: "Psyche",
    format: "Quizkarte",
    question: "Drei Grundtechniken mentalen Trainings?",
    answer: "Atmung, Selbstgespräche, Visualisieren."
  },
  {
    id: "q41b",
    category: "Psyche",
    format: "Quizkarte",
    question: "SMART – wofür stehen die fünf Buchstaben?",
    answer: "Spezifisch, Messbar, Attraktiv, Realistisch, Terminiert."
  },
  {
    id: "q41c",
    category: "Psyche",
    format: "Quizkarte",
    question: "Wie erklärst du SMART kurz einem Spieler?",
    answer: "Ziel konkret formulieren, Fortschritt tracken, attraktiv und erreichbar machen, klare Frist setzen."
  },
  {
    id: "q41d",
    category: "Psyche",
    format: "Quizkarte",
    question: "Wie unterstützt SMART die Motivation?",
    answer: "Klar formulierte Ziele wirken greifbar, zeigen Fortschritt und erhöhen Verbindlichkeit."
  },
  {
    id: "q42",
    category: "Psyche",
    format: "Quizkarte",
    question: "Box-Breathing – Schema?",
    answer: "4 Sekunden einatmen, 4 halten, 4 ausatmen, 4 halten."
  },
  {
    id: "q43",
    category: "Psyche",
    format: "Quizkarte",
    question: "Innen- vs. Außenperspektive beim Visualisieren?",
    answer: "Innen: durch eigene Augen. Außen: sich selbst von außen betrachten."
  },
  {
    id: "q44",
    category: "Psyche",
    format: "Quizkarte",
    question: "Motivierende Zielmetrik im Nachwuchs – Beispiel?",
    answer: "Mindestens acht Slot-Schüsse pro Spiel statt reines Ergebnisziel."
  },
  {
    id: "q45",
    category: "Coaching",
    format: "Quizkarte",
    question: "Unterschied Handlungs- vs. Resultatziele?",
    answer: "Handlungsziele sind prozess- und kontrollierbar, Resultatziele vom Endergebnis abhängig."
  },
  {
    id: "q46",
    category: "Coaching",
    format: "Quizkarte",
    question: "Vier Coach-Hüte?",
    answer: "Trainer (erklärt), Coach (fragt), Berater (co-entscheidet), Leader/Moderator (rahmt Kultur)."
  },
  {
    id: "q47",
    category: "Coaching",
    format: "Quizkarte",
    question: "Was bedeutet „spielnahes Training“?",
    answer: "Realistische Situationen mit Zeit-, Raum- und Gegnerdruck, Entscheidungen in Echtzeit."
  },
  {
    id: "q48",
    category: "Coaching",
    format: "Quizkarte",
    question: "Schema für roten Faden in Einheiten?",
    answer: "Aktivierung → Kerntechnik → Anwendung → Spielform → Abschluss/Transfer."
  },
  {
    id: "q49",
    category: "Organisation",
    format: "Quizkarte",
    question: "Warum Helm- und Ausrüstungscheck vor jeder Einheit?",
    answer: "Reduziert Verletzungsrisiken, sorgt für passenden Sitz und funktionierende Schutzwirkung."
  },
  {
    id: "q50",
    category: "Organisation",
    format: "Quizkarte",
    question: "EAP – erster Schritt?",
    answer: "Rollen und Notrufweg klar festlegen; eine Person übernimmt die Leitung."
  },
  {
    id: "q51",
    category: "Technik",
    format: "Quizkarte",
    question: "Check annehmen – zwei Stichworte?",
    answer: "Seitlich eindrehen, Kernspannung tief halten."
  },
  {
    id: "q52",
    category: "Technik",
    format: "Quizkarte",
    question: "Blockshot – was folgt nach dem Block?",
    answer: "Schnell aufstehen, Slot räumen oder Scheibe klären."
  },
  {
    id: "q53",
    category: "Spezialsituationen",
    format: "Quizkarte",
    question: "Grundidee Empty-Net-Offense?",
    answer: "Überzahl an starker Seite, Net-Front-Traffic, Schüsse mit Blocker und Absicherung."
  },
  {
    id: "q54",
    category: "Spezialsituationen",
    format: "Quizkarte",
    question: "PK-Ziel bei der Schussauswahl?",
    answer: "Außenwürfe zulassen, Slot- und Seam-Pässe verhindern."
  },
  {
    id: "q55",
    category: "Spezialsituationen",
    format: "Quizkarte",
    question: "D-Zone-Face-off – Center verliert: Reaktion?",
    answer: "Winger blockt, Verteidiger räumt Net-Front, schneller Clear entlang der Bande."
  },
  {
    id: "q56",
    category: "Taktik",
    format: "Quizkarte",
    question: "Breakout unter Druck – sicherste Option?",
    answer: "Scheibe an die starke Seite („Up“) oder Chip über Glass – abhängig vom Druckbild."
  },
  {
    id: "q57",
    category: "Kommunikation",
    format: "Quizkarte",
    question: "Regel für gutes Feedback?",
    answer: "Konkret, zeitnah, auf beobachtbares Verhalten bezogen."
  },
  {
    id: "q58",
    category: "Kommunikation",
    format: "Quizkarte",
    question: "Warum Charaktere im Staff kennen?",
    answer: "Erleichtert passende Kommunikation, bessere Entscheidungen, weniger Konflikte."
  },
  {
    id: "q59",
    category: "Kommunikation",
    format: "Quizkarte",
    question: "Respect on & off the Ice – zwei Inhalte?",
    answer: "Respekt gegenüber Schiedsrichtern, Anti-Diskriminierung und Sicherheitsregeln betonen."
  },
  {
    id: "q60",
    category: "Kommunikation",
    format: "Quizkarte",
    question: "Elternarbeit – No-Go am Spielfeldrand?",
    answer: "Coaching von außen oder Schiedsrichterkritik – Teamregel klar kommunizieren."
  },
  {
    id: "q61",
    category: "Technik",
    format: "Kurzantwort",
    question: "Welche Keypoints beachtest du beim Scheibenführen in Geschwindigkeit?",
    answer:
      "Kopf oben für Wahrnehmung, Scheibe nah am Körper, wechselnde Blattwinkel, Körperspannung tief und aktive Kantenarbeit für Richtungswechsel."
  },
  {
    id: "q62",
    category: "Technik",
    format: "Kurzantwort",
    question: "Wie strukturierst du ein Techniktraining nach BASPO-Leitlinien?",
    answer:
      "Einstieg/Aktivierung, Zielbild vermitteln, Üben an Stationen mit Coaching-Punkten, Anwendung in spielnahen Formen, Abschluss mit Feedback und Transferauftrag."
  },
  {
    id: "q63",
    category: "Technik",
    format: "Multiple Choice",
    question: "Welcher Hinweis passt NICHT zu einem kraftvollen Wrist Shot?",
    answer: "Richtig ist Option D: Der Puck sollte nicht hinter dem hinteren Bein starten.",
    options: [
      "Gewicht auf hinteres Bein, dann nach vorne verlagern.",
      "Unterhand führt, Oberhand lenkt Rotation.",
      "Blatt tangiert das Eis kurz vor Kontakt.",
      "Puck weit hinter dem hinteren Bein starten, um mehr Schwung aufzubauen."
    ],
    correctIndex: 3
  },
  {
    id: "q64",
    category: "Taktik",
    format: "Kurzantwort",
    question: "Wie erklärst du deinen Spielern das Konzept „Switch Quick“?",
    answer:
      "Nach Scheibengewinn soll die Mannschaft schnell von Defense zu Offense umschalten: erster Pass weg vom Druck, Unterstützung in Dreiecken, direkte Tiefe suchen."
  },
  {
    id: "q65",
    category: "Taktik",
    format: "Kurzantwort",
    question: "Welche Maßnahmen helfen gegen zu viele Abschlüsse im Slot?",
    answer:
      "Inside-Lane verdichten, Sticks aktiv, frühe Body-Position, Box-Outs klären, Nachschüsse kontrollieren und Forecheck-Anpassung zur Druckentlastung."
  },
  {
    id: "q66",
    category: "Taktik",
    format: "Multiple Choice",
    question: "Welcher Trigger löst im 1-1-3 Neutralzonen-Check den aggressiven Vorstoß aus?",
    answer: "Richtig ist Option B: Ein schlechter First Pass oder hoher Chip ist das Signal für Druck.",
    options: [
      "Sauberer Direktpass in die Mitte.",
      "Hoher Chip oder schwacher First Pass des Gegners.",
      "Defensiver Wechsel des Gegners.",
      "Eigener D-Zonen-Face-off-Gewinn."
    ],
    correctIndex: 1
  },
  {
    id: "q67",
    category: "Physis",
    format: "Kurzantwort",
    question: "Wie erklärst du das Modell der Superkompensation in einem Satz?",
    answer:
      "Belastung senkt Leistungsniveau kurzfristig; ausreichende Erholung führt zu einem Leistungsanstieg über Ausgangsniveau – der optimale Zeitpunkt für die nächste Belastung."
  },
  {
    id: "q68",
    category: "Physis",
    format: "Multiple Choice",
    question: "Welche Energiequelle dominiert bei einem 30-Sekunden-High-Intensity-Shift?",
    answer: "Richtig ist Option C: Vor allem anaerob-laktazid, mit Anteil der alaktaziden Reserve.",
    options: [
      "Aerob-laktazid",
      "Aerob-alaktazid",
      "Anaerob-laktazid",
      "Nur anaerob-alaktazid"
    ],
    correctIndex: 2
  },
  {
    id: "q69",
    category: "Physis",
    format: "Kurzantwort",
    question: "Wie planst du eine 10-wöchige Sommer-Kraftphase grob?",
    answer:
      "2 Wochen Anatomische Anpassung, 4 Wochen Hypertrophie, 3 Wochen Maximalkraft/Schnellkraft, 1 Woche Deload/Test – jeweils mit korrespondierenden Ausgleichsmodulen."
  },
  {
    id: "q70",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Wie förderst du positives Selbstgespräch bei Nachwuchsspielern?",
    answer:
      "Schlüsselwörter definieren, Situationsbeispiele üben, Trainerfeedback spiegeln lassen und kleine Erfolgserlebnisse bewusst machen."
  },
  {
    id: "q71",
    category: "Psyche",
    format: "Multiple Choice",
    question: "Welcher Faktor gehört zur emotionalen Substanz nach BASPO?",
    answer: "Richtig ist Option C: Selbstvertrauen.",
    options: ["Kraft", "Koordination", "Selbstvertrauen", "Schnelligkeit"],
    correctIndex: 2
  },
  {
    id: "q72",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Was umfasst das FTEM-Eishockey-Modell grob?",
    answer:
      "Stufen Foundation, Talent, Elite, Mastery – beschreibt Entwicklungspfade, Schwerpunkte und Übergänge vom Einstieg bis zum Hochleistungssport."
  },
  {
    id: "q73",
    category: "Coaching",
    format: "Multiple Choice",
    question: "Welches Element gehört NICHT zu den vier Handlungsfeldern von «Vermitteln»?",
    answer: "Richtig ist Option D: «Rekrutieren» ist kein Teil der Vermittlungshandlungsfelder.",
    options: ["Planen", "Durchführen", "Auswerten", "Rekrutieren"],
    correctIndex: 3
  },
  {
    id: "q74",
    category: "Methodik",
    format: "Kurzantwort",
    question: "Wie unterscheidet sich differenzielles Lernen von klassischem Wiederholen?",
    answer:
      "Varianz wird bewusst erzeugt, um stabile Bewegungsmuster zu entwickeln; Fehler werden zugelassen, Kontext verändert sich – Fokus auf Lösungssuche statt perfekte Wiederholung."
  },
  {
    id: "q75",
    category: "Methodik",
    format: "Multiple Choice",
    question: "Wozu dient Micro-Teaching im Coaching-Kontext?",
    answer: "Richtig ist Option C: Kurze, fokussierte Sequenzen zur Verbesserung einzelner Coaching-Skills.",
    options: [
      "Spieler spielen in Mikro-Teams.",
      "Analyse großer Trainingsblöcke.",
      "Kurzsequenzen zur gezielten Coaching-Reflexion.",
      "Nur zur Videoanalyse von Gegnern."
    ],
    correctIndex: 2
  },
  {
    id: "q76",
    category: "Organisation",
    format: "Kurzantwort",
    question: "Welche Punkte checkst du vor einem Auswärtsspiel organisatorisch?",
    answer:
      "Reisezeiten, Ausrüstungsliste, medizinisches Material, EAP-Kontakte der Halle, Kommunikation an Eltern/Team, Verpflegungsplanung."
  },
  {
    id: "q77",
    category: "Organisation",
    format: "Multiple Choice",
    question: "Welcher Punkt gehört ins Sicherheits-Merkblatt Eishockey?",
    answer: "Richtig ist Option B: Umgang mit Checks/Kopfschutz wird explizit erwähnt.",
    options: [
      "Jahresbudgetplanung",
      "Verhalten bei Checks und Kopfschutz",
      "Taktische Systeme teamspezifisch",
      "Nur Ernährungsrichtlinien"
    ],
    correctIndex: 1
  },
  {
    id: "q78",
    category: "Spezialsituationen",
    format: "Kurzantwort",
    question: "Nenne zwei Varianten eines offensiven Face-off-Spielzugs.",
    answer:
      "Direct Shot mit Bumper-Abschirmung oder gewonnenes Bully zurück, Defense schiebt zur Mitte für One-Timer – jeweils klare Rollen für Screen und Rebound."
  },
  {
    id: "q79",
    category: "Spezialsituationen",
    format: "Multiple Choice",
    question: "Was ist ein Hauptziel eines 1-3-1 Powerplays?",
    answer: "Richtig ist Option C: Der Seam-Pass wird provoziert, um Inside-Schuss zu erzeugen.",
    options: [
      "Nur Schüsse von der blauen Linie nehmen.",
      "Keinen Spieler vor dem Tor positionieren.",
      "Seam-Pass auf Flügel oder Bumper vorbereiten.",
      "Nur Schüsse von hinter dem Tor vorbereiten."
    ],
    correctIndex: 2
  },
  {
    id: "q80",
    category: "Kommunikation",
    format: "Kurzantwort",
    question: "Wie nutzt du das Sender-Empfänger-Modell im Traineralltag?",
    answer:
      "Botschaft klar codieren, passenden Kanal wählen, Rückmeldung einholen (Feedback-Loop), Störquellen minimieren – z. B. in Drittelpausen gezielt Blickkontakt herstellen."
  },
  {
    id: "q81",
    category: "Kommunikation",
    format: "Multiple Choice",
    question: "Welcher Satz beschreibt das Prinzip «Feedback Sandwich» korrekt?",
    answer: "Richtig ist Option B: Positiv – Korrektur – positiv verstärken.",
    options: [
      "Nur Kritik, keine Positivpunkte.",
      "Positives Feedback, sachliche Korrektur, wieder positives Element.",
      "Erst Hausaufgaben, dann Lob.",
      "Lange Theorieblöcke, dann kurze Rückmeldung."
    ],
    correctIndex: 1
  },
  {
    id: "q82",
    category: "Physis",
    format: "Kurzantwort",
    question: "Erkläre Superkompensation und leite eine Trainingsentscheidung ab.",
    answer:
      "Nach einer Belastung sinkt die Leistung, erholt sich und steigt kurz über das Ausgangsniveau. Die nächste Einheit platzierst du in diesem Fenster, sonst riskierst du bei zu frühem Reiz Ermüdung und bei zu spätem Reiz stagnierende Entwicklung."
  },
  {
    id: "q83",
    category: "Physis",
    format: "Kurzantwort",
    question: "Was ist RSA und wie trainierst du es im Hockey?",
    answer:
      "Repeated Sprint Ability = mehrere Sprints mit kurzen Pausen qualitativ ausführen. Trainiere z. B. 6–8 × 20–30 m mit 20–30 s Pause, 2–3 Serien. Technik, Startwinkel und vollständige Pausen sichern Qualität."
  },
  {
    id: "q84",
    category: "Physis",
    format: "Kurzantwort",
    question: "Beschreibe das RAMP-Warm-up und nenne je eine Übung.",
    answer:
      "Raise: Herzfrequenz steigern (Skating-Loops). Activate & Mobilize: Gelenke und Muskulatur aktivieren/mobilisieren (Cossack Squats). Potentiate: Nervensystem anheizen (2 × 10 m Starts oder Quick-Release-Schüsse)."
  },
  {
    id: "q85",
    category: "Physis",
    format: "Kurzantwort",
    question: "Nenne drei präventive Schwerpunkte für Hockey-Spieler.",
    answer:
      "Adduktoren/Leiste (Side Planks mit Squeeze), Hamstrings (Nordic Curls oder Heel Slides), Schulter/Scapula (YTWs, Serratus-Push-ups)."
  },
  {
    id: "q86",
    category: "Physis",
    format: "Kurzantwort",
    question: "Wie planst du Schnelligkeitseinheiten im Trainingsablauf?",
    answer:
      "Früh im Training wenn Spieler frisch sind, geringe Wiederholungszahlen, vollständige Pausen, kurze Serien und Technikfokus auf Startposition und Arm-/Knee-Drive."
  },
  {
    id: "q87",
    category: "Physis",
    format: "Kurzantwort",
    question: "Intermittierend vs. HIIT – Unterschied & Einsatz im Hockey?",
    answer:
      "Intermittierend: kurze On/Off-Intervalle (z. B. 15/15) spielflussnah, ideal für Hockey. HIIT: längere Intervalle (z. B. 4 × 4 min), höhere Dauerbelastung. Hockey nutzt primär intermittierende Formate und RSA-Blöcke."
  },
  {
    id: "q88",
    category: "Physis",
    format: "Kurzantwort",
    question: "Begründe, warum In-Season-Krafttraining sinnvoll bleibt.",
    answer:
      "Erhält Leistung, reduziert Verletzungsrisiko und sichert neuromuskuläre Qualität. Micro-Dosen 1–2 × pro Woche à 30–40 min mit Fokus auf Grundübungen und Stabilität genügen."
  },
  {
    id: "q89",
    category: "Physis",
    format: "Kurzantwort",
    question: "Gib ein Beispiel für Power-Training im Nachwuchs.",
    answer:
      "3 × 3–5 leichte Sprünge (Box-/Skater-Jumps) plus Medizinballwürfe mit Rotation. Fokus auf saubere Landungen, komplette Erholung zwischen Wiederholungen."
  },
  {
    id: "q90",
    category: "Physis",
    format: "Kurzantwort",
    question: "Wie misst du Belastung einfach in der Praxis?",
    answer:
      "sRPE erfassen (RPE × Trainingsminuten) und Dauer dokumentieren. Trends beobachten, Peaks >30 % vermeiden und subjektive Werte mit Trainingsinhalten abgleichen."
  },
  {
    id: "q91",
    category: "Physis",
    format: "Kurzantwort",
    question: "Was ist ein Taper vor einem wichtigen Spiel?",
    answer:
      "Volumen reduzieren, Intensität moderat bis hoch halten, Fokus auf Speed, Powerplay/Penaltykill und frische Beine. Ziel ist optimale Leistungsbereitschaft und Regeneration."
  },
  {
    id: "q92",
    category: "Physis",
    format: "Kurzantwort",
    question: "Welche Energiesysteme dominieren einen 45-Sekunden-Shift?",
    answer:
      "Primär anaerob-glykolytisch mit Unterstützung des ATP-KP-Systems für Starts und Sprints; aerob wird in Pausen für Erholung genutzt."
  },
  {
    id: "q93",
    category: "Physis",
    format: "Kurzantwort",
    question: "Nenne drei Qualitätskriterien für Plyometrie.",
    answer:
      "Kurze Bodenkontaktzeit, stabile Landungen (Knie über Fuß), geringe Ermüdung – bei Qualitätseinbruch Satz sofort beenden."
  },
  {
    id: "q94",
    category: "Physis",
    format: "Kurzantwort",
    question: "Skizziere einen Mikrozyklus mit Spiel am Samstag.",
    answer:
      "Mo Regeneration, Di Kraft/Speed, Mi On-Ice mit RSA, Do Prävention & Skills, Fr Spielnah/Taper, Sa Spiel, So optional Recovery."
  },
  {
    id: "q95",
    category: "Physis",
    format: "Kurzantwort",
    question: "Wie integrierst du Leistenprävention in eine Einheit?",
    answer:
      "Im Warm-up Adductor Squeeze/Isometrics, im Hauptteil laterale Bewegungen mit Kontrolle, am Ende Side Plank mit Hip Adduction 2 × 20–30 s."
  },
  {
    id: "q96",
    category: "Physis",
    format: "Kurzantwort",
    question: "Was bedeutet ACWR und wie nutzt du es pragmatisch?",
    answer:
      "Acute:Chronic Workload Ratio vergleicht aktuelle Wochenlast mit 3–4-Wochen-Durchschnitt. Nutze es als Trendindikator und vermeide Sprünge >20–30 % von Woche zu Woche."
  },
  {
    id: "q97",
    category: "Physis",
    format: "Kurzantwort",
    question: "Nenne zwei einfache Off-Ice-Tests zur Belastungssteuerung.",
    answer:
      "10 m-Sprintzeit und Countermovement Jump (Höhe, Kontaktzeit) via App oder Matte messen. Verlauf dokumentieren und Abweichungen interpretieren."
  },
  {
    id: "q98",
    category: "Physis",
    format: "Kurzantwort",
    question: "Wie planst du eine 20-minütige Regenerationseinheit am Tag nach dem Spiel?",
    answer:
      "5 min lockeres Ausfahren, 10 min Mobility & Atemübungen, 5 min leichtes Core/Glute-Aktivieren. Hydration sowie Kohlenhydrate+Protein sicherstellen."
  },
  {
    id: "q99",
    category: "Physis",
    format: "Kurzantwort",
    question: "Welche Rolle spielt Schlaf in der Leistungsentwicklung?",
    answer:
      "Hauptquelle für Regeneration und Adaptation. Ziel: ~8 h, feste Routine, Screens reduzieren, Schlafumgebung kühl/dunkel."
  },
  {
    id: "q100",
    category: "Physis",
    format: "Kurzantwort",
    question: "Gib ein Beispiel für Kontrasttraining.",
    answer:
      "Schwere Kniebeuge 3 × 3 bei RPE ~8, unmittelbar gefolgt von 3 explosiven Sprüngen (Box Jump oder Countermovement Jump)."
  },
  {
    id: "q101",
    category: "Physis",
    format: "Kurzantwort",
    question: "Fehlerbild: Spieler kippt bei Landungen nach innen – Korrektur?",
    answer:
      "Knie-Alignment coachen (Knie über Fuß), Gluteus medius aktivieren (Monster Walks), Landungshöhe reduzieren und isometrische Haltepositionen üben."
  },
  {
    id: "q102",
    category: "Physis",
    format: "Kurzantwort",
    question: "Wie gestaltest du GA1 im Hockey?",
    answer:
      "Off-Ice: 20–40 min lockeres Radfahren oder Rudern. On-Ice: technische Dauerläufe mit geringer Intensität, Fokus auf saubere Technik und Kommunikation."
  },
  {
    id: "q103",
    category: "Physis",
    format: "Kurzantwort",
    question: "Was trainierst du zwei Tage vor dem Spiel, was vermeidest du?",
    answer:
      "Vermeide hohen Umfang und harte exzentrische Belastungen. Setze auf kurze Speed-Reize, Spezialteams, taktische Klarheit und aktive Erholung."
  },
  {
    id: "q104",
    category: "Physis",
    format: "Kurzantwort",
    question: "Warum gilt «Qualität vor Quantität» bei Speedtraining?",
    answer:
      "Schnelligkeit ist neuromuskulär. Ermüdung verschlechtert Technik und Muster, deshalb nur kurze hochwertige Wiederholungen im frischen Zustand."
  },
  {
    id: "q105",
    category: "Physis",
    format: "Kurzantwort",
    question: "Wie trainierst du RSA bei halber Halle?",
    answer:
      "Shuttle-Sprints 10–20 m zwischen Linien, Bande-zu-Blau-Intervalle, kleine Gruppen mit klaren Start-/Pausezeiten. Qualität und Lauftechnik überwachen."
  },
  {
    id: "q106",
    category: "Physis",
    format: "Kurzantwort",
    question: "Welche drei Kennzahlen dokumentierst du nach einer Einheit?",
    answer:
      "Trainingsdauer, RPE pro Spieler und Hauptinhalt (z. B. Speed/RSA/Plyo/Kraft). Ergänzend Anwesenheit oder individuelle Anpassungen notieren."
  },
  {
    id: "q107",
    category: "Physis",
    format: "Kurzantwort",
    question: "Nenne drei Risiken von zu viel Volumen in der Saison.",
    answer:
      "Leistungsverlust, erhöhtes Verletzungsrisiko und mentale Ermüdung/Burn-out-Tendenzen."
  },
  {
    id: "q108",
    category: "Physis",
    format: "Kurzantwort",
    question: "Wie kombinierst du Technik und Physis sinnvoll auf dem Eis?",
    answer:
      "Technische Drills mit anschließenden Sprints/Starts verknüpfen (z. B. First Touch → 0–10 m Sprint), Pausen vollständig halten, Fokus auf Qualität."
  },
  {
    id: "q109",
    category: "Physis",
    format: "Kurzantwort",
    question: "Beispiel für eine 30-minütige In-Season-Krafteinheit mit sechs Übungen?",
    answer:
      "Trap-Bar Deadlift 3 × 4, Split Squat 2 × 6/Bein, DB Bench 3 × 6, Ruderzug 3 × 6, Nordics 2 × 5, Adductor Side Plank 2 × 20–30 s."
  },
  {
    id: "q110",
    category: "Physis",
    format: "Kurzantwort",
    question: "Wie gehst du mit einem Teamtag mit leichtem DOMS um?",
    answer:
      "Volumen reduzieren, Fokus auf Technik/Speed kurz halten, Mobility & Flow-Drills einbauen, Recovery durch Ernährung und Schlaf betonen."
  },
  {
    id: "q111",
    category: "Physis",
    format: "Kurzantwort",
    question: "Was bedeutet «Stiffness» und warum ist sie wichtig?",
    answer:
      "Reaktive Steifigkeit im Dehnungs-Verkürzungs-Zyklus speichert elastische Energie. Wichtig für schnelle Richtungswechsel und Sprints – gezielt über Plyos und Isometrics trainieren."
  },
  {
    id: "q112",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Nenne die vier Komponenten der Leistung im Eishockey und je zwei Beispiele.",
    answer:
      "Konditionelle Substanz (z. B. Schnelligkeit, Spielausdauer), Emotionale Substanz (Motivation, Disziplin), Koordinative/technische Kompetenz (Schlittschuhlauf, Scheibenführung, Passen, Schuss), Mental-taktische Kompetenz (Spiel lesen, Taktik- und Sondersituationen)."
  },
  {
    id: "q113",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Warum braucht es alle vier Komponenten der Leistung in der Ausbildung?",
    answer:
      "Nur das Zusammenspiel von körperlichen, technischen, emotionalen und mental-taktischen Faktoren ermöglicht druck- und entscheidungsfähiges Handeln im Spiel."
  },
  {
    id: "q114",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Ordne typische Trainingsinhalte den vier Komponenten zu.",
    answer:
      "Sprint/RSA → konditionelle Substanz; Feedback-Regeln-Respekt → emotionale Substanz; Technikdrills/Koordination → koordinative/technische Kompetenz; Spielformen/PP/PK → mental-taktische Kompetenz."
  },
  {
    id: "q115",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Welche technischen Abkürzungen sind üblich in BASPO-Unterlagen?",
    answer: "SL = Schlittschuhlauf, SF = Scheibenführen, PA = Passen, Sch = Schuss, KöSp = Körperspiel."
  },
  {
    id: "q116",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Wie verknüpfst du die vier Komponenten in einer Trainingseinheit?",
    answer:
      "Roter Faden: Aktivierung für konditionelle Substanz, Kerntechnik für koordinative Kompetenz, Spielform für mental-taktische Kompetenz, Abschluss/Wettbewerb für emotionale Substanz mit Reflexion."
  },
  {
    id: "q117",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Welche Symbole stehen in BASPO-Zeichnungen für Offensiv-, Defensivspieler, Joker, Goalie, Puck und Hindernis?",
    answer:
      "Helle/dunkle Spielerzeichen für Offense/Defense, Joker-Symbol nach Legende, Torhüter-Icon, einzelne oder mehrere Pucks, sowie markierte Hürden, Kübel oder Stangen für Hindernisse."
  },
  {
    id: "q118",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Nenne Zeichen für Bewegungen: Start, Vorwärts/Rückwärts, Stopp, Seitwärts, Check, Pass, Schuss.",
    answer:
      "Startstern oder Anlauf, Pfeile für Vorwärts/Rückwärts, T-Symbol für Stopp, seitliche Pfeile für Side-Steps, X- oder Kontaktzeichen für Check, durchgezogene Pfeile für Pass, Pfeil mit Schuss-Markierung für Abschluss."
  },
  {
    id: "q119",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Warum lohnt sich Symbolkenntnis für die Prüfung?",
    answer:
      "Übungen lassen sich schneller verstehen und erklären, Organisation und Sicherheit auf dem Eis werden sauber kommuniziert."
  },
  {
    id: "q120",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Erkläre kurz die Vier Säulen des Lernens.",
    answer:
      "Aufmerksamkeit/Motivation sichern, aktive Beteiligung durch viel Bewegung gewährleisten, unmittelbares Feedback ermöglichen und viele Wiederholungen für Konsolidierung schaffen."
  },
  {
    id: "q121",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Nenne je Säule zwei Praxismaßnahmen für eine Eislektion.",
    answer:
      "Aufmerksamkeit: klare Ziele, Challenges. Aktiv: Spielformen, Wartezeiten vermeiden. Feedback: Auto-Feedback über Constraints, gezielte Coach-Impulse. Konsolidierung: Wiederholungen, nicht zu schnell eingreifen."
  },
  {
    id: "q122",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Wie überprüfst du eine Spielform anhand der Vier Säulen?",
    answer:
      "Vor oder nach der Einheit checken: motiviert sie, sind alle aktiv, erhalten sie Feedback, gibt es genügend Wiederholungen? Bei Bedarf Regeln/Organisation anpassen."
  },
  {
    id: "q123",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Warum ist Schlaf im Lernprozess relevant laut BASPO?",
    answer:
      "Schlaf unterstützt die Konsolidierung motorischer und kognitiver Inhalte – Nachwuchsspieler brauchen klare Routinen und Hinweise für Eltern."
  },
  {
    id: "q124",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Skizziere die methodische Progression über den Puck.",
    answer:
      "Vom individuellen Puckhalten über Teilen bis zu gemeinsamem Schützen/Verteidigen und dem Wettkampfmodus – z. B. 1v1 → 2v2 → 3v3."
  },
  {
    id: "q125",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Worauf achtest du beim Übergang von Puck halten zu Puck teilen?",
    answer:
      "Kopf oben, Passqualität und Timing, Kommunikation im Team sowie Entscheidungskompetenz, wann gehalten oder gespielt wird."
  },
  {
    id: "q126",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Wie erhöhst du systematisch Druck in Spielformen?",
    answer:
      "Zeit und Raum reduzieren, zusätzliche Verteidiger oder Joker einbauen, Scoring-Regeln verschärfen, variable Startpositionen nutzen."
  },
  {
    id: "q127",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Welche Technik-Keypoints stehen bei „Ladet das Schiff!“ im Fokus?",
    answer:
      "Kopf oben, stabile Körperhaltung, große Armbewegung und aktive obere Hand beim Führen der Scheibe."
  },
  {
    id: "q128",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Auf welche Punkte coachst du bei „Achtung Matrosen!“?",
    answer:
      "Kopf hoch, Körper zwischen Puck und Gegner, breite und tiefe Haltung, Rhythmuswechsel, sauberes Skating."
  },
  {
    id: "q129",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Welche Offense- und Defense-Kerne gelten bei „Entern!“?",
    answer:
      "Offense: Lösungen unter Druck, Schutz, aktives Skating. Defense: Gegner aufs schlechte Eis lenken, Schaufel-zu-Schaufel spielen, aggressiv Puck gewinnen."
  },
  {
    id: "q130",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Was ist das Lernziel und die Keypoints von „Teile den Puck!“?",
    answer:
      "Präzise Pässe in Bewegung, Kopf oben, Kommunikation visuell und auditiv – Puckteilen unter Druck automatisieren."
  },
  {
    id: "q131",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Welche Schwerpunkte setzt du bei „Pass-Challenge“?",
    answer:
      "Passpräzision, Spiel lesen und schnelle Entscheidungen. Rollenwechsel bei Fehlern erhöht Handlungsdruck und Aufmerksamkeit."
  },
  {
    id: "q132",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Was belohnst du in der Spielform „Drei Pässe, drei Tore“?",
    answer:
      "Team-Puckbesitz, Passserien mit drei Pässen und Abschlussqualität innerhalb vorgegebener Zeitfenster."
  },
  {
    id: "q133",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Welche Organisationsideen gehören zu „Achtung Verkehr“?",
    answer:
      "Innen- und Außenkreise definieren, klare akustische Signale für Rollenwechsel, Passgenauigkeit mitzählen oder visualisieren."
  },
  {
    id: "q134",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Nenne Coachingpunkte für „Wer überlebt den Fänger?“.",
    answer:
      "Offense: Puck schützen, Kopf hoch. Defense: Gegner lenken, aktive Stockarbeit, Entschlossenheit bei der Eroberung."
  },
  {
    id: "q135",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Was ist das Lernziel von „Gefangene der Sphäre“?",
    answer:
      "Puck teilen und freilaufen auf engem Raum, kurze Pässe spielen und Zeit-/Raumdruck reduzieren durch kluges Positionieren."
  },
  {
    id: "q136",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Worauf achtest du bei „Mit 3 Chancen zum Tor“ (1v1 in drei Zonen)?",
    answer:
      "Offense: Puck schützen, Check-Bereitschaft, schneller Abschluss. Defense: Raumkontrolle, Stockführung, Körperkontakt sauber setzen."
  },
  {
    id: "q137",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Welche Coachingpunkte gelten bei „Die besten Gladiatoren“ (2v2 eng)?",
    answer:
      "Zweiter Effort, schnelle Puckfindung, defensiv Rolle klären bevor in Offensive umgeschaltet wird."
  },
  {
    id: "q138",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Welche Varianten bieten sich bei „Sei ein Mehrkämpfer“ (3v3 breit) an?",
    answer:
      "Joker als Screen oder an der Bande, Torpositionen wechseln, Abschlüsse aus dem Handgelenk fordern und Scoring-Regeln variieren."
  },
  {
    id: "q139",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Nenne drei Gründe, warum Spielen eine bevorzugte Lernform ist.",
    answer:
      "Hohe Aufmerksamkeit und Aktivität, unmittelbares Feedback und vielfältige Wiederholungen/Variationen fördern Entscheidungskompetenz und Regelakzeptanz."
  },
  {
    id: "q140",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Wie definierst du Ziele vor einer Spielform wie „Let’s play hockey“?",
    answer:
      "Lernfokus klar benennen (z. B. Puck teilen unter Druck), messbare Challenges oder Scoring-Regeln festlegen und den Spielern kommunizieren."
  },
  {
    id: "q141",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Wie organisierst du eine Spielform, damit sie selbstständig läuft?",
    answer:
      "Klare Regeln, Rollen und Zeitfenster definieren, Joker-Aufgaben vergeben, Auto-Feedback nutzen – Coach beobachtet und greift nur punktuell ein."
  },
  {
    id: "q142",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Welche Alters- und Lernstufen berücksichtigen die BASPO-Unterlagen?",
    answer:
      "5–20 Jahre von Anfänger bis Könner. Lernstufen: erwerben/festigen, anwenden/variieren, gestalten/ergänzen."
  },
  {
    id: "q143",
    category: "BASPO",
    format: "Kurzantwort",
    question: "Nenne drei Punkte aus der Vier-Säulen-Checkliste für die Garderobe.",
    answer:
      "Aufmerksamkeit wecken (Challenge, Musik), Spielformen mit Auto-Feedback wählen, viele Wiederholungen ermöglichen und Schlaf betonen."
  },
  {
    id: "q144",
    category: "Prüfung",
    format: "Kurzantwort",
    question: "Formuliere in 30–45 Sekunden die vier Komponenten der Leistung mit je einer Trainingsmaßnahme.",
    answer:
      "Konditionell: Sprint/RSA-Blöcke; Emotional: Teamregeln & Feedbackrituale; Koordinativ/technisch: Technikstationen SL/SF; Mental-taktisch: Spielform mit PP/PK-Fokus – alle kurz anreißen."
  },
  {
    id: "q145",
    category: "Prüfung",
    format: "Kurzantwort",
    question: "Erkläre die Vier Säulen des Lernens und nenne je eine Maßnahme für die heutige Einheit.",
    answer:
      "Aufmerksamkeit: Einstieg mit Challenge; Aktivität: stationäre Spiele ohne Wartezeiten; Feedback: Auto-Feedback über Zielzonen; Konsolidierung: Wiederholungsblöcke und Abschlussreflexion."
  },
  {
    id: "q146",
    category: "Prüfung",
    format: "Kurzantwort",
    question: "Wähle eine Spielform und nenne Keypoints, Organisation, Variationen und Scoring.",
    answer:
      "Beispiel „Teile den Puck“: Keypoints Head-up, Passqualität; Organisation 3v3 mit Joker; Variation Druck durch Zeitlimit; Scoring über Passserien/Abschluss."
  },
  {
    id: "q147",
    category: "Prüfung",
    format: "Kurzantwort",
    question: "Entwirf eine 60-Minuten-Lektion mit Progression Puck halten → teilen → verteidigen → Wettkampf.",
    answer:
      "10′ Warm-up, 15′ individuelle Puckkontrolle (halten), 10′ Pass-Drills (teilen), 15′ 2v2 Pressure (verteidigen), 10′ Small-Area-Game mit Scoring (Wettkampf)."
  },
  {
    id: "q148",
    category: "Prüfung",
    format: "Kurzantwort",
    question: "Skizziere ein Bench-Coaching-Feedback, das Auto-Feedback aus der Spielform nutzt.",
    answer:
      "Beobachtung benennen (\"Anzahl Passserien war tiefer als Ziel\"), Spieler auf Auto-Feedback verweisen (Zielzonen/Scoring), konkrete Aufgabe geben (\"Nächster Shift: 3 Pässe vor Abschluss\")."
  },
  {
    id: "q149",
    category: "Physis",
    format: "Kurzantwort",
    question: "Welches sind die 3 physischen Leistungsfaktoren im Eishockey?",
    answer:
      "Kraft, Ausdauer und Schnelligkeit. Diese drei Faktoren bilden die Grundlage der konditionellen Substanz und interagieren in verschiedenen Mischformen wie Kraftausdauer, Schnelligkeitsausdauer und Schnellkraft."
  },
  {
    id: "q150",
    category: "Physis",
    format: "Kurzantwort",
    question: "Erkläre mir das methodische Modell der Superkompensation.",
    answer:
      "Nach einer Belastung sinkt die Leistung zunächst (Ermüdung), erholt sich und steigt kurz über das Ausgangsniveau (Superkompensation). Die nächste Einheit sollte in diesem Fenster platziert werden. Zu früher Reiz führt zu chronischer Ermüdung, zu später Reiz bedeutet verpasste Anpassung."
  },
  {
    id: "q151",
    category: "Physis",
    format: "Kurzantwort",
    question: "Was ist Hypertrophie Krafttraining?",
    answer:
      "Hypertrophie ist die Vergrößerung der Muskelfaser-Querschnittsfläche durch gezieltes Krafttraining. Trainingsparameter: 6-12 Wiederholungen, 75-85% der Maximalkraft, 2-4 Sätze, 2-3x pro Woche über 6-12 Wochen."
  },
  {
    id: "q152",
    category: "Physis",
    format: "Kurzantwort",
    question: "Erkläre den Unterschied von Anaerob und Aerober im Ausdauertraining.",
    answer:
      "Aerob: Energiegewinnung mit Sauerstoff, für längere Belastungen (GA1, GA2, Schwelle). Anaerob: Energiegewinnung ohne Sauerstoff, für kurze, intensive Belastungen (ATP-KP-System, glykolytisch). Im Eishockey dominieren anaerobe Systeme während Shifts, aerob für Erholung zwischen Shifts."
  },
  {
    id: "q153",
    category: "Physis",
    format: "Kurzantwort",
    question: "Welches sind die Energiequellen des Körpers?",
    answer:
      "ATP (Adenosintriphosphat), Glucose, Glykogen, Fett und Eiweiiss. ATP-KP für kurze Explosivität, Glykogen für anaerobe Glykolyse (30-90 Sekunden), Fett für aerobe Ausdauer, Eiweiiss als Notfallquelle bei langen Belastungen."
  },
  {
    id: "q154",
    category: "Physis",
    format: "Kurzantwort",
    question: "Was bedeutet RSA? Wie trainiert man das?",
    answer:
      "RSA = Repeated Sprint Ability (Wiederholte Sprintfähigkeit). Trainiert wird mit intermittierender Methode: 6-8 Sprints à 20-30m, 20-30 Sekunden Pause (ohne vollständige Erholung), 2-3 Serien mit 3-5 Minuten Serienpause. Fokus auf Qualität und Technik."
  },
  {
    id: "q155",
    category: "Physis",
    format: "Kurzantwort",
    question: "Schnelligkeitstraining wie gehst du da vor?",
    answer:
      "Ausgangsposition optimieren, Beschleunigung trainieren (0-10m), maximale Geschwindigkeit entwickeln, Bremsen und Richtungswechsel. Pausen sollten nicht länger sein als die Aktion selbst. Training nur ausgeruht, am Anfang der Einheit, mit vollständiger Erholung."
  },
  {
    id: "q156",
    category: "Physis",
    format: "Kurzantwort",
    question: "Trainingsplanung, welche Zyklen gibt es und wie können sie aufgebaut werden?",
    answer:
      "Makrozyklus (Jahreszyklen/Saison), Mesozyklus (4-8 Wochen), Mikrozyklus (Wochenzyklen). Aufbau: Vorbereitung (Umfang hoch, Intensität steigend), Wettkampf (Umfang runter, Intensität hoch, Erhalt), Übergang (Regeneration). In-Season: Mikro-Dosen zur Erhaltung."
  },
  {
    id: "q157",
    category: "Physis",
    format: "Kurzantwort",
    question: "Dein Sommertraining steht bevor. Du hast 10 Wochen Zeit deine Mannschaft im Kraftbereich zu verbessern. Wie sieht deine Planung aus? (Krafttrainingsplanungsphasen)",
    answer:
      "Woche 1-2: Hypertrophie (6-12 Wdh., 75-85% 1RM), Woche 3-4: Maximalkraft (1-5 Wdh., 85-95% 1RM), Woche 5-6: Schnellkraft/Power (3-5 Wdh., 60-80% 1RM, explosiv), Woche 7-8: Kraftausdauer (12-20 Wdh., 50-70% 1RM), Woche 9-10: Taper/Transfer ins Eistraining."
  },
  {
    id: "q158",
    category: "Physis",
    format: "Kurzantwort",
    question: "Dein Sommertraining steht bevor. Wie sieht deine Ausdauerplanung aus? (Welche Methoden wendest du an?)",
    answer:
      "Intervalltraining (z. B. 4x4 Minuten, 3 Minuten Pause), Dauermethode (20-40 Minuten GA1), Hügelmethoden (Bergläufe für Kraftausdauer), intermittierendes Training (15/15 Sekunden on/off). Progression: Umfang steigern, dann Intensität erhöhen."
  },
  {
    id: "q159",
    category: "Physis",
    format: "Kurzantwort",
    question: "Intermittierend Training: gib ein Beispiel",
    answer:
      "15 Minuten Dauerlauf, dabei alle 70 Sekunden über 5 Hürden springen. Oder: 15 Sekunden Sprint, 15 Sekunden Pause, 6-10 Wiederholungen, 2-3 Serien. Hohe intensive Belastung mit unvollständiger Erholung, hockeyrelevant für RSA."
  },
  {
    id: "q160",
    category: "Physis",
    format: "Kurzantwort",
    question: "Zeichne das Diagramm mit den 3 Dreiecken: Intensität - Erholung - Umfang und erkläre den Zusammenhang",
    answer:
      "Drei überlappende Dreiecke: Intensität hoch → Umfang niedrig, Erholung lang. Umfang hoch → Intensität niedrig, Erholung kürzer. Erholung kurz → Umfang/Intensität müssen angepasst werden. Prinzip: Nicht alle drei gleichzeitig maximieren, sondern je nach Ziel priorisieren."
  },
  {
    id: "q161",
    category: "Physis",
    format: "Kurzantwort",
    question: "Schnelligkeit: wie, wann, mit welcher Mannschaft, Planung",
    answer:
      "Wie: Sprintspiele, multidirektional, Beschleunigungsübungen, Schnellkraft. Wann: Am Anfang der Einheit, ausgeruht, volle Pausen. Mit welcher Mannschaft: Alle Altersstufen, angepasst an Entwicklungsstand. Planung: 1-2x pro Woche, kurze Serien (3-5 Wiederholungen), Qualität vor Quantität."
  },
  {
    id: "q162",
    category: "Physis",
    format: "Kurzantwort",
    question: "Sprungschule: warum, was, wie, mit welcher Mannschaft, ...",
    answer:
      "Warum: Explosivkraft, Spannung, Gleichgewicht, Koordination, Schnellkraft entwickeln. Was: Tiefsprünge, Sprungformen (einbeinig, beidbeinig, seitlich), Box-Jumps, Medizinball-Würfe. Wie: Kurze Bodenkontaktzeit, stabile Landung, geringe Ermüdung. Mit welcher Mannschaft: Ab U13, progressiv aufbauend."
  },
  {
    id: "q163",
    category: "Physis",
    format: "Kurzantwort",
    question: "Warm up und cool down wozu?",
    answer:
      "Warm-up: Puls/Temperatur erhöhen (Raise), Zielmuskeln aktivieren/mobilisieren (Activate/Mobilize), spezifisch vorbereiten (Potentiate). Cool-down: Regeneration fördern, Laktatabbau, Beweglichkeit erhalten, psychische Entspannung. Beide reduzieren Verletzungsrisiko und verbessern Leistung."
  },
  {
    id: "q164",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Was sind die 3 Grundtechniken des Trainings der Psyche?",
    answer:
      "Visualisieren (mentale Bilder von Bewegungen/Situationen), Selbstgespräch (innere Dialoge zur Steuerung und Motivation), Atmen (Atemregulationsübungen zur Entspannung und Fokussierung). Diese drei Techniken bilden die Basis des mentalen Trainings."
  },
  {
    id: "q165",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Was ist mentaler \"Flow\"?",
    answer:
      "Flow ist ein optimaler Bewusstseinszustand, in dem man vollständig in der Tätigkeit aufgeht. Charakteristika: klare Ziele, unmittelbares Feedback, Balance zwischen Herausforderung und Fähigkeiten, Handeln und Bewusstsein verschmelzen, Zeitgefühl verändert sich, selbstvergessenes Handeln."
  },
  {
    id: "q166",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Erkläre den Begriff \"Visualisieren\"",
    answer:
      "Visualisieren ist das bewusste Erzeugen mentaler Bilder von Bewegungen, Situationen oder Zielen. Es aktiviert ähnliche neuronale Muster wie die tatsächliche Ausführung und verbessert Technik, Taktik und Selbstvertrauen. Kann aus Innen- oder Außenperspektive erfolgen."
  },
  {
    id: "q167",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Nenne 1 mögliche Entspannungstechnik?",
    answer:
      "Atemregulationsübung (z. B. Box-Breathing: 4 Sekunden einatmen, 4 Sekunden halten, 4 Sekunden ausatmen, 4 Sekunden halten). Weitere: Progressive Muskelentspannung, Autogenes Training, Meditation, Achtsamkeitsübungen."
  },
  {
    id: "q168",
    category: "Psyche",
    format: "Kurzantwort",
    question: "In welchem Zusammenhang kennst du SMART und was bedeutet es?",
    answer:
      "SMART ist eine Methode zur Zielformulierung: Spezifisch (klar definiert), Messbar (Fortschritt nachvollziehbar), Attraktiv (motivierend), Realistisch (erreichbar), Terminiert (klare Frist). Wird im mentalen Training, Coaching und der Trainingsplanung verwendet, um Ziele präzise zu formulieren."
  },
  {
    id: "q169",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Visualisieren hat eine Innenansicht und Aussensicht? Was ist damit gemeint?",
    answer:
      "Innenansicht: Man sieht die Situation durch die eigenen Augen (wie in der Realität), fühlt Bewegungen, spürt den Puck. Außenansicht: Man sieht sich selbst von außen (wie in einem Video), analysiert Technik, erkennt Fehler. Beide Perspektiven haben unterschiedliche Vorteile und sollten kombiniert werden."
  },
  {
    id: "q170",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Was heisst antizipieren?",
    answer:
      "Antizipieren bedeutet, zukünftige Ereignisse oder Handlungen des Gegners vorauszusehen und darauf vorbereitet zu sein. Im Eishockey: Puckbewegungen, Passwege, Gegnerverhalten frühzeitig erkennen und entsprechend reagieren. Trainierbar durch Spielformen, Videoanalyse und Wahrnehmungsübungen."
  },
  {
    id: "q171",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Wozu dient ein Selbstgespräch?",
    answer:
      "Selbstgespräch dient der Selbstregulation, Motivation, Fokussierung und Fehlerkorrektur. Positives Selbstgespräch stärkt Selbstvertrauen, negatives kann Leistung beeinträchtigen. Strategien: Instruktionen (\"Kopf hoch\"), Motivationssätze (\"Ich schaffe das\"), Bewertungen (\"Guter Pass\")."
  },
  {
    id: "q172",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Atemregulationsübung: beschreibe",
    answer:
      "Box-Breathing: 4 Sekunden einatmen, 4 Sekunden halten, 4 Sekunden ausatmen, 4 Sekunden halten. Wiederhole 4-6 Zyklen. Alternative: 4-7-8 (4s ein, 7s halten, 8s aus). Ziel: Parasympathikus aktivieren, Stress reduzieren, Fokus erhöhen. Vor Wettkampf oder in Drucksituationen anwendbar."
  },
  {
    id: "q173",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Wie gibst du Feedbacks?",
    answer:
      "Konkret und zeitnah, auf Verhalten bezogen (nicht Person), positiv verstärkend, konstruktiv bei Fehlern. Sandwich-Methode: Positives → Verbesserung → Positives. 4 Coach-Hüte nutzen: Trainer (erklärt), Coach (fragt), Berater (co-entscheidet), Moderator (Rahmen setzt)."
  },
  {
    id: "q174",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Was ist das Ziel eines Konfliktgespräches und wie gehst du dabei vor?",
    answer:
      "Ziel: Verständnis schaffen, Lösungen finden, Beziehung erhalten. Vorgehen: Sachlich bleiben, aktiv zuhören, Standpunkte klären, gemeinsame Interessen identifizieren, lösungsorientiert arbeiten, Vereinbarungen treffen, Nachbesprechung planen. Kind/Spieler im Zentrum, nicht Ego."
  },
  {
    id: "q175",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Was verstehst du unter Persönlichkeitsentwicklung?",
    answer:
      "Persönlichkeitsentwicklung ist der kontinuierliche Prozess, eigene Fähigkeiten, Werte, Einstellungen und Verhaltensweisen zu reflektieren und weiterzuentwickeln. Im Sport: Selbstbewusstsein, Resilienz, Kommunikation, Führung, Verantwortung stärken. Langfristiger Prozess, der über sportliche Leistung hinausgeht."
  },
  {
    id: "q176",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Antizipieren: kennst du eine Übung aus der Broschüre oder sonst noch eine?",
    answer:
      "Beispiel: \"Puck-Lesen\" – Spieler beobachten Puckbewegungen und rufen vorher, wohin der Pass geht. Oder: 2v1 mit verdecktem Passgeber, Spieler muss früh erkennen. Videoanalyse: Stoppe Clips vor Pass/Schuss, Spieler antizipiert. Wahrnehmungsübungen mit peripherem Sehen trainieren."
  },
  {
    id: "q177",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Visualisieren: kennst du eine Übung aus der Broschüre oder sonst noch eine?",
    answer:
      "Beispiel: Spieler schließt Augen, visualisiert perfekten Schuss (Innenansicht: Puck, Blatt, Ziel; Außenansicht: Technik). Oder: Vor Spiel Situationen durchgehen (Face-off, Powerplay). 5-10 Minuten täglich, alle Sinne einbeziehen (sehen, hören, fühlen). Mit Atmung kombinieren."
  },
  {
    id: "q178",
    category: "Psyche",
    format: "Kurzantwort",
    question: "Motivation: kennst du eine Übung aus der Broschüre oder sonst noch eine?",
    answer:
      "SMART-Ziele setzen: Spezifisch (z. B. \"8 Slot-Shots pro Spiel\"), Messbar, Attraktiv, Realistisch, Terminiert. Erfolgsjournal führen, Vorbilder analysieren, Motivationsbilder/Videos sammeln, Teamziele visualisieren, Belohnungen für Zwischenziele. Intrinsische Motivation durch Autonomie, Kompetenz, Verbundenheit fördern."
  },
  {
    id: "q179",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Was unterscheidet Handlungsziele von Resultatzielen?",
    answer:
      "Handlungsziele = Prozess/Verhalten, direkt beeinflussbar (z. B. \"≥8 Slot-Shots\"). Resultatziele = Ergebnis/Score, nur indirekt beeinflussbar (z. B. \"Spiel gewinnen\")."
  },
  {
    id: "q180",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Formuliere ein konkretes Ziel nach SMART.",
    answer:
      "\"Bis 31.12. erzielen wir ≥8 Slot-Abschlüsse/Spiel (Video-Tracking), indem wir die Kontaktzeit ≤0,8 s halten und One-Touch-Pässe forcieren.\""
  },
  {
    id: "q181",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Was verstehst du unter spielnahem Training?",
    answer:
      "Übungs-/Spielformen mit Zeit-/Raum-/Gegnerdruck, Entscheidungen, Scoring/Regeln – hoher Transfer ins Spiel."
  },
  {
    id: "q182",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Unterschied \"Teaching the game\" zu Taktik",
    answer:
      "\"Teaching the game\" = Prinzipien/Rollen verstehen (spielerzentriert). Taktik = konkrete Systeme/Abläufe (z. B. 1-2-2, Breakout-Muster)."
  },
  {
    id: "q183",
    category: "Coaching",
    format: "Kurzantwort",
    question: "4 Coachhüte – Feedbackart des Trainers (Teacher)",
    answer:
      "Direktiv & präzise: zeigen, vormachen, klare Korrekturhinweise (\"Cues\"), Dosierung/Organisation."
  },
  {
    id: "q184",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Feedbackart des Coaches",
    answer:
      "Fragend/entdeckend: Spieler reflektieren lassen, Lösungen erarbeiten, externe Aufmerksamkeits-Cues."
  },
  {
    id: "q185",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Feedbackart des Beraters",
    answer:
      "Options- & erfahrungsbasiert: gemeinsam Varianten abwägen, Vor-/Nachteile klären, Co-Entscheidung."
  },
  {
    id: "q186",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Was beinhaltet das Konzept FTEM-Eishockey?",
    answer:
      "Foundation – Talent – Elite – Mastery: alters-/stufengerechte Entwicklung mit passenden Inhalten & Wettkampfbelastungen."
  },
  {
    id: "q187",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Welche Gedanken machst du dir bei der Integration der Torhüter ins Teamtraining?",
    answer:
      "Früh & gezielt einbinden, klare Schussqualität/Serien, Belastung steuern, Abstimmung mit Goalie-Coach, Kommunikation mit Schützen."
  },
  {
    id: "q188",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Wieso ist es wichtig, die Charaktere der Konferenzteilnehmer zu kennen?",
    answer:
      "Passende Kommunikation, höhere Akzeptanz, bessere Entscheidungen, Konfliktprävention."
  },
  {
    id: "q189",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Charakterplakat – Botschaft und Inhalt der Kampagne",
    answer:
      "Teamwerte sichtbar (Respekt, Einsatz, Disziplin, Verantwortung) + konkrete Verhaltenserwartungen im Alltag/Spiel."
  },
  {
    id: "q190",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Kommunikationsmodell Sender–Empfänger erklären",
    answer:
      "Codierung → Kanal → Decodierung, Störungen (Noise) möglich; Feedback schließt den Kreis; Sache- & Beziehungsebene beachten (\"Ich-Botschaften\")."
  },
  {
    id: "q191",
    category: "Coaching",
    format: "Kurzantwort",
    question: "4 Handlungskompetenzen im Coaching",
    answer:
      "Fach-, Methoden-, Sozial-, Selbstkompetenz."
  },
  {
    id: "q192",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Respect on & off the Ice – Themen/Inhalte",
    answer:
      "Fair Play, Respekt gegenüber Schiris/Gegnern/Team, Sicherheit, Anti-Diskriminierung, Eltern- & Fankultur."
  },
  {
    id: "q193",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Sicherheit: Merkblatt Unfallprävention im Eishockey",
    answer:
      "Ausrüstung prüfen, Eis/Material checken, Aufwärmen, Regeln (Kopf/Boarding) durchsetzen, saubere Technik, Belastung dosieren, Erste Hilfe/EAP bereit."
  },
  {
    id: "q194",
    category: "Coaching",
    format: "Kurzantwort",
    question: "4 Handlungsfelder im Bereich \"Vermitteln\"",
    answer:
      "Organisieren, Instruieren, Korrigieren, Motivieren/Begleiten."
  },
  {
    id: "q195",
    category: "Coaching",
    format: "Kurzantwort",
    question: "Erkläre: \"Qualitativ hochstehende Trainings folgen einem roten Faden…\"",
    answer:
      "Klare Ziele, abgestimmte Lektionsteile (Aktivierung → Kern → Anwendung → Spiel), Progression (isoliert → Druck → Entscheidung), Transfer sichern; Inhalte bauen logisch aufeinander auf."
  }
];

const glossaryEntries = [
  {
    term: "Belastungsnormative",
    category: "Training",
    definition:
      "Kennzahlen zur Steuerung des Trainings: Intensität, Umfang, Dichte (Pausenverhältnis), Häufigkeit und Komplexität."
  },
  {
    term: "Superkompensation",
    category: "Training",
    definition:
      "Belastung senkt Leistungsniveau, Erholung hebt es oberhalb des Ausgangswerts. Timing der nächsten Einheit entscheidet über Fortschritt oder Ermüdung."
  },
  {
    term: "Progressive Overload",
    category: "Training",
    definition:
      "Trainingsreize werden schrittweise gesteigert (Gewicht, Tempo, Wiederholungen, Dichte), um Anpassungen auszulösen."
  },
  {
    term: "Periodisierung",
    category: "Training",
    definition:
      "Planung in Makro- (Saison), Meso- (4–8 Wochen), Mikrozyklus (Woche) und Einheit. In-Season oft Mikro-Dosen zur Leistungserhaltung."
  },
  {
    term: "RAMP-Warm-up",
    category: "Training",
    definition:
      "Raise (Puls/Temperatur), Activate/Mobilize (zielgerichtete Aktivierung und Beweglichkeit), Potentiate (spezifische Sprints/Schüsse zur Leistungsbereitschaft)."
  },
  {
    term: "Kraftarten",
    category: "Physis",
    definition:
      "Maximalkraft, Hypertrophie, Intramuskuläre Koordination (IK), Schnellkraft/Power und Reaktivkraft (plyometrische SSC-Belastungen)."
  },
  {
    term: "Ausdauerbereiche",
    category: "Physis",
    definition:
      "GA1 (locker), GA2 (moderat), Schwelle, VO₂max, anaerob-laktazid, intermittierend – spezifisch kombinierbar im Hockey."
  },
  {
    term: "Schnelligkeit",
    category: "Schnelligkeit",
    definition:
      "Komponenten: Reaktion, Beschleunigung (0–10 m), Frequenz/Agility inkl. Wahrnehmung und Entscheidung."
  },
  {
    term: "RSA",
    category: "Schnelligkeit",
    definition:
      "Repeated Sprint Ability: Fähigkeit, wiederholte Sprints mit kurzen Pausen qualitativ zu absolvieren – hoch relevant im Hockey."
  },
  {
    term: "Plyometrie",
    category: "Schnelligkeit",
    definition:
      "Explosive Bewegungen mit kurzer Bodenkontaktzeit, trainieren Stiffness, elastische Energie und Landekontrolle."
  },
  {
    term: "Monitoring",
    category: "Monitoring",
    definition:
      "Belastung und Zustand verfolgen, z. B. sRPE (RPE × Dauer), Wellness-Score, CMJ-Höhe, Spiel-/Trainingsminuten."
  },
  {
    term: "ACWR",
    category: "Monitoring",
    definition:
      "Acute:Chronic Workload Ratio vergleicht aktuelle mit langfristiger Belastung. Ziel: sprunghafte Anstiege vermeiden."
  },
  {
    term: "Taper",
    category: "Training",
    definition:
      "Geplantes Reduzieren des Umfangs bei moderat-hoher Intensität vor wichtigen Spielen, um Frische zu maximieren."
  },
  {
    term: "Beweglichkeit",
    category: "Physis",
    definition:
      "Range of Motion verbessern: dynamisches Mobilisieren vor, statisches Dehnen nach der Belastung."
  },
  {
    term: "Prävention",
    category: "Prävention",
    definition:
      "Gezielte Übungen für Core, Adduktoren/Leiste, Hamstrings (Nordics), Sprunggelenk und Schulter/Scapula zur Verletzungsvermeidung."
  },
  {
    term: "Erholung",
    category: "Regeneration",
    definition:
      "Schlaf, Ernährung (Kohlenhydrate + Protein), Hydration sowie Cool-down/lockeres Ausfahren unterstützen die Anpassung."
  },
  {
    term: "Energiesysteme",
    category: "Physis",
    definition:
      "ATP-KP (kurz, explosiv), anaerob-glykolytisch (30–90 s) und aerob (lang, Grundlagenausdauer) arbeiten je nach Belastung zusammen."
  }
];
function createDayCard(day) {
  const card = document.createElement("article");
  card.className = "day-card card";

  const header = document.createElement("header");
  const title = document.createElement("h3");
  title.textContent = `${day.day}: ${day.title}`;
  header.appendChild(title);

  const tags = document.createElement("div");
  tags.className = "tags";
  day.focus.forEach((tagText) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = tagText;
    tags.appendChild(tag);
  });
  header.appendChild(tags);
  card.appendChild(header);

  const blocks = document.createElement("div");
  blocks.className = "blocks";

  day.blocks.forEach((block) => {
    const blockElement = document.createElement("div");
    blockElement.className = "block";
    blockElement.dataset.focus = block.focus;
    blockElement.dataset.label = block.label;

    const blockTitle = document.createElement("h4");
    blockTitle.textContent = `${block.label} · ${block.title}`;
    blockElement.appendChild(blockTitle);

    const blockDetails = document.createElement("p");
    blockDetails.textContent = block.details;
    blockElement.appendChild(blockDetails);

    blocks.appendChild(blockElement);
  });

  card.appendChild(blocks);

  const reflection = document.createElement("p");
  reflection.className = "reflection";
  reflection.textContent = `Reflexion: ${day.reflection}`;
  card.appendChild(reflection);

  return card;
}

function renderSchedule() {
  scheduleElement.textContent = "";
  const focusValue = focusFilter.value;
  const blockValue = blockFilter.value;

  schedule.forEach((day) => {
    const includeDay =
      focusValue === "all" || day.focus.includes(focusValue) || day.blocks.some((block) => block.focus === focusValue);

    if (!includeDay) {
      return;
    }

    const dayCard = createDayCard(day);

    if (blockValue !== "all") {
      dayCard.querySelectorAll(".block").forEach((block) => {
        if (block.dataset.label !== blockValue) {
          block.classList.toggle("hidden", true);
        } else {
          block.classList.remove("hidden");
        }
      });
    }

    if (focusValue !== "all") {
      dayCard.querySelectorAll(".block").forEach((block) => {
        if (block.dataset.focus !== focusValue && blockValue === "all") {
          block.classList.toggle("hidden", true);
        } else if (blockValue !== "all" && block.dataset.label === blockValue && block.dataset.focus !== focusValue) {
          block.classList.toggle("hidden", true);
        }
      });
    }

    scheduleElement.appendChild(dayCard);
  });

  if (!scheduleElement.children.length) {
    const emptyState = document.createElement("p");
    emptyState.textContent = "Keine Einträge für die ausgewählte Kombination gefunden.";
    emptyState.className = "card";
    scheduleElement.appendChild(emptyState);
  }
}


function createQuestionCard(item) {
  const card = document.createElement("article");
  card.className = "question-card";
  card.dataset.category = item.category;
  card.dataset.format = item.format;
  card.dataset.questionId = item.id;

  const meta = document.createElement("div");
  meta.className = "question-meta";

  const categoryTag = document.createElement("span");
  categoryTag.className = "tag";
  categoryTag.textContent = item.category;
  meta.appendChild(categoryTag);

  const formatTag = document.createElement("span");
  formatTag.className = "tag";
  formatTag.textContent = item.format;
  meta.appendChild(formatTag);

  card.appendChild(meta);

  const question = document.createElement("p");
  question.className = "question-text";
  question.textContent = item.question;
  card.appendChild(question);

  if (item.options) {
    const optionsList = document.createElement("ol");
    optionsList.className = "options";
    item.options.forEach((option) => {
      const listItem = document.createElement("li");
      listItem.textContent = option;
      optionsList.appendChild(listItem);
    });
    card.appendChild(optionsList);
  }

  const answer = document.createElement("p");
  answer.className = "answer hidden";
  answer.id = `answer-${item.id}`;
  answer.textContent = item.answer;
  card.appendChild(answer);

  const toggleButton = document.createElement("button");
  toggleButton.className = "toggle-answer";
  toggleButton.type = "button";
  toggleButton.dataset.answerId = answer.id;
  toggleButton.textContent = "Antwort zeigen";
  card.appendChild(toggleButton);

  return card;
}

function renderQuestionBank() {
  if (!questionList) {
    return;
  }

  questionList.textContent = "";

  const categoryValue = questionFilter.value;
  const formatValue = formatFilter.value;
  const searchTerm = questionSearch.value.trim().toLowerCase();

  const filtered = questionBank.filter((item) => {
    const matchCategory = categoryValue === "all" || item.category === categoryValue;
    const matchFormat = formatValue === "all" || item.format === formatValue;
    const matchSearch =
      !searchTerm ||
      item.question.toLowerCase().includes(searchTerm) ||
      item.answer.toLowerCase().includes(searchTerm) ||
      (item.options && item.options.some((option) => option.toLowerCase().includes(searchTerm)));
    return matchCategory && matchFormat && matchSearch;
  });

  if (!filtered.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "card";
    emptyState.textContent = "Keine Fragen für die aktuelle Auswahl gefunden.";
    questionList.appendChild(emptyState);
    return;
  }

  filtered.forEach((item) => {
    questionList.appendChild(createQuestionCard(item));
  });
}

function toggleAnswer(event) {
  const button = event.target;
  if (!button.classList.contains("toggle-answer")) {
    return;
  }

  const answerId = button.dataset.answerId;
  const answerElement = document.getElementById(answerId);

  if (!answerElement) {
    return;
  }

  const isHidden = answerElement.classList.contains("hidden");
  answerElement.classList.toggle("hidden", !isHidden);
  button.textContent = isHidden ? "Antwort ausblenden" : "Antwort zeigen";
  button.classList.toggle("secondary", !isHidden);
}

function createGlossaryItem(entry) {
  const item = document.createElement("article");
  item.className = "glossary-item";
  item.dataset.category = entry.category;

  const header = document.createElement("div");
  header.className = "glossary-header";

  const term = document.createElement("span");
  term.className = "glossary-term";
  term.textContent = entry.term;
  header.appendChild(term);

  const category = document.createElement("span");
  category.className = "glossary-category";
  category.textContent = entry.category;
  header.appendChild(category);

  item.appendChild(header);

  const definition = document.createElement("p");
  definition.className = "glossary-definition";
  definition.textContent = entry.definition;
  item.appendChild(definition);

  return item;
}

function renderGlossary() {
  if (!glossaryList) {
    return;
  }

  glossaryList.textContent = "";

  const categoryValue = glossaryFilter?.value ?? "all";
  const searchTerm = glossarySearch?.value.trim().toLowerCase() ?? "";

  const filtered = glossaryEntries.filter((entry) => {
    const matchCategory = categoryValue === "all" || entry.category === categoryValue;
    const matchSearch =
      !searchTerm ||
      entry.term.toLowerCase().includes(searchTerm) ||
      entry.definition.toLowerCase().includes(searchTerm);
    return matchCategory && matchSearch;
  });

  if (!filtered.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "card";
    emptyState.textContent = "Keine Begriffe für die aktuelle Auswahl gefunden.";
    glossaryList.appendChild(emptyState);
    return;
  }

  filtered.forEach((entry) => {
    glossaryList.appendChild(createGlossaryItem(entry));
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

