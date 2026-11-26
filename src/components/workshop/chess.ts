// A static illustrative position, not a chess engine or pawnVision implementation.
const backRank = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
const symbols: Record<string, string> = { "white king": "♔", "white queen": "♕", "white rook": "♖", "white bishop": "♗", "white knight": "♘", "white pawn": "♙", "black king": "♚", "black queen": "♛", "black rook": "♜", "black bishop": "♝", "black knight": "♞", "black pawn": "♟" };
export function describeSquare(index: number) {
  const row = Math.floor(index / 8), file = index % 8;
  const piece = row === 0 ? `black ${backRank[file]}` : row === 1 ? "black pawn" : row === 6 ? "white pawn" : row === 7 ? `white ${backRank[file]}` : "empty";
  return { name: `${String.fromCharCode(97 + file)}${8 - row}`, piece, symbol: symbols[piece] || "" };
}

export function adjacentSquare(index: number, key: string) {
  const row = Math.floor(index / 8), file = index % 8;
  const moves: Record<string, number> = { ArrowLeft: file ? -1 : 0, ArrowRight: file < 7 ? 1 : 0, ArrowUp: row ? -8 : 0, ArrowDown: row < 7 ? 8 : 0, Home: -file, End: 7 - file };
  return key in moves ? index + moves[key] : undefined;
}
