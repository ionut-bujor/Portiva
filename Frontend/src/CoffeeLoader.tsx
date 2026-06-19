import React, { useEffect, useState, useCallback } from "react";

const KEYFRAMES = `
@keyframes grindShake {
  0%,100% { transform: translate(0,0) rotate(0deg); }
  10%  { transform: translate(-3px, 2px) rotate(-5deg); }
  20%  { transform: translate(3px,-1px) rotate(5deg); }
  30%  { transform: translate(-2px, 3px) rotate(-3deg); }
  40%  { transform: translate(2px,-2px) rotate(3deg); }
  50%  { transform: translate(-3px, 1px) rotate(-5deg); }
  60%  { transform: translate(3px, 2px) rotate(5deg); }
  70%  { transform: translate(-1px,-2px) rotate(-2deg); }
  80%  { transform: translate(2px, 1px) rotate(3deg); }
  90%  { transform: translate(-2px,-1px) rotate(-2deg); }
}
@keyframes beanFall1 {
  0%   { transform: translate(-14px,-45px) rotate(-20deg); opacity:0; }
  12%  { opacity:1; }
  88%  { opacity:1; }
  100% { transform: translate(-6px, 38px) rotate(340deg); opacity:0; }
}
@keyframes beanFall2 {
  0%   { transform: translate(0px,-45px) rotate(10deg); opacity:0; }
  12%  { opacity:1; }
  88%  { opacity:1; }
  100% { transform: translate(8px, 36px) rotate(-320deg); opacity:0; }
}
@keyframes beanFall3 {
  0%   { transform: translate(14px,-45px) rotate(30deg); opacity:0; }
  12%  { opacity:1; }
  88%  { opacity:1; }
  100% { transform: translate(4px, 40px) rotate(290deg); opacity:0; }
}
@keyframes fillCup {
  0%   { transform: translateY(76px); }
  100% { transform: translateY(13px); }
}
@keyframes steam1 {
  0%   { transform:translate(0,0); opacity:0; }
  18%  { opacity:0.75; }
  100% { transform:translate(8px,-58px); opacity:0; }
}
@keyframes steam2 {
  0%   { transform:translate(0,0); opacity:0; }
  18%  { opacity:0.65; }
  100% { transform:translate(-7px,-64px); opacity:0; }
}
@keyframes steam3 {
  0%   { transform:translate(0,0); opacity:0; }
  18%  { opacity:0.55; }
  100% { transform:translate(9px,-52px); opacity:0; }
}
@keyframes pour {
  0%   { stroke-dashoffset:90; opacity:0; }
  22%  { opacity:1; }
  78%  { opacity:0.9; }
  100% { stroke-dashoffset:0; opacity:0; }
}
@keyframes orbit1 {
  from { transform: rotate(0deg)   translateX(90px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
}
@keyframes orbit2 {
  from { transform: rotate(120deg)  translateX(90px) rotate(-120deg); }
  to   { transform: rotate(480deg)  translateX(90px) rotate(-480deg); }
}
@keyframes orbit3 {
  from { transform: rotate(240deg)  translateX(90px) rotate(-240deg); }
  to   { transform: rotate(600deg)  translateX(90px) rotate(-600deg); }
}
@keyframes sceneFloat {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-9px); }
}
@keyframes loaderFadeOut {
  from { opacity:1; }
  to   { opacity:0; }
}
@keyframes textGlow {
  0%,100% { opacity:0.35; }
  50%     { opacity:1; }
}
@keyframes dotBounce {
  0%,100% { transform: translateY(0); }
  40%     { transform: translateY(-5px); }
  70%     { transform: translateY(3px); }
}
@keyframes phaseIn {
  from { opacity:0; transform: scale(0.9); }
  to   { opacity:1; transform: scale(1); }
}
@keyframes groundDrop {
  0%   { transform: translateY(0); opacity:0.8; }
  100% { transform: translateY(14px); opacity:0; }
}
`;

const Bean = () => (
  <svg width="22" height="14" viewBox="0 0 22 14">
    <ellipse cx="11" cy="7" rx="10" ry="5.5" fill="#3a1a08" stroke="#c9b99a" strokeWidth="1.2"/>
    <path d="M5 7 Q11 3.5 17 7" fill="none" stroke="#c9b99a" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const GrinderSVG = () => (
  <svg width="88" height="118" viewBox="0 0 88 118">
    {/* Hopper */}
    <path d="M24 8 L64 8 L54 42 L34 42 Z" fill="none" stroke="#c9b99a" strokeWidth="1.6"/>
    <line x1="20" y1="8" x2="68" y2="8" stroke="#c9b99a" strokeWidth="2.2" strokeLinecap="round"/>
    {/* Body */}
    <rect x="18" y="42" width="52" height="58" rx="5" fill="none" stroke="#c9b99a" strokeWidth="1.6"/>
    {/* Horizontal detail lines */}
    <line x1="26" y1="62" x2="62" y2="62" stroke="#c9b99a" strokeWidth="0.7" opacity="0.35"/>
    <line x1="26" y1="72" x2="62" y2="72" stroke="#c9b99a" strokeWidth="0.7" opacity="0.35"/>
    <line x1="26" y1="82" x2="62" y2="82" stroke="#c9b99a" strokeWidth="0.7" opacity="0.35"/>
    {/* Crank handle */}
    <line x1="70" y1="58" x2="84" y2="52" stroke="#c9b99a" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="84" cy="52" r="5" fill="none" stroke="#c9b99a" strokeWidth="1.6"/>
    {/* Output chute */}
    <rect x="32" y="100" width="24" height="9" rx="2.5" fill="none" stroke="#c9b99a" strokeWidth="1.3"/>
    {/* Grounds dropping */}
    {[38, 44, 50].map((x, i) => (
      <circle key={i} cx={x} cy={112} r="1.5" fill="#c9b99a" opacity="0.5"
        style={{ animation: `groundDrop 0.8s ease-in infinite`, animationDelay: `${i * 0.25}s` }}/>
    ))}
  </svg>
);

const CupSVG = () => (
  <svg viewBox="0 0 140 165" width="150" height="165">
    <defs>
      <clipPath id="loaderCupClip">
        <path d="M22 58 L118 58 L110 128 L30 128 Z"/>
      </clipPath>
    </defs>

    {/* Pour stream */}
    <path d="M108 3 Q103 27 97 56" fill="none" stroke="#c9b99a" strokeWidth="2.5"
      strokeLinecap="round" strokeDasharray="90"
      style={{ animation: 'pour 2.8s ease-in-out infinite 0.6s', opacity: 0 }}/>

    {/* Liquid fill */}
    <rect x="20" y="55" width="100" height="80" fill="#5a2d14"
      clipPath="url(#loaderCupClip)"
      style={{ animation: 'fillCup 3.2s cubic-bezier(0.25,0,0.05,1) forwards' }}/>

    {/* Cup body outline — painted on top so it hides liquid overflow */}
    <path d="M22 58 L118 58 L110 128 L30 128 Z" fill="none" stroke="#c9b99a" strokeWidth="2"/>
    {/* Rim */}
    <line x1="17" y1="58" x2="123" y2="58" stroke="#c9b99a" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Handle */}
    <path d="M110 76 Q137 76 137 97 Q137 118 110 115" fill="none" stroke="#c9b99a" strokeWidth="2" strokeLinecap="round"/>
    {/* Saucer */}
    <ellipse cx="70" cy="133" rx="56" ry="7" fill="none" stroke="#c9b99a" strokeWidth="1.5"/>

    {/* Steam wisps */}
    <path d="M40 56 Q33 40 40 22" fill="none" stroke="#c9b99a" strokeWidth="1.8"
      strokeLinecap="round" style={{ animation: 'steam1 2.6s ease-out infinite', opacity: 0 }}/>
    <path d="M70 54 Q77 37 70 19" fill="none" stroke="#c9b99a" strokeWidth="1.8"
      strokeLinecap="round" style={{ animation: 'steam2 2.6s ease-out infinite 0.65s', opacity: 0 }}/>
    <path d="M100 56 Q93 40 100 22" fill="none" stroke="#c9b99a" strokeWidth="1.8"
      strokeLinecap="round" style={{ animation: 'steam3 2.6s ease-out infinite 1.3s', opacity: 0 }}/>
  </svg>
);

const GRIND_MSGS = ["grinding the beans", "setting the coarseness", "preparing the grind"];
const BREW_MSGS  = ["brewing your portfolio", "steeping in the details", "almost ready to pour"];

interface Props { loaded: boolean; onExitComplete: () => void; }

const CoffeeLoader: React.FC<Props> = ({ loaded, onExitComplete }) => {
  const [phase, setPhase]     = useState<'grinding' | 'brewing'>('grinding');
  const [msgIdx, setMsgIdx]   = useState(0);
  const [dots, setDots]       = useState('');
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const el = document.createElement('style');
    el.id = 'coffee-loader-kf';
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
    return () => document.getElementById('coffee-loader-kf')?.remove();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPhase('brewing'), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const msgs = phase === 'grinding' ? GRIND_MSGS : BREW_MSGS;
    setMsgIdx(0);
    const t = setInterval(() => setMsgIdx(i => (i + 1) % msgs.length), 2200);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 480);
    return () => clearInterval(t);
  }, []);

  const handleExit = useCallback(() => {
    setExiting(true);
    const t = setTimeout(onExitComplete, 750);
    return () => clearTimeout(t);
  }, [onExitComplete]);

  useEffect(() => {
    if (loaded) handleExit();
  }, [loaded, handleExit]);

  const msgs = phase === 'grinding' ? GRIND_MSGS : BREW_MSGS;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: '#100b08',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '2.5rem',
      animation: exiting ? 'loaderFadeOut 0.75s ease forwards' : 'none',
    }}>
      {/* grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.055,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '128px',
      }}/>

      {/* brand mark */}
      <div style={{
        position: 'absolute', top: '2rem', left: '3rem',
        fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase',
        color: '#4a3020', fontFamily: 'system-ui',
      }}>portiva</div>

      {/* scene — gently floats */}
      <div style={{ animation: 'sceneFloat 4s ease-in-out infinite' }}>

        {phase === 'grinding' ? (
          /* ── GRINDING PHASE ── */
          <div style={{ animation: 'phaseIn 0.5s ease', position: 'relative', width: '130px', height: '190px', display: 'flex', justifyContent: 'center' }}>
            {/* beans falling in */}
            {[
              { left: '28px', anim: 'beanFall1 1.35s ease-in infinite', delay: '0s' },
              { left: '52px', anim: 'beanFall2 1.35s ease-in infinite', delay: '0.38s' },
              { left: '76px', anim: 'beanFall3 1.35s ease-in infinite', delay: '0.76s' },
            ].map((b, i) => (
              <div key={i} style={{ position: 'absolute', top: '12px', left: b.left, animation: b.anim, animationDelay: b.delay, opacity: 0 }}>
                <Bean />
              </div>
            ))}
            {/* shaking grinder */}
            <div style={{ position: 'absolute', top: '55px', left: '20px', animation: 'grindShake 0.11s linear infinite' }}>
              <GrinderSVG />
            </div>
          </div>
        ) : (
          /* ── BREWING PHASE ── */
          <div style={{ animation: 'phaseIn 0.5s ease', position: 'relative', width: '270px', height: '210px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* orbiting beans */}
            {[
              { anim: 'orbit1 3.8s linear infinite' },
              { anim: 'orbit2 3.8s linear infinite' },
              { anim: 'orbit3 5.2s linear infinite' },
            ].map((b, i) => (
              <div key={i} style={{
                position: 'absolute', top: '50%', left: '50%',
                marginTop: '-7px', marginLeft: '-11px',
                animation: b.anim,
              }}>
                <Bean />
              </div>
            ))}
            <CupSVG />
          </div>
        )}
      </div>

      {/* message + dots */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          color: '#c9b99a', fontFamily: "'Georgia', serif",
          fontSize: '1.05rem', letterSpacing: '0.05em',
          animation: 'textGlow 2.5s ease-in-out infinite',
          margin: '0 0 0.75rem',
        }}>
          {msgs[msgIdx % msgs.length]}
          <span style={{ opacity: 0.6 }}>{dots}</span>
        </p>
        <div style={{ display: 'flex', gap: '7px', justifyContent: 'center' }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: '#4a3020',
              animation: 'dotBounce 1.3s ease-in-out infinite',
              animationDelay: `${i * 0.16}s`,
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoffeeLoader;
