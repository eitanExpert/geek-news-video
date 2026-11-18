import React from 'react';
import { Composition } from 'remotion';
import { GeekNews } from './GeekNews';
import { FPS, HEIGHT, WIDTH } from './theme';
import { VideoProps } from './types';
import sample from '../sample-props.json';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="GeekNews"
    component={GeekNews as unknown as React.FC<Record<string, unknown>>}
    durationInFrames={FPS * 30}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={sample as unknown as Record<string, unknown>}
    calculateMetadata={({ props }) => {
      const p = props as unknown as VideoProps;
      const sec = Math.max(3, Math.min(90, Number(p.durationSec) || 30));
      return { durationInFrames: Math.ceil((sec + 0.5) * FPS) };
    }}
  />
);
