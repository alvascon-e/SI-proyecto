// Logo original de ParkiPol (public/logo-*.png, recortado con fondo transparente).
export function LogoMark({ size = 40 }: { size?: number }) {
  return <img src="/logo-mark.png" alt="ParkiPol" width={size} height={size * (740 / 660)} style={{ display: 'block' }} />;
}

export function Logo({ size = 34, vertical = false }: { size?: number; vertical?: boolean }) {
  if (vertical) return <img src="/logo-full.png" alt="ParkiPol" style={{ width: size * 4, display: 'block' }} />;
  return (
    <span className="logo-h">
      <LogoMark size={size} />
      <img src="/logo-wordmark.png" alt="" style={{ height: size * 0.62, display: 'block' }} />
    </span>
  );
}
