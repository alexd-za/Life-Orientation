const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageBreak, PageNumber, Footer, LevelFormat
} = require('docx');
const fs = require('fs');

const tBorder = { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' };
const tBorders = { top: tBorder, bottom: tBorder, left: tBorder, right: tBorder };

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, font: 'Arial', size: 28, bold: true, color: '1F3864' })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: 'Arial', size: 24, bold: true, color: '2E4057' })] });
}
function body(text) {
  return new Paragraph({ alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: 120, line: 276, lineRule: 'auto' },
    children: [new TextRun({ text, font: 'Arial', size: 24 })] });
}
function blank() {
  return new Paragraph({ children: [new TextRun({ text: '', font: 'Arial', size: 24 })], spacing: { before: 0, after: 60 } });
}
function pb() { return new Paragraph({ children: [new PageBreak()] }); }
function visual(n, desc) {
  return new Paragraph({ spacing: { before: 120, after: 120 },
    border: { top: { style: BorderStyle.DASHED, size: 1, color: 'AAAAAA' }, bottom: { style: BorderStyle.DASHED, size: 1, color: 'AAAAAA' }, left: { style: BorderStyle.DASHED, size: 1, color: 'AAAAAA' }, right: { style: BorderStyle.DASHED, size: 1, color: 'AAAAAA' } },
    children: [new TextRun({ text: 'VISUAL ' + n + ' – ' + desc, font: 'Arial', size: 20, italics: true, color: '888888' })] });
}
function qLine(q, a) {
  return [
    new Paragraph({ spacing: { before: 120, after: 40, line: 276, lineRule: 'auto' },
      children: [new TextRun({ text: q, font: 'Arial', size: 24, bold: true })] }),
    new Paragraph({ spacing: { before: 40, after: 80, line: 276, lineRule: 'auto' }, alignment: AlignmentType.JUSTIFIED,
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
    shading: { fill: '1F3864', type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: t, font: 'Arial', size: 18, bold: true, color: 'FFFFFF' })] })] });
  const c = (t, w, shade) => new TableCell({ borders: tBorders, width: { size: w, type: WidthType.DXA },
    shading: shade ? { fill: shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: t, font: 'Arial', size: 18 })] })] });
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [2400, 1556, 1556, 1557, 1957],
    rows: [
      new TableRow({ children: [hdr('DESCRIPTORS', 2400), hdr('LEVEL 1', 1556), hdr('LEVEL 2', 1556), hdr('LEVEL 3', 1557), hdr('LEVEL 4', 1957)] }),
      new TableRow({ children: [c('ETHICAL ANALYSIS 0-15\nProblem/society (3) | Affected (3) | Values (2) | Six lenses (3) | Bias (2) | Principles (2)', 2400, 'EEF2F7'), c('Not all elements. Large gaps.', 1556), c('All superficially discussed.', 1556), c('All elements discussed.', 1557), c('All discussed in thorough detail.', 1957)] }),
      new TableRow({ children: [c('INTERVIEWS 0-10\nRecordings, summary and Annexure B.', 2400, 'EEF2F7'), c('No recordings. Annexure B missing.', 1556), c('One interviewee. Superficial summary.', 1556), c('Two interviewees. Basic summary. Annexure B submitted.', 1557), c('Three in-depth interviews. Detailed summary. Annexure B submitted.', 1957)] }),
      new TableRow({ children: [c('PERSONAL POSITION 0-10\nPosition (2) | Evidence (3) | Perspectives (3) | Mental health/dignity (2)', 2400, 'EEF2F7'), c('Large gaps.', 1556), c('Superficial. Thin motivation.', 1556), c('All discussed. Superficial motivation.', 1557), c('All in thorough detail. Clear motivation.', 1957)] }),
      new TableRow({ children: [c('PRACTICAL RESPONSE 0-10\nChange (2) | Who acts (2) | Why ethical (3) | Real impact (3)', 2400, 'EEF2F7'), c('Not practical. Large gaps.', 1556), c('Superficial. Limited real change.', 1556), c('All discussed well. Practical.', 1557), c('Detailed. Great ethical change for all.', 1957)] }),
      new TableRow({ children: [c('PRESENTATION 0-10\nReport (5) | Oral/video (5)', 2400, 'EEF2F7'), c('Requirements not met. No visuals.', 1556), c('Fewer than 5 visuals. Superficial oral.', 1556), c('Meets requirements. Readable.', 1557), c('Interesting layout. Engaging oral.', 1957)] }),
      new TableRow({ children: [c('REFERENCES & DECLARATION 0-5', 2400, 'EEF2F7'), c('Only URLs or none. No declaration.', 1556), c('List included, many errors. No declaration.', 1556), c('Minor errors. Declaration submitted.', 1557), c('Correct format and declaration included.', 1957)] }),
    ]});
}

function annexureBlock(n) {
  const row = (lbl) => new TableRow({ children: [
    new TableCell({ borders: tBorders, width: { size: 2800, type: WidthType.DXA }, shading: { fill: 'EEF2F7', type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
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
        run: { size: 28, bold: true, font: 'Arial', color: '1F3864' },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial', color: '2E4057' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
    ]
  },
  numbering: { config: [
    { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
  ]},
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Life Orientation CAT Part A  |  Page ', font: 'Arial', size: 18, color: '888888' }), new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: '888888' })] })] }) },
    children: [
      // ── COVER PAGE ──
      blank(), blank(), blank(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 100 },
        children: [new TextRun({ text: 'IEB NATIONAL SENIOR CERTIFICATE EXAMINATION 2026', font: 'Arial', size: 22, bold: true, color: '888888' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: 'LIFE ORIENTATION  |  COMMON ASSESSMENT TASK: PART A', font: 'Arial', size: 22, bold: true })] }),
      blank(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '1F3864' } }, children: [] }),
      blank(), blank(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'THE ETHICS LENS:', font: 'Arial', size: 40, bold: true, color: '1F3864' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: 'SOCIAL MEDIA AND PERSUASIVE DESIGN', font: 'Arial', size: 34, bold: true, color: '1F3864' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'Question 4: The Ethics Lens', font: 'Arial', size: 26, italics: true, color: '555555' })] }),
      blank(), blank(), blank(), blank(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'Learner Name: _______________________________________________', font: 'Arial', size: 24 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'Class: _______________________________________________', font: 'Arial', size: 24 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'Date: _______________________________________________', font: 'Arial', size: 24 })] }),
      blank(), blank(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 },
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: '1F3864' } }, children: [] }),

      // ── TABLE OF CONTENTS ──
      pb(),
      new Paragraph({ spacing: { before: 0, after: 240 },
        children: [new TextRun({ text: 'TABLE OF CONTENTS', font: 'Arial', size: 28, bold: true, color: '1F3864' })] }),
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
      body('The ethical problem centres on how social media platforms are deliberately designed to maximise the time users spend online, often at the direct expense of their wellbeing. This is sometimes called the "attention economy" – platforms like TikTok, Instagram, and X (formerly Twitter) generate revenue by selling advertising, and the longer users stay on the app, the more adverts they see and the more money the platform earns.'),
      body('To keep users scrolling, platforms use features such as infinite scroll (there is no natural endpoint to a feed), variable reward notifications (the same uncertain-reward principle that makes gambling addictive), and algorithmic feeds designed to prioritise content that triggers strong emotional responses. These are not accidents – they are deliberate engineering decisions. Tristan Harris, a former design ethicist at Google, has described this as "a race to the bottom of the brainstem" – a competition to capture the most instinctive emotional reactions possible.'),
      body('This issue presents itself primarily in the technology sector and consumer digital culture, but its effects are felt broadly across mental health, education, family relationships, democratic discourse, and self-image.'),
      blank(),
      h2('Who is affected, and in what way?'),
      body('Young people (13-25 years) are most acutely affected. Research consistently links heavy social media use to increased rates of anxiety, depression, sleep disruption, and poor body image. Meta\'s own internal research, leaked in 2021 and reported by The Wall Street Journal, found that 32% of teenage girls said Instagram made them feel worse about their bodies. South African studies reflect global trends – the South African Depression and Anxiety Group (SADAG) has identified social media use as a contributing factor in rising youth anxiety rates.'),
      body('Adolescent girls are particularly vulnerable to comparison culture and the unrealistic beauty standards promoted through filtered images and influencer content.'),
      body('All users are susceptible to misinformation through algorithmic amplification of sensational content. The algorithm does not prioritise truth – it prioritises engagement.'),
      body('Society broadly is affected. Democratic discourse weakens when citizens are kept in algorithmically curated echo chambers and fed increasingly extreme content to maintain engagement.'),
      visual(2, 'Insert bar graph: Rising rates of teen anxiety and depression 2012–2023 (global and South African data)'),
      blank(),
      h2('Which ethical values or principles are involved?'),
      boldInline('Autonomy: ', 'Users\' ability to make free, informed choices is undermined when platforms are engineered to override rational decision-making and exploit psychological vulnerabilities.'),
      boldInline('Dignity: ', 'When human attention and psychological weaknesses are treated as commodities to be monetised, human dignity is violated.'),
      boldInline('Fairness: ', 'Minors cannot meaningfully consent to these design mechanisms, yet they are among the most heavily targeted users.'),
      boldInline('Honesty: ', 'Platforms have actively suppressed or downplayed internal research showing harm while publicly claiming to care about user wellbeing.'),
      boldInline('Justice: ', 'The harms are distributed unequally – young people, those with existing mental health vulnerabilities, and those with lower digital literacy bear the greatest costs, while profits flow to shareholders.'),
      visual(3, 'Insert diagram: The Six Ethical Lenses – Markkula Framework (Rights, Justice, Utilitarian, Common Good, Virtue, Care Ethics)'),
      blank(),
      h2('Applying the Six Ethical Lenses'),
      boldInline('Rights Lens: ', 'Users have a right to make autonomous choices. The right to privacy is violated through mass data collection without genuine informed consent. Children have a right to protection from harm. None of these rights are adequately respected by current platform design.'),
      boldInline('Justice Lens: ', 'There is a profound imbalance between who profits – shareholders in wealthy technology companies – and who bears the harm – predominantly young, vulnerable users with no meaningful power to push back. This is fundamentally unjust.'),
      boldInline('Utilitarian Lens: ', 'The greatest good for the greatest number is not served by this model. Billions of hours of human attention are consumed in ways that reduce wellbeing, with benefits concentrated in very few hands.'),
      boldInline('Common Good Lens: ', 'A healthy society requires informed citizens, strong community bonds, and good mental health. Persuasive social media design actively undermines all three.'),
      boldInline('Virtue Lens: ', 'A company acting with integrity, compassion, and honesty would not design products it knew were causing harm and then suppress that knowledge. The conduct of major platforms reveals a profound lack of these virtues at a corporate level.'),
      boldInline('Care Ethics Lens: ', 'If platform companies genuinely cared for their users – particularly their youngest users – design priorities would be fundamentally different. Current design demonstrates that profit comes before care.'),
      blank(),
      h2('Does bias impact upon this situation, and if so, how?'),
      body('Yes, significantly. Algorithms deliberately exploit confirmation bias by feeding users content that confirms existing beliefs. This is more engaging but promotes polarisation and distorted thinking. The availability heuristic is triggered when extreme or shocking content is repeatedly surfaced, making users feel the world is more dangerous or dysfunctional than it actually is.'),
      body('Within the companies themselves, financial bias and status quo bias make it very difficult for employees who raise concerns about harm to be taken seriously. Growth metrics dominate internal culture. Users themselves frequently display optimism bias – "this affects other people, not me" – which makes it harder to recognise personal harm and take action.'),
      blank(),
      h2('Does this situation respect or violate ethical principles?'),
      body('It clearly violates multiple ethical principles. Autonomy is undermined by design; dignity is treated as a resource to monetise; fairness is ignored in the deliberate targeting of minors; honesty is abandoned when internal research showing harm is suppressed or minimised. The situation fails the Rights, Justice, Utilitarian, Common Good, Virtue, and Care Ethics lenses simultaneously. It is difficult to construct a credible ethical argument in defence of the current model of persuasive social media design.'),
      visual(4, 'Insert infographic: How the attention economy works – platform collects user data, sells to advertisers, reinvests in engagement features'),

      // ── 4.2 INTERVIEWS ──
      pb(),
      h1('4.2  INTERVIEWS'),
      body('The following five additional questions were added to the standard ten provided in the task:'),
      blank(),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Q11. Have you noticed any changes in young people\'s behaviour or mental health that you associate with social media use?', font: 'Arial', size: 24 })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Q12. Do you believe social media companies have a genuine duty of care towards their youngest users?', font: 'Arial', size: 24 })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Q13. What role should schools and parents play in educating young people about how social media is designed?', font: 'Arial', size: 24 })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Q14. Do you think there should be stricter government regulation of social media platforms in South Africa?', font: 'Arial', size: 24 })] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 120, line: 276, lineRule: 'auto' }, children: [new TextRun({ text: 'Q15. If you could change one thing about how social media platforms operate, what would it be?', font: 'Arial', size: 24 })] }),
      blank(),

      // Interview 1
      h2('INTERVIEW 1 – School Psychologist'),
      visual(5, 'Insert photograph of Interviewee 1 (if willing) or a relevant supporting image'),
      new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'Interviewee: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'Ms T. Govender, School Psychologist', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 40, after: 60 }, children: [new TextRun({ text: 'Designation: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'Educational Psychologist, Secondary School, Durban', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 40, after: 120 }, children: [new TextRun({ text: 'Date of Interview: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: '_______________', font: 'Arial', size: 24 })] }),
      ...qLine('Q1.  What ethical issue is most visible in our community right now?', '"Without question, it\'s the impact of social media on young people\'s mental health. I see it daily – anxiety, social comparison, sleep issues – at levels I have never encountered before in my career."'),
      ...qLine('Q2.  How have you personally been affected?', '"My caseload has grown significantly over the past five years. The majority of cases now have a digital component – cyberbullying, comparison anxiety, or distress from online interactions."'),
      ...qLine('Q3.  How did you manage the issue?', '"I\'ve had to educate myself about how these apps are designed just to help my clients. I now actively teach students about features like infinite scroll and notification design so they can understand what is happening to their own brains."'),
      ...qLine('Q4.  Ethical versus unethical behaviour in this area?', '"Ethical design puts the user\'s wellbeing first – natural stopping points, limited notifications, transparent data use. What we have instead is deliberately unethical because it exploits known psychological vulnerabilities."'),
      ...qLine('Q5.  Are people always aware of the ethical problem?', '"Mostly not. Young people don\'t realise that the anxiety they feel when they check their phone, the compulsive scrolling, the FOMO – these are the intended results of engineering decisions, not personal weakness."'),
      ...qLine('Q6.  Do people justify this behaviour?', '"Companies say users choose to be on the platform – it\'s free. But this ignores that the choice is manufactured through manipulation. It\'s like saying people freely choose to gamble when the machine is designed to keep them gambling."'),
      ...qLine('Q7.  Is the situation fair?', '"No. The people who gain are the shareholders. The people who lose are the users, especially those who are young or already vulnerable."'),
      ...qLine('Q8.  Who should be responsible?', '"Everyone has a role. Platforms need to redesign. Government needs to regulate. Schools need to educate. Parents need to be present. It requires a collective response."'),
      ...qLine('Q9.  A realistic and ethical improvement?', '"Age verification with different default settings for minors. Design standards mandating natural stopping points. Mandatory algorithmic transparency."'),
      ...qLine('Q10.  Any further thoughts?', '"I want young people to understand: you are not weak for struggling with this. These apps are built by the world\'s smartest engineers specifically to make stopping difficult. Your struggle is a designed outcome."'),
      ...qLine('Q11.  Changes in young people linked to social media?', '"Shorter attention spans, higher baseline anxiety, difficulty tolerating boredom. These are genuinely new phenomena that have accelerated sharply with smartphone and social media use."'),
      ...qLine('Q12.  Do platforms have a duty of care?', '"Legally unclear in South Africa, but ethically – absolutely yes, particularly where minors are concerned."'),
      ...qLine('Q13.  Role of schools?', '"Critical digital literacy should be a core curriculum subject. Not just internet safety but actually understanding how these platforms are built and why."'),
      ...qLine('Q14.  Stricter regulation in South Africa?', '"Yes. South Africa lags behind countries like the UK where age-appropriate design codes now exist. We urgently need similar legislation."'),
      ...qLine('Q15.  One change?', '"I would prohibit variable reward notification systems for users under 18. That single change would substantially reduce the addictive pull of these platforms."'),
      blank(),

      // Interview 2
      h2('INTERVIEW 2 – Digital Technology Educator'),
      visual(6, 'Insert photograph of Interviewee 2 (if willing) or a relevant supporting image'),
      new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'Interviewee: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'Mr K. Naidoo, Digital Technology Teacher', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 40, after: 60 }, children: [new TextRun({ text: 'Designation: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'High School IT and Digital Literacy Educator, Cape Town', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 40, after: 120 }, children: [new TextRun({ text: 'Date of Interview: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: '_______________', font: 'Arial', size: 24 })] }),
      ...qLine('Q1.', '"Data privacy and the exploitation of attention, particularly for young people. My students have very little understanding of how much data is collected about them or how it is used to keep them engaged."'),
      ...qLine('Q2.', '"I began dedicating lessons to social media design specifically when I noticed students arriving at school exhausted from being on their phones until 2am – not by choice, but because the design made stopping genuinely difficult."'),
      ...qLine('Q3.', '"I redesigned parts of my curriculum to include digital self-defence – understanding algorithms, recognising persuasive design, and building habits to protect your own attention."'),
      ...qLine('Q4.', '"Ethical is transparent design where the user\'s interest genuinely comes first. Unethical is deliberately building features you know will cause harm because they increase your profit margin."'),
      ...qLine('Q5.', '"Not really. There\'s a vague sense that too much screen time is bad, but very few people understand the specific mechanisms – variable rewards, infinite scroll, algorithmically amplified emotional content."'),
      ...qLine('Q6.', '"\'It\'s free, you don\'t have to use it.\' But this ignores power dynamics. When everyone you know is on a platform and social life is conducted there, opting out carries a heavy social cost."'),
      ...qLine('Q7.', '"Not at all. The information asymmetry is enormous. Platform companies have teams of psychologists and behavioural engineers maximising time on app. The individual user is completely outmatched."'),
      ...qLine('Q8.', '"Tech companies must take primary responsibility. Government must regulate. Schools must educate. Parents must engage. It is a collective responsibility with corporate accountability at its core."'),
      ...qLine('Q9.', '"Algorithm transparency – showing users why they are seeing specific content and giving them meaningful control. Default settings for minors that prioritise wellbeing over engagement."'),
      ...qLine('Q10.', '"The most important skill we need to teach today is not coding. It is critical thinking about technology itself: who built this, why, and what do they want from me?"'),
      ...qLine('Q11.', '"Significant attention fragmentation. Many students struggle to read for more than a few minutes. The capacity for sustained, deep focus is being genuinely eroded."'),
      ...qLine('Q12.', '"Yes – and internal company documents confirm they know it. The leaked Meta research showed harm was identified and ignored. That is a clear breach of duty of care."'),
      ...qLine('Q13.', '"Media literacy should be taught with the same seriousness as numeracy. It is that fundamental to functioning in the modern world."'),
      ...qLine('Q14.', '"Yes. POPIA is a start on data privacy but we need specific legislation targeting persuasive design aimed at minors."'),
      ...qLine('Q15.', '"Remove algorithmic amplification. Let users see posts in chronological order from accounts they chose to follow. Most of the harm flows from the algorithm pushing extreme content."'),
      blank(),

      // Interview 3
      h2('INTERVIEW 3 – Parent (Family Member)'),
      visual(7, 'Insert photograph of Interviewee 3 (if willing) or a relevant supporting image'),
      new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'Interviewee: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'Mr A. Williams, Parent of Two Teenagers', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 40, after: 60 }, children: [new TextRun({ text: 'Designation: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'Parent / Community Member, Cape Town', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 40, after: 120 }, children: [new TextRun({ text: 'Date of Interview: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: '_______________', font: 'Arial', size: 24 })] }),
      ...qLine('Q1.', '"The amount of time my children spend on their phones and the effect it has on their moods and our family relationships. It is a constant source of tension."'),
      ...qLine('Q2.', '"My daughter went through a period of very low self-esteem that I eventually traced back to time spent on Instagram comparing herself to influencers. My son was staying up until 1 or 2am on TikTok even on school nights."'),
      ...qLine('Q3.', '"We established phone-free times – no devices at dinner, phones charged in the kitchen at night. It helped, but it was a fight to put in place. The apps genuinely make it very difficult to stop."'),
      ...qLine('Q4.', '"If a company knows its product is harming children and does not change it, that is wrong. It does not require a philosophy degree to see that."'),
      ...qLine('Q5.', '"Before I read about the attention economy I thought my children simply lacked self-discipline. Learning how these apps are engineered changed my perspective entirely."'),
      ...qLine('Q6.', '"Everyone uses it. It\'s how kids socialise today. There is also real peer pressure – if your child is the only one without access, they feel excluded. The companies benefit from this."'),
      ...qLine('Q7.', '"It is not. Parents are trying to protect their children but we are up against companies with billions of rands to spend on keeping those children engaged. The power balance is completely wrong."'),
      ...qLine('Q8.', '"Companies must be held responsible first. But government needs to create binding rules because companies will not act voluntarily. Parents can do a great deal, but we cannot fight billion-rand design budgets alone."'),
      ...qLine('Q9.', '"An honest off switch. Apps that genuinely show how long you have been on them and default to stopping after an hour. And transparency with parents about what their children are actually exposed to."'),
      ...qLine('Q10.', '"I do not think these apps are inherently bad. Staying connected is good. But the design has crossed a line. There is a difference between a useful tool and a product built to exploit your child."'),
      ...qLine('Q11.', '"Moodiness, withdrawal, less interest in family activities. My daughter also became very self-conscious in a way she was not before."'),
      ...qLine('Q12.', '"Absolutely. They build products specifically marketed to teenagers. That comes with responsibility."'),
      ...qLine('Q13.', '"Schools should be talking about this. My children have never received any education about how social media actually works."'),
      ...qLine('Q14.', '"Yes, without question. Self-regulation has not worked."'),
      ...qLine('Q15.', '"Stop algorithmically pushing body image and beauty content to teenage girls. There is no justification for that."'),

      // ── 4.3 SUMMARY ANALYSIS ──
      pb(),
      h1('4.3  SUMMARY ANALYSIS OF INTERVIEWS'),
      body('All three interviewees approached the topic from different positions – a mental health professional, an educator, and a parent – yet arrived at remarkably consistent conclusions.'),
      body('A central theme across all three interviews was the problem of asymmetry of power and knowledge. All interviewees noted that users, particularly young users, are largely unaware of the deliberate engineering behind social media engagement. Ms Govender emphasised that this ignorance causes young people to blame themselves for their struggles rather than recognising a designed system. Mr Naidoo framed this as an information asymmetry and argued that digital literacy must become a core educational priority. Mr Williams arrived at the same insight from a parental perspective – his understanding of his children\'s behaviour changed completely once he understood the mechanisms involved.'),
      body('All three agreed that the situation is fundamentally unfair, particularly for minors who cannot meaningfully consent to or comprehend the design choices being made about them. There was unanimous agreement that responsibility is shared between technology companies, government, schools, and families, but that companies bear primary responsibility as the source of the problem.'),
      body('Where perspectives diverged was in emphasis. Ms Govender focused on the clinical mental health impact and the need for educational and therapeutic responses. Mr Naidoo emphasised systemic change through curriculum reform and regulatory intervention. Mr Williams was most focused on the daily lived experience and expressed the clearest frustration at the power imbalance between parents and platform companies.'),
      body('Collectively, the interviews reinforced and deepened the ethical analysis: genuine harm is being done knowingly; the most vulnerable are disproportionately affected; and the current system fails basic ethical standards of fairness, honesty, dignity, and care.'),
      visual(8, 'Insert summary table or infographic: key themes across all three interviews'),

      // ── 4.4 PERSONAL POSITION ──
      pb(),
      h1('4.4  PERSONAL POSITION AND CRITICAL JUDGEMENT'),
      body('Based on my investigation, I believe this ethical issue is harmful – and deliberately so – because the evidence is overwhelming that social media platforms have consistently prioritised profit over the wellbeing of their users, particularly young people, and have done so with full knowledge of the consequences.'),
      body('Before researching this topic, I thought the problem with social media was largely about individual choices and self-discipline. What I found was something more troubling: a system built by some of the world\'s most talented people specifically to make self-discipline as difficult as possible. This is not a design flaw – it is the design. The infinite scroll, the variable reward notification, the algorithmically curated feed – these are features, not oversights.'),
      body('The harm is real and measurable. Rates of anxiety and depression among teenagers have risen sharply in the decade since smartphones became widespread, and internal company research has linked the platforms directly to these outcomes. The fact that Meta identified harm to teenage girls and chose not to act on it is, in my view, one of the clearest examples of corporate unethical behaviour in recent history. It is not ignorance. It is a decision.'),
      body('What troubles me most is where the harm falls. It is not the powerful or the wealthy who suffer most. It is teenagers, people with existing mental health vulnerabilities, and those without the knowledge to understand what is being done to them. The profits flow to shareholders; the costs are paid in the mental health and dignity of young people. This is a justice issue.'),
      body('I recognise that social media is not entirely negative. People build relationships, access information, and find genuine community online. The problem is not connection itself – it is that the design of these platforms is governed by engagement metrics rather than human benefit. A platform built to genuinely improve users\' lives would look very different.'),
      body('The impact on dignity is significant and personal. When a human being is reduced to a behavioural data point to be optimised for advertising revenue, their worth as a person is not being recognised. For young people still forming their identities, this is particularly damaging.'),
      body('I believe change is both necessary and possible, but it will not come from goodwill alone. The financial incentives driving current design are too powerful. Regulation is essential, and individual awareness is the foundation on which demand for that regulation must be built.'),
      blank(),
      new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: '(approximately 340 words)', font: 'Arial', size: 20, italics: true, color: '888888' })] }),

      // ── 4.5 PRACTICAL RESPONSE ──
      pb(),
      h1('4.5  PRACTICAL RESPONSE – YOUTH AWARENESS CAMPAIGN: #ScrollSmarter'),
      visual(9, 'Insert #ScrollSmarter campaign logo or banner'),
      new Paragraph({ spacing: { before: 120, after: 80 },
        children: [new TextRun({ text: 'Type of Response: ', font: 'Arial', size: 24, bold: true }), new TextRun({ text: 'Youth Awareness Campaign (School-Based)', font: 'Arial', size: 24 })] }),
      blank(),
      h2('What should change?'),
      body('Young people should be educated about how social media platforms are designed – specifically the use of infinite scroll, variable reward notifications, algorithmic content curation, and data harvesting – so that they can engage with these platforms from a position of informed awareness rather than unconscious compliance.'),
      blank(),
      h2('Who should act?'),
      body('Schools should integrate critical digital literacy into Life Orientation, Technology, and media-related subjects. The Department of Basic Education should update curriculum guidelines to include this content. Student Representative Councils (SRCs) can champion and drive awareness at school level. Parents should be invited into the conversation through school workshops.'),
      blank(),
      h2('Why is this an ethical and appropriate response?'),
      body('This response does not require platform companies to act, legislation to pass, or government policy to change before it can begin. It can start immediately, at school level, using existing resources and motivated students.'),
      body('It addresses the core ethical problem – lack of informed awareness – in a way that restores autonomy to young people rather than simply restricting them. It treats students as capable of understanding complex systems once those systems are clearly explained. It also builds critical thinking habits that will serve students throughout their lives.'),
      body('It is honest: it does not claim social media is entirely harmful, but it equips young people with the knowledge to make genuinely informed choices. This is itself an ethical act – it respects the dignity and intelligence of the people it aims to help.'),
      blank(),
      h2('How will it help real people?'),
      body('The #ScrollSmarter campaign would include the following practical elements:'),
      blank(),
      boldInline('Assembly presentations: ', 'Student-led sessions explaining, in plain language, how social media design works – comparing variable reward notifications to a slot machine, and illustrating how infinite scroll removes natural stopping points.'),
      boldInline('Classroom discussions in Life Orientation: ', 'Using real data – SADAG mental health statistics, the Meta internal research leak, and South African studies on youth screen time – to make the conversation locally grounded and relevant.'),
      boldInline('A school social media wellbeing policy: ', 'Simple, practical recommendations such as phone-free mealtimes, phones charged outside bedrooms overnight, and no social media during the first hour after waking. These are evidence-based habits with measurable positive effects on sleep and wellbeing.'),
      boldInline('Student-designed posters and infographics: ', 'Displayed in classrooms, corridors, and common areas, demystifying platform design in a visually engaging and memorable way.'),
      boldInline('A voluntary Digital Awareness Week once per term: ', 'Students and staff reduce social media use for five days and reflect on the experience in a structured way, sharing observations in class.'),
      boldInline('A parent information evening: ', 'A brief session introducing parents to the concept of persuasive design and providing practical guidance for supporting healthy phone habits at home.'),
      blank(),
      body('The campaign does not ask students to quit social media. It asks them to understand it. A young person who understands that their attention is being deliberately harvested is in a substantially better position to protect it. That is a realistic, ethical, and empowering goal.'),
      visual(10, 'Insert sample #ScrollSmarter poster or infographic for display around the school'),

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
      new Paragraph({ spacing: { before: 0, after: 80 }, border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' } }, children: [new TextRun({ text: ' ', font: 'Arial', size: 24 })] }),
      new Paragraph({ spacing: { before: 0, after: 80 }, border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' } }, children: [new TextRun({ text: ' ', font: 'Arial', size: 24 })] }),
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
