import PptxGenJS from 'pptxgenjs';

/** Palette du ministère, reprise de la charte de l'application. */
const COLOR = {
  midnight: '0A1128',
  deep: '060B18',
  surface: '141F3D',
  gold: 'D4AF37',
  goldBright: 'F2D16B',
  royal: '7C3AED',
  royalLight: 'A78BFA',
  white: 'FFFFFF',
  muted: 'A8B2CF'
};

export interface MonthlyBreakdown {
  label: string;
  sessions: number;
  participants: number;
  average: number;
  men: number;
  women: number;
}

export interface ActivityBreakdown {
  name: string;
  sessions: number;
  participants: number;
  average: number;
  men: number;
  women: number;
}

export interface CouncilDeckData {
  quarter: number;
  year: number;
  monthly: MonthlyBreakdown[];
  byActivity: ActivityBreakdown[];
  remarks: string;
  conclusion: string;
  keywords: string[];
}

function addBackground(slide: PptxGenJS.Slide, accent: 'gold' | 'royal' = 'gold') {
  slide.background = { color: COLOR.midnight };
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: 0.12,
    h: 5.63,
    fill: { color: accent === 'gold' ? COLOR.gold : COLOR.royal }
  });
}

function addSlideTitle(slide: PptxGenJS.Slide, title: string, subtitle?: string) {
  slide.addText(title, {
    x: 0.55,
    y: 0.35,
    w: 8.9,
    h: 0.6,
    fontSize: 26,
    bold: true,
    color: COLOR.white,
    fontFace: 'Arial'
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.55,
      y: 0.95,
      w: 8.9,
      h: 0.35,
      fontSize: 13,
      color: COLOR.muted,
      fontFace: 'Arial'
    });
  }

  slide.addShape('rect', {
    x: 0.55,
    y: subtitle ? 1.35 : 1.05,
    w: 1.4,
    h: 0.045,
    fill: { color: COLOR.gold }
  });
}

function addFooter(slide: PptxGenJS.Slide, pageLabel: string) {
  slide.addText('MIDP — Ministère d\'Intercession et de Développement de la Prière', {
    x: 0.55,
    y: 5.15,
    w: 6.5,
    h: 0.3,
    fontSize: 9,
    color: COLOR.muted,
    fontFace: 'Arial'
  });
  slide.addText(pageLabel, {
    x: 8.0,
    y: 5.15,
    w: 1.45,
    h: 0.3,
    fontSize: 9,
    color: COLOR.gold,
    align: 'right',
    fontFace: 'Arial'
  });
}

const tableHeader = (labels: string[]) =>
  labels.map(text => ({
    text,
    options: { bold: true, color: COLOR.midnight, fill: { color: COLOR.gold }, fontSize: 11 }
  }));

const tableCell = (text: string | number, emphasis = false) => ({
  text: String(text),
  options: {
    color: emphasis ? COLOR.goldBright : COLOR.white,
    fill: { color: COLOR.surface },
    fontSize: 11,
    bold: emphasis
  }
});

/**
 * Rapport trimestriel du Conseil : page de garde, sommaire, statistiques,
 * tableaux, graphiques, comparaisons, remarques et conclusion.
 */
export async function generateCouncilDeck(data: CouncilDeckData): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'MIDP';
  pptx.company = 'MIDP';
  pptx.title = `Rapport trimestriel Q${data.quarter} ${data.year}`;

  const totalParticipants = data.monthly.reduce((sum, m) => sum + m.participants, 0);
  const totalSessions = data.monthly.reduce((sum, m) => sum + m.sessions, 0);
  const globalAverage = totalSessions > 0 ? Math.round(totalParticipants / totalSessions) : 0;
  const totalMen = data.monthly.reduce((sum, m) => sum + m.men, 0);
  const totalWomen = data.monthly.reduce((sum, m) => sum + m.women, 0);

  /* ---------- 1. Page de garde ---------- */
  const cover = pptx.addSlide();
  cover.background = { color: COLOR.deep };
  cover.addShape('rect', { x: 0, y: 0, w: 10, h: 0.22, fill: { color: COLOR.gold } });
  cover.addShape('rect', { x: 0, y: 5.41, w: 10, h: 0.22, fill: { color: COLOR.royal } });
  cover.addShape('ellipse', {
    x: 7.2,
    y: -1.1,
    w: 4.2,
    h: 4.2,
    fill: { color: COLOR.surface }
  });

  cover.addText('MIDP', {
    x: 0.8,
    y: 1.55,
    w: 8,
    h: 0.9,
    fontSize: 48,
    bold: true,
    color: COLOR.gold,
    fontFace: 'Arial'
  });
  cover.addText("Ministère d'Intercession et de Développement de la Prière", {
    x: 0.8,
    y: 2.4,
    w: 8,
    h: 0.4,
    fontSize: 14,
    color: COLOR.muted,
    fontFace: 'Arial'
  });
  cover.addText(`Rapport trimestriel — Q${data.quarter} ${data.year}`, {
    x: 0.8,
    y: 3.1,
    w: 8,
    h: 0.5,
    fontSize: 22,
    bold: true,
    color: COLOR.white,
    fontFace: 'Arial'
  });
  cover.addText(
    `Généré le ${new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}`,
    { x: 0.8, y: 3.65, w: 8, h: 0.35, fontSize: 11, color: COLOR.muted, fontFace: 'Arial' }
  );

  /* ---------- 2. Sommaire ---------- */
  const toc = pptx.addSlide();
  addBackground(toc);
  addSlideTitle(toc, 'Sommaire');
  const tocItems = [
    'Statistiques globales du trimestre',
    'Détail mensuel',
    'Répartition par activité',
    'Évolution de la participation',
    'Comparaison des trois derniers mois',
    'Remarques du Conseil',
    'Conclusion'
  ];
  toc.addText(
    tocItems.map((item, index) => ({
      text: `${index + 1}.  ${item}`,
      options: { breakLine: true, fontSize: 15, color: COLOR.white, bullet: false }
    })),
    { x: 0.9, y: 1.75, w: 8.4, h: 3.1, lineSpacingMultiple: 1.5, fontFace: 'Arial' }
  );
  addFooter(toc, '2');

  /* ---------- 3. Statistiques globales ---------- */
  const stats = pptx.addSlide();
  addBackground(stats);
  addSlideTitle(stats, 'Statistiques globales', `Trimestre Q${data.quarter} ${data.year}`);

  const kpis = [
    { label: 'Participants', value: totalParticipants },
    { label: 'Séances', value: totalSessions },
    { label: 'Moyenne / séance', value: globalAverage },
    { label: 'Hommes / Femmes', value: `${totalMen} / ${totalWomen}` }
  ];

  kpis.forEach((kpi, index) => {
    const x = 0.55 + index * 2.25;
    stats.addShape('roundRect', {
      x,
      y: 1.9,
      w: 2.05,
      h: 1.5,
      fill: { color: COLOR.surface },
      line: { color: COLOR.gold, width: 1 },
      rectRadius: 0.08
    });
    stats.addText(String(kpi.value), {
      x,
      y: 2.15,
      w: 2.05,
      h: 0.6,
      fontSize: 26,
      bold: true,
      color: COLOR.goldBright,
      align: 'center',
      fontFace: 'Arial'
    });
    stats.addText(kpi.label, {
      x,
      y: 2.78,
      w: 2.05,
      h: 0.35,
      fontSize: 11,
      color: COLOR.muted,
      align: 'center',
      fontFace: 'Arial'
    });
  });
  addFooter(stats, '3');

  /* ---------- 4. Tableau mensuel ---------- */
  const monthlyTable = pptx.addSlide();
  addBackground(monthlyTable);
  addSlideTitle(monthlyTable, 'Détail mensuel', 'Participants, séances et moyennes');

  monthlyTable.addTable(
    [
      tableHeader(['Mois', 'Séances', 'Participants', 'Moyenne', 'Hommes', 'Femmes']),
      ...data.monthly.map(month => [
        tableCell(month.label),
        tableCell(month.sessions),
        tableCell(month.participants, true),
        tableCell(month.average, true),
        tableCell(month.men),
        tableCell(month.women)
      ]),
      [
        tableCell('TOTAL', true),
        tableCell(totalSessions, true),
        tableCell(totalParticipants, true),
        tableCell(globalAverage, true),
        tableCell(totalMen, true),
        tableCell(totalWomen, true)
      ]
    ],
    {
      x: 0.55,
      y: 1.75,
      w: 8.9,
      border: { type: 'solid', color: COLOR.midnight, pt: 1 },
      align: 'center',
      valign: 'middle',
      rowH: 0.42
    }
  );
  addFooter(monthlyTable, '4');

  /* ---------- 5. Répartition par activité ---------- */
  if (data.byActivity.length > 0) {
    const activityTable = pptx.addSlide();
    addBackground(activityTable, 'royal');
    addSlideTitle(activityTable, 'Répartition par activité', 'Sur l\'ensemble du trimestre');

    activityTable.addTable(
      [
        tableHeader(['Activité', 'Séances', 'Participants', 'Moyenne']),
        ...data.byActivity
          .slice(0, 9)
          .map(activity => [
            tableCell(activity.name),
            tableCell(activity.sessions),
            tableCell(activity.participants, true),
            tableCell(activity.average, true)
          ])
      ],
      {
        x: 0.55,
        y: 1.75,
        w: 8.9,
        border: { type: 'solid', color: COLOR.midnight, pt: 1 },
        align: 'center',
        valign: 'middle',
        rowH: 0.36
      }
    );
    addFooter(activityTable, '5');
  }

  /* ---------- 6. Graphique d'évolution ---------- */
  const chart = pptx.addSlide();
  addBackground(chart);
  addSlideTitle(chart, 'Évolution de la participation', 'Participants et moyenne par mois');

  chart.addChart(
    pptx.ChartType.bar,
    [
      {
        name: 'Participants',
        labels: data.monthly.map(m => m.label),
        values: data.monthly.map(m => m.participants)
      },
      {
        name: 'Moyenne par séance',
        labels: data.monthly.map(m => m.label),
        values: data.monthly.map(m => m.average)
      }
    ],
    {
      x: 0.6,
      y: 1.7,
      w: 8.8,
      h: 3.25,
      barDir: 'col',
      chartColors: [COLOR.gold, COLOR.royalLight],
      showLegend: true,
      legendPos: 'b',
      legendColor: COLOR.white,
      catAxisLabelColor: COLOR.muted,
      valAxisLabelColor: COLOR.muted,
      catAxisLineShow: false,
      valAxisLineShow: false,
      valGridLine: { style: 'dash', color: COLOR.surface },
      showValue: true,
      dataLabelColor: COLOR.white,
      dataLabelFontSize: 9
    }
  );
  addFooter(chart, '6');

  /* ---------- 7. Comparaison trimestrielle ---------- */
  const comparison = pptx.addSlide();
  addBackground(comparison, 'royal');
  addSlideTitle(comparison, 'Comparaison des trois derniers mois', 'Écarts mois par mois');

  const rows = data.monthly.map((month, index) => {
    const previous = data.monthly[index - 1];
    const delta = previous ? month.participants - previous.participants : 0;
    const percent =
      previous && previous.participants > 0
        ? `${delta >= 0 ? '+' : ''}${Math.round((delta / previous.participants) * 100)} %`
        : '—';

    return [
      tableCell(month.label),
      tableCell(month.participants, true),
      tableCell(previous ? `${delta >= 0 ? '+' : ''}${delta}` : '—'),
      tableCell(percent, true)
    ];
  });

  comparison.addTable(
    [tableHeader(['Mois', 'Participants', 'Écart', 'Évolution']), ...rows],
    {
      x: 0.55,
      y: 1.75,
      w: 8.9,
      border: { type: 'solid', color: COLOR.midnight, pt: 1 },
      align: 'center',
      valign: 'middle',
      rowH: 0.45
    }
  );
  addFooter(comparison, '7');

  /* ---------- 8. Remarques ---------- */
  const notes = pptx.addSlide();
  addBackground(notes);
  addSlideTitle(notes, 'Remarques du Conseil');

  notes.addShape('roundRect', {
    x: 0.55,
    y: 1.7,
    w: 8.9,
    h: 3.05,
    fill: { color: COLOR.surface },
    line: { color: COLOR.gold, width: 1 },
    rectRadius: 0.06
  });
  notes.addText(data.remarks || 'Espace réservé aux remarques du Conseil.', {
    x: 0.85,
    y: 1.95,
    w: 8.3,
    h: 2.5,
    fontSize: 13,
    color: data.remarks ? COLOR.white : COLOR.muted,
    valign: 'top',
    fontFace: 'Arial'
  });

  if (data.keywords.length > 0) {
    notes.addText(`Mots-clés : ${data.keywords.join(' · ')}`, {
      x: 0.85,
      y: 4.55,
      w: 8.3,
      h: 0.3,
      fontSize: 10,
      color: COLOR.goldBright,
      fontFace: 'Arial'
    });
  }
  addFooter(notes, '8');

  /* ---------- 9. Conclusion ---------- */
  const conclusion = pptx.addSlide();
  conclusion.background = { color: COLOR.deep };
  conclusion.addShape('rect', { x: 0, y: 0, w: 10, h: 0.22, fill: { color: COLOR.royal } });
  conclusion.addShape('rect', { x: 0, y: 5.41, w: 10, h: 0.22, fill: { color: COLOR.gold } });

  conclusion.addText('Conclusion', {
    x: 0.8,
    y: 1.3,
    w: 8.4,
    h: 0.7,
    fontSize: 32,
    bold: true,
    color: COLOR.gold,
    fontFace: 'Arial'
  });
  conclusion.addText(
    data.conclusion ||
      `Au cours du trimestre, ${totalSessions} séances ont rassemblé ${totalParticipants} participants, ` +
        `soit une moyenne de ${globalAverage} personnes par séance.`,
    {
      x: 0.8,
      y: 2.2,
      w: 8.4,
      h: 1.9,
      fontSize: 15,
      color: COLOR.white,
      valign: 'top',
      fontFace: 'Arial'
    }
  );
  conclusion.addText('« Priez sans cesse »', {
    x: 0.8,
    y: 4.35,
    w: 8.4,
    h: 0.4,
    fontSize: 13,
    italic: true,
    color: COLOR.muted,
    fontFace: 'Arial'
  });

  await pptx.writeFile({ fileName: `MIDP_Rapport_Conseil_Q${data.quarter}_${data.year}.pptx` });
}
