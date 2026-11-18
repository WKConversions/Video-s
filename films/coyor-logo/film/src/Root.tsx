import React from 'react';
import {Composition} from 'remotion';
import {Logo} from './Logo';
export const Root: React.FC = () => (
  <>
    <Composition id="CyLogoV" component={Logo} durationInFrames={180} fps={60} width={1080} height={1920} defaultProps={{finalW: 520}} />
    <Composition id="CyLogoSq" component={Logo} durationInFrames={180} fps={60} width={1080} height={1080} defaultProps={{finalW: 420}} />
  </>
);
