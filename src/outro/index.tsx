import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {OutroBasabasi} from './OutroBasabasi';

const fontLoaded = (async () => {
  const f = new FontFace('InterOutro', `url(${staticFile('fonts/inter-latin-800-normal.woff2')}) format('woff2')`, {weight: '800'});
  await f.load();
  document.fonts.add(f);
})();

export const OutroComp: React.FC<{muted?: boolean}> = (p) => {
  const [h] = useState(() => delayRender('font-outro'));
  useEffect(() => {
    fontLoaded.then(() => continueRender(h));
  }, [h]);
  return <OutroBasabasi {...p} />;
};
