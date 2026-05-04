import { useState, useEffect, useRef } from 'react';

const BAR_H  = 66;
const BR     = 26;
const TOTAL_H = BAR_H + BR;
const NW = 28;
const ND = 13;
const SW = 22;

function buildPath(cx, W) {
  if (!cx || W <= 0) return '';
  const lx    = cx - NW;
  const rx    = cx + NW;
  const lFlat = Math.max(0, lx - SW);
  const rFlat = Math.min(W, rx + SW);
  return [
    `M 0 0`,
    `L ${lFlat} 0`,
    `C ${lFlat + SW * 0.55} 0 ${lx} ${ND * 0.55} ${lx} ${ND}`,
    `C ${lx} ${ND + 4} ${rx} ${ND + 4} ${rx} ${ND}`,
    `C ${rx} ${ND * 0.55} ${rFlat - SW * 0.55} 0 ${rFlat} 0`,
    `L ${W} 0`,
    `L ${W} ${BAR_H}`,
    `L 0 ${BAR_H}`,
    `Z`,
  ].join(' ');
}

export function BubbleNav({ activeId, items, onNav }) {
  const ref = useRef(null);
  const [W, setW] = useState(0);
  const [live, setLive] = useState(false);
  // Ícone exibido e sua opacidade — cross-fade no meio da viagem
  const [displayId, setDisplayId] = useState(activeId);
  const [iconVisible, setIconVisible] = useState(true);

  useEffect(() => {
    const measure = () => ref.current && setW(ref.current.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  // Duplo rAF: liga transitions só após o primeiro paint
  useEffect(() => {
    if (W > 0 && !live) {
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setLive(true))
      );
      return () => cancelAnimationFrame(id);
    }
  }, [W, live]);

  // Cross-fade: esconde ícone → troca → mostra (no meio da viagem da bolha)
  useEffect(() => {
    if (!live) { setDisplayId(activeId); return; }
    setIconVisible(false);
    const t = setTimeout(() => {
      setDisplayId(activeId);
      setIconVisible(true);
    }, 180);
    return () => clearTimeout(t);
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeIndex = items.findIndex(i => i.id === activeId);
  const tabW = W > 0 ? W / items.length : 0;
  const cx   = tabW * activeIndex + tabW / 2;
  const barPath   = buildPath(cx, W);
  const DisplayIcon = items.find(i => i.id === displayId)?.icon;
  const TR = live ? '0.42s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';

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
          className="bubble-nav-svg"
          style={{ position: 'absolute', bottom: 0, left: 0, overflow: 'visible' }}
        >
          <path
            d={barPath}
            fill="var(--surface)"
            style={{
              d: barPath ? `path('${barPath}')` : undefined,
              transition: `d ${TR}`,
            }}
          />
        </svg>
      )}

      {/* Bolha — transform: translateX (compositor puro, zero layout) */}
      {W > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `translateX(${cx - BR}px)`,
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
            transition: `transform ${TR}`,
            willChange: 'transform',
          }}
        >
          <div style={{
            opacity: iconVisible ? 1 : 0,
            transition: 'opacity 120ms ease',
            display: 'flex',
          }}>
            {DisplayIcon && <DisplayIcon size={21} />}
          </div>
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
        {items.map((item) => {
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
                transition: 'opacity 220ms ease',
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
