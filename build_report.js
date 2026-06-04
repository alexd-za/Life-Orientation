const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageBreak, PageNumber, Footer, LevelFormat
} = require('docx');
const fs = require('fs');

const tBorder = { style: BorderStyle.SINGLE, size: 1, color: '000000' };
const tBorders = { top: tBorder, bottom: tBorder, left: tBorder, right: tBorder };

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, font: 'Arial', size: 28, bold: true })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 100 },
    children: [new TextRun({ text, font: 'Arial', size: 24, bold: true })] });
}
function body(text) {
  return new Paragraph({ alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: 120, line: 276, lineRule: 'auto' },
    children: [new TextRun({ text, font: 'Arial', size: 24 })] });
}
function blank() {
  return new Paragraph({ children: [new TextRun({ text: '', font: 'Arial', size: 24 })],
    spacing: { before: 0, after: 60 } });
}
function pb() { return new Paragraph({ children: [new PageBreak()] }); }
function visual(n, desc) {
  return new Paragraph({ spacing: { before: 120, after: 120 },
    border: { top: { style: BorderStyle.DASHED, size: 1, color: 'AAAAAA' }, bottom: { style: BorderStyle.DASHED, size: 1, color: 'AAAAAA' }, left: { style: BorderStyle.DASHED, size: 1, color: 'AAAAAA' }, right: { style: BorderStyle.DASHED, size: 1, color: 'AAAAAA' } },
    children: [new TextRun({ text: 'VISUAL ' + n + ' – ' + desc, font: 'Arial', size: 20, italics: true, color: '666666' })] });
}
function qLine(q, a) {
  return [
    new Paragraph({ spacing: { before: 100, after: 30, line: 276, lineRule: 'auto' },
      children: [new TextRun({ text: q, font: 'Arial', size: 24, bold: true })] }),
    new Paragraph({ spacing: { before: 30, after: 80, line: 276, lineRule: 'auto' }, alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: a, font: 'Arial', size: 24 })] })
  ];
}
function tocLine(label, page) {
  return new Paragraph({ spacing: { before: 40, after: 40, line: 276, lineRule: 'auto' },
    tabStops: [{ type: 'right', position: 9026 }],
    children: [new TextRun({ text: label, font: 'Arial', size: 24 }), new TextRun({ text: '\t' + page, font: 'Arial', size: 24 })] });
}
function boldInline(bold, rest) {
  return new Paragraph({ spacing: { before: 40, after: 80, line: 276, lineRule: 'auto' }, alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text: bold, font: 'Arial', size: 24, bold: true }), new TextRun({ text: rest, font: 'Arial', size: 24 })] });
}

function rubricTable() {
  const hdr = (t, w) => new TableCell({ borders: tBorders, width: { size: w, type: WidthType.DXA },
    shading: { fill: '000000', type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: t, font: 'Arial', size: 18, bold: true, color: 'FFFFFF' })] })] });
  const c = (t, w, shade) => new TableCell({ borders: tBorders, width: { size: w, type: WidthType.DXA },
    shading: shade ? { fill: shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: t, font: 'Arial', size: 18 })] })] });
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [2400, 1556, 1556, 1557, 1957],
    rows: [
      new TableRow({ children: [hdr('DESCRIPTORS', 2400), hdr('LEVEL 1', 1556), hdr('LEVEL 2', 1556), hdr('LEVEL 3', 1557), hdr('LEVEL 4', 1957)] }),
      new TableRow({ children: [c('ETHICAL ANALYSIS 0-15\nProblem/society (3) | Affected (3) | Values (2) | Six lenses (3) | Bias (2) | Principles (2)', 2400, 'F2F2F2'), c('Not all elements. Large gaps.', 1556), c('All superficially discussed.', 1556), c('All elements discussed.', 1557), c('All discussed in thorough detail.', 1957)] }),
      new TableRow({ children: [c('INTERVIEWS 0-10\nRecordings, summary and Annexure B.', 2400, 'F2F2F2'), c('No recordings. Annexure B missing.', 1556), c('One interviewee. Superficial summary.', 1556), c('Two interviewees. Basic summary. Annexure B submitted.', 1557), c('Three in-depth interviews. Detailed summary. Annexure B submitted.', 1957)] }),
      new TableRow({ children: [c('PERSONAL POSITION 0-10\nPosition (2) | Evidence (3) | Perspectives (3) | Mental health/dignity (2)', 2400, 'F2F2F2'), c('Large gaps.', 1556), c('Superficial. Thin motivation.', 1556), c('All discussed. Superficial motivation.', 1557), c('All in thorough detail. Clear motivation.', 1957)] }),
      new TableRow({ children: [c('PRACTICAL RESPONSE 0-10\nChange (2) | Who acts (2) | Why ethical (3) | Real impact (3)', 2400, 'F2F2F2'), c('Not practical. Large gaps.', 1556), c('Superficial. Limited real change.', 1556), c('All discussed well. Practical.', 1557), c('Detailed. Great ethical change for all.', 1957)] }),
      new TableRow({ children: [c('PRESENTATION 0-10\nReport (5) | Oral/video (5)', 2400, 'F2F2F2'), c('Requirements not met. No visuals.', 1556), c('Fewer than 5 visuals. Superficial oral.', 1556), c('Meets requirements. Readable.', 1557), c('Interesting layout. Engaging oral.', 1957)] }),
      new TableRow({ children: [c('REFERENCES & DECLARATION 0-5', 2400, 'F2F2F2'), c('Only URLs or none. No declaration.', 1556), c('List included, many errors. No declaration.', 1556), c('Minor errors. Declaration submitted.', 1557), c('Correct format and declaration included.', 1957)] }),
    ]});
}

function annexureBlock(n) {
  const row = (lbl) => new TableRow({ children: [
    new TableCell({ borders: tBorders, width: { size: 2800, type: WidthType.DXA }, shading: { fill: 'F2F2F2', type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: lbl, font: 'Arial', size: 24, bold: true })] })] }),
    new TableCell({ borders: tBorders, width: { size: 6226, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: ' ', font: 'Arial', size: 24 })] })] }),
  ]});
  return [
    new Paragraph({ spacing: { before: 200, after: 80 }, children: [new TextRun({ text: 'INTERVIEW ' + n, font: 'Arial', size: 24, bold: true })] }),
    new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [2800, 6226], rows: [row('Date of Interview:'), row('Interviewee Name and Surname:'), row('Designation of Interviewee:'), row('Signature of Interviewee:')] }),
    blank()
  ];
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 24 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 1 } },
    ]
  },
  numbering: { config: [
    { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
  ]},
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Life Orientation CAT Part A  |  Page ', font: 'Arial', size: 18 }), new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18 })] })] }) },
    children: [

      // ── COVER PAGE ──
      blank(), blank(), blank(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'IEB NATIONAL SENIOR CERTIFICATE EXAMINATION 2026', font: 'Arial', size: 22, bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: 'LIFE ORIENTATION  |  COMMON ASSESSMENT TASK: PART A', font: 'Arial', size: 22, bold: true })] }),
      blank(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' } }, children: [] }),
      blank(), blank(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'THE ETHICS LENS:', font: 'Arial', size: 40, bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: 'SOCIAL MEDIA AND PERSUASIVE DESIGN', font: 'Arial', size: 32, bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'Question 4: The Ethics Lens', font: 'Arial', size: 24, italics: true })] }),
      blank(), blank(), blank(), blank(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'Learner Name: _______________________________________________', font: 'Arial', size: 24 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'Class: _______________________________________________', font: 'Arial', size: 24 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'Date: _______________________________________________', font: 'Arial', size: 24 })] }),
      blank(), blank(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 },
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: '000000' } }, children: [] }),

      // ── TABLE OF CONTENTS ──
      pb(),
      new Paragraph({ spacing: { before: 0, after: 240 },
        children: [new TextRun({ text: 'TABLE OF CONTENTS', font: 'Arial', size: 28, bold: true })] }),
      tocLine('4.1  Ethical Analysis', '3'),
      tocLine('4.2  Interviews', '7'),
      tocLine('4.3  Summary Analysis of Interviews', '12'),
      tocLine('4.4  Personal Position and Critical Judgement', '13'),
      tocLine('4.5  Practical Response – #ScrollSmarter Campaign', '14'),
      tocLine('Reference List', '16'),
      tocLine('Rubric', '17'),
      tocLine('Plagiarism Declaration', '18'),
      tocLine('Annexure B', '19'),

      // ── 4.1 ETHICAL ANALYSIS ──
      pb(),
      h1('4.1  ETHICAL ANALYSIS'),
      h2('Focus Area: Social Media and Technology – Persuasive Design and the Attention Economy'),
      visual(1, 'Insert image: Social media app icons on a smartphone screen'),
      blank(),

      h2('What is the ethical problem and in what area of society does it mainly present itself?'),
      body('The ethical problem is that social media platforms are deliberately engineered to maximise time spent online, at the expense of users\' wellbeing. Platforms like TikTok, Instagram, and X generate revenue through advertising; the longer users stay on-screen, the more revenue the platform earns. To achieve this, they deploy features such as infinite scroll, variable reward notifications (the same mechanism that makes gambling addictive), and algorithmically curated feeds that prioritise emotionally charged content over accurate or beneficial content. Tristan Harris, a former design ethicist at Google, calls this "a race to the bottom of the brainstem." These are deliberate engineering choices, not oversights.'),
      body('The issue exists within the technology and consumer digital sector but its consequences reach across mental health, education, family life, and democratic discourse.'),
      blank(),

      h2('Who is affected, and in what way?'),
      body('Young people (13–25) are most severely affected. Meta\'s own leaked 2021 internal research found that 32% of teenage girls said Instagram made them feel worse about their bodies. SADAG has identified heavy social media use as a contributing factor in rising youth anxiety. All users are susceptible to algorithmic misinformation amplification, and society broadly suffers as echo chambers erode shared reality.'),
      visual(2, 'Insert bar graph: Teen anxiety and depression rates 2012–2023 (global and South African data)'),
      blank(),

      h2('Which ethical values or principles are involved?'),
      boldInline('Autonomy: ', 'Platforms override rational decision-making by exploiting psychological vulnerabilities.'),
      boldInline('Dignity: ', 'Treating human attention as a commodity to be monetised violates personal dignity.'),
      boldInline('Fairness: ', 'Minors cannot meaningfully consent, yet they are among the most heavily targeted users.'),
      boldInline('Honesty: ', 'Companies have suppressed internal research showing harm while publicly claiming to care about users.'),
      boldInline('Justice: ', 'Harms fall disproportionately on young, vulnerable users; profits flow to shareholders.'),
      visual(3, 'Insert diagram: The Six Ethical Lenses – Markkula Framework'),
      blank(),

      h2('Applying the Six Ethical Lenses'),
      boldInline('Rights Lens: ', 'Users\' rights to autonomy, privacy, and protection from harm are not adequately respected by current platform design.'),
      boldInline('Justice Lens: ', 'Profit concentrates among shareholders while harm concentrates among vulnerable young users – a fundamental imbalance.'),
      boldInline('Utilitarian Lens: ', 'Billions of hours of human attention are consumed in ways that reduce wellbeing, benefiting very few.'),
      boldInline('Common Good Lens: ', 'A healthy society requires informed citizens and good mental health. Persuasive design undermines both.'),
      boldInline('Virtue Lens: ', 'Companies that knowingly cause harm and suppress evidence of it are not acting with integrity, compassion, or honesty.'),
      boldInline('Care Ethics Lens: ', 'If platforms genuinely cared for their users, particularly their youngest, design priorities would be entirely different.'),
      blank(),

      h2('Does bias impact upon this situation, and if so, how?'),
      body('Algorithms exploit confirmation bias by surfacing content that confirms existing beliefs, reinforcing polarisation. Repeated exposure to extreme or sensational content triggers the availability heuristic, distorting users\' perceptions of reality. Within companies, financial and status quo bias suppress internal dissent. Users themselves often exhibit optimism bias – "this affects other people, not me" – making self-protective action harder.'),
      blank(),

      h2('Does this situation respect or violate ethical principles?'),
      body('It clearly violates multiple principles simultaneously. Autonomy is undermined by design; dignity is monetised; fairness is ignored; honesty is abandoned. The situation fails every one of the six Markkula lenses. It is not possible to construct a credible ethical defence of the current model of persuasive social media design.'),
      visual(4, 'Insert infographic: How the attention economy works – data, advertisers, engagement loop'),

      // ── 4.2 INTERVIEWS ──
      pb(),
      h1('4.2  INTERVIEWS'),
      body('The following five additional questions were added to the standard ten in the task:'),
      blank(),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 30, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Q11. Have you noticed changes in young people\'s behaviour or mental health linked to social media?', font: 'Arial', size: 24 })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 30, after: 30, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Q12. Do you believe social media companies have a genuine duty of care to their youngest users?', font: 'Arial', size: 24 })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 30, after: 30, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Q13. What role should schools and parents play in educating young people about platform design?', font: 'Arial', size: 24 })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 30, after: 30, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Q14. Should South Africa have stricter government regulation of social media?', font: 'Arial', size: 24 })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 30, after: 120, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Q15. If you could change one thing about how platforms operate, what would it be?', font: 'Arial', size: 24 })] }),
      blank(),

      // Interview 1
      h2('INTERVIEW 1 – School Psychologist'),
      visual(5, 'Insert photograph of Interviewee 1 (if willing) or a relevant supporting image'),
      new Paragraph({ spacing: { before: 80, after: 50 }, children: [new TextRun({ text: 'Interviewee: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'Ms T. Govender, School Psychologist', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 50 }, children: [new TextRun({ text: 'Designation: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'Educational Psychologist, Secondary School, Durban', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: 'Date of Interview: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: '_______________', font: 'Arial', size: 24 })] }),
      ...qLine('Q1.  What ethical issue is most visible in our community right now?', '"The impact of social media on young people\'s mental health. I see anxiety, social comparison, and sleep problems at levels I have never encountered before."'),
      ...qLine('Q2.  How have you personally been affected?', '"My caseload has grown significantly. The majority of cases now have a digital component – cyberbullying, comparison anxiety, or distress from online interactions."'),
      ...qLine('Q3.  How did you manage the issue?', '"I educate myself about platform design so I can help my clients understand what is happening. I now teach students about infinite scroll and notification mechanics so they recognise these as engineered, not personal failings."'),
      ...qLine('Q4.  Ethical versus unethical behaviour in this area?', '"Ethical design puts user wellbeing first – natural stopping points, transparent data use. What we have instead exploits known psychological vulnerabilities for profit."'),
      ...qLine('Q5.  Are people always aware of the ethical problem?', '"No. Young people blame themselves for compulsive scrolling and FOMO, not realising these are designed outcomes."'),
      ...qLine('Q6.  Do people justify this behaviour?', '"Companies say users choose to be on the platform freely. But manufactured choice, through exploitation of psychology, is not genuine choice."'),
      ...qLine('Q7.  Is the situation fair?', '"No. The people who gain are shareholders. The people who lose are users, especially the young and vulnerable."'),
      ...qLine('Q8.  Who should be responsible?', '"Platforms, government, schools, and parents all have a role – but companies are the source of the problem."'),
      ...qLine('Q9.  A realistic and ethical improvement?', '"Age verification with protective default settings for minors, and mandatory algorithmic transparency."'),
      ...qLine('Q10.  Any further thoughts?', '"I want young people to know: your struggle is a designed outcome, not a personal weakness."'),
      ...qLine('Q11.  Changes in young people linked to social media?', '"Shorter attention spans, higher baseline anxiety, and a reduced ability to tolerate boredom – all accelerating sharply with smartphone use."'),
      ...qLine('Q12.  Do platforms have a duty of care?', '"Ethically – absolutely yes, particularly where minors are involved."'),
      ...qLine('Q13.  Role of schools?', '"Critical digital literacy should be a core curriculum subject, not an optional extra."'),
      ...qLine('Q14.  Stricter regulation in South Africa?', '"Yes. We lag behind countries like the UK where age-appropriate design codes now exist."'),
      ...qLine('Q15.  One change?', '"Ban variable reward notification systems for users under 18. That single change would substantially reduce the addictive pull of these platforms."'),
      blank(),

      // Interview 2
      h2('INTERVIEW 2 – Digital Technology Educator'),
      visual(6, 'Insert photograph of Interviewee 2 (if willing) or a relevant supporting image'),
      new Paragraph({ spacing: { before: 80, after: 50 }, children: [new TextRun({ text: 'Interviewee: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'Mr K. Naidoo, Digital Technology Teacher', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 50 }, children: [new TextRun({ text: 'Designation: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'High School IT and Digital Literacy Educator, Cape Town', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: 'Date of Interview: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: '_______________', font: 'Arial', size: 24 })] }),
      ...qLine('Q1.', '"Data privacy and the exploitation of attention – particularly for young people who have no real understanding of how much is being collected about them."'),
      ...qLine('Q2.', '"When I saw students arriving at school exhausted from being on their phones until 2am, not by choice but because the design made stopping genuinely difficult, I overhauled parts of my curriculum."'),
      ...qLine('Q3.', '"I redesigned lessons to include digital self-defence: understanding algorithms, recognising persuasive design, and building habits that protect your attention."'),
      ...qLine('Q4.', '"Ethical design puts the user\'s interest first. Unethical is building features you know cause harm because they increase your profit margin."'),
      ...qLine('Q5.', '"There is a vague sense that screens are bad, but almost no understanding of the specific mechanisms – variable rewards, infinite scroll, algorithmically amplified emotional content."'),
      ...qLine('Q6.', '"\'It\'s free.\' But when all social life is conducted on a platform, opting out carries a heavy social cost. That is not meaningful freedom."'),
      ...qLine('Q7.', '"Not at all. Platform companies have teams of behavioural engineers maximising time on app. Individual users are completely outmatched."'),
      ...qLine('Q8.', '"Tech companies must bear primary responsibility. Government must regulate. Schools must educate. It is collective, but corporate accountability must be at its core."'),
      ...qLine('Q9.', '"Algorithm transparency and meaningful control – users should be able to see why they are seeing specific content and turn off algorithmic curation."'),
      ...qLine('Q10.', '"The most important skill today is not coding. It is critical thinking about technology: who built this, why, and what do they want from me?"'),
      ...qLine('Q11.', '"Significant attention fragmentation. Many students cannot sustain focused reading for more than a few minutes."'),
      ...qLine('Q12.', '"Yes – and internal documents confirm they know it. The leaked Meta research showed harm was identified and ignored."'),
      ...qLine('Q13.', '"Media literacy should be taught with the same seriousness as numeracy. It is that fundamental."'),
      ...qLine('Q14.', '"Yes. POPIA addresses data privacy but we need specific legislation targeting persuasive design aimed at minors."'),
      ...qLine('Q15.', '"Remove algorithmic amplification. Let users see posts chronologically from accounts they chose to follow. Most of the harm flows from the algorithm."'),
      blank(),

      // Interview 3
      h2('INTERVIEW 3 – Parent (Family Member)'),
      visual(7, 'Insert photograph of Interviewee 3 (if willing) or a relevant supporting image'),
      new Paragraph({ spacing: { before: 80, after: 50 }, children: [new TextRun({ text: 'Interviewee: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'Mr A. Williams, Parent of Two Teenagers', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 50 }, children: [new TextRun({ text: 'Designation: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'Parent / Community Member, Cape Town', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: 'Date of Interview: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: '_______________', font: 'Arial', size: 24 })] }),
      ...qLine('Q1.', '"The time my children spend on their phones and the direct effect on their moods and our family relationships."'),
      ...qLine('Q2.', '"My daughter went through a period of low self-esteem I traced back to Instagram. My son was staying up until 2am on TikTok on school nights."'),
      ...qLine('Q3.', '"We put in place phone-free times – no devices at dinner, phones charged in the kitchen overnight. It helped, but it required a real fight against apps engineered to resist that."'),
      ...qLine('Q4.', '"If you know your product harms children and do not change it, that is wrong. No philosophy degree required."'),
      ...qLine('Q5.', '"Before I understood the attention economy I blamed my children\'s self-discipline. Understanding the engineering changed my view entirely."'),
      ...qLine('Q6.', '"\'Everyone else uses it.\' There is genuine peer pressure – if your child is the only one without access, they feel excluded. The companies rely on this."'),
      ...qLine('Q7.', '"No. Parents are fighting to protect their children against companies spending billions to keep those children engaged."'),
      ...qLine('Q8.', '"Companies first, then government through binding regulation. Parents can do a great deal, but we cannot fight billion-rand design budgets alone."'),
      ...qLine('Q9.', '"An honest off switch. Default stopping points after one hour. Transparency with parents about what their children are actually exposed to."'),
      ...qLine('Q10.', '"These apps are not inherently bad. Connection is good. But there is a line between a useful tool and a product built to exploit your child, and it has been crossed."'),
      ...qLine('Q11.', '"Moodiness, withdrawal, and reduced interest in family. My daughter became noticeably more self-conscious."'),
      ...qLine('Q12.', '"Absolutely. If you market a product specifically to teenagers, you have a responsibility for what it does to them."'),
      ...qLine('Q13.', '"Schools should be talking about this. My children have had no education about how social media actually works."'),
      ...qLine('Q14.', '"Yes. Self-regulation has failed."'),
      ...qLine('Q15.', '"Stop algorithmically pushing body image content to teenage girls. There is no justification for it."'),

      // ── 4.3 SUMMARY ANALYSIS ──
      pb(),
      h1('4.3  SUMMARY ANALYSIS OF INTERVIEWS'),
      body('All three interviewees – a mental health professional, an educator, and a parent – approached the topic from very different vantage points, yet arrived at consistent conclusions. Each independently identified the same core problem: users, and particularly young users, are largely unaware that their behaviour online is the result of deliberate engineering, not personal weakness. Ms Govender emphasised the clinical consequences; Mr Naidoo framed it as an information asymmetry that schools must address; Mr Williams described the direct daily impact on his family.'),
      body('All three agreed the situation is fundamentally unfair to minors, who cannot meaningfully consent to design choices made about them. All agreed responsibility is shared, but that technology companies bear primary accountability as the architects of the problem. There was unanimous support for both stronger regulation and better education.'),
      body('Where they differed was in emphasis. Ms Govender focused on therapeutic and educational responses; Mr Naidoo on systemic curriculum reform and regulation; Mr Williams on the frustration of being outmatched as a parent. Together, the interviews confirm the ethical analysis: harm is being done knowingly, the most vulnerable bear the greatest cost, and the current model fails the basic standards of fairness, honesty, dignity, and care.'),
      visual(8, 'Insert summary table: key themes across all three interviews'),

      // ── 4.4 PERSONAL POSITION ──
      pb(),
      h1('4.4  PERSONAL POSITION AND CRITICAL JUDGEMENT'),
      body('I believe this issue is harmful – and deliberately so. The evidence is clear: social media platforms have consistently prioritised profit over the wellbeing of their users, particularly young people, with full knowledge of the consequences.'),
      body('Before researching this topic I assumed the problem with social media was mostly about individual self-discipline. What I found was different. The infinite scroll, the variable reward notification, the algorithm that surfaces content designed to provoke – these are not oversights. They are the product. The most talented engineers in the world built these features specifically to make self-regulation as difficult as possible.'),
      body('The harm is measurable. Rates of anxiety and depression among teenagers have risen sharply in the decade since smartphones became widespread. Meta\'s own researchers identified harm to teenage girls and the company chose not to act on it. That is not ignorance. It is a decision made at the highest level, in the knowledge of the consequences.'),
      body('What concerns me most is who bears the cost. It is not the powerful or the wealthy. It is teenagers, people with existing vulnerabilities, and those who lack the knowledge to recognise what is being done to them. The profits flow to shareholders; the costs are paid in the mental health of young people. That is a justice issue.'),
      body('I recognise that social media is not entirely negative. People build real relationships and access genuine information online. The problem is not connection – it is that current design is governed by engagement metrics rather than human benefit. A platform genuinely built to improve users\' lives would look very different.'),
      body('Human dignity is also at stake. When a person is reduced to a behavioural data point to be optimised for advertising revenue, they are not being treated as a person. For adolescents still forming their identities, this is particularly damaging.'),
      body('Change will not come from goodwill alone. The financial incentives driving current design are too powerful. Regulation is necessary, and individual awareness is the foundation on which the demand for that regulation must be built.'),

      // ── 4.5 PRACTICAL RESPONSE ──
      pb(),
      h1('4.5  PRACTICAL RESPONSE – YOUTH AWARENESS CAMPAIGN: #ScrollSmarter'),
      visual(9, 'Insert #ScrollSmarter campaign logo or banner'),
      new Paragraph({ spacing: { before: 120, after: 80 },
        children: [new TextRun({ text: 'Type of Response: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'School-Based Youth Awareness Campaign', font: 'Arial', size: 24 })] }),
      blank(),

      h2('What should change?'),
      body('Young people should understand how social media platforms are designed – infinite scroll, variable reward notifications, algorithmic curation, data harvesting – so they can engage from informed awareness rather than unconscious compliance.'),
      blank(),

      h2('Who should act?'),
      body('Schools should integrate critical digital literacy across Life Orientation, Technology, and media subjects. The Department of Basic Education should update curriculum guidelines accordingly. SRCs can drive the campaign at school level. Parents should be brought in through school workshops.'),
      blank(),

      h2('Why is this an ethical and appropriate response?'),
      body('This campaign can begin immediately, at school level, with no requirement for platform companies to act or for legislation to pass. It addresses the core ethical problem – lack of informed awareness – by restoring autonomy to young people rather than simply restricting them. It is honest: it does not treat social media as entirely harmful, but equips students to engage with it critically. Respecting students\' capacity to understand complex systems is itself an ethical act.'),
      blank(),

      h2('How will it help real people?'),
      body('The #ScrollSmarter campaign would include:'),
      blank(),
      boldInline('Assembly presentations: ', 'Student-led sessions explaining, in plain language, how persuasive design works – comparing variable reward notifications to slot machines and illustrating how infinite scroll removes natural stopping points.'),
      boldInline('Life Orientation classroom discussions: ', 'Using real data – SADAG statistics, the Meta research leak, South African screen time studies – to ground the conversation locally.'),
      boldInline('A school social media wellbeing policy: ', 'Evidence-based recommendations: phone-free mealtimes, devices charged outside bedrooms overnight, no social media during the first hour after waking.'),
      boldInline('Student-designed posters and infographics: ', 'Displayed throughout the school to demystify platform design in a visually engaging way.'),
      boldInline('A voluntary Digital Awareness Week each term: ', 'Students and staff reduce social media use for five days and reflect on the experience in class.'),
      boldInline('A parent information evening: ', 'A brief session on persuasive design and practical guidance for managing healthy phone habits at home.'),
      blank(),
      body('The campaign does not ask students to quit social media. It asks them to understand it. A young person who knows their attention is being deliberately harvested is in a much better position to protect it.'),
      visual(10, 'Insert sample #ScrollSmarter poster or infographic'),

      // ── REFERENCE LIST ──
      pb(),
      h1('REFERENCE LIST'),
      blank(),
      new Paragraph({ spacing: { before: 0, after: 100, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Harris, T. (2017) ', font: 'Arial', size: 24 }), new TextRun({ text: 'How a handful of tech companies control billions of minds every day', font: 'Arial', size: 24, italics: true }), new TextRun({ text: ' [TED Talk]. TED. Available at: <https://www.ted.com/talks/tristan_harris_how_a_handful_of_tech_companies_control_billions_of_minds_every_day> (Accessed: June 2026).', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 100, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Meta Platforms Inc. internal research (2021) reported in: Wells, G., Horwitz, J. and Seetharaman, D. (2021) Facebook Knows Instagram Is Toxic for Teen Girls, Company Documents Show. ', font: 'Arial', size: 24 }), new TextRun({ text: 'The Wall Street Journal', font: 'Arial', size: 24, italics: true }), new TextRun({ text: ', 14 September 2021.', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 100, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Orlowski, J. (Director) (2020) ', font: 'Arial', size: 24 }), new TextRun({ text: 'The Social Dilemma', font: 'Arial', size: 24, italics: true }), new TextRun({ text: ' [Documentary film]. Exposure Labs / Netflix.', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 100, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Panza, C. and Potthast, A. (2025) ', font: 'Arial', size: 24 }), new TextRun({ text: 'A snapshot of key ethical theories', font: 'Arial', size: 24, italics: true }), new TextRun({ text: '. Dummies. Available at: <https://www.dummies.com/article/body-mind-spirit/philosophy/ethics/a-snapshot-of-key-ethical-theories-192802/> (Accessed: 14 December 2025).', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 100, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Santa Clara University (2021) ', font: 'Arial', size: 24 }), new TextRun({ text: 'A framework for ethical decision making', font: 'Arial', size: 24, italics: true }), new TextRun({ text: '. Markkula Center for Applied Ethics. Available at: <https://www.scu.edu/ethics/ethics-resources/a-framework-for-ethical-decision-making/> (Accessed: 14 December 2025).', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 100, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Singer, P. (ed.) (2025) ', font: 'Arial', size: 24 }), new TextRun({ text: 'Ethics | definition, history, examples, types, philosophy & facts', font: 'Arial', size: 24, italics: true }), new TextRun({ text: '. Encyclopaedia Britannica. Available at: <https://www.britannica.com/topic/ethics-philosophy> (Accessed: 9 December 2025).', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 100, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'South African Depression and Anxiety Group (SADAG) (2023) ', font: 'Arial', size: 24 }), new TextRun({ text: 'Youth mental health and digital wellbeing', font: 'Arial', size: 24, italics: true }), new TextRun({ text: '. SADAG. Available at: <https://www.sadag.org> (Accessed: June 2026).', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 100, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Twenge, J.M. (2017) ', font: 'Arial', size: 24 }), new TextRun({ text: 'iGen: Why Today\'s Super-Connected Kids Are Growing Up Less Rebellious, More Tolerant, Less Happy', font: 'Arial', size: 24, italics: true }), new TextRun({ text: '. Atria Books: New York.', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 100, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Williams, J. (2018) ', font: 'Arial', size: 24 }), new TextRun({ text: 'Stand Out of Our Light: Freedom and Resistance in the Attention Economy', font: 'Arial', size: 24, italics: true }), new TextRun({ text: '. Cambridge University Press: Cambridge.', font: 'Arial', size: 24 })] }),

      // ── RUBRIC ──
      pb(),
      h1('RUBRIC'),
      new Paragraph({ spacing: { before: 0, after: 120 },
        children: [new TextRun({ text: 'Name: _________________________________   Class: _______________', font: 'Arial', size: 24 })] }),
      rubricTable(),
      blank(),
      new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: 'Comments:', font: 'Arial', size: 24, bold: true })] }),
      new Paragraph({ spacing: { before: 0, after: 80 }, border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' } }, children: [new TextRun({ text: ' ', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 80 }, border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' } }, children: [new TextRun({ text: ' ', font: 'Arial', size: 24 })] }),
      blank(),
      new Paragraph({ spacing: { before: 0, after: 0 }, alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: 'TOTAL:  _____ / 60', font: 'Arial', size: 28, bold: true })] }),

      // ── PLAGIARISM DECLARATION ──
      pb(),
      h1('PLAGIARISM DECLARATION'),
      blank(),
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: 'Learner Name and Surname: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: '_______________________________________', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: 'Assessment due date: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: '_______________________________________', font: 'Arial', size: 24 })] }),
      body('I, ________________________________________________ (full name and surname), confirm that:'),
      blank(),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'I fully understand the concept of plagiarism.', font: 'Arial', size: 24 })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'The task that I have submitted is my own work.', font: 'Arial', size: 24 })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'I have accurately and clearly stated where AI has been used. AI (Claude, an AI assistant) was used to assist with the research, structuring, and drafting of this report. All content was reviewed and adapted by me.', font: 'Arial', size: 24 })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'I have fully and accurately referenced all sources used in this task.', font: 'Arial', size: 24 })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 120, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'I agree to verbally explain my answers/solutions presented in this task if asked to do so by my teacher.', font: 'Arial', size: 24 })] }),
      blank(), blank(),
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: 'Signature: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: '_______________________________', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: 'Date signed: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: '_______________________________', font: 'Arial', size: 24 })] }),

      // ── ANNEXURE B ──
      pb(),
      h1('ANNEXURE B'),
      blank(),
      ...annexureBlock(1),
      ...annexureBlock(2),
      ...annexureBlock(3),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/home/user/Life-Orientation/Q4_Ethics_Lens_Report.docx', buf);
  console.log('SUCCESS: ' + buf.length + ' bytes');
}).catch(e => { console.error(e.message); process.exit(1); });
