import React, { useState, useRef } from "react";

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
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default function NetworkTools() {
  const [code, setCode] = useState<string>("// Write your JavaScript code here\nconsole.log('Hello from Network Tools!');\n\n// Example: Fetch API test\n// fetch('https://api.github.com').then(r => r.json()).then(console.log);");
  const [output, setOutput] = useState<string>("");

  const runCode = () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.map(a => String(a)).join(" "));

    try {
      eval(code);
      setOutput(logs.join("\n") || "✓ Code executed successfully!");
    } catch (error: any) {
      setOutput(`❌ Error: ${error.message}`);
    }

    console.log = originalLog;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <LiquidGlass className="p-6 bg-white/5 border border-white/10 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🔌</div>
            <h2 className="text-2xl font-semibold">Network Tools</h2>
          </div>
          <p className="text-sm text-white/70">Offline JS/HTML tools for network experiments and testing.</p>
        </LiquidGlass>

        <LiquidGlass className="p-6 bg-white/5 border border-white/10">
          <label className="block text-sm font-medium mb-2">JavaScript Code Editor</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-72 p-4 rounded-lg bg-black/30 border border-white/10 text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write JavaScript code here..."
          />

          <button
            onClick={runCode}
            className="mt-4 px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition font-medium shadow-lg shadow-blue-500/30 active:scale-95"
          >
            ▶ Run Code
          </button>

          {output && (
            <LiquidGlass className="mt-4 p-4 bg-black/30 border border-white/10">
              <div className="font-semibold mb-2 text-blue-400">Console Output:</div>
              <pre className="text-sm text-green-400 whitespace-pre-wrap font-mono">{output}</pre>
            </LiquidGlass>
          )}
        </LiquidGlass>

        <LiquidGlass className="mt-6 p-4 bg-white/5 border border-white/10">
          <div className="text-xs text-white/50">
            <strong>Tip:</strong> You can test fetch requests, manipulate DOM, or run any JavaScript code. Results will appear in the console output.
          </div>
        </LiquidGlass>
      </div>
    </div>
  );
}