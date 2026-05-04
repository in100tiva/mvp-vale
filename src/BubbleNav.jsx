import { useState, useEffect, useRef } from 'react';

// Ease in-out cubic
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

export function BubbleNav({ activeId, items, onNav }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [bubbleX, setBubbleX] = useState(null);
  const currentXRef = useRef(null);
  const animRef = useRef(null);

  // Measure container width on mount and resize
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const activeIndex = items.findIndex(i => i.id === activeId);
  const tabW = width > 0 ? width / items.length : 0;
  const targetX = tabW * activeIndex + tabW / 2;

  // Animate bubbleX → targetX
  useEffect(() => {
    if (width === 0) return;

    // First render: snap to position
    if (currentXRef.current === null) {
      currentXRef.current = targetX;
      setBubbleX(targetX);
      return;
    }

    const from = currentXRef.current;
    const to = targetX;
    if (Math.abs(from - to) < 0.5) return;

    cancelAnimationFrame(animRef.current);
    const t0 = performance.now();
    const dur = 420;

    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const val = from + (to - from) * easeInOutCubic(p);
      currentXRef.current = val;
      setBubbleX(val);
      if (p < 1) animRef.current = requestAnimationFrame(tick);
      else currentXRef.current = to;
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [targetX, width]);

  // Dimensions
  const BAR_H = 70;       // white bar height
  const BUBBLE_R = 28;    // bubble radius
  const NOTCH_R = 34;     // notch cutout radius (slightly bigger than bubble)
  const TOTAL_H = BAR_H + BUBBLE_R + 4; // container total height

  const cx = bubbleX ?? targetX;
  const W = width || 480;

  // Build SVG path for white bar with circular notch at cx
  // The notch is a smooth concave arc centered at cx, at the top of the bar
  const shoulder = 20; // horizontal padding around notch for smooth curve entry
  const notchDepth = NOTCH_R - 6; // how deep the notch goes (vertical)

  const lx = cx - NOTCH_R;         // left edge of arc
  const rx = cx + NOTCH_R;         // right edge of arc
  const lFlat = lx - shoulder;     // flat starts here
  const rFlat = rx + shoulder;     // flat ends here
  const arcBottom = notchDepth;    // SVG y of notch deepest point (relative to bar top)

  const barPath = [
    `M 0 0`,
    `L ${Math.max(0, lFlat)} 0`,
    // Left shoulder — cubic bezier from flat into the notch
    `C ${lFlat + shoulder * 0.6} 0 ${lx} ${arcBottom * 0.5} ${lx} ${arcBottom}`,
    // Arc across the notch bottom (counter-clockwise, so it curves DOWN)
    `A ${NOTCH_R} ${NOTCH_R} 0 0 0 ${rx} ${arcBottom}`,
    // Right shoulder — cubic bezier from notch back to flat
    `C ${rx} ${arcBottom * 0.5} ${Math.min(W, rFlat - shoulder * 0.6)} 0 ${Math.min(W, rFlat)} 0`,
    `L ${W} 0`,
    `L ${W} ${BAR_H}`,
    `L 0 ${BAR_H}`,
    `Z`,
  ].join(' ');

  // Bubble vertical position: center sits at the notch center (top of bar)
  const bubbleTop = BUBBLE_R + 4 - BUBBLE_R; // = 4px from container top
  // Actually: container top is BUBBLE_R+4 above bar top.
  // Bar top in container = BUBBLE_R + 4
  // Bubble center should be at bar top → bubble top = (BUBBLE_R+4) - BUBBLE_R = 4px

  const ActiveIcon = items[activeIndex]?.icon;

  return (
    <div
      ref={containerRef}
      className="bubble-nav-hide"
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: TOTAL_H,
        maxWidth: 480,
        margin: '0 auto',
        zIndex: 30,
        display: 'block',
      }}
    >
      {/* White bar with notch (SVG) */}
      {width > 0 && (
        <svg
          width={W}
          height={BAR_H}
          viewBox={`0 0 ${W} ${BAR_H}`}
          style={{
            position: 'absolute',
            bottom: 0, left: 0,
            overflow: 'visible',
            filter: 'drop-shadow(0 -4px 18px rgba(15,23,42,0.09))',
          }}
        >
          <path d={barPath} fill="white" />
        </svg>
      )}

      {/* Floating bubble */}
      {cx > 0 && (
        <div
          style={{
            position: 'absolute',
            left: cx - BUBBLE_R,
            top: 4,
            width: BUBBLE_R * 2,
            height: BUBBLE_R * 2,
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            zIndex: 2,
            boxShadow: '0 8px 24px rgba(15,118,110,0.38), 0 2px 8px rgba(15,118,110,0.22)',
          }}
        >
          {ActiveIcon && <ActiveIcon size={22} />}
        </div>
      )}

      {/* Tab buttons */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: BAR_H,
          display: 'grid',
          gridTemplateColumns: `repeat(${items.length}, 1fr)`,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
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
                // Hide the active tab's content since the bubble covers it
                opacity: isActive ? 0 : 1,
                transition: 'opacity 200ms ease',
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
