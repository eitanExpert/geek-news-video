import React from 'react';
import { Scene } from '../types';
import { SceneLibrary } from './index';

// Picks the right scene component for a scene type
export const SceneSwitch: React.FC<{ scene: Scene; accent: string; durationInFrames: number; brand: string; sourceLine?: string }> = ({ scene, accent, durationInFrames, brand, sourceLine }) => {
  switch (scene.type) {
    case 'hook':
      return <SceneLibrary.HookScene scene={scene} accent={accent} />;
    case 'kinetic':
      return <SceneLibrary.KineticScene scene={scene} accent={accent} durationInFrames={durationInFrames} />;
    case 'phone':
      return <SceneLibrary.PhoneScene scene={scene} accent={accent} durationInFrames={durationInFrames} />;
    case 'stat':
      return <SceneLibrary.StatScene scene={scene} accent={accent} durationInFrames={durationInFrames} />;
    case 'countdown':
      return <SceneLibrary.CountdownScene scene={scene} accent={accent} durationInFrames={durationInFrames} />;
    case 'versus':
      return <SceneLibrary.VersusScene scene={scene} accent={accent} durationInFrames={durationInFrames} />;
    case 'list':
      return <SceneLibrary.ListScene scene={scene} accent={accent} durationInFrames={durationInFrames} />;
    case 'broll':
      return <SceneLibrary.BrollScene scene={scene} accent={accent} />;
    case 'quote':
      return <SceneLibrary.QuoteScene scene={scene} accent={accent} durationInFrames={durationInFrames} />;
    case 'outro':
      return <SceneLibrary.OutroScene scene={scene} accent={accent} brand={brand} sourceLine={sourceLine} />;
    default:
      return null;
  }
};
