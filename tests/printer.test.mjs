import test from 'node:test';
import assert from 'node:assert/strict';
import { advancePrintTime, printerFrame, printerSettings } from '../src/components/workshop/printerSimulation.ts';
const running = { paused: false, suspended: false, reducedMotion: false };

test('pause and environmental suspension freeze the exact elapsed point', () => {
  let elapsed = advancePrintTime(0, 4000, running);
  const pose = printerFrame(elapsed);
  elapsed = advancePrintTime(elapsed, 9000, { ...running, paused: true });
  assert.equal(elapsed, 4000);
  assert.deepEqual(printerFrame(elapsed), pose);
  assert.equal(advancePrintTime(elapsed, 9000, { ...running, suspended: true }), elapsed);
  assert.equal(advancePrintTime(elapsed, 9000, { ...running, reducedMotion: true }), elapsed);
  assert.equal(advancePrintTime(elapsed, 250, running), 4250);
});

test('print grows, holds complete, clears, and restarts without exceeding 100 percent', () => {
  const { printMs, completeMs, resetMs, knightHeight } = printerSettings;
  assert.equal(printerFrame(0).height, 0);
  assert.equal(printerFrame(printMs / 2).height, knightHeight / 2);
  assert.equal(printerFrame(printMs).phase, 'complete');
  assert.equal(printerFrame(printMs).progress, 100);
  assert.equal(printerFrame(printMs + completeMs + resetMs / 2).pieceOpacity, .5);
  const restarted = printerFrame(printMs + completeMs + resetMs);
  assert.equal(restarted.phase, 'printing');
  assert.equal(restarted.progress, 0);
  assert.equal(restarted.cycle, 2);
});

test('moving components stay in the preserved chamber; reduced motion keeps mechanics still', () => {
  for (let elapsed = 0; elapsed < printerSettings.printMs; elapsed += 100) {
    const frame = printerFrame(elapsed);
    assert.ok(frame.headX - 13 >= 1402 && frame.headX + 13 <= 1565);
    assert.ok(frame.headY >= 291 && frame.headY + 21 <= 439);
    assert.ok(frame.height >= 0 && frame.height <= 64);
    const still = printerFrame(elapsed, true);
    assert.equal(still.headX, 1434); assert.equal(still.headY, 324); assert.equal(still.bedY, 426);
  }
});
