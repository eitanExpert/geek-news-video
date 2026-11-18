// Input props sent by the n8n pipeline. Times are in seconds from the start of the voice-over.

export type Word = { text: string; start: number; end: number };

export type Media = {
  kind: 'video' | 'image';
  src: string;
  // Optional credit shown small in the corner (e.g. "Pexels / Jane Doe")
  credit?: string;
};

type SceneBase = {
  start: number;
  end: number;
  // Background footage or image behind the scene (optional; animated backdrop otherwise)
  media?: Media;
  // Accent colour override for this scene
  accent?: string;
};

export type HookScene = SceneBase & { type: 'hook'; kicker?: string; title: string };
export type KineticScene = SceneBase & { type: 'kinetic'; lines: string[]; highlight?: string[] };
export type PhoneScene = SceneBase & {
  type: 'phone';
  // Items in the menu that slides up after tapping the "more" button
  menu: string[];
  // The menu item that gets tapped
  select: string;
  // Short label shown in a pill after the tap
  result?: string;
};
export type StatScene = SceneBase & {
  type: 'stat';
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};
export type CountdownScene = SceneBase & { type: 'countdown'; seconds: number; label: string };
export type VersusScene = SceneBase & {
  type: 'versus';
  left: { title: string; sub?: string };
  right: { title: string; sub?: string };
  // Which side is the "new / better" one
  winner?: 'left' | 'right';
};
export type ListScene = SceneBase & { type: 'list'; title?: string; items: string[]; style?: 'chips' | 'checks' };
export type BrollScene = SceneBase & { type: 'broll'; tag?: string };
export type QuoteScene = SceneBase & { type: 'quote'; text: string; source: string };
export type OutroScene = SceneBase & { type: 'outro'; question: string; cta?: string };

export type Scene =
  | HookScene
  | KineticScene
  | PhoneScene
  | StatScene
  | CountdownScene
  | VersusScene
  | ListScene
  | BrollScene
  | QuoteScene
  | OutroScene;

export type VideoProps = {
  audioUrl: string;
  durationSec: number;
  words: Word[];
  scenes: Scene[];
  musicUrl?: string;
  musicVolume?: number;
  brand?: string;
  // Small source line shown at the end, e.g. "Source: The Verge"
  sourceLine?: string;
  sfx?: boolean;
};
