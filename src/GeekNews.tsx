import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from 'remotion';
import { Backdrop, MediaLayer } from './components/Backdrop';
import { Captions } from './components/Captions';
import { Finish, TopBar } from './components/Overlays';
import { CutFlash, ENTRANCES, SceneShell } from './components/SceneShell';
import { SceneSwitch } from './scenes/switch';
import { SCENE_ACCENTS } from './theme';
import { Scene, VideoProps } from './types';

// Make scenes contiguous: each scene runs until the next one starts; the last one runs to the end
export const normalizeScenes = (scenes: Scene[], durationSec: number): Scene[] => {
  const sorted = [...scenes].filter((s) => s && typeof s.start === 'number').sort((a, b) => a.start - b.start);
  return sorted.map((s, i) => ({ ...s, start: i === 0 ? 0 : s.start, end: i + 1 < sorted.length ? sorted[i + 1].start : durationSec }));
};

export const GeekNews: React.FC<VideoProps> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const brand = props.brand || 'GEEK NEWS';
  const total = durationInFrames / fps;
  const scenes = normalizeScenes(props.scenes || [], total);
  const sfx = props.sfx !== false;
  const toF = (s: number) => Math.max(0, Math.round(s * fps));
  return (
    <AbsoluteFill style={{ background: '#06060B' }}>
      {scenes.map((scene, i) => {
        const from = toF(scene.start);
        const dur = Math.max(1, toF(scene.end) - from);
        const accent = scene.accent || SCENE_ACCENTS[i % SCENE_ACCENTS.length];
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`${i + 1}. ${scene.type}`}>
            <SceneShell entrance={i === 0 ? 'zoom' : ENTRANCES[i % ENTRANCES.length]} seed={i + 1}>
              {scene.media ? <MediaLayer media={scene.media} accent={accent} durationInFrames={dur} seed={i} /> : <Backdrop accent={accent} seed={i + 1} />}
              <SceneSwitch scene={scene} accent={accent} durationInFrames={dur} brand={brand} sourceLine={props.sourceLine} />
            </SceneShell>
            {i > 0 ? <CutFlash /> : null}
          </Sequence>
        );
      })}

      <Captions words={props.words || []} accent={SCENE_ACCENTS[0]} />
      <TopBar brand={brand} accent={SCENE_ACCENTS[0]} />
      <Finish />

      <Audio src={props.audioUrl} />
      {props.musicUrl ? (
        <Audio
          src={props.musicUrl}
          loop
          volume={(f) => interpolate(f, [0, 15, durationInFrames - 30, durationInFrames], [0, props.musicVolume ?? 0.12, props.musicVolume ?? 0.12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      ) : null}
      {sfx
        ? scenes.map((scene, i) => (
            <Sequence key={'sfx' + i} from={Math.max(0, toF(scene.start) - 4)} durationInFrames={Math.round(fps * 1.2)}>
              <Audio src={staticFile(i === 0 ? 'sfx/hit.wav' : 'sfx/whoosh.wav')} volume={i === 0 ? 0.55 : 0.4} />
            </Sequence>
          ))
        : null}
    </AbsoluteFill>
  );
};
