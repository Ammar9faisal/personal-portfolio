import test from 'node:test';
import assert from 'node:assert/strict';
import { adjacentSquare, describeSquare } from '../src/components/workshop/chess.ts';
import { sceneObjects, sceneSettings } from '../src/components/workshop/settings.ts';

test('illustrative chess position has 64 distinct coordinates and 32 starting pieces', () => {
  const squares = Array.from({ length: 64 }, (_, index) => describeSquare(index));
  assert.equal(new Set(squares.map(square => square.name)).size, 64);
  assert.equal(squares.filter(square => square.piece.startsWith('white')).length, 16);
  assert.equal(squares.filter(square => square.piece.startsWith('black')).length, 16);
  assert.deepEqual(describeSquare(52), { name: 'e2', piece: 'white pawn', symbol: '♙' });
  assert.equal(describeSquare(28).piece, 'empty');
});

test('arrow navigation stays on board without wrapping files or ranks', () => {
  assert.equal(adjacentSquare(8, 'ArrowLeft'), 8);
  assert.equal(adjacentSquare(7, 'ArrowRight'), 7);
  assert.equal(adjacentSquare(4, 'ArrowUp'), 4);
  assert.equal(adjacentSquare(60, 'ArrowDown'), 60);
  assert.equal(adjacentSquare(52, 'ArrowUp'), 44);
  assert.equal(adjacentSquare(52, 'Home'), 48);
  assert.equal(adjacentSquare(52, 'End'), 55);
  assert.equal(adjacentSquare(52, 'Escape'), undefined);
});

test('all scene targets remain inside the original artwork coordinates', () => {
  assert.equal(new Set(sceneObjects.map(object => object.id)).size, 5);
  for (const object of sceneObjects) {
    assert.ok(object.x >= 0 && object.y >= 0);
    assert.ok(object.x + object.width <= sceneSettings.width);
    assert.ok(object.y + object.height <= sceneSettings.height);
  }
});
