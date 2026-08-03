import React, { useState, useEffect, useRef } from 'react';
import './GooeyNav.css';

const PARTICLE_COLORS = ['#A8654A', '#C9A227', '#E9C08C', '#FDF8F3'];

export default function GooeyNav({ items = [], activeIndex = 0, onItemClick, isDarkHero = false }) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const isFirstMount = useRef(true);

  const [pillStyle, setPillStyle] = useState({ transform: 'translateX(0px)', width: '0px', opacity: 0 });
  const [dropLightStyle, setDropLightStyle] = useState({ left: '0px', width: '0px' });
  const [dropAnimKey, setDropAnimKey] = useState(0);
  const [particles, setParticles] = useState([]);

  // Calculate pill position & drop light placement whenever activeIndex or window resizes
  useEffect(() => {
    const updatePillPosition = () => {
      const activeEl = itemRefs.current[activeIndex];
      const containerEl = containerRef.current;

      if (activeEl && containerEl) {
        const activeRect = activeEl.getBoundingClientRect();
        const containerRect = containerEl.getBoundingClientRect();

        const relativeLeft = activeRect.left - containerRect.left;
        const width = activeRect.width;
        const centerX = relativeLeft + width / 2;

        setPillStyle({
          transform: `translateX(${relativeLeft}px)`,
          width: `${width}px`,
          opacity: 1,
        });

        setDropLightStyle({
          left: `${centerX}px`,
          width: `${Math.max(70, width * 1.3)}px`,
        });

        // Trigger Soft GOLD Drop Light animation (Skip initial mount)
        if (isFirstMount.current) {
          isFirstMount.current = false;
        } else {
          setDropAnimKey((prev) => prev + 1);
          spawnGooeyParticles(relativeLeft, width, activeRect.height);
        }
      }
    };

    updatePillPosition();
    window.addEventListener('resize', updatePillPosition);
    return () => window.removeEventListener('resize', updatePillPosition);
  }, [activeIndex]);

  // Spawn gooey particle burst around the active pill
  const spawnGooeyParticles = (left, width, height) => {
    const newParticles = [];
    const count = 12;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 18 + Math.random() * 32;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const size = 5 + Math.random() * 7;
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];

      newParticles.push({
        id: `${Date.now()}-${i}-${Math.random()}`,
        x: left + width / 2 + (Math.random() - 0.5) * (width * 0.6),
        y: height / 2 + (Math.random() - 0.5) * 8,
        size,
        color,
        dx: `${dx}px`,
        dy: `${dy}px`,
      });
    }

    setParticles(newParticles);
    setTimeout(() => {
      setParticles([]);
    }, 850);
  };

  return (
    <div
      ref={containerRef}
      className={`gooey-nav-wrapper ${isDarkHero ? 'is-dark-hero' : ''}`}
    >
      {/* SVG Gooey Liquid Filter Definition */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="gooey-nav-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Sliding Liquid Active Pill */}
      <div
        className="gooey-active-pill"
        style={{
          transform: pillStyle.transform,
          width: pillStyle.width,
          opacity: pillStyle.opacity,
        }}
      />

      {/* Soft GOLD Drop Light Bloom Effect */}
      {dropAnimKey > 0 && (
        <div
          key={dropAnimKey}
          className="gold-drop-light animate-drop"
          style={{
            left: dropLightStyle.left,
            width: dropLightStyle.width,
          }}
        />
      )}

      {/* Floating Gooey Particles Layer */}
      <div className="gooey-particles-layer">
        {particles.map((p) => (
          <span
            key={p.id}
            className="gooey-particle"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              '--dx': p.dx,
              '--dy': p.dy,
            }}
          />
        ))}
      </div>

      {/* Navigation Items List */}
      <ul className="gooey-nav-list">
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;

          return (
            <li
              key={item.label}
              ref={(el) => (itemRefs.current[idx] = el)}
              className="gooey-nav-item"
            >
              <button
                type="button"
                onClick={(e) => onItemClick && onItemClick(item, idx, e)}
                className={`gooey-nav-btn ${isActive ? 'is-active' : ''}`}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
