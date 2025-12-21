import React, { useState, useEffect, useRef, useCallback } from "react";

// Liquid Glass Component
const LiquidGlass = ({ children, className = "", style = {} }: any) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius: "18px", backdropFilter: "blur(10px) saturate(130%)", ...style }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className="absolute pointer-events-none transition-all duration-200"
          style={{
            width: "240px",
            height: "240px",
            left: mousePos.x - 120,
            top: mousePos.y - 120,
            background: "radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

type Grid = (number | null)[][];

const GRID_SIZE = 4;

const getTileColor = (value: number) => {
  const colors: { [key: number]: string } = {
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
  };
  return colors[value] || "#3c3a32";
};

const getTileTextColor = (value: number) => {
  return value <= 4 ? "#776e65" : "#f9f6f2";
};

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initGrid = useCallback(() => {
    const newGrid: Grid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    return newGrid;
  }, []);

  useEffect(() => {
    setGrid(initGrid());
  }, [initGrid]);

  const addRandomTile = (currentGrid: Grid) => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (currentGrid[i][j] === null) {
          emptyCells.push([i, j]);
        }
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const moveLeft = (currentGrid: Grid): [Grid, number] => {
    let newScore = 0;
    const newGrid: Grid = currentGrid.map((row) => {
      const filtered = row.filter((val) => val !== null);
      const merged: (number | null)[] = [];
      let i = 0;
      while (i < filtered.length) {
        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
          const mergedValue = filtered[i]! * 2;
          merged.push(mergedValue);
          newScore += mergedValue;
          i += 2;
        } else {
          merged.push(filtered[i]);
          i++;
        }
      }
      while (merged.length < GRID_SIZE) {
        merged.push(null);
      }
      return merged;
    });
    return [newGrid, newScore];
  };

  const rotateGrid = (currentGrid: Grid): Grid => {
    return currentGrid[0].map((_, colIndex) =>
      currentGrid.map((row) => row[colIndex]).reverse()
    );
  };

  const move = (direction: "left" | "right" | "up" | "down") => {
    let currentGrid = grid.map((row) => [...row]);
    let rotations = 0;

    if (direction === "right") rotations = 2;
    else if (direction === "up") rotations = 3;
    else if (direction === "down") rotations = 1;

    for (let i = 0; i < rotations; i++) {
      currentGrid = rotateGrid(currentGrid);
    }

    let [movedGrid, addedScore] = moveLeft(currentGrid);

    for (let i = 0; i < (4 - rotations) % 4; i++) {
      movedGrid = rotateGrid(movedGrid as Grid);
    }

    const hasChanged = JSON.stringify(grid) !== JSON.stringify(movedGrid);

    if (hasChanged) {
      addRandomTile(movedGrid);
      setGrid(movedGrid);
      setScore((s) => {
        const newScore = s + addedScore;
        if (newScore > bestScore) setBestScore(newScore);
        return newScore;
      });

      if (checkGameOver(movedGrid)) {
        setGameOver(true);
      }
    }
  };

  const checkGameOver = (currentGrid: Grid): boolean => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (currentGrid[i][j] === null) return false;
        if (j < GRID_SIZE - 1 && currentGrid[i][j] === currentGrid[i][j + 1]) return false;
        if (i < GRID_SIZE - 1 && currentGrid[i][j] === currentGrid[i + 1][j]) return false;
      }
    }
    return true;
  };

  const resetGame = () => {
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      const keyMap: { [key: string]: "left" | "right" | "up" | "down" } = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        move(keyMap[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <LiquidGlass className="p-6 bg-white/5 border border-white/10 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🎮</div>
            <h2 className="text-2xl font-semibold">2048 Game</h2>
          </div>
          <p className="text-sm text-white/70">Join the numbers to get to 2048!</p>
        </LiquidGlass>

        <LiquidGlass className="p-6 bg-white/5 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg">
              Score: <span className="font-bold text-orange-400">{score}</span>
            </div>
            <div className="text-lg">
              Best: <span className="font-bold text-yellow-400">{bestScore}</span>
            </div>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition active:scale-95"
            >
              New Game
            </button>
          </div>

          <div
            className="mx-auto relative"
            style={{
              width: "min(400px, 100%)",
              aspectRatio: "1",
              backgroundColor: "#bbada0",
              borderRadius: "8px",
              padding: "8px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
            }}
          >
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  style={{
                    backgroundColor: cell ? getTileColor(cell) : "#cdc1b4",
                    color: cell ? getTileTextColor(cell) : "transparent",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: cell && cell >= 1024 ? "1.5rem" : "2rem",
                    fontWeight: "bold",
                    transition: "all 0.15s",
                  }}
                >
                  {cell}
                </div>
              ))
            )}

            {gameOver && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(238, 228, 218, 0.9)",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "16px",
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#776e65" }}>
                  Game Over!
                </div>
                <button
                  onClick={resetGame}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#8f7a66",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mt-6">
            <div></div>
            <button
              onClick={() => move("up")}
              className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition active:scale-95 text-2xl"
              disabled={gameOver}
            >
              ⬆️
            </button>
            <div></div>
            <button
              onClick={() => move("left")}
              className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition active:scale-95 text-2xl"
              disabled={gameOver}
            >
              ⬅️
            </button>
            <div></div>
            <button
              onClick={() => move("right")}
              className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition active:scale-95 text-2xl"
              disabled={gameOver}
            >
              ➡️
            </button>
            <div></div>
            <button
              onClick={() => move("down")}
              className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition active:scale-95 text-2xl"
              disabled={gameOver}
            >
              ⬇️
            </button>
            <div></div>
          </div>
        </LiquidGlass>

        <LiquidGlass className="mt-6 p-4 bg-white/5 border border-white/10">
          <div className="text-xs text-white/50">
            <strong>How to play:</strong> Use arrow keys or on-screen buttons to move tiles. When two tiles with the same number touch, they merge into one!
          </div>
        </LiquidGlass>
      </div>
    </div>
  );
}