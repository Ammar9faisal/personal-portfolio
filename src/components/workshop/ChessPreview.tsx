"use client";
import { useRef, useState } from "react";
import { adjacentSquare, describeSquare } from "./chess";
import styles from "./WorkshopScene.module.css";

export default function ChessPreview() {
  const [selected, setSelected] = useState<number | null>(null);
  const [active, setActive] = useState(52);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return <>
    <div className={styles.chessboard} role="grid" aria-label="Illustrative chess starting position">
      {Array.from({ length: 8 }, (_, row) => <div role="row" key={row} className={styles.chessRow}>
        {Array.from({ length: 8 }, (_, file) => {
          const index = row * 8 + file, square = describeSquare(index);
          return <div role="gridcell" aria-selected={selected === index} key={file}>
            <button ref={element => { buttons.current[index] = element; }} tabIndex={active === index ? 0 : -1}
              className={`${styles.square} ${(row + file) % 2 ? styles.darkSquare : styles.lightSquare}`}
              aria-label={`${square.name}, ${square.piece}`} aria-pressed={selected === index}
              onFocus={() => setActive(index)} onClick={() => { setSelected(index); setActive(index); }}
              onKeyDown={event => {
                const next = adjacentSquare(index, event.key);
                if (next !== undefined) {
                  event.preventDefault();
                  setActive(next); buttons.current[next]?.focus();
                }
              }}>
              <span aria-hidden="true" className={square.piece.startsWith("white") ? styles.whitePiece : styles.blackPiece}>{square.symbol}</span>
              {file === 0 && <small aria-hidden="true" data-coordinate="rank">{8 - row}</small>}
              {row === 7 && <small aria-hidden="true" data-coordinate="file">{String.fromCharCode(97 + file)}</small>}
            </button>
          </div>;
        })}
      </div>)}
    </div>
    <p className={styles.squareStatus} role="status">{selected === null ? "Select a square · arrow keys move focus" : `${describeSquare(selected).name} · ${describeSquare(selected).piece}`}</p>
  </>;
}
