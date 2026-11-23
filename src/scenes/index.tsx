import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {C, FONT} from '../theme';
import {Appear, Chip, Cross, FotoBulat, FotoKredit, Headline, Pop, Check, fitSize, prog} from '../components/ui';
import {Bendera, Dokumen, Jeruji, Kalender, Lencana, Palu, Sadap, Siluet, Timbangan, Uang} from '../components/icons';

// Produksi "Mantan Kapolri Tersangka Makar" (Mode D, 23/11/2026).
// Semua waktu = detik absolut dari docs/words.json (timestamp Whisper per kata).

type SceneDef = {Comp: React.FC<{t: number}>; sitasi: string};
const Col: React.FC<{top?: number; gap?: number; children: React.ReactNode}> = ({top = 380, gap = 36, children}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>{children}</div>
);
const lerp = (t: number, a: number, b: number, x: number, y: number) =>
  interpolate(t, [a, b], [x, y], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const count = (t: number, a: number, b: number, to: number) => Math.round(lerp(t, a, b, 0, to));

const SRC = 'sumber: konferensi pers Bareskrim Polri, 23/11/2026 (via detik, ANTARA)';
const KR_LISTYO = 'foto Listyo: BPMI Setpres (2026) · Wikimedia Commons (domain publik)';

/** Label kejujuran sementara (chip) */
const Label: React.FC<{t: number; a: number; b: number; text: string; color?: string}> = ({t, a, b, text, color = C.accent}) => {
  const o = Math.min(prog(t, a, 0.25), 1 - prog(t, b - 0.25, 0.25));
  return <div style={{opacity: o}}><Chip text={text} color={color} /></div>;
};

/** KartuFoto (v3.5): foto ber-watermark UTUH — object-fit contain, Ken Burns pada skala kartu */
const KartuFoto: React.FC<{t: number; a: number; b: number; src: string; w: number; h: number; top: number}> = ({t, a, b, src, w, h, top}) => {
  const k = lerp(t, a, b, 1.0, 1.05);
  return (
    <div style={{position: 'absolute', top, left: (1080 - w) / 2, width: w, height: h, borderRadius: 18, overflow: 'hidden', border: `4px solid ${C.white}`, boxShadow: '0 16px 40px rgba(0,0,0,0.5)', transform: `scale(${k})`, opacity: prog(t, a, 0.3)}}>
      <Img src={staticFile(`foto/${src}`)} style={{width: '100%', height: '100%', objectFit: 'contain', background: '#000'}} />
    </div>
  );
};

// ---------- S1 KartuHook: mantan Kapolri → tersangka makar ----------
const S1: React.FC<{t: number}> = ({t}) => (
  <Col top={390} gap={26}>
    <Pop t={t} at={0.0}><Chip text="MANTAN KAPOLRI" color={C.teal} style={{fontSize: 34}} /></Pop>
    <div style={{position: 'relative', width: 400, height: 460, transform: `rotate(${2 * Math.sin(t * 1.3)}deg)`}}>
      <Pop t={t} at={0.1}><Lencana size={400} /></Pop>
      <div style={{position: 'absolute', right: -70, top: -10}}>
        <Cross size={210} p={prog(t, 2.96, 0.4)} />
      </div>
    </div>
    <Appear t={t} at={0.15}>
      <Headline lines={[[{text: 'TERSANGKA'}], [{text: 'MAKAR', accent: true}]]} max={150} />
    </Appear>
    <Appear t={t} at={3.9}>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 38, color: C.dim, textAlign: 'center'}}>terhadap presiden yang pernah ia layani</div>
    </Appear>
  </Col>
);

// ---------- S2 Kartu tersangka: Listyo + 5 perwira aktif ----------
const PERWIRA = [
  {pangkat: 'IRJEN', nama: ['Slamet', 'Uliandi']},
  {pangkat: 'IRJEN', nama: ['Eko Hadi', 'Santoso']},
  {pangkat: 'IRJEN', nama: ['Ahrie Sonta', 'Nasution']},
  {pangkat: 'BRIGJEN', nama: ['Tedjo', 'Kusumo']},
  {pangkat: 'KOMBES', nama: ['Iman', 'Imanuddin']},
];
const KartuPerwira: React.FC<{t: number; at: number; p: (typeof PERWIRA)[number]}> = ({t, at, p}) => {
  const size = fitSize(p.nama, 800, 34, 260);
  return (
    <Pop t={t} at={at}>
      <div style={{width: 300, height: 200, borderRadius: 20, background: C.card, border: `3px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', boxSizing: 'border-box'}}>
        <div style={{flexShrink: 0}}><Siluet size={86} /></div>
        <div style={{fontFamily: FONT, color: C.white}}>
          <div style={{fontWeight: 800, fontSize: 24, letterSpacing: '0.12em', color: C.accent}}>{p.pangkat}</div>
          {p.nama.map((n) => <div key={n} style={{fontWeight: 800, fontSize: Math.min(size, 32), lineHeight: 1.12, whiteSpace: 'nowrap'}}>{n}</div>)}
        </div>
      </div>
    </Pop>
  );
};
const S2: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <Col top={385} gap={0}>
      <Appear t={t} at={5.94}><Chip text="SENIN MALAM, 23/11/2026" color={C.teal} /></Appear>
      <Appear t={t} at={8.3}>
        <div style={{marginTop: 14}}><Headline lines={[[{text: 'BARESKRIM TETAPKAN '}, {text: '6', accent: true}, {text: ' TERSANGKA'}]]} max={66} /></div>
      </Appear>
    </Col>
    {/* Listyo */}
    <div style={{position: 'absolute', top: 540, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <Appear t={t} at={9.52}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, background: C.white, borderRadius: 160, padding: '14px 46px 14px 14px', boxShadow: '0 12px 34px rgba(0,0,0,0.45)'}}>
          <FotoBulat src="listyo-ksp-2026.jpg" size={250} t={t} a={9.52} b={13.92} pos="50% 30%" ring={C.accent} />
          <div style={{fontFamily: FONT, color: C.bg}}>
            <div style={{fontWeight: 800, fontSize: 28, letterSpacing: '0.1em', color: C.accent}}>JENDERAL (PURN.)</div>
            <div style={{fontWeight: 900, fontSize: 56, lineHeight: 1.02}}>LISTYO SIGIT</div>
            <div style={{fontWeight: 900, fontSize: 56, lineHeight: 1.02}}>PRABOWO</div>
            <div style={{fontWeight: 700, fontSize: 28, marginTop: 6}}>mantan Kapolri</div>
          </div>
        </div>
      </Appear>
    </div>
    {/* 5 perwira aktif */}
    <div style={{position: 'absolute', top: 860, left: 0, right: 0, textAlign: 'center', opacity: prog(t, 12.0)}}>
      <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.white}}>+ 5 PERWIRA <span style={{color: C.accent}}>AKTIF</span></span>
    </div>
    <div style={{position: 'absolute', top: 936, left: 0, right: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18, padding: '0 40px'}}>
      {PERWIRA.map((p, i) => <KartuPerwira key={i} t={t} at={12.46 + i * 0.16} p={p} />)}
    </div>
    {t >= 12.46 && (
      <div style={{position: 'absolute', top: 1360, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 20, color: C.dim}}>
        siluet = ilustrasi, foto resmi 5 perwira tidak tersedia
      </div>
    )}
    {t >= 9.52 && <FotoKredit text={KR_LISTYO} />}
  </AbsoluteFill>
);

// ---------- S3 FotoBeat (KartuFoto): konferensi pers, pengembangan kasus penyadapan ----------
const S3: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <Col top={400} gap={0}>
      <Appear t={t} at={13.92}>
        <Headline lines={[[{text: 'PENGEMBANGAN KASUS'}], [{text: 'PENYADAPAN', accent: true}, {text: ' PRESIDEN'}]]} max={80} />
      </Appear>
    </Col>
    <KartuFoto t={t} a={13.92} b={18.96} src="detik-konpers-wide-20261123.jpg" w={960} h={540} top={620} />
    <div style={{position: 'absolute', top: 1196, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: prog(t, 16.0)}}>
      <Sadap size={110} wave={(t * 0.8) % 1} />
      <div style={{fontFamily: FONT, color: C.white}}>
        <div style={{fontWeight: 800, fontSize: 36}}>Konferensi pers Bareskrim</div>
        <div style={{fontWeight: 600, fontSize: 30, color: C.dim}}>Jakarta, Senin malam 23/11/2026</div>
      </div>
    </div>
    <FotoKredit text="foto: detikcom (23/11/2026)" />
  </AbsoluteFill>
);

// ---------- S4 ScenePenjelasan: 3 tahap versi penyidik ----------
const Node: React.FC<{t: number; at: number; n: number; title: string; children?: React.ReactNode}> = ({t, at, n, title, children}) => {
  const p = prog(t, at, 0.35);
  return (
    <div style={{display: 'flex', gap: 28, opacity: 0.15 + 0.85 * p, transform: `translateX(${(1 - p) * 40}px)`}}>
      <div style={{width: 84, height: 84, borderRadius: '50%', background: p > 0.5 ? C.accent : C.card, border: `4px solid ${C.white}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 48, color: C.white, transform: `scale(${t >= at ? 1 + 0.12 * Math.max(0, 1 - (t - at) * 3) : 1})`}}>{n}</div>
      <div style={{fontFamily: FONT, color: C.white, paddingTop: 4}}>
        <div style={{fontWeight: 800, fontSize: 26, letterSpacing: '0.14em', color: C.dim}}>TAHAP {n}</div>
        <div style={{fontWeight: 900, fontSize: 46, lineHeight: 1.1}}>{title}</div>
        {children}
      </div>
    </div>
  );
};
const S4: React.FC<{t: number}> = ({t}) => {
  const line = lerp(t, 22.14, 36.2, 0, 1);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 372, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16}}>
        <Label t={t} a={18.96} b={38.34} text="VERSI PENYIDIK" color={C.teal} />
        <Label t={t} a={18.96} b={38.34} text="BELUM TERBUKTI" />
      </div>
      <Col top={448} gap={0}>
        <Appear t={t} at={19.6}>
          <Headline lines={[[{text: 'RENCANA '}, {text: '3 TAHAP', accent: true}]]} max={84} />
        </Appear>
      </Col>
      {/* garis waktu digambar progresif */}
      <div style={{position: 'absolute', left: 120, top: 620, width: 8, height: 640, borderRadius: 4, background: C.line}} />
      <div style={{position: 'absolute', left: 120, top: 620, width: 8, height: 640 * line, borderRadius: 4, background: C.accent}} />
      <div style={{position: 'absolute', left: 82, top: 600, right: 40, display: 'flex', flexDirection: 'column', gap: 34}}>
        <Node t={t} at={22.14} n={1} title="Rapat pemufakatan">
          <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 14}}>
            <Pop t={t} at={24.34}><Kalender w={150} hari="KAMIS" tgl="3" bulan="OKT 2024" /></Pop>
            <div style={{opacity: prog(t, 25.72), fontWeight: 700, fontSize: 30, color: C.dim, width: 300, lineHeight: 1.2}}>sebelum presiden terpilih dilantik</div>
          </div>
          <div style={{display: 'flex', gap: 26, marginTop: 18}}>
            {[
              {at: 29.38, label: ['ANALISIS', 'POLITIK'], band: C.teal},
              {at: 30.78, label: ['ANALISIS', 'PEMAKZULAN'], band: C.accent},
            ].map((d) => (
              <Pop key={d.at} t={t} at={d.at}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  <Dokumen size={70} band={d.band} />
                  <div style={{fontWeight: 800, fontSize: 24, lineHeight: 1.15}}>{d.label.map((l) => <div key={l}>{l}</div>)}</div>
                </div>
              </Pop>
            ))}
          </div>
        </Node>
        <Node t={t} at={32.34} n={2} title="Penyadapan tokoh yang dipetakan">
          <div style={{marginTop: 6, opacity: prog(t, 33.32)}}><Sadap size={84} wave={(t * 0.8) % 1} /></div>
        </Node>
        <Node t={t} at={35.64} n={3} title="Permulaan pelaksanaan">
          <div style={{marginTop: 6, opacity: prog(t, 36.72)}}><Bendera size={80} /></div>
        </Node>
      </div>
    </AbsoluteFill>
  );
};

// ---------- S5 Parafrase motif — menurut Kabareskrim ----------
const S5: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <KartuFoto t={t} a={38.34} b={46.58} src="antara-asep-konpers-20261123.jpg" w={780} h={520} top={400} />
    <div style={{position: 'absolute', top: 936, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, opacity: prog(t, 39.58)}}>
      <div style={{fontWeight: 800, fontSize: 26, letterSpacing: '0.14em', color: C.teal}}>MENURUT KABARESKRIM</div>
      <div style={{fontWeight: 900, fontSize: 40, color: C.white}}>Komjen Asep Safrudin <span style={{fontWeight: 600, fontSize: 28, color: C.dim}}>(tengah)</span></div>
    </div>
    <div style={{position: 'absolute', top: 1044, left: 70, right: 70, fontFamily: FONT, color: C.white, display: 'flex', flexDirection: 'column', gap: 14}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{fontWeight: 900, fontSize: 30, letterSpacing: '0.12em', color: C.dim}}>MOTIF</div>
        <Label t={t} a={38.34} b={46.58} text="BELUM TERBUKTI" />
      </div>
      {[
        {at: 40.3, txt: <>Mempertahankan <span style={{color: C.accent}}>jabatan Kapolri</span></>},
        {at: 42.34, txt: <>demi konstelasi politik</>},
        {at: 43.88, txt: <>melemahkan kepercayaan publik pada pemerintah</>},
      ].map((r) => (
        <Appear key={r.at} t={t} at={r.at} dy={24}>
          <div style={{fontWeight: 800, fontSize: 38, lineHeight: 1.15, borderLeft: `6px solid ${C.teal}`, paddingLeft: 18}}>{r.txt}</div>
        </Appear>
      ))}
    </div>
    <FotoKredit text="foto: ANTARA/Nadia Putri Rahmani (23/11/2026)" />
  </AbsoluteFill>
);

// ---------- S6 Pasal makar & ancaman ----------
const Ancaman: React.FC<{t: number; at: number; icon: React.ReactNode; text: string; hot?: boolean}> = ({t, at, icon, text, hot}) => (
  <Appear t={t} at={at} dy={50}>
    <div style={{width: 860, height: 150, borderRadius: 24, background: hot ? C.accent : C.card, border: `3px solid ${hot ? C.accent : C.line}`, display: 'flex', alignItems: 'center', gap: 34, padding: '0 40px', boxSizing: 'border-box', boxShadow: '0 10px 28px rgba(0,0,0,0.35)'}}>
      {icon}
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.white}}>{text}</div>
    </div>
  </Appear>
);
const S6: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <Col top={392} gap={18}>
      <Appear t={t} at={46.58}>
        <Headline lines={[[{text: 'DIJERAT PASAL '}, {text: 'MAKAR', accent: true}]]} max={86} />
      </Appear>
      <Appear t={t} at={47.6}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.dim}}>Pasal 191, 193, 196 KUHP (menurut penyidik)</div>
      </Appear>
      <Appear t={t} at={48.92}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 32, letterSpacing: '0.16em', color: C.white, marginTop: 30}}>ANCAMAN HUKUMAN</div>
      </Appear>
    </Col>
    <Col top={760} gap={30}>
      <Ancaman t={t} at={49.66} icon={<Palu size={96} />} text="PIDANA MATI" hot />
      <Ancaman t={t} at={50.66} icon={<Jeruji size={96} />} text="SEUMUR HIDUP" />
      <Ancaman t={t} at={52.06} icon={<Jeruji size={96} />} text={`${count(t, 52.1, 52.9, 20)} TAHUN PENJARA`} />
    </Col>
  </AbsoluteFill>
);

// ---------- S7 CounterIkon: 71 saksi + Rp735 juta ----------
const S7: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <div style={{position: 'absolute', top: 388, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 34}}>
      <div style={{display: 'flex', flexWrap: 'wrap', width: 300, gap: 6}}>
        {Array.from({length: 15}).map((_, i) => (
          <div key={i} style={{opacity: prog(t, 54.4 + i * 0.07, 0.2)}}><Siluet size={54} color={i < Math.ceil(count(t, 54.66, 55.72, 71) / 4.8) ? C.teal : C.line} /></div>
        ))}
      </div>
      <div style={{fontFamily: FONT, color: C.white}}>
        <div style={{fontWeight: 900, fontSize: 150, lineHeight: 1, color: C.accent, opacity: prog(t, 54.66, 0.2)}}>{count(t, 54.66, 55.72, 71)}</div>
        <div style={{fontWeight: 800, fontSize: 40}}>SAKSI DIPERIKSA</div>
      </div>
    </div>
    <KartuFoto t={t} a={56.74} b={60.24} src="detik-barangbukti-20261123.jpg" w={800} h={450} top={660} />
    <div style={{position: 'absolute', top: 1148, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, opacity: prog(t, 57.26)}}>
      <Uang size={150} />
      <div style={{fontFamily: FONT, color: C.white}}>
        <div style={{fontWeight: 900, fontSize: 96, lineHeight: 1}}>Rp<span style={{color: C.accent}}>{count(t, 58.0, 58.9, 735)}</span> JUTA</div>
        <div style={{fontWeight: 800, fontSize: 32}}>UANG TUNAI DISITA</div>
      </div>
    </div>
    {t >= 56.74 && <FotoKredit text="foto barang bukti: detikcom (23/11/2026)" />}
  </AbsoluteFill>
);

// ---------- S8 Status bukti: masih dugaan, praduga tak bersalah ----------
const S8: React.FC<{t: number}> = ({t}) => {
  const st = prog(t, 63.9, 0.18);
  return (
    <AbsoluteFill>
      <Col top={400} gap={20}>
        <Appear t={t} at={60.24}>
          <Headline lines={[[{text: 'SEMUA INI MASIH'}], [{text: 'DUGAAN', accent: true}]]} max={110} />
        </Appear>
      </Col>
      <div style={{position: 'absolute', top: 720, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{opacity: st, transform: `rotate(-7deg) scale(${t < 63.9 ? 1.6 : 1.6 - 0.6 * st})`, border: `8px solid ${C.accent}`, borderRadius: 18, padding: '18px 36px', fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.accent, textAlign: 'center', lineHeight: 1.05, letterSpacing: '0.04em'}}>
          BELUM ADA<br />PUTUSAN PENGADILAN
        </div>
      </div>
      <div style={{position: 'absolute', top: 1040, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Appear t={t} at={66.04}>
          <div style={{display: 'flex', alignItems: 'center', gap: 22, background: C.card, border: `3px solid ${C.teal}`, borderRadius: 26, padding: '18px 34px'}}>
            <Timbangan size={130} tilt={6 * Math.sin(t * 1.6)} />
            <div style={{fontFamily: FONT, color: C.white}}>
              <div style={{fontWeight: 800, fontSize: 28, color: C.teal, letterSpacing: '0.1em'}}>PARA TERSANGKA BERHAK ATAS</div>
              <div style={{fontWeight: 900, fontSize: 52}}>PRADUGA TAK BERSALAH</div>
            </div>
            <Check size={70} p={prog(t, 67.6, 0.4)} />
          </div>
        </Appear>
      </div>
    </AbsoluteFill>
  );
};

// ---------- S9 PenutupDampak: pertanyaan terbuka ----------
const S9: React.FC<{t: number}> = ({t}) => (
  <Col top={410} gap={40}>
    <Appear t={t} at={68.3}>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.dim, textAlign: 'center', width: 900}}>tuduhan seberat ini, diarahkan ke mantan pimpinan polisi tertinggi</div>
    </Appear>
    <div style={{position: 'relative', transform: `scale(${1 + 0.03 * Math.sin(t * 1.4)})`}}>
      <Pop t={t} at={69.0}><Lencana size={300} color={C.card} /></Pop>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 200, color: C.accent, opacity: prog(t, 73.7)}}>?</div>
    </div>
    <Appear t={t} at={73.7}>
      <Headline lines={[[{text: 'APA YANG '}, {text: 'SEBENARNYA', accent: true}], [{text: 'TERJADI DI DALAM'}], [{text: 'INSTITUSI ITU?'}]]} max={84} />
    </Appear>
  </Col>
);

export const SCENES: SceneDef[] = [
  {Comp: S1, sitasi: SRC},
  {Comp: S2, sitasi: 'sumber: Bareskrim Polri 23/11/2026 (via detik, Liputan6, Bisnis)'},
  {Comp: S3, sitasi: 'sumber: Bareskrim Polri 23/11/2026 (via detik, ANTARA)'},
  {Comp: S4, sitasi: 'sumber: keterangan penyidik Bareskrim, 23/11/2026 (via detik, ANTARA)'},
  {Comp: S5, sitasi: 'sumber: Kabareskrim, konferensi pers 23/11/2026 (via ANTARA, detik)'},
  {Comp: S6, sitasi: 'sumber: Bareskrim Polri 23/11/2026 (via detik)'},
  {Comp: S7, sitasi: 'sumber: Bareskrim Polri 23/11/2026 (via detik)'},
  {Comp: S8, sitasi: 'sumber: status perkara per 23/11/2026 — tahap penyidikan'},
  {Comp: S9, sitasi: 'sumber: Bareskrim Polri · detik · ANTARA · Liputan6 · Bisnis (23/11/2026)'},
];
