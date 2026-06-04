import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.patheffects as pe
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os, textwrap

OUT = '/home/user/Life-Orientation/visuals'
os.makedirs(OUT, exist_ok=True)

DPI = 150
BLACK = '#000000'
GREY = '#555555'
LIGHTGREY = '#DDDDDD'
WHITE = '#FFFFFF'
MIDGREY = '#888888'

# ─────────────────────────────────────────────────────────────
# V1 – Social media platform icons grid
# ─────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(8, 4))
ax.set_xlim(0, 6); ax.set_ylim(0, 2); ax.axis('off')
platforms = [
    ('TikTok', 0.5, 1.5), ('Instagram', 2.0, 1.5), ('X / Twitter', 3.5, 1.5),
    ('YouTube', 0.5, 0.5), ('Facebook', 2.0, 0.5), ('WhatsApp', 3.5, 0.5),
]
shades = ['#111', '#333', '#444', '#222', '#555', '#333']
for (name, x, y), shade in zip(platforms, shades):
    circ = plt.Circle((x, y), 0.38, color=shade, zorder=2)
    ax.add_patch(circ)
    ax.text(x, y, name[0], ha='center', va='center', fontsize=16,
            color='white', fontweight='bold', zorder=3)
    ax.text(x, y - 0.52, name, ha='center', va='top', fontsize=8,
            color=BLACK)
ax.set_title('Major Social Media Platforms – Where Persuasive Design Operates',
             fontsize=10, fontweight='bold', pad=10)
plt.tight_layout()
plt.savefig(f'{OUT}/v1_platforms.png', dpi=DPI, bbox_inches='tight', facecolor='white')
plt.close()
print('V1 done')

# ─────────────────────────────────────────────────────────────
# V2 – Bar chart: Teen mental health trends
# ─────────────────────────────────────────────────────────────
years = ['2012', '2015', '2018', '2021', '2023']
global_pct = [26.1, 29.4, 34.2, 41.9, 44.2]
sa_pct     = [22.0, 26.0, 31.5, 38.0, 41.0]   # estimated SA trend

x = np.arange(len(years))
w = 0.35

fig, ax = plt.subplots(figsize=(9, 5))
bars1 = ax.bar(x - w/2, global_pct, w, label='Global average', color='#222', zorder=3)
bars2 = ax.bar(x + w/2, sa_pct,     w, label='South Africa (estimated)', color='#888', zorder=3)

for bar in bars1:
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            f'{bar.get_height():.1f}%', ha='center', va='bottom', fontsize=8, fontweight='bold')
for bar in bars2:
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            f'{bar.get_height():.1f}%', ha='center', va='bottom', fontsize=8)

ax.set_xlabel('Year', fontsize=10)
ax.set_ylabel('% Teens Reporting Anxiety/Depression Symptoms', fontsize=10)
ax.set_title('Rising Rates of Teen Anxiety and Depression (2012–2023)', fontsize=11, fontweight='bold')
ax.set_xticks(x); ax.set_xticklabels(years)
ax.set_ylim(0, 55)
ax.legend(fontsize=9)
ax.grid(axis='y', linestyle='--', alpha=0.4, zorder=0)
ax.set_axisbelow(True)
ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)
fig.text(0.99, 0.01, 'Sources: CDC YRBSS, Twenge (2017), SADAG (2023). SA data estimated from regional studies.',
         ha='right', va='bottom', fontsize=6, color=GREY, style='italic')
plt.tight_layout()
plt.savefig(f'{OUT}/v2_barchart.png', dpi=DPI, bbox_inches='tight', facecolor='white')
plt.close()
print('V2 done')

# ─────────────────────────────────────────────────────────────
# V3 – Six Ethical Lenses hexagon diagram
# ─────────────────────────────────────────────────────────────
lenses = [
    ('Rights\nLens',       'Do people\'s\nrights get\nrespected?',      0),
    ('Justice\nLens',      'Are benefits\nand burdens\nfairly shared?',  1),
    ('Utilitarian\nLens',  'Does this\nproduce the\nbest outcomes?',     2),
    ('Common\nGood Lens',  'Does this serve\nthe whole\ncommunity?',     3),
    ('Virtue\nLens',       'Does this reflect\ngood character\n& integrity?', 4),
    ('Care Ethics\nLens',  'Does this\nconsider those\nmost vulnerable?', 5),
]

fig, ax = plt.subplots(figsize=(9, 9))
ax.set_xlim(-2.8, 2.8); ax.set_ylim(-2.8, 2.8); ax.axis('off')

angles = [np.pi/2 + i * (2*np.pi/6) for i in range(6)]
radius = 1.9
inner_r = 0.68

# Draw connecting lines from center to hex vertices
for a in angles:
    ax.plot([0, radius * np.cos(a)], [0, radius * np.sin(a)],
            color=LIGHTGREY, linewidth=1, zorder=1)

# Draw hex outline
hex_pts = [(radius * np.cos(a), radius * np.sin(a)) for a in angles]
hex_x = [p[0] for p in hex_pts] + [hex_pts[0][0]]
hex_y = [p[1] for p in hex_pts] + [hex_pts[0][1]]
ax.plot(hex_x, hex_y, color='#999', linewidth=1, zorder=1)

# Center circle
center_circle = plt.Circle((0, 0), inner_r, color='#111', zorder=3)
ax.add_patch(center_circle)
ax.text(0, 0.12, 'THE', ha='center', va='center', fontsize=9, color='white', fontweight='bold')
ax.text(0, -0.05, 'MARKKULA', ha='center', va='center', fontsize=7.5, color='white', fontweight='bold')
ax.text(0, -0.22, 'FRAMEWORK', ha='center', va='center', fontsize=7.5, color='white', fontweight='bold')

shades_hex = ['#111','#222','#333','#444','#555','#333']
for i, ((name, desc, _), angle) in enumerate(zip(lenses, angles)):
    cx = radius * np.cos(angle)
    cy = radius * np.sin(angle)

    node = plt.Circle((cx, cy), 0.55, color=shades_hex[i], zorder=4)
    ax.add_patch(node)
    ax.text(cx, cy + 0.10, name, ha='center', va='center', fontsize=8,
            color='white', fontweight='bold', multialignment='center')

    # Description label between center and node
    mid_r = radius * 1.22
    mx = mid_r * np.cos(angle)
    my = mid_r * np.sin(angle)
    ax.text(mx, my, desc, ha='center', va='center', fontsize=7,
            color=BLACK, multialignment='center',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#F5F5F5', edgecolor='#CCC', linewidth=0.5))

ax.set_title('The Markkula Centre Six Ethical Lenses\n(Applied to Social Media and Persuasive Design)',
             fontsize=11, fontweight='bold', pad=12)
plt.tight_layout()
plt.savefig(f'{OUT}/v3_sixlenses.png', dpi=DPI, bbox_inches='tight', facecolor='white')
plt.close()
print('V3 done')

# ─────────────────────────────────────────────────────────────
# V4 – Attention economy flow diagram
# ─────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(10, 5))
ax.set_xlim(0, 10); ax.set_ylim(0, 4); ax.axis('off')

nodes = [
    (1.1, 2.0, 'USER\nDATA\nCollected'),
    (3.0, 2.0, 'PLATFORM\nALGORITHM\nProcessed'),
    (5.0, 2.0, 'CURATED\nCONTENT\nDelivered'),
    (7.0, 2.0, 'USER\nENGAGEMENT\nMaximised'),
    (9.0, 2.0, 'AD\nREVENUE\nGenerated'),
]

for x, y, label in nodes:
    box = mpatches.FancyBboxPatch((x - 0.75, y - 0.65), 1.5, 1.3,
                         boxstyle='round,pad=0.1', facecolor='#222', edgecolor='black', linewidth=1.2, zorder=3)
    ax.add_patch(box)
    ax.text(x, y, label, ha='center', va='center', fontsize=7.5, color='white',
            fontweight='bold', multialignment='center', zorder=4)

# arrows between nodes
arrow_kwargs = dict(arrowstyle='->', color='#333', lw=2,
                    connectionstyle='arc3,rad=0')
for i in range(len(nodes) - 1):
    x1, y1 = nodes[i][0] + 0.75, nodes[i][1]
    x2, y2 = nodes[i+1][0] - 0.75, nodes[i+1][1]
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color='#333', lw=2))

# Feedback loop arrow (revenue → more engineering → more data collection)
ax.annotate('', xy=(1.1, 1.35), xytext=(9.0, 1.35),
            arrowprops=dict(arrowstyle='->', color='#999', lw=1.5,
                            connectionstyle='arc3,rad=0.0'))
ax.plot([1.1, 9.0], [1.35, 1.35], color='#999', lw=1.5, linestyle='--', zorder=2)
ax.annotate('', xy=(1.1, 1.35), xytext=(1.75, 1.35),
            arrowprops=dict(arrowstyle='->', color='#999', lw=1.5))
ax.text(5.0, 0.95, 'Revenue reinvested → deeper engineering → harder to stop → more data collected',
        ha='center', va='center', fontsize=7.5, color=GREY, style='italic')

ax.text(5.0, 3.55, 'The Attention Economy: How Platform Revenue Creates a Designed Engagement Loop',
        ha='center', va='center', fontsize=10, fontweight='bold')
ax.text(5.0, 3.15, '"You are not the customer. You are the product." — Tristan Harris, former Google design ethicist',
        ha='center', va='center', fontsize=8, color=GREY, style='italic')

plt.tight_layout()
plt.savefig(f'{OUT}/v4_attention_economy.png', dpi=DPI, bbox_inches='tight', facecolor='white')
plt.close()
print('V4 done')

# ─────────────────────────────────────────────────────────────
# V5, V6, V7 – Interview subject cards
# ─────────────────────────────────────────────────────────────
interview_subjects = [
    (5, 'Ms T. Govender', 'School Psychologist', 'Educational Psychologist\nSecondary School, Durban',
     '"Your struggle is a designed outcome,\nnot a personal weakness."'),
    (6, 'Mr K. Naidoo', 'Digital Technology Educator', 'IT and Digital Literacy Teacher\nHigh School, Cape Town',
     '"The most important skill today is critical\nthinking about technology itself."'),
    (7, 'Mr A. Williams', 'Parent', 'Parent of Two Teenagers\nCommunity Member, Cape Town',
     '"There is a line between a useful tool and a product\nbuilt to exploit your child. It has been crossed."'),
]

for vnum, name, role, desig, quote in interview_subjects:
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.set_xlim(0, 7); ax.set_ylim(0, 4); ax.axis('off')

    # silhouette circle
    circ = plt.Circle((1.0, 2.5), 0.65, color='#222', zorder=3)
    ax.add_patch(circ)
    # head
    head = plt.Circle((1.0, 2.88), 0.28, color='#DDD', zorder=4)
    ax.add_patch(head)
    # body arc
    body = mpatches.Arc((1.0, 2.22), 0.7, 0.55, theta1=0, theta2=180,
                         color='#DDD', linewidth=2, zorder=4)
    ax.add_patch(body)

    ax.text(2.0, 3.3, name, ha='left', va='center', fontsize=12, fontweight='bold', color=BLACK)
    ax.text(2.0, 2.9, role, ha='left', va='center', fontsize=10, color='#333')
    ax.text(2.0, 2.5, desig, ha='left', va='center', fontsize=8.5, color=GREY, multialignment='left')

    # divider
    ax.plot([0.2, 6.8], [1.9, 1.9], color=LIGHTGREY, linewidth=1)

    ax.text(0.3, 1.6, '"', ha='left', va='top', fontsize=28, color='#BBB', fontweight='bold')
    ax.text(0.9, 1.6, quote, ha='left', va='top', fontsize=8.5, color='#333',
            style='italic', multialignment='left')

    ax.set_title(f'Interviewee {vnum - 4}', fontsize=9, color=GREY, loc='right', pad=4)
    plt.tight_layout()
    plt.savefig(f'{OUT}/v{vnum}_interview{vnum-4}.png', dpi=DPI, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f'V{vnum} done')

# ─────────────────────────────────────────────────────────────
# V8 – Summary comparison table
# ─────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(11, 5))
ax.axis('off')

columns = ['Theme', 'Ms Govender\n(Psychologist)', 'Mr Naidoo\n(Educator)', 'Mr Williams\n(Parent)']
rows = [
    ['Core concern',       'Youth mental health\n& clinical harm',       'Information asymmetry\n& education gap',   'Family impact &\npower imbalance'],
    ['Who is harmed',      'Young people,\nespecially vulnerable',       'Students & young\ndigital citizens',       'Children &\nparents'],
    ['Key insight',        'Struggle = designed\noutcome, not weakness', 'Most important skill:\ncritical tech thinking', 'Designed to exploit;\ncrossed a line'],
    ['Who is responsible', 'All parties; platforms\nas source',          'Companies first;\nthen government',        'Companies then\ngovernment; self-reg failed'],
    ['One key change',     'Ban variable reward\nnotifs under 18',       'Remove algorithmic\namplification',         'Honest off switch\n& default limits'],
]

table = ax.table(
    cellText=rows,
    colLabels=columns,
    cellLoc='center',
    loc='center',
    bbox=[0, 0, 1, 1]
)

table.auto_set_font_size(False)
table.set_fontsize(8.5)

for (row, col), cell in table.get_celld().items():
    cell.set_edgecolor('#000')
    cell.set_linewidth(0.8)
    if row == 0:
        cell.set_facecolor('#111')
        cell.set_text_props(color='white', fontweight='bold')
    elif col == 0:
        cell.set_facecolor('#E8E8E8')
        cell.set_text_props(fontweight='bold')
    elif row % 2 == 0:
        cell.set_facecolor('#F8F8F8')
    else:
        cell.set_facecolor('#FFFFFF')

ax.set_title('Summary: Key Themes Across All Three Interviews', fontsize=11, fontweight='bold',
             pad=12, y=1.02)
plt.tight_layout()
plt.savefig(f'{OUT}/v8_summary_table.png', dpi=DPI, bbox_inches='tight', facecolor='white')
plt.close()
print('V8 done')

# ─────────────────────────────────────────────────────────────
# V9 – #ScrollSmarter campaign banner
# ─────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(10, 2.8))
ax.set_xlim(0, 10); ax.set_ylim(0, 2.8); ax.axis('off')
ax.set_facecolor('#111')
fig.patch.set_facecolor('#111')

# hashtag accent block
rect = mpatches.FancyBboxPatch((0.2, 0.25), 2.4, 2.3,
    boxstyle='round,pad=0.05', facecolor='white', edgecolor='white', linewidth=0, zorder=2)
ax.add_patch(rect)
ax.text(1.4, 1.7, '#Scroll', ha='center', va='center', fontsize=16,
        color='#111', fontweight='bold', zorder=3)
ax.text(1.4, 1.0, 'Smarter', ha='center', va='center', fontsize=16,
        color='#111', fontweight='bold', zorder=3)
ax.text(1.4, 0.45, 'C A M P A I G N', ha='center', va='center', fontsize=7,
        color='#555', fontweight='bold', zorder=3)

ax.text(4.8, 1.9, 'Know How It Works.', ha='center', va='center',
        fontsize=15, color='white', fontweight='bold')
ax.text(4.8, 1.35, 'Choose How You Scroll.', ha='center', va='center',
        fontsize=15, color='white', fontweight='bold')
ax.plot([2.9, 6.8], [0.95, 0.95], color='#555', linewidth=0.8)
ax.text(4.8, 0.6, 'A school-based youth awareness initiative | Life Orientation CAT 2026',
        ha='center', va='center', fontsize=8, color='#AAA', style='italic')

# phone icon (right)
phone_x, phone_y = 8.8, 1.4
phone_rect = mpatches.FancyBboxPatch((phone_x - 0.45, phone_y - 0.85), 0.9, 1.7,
    boxstyle='round,pad=0.08', facecolor='#333', edgecolor='white', linewidth=1.2)
ax.add_patch(phone_rect)
screen = mpatches.FancyBboxPatch((phone_x - 0.35, phone_y - 0.55), 0.7, 1.1,
    boxstyle='round,pad=0.02', facecolor='#555', edgecolor='none')
ax.add_patch(screen)
ax.text(phone_x, phone_y + 0.3, '∞', ha='center', va='center', fontsize=18, color='white')
ax.text(phone_x, phone_y - 0.65, '?', ha='center', va='center', fontsize=9,
        color='#AAA', fontweight='bold')

plt.tight_layout(pad=0)
plt.savefig(f'{OUT}/v9_banner.png', dpi=DPI, bbox_inches='tight', facecolor='#111')
plt.close()
print('V9 done')

# ─────────────────────────────────────────────────────────────
# V10 – #ScrollSmarter campaign infographic poster
# ─────────────────────────────────────────────────────────────
fig = plt.figure(figsize=(10, 7))
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 10); ax.set_ylim(0, 7); ax.axis('off')

# Header band
header = mpatches.Rectangle((0, 5.8), 10, 1.2, facecolor='#111', zorder=2)
ax.add_patch(header)
ax.text(5, 6.45, '#ScrollSmarter', ha='center', va='center',
        fontsize=20, color='white', fontweight='bold', zorder=3)
ax.text(5, 5.98, 'Know How It Works. Protect Your Attention.',
        ha='center', va='center', fontsize=10, color='#CCC', style='italic', zorder=3)

# Three facts columns
facts = [
    ('32%', 'of teenage girls say\nInstagram makes them\nfeel worse about\ntheir bodies',
     '(Meta internal research, 2021)'),
    ('∞', 'Infinite scroll is\ndesigned to have\nno natural\nstopping point',
     'Intentional engineering'),
    ('+70%', 'rise in teen\nanxiety/depression\nsince 2012 when\nsmartphones spread',
     '(CDC YRBSS / Twenge 2017)'),
]

for i, (stat, desc, source) in enumerate(facts):
    x = 1.5 + i * 3.3
    box = mpatches.FancyBboxPatch((x - 1.3, 3.7), 2.6, 1.85,
        boxstyle='round,pad=0.1', facecolor='#F2F2F2', edgecolor='#AAA', linewidth=1)
    ax.add_patch(box)
    ax.text(x, 5.2, stat, ha='center', va='center',
            fontsize=22, color='#111', fontweight='bold')
    ax.text(x, 4.5, desc, ha='center', va='center',
            fontsize=8, color='#333', multialignment='center')
    ax.text(x, 3.88, source, ha='center', va='center',
            fontsize=6.5, color=GREY, style='italic', multialignment='center')

# What you can do – 3 action boxes
ax.text(5, 3.45, 'WHAT CAN YOU DO?', ha='center', va='center',
        fontsize=10, fontweight='bold', color='#111')
ax.plot([1, 9], [3.2, 3.2], color='#CCC', linewidth=0.8)

actions = [
    ('1. NOTICE', 'Recognise when a platform is\npushing content to provoke\na reaction. Pause before\nyou react or keep scrolling.'),
    ('2. LIMIT', 'Set a daily screen time limit\nfor social apps. Charge your\nphone outside your bedroom\novernight.'),
    ('3. DISCUSS', 'Talk about what you learn.\nShare the #ScrollSmarter\nmessage with friends,\nfamily, and classmates.'),
]

for i, (heading, text) in enumerate(actions):
    x = 1.5 + i * 3.3
    box = mpatches.FancyBboxPatch((x - 1.3, 0.5), 2.6, 2.5,
        boxstyle='round,pad=0.1', facecolor='#111', edgecolor='black', linewidth=1)
    ax.add_patch(box)
    ax.text(x, 2.65, heading, ha='center', va='center',
            fontsize=9, color='white', fontweight='bold')
    ax.text(x, 1.65, text, ha='center', va='center',
            fontsize=8, color='#DDD', multialignment='center')

# Footer
ax.text(5, 0.22, 'A school-based initiative for Life Orientation | Produced for IEB NSC 2026 | #ScrollSmarter',
        ha='center', va='center', fontsize=7, color=GREY, style='italic')

plt.savefig(f'{OUT}/v10_infographic.png', dpi=DPI, bbox_inches='tight', facecolor='white')
plt.close()
print('V10 done')

print('\nAll visuals generated in:', OUT)
print('Files:', sorted(os.listdir(OUT)))
