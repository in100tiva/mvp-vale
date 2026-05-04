import { useState, useEffect, useRef } from 'react';

// Ease in-out cubic
const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

// Layout constants — fora do componente para não re-criar a cada render
const BAR_H  = 66;   // altura da barra branca
const BR     = 26;   // raio da bolha
const ABOVE  = BR;   // espaço acima da barra para a bolha
const TOTAL_H = BAR_H + ABOVE;

// Notch — sutil e elegante
const NW = 28;   // meia-largura do notch
const ND = 13;   // profundidade do notch
const SW = 22;   // largura do ombro (transição suave)

export function BubbleNav({ activeId, items, onNav }) {
  const ref = useRef(null);
  const [W, setW] = useState(0);

  // cx animado (só X, Y é fixo → sem jitter vertical)
  const [cx, setCx] = useState(null);
  const cxRef   = useRef(null);   // valor atual durante animação
  const rafRef  = useRef(null);
  const prevActiveRef = useRef(activeId);

  // Medir largura
  useEffect(() => {
    const measure = () => ref.current && setW(ref.current.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const activeIndex = items.findIndex(i => i.id === activeId);
  const tabW  = W > 0 ? W / items.length : 0;
  const toX   = tabW * activeIndex + tabW / 2;

  // Inicializa sem animação na primeira medição
  useEffect(() => {
    if (W > 0 && cxRef.current === null) {
      cxRef.current = toX;
      setCx(toX);
    }
  }, [W, toX]);

  // Anima apenas quando a aba realmente muda (não no resize)
  useEffect(() => {
    if (cxRef.current === null || W === 0) return;
    if (prevActiveRef.current === activeId) return; // mesma aba → nada
    prevActiveRef.current = activeId;

    const from = cxRef.current;
    const to   = toX;

    cancelAnimationFrame(rafRef.current);
    const t0  = performance.now();
    const dur = 400;

    const tick = (now) => {
      const p   = Math.min((now - t0) / dur, 1);
      const val = from + (to - from) * ease(p);
      cxRef.current = val;
      setCx(val);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else cxRef.current = to;
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [activeId]); // depende SÓ de activeId — não de toX ou W

  // Atualiza cx ao redimensionar (sem animação)
  useEffect(() => {
    if (cxRef.current !== null && W > 0) {
      cxRef.current = toX;
      setCx(toX);
    }
  }, [W]); // eslint-disable-line

  // ── SVG path: barra branca com notch côncavo suave ──────────────────────
  const currentCx = cx ?? toX;

  const lx   = currentCx - NW;
  const rx   = currentCx + NW;
  const lFlat = Math.max(0, lx - SW);
  const rFlat = Math.min(W, rx + SW);

  // Dois arcos bezier simétricos criam o U côncavo
  const barPath = W > 0 ? [
    `M 0 0`,
    `L ${lFlat} 0`,
    // ombro esquerdo → fundo do notch
    `C ${lFlat + SW * 0.55} 0 ${lx} ${ND * 0.55} ${lx} ${ND}`,
    // fundo arredondado (S-curve simétrica)
    `C ${lx} ${ND + 4} ${rx} ${ND + 4} ${rx} ${ND}`,
    // fundo → ombro direito
    `C ${rx} ${ND * 0.55} ${rFlat - SW * 0.55} 0 ${rFlat} 0`,
    `L ${W} 0`,
    `L ${W} ${BAR_H}`,
    `L 0 ${BAR_H}`,
    `Z`,
  ].join(' ') : '';

  // ── Posição fixa da bolha (só X muda, Y é constante) ────────────────────
  const bubbleTop  = ABOVE - BR;          // = 0 → colado ao topo do container
  const bubbleLeft = currentCx - BR;

  const ActiveIcon = items[activeIndex]?.icon;

  return (
    <div
      ref={ref}
      className="bubble-nav"
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: TOTAL_H,
        maxWidth: 480,
        margin: '0 auto',
        zIndex: 30,
      }}
    >
      {/* Barra SVG com notch */}
      {W > 0 && (
        <svg
          width={W}
          height={BAR_H}
          viewBox={`0 0 ${W} ${BAR_H}`}
          style={{
            position: 'absolute',
            bottom: 0, left: 0,
            overflow: 'visible',
            filter: 'drop-shadow(0 -2px 12px rgba(15,23,42,0.07))',
          }}
        >
          <path d={barPath} fill="white" />
        </svg>
      )}

      {/* Bolha flutuante */}
      {currentCx > 0 && (
        <div
          style={{
            position: 'absolute',
            top: bubbleTop,
            left: bubbleLeft,
            width:  BR * 2,
            height: BR * 2,
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            zIndex: 2,
            boxShadow: '0 6px 20px rgba(15,118,110,0.34)',
            willChange: 'left',
          }}
        >
          {ActiveIcon && <ActiveIcon size={21} />}
        </div>
      )}

      {/* Ícones das abas */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: BAR_H,
          display: 'grid',
          gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        }}
      >
        {items.map((item, i) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: 'var(--subtle)',
                fontSize: 11,
                fontWeight: 500,
                fontFamily: 'inherit',
                WebkitTapHighlightColor: 'transparent',
                opacity: isActive ? 0 : 1,
                transition: 'opacity 180ms ease',
                pointerEvents: isActive ? 'none' : 'auto',
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
