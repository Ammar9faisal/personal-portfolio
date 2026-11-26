export type CameraRect = { left: number; top: number; width: number; height: number };
export function monitorCamera(scene: CameraRect, screen: CameraRect, width: number, height: number) {
  if (screen.width <= 0 || screen.height <= 0 || width <= 0 || height <= 0) return null;
  // Overscan hides the glass's rounded/perspective edges without distorting the art.
  const scale = Math.max(width / screen.width, height / screen.height) * 1.14;
  const x = width / 2 - scene.left - (screen.left - scene.left + screen.width / 2) * scale;
  const y = height / 2 - scene.top - (screen.top - scene.top + screen.height / 2) * scale;
  return { x, y, scale, transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` };
}
