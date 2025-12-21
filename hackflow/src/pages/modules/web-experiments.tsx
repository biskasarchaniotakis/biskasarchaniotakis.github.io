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

export default function WebExperiments() {
  const [htmlCode, setHtmlCode] = useState("<h1>Hello World!</h1>\n<p style='color: #60a5fa;'>Edit the HTML, CSS, and JavaScript to see live changes.</p>\n<button onclick=\"alert('Button clicked!')\">Click Me</button>");
  const [cssCode, setCssCode] = useState("body {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  font-family: 'Arial', sans-serif;\n  padding: 20px;\n  min-height: 100vh;\n}\n\nh1 {\n  font-size: 2.5em;\n  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n}");
  const [jsCode, setJsCode] = useState("console.log('Web Experiment loaded!');\n\n// Add your JavaScript here\ndocument.addEventListener('DOMContentLoaded', () => {\n  console.log('DOM is ready!');\n});");

  const renderPreview = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <LiquidGlass className="p-6 bg-white/5 border border-white/10 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🌐</div>
            <h2 className="text-2xl font-semibold">Web Experiments</h2>
          </div>
          <p className="text-sm text-white/70">Live HTML, CSS, and JavaScript playground with instant preview.</p>
        </LiquidGlass>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Code Editors */}
          <div className="space-y-4">
            <LiquidGlass className="p-4 bg-white/5 border border-white/10">
              <label className="block text-sm font-medium mb-2 text-orange-400">HTML</label>
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="w-full h-32 p-3 rounded-lg bg-black/30 border border-white/10 text-white font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="<h1>Your HTML here</h1>"
              />
            </LiquidGlass>

            <LiquidGlass className="p-4 bg-white/5 border border-white/10">
              <label className="block text-sm font-medium mb-2 text-blue-400">CSS</label>
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                className="w-full h-32 p-3 rounded-lg bg-black/30 border border-white/10 text-white font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="body { color: white; }"
              />
            </LiquidGlass>

            <LiquidGlass className="p-4 bg-white/5 border border-white/10">
              <label className="block text-sm font-medium mb-2 text-yellow-400">JavaScript</label>
              <textarea
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                className="w-full h-32 p-3 rounded-lg bg-black/30 border border-white/10 text-white font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="console.log('Hello');"
              />
            </LiquidGlass>
          </div>

          {/* Preview */}
          <LiquidGlass className="p-4 bg-white/5 border border-white/10">
            <label className="block text-sm font-medium mb-2 text-green-400">Live Preview</label>
            <iframe
              srcDoc={renderPreview()}
              className="w-full h-[500px] rounded-lg border border-white/20 bg-white"
              title="preview"
              sandbox="allow-scripts"
            />
          </LiquidGlass>
        </div>
      </div>
    </div>
  );
}