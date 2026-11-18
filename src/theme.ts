import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

const anton = loadAnton('normal', { weights: ['400'], subsets: ['latin'] });
const inter = loadInter('normal', { weights: ['600', '800', '900'], subsets: ['latin'] });

export const FONT_DISPLAY = `${anton.fontFamily}, Impact, sans-serif`;
export const FONT_UI = `${inter.fontFamily}, Arial, sans-serif`;

export const COLORS = {
  bg: '#07070C',
  ink: '#FFFFFF',
  accent: '#FFD400',
  hot: '#FF2E63',
  cyan: '#00E5FF',
  green: '#22E07A',
  panel: 'rgba(16,16,28,0.82)',
};

// Rotating accent per scene so consecutive scenes feel different
export const SCENE_ACCENTS = ['#FFD400', '#FF2E63', '#00E5FF', '#22E07A', '#B26BFF', '#FF8A00'];

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
