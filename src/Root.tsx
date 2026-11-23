import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import tl from '../docs/timeline.json';

export const FPS = 30;
export const TOTAL_FRAMES = Math.round(tl.total_duration_s * FPS);

export const Root: React.FC = () => (
  <Composition id="Berita" component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
);
