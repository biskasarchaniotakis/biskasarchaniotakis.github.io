import React, { useState, useRef } from "react";

// Liquid Glass Component
const LiquidGlass = ({ children, onClick, className = "", style = {} }: any) => {
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
      onClick={onClick}
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

interface Shortcut {
  name: string;
  icon: string;
  url: string;
  color: string;
}

export default function ShortcutsLauncher() {
    const [customName, setCustomName] = useState("");
    const [customUrl, setCustomUrl] = useState("");

    const shortcuts: Shortcut[] = [
        { name: "WiFi Toggle", icon: "📶", url: "shortcuts://run-shortcut?name=WiFi", color: "from-blue-500 to-cyan-500" },
        { name: "Low Power Mode", icon: "🔋", url: "shortcuts://run-shortcut?name=LowPower", color: "from-green-500 to-emerald-500" },
        { name: "Flashlight", icon: "🔦", url: "shortcuts://run-shortcut?name=Flashlight", color: "from-yellow-500 to-orange-500" },
        { name: "Screenshot", icon: "📸", url: "shortcuts://run-shortcut?name=Screenshot", color: "from-purple-500 to-pink-500" },
        { name: "Dark Mode", icon: "🌙", url: "shortcuts://run-shortcut?name=DarkMode", color: "from-indigo-500 to-purple-500" },
        { name: "Do Not Disturb", icon: "🔕", url: "shortcuts://run-shortcut?name=DND", color: "from-red-500 to-pink-500" },
    ];

    const launchShortcut = (shortcut: Shortcut) => {
        try {
            window.location.href = shortcut.url;
            setTimeout(() => {
                console.log(`Launched: ${shortcut.name}`);
            }, 100);
        } catch (error) {
            alert(`⚠️ Unable to launch ${shortcut.name}. Make sure the shortcut exists in your Shortcuts app.`);
        }
    };

    const launchCustomShortcut = () => {
        if (!customName.trim()) {
            alert("⚠️ Please enter a shortcut name");
            return;
        }
        const url = customUrl.trim() || `shortcuts://run-shortcut?name=${encodeURIComponent(customName)}`;
        window.location.href = url;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white p-4 sm:p-6">
            <div className="max-w-5xl mx-auto">
                <LiquidGlass className="p-6 bg-white/5 border border-white/10 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="text-3xl">⚡</div>
                        <h2 className="text-2xl font-semibold">Shortcuts Launcher</h2>
                    </div>
                    <p className="text-sm text-white/70">Quickly trigger iOS Shortcuts with a tap.</p>
                </LiquidGlass>

                {/* Pre-defined Shortcuts */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {shortcuts.map((shortcut) => (
                        <LiquidGlass
                            key={shortcut.name}
                            onClick={() => launchShortcut(shortcut)}
                            className="p-6 bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition text-center active:scale-95"
                        >
                            <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${shortcut.color} flex items-center justify-center text-3xl shadow-lg`}>
                                {shortcut.icon}
                            </div>
                            <div className="font-medium">{shortcut.name}</div>
                        </LiquidGlass>
                    ))}
                </div>

                {/* Custom Shortcut Launcher */}
                <LiquidGlass className="p-6 bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4">Launch Custom Shortcut</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-2">Shortcut Name</label>
                            <input
                                type="text"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                placeholder="e.g., MyCustomShortcut"
                                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Custom URL (Optional)</label>
                            <input
                                type="text"
                                value={customUrl}
                                onChange={(e) => setCustomUrl(e.target.value)}
                                placeholder="shortcuts://run-shortcut?name=..."
                                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={launchCustomShortcut}
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition active:scale-95"
                        >
                            🚀 Launch
                        </button>
                    </div>
                </LiquidGlass>

                <LiquidGlass className="mt-6 p-4 bg-white/5 border border-white/10">
                    <div className="text-xs text-white/50">
                        <strong>Note:</strong> These shortcuts will only work if you have them created in your iOS Shortcuts app with matching names.
                    </div>
                </LiquidGlass>
            </div>
        </div>
    );
}
