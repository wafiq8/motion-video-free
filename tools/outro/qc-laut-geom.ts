// Ekspor pose kapal, permukaan ombak, matahari per frame → JSON untuk QC (node --experimental-strip-types)
import * as G from '../../src/outro/laut-geom.ts';
const freeze = process.argv[2] === 'qc';
const rows = [];
for (let f = 0; f < 195; f++) {
  const p = G.shipPose(f, freeze);
  rows.push({f, ship: p, surf: G.waveY(G.FRONT, p.x, f), sunY: G.sunY(f), sailL: f >= G.T.sailL, sailR: f >= G.T.sailR});
}
console.log(JSON.stringify({SHIP_S: G.SHIP_S, HULL_BOTTOM: G.HULL_BOTTOM, SUN_R: G.SUN_R, LOCK_S: G.LOCK_S, WORD_LEFT: G.WORD_LEFT, WORD_TOP: G.WORD_TOP, WORD_BBOX: G.WORD_BBOX, T: G.T, rows}));
