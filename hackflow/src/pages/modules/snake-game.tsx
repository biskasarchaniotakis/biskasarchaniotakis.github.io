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
            background: "radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    generateFood();
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setIsPlaying(false);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          generateFood();
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [isPlaying, gameOver, food, generateFood, score, highScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;

      const keyMap: { [key: string]: Position } = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };

      const newDirection = keyMap[e.key];
      if (newDirection) {
        e.preventDefault();
        // Prevent 180 degree turns
        if (
          newDirection.x !== -directionRef.current.x ||
          newDirection.y !== -directionRef.current.y
        ) {
          setDirection(newDirection);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, gameOver]);

  const handleDirectionButton = (newDir: Position) => {
    if (!isPlaying || gameOver) return;
    if (newDir.x !== -directionRef.current.x || newDir.y !== -directionRef.current.y) {
      setDirection(newDir);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <LiquidGlass className="p-6 bg-white/5 border border-white/10 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🐍</div>
            <h2 className="text-2xl font-semibold">Snake Game</h2>
          </div>
          <p className="text-sm text-white/70">Classic snake game - eat the food and grow!</p>
        </LiquidGlass>

        <LiquidGlass className="p-6 bg-white/5 border border-white/10 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg">Score: <span className="font-bold text-green-400">{score}</span></div>
            <div className="text-lg">High Score: <span className="font-bold text-yellow-400">{highScore}</span></div>
          </div>

          <div className="flex justify-center mb-4">
            <div
              style={{
                width: GRID_SIZE * CELL_SIZE,
                height: GRID_SIZE * CELL_SIZE,
                backgroundColor: "#0f172a",
                border: "2px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                position: "relative",
              }}
            >
              {/* Snake */}
              {snake.map((segment, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2,
                    left: segment.x * CELL_SIZE,
                    top: segment.y * CELL_SIZE,
                    backgroundColor: i === 0 ? "#22c55e" : "#16a34a",
                    borderRadius: "4px",
                    border: "1px solid #15803d",
                  }}
                />
              ))}
              {/* Food */}
              <div
                style={{
                  position: "absolute",
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                  left: food.x * CELL_SIZE,
                  top: food.y * CELL_SIZE,
                  backgroundColor: "#ef4444",
                  borderRadius: "50%",
                  boxShadow: "0 0 10px #ef4444",
                }}
              />
              {/* Game Over Overlay */}
              {gameOver && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">Game Over!</div>
                    <div className="text-lg">Final Score: {score}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="text-center mb-4">
            {!isPlaying && !gameOver && (
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-green-500 rounded-lg font-medium hover:bg-green-600 transition active:scale-95"
              >
                Start Game
              </button>
            )}
            {gameOver && (
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-blue-500 rounded-lg font-medium hover:bg-blue-600 transition active:scale-95"
              >
                Play Again
              </button>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            <div></div>
            <button
              onClick={() => handleDirectionButton({ x: 0, y: -1 })}
              className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition active:scale-95"
            >
              ⬆️
            </button>
            <div></div>
            <button
              onClick={() => handleDirectionButton({ x: -1, y: 0 })}
              className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition active:scale-95"
            >
              ⬅️
            </button>
            <div></div>
            <button
              onClick={() => handleDirectionButton({ x: 1, y: 0 })}
              className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition active:scale-95"
            >
              ➡️
            </button>
            <div></div>
            <button
              onClick={() => handleDirectionButton({ x: 0, y: 1 })}
              className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition active:scale-95"
            >
              ⬇️
            </button>
            <div></div>
          </div>
        </LiquidGlass>

        <LiquidGlass className="p-4 bg-white/5 border border-white/10">
          <div className="text-xs text-white/50">
            <strong>Controls:</strong> Use arrow keys or on-screen buttons to move. Eat the red food to grow!
          </div>
        </LiquidGlass>
      </div>
    </div>
  );
}