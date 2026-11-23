import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {C, FONT} from '../theme';
import {Appear, Check, Chip, Cross, Foto, FotoBulat, FotoKredit, Headline, Pop, prog} from '../components/ui';
import {Amplop, GedungParlemen, Jam, Kalender, Kursi, Pin, Siluet, Surat} from '../components/icons';

type SceneDef = {Comp: React.FC<{t: number}>; sitasi: string};
const Col: React.FC<{top?: number; gap?: number; children: React.ReactNode}> = ({top = 380, gap = 36, children}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>{children}</div>
);

const SRC_USULAN = 'sumber: CNN Indonesia, Kompas, ANTARA (23/11/2026)';
const KR_AMRAN = 'foto arsip 2014: Pemprov Banten · Wikimedia Commons (domain publik)';
const KR_SUGI = 'foto 2024: Kemlu RI · Wikimedia Commons (domain publik)';

// ---------- S1 KartuHook: 12 NOV + kursi kosong ----------
const S1: React.FC<{t: number}> = ({t}) => (
  <Col top={400} gap={30}>
    <Pop t={t} at={0.0}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 250, lineHeight: 1, color: C.white, letterSpacing: '-0.03em'}}>12 NOV</div>
    </Pop>
    <div style={{position: 'relative', width: 380, height: 380}}>
      <Pop t={t} at={0.15}><Kursi size={380} /></Pop>
      <div style={{position: 'absolute', right: -40, top: -20}}>
        <Cross size={190} p={prog(t, 0.98, 0.4)} />
      </div>
    </div>
    <Appear t={t} at={0.2}>
      <Headline lines={[[{text: 'KURSI WAPRES '}, {text: 'KOSONG', accent: true}]]} max={92} />
    </Appear>
  </Col>
);

// ---------- S2 Amplop dibuka ----------
const S2: React.FC<{t: number}> = ({t}) => {
  const open = prog(t, 5.0, 0.6);
  const letter = prog(t, 5.84, 0.5);
  return (
    <Col top={400} gap={40}>
      <Appear t={t} at={2.9}>
        <Headline lines={[[{text: 'HARI INI'}], [{text: 'AMPLOP '}, {text: 'DIBUKA', accent: true}]]} max={110} />
      </Appear>
      <div style={{marginTop: 120}}>
        <Pop t={t} at={3.94}><Amplop w={640} open={open} letter={letter} /></Pop>
      </div>
    </Col>
  );
};

// ---------- S3 PetaLokator: Senin sore, Gedung MPR Senayan ----------
const S3: React.FC<{t: number}> = ({t}) => {
  const pinIn = prog(t, 12.14, 0.4);
  return (
    <AbsoluteFill>
      <Col top={380} gap={22}>
        <Appear t={t} at={6.46}><Chip text="SENIN SORE" color={C.teal} /></Appear>
        <Appear t={t} at={7.52}>
          <Headline lines={[[{text: '23 NOVEMBER '}, {text: '2026', accent: true}]]} max={96} />
        </Appear>
      </Col>
      {/* peta ilustrasi */}
      <div style={{position: 'absolute', top: 640, left: 90, width: 900, height: 640, opacity: prog(t, 6.6, 0.5)}}>
        <svg width="900" height="640" viewBox="0 0 900 640">
          <path d="M120 80 L420 40 L700 70 L830 180 L800 400 L700 560 L420 600 L180 560 L70 400 L60 200 Z" fill={C.bg2} stroke={C.line} strokeWidth="4" />
          <path d="M300 150 L560 130 L660 260 L600 440 L380 470 L250 360 Z" fill={C.card} stroke={C.accent} strokeWidth="5" opacity={0.4 + 0.6 * pinIn} />
          {[160, 260, 360, 460].map((y) => <line key={y} x1="70" y1={y} x2="830" y2={y + 30} stroke={C.line} strokeWidth="3" opacity="0.6" />)}
          {[250, 450, 650].map((x) => <line key={x} x1={x} y1="50" x2={x - 40} y2="590" stroke={C.line} strokeWidth="3" opacity="0.6" />)}
        </svg>
        <div style={{position: 'absolute', left: 400, top: 150, transform: `translateY(${(1 - pinIn) * -80}px)`, opacity: pinIn}}>
          <Pin size={110} />
        </div>
        <div style={{position: 'absolute', left: 230, top: 310, opacity: prog(t, 12.3), transform: `scale(${0.8 + 0.2 * prog(t, 12.3)})`}}>
          <div style={{background: C.white, borderRadius: 18, padding: '16px 26px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 10px 30px rgba(0,0,0,0.4)'}}>
            <GedungParlemen w={120} />
            <div style={{fontFamily: FONT, color: C.bg}}>
              <div style={{fontWeight: 900, fontSize: 40}}>GEDUNG MPR</div>
              <div style={{fontWeight: 700, fontSize: 28}}>Senayan, Jakarta</div>
            </div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, bottom: -6}}><Chip text="PETA ILUSTRASI, TIDAK BERSKALA" color={C.dim} style={{fontSize: 22}} /></div>
      </div>
      {/* Presiden Prabowo datang */}
      <div style={{position: 'absolute', top: 640, right: 70, opacity: prog(t, 10.16), transform: `translateX(${(1 - prog(t, 10.16)) * 60}px)`}}>
        <FotoBulat src="prabowo.jpg" size={240} t={t} a={10.16} b={13.62} pos="50% 18%" />
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.white, textAlign: 'center', marginTop: 8}}>PRESIDEN</div>
      </div>
      {t >= 10.16 && <FotoKredit bawah text="foto: Kemensetneg (2024) · Wikimedia Commons (domain publik)" />}
    </AbsoluteFill>
  );
};

// ---------- S4 FotoBeat: pukul 16.48, surat ke Ketua MPR ----------
const S4: React.FC<{t: number}> = ({t}) => {
  const move = prog(t, 15.92, 0.9);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: 0.55}}><Foto src="paripurna.jpg" pos="70% 50%" t={t} a={13.62} b={19.42} origin="65% 40%" /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,22,48,0.6), rgba(10,22,48,0.2) 40%, rgba(10,22,48,0.7))'}} />
      <FotoKredit text="foto arsip 20/10/2024: Setkab RI · Wikimedia Commons (domain publik)" />
      <div style={{position: 'absolute', top: 410, left: 54}}><Chip text="FOTO ARSIP 2024" color={C.white} style={{fontSize: 22}} /></div>
      <Col top={520} gap={20}>
        <Pop t={t} at={13.62}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28, background: 'rgba(10,22,48,0.85)', borderRadius: 28, padding: '22px 40px'}}>
            <Jam size={130} h={16} m={48} />
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, color: C.white, lineHeight: 1}}>
              16.<span style={{color: C.accent}}>48</span>
            </div>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.white}}>WIB</div>
          </div>
        </Pop>
      </Col>
      {/* surat bergerak ke Ketua MPR */}
      <div style={{position: 'absolute', top: 900, left: 120 + move * 520, opacity: prog(t, 15.7, 0.25) * (1 - prog(t, 17.3, 0.3))}}>
        <Surat size={140} />
      </div>
      <div style={{position: 'absolute', top: 880, left: 90, opacity: prog(t, 15.6)}}>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.white, background: 'rgba(10,22,48,0.8)', padding: '10px 18px', borderRadius: 12}}>SURAT USULAN</div>
      </div>
      {t >= 17.44 && <FotoKredit bawah text="foto Ahmad Muzani: KPU RI (2023) · Wikimedia Commons (domain publik)" />}
      <div style={{position: 'absolute', top: 1080, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Appear t={t} at={17.44}>
          <div style={{display: 'flex', alignItems: 'center', gap: 26, background: C.white, borderRadius: 120, padding: '14px 40px 14px 14px', fontFamily: FONT, color: C.bg}}>
            <FotoBulat src="muzani-2024.jpg" size={190} t={t} a={17.44} b={19.42} pos="50% 22%" ring={C.teal} />
            <div>
              <div style={{fontWeight: 700, fontSize: 30, letterSpacing: '0.1em'}}>DITERIMA KETUA MPR</div>
              <div style={{fontWeight: 900, fontSize: 56}}>AHMAD MUZANI</div>
            </div>
          </div>
        </Appear>
      </div>
    </AbsoluteFill>
  );
};

// ---------- S5 Dua nama ----------
const KartuCalon: React.FC<{t: number; at: number; no: string; foto: string; pos: string; nama: string[]; jabatan: string[]; jabAt: number; color: string}> = ({t, at, no, foto, pos, nama, jabatan, jabAt, color}) => (
  <Appear t={t} at={at} dy={60}>
    <div style={{width: 960, height: 400, background: C.card, borderRadius: 28, display: 'flex', alignItems: 'center', overflow: 'hidden', border: `3px solid ${color}`}}>
      <div style={{width: 340, height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <FotoBulat src={foto} size={300} t={t} a={at} b={29.32} pos={pos} ring={color} />
        <div style={{position: 'absolute', top: 26, left: 26, width: 70, height: 70, borderRadius: 35, background: color, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{no}</div>
      </div>
      <div style={{flex: 1, padding: '34px 34px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18}}>
        <Headline lines={nama.map((n) => [{text: n}])} max={58} width={580} align="left" />
        <div style={{opacity: prog(t, jabAt), fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.dim, lineHeight: 1.3}}>
          {jabatan.map((j, i) => <div key={i}>{j}</div>)}
        </div>
      </div>
    </div>
  </Appear>
);
const S5: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <Col top={370} gap={26}>
      <Pop t={t} at={19.42}>
        <Headline lines={[[{text: 'ISINYA '}, {text: '2', accent: true}, {text: ' NAMA'}]]} max={100} />
      </Pop>
      <KartuCalon t={t} at={21.04} no="1" foto="amran.jpg" pos="50% 20%" nama={['ANDI AMRAN', 'SULAIMAN']} jabatan={['Menteri Pertanian']} jabAt={23.4} color={C.teal} />
      <KartuCalon t={t} at={24.5} no="2" foto="sugiono.jpg" pos="50% 25%" nama={['SUGIONO']} jabatan={['Menko PMK', 'Sekjen Gerindra']} jabAt={26.18} color={C.teal} />
    </Col>
    {t >= 21.04 && <FotoKredit bawah text={t < 24.5 ? KR_AMRAN : `${KR_AMRAN.split(' · ')[0]}; ${KR_SUGI}`} />}
  </AbsoluteFill>
);

// ---------- S6 Dasco tidak ada ----------
const S6: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
  <Col top={420} gap={40}>
    <Appear t={t} at={29.32}>
      <Headline lines={[[{text: 'RAMAI DIGADANG-GADANG'}]]} max={64} weight={800} />
    </Appear>
    <div style={{position: 'relative'}}>
      <Pop t={t} at={29.98}>
        <div style={{width: 640, background: C.card, borderRadius: 28, padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, border: `3px solid ${C.line}`}}>
          <FotoBulat src="dasco-2024.jpg" size={300} t={t} a={29.98} b={33.0} pos="45% 30%" ring={C.line} />
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.white}}>DASCO</div>
        </div>
      </Pop>
      {/* stempel vonis di sudut kartu — tidak menutupi wajah */}
      <div style={{position: 'absolute', right: -60, top: -50, opacity: prog(t, 32.28, 0.15), transform: `rotate(-12deg) scale(${t < 32.28 ? 1.4 : 1.4 - 0.4 * prog(t, 32.28, 0.25)})`}}>
        <div style={{width: 230, height: 230, borderRadius: '50%', border: `10px solid ${C.accent}`, background: 'rgba(10,22,48,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Cross size={150} p={prog(t, 32.28, 0.4)} />
        </div>
      </div>
    </div>
    <Appear t={t} at={32.28}>
      <Headline lines={[[{text: 'TIDAK ', accent: true}, {text: 'ADA DI SURAT'}]]} max={80} />
    </Appear>
  </Col>
  {t >= 29.98 && <FotoKredit bawah text="foto: DPR RI (2024) · Wikimedia Commons (domain publik)" />}
  </AbsoluteFill>
);

// ---------- S7 Pasal 8 ayat 2 ----------
const Panah: React.FC<{p: number}> = ({p}) => (
  <svg width="60" height="70" viewBox="0 0 60 70" style={{opacity: p}}>
    <line x1="30" y1="0" x2="30" y2={52 * p} stroke={C.dim} strokeWidth="8" strokeLinecap="round" />
    {p > 0.9 && <path d="M12 44 L30 66 L48 44" fill="none" stroke={C.dim} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);
const Langkah: React.FC<{t: number; at: number; icon: React.ReactNode; text: React.ReactNode}> = ({t, at, icon, text}) => (
  <Appear t={t} at={at} dy={30}>
    <div style={{width: 940, display: 'flex', alignItems: 'center', gap: 30, background: C.card, borderRadius: 26, padding: '30px 34px'}}>
      <div style={{width: 120, display: 'flex', justifyContent: 'center'}}>{icon}</div>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.white}}>{text}</div>
    </div>
  </Appear>
);
const S7: React.FC<{t: number}> = ({t}) => {
  const qOut = prog(t, 34.2, 0.3);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 600, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 1 - qOut}}>
        <Pop t={t} at={33.0}>
          <Headline lines={[[{text: 'KENAPA HARUS'}], [{text: '2', accent: true}, {text: ' NAMA?'}]]} max={120} />
        </Pop>
      </div>
      {t >= 34.2 && (
        <Col top={400} gap={16}>
          <Appear t={t} at={34.38}>
            <div style={{background: C.white, color: C.bg, borderRadius: 18, padding: '14px 32px', fontFamily: FONT, fontWeight: 900, fontSize: 52, marginBottom: 24}}>
              PASAL 8 AYAT 2 <span style={{color: C.accent}}>UUD 1945</span>
            </div>
          </Appear>
          <Langkah t={t} at={39.38} icon={<Kursi size={100} color={C.accent} />} text="Kursi wapres kosong" />
          <Panah p={prog(t, 40.9, 0.3)} />
          <Langkah t={t} at={41.18} icon={<div style={{display: 'flex'}}><Siluet size={60} color={C.teal} /><Siluet size={60} color={C.teal} /></div>} text={<>Presiden usul <span style={{color: C.teal}}>2 calon</span></>} />
          <Panah p={prog(t, 42.9, 0.3)} />
          <Langkah t={t} at={43.12} icon={<GedungParlemen w={110} />} text={<>MPR pilih <span style={{color: C.teal}}>1</span> di paripurna</>} />
        </Col>
      )}
    </AbsoluteFill>
  );
};

// ---------- S8 Mahfud: hari kerja, bukan kalender ----------
const S8: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
  <Col top={380} gap={26}>
    <Appear t={t} at={46.06}>
      <Headline lines={[[{text: 'JADWAL '}, {text: 'DIGUGAT', accent: true}]]} max={110} />
    </Appear>
    <Appear t={t} at={47.86}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
        <FotoBulat src="mahfud.png" size={130} t={t} a={47.86} b={54.26} pos="50% 25%" ring={C.teal} />
        <div style={{fontFamily: FONT}}>
          <Chip text="MENURUT MAHFUD MD" color={C.teal} style={{fontSize: 30}} />
          <div style={{fontWeight: 700, fontSize: 26, color: C.dim, marginTop: 8}}>Pakar hukum tata negara · parafrase</div>
        </div>
      </div>
    </Appear>
    <Appear t={t} at={50.18}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, color: C.white, lineHeight: 1}}>14 HARI</div>
    </Appear>
    <div style={{display: 'flex', gap: 30, marginTop: 10}}>
      {[
        {label: 'HARI KERJA', ok: true, at: 51.9},
        {label: 'HARI KALENDER', ok: false, at: 52.9},
      ].map((b) => (
        <Pop key={b.label} t={t} at={b.at}>
          <div style={{width: 440, height: 300, borderRadius: 28, background: C.card, border: `4px solid ${b.ok ? C.teal : C.accent}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
            {b.ok ? <Check size={130} p={prog(t, b.at + 0.1, 0.4)} /> : <Cross size={130} p={prog(t, b.at + 0.1, 0.4)} />}
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: b.ok ? C.teal : C.accent}}>{b.label}</div>
            <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.dim}}>{b.ok ? 'Senin–Jumat saja' : 'termasuk akhir pekan'}</div>
          </div>
        </Pop>
      ))}
    </div>
  </Col>
  {t >= 47.86 && <FotoKredit bawah text="foto Mahfud MD: Kemenko Polhukam (2022) · Wikimedia Commons (domain publik)" />}
  </AbsoluteFill>
);

// ---------- S9 Sidang digeser + counter 14 hari kerja ----------
const S9: React.FC<{t: number}> = ({t}) => {
  const n = Math.round(interpolate(t, [61.54, 64.66], [0, 14], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill>
    <AbsoluteFill style={{opacity: 0.4 * prog(t, 54.26, 0.4)}}><Foto src="mpr-konpers-20261123.png" pos="45% 40%" t={t} a={54.26} b={65.58} origin="40% 35%" style={{filter: 'blur(1.5px)'}} /></AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,22,48,0.55), rgba(10,22,48,0.35) 40%, rgba(10,22,48,0.8))'}} />
    <FotoKredit text="foto: MPR RI, konferensi pers 23/11/2026 (domain publik)" />
    <Col top={410} gap={30}>
      <Appear t={t} at={54.26}>
        <Headline lines={[[{text: 'MPR '}, {text: 'MENDENGAR', accent: 'teal'}]]} max={100} />
      </Appear>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 10}}>
        <div style={{position: 'relative'}}>
          <Pop t={t} at={56.34}><Kalender w={330} hari="RABU" tgl="9" bulan="DESEMBER" dim={t > 58.26} color={C.dim} /></Pop>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Cross size={260} p={prog(t, 57.0, 0.4)} /></div>
        </div>
        <div style={{opacity: prog(t, 57.88), fontFamily: FONT, fontWeight: 900, fontSize: 90, color: C.dim}}>→</div>
        <div style={{position: 'relative'}}>
          <Pop t={t} at={58.26}><Kalender w={380} hari="JUMAT" tgl="11" bulan="DESEMBER 2026" color={C.teal} /></Pop>
        </div>
      </div>
      <Appear t={t} at={60.62}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, background: C.card, borderRadius: 28, padding: '20px 40px', marginTop: 10}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 140, color: C.accent, width: 170, textAlign: 'right', lineHeight: 1}}>{n}</div>
          <div style={{fontFamily: FONT}}>
            <div style={{fontWeight: 900, fontSize: 52, color: C.white}}>HARI KERJA</div>
            <div style={{fontWeight: 700, fontSize: 30, color: C.dim}}>verifikasi berkas kedua calon</div>
          </div>
        </div>
      </Appear>
    </Col>
    </AbsoluteFill>
  );
};

// ---------- S10 Penutup: Amran atau Sugiono? ----------
const S10: React.FC<{t: number}> = ({t}) => {
  const q = prog(t, 70.62, 0.4);
  const hi = (at: number) => (t >= at ? 1 : 0);
  return (
    <AbsoluteFill>
      <Col top={370} gap={24}>
        <Appear t={t} at={65.58}>
          <Headline lines={[[{text: 'MENDAMPINGI PRABOWO'}], [{text: 'SAMPAI '}, {text: '2029', accent: true}]]} max={76} />
        </Appear>
        <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 10}}>
          {[
            {foto: 'amran.jpg', pos: '50% 20%', nama: 'AMRAN', at: 72.8},
            {foto: 'sugiono.jpg', pos: '50% 25%', nama: 'SUGIONO', at: 73.48},
          ].map((k, i) => (
            <React.Fragment key={k.nama}>
              {i === 1 && <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 48, color: C.dim}}>ATAU</div>}
              <Appear t={t} at={65.9 + i * 0.25}>
                <div style={{width: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
                  <FotoBulat src={k.foto} size={360} t={t} a={65.58} b={75.2} pos={k.pos} ring={hi(k.at) ? C.accent : C.line} />
                  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 60, color: hi(k.at) ? C.accent : C.white, textAlign: 'center'}}>{k.nama}</div>
                </div>
              </Appear>
            </React.Fragment>
          ))}
        </div>
        <div style={{opacity: q, transform: `translateY(${(1 - q) * 30}px)`, marginTop: 6}}>
          <Headline lines={[[{text: 'SIAPA LEBIH '}, {text: 'PANTAS?', accent: true}]]} max={84} />
        </div>
      </Col>
      <FotoKredit bawah text="foto: Pemprov Banten (arsip 2014), Kemlu RI (2024) · Wikimedia Commons (domain publik)" />
    </AbsoluteFill>
  );
};

export const SCENES: SceneDef[] = [
  {Comp: S1, sitasi: 'sumber: NU Online, Kompas (12–23/11/2026)'},
  {Comp: S2, sitasi: SRC_USULAN},
  {Comp: S3, sitasi: SRC_USULAN},
  {Comp: S4, sitasi: SRC_USULAN},
  {Comp: S5, sitasi: 'sumber: CNN Indonesia, Kompas, ANTARA · jabatan: Katadata, Suara'},
  {Comp: S6, sitasi: 'sumber: isi surat usulan via CNN Indonesia, Kompas'},
  {Comp: S7, sitasi: 'sumber: UUD 1945 Pasal 8 ayat 2'},
  {Comp: S8, sitasi: 'sumber: CNN Indonesia, detik (20/11/2026)'},
  {Comp: S9, sitasi: 'sumber: NU Online, Kompas (23/11/2026)'},
  {Comp: S10, sitasi: 'sumber: CNN Indonesia · Kompas · ANTARA · NU Online · detik'},
];
