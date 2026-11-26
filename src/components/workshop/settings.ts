// Source-pixel geometry and animation/audio tuning share one scene configuration.
export const sceneSettings = {
  width: 1672, height: 941,
  rainCount: 100, rainSeconds: 2, rainSpreadSeconds: 0.32,
  lampSeconds: 19, scanSeconds: 11, promptSeconds: 7,
  computerGlanceMs: 380,
  robot: { pauseMs: [2400, 7100], lookMs: [650, 1300], blinkMs: 135 },
  leds: [
    { x: 507, y: 428, color: "#bbd97c", seconds: 13.7, delay: -3.1 },
    { x: 508, y: 446, color: "#dfb66c", seconds: 19.3, delay: -11.4 },
    { x: 377, y: 478, color: "#b6cc80", seconds: 23.9, delay: -6.8 },
  ],
  reactionMs: 760,
  audioGain: 0.035, audioBufferSeconds: 3,
} as const;

export const sceneObjects = [
  { id: "computer", name: "Computer", action: "Open workstation", x: 774, y: 306, width: 218, height: 166 },
  { id: "robot", name: "Robot", action: "Meet the workshop assistant", x: 1057, y: 343, width: 123, height: 178 },
  { id: "chess", name: "Chessboard", action: "Explore the chessboard", x: 1100, y: 582, width: 355, height: 110 },
  { id: "printer", name: "3D printer", action: "Inspect the 3D printer", x: 1366, y: 245, width: 286, height: 222 },
  { id: "tools", name: "Robotics & tools", action: "Explore robotics & electronics", x: 10, y: 338, width: 184, height: 204 },
] as const;
export type SceneObjectId = (typeof sceneObjects)[number]["id"];
export type PanelId = "robot" | "printer" | "chess";
