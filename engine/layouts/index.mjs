const CONTENT = { x: 120, y: 124, w: 900, h: 500 };

function columns(count, gap = 18, frame = CONTENT) {
  const width = (frame.w - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, index) => ({
    x: frame.x + index * (width + gap), y: frame.y, w: width, h: frame.h,
  }));
}

function rows(count, gap = 16, frame = CONTENT) {
  const height = (frame.h - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, index) => ({
    x: frame.x, y: frame.y + index * (height + gap), w: frame.w, h: height,
  }));
}

export const layoutPatterns = {
  L21_COMPETITOR_VISUAL_3COL: () => ({cards: columns(3,16,{x:120,y:145,w:900,h:420}),insight:{x:120,y:578,w:900,h:46}}),
  L01_TITLE_TEXT: () => ({ body: { x: 120, y: 150, w: 820, h: 380 }, insight: { x: 120, y: 548, w: 900, h: 70 } }),
  L02_HERO_INSIGHT: () => ({ hero: { x: 150, y: 170, w: 860, h: 230 }, support: { x: 200, y: 430, w: 760, h: 145 } }),
  L03_BIG_NUMBER: ({ itemCount = 3 } = {}) => ({ metrics: columns(Math.min(3, Math.max(1, itemCount)), 28, { x: 120, y: 175, w: 900, h: 250 }), insight: { x: 120, y: 470, w: 900, h: 115 } }),
  L04_TWO_COLUMN: () => ({ columns: columns(2, 28), left: columns(2, 28)[0], right: columns(2, 28)[1] }),
  L05_THREE_COLUMN: () => ({ columns: columns(3, 20) }),
  L06_FOUR_CARDS: () => ({ cards: columns(4, 16) }),
  L07_IMAGE_TEXT: () => ({ image: { x: 120, y: 140, w: 470, h: 430 }, text: { x: 620, y: 150, w: 452, h: 405 } }),
  L08_COMPETITOR_3COL: () => ({ cards: columns(3, 16, { x: 120, y: 145, w: 900, h: 420 }), insight: { x: 120, y: 578, w: 900, h: 46 } }),
  L09_COMPETITOR_4COL: () => ({ cards: columns(4, 14, { x: 120, y: 145, w: 900, h: 420 }), insight: { x: 120, y: 578, w: 900, h: 46 } }),
  L10_COMPARISON_TABLE: () => ({ table: { x: 120, y: 145, w: 900, h: 390 }, insight: { x: 120, y: 550, w: 900, h: 72 } }),
  L11_CHART_INSIGHT: () => ({ chart: { x: 120, y: 150, w: 610, h: 420 }, insight: { x: 752, y: 158, w: 268, h: 235 }, metric: { x: 752, y: 415, w: 268, h: 145 } }),
  L12_2X2_MATRIX: () => ({ matrix: { x: 135, y: 150, w: 650, h: 430 }, insight: { x: 810, y: 170, w: 210, h: 330 } }),
  L13_FUNNEL: () => ({ funnel: { x: 180, y: 155, w: 620, h: 420 }, insight: { x: 830, y: 175, w: 242, h: 300 } }),
  L14_PYRAMID: () => ({ pyramid: { x: 180, y: 150, w: 620, h: 420 }, insight: { x: 830, y: 180, w: 242, h: 280 } }),
  L15_STRATEGY_HOUSE: () => ({ house: { x: 145, y: 145, w: 680, h: 440 }, explanation: { x: 850, y: 160, w: 170, h: 360 } }),
  L16_ARCHITECTURE: () => ({ architecture: { x: 130, y: 142, w: 880, h: 445 } }),
  L17_USER_JOURNEY: () => ({ journey: { x: 120, y: 145, w: 900, h: 420 }, insight: { x: 120, y: 578, w: 900, h: 46 } }),
  L18_TIMELINE: () => ({ timeline: { x: 130, y: 190, w: 930, h: 310 }, insight: { x: 170, y: 530, w: 850, h: 80 } }),
  L19_ROADMAP: () => ({ roadmap: { x: 120, y: 150, w: 900, h: 410 }, insight: { x: 120, y: 575, w: 900, h: 49 } }),
  L20_EXECUTIVE_SUMMARY: () => ({ headline: { x: 120, y: 145, w: 900, h: 105 }, columns: columns(3, 20, { x: 120, y: 282, w: 900, h: 240 }), decision: { x: 120, y: 550, w: 900, h: 72 } }),
};

export function resolveLayoutFrames(layoutId, context = {}) {
  const fn = layoutPatterns[layoutId];
  if (!fn) throw new Error(`Unknown content layout: ${layoutId}`);
  return fn(context);
}

export { CONTENT, columns, rows };
