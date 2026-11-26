import test from 'node:test';
import assert from 'node:assert/strict';
import { monitorCamera } from '../src/components/transition/geometry.ts';

test('camera centers the glass and covers the viewport across crops and scroll positions', () => {
  for (const [scene, screen, width, height] of [
    [{left:0,top:95,width:1440,height:810}, {left:686,top:379,width:106,height:86},1440,1000],
    [{left:0,top:350,width:390,height:320}, {left:182,top:462,width:42,height:34},390,844],
    [{left:0,top:-350,width:390,height:320}, {left:182,top:-238,width:42,height:34},390,844],
    [{left:24,top:120,width:976,height:550}, {left:489,top:313,width:72,height:58},1024,768],
  ]) {
    const camera = monitorCamera(scene, screen, width, height);
    const left = scene.left + camera.x + (screen.left - scene.left) * camera.scale;
    const top = scene.top + camera.y + (screen.top - scene.top) * camera.scale;
    assert.ok(left < 0 && top < 0);
    assert.ok(left + screen.width * camera.scale > width);
    assert.ok(top + screen.height * camera.scale > height);
    assert.ok(Math.abs(left + screen.width * camera.scale / 2 - width / 2) < 1e-8);
    assert.ok(Math.abs(top + screen.height * camera.scale / 2 - height / 2) < 1e-8);
    // Reversing the same camera transform recovers the original screen location.
    assert.ok(Math.abs(scene.left + (left - scene.left - camera.x) / camera.scale - screen.left) < 1e-8);
  }
});
test('an unmeasurable screen cannot produce invalid transform values', () => {
  assert.equal(monitorCamera({left:0,top:0,width:0,height:0},{left:0,top:0,width:0,height:0},390,844),null);
});
