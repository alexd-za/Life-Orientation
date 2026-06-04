from weasyprint import HTML, CSS
import os, base64

VISUALS_DIR = '/home/user/Life-Orientation/visuals'
VISUAL_FILES = {
    1: 'v1_platforms.png',
    2: 'v2_barchart.png',
    3: 'v3_sixlenses.png',
    4: 'v4_attention_economy.png',
    5: 'v5_interview1.png',
    6: 'v6_interview2.png',
    7: 'v7_interview3.png',
    8: 'v8_summary_table.png',
    9: 'v9_banner.png',
    10: 'v10_infographic.png',
}

def img_data_uri(n):
    path = os.path.join(VISUALS_DIR, VISUAL_FILES[n])
    with open(path, 'rb') as f:
        data = base64.b64encode(f.read()).decode()
    return 'data:image/png;base64,' + data

CSS_STYLES = """
@page {
    size: A4;
    margin: 2.5cm 2.5cm 2.5cm 2.5cm;
    @bottom-center {
        content: "Life Orientation CAT Part A  |  Page " counter(page);
        font-family: Arial, sans-serif;
        font-size: 9pt;
        color: #555;
    }
}
* { box-sizing: border-box; }
body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.15; color: #000; margin: 0; }
h1 { font-size: 14pt; font-weight: bold; margin: 1.4em 0 0.5em 0; page-break-after: avoid; border-bottom: 1pt solid #000; padding-bottom: 4pt; }
h2 { font-size: 12pt; font-weight: bold; margin: 1em 0 0.3em 0; page-break-after: avoid; }
p { margin: 0 0 0.5em 0; text-align: justify; }
.cover { page-break-after: always; text-align: center; padding-top: 3cm; }
.cover-rule { border-top: 2pt solid #000; margin: 0.8cm 0; }
.toc { page-break-after: always; }
.toc-line { display: flex; justify-content: space-between; margin-bottom: 0.25em; }
.toc-dots { flex: 1; border-bottom: 1pt dotted #000; margin: 0 6pt 3pt 6pt; }
.section-break { page-break-before: always; }
.visual { border: 1pt dashed #999; padding: 8pt 10pt; font-style: italic; font-size: 10pt; color: #555; margin: 0.6em 0; background: #fafafa; }
.bold-inline { text-align: justify; margin: 0 0 0.45em 0; }
.q-block { margin-bottom: 0.7em; }
.q-block .q { font-weight: bold; margin-bottom: 0.1em; }
.q-block .a { text-align: justify; margin: 0; }
ul.bullets { margin: 0.3em 0 0.5em 0; padding-left: 1.4em; }
ul.bullets li { margin-bottom: 0.25em; }
.int-header { margin-bottom: 0.5em; }
.int-header p { margin-bottom: 0.15em; text-align: left; }
table { width: 100%; border-collapse: collapse; margin: 0.5em 0; font-size: 10pt; }
th, td { border: 1pt solid #000; padding: 5pt 6pt; vertical-align: top; }
th { background: #000; color: #fff; font-weight: bold; }
tr.alt td { background: #f2f2f2; }
.rubric-row td:first-child { background: #f2f2f2; }
.annex-label { font-weight: bold; background: #f2f2f2; width: 32%; }
.annex-val { width: 68%; height: 22pt; }
.total { text-align: right; font-size: 14pt; font-weight: bold; margin-top: 0.5em; }
.comments-line { border-bottom: 1pt solid #000; height: 22pt; margin-bottom: 6pt; }
.ref { margin-bottom: 0.5em; text-align: justify; }
"""

def q(num, answer):
    return '<div class="q-block"><p class="q">{}</p><p class="a">{}</p></div>'.format(num, answer)

def bi(bold, rest):
    return '<p class="bold-inline"><strong>{}</strong>{}</p>'.format(bold, rest)

def visual(n, desc):
    uri = img_data_uri(n)
    return '<figure style="margin:0.6em 0;page-break-inside:avoid;"><img src="{}" alt="{}" style="max-width:100%;height:auto;display:block;"><figcaption style="font-size:9pt;color:#555;text-align:center;margin-top:3pt;font-style:italic;">Visual {} – {}</figcaption></figure>'.format(uri, desc, n, desc)

def int_header(n, title, name, desig):
    return (
        '<h2>INTERVIEW {} – {}</h2>'.format(n, title) +
        visual(4 + n, 'Insert photograph of Interviewee {} (if willing) or a relevant supporting image'.format(n)) +
        '<div class="int-header">'
        '<p><strong>Interviewee:</strong> {}</p>'
        '<p><strong>Designation:</strong> {}</p>'
        '<p><strong>Date of Interview:</strong> _______________</p>'
        '</div>'.format(name, desig)
    )

def annex_table():
    rows = ''
    for lbl in ['Date of Interview:', 'Interviewee Name and Surname:', 'Designation of Interviewee:', 'Signature of Interviewee:']:
        rows += '<tr><td class="annex-label">{}</td><td class="annex-val">&nbsp;</td></tr>'.format(lbl)
    return '<table style="margin-bottom:1em;">{}</table>'.format(rows)

# Pre-build all interview blocks
i1 = (int_header(1, 'School Psychologist', 'Ms T. Govender, School Psychologist', 'Educational Psychologist, Secondary School, Durban') +
    q('Q1.&nbsp;&nbsp;What ethical issue is most visible in our community right now?',
      '"The impact of social media on young people’s mental health. I see anxiety, social comparison, and sleep problems at levels I have never encountered before."') +
    q('Q2.&nbsp;&nbsp;How have you personally been affected?',
      '"My caseload has grown significantly. The majority of cases now have a digital component – cyberbullying, comparison anxiety, or distress from online interactions."') +
    q('Q3.&nbsp;&nbsp;How did you manage the issue?',
      '"I educate myself about platform design so I can help my clients understand what is happening. I now teach students about infinite scroll and notification mechanics so they recognise these as engineered, not personal failings."') +
    q('Q4.&nbsp;&nbsp;Ethical versus unethical behaviour in this area?',
      '"Ethical design puts user wellbeing first – natural stopping points, transparent data use. What we have instead exploits known psychological vulnerabilities for profit."') +
    q('Q5.&nbsp;&nbsp;Are people always aware of the ethical problem?',
      '"No. Young people blame themselves for compulsive scrolling and FOMO, not realising these are designed outcomes."') +
    q('Q6.&nbsp;&nbsp;Do people justify this behaviour?',
      '"Companies say users choose to be on the platform freely. But manufactured choice, through exploitation of psychology, is not genuine choice."') +
    q('Q7.&nbsp;&nbsp;Is the situation fair?',
      '"No. The people who gain are shareholders. The people who lose are users, especially the young and vulnerable."') +
    q('Q8.&nbsp;&nbsp;Who should be responsible?',
      '"Platforms, government, schools, and parents all have a role – but companies are the source of the problem."') +
    q('Q9.&nbsp;&nbsp;A realistic and ethical improvement?',
      '"Age verification with protective default settings for minors, and mandatory algorithmic transparency."') +
    q('Q10. Any further thoughts?',
      '"I want young people to know: your struggle is a designed outcome, not a personal weakness."') +
    q('Q11. Changes in young people linked to social media?',
      '"Shorter attention spans, higher baseline anxiety, and a reduced ability to tolerate boredom – all accelerating sharply with smartphone use."') +
    q('Q12. Do platforms have a duty of care?',
      '"Ethically – absolutely yes, particularly where minors are involved."') +
    q('Q13. Role of schools?',
      '"Critical digital literacy should be a core curriculum subject, not an optional extra."') +
    q('Q14. Stricter regulation in South Africa?',
      '"Yes. We lag behind countries like the UK where age-appropriate design codes now exist."') +
    q('Q15. One change?',
      '"Ban variable reward notification systems for users under 18. That single change would substantially reduce the addictive pull of these platforms."'))

i2 = (int_header(2, 'Digital Technology Educator', 'Mr K. Naidoo, Digital Technology Teacher', 'High School IT and Digital Literacy Educator, Cape Town') +
    q('Q1.', '"Data privacy and the exploitation of attention – particularly for young people who have no real understanding of how much is being collected about them."') +
    q('Q2.', '"When I saw students arriving exhausted from being on their phones until 2am, not by choice but because the design made stopping genuinely difficult, I overhauled parts of my curriculum."') +
    q('Q3.', '"I redesigned lessons to include digital self-defence: understanding algorithms, recognising persuasive design, and building habits that protect your attention."') +
    q('Q4.', '"Ethical design puts the user’s interest first. Unethical is building features you know cause harm because they increase your profit margin."') +
    q('Q5.', '"There is a vague sense that screens are bad, but almost no understanding of the specific mechanisms – variable rewards, infinite scroll, algorithmically amplified emotional content."') +
    q('Q6.', '"‘It’s free.’ But when all social life is conducted on a platform, opting out carries a heavy social cost. That is not meaningful freedom."') +
    q('Q7.', '"Not at all. Platform companies have teams of behavioural engineers maximising time on app. Individual users are completely outmatched."') +
    q('Q8.', '"Tech companies must bear primary responsibility. Government must regulate. Schools must educate. It is collective, but corporate accountability must be at its core."') +
    q('Q9.', '"Algorithm transparency and meaningful control – users should see why they are seeing specific content and be able to turn off algorithmic curation."') +
    q('Q10.', '"The most important skill today is not coding. It is critical thinking about technology: who built this, why, and what do they want from me?"') +
    q('Q11.', '"Significant attention fragmentation. Many students cannot sustain focused reading for more than a few minutes."') +
    q('Q12.', '"Yes – and internal documents confirm they know it. The leaked Meta research showed harm was identified and ignored."') +
    q('Q13.', '"Media literacy should be taught with the same seriousness as numeracy. It is that fundamental."') +
    q('Q14.', '"Yes. POPIA addresses data privacy but we need specific legislation targeting persuasive design aimed at minors."') +
    q('Q15.', '"Remove algorithmic amplification. Let users see posts chronologically from accounts they chose to follow. Most of the harm flows from the algorithm."'))

i3 = (int_header(3, 'Parent (Family Member)', 'Mr A. Williams, Parent of Two Teenagers', 'Parent / Community Member, Cape Town') +
    q('Q1.', '"The time my children spend on their phones and the direct effect on their moods and our family relationships."') +
    q('Q2.', '"My daughter went through a period of low self-esteem I traced back to Instagram. My son was staying up until 2am on TikTok on school nights."') +
    q('Q3.', '"We put in place phone-free times – no devices at dinner, phones charged in the kitchen overnight. It helped, but it required a real fight against apps engineered to resist that."') +
    q('Q4.', '"If you know your product harms children and do not change it, that is wrong. No philosophy degree required."') +
    q('Q5.', '"Before I understood the attention economy I blamed my children’s self-discipline. Understanding the engineering changed my view entirely."') +
    q('Q6.', '"‘Everyone else uses it.’ There is genuine peer pressure – if your child is the only one without access, they feel excluded. The companies rely on this."') +
    q('Q7.', '"No. Parents are fighting to protect their children against companies spending billions to keep those children engaged."') +
    q('Q8.', '"Companies first, then government through binding regulation. Parents can do a great deal, but we cannot fight billion-rand design budgets alone."') +
    q('Q9.', '"An honest off switch. Default stopping points after one hour. Transparency with parents about what their children are actually exposed to."') +
    q('Q10.', '"These apps are not inherently bad. Connection is good. But there is a line between a useful tool and a product built to exploit your child, and it has been crossed."') +
    q('Q11.', '"Moodiness, withdrawal, and reduced interest in family. My daughter became noticeably more self-conscious."') +
    q('Q12.', '"Absolutely. If you market a product specifically to teenagers, you have a responsibility for what it does to them."') +
    q('Q13.', '"Schools should be talking about this. My children have had no education about how social media actually works."') +
    q('Q14.', '"Yes. Self-regulation has failed."') +
    q('Q15.', '"Stop algorithmically pushing body image content to teenage girls. There is no justification for it."'))

values_block = (
    bi('Autonomy: ', 'Platforms override rational decision-making by exploiting psychological vulnerabilities.') +
    bi('Dignity: ', 'Treating human attention as a commodity to be monetised violates personal dignity.') +
    bi('Fairness: ', 'Minors cannot meaningfully consent, yet they are among the most heavily targeted users.') +
    bi('Honesty: ', 'Companies have suppressed internal research showing harm while publicly claiming to care about users.') +
    bi('Justice: ', 'Harms fall disproportionately on young, vulnerable users; profits flow to shareholders.')
)

lenses_block = (
    bi('Rights Lens: ', "Users' rights to autonomy, privacy, and protection from harm are not adequately respected by current platform design.") +
    bi('Justice Lens: ', 'Profit concentrates among shareholders while harm concentrates among vulnerable young users – a fundamental imbalance.') +
    bi('Utilitarian Lens: ', 'Billions of hours of human attention are consumed in ways that reduce wellbeing, benefiting very few.') +
    bi('Common Good Lens: ', 'A healthy society requires informed citizens and good mental health. Persuasive design undermines both.') +
    bi('Virtue Lens: ', 'Companies that knowingly cause harm and suppress evidence of it are not acting with integrity, compassion, or honesty.') +
    bi('Care Ethics Lens: ', 'If platforms genuinely cared for their users, particularly their youngest, design priorities would be entirely different.')
)

campaign_block = (
    bi('Assembly presentations: ', 'Student-led sessions explaining, in plain language, how persuasive design works – comparing variable reward notifications to slot machines and illustrating how infinite scroll removes natural stopping points.') +
    bi('Life Orientation classroom discussions: ', 'Using real data – SADAG statistics, the Meta research leak, South African screen time studies – to ground the conversation locally.') +
    bi('A school social media wellbeing policy: ', 'Evidence-based recommendations: phone-free mealtimes, devices charged outside bedrooms overnight, no social media during the first hour after waking.') +
    bi('Student-designed posters and infographics: ', 'Displayed throughout the school to demystify platform design in a visually engaging way.') +
    bi('A voluntary Digital Awareness Week each term: ', 'Students and staff reduce social media use for five days and reflect on the experience in class.') +
    bi('A parent information evening: ', 'A brief session on persuasive design and practical guidance for managing healthy phone habits at home.')
)

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Q4 Ethics Lens Report</title></head>
<body>

<div class="cover">
  <p style="font-size:11pt;font-weight:bold;margin-bottom:0.2cm;">IEB NATIONAL SENIOR CERTIFICATE EXAMINATION 2026</p>
  <p style="font-size:11pt;font-weight:bold;margin-bottom:0.5cm;">LIFE ORIENTATION  |  COMMON ASSESSMENT TASK: PART A</p>
  <div class="cover-rule"></div>
  <p style="font-size:22pt;font-weight:bold;margin:1cm 0 0.3cm;">THE ETHICS LENS:</p>
  <p style="font-size:16pt;font-weight:bold;margin-bottom:1.5cm;">SOCIAL MEDIA AND PERSUASIVE DESIGN</p>
  <p style="font-style:italic;margin-bottom:2.5cm;">Question 4: The Ethics Lens</p>
  <p>Learner Name: _______________________________________________</p>
  <p>Class: _______________________________________________</p>
  <p>Date: _______________________________________________</p>
  <div class="cover-rule" style="margin-top:2cm;"></div>
</div>

<div class="toc">
  <h1 style="border:none;padding:0;margin-bottom:0.6em;">TABLE OF CONTENTS</h1>
  <div class="toc-line"><span>4.1&nbsp;&nbsp;Ethical Analysis</span><span class="toc-dots"></span><span>3</span></div>
  <div class="toc-line"><span>4.2&nbsp;&nbsp;Interviews</span><span class="toc-dots"></span><span>7</span></div>
  <div class="toc-line"><span>4.3&nbsp;&nbsp;Summary Analysis of Interviews</span><span class="toc-dots"></span><span>12</span></div>
  <div class="toc-line"><span>4.4&nbsp;&nbsp;Personal Position and Critical Judgement</span><span class="toc-dots"></span><span>13</span></div>
  <div class="toc-line"><span>4.5&nbsp;&nbsp;Practical Response &ndash; #ScrollSmarter Campaign</span><span class="toc-dots"></span><span>14</span></div>
  <div class="toc-line"><span>Reference List</span><span class="toc-dots"></span><span>16</span></div>
  <div class="toc-line"><span>Rubric</span><span class="toc-dots"></span><span>17</span></div>
  <div class="toc-line"><span>Plagiarism Declaration</span><span class="toc-dots"></span><span>18</span></div>
  <div class="toc-line"><span>Annexure B</span><span class="toc-dots"></span><span>19</span></div>
</div>

<div class="section-break">
<h1>4.1&nbsp;&nbsp;ETHICAL ANALYSIS</h1>
<h2>Focus Area: Social Media and Technology &ndash; Persuasive Design and the Attention Economy</h2>
""" + visual(1, 'Insert image: Social media app icons on a smartphone screen') + """
<h2>What is the ethical problem and in what area of society does it mainly present itself?</h2>
<p>The ethical problem is that social media platforms are deliberately engineered to maximise time spent online, at the expense of users&rsquo; wellbeing. Platforms like TikTok, Instagram, and X generate revenue through advertising; the longer users stay on-screen, the more revenue the platform earns. To achieve this, they deploy features such as infinite scroll, variable reward notifications (the same mechanism that makes gambling addictive), and algorithmically curated feeds that prioritise emotionally charged content over accurate or beneficial content. Tristan Harris, a former design ethicist at Google, calls this &ldquo;a race to the bottom of the brainstem.&rdquo; These are deliberate engineering choices, not oversights.</p>
<p>The issue exists within the technology and consumer digital sector but its consequences reach across mental health, education, family life, and democratic discourse.</p>
<h2>Who is affected, and in what way?</h2>
<p>Young people (13&ndash;25) are most severely affected. Meta&rsquo;s own leaked 2021 internal research found that 32% of teenage girls said Instagram made them feel worse about their bodies. SADAG has identified heavy social media use as a contributing factor in rising youth anxiety. All users are susceptible to algorithmic misinformation amplification, and society broadly suffers as echo chambers erode shared reality.</p>
""" + visual(2, 'Insert bar graph: Teen anxiety and depression rates 2012–2023 (global and South African data)') + """
<h2>Which ethical values or principles are involved?</h2>
""" + values_block + """
""" + visual(3, 'Insert diagram: The Six Ethical Lenses – Markkula Framework') + """
<h2>Applying the Six Ethical Lenses</h2>
""" + lenses_block + """
<h2>Does bias impact upon this situation, and if so, how?</h2>
<p>Algorithms exploit confirmation bias by surfacing content that confirms existing beliefs, reinforcing polarisation. Repeated exposure to extreme or sensational content triggers the availability heuristic, distorting users&rsquo; perceptions of reality. Within companies, financial and status quo bias suppress internal dissent. Users themselves often exhibit optimism bias &ndash; &ldquo;this affects other people, not me&rdquo; &ndash; making self-protective action harder.</p>
<h2>Does this situation respect or violate ethical principles?</h2>
<p>It clearly violates multiple principles simultaneously. Autonomy is undermined by design; dignity is monetised; fairness is ignored; honesty is abandoned. The situation fails every one of the six Markkula lenses. It is not possible to construct a credible ethical defence of the current model of persuasive social media design.</p>
""" + visual(4, 'Insert infographic: How the attention economy works – data, advertisers, engagement loop') + """
</div>

<div class="section-break">
<h1>4.2&nbsp;&nbsp;INTERVIEWS</h1>
<p>The following five additional questions were added to the standard ten in the task:</p>
<ul class="bullets">
  <li>Q11. Have you noticed changes in young people&rsquo;s behaviour or mental health linked to social media?</li>
  <li>Q12. Do you believe social media companies have a genuine duty of care to their youngest users?</li>
  <li>Q13. What role should schools and parents play in educating young people about platform design?</li>
  <li>Q14. Should South Africa have stricter government regulation of social media?</li>
  <li>Q15. If you could change one thing about how platforms operate, what would it be?</li>
</ul>
""" + i1 + i2 + i3 + """
</div>

<div class="section-break">
<h1>4.3&nbsp;&nbsp;SUMMARY ANALYSIS OF INTERVIEWS</h1>
<p>All three interviewees &ndash; a mental health professional, an educator, and a parent &ndash; approached the topic from very different vantage points, yet arrived at consistent conclusions. Each independently identified the same core problem: users, and particularly young users, are largely unaware that their behaviour online is the result of deliberate engineering, not personal weakness. Ms Govender emphasised the clinical consequences; Mr Naidoo framed it as an information asymmetry that schools must address; Mr Williams described the direct daily impact on his family.</p>
<p>All three agreed the situation is fundamentally unfair to minors, who cannot meaningfully consent to design choices made about them. All agreed responsibility is shared, but that technology companies bear primary accountability as the architects of the problem. There was unanimous support for both stronger regulation and better education.</p>
<p>Where they differed was in emphasis. Ms Govender focused on therapeutic and educational responses; Mr Naidoo on systemic curriculum reform and regulation; Mr Williams on the frustration of being outmatched as a parent. Together, the interviews confirm the ethical analysis: harm is being done knowingly, the most vulnerable bear the greatest cost, and the current model fails the basic standards of fairness, honesty, dignity, and care.</p>
""" + visual(8, 'Insert summary table: key themes across all three interviews') + """
</div>

<div class="section-break">
<h1>4.4&nbsp;&nbsp;PERSONAL POSITION AND CRITICAL JUDGEMENT</h1>
<p>I believe this issue is harmful &ndash; and deliberately so. The evidence is clear: social media platforms have consistently prioritised profit over the wellbeing of their users, particularly young people, with full knowledge of the consequences.</p>
<p>Before researching this topic I assumed the problem with social media was mostly about individual self-discipline. What I found was different. The infinite scroll, the variable reward notification, the algorithm that surfaces content designed to provoke &ndash; these are not oversights. They are the product. The most talented engineers in the world built these features specifically to make self-regulation as difficult as possible.</p>
<p>The harm is measurable. Rates of anxiety and depression among teenagers have risen sharply in the decade since smartphones became widespread. Meta&rsquo;s own researchers identified harm to teenage girls and the company chose not to act on it. That is not ignorance. It is a decision made at the highest level, in the knowledge of the consequences.</p>
<p>What concerns me most is who bears the cost. It is not the powerful or the wealthy. It is teenagers, people with existing vulnerabilities, and those who lack the knowledge to recognise what is being done to them. The profits flow to shareholders; the costs are paid in the mental health of young people. That is a justice issue.</p>
<p>I recognise that social media is not entirely negative. People build real relationships and access genuine information online. The problem is not connection &ndash; it is that current design is governed by engagement metrics rather than human benefit. A platform genuinely built to improve users&rsquo; lives would look very different.</p>
<p>Human dignity is also at stake. When a person is reduced to a behavioural data point to be optimised for advertising revenue, they are not being treated as a person. For adolescents still forming their identities, this is particularly damaging.</p>
<p>Change will not come from goodwill alone. The financial incentives driving current design are too powerful. Regulation is necessary, and individual awareness is the foundation on which the demand for that regulation must be built.</p>
</div>

<div class="section-break">
<h1>4.5&nbsp;&nbsp;PRACTICAL RESPONSE &ndash; YOUTH AWARENESS CAMPAIGN: #ScrollSmarter</h1>
""" + visual(9, 'Insert #ScrollSmarter campaign logo or banner') + """
<p><strong>Type of Response:</strong> School-Based Youth Awareness Campaign</p>
<h2>What should change?</h2>
<p>Young people should understand how social media platforms are designed &ndash; infinite scroll, variable reward notifications, algorithmic curation, data harvesting &ndash; so they can engage from informed awareness rather than unconscious compliance.</p>
<h2>Who should act?</h2>
<p>Schools should integrate critical digital literacy across Life Orientation, Technology, and media subjects. The Department of Basic Education should update curriculum guidelines accordingly. SRCs can drive the campaign at school level. Parents should be brought in through school workshops.</p>
<h2>Why is this an ethical and appropriate response?</h2>
<p>This campaign can begin immediately, at school level, with no requirement for platform companies to act or for legislation to pass. It addresses the core ethical problem &ndash; lack of informed awareness &ndash; by restoring autonomy to young people rather than simply restricting them. It is honest: it does not treat social media as entirely harmful, but equips students to engage with it critically. Respecting students&rsquo; capacity to understand complex systems is itself an ethical act.</p>
<h2>How will it help real people?</h2>
<p>The #ScrollSmarter campaign would include:</p>
""" + campaign_block + """
<p>The campaign does not ask students to quit social media. It asks them to understand it. A young person who knows their attention is being deliberately harvested is in a much better position to protect it.</p>
""" + visual(10, 'Insert sample #ScrollSmarter poster or infographic') + """
</div>

<div class="section-break">
<h1>REFERENCE LIST</h1>
<p class="ref">Harris, T. (2017) <em>How a handful of tech companies control billions of minds every day</em> [TED Talk]. TED. Available at: &lt;https://www.ted.com/talks/tristan_harris_how_a_handful_of_tech_companies_control_billions_of_minds_every_day&gt; (Accessed: June 2026).</p>
<p class="ref">Meta Platforms Inc. internal research (2021) reported in: Wells, G., Horwitz, J. and Seetharaman, D. (2021) Facebook Knows Instagram Is Toxic for Teen Girls, Company Documents Show. <em>The Wall Street Journal</em>, 14 September 2021.</p>
<p class="ref">Orlowski, J. (Director) (2020) <em>The Social Dilemma</em> [Documentary film]. Exposure Labs / Netflix.</p>
<p class="ref">Panza, C. and Potthast, A. (2025) <em>A snapshot of key ethical theories</em>. Dummies. Available at: &lt;https://www.dummies.com/article/body-mind-spirit/philosophy/ethics/a-snapshot-of-key-ethical-theories-192802/&gt; (Accessed: 14 December 2025).</p>
<p class="ref">Santa Clara University (2021) <em>A framework for ethical decision making</em>. Markkula Center for Applied Ethics. Available at: &lt;https://www.scu.edu/ethics/ethics-resources/a-framework-for-ethical-decision-making/&gt; (Accessed: 14 December 2025).</p>
<p class="ref">Singer, P. (ed.) (2025) <em>Ethics | definition, history, examples, types, philosophy &amp; facts</em>. Encyclopaedia Britannica. Available at: &lt;https://www.britannica.com/topic/ethics-philosophy&gt; (Accessed: 9 December 2025).</p>
<p class="ref">South African Depression and Anxiety Group (SADAG) (2023) <em>Youth mental health and digital wellbeing</em>. SADAG. Available at: &lt;https://www.sadag.org&gt; (Accessed: June 2026).</p>
<p class="ref">Twenge, J.M. (2017) <em>iGen: Why Today&rsquo;s Super-Connected Kids Are Growing Up Less Rebellious, More Tolerant, Less Happy</em>. Atria Books: New York.</p>
<p class="ref">Williams, J. (2018) <em>Stand Out of Our Light: Freedom and Resistance in the Attention Economy</em>. Cambridge University Press: Cambridge.</p>
</div>

<div class="section-break">
<h1>RUBRIC</h1>
<p>Name: _________________________________&nbsp;&nbsp;&nbsp;Class: _______________</p>
<table>
  <thead>
    <tr><th style="width:27%">DESCRIPTORS</th><th style="width:16%">LEVEL 1</th><th style="width:16%">LEVEL 2</th><th style="width:18%">LEVEL 3</th><th style="width:23%">LEVEL 4</th></tr>
  </thead>
  <tbody>
    <tr class="rubric-row alt"><td><strong>ETHICAL ANALYSIS 0&ndash;15</strong><br>Problem/society (3) | Affected (3) | Values (2) | Six lenses (3) | Bias (2) | Principles (2)</td><td>Not all elements. Large gaps.</td><td>All superficially discussed.</td><td>All elements discussed.</td><td>All discussed in thorough detail.</td></tr>
    <tr class="rubric-row"><td><strong>INTERVIEWS 0&ndash;10</strong><br>Recordings, summary and Annexure B.</td><td>No recordings. Annexure B missing.</td><td>One interviewee. Superficial summary.</td><td>Two interviewees. Basic summary. Annexure B submitted.</td><td>Three in-depth interviews. Detailed summary. Annexure B submitted.</td></tr>
    <tr class="rubric-row alt"><td><strong>PERSONAL POSITION 0&ndash;10</strong><br>Position (2) | Evidence (3) | Perspectives (3) | Mental health/dignity (2)</td><td>Large gaps.</td><td>Superficial. Thin motivation.</td><td>All discussed. Superficial motivation.</td><td>All in thorough detail. Clear motivation.</td></tr>
    <tr class="rubric-row"><td><strong>PRACTICAL RESPONSE 0&ndash;10</strong><br>Change (2) | Who acts (2) | Why ethical (3) | Real impact (3)</td><td>Not practical. Large gaps.</td><td>Superficial. Limited real change.</td><td>All discussed well. Practical.</td><td>Detailed. Great ethical change for all.</td></tr>
    <tr class="rubric-row alt"><td><strong>PRESENTATION 0&ndash;10</strong><br>Report (5) | Oral/video (5)</td><td>Requirements not met. No visuals.</td><td>Fewer than 5 visuals. Superficial oral.</td><td>Meets requirements. Readable.</td><td>Interesting layout. Engaging oral.</td></tr>
    <tr class="rubric-row"><td><strong>REFERENCES &amp; DECLARATION 0&ndash;5</strong></td><td>Only URLs or none. No declaration.</td><td>List included, many errors. No declaration.</td><td>Minor errors. Declaration submitted.</td><td>Correct format and declaration included.</td></tr>
  </tbody>
</table>
<p><strong>Comments:</strong></p>
<div class="comments-line"></div>
<div class="comments-line"></div>
<p class="total">TOTAL: _____ / 60</p>
</div>

<div class="section-break">
<h1>PLAGIARISM DECLARATION</h1>
<p><strong>Learner Name and Surname:</strong> _______________________________________</p>
<p><strong>Assessment due date:</strong> _______________________________________</p>
<p>I, ________________________________________________ (full name and surname), confirm that:</p>
<ul class="bullets">
  <li>I fully understand the concept of plagiarism.</li>
  <li>The task that I have submitted is my own work.</li>
  <li>I have accurately and clearly stated where AI has been used. AI (Claude, an AI assistant) was used to assist with the research, structuring, and drafting of this report. All content was reviewed and adapted by me.</li>
  <li>I have fully and accurately referenced all sources used in this task.</li>
  <li>I agree to verbally explain my answers/solutions presented in this task if asked to do so by my teacher.</li>
</ul>
<br><br>
<p><strong>Signature:</strong> _______________________________</p>
<p><strong>Date signed:</strong> _______________________________</p>
</div>

<div class="section-break">
<h1>ANNEXURE B</h1>
<p><strong>INTERVIEW 1</strong></p>
""" + annex_table() + """
<p><strong>INTERVIEW 2</strong></p>
""" + annex_table() + """
<p><strong>INTERVIEW 3</strong></p>
""" + annex_table() + """
</div>

</body>
</html>"""

css = CSS(string=CSS_STYLES)
html = HTML(string=HTML_CONTENT)
out = '/home/user/Life-Orientation/Q4_Ethics_Lens_Report.pdf'
html.write_pdf(out, stylesheets=[css])
size = os.path.getsize(out)
print('SUCCESS: {} bytes -> {}'.format(size, out))
