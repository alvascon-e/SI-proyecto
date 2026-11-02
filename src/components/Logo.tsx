// Versión vectorial del logo de ParkiPol (pin con P y edificio institucional sobre una plaza de parqueo).
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="ParkiPol">
      <path d="M20 70 L30 56 H70 L80 70 Z" fill="none" stroke="#14213d" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M38 58 L35 66 M62 58 L65 66" stroke="#14213d" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 66 C 40 52 26 44 26 28 A24 24 0 0 1 74 28 C74 44 60 52 50 66 Z" fill="#2d68d6" />
      <path d="M41 42 V16 H52 C60 16 64 20 64 26 C64 32 60 36 52 36 H46" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M47 39 L55 35 L63 39 M48 40 V46 M52 40 V46 M56 40 V46 M60 40 V46 M46 47 H64" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = 34, claro = false }: { size?: number; claro?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <LogoMark size={size} />
      <span style={{ fontWeight: 800, fontSize: size * 0.62, letterSpacing: '-0.02em', color: claro ? '#fff' : 'var(--navy)' }}>
        Parki<span style={{ color: claro ? '#8fb2ff' : 'var(--azul)' }}>Pol</span>
      </span>
    </span>
  );
}
