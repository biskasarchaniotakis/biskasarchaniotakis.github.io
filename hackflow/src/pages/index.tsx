import React, { useState, useRef } from 'react';

// Type definitions
interface LiquidGlassProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  cornerRadius?: number;
  style?: React.CSSProperties;
}

interface BottomNavProps {
  tab: 'appstore' | 'devhome';
  onChange: (tab: 'appstore' | 'devhome') => void;
}

interface Module {
  name: string;
  desc: string;
  icon: string;
  path: string;
}

interface AppStoreProps {
  onModuleClick: (module: Module) => void;
}

interface DevHomeProps {
  onModuleClick: (module: Module) => void;
}

// Liquid Glass Component (simplified version based on the library)
const LiquidGlass: React.FC<LiquidGlassProps> = ({ 
  children, 
  onClick, 
  className = '',
  displacementScale = 60,
  blurAmount = 0.2,
  saturation = 130,
  aberrationIntensity = 2,
  elasticity = 0.2,
  cornerRadius = 18,
  style = {},
  ...props 
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: `${cornerRadius}px`,
        backdropFilter: `blur(${blurAmount * 20}px) saturate(${saturation}%)`,
        ...style
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      {isHovered && (
        <div
          className="absolute pointer-events-none transition-all duration-200"
          style={{
            width: `${displacementScale * 4}px`,
            height: `${displacementScale * 4}px`,
            left: mousePos.x - (displacementScale * 2),
            top: mousePos.y - (displacementScale * 2),
            background: `radial-gradient(circle, rgba(59, 130, 246, ${aberrationIntensity * 0.2}) 0%, transparent 70%)`,
            filter: 'blur(30px)',
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Bottom Navigation Component
const BottomNav: React.FC<BottomNavProps> = ({ tab, onChange }) => {
  return (
    <div className="flex justify-around items-center p-2 gap-2">
      <button
        onClick={() => onChange("appstore")}
        className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center gap-1 transition-all ${
          tab === "appstore" 
            ? "text-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/30" 
            : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
      >
        <div className="text-2xl">📦</div>
        <span className="text-sm font-medium">App Store</span>
      </button>

      <button
        onClick={() => onChange("devhome")}
        className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center gap-1 transition-all ${
          tab === "devhome" 
            ? "text-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/30" 
            : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
      >
        <div className="text-2xl">💻</div>
        <span className="text-sm font-medium">Dev Home</span>
      </button>
    </div>
  );
};

// App Store Component
const AppStore: React.FC<AppStoreProps> = ({ onModuleClick }) => {
  const [installedApps, setInstalledApps] = useState<string[]>([]);

  const modules: Module[] = [
    { name: "Network Tools", desc: "Offline JS/HTML Tools", icon: "🔌", path: "/hackflow/modules/network-tools" },
    { name: "Web Experiments", desc: "Run JS playground", icon: "🌐", path: "/hackflow/modules/web-experiments" },
    { name: "Shortcuts Launcher", desc: "Trigger Shortcuts", icon: "⚡", path: "/hackflow/modules/shortcuts-launcher" },
  ];

  const handleInstall = (e: React.MouseEvent<HTMLButtonElement>, moduleName: string) => {
    e.stopPropagation();
    if (installedApps.includes(moduleName)) {
      setInstalledApps(installedApps.filter(name => name !== moduleName));
    } else {
      setInstalledApps([...installedApps, moduleName]);
    }
  };

  return (
    <div className="p-4 sm:p-6 pb-24">
      <h2 className="text-2xl font-bold mb-6 text-white/90">Available Apps</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {modules.map((m) => {
          const isInstalled = installedApps.includes(m.name);
          return (
            <div
              key={m.name}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 cursor-pointer hover:bg-white/10 transition-all hover:border-white/20"
              onClick={() => onModuleClick(m)}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{m.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base sm:text-lg text-white">{m.name}</div>
                  <div className="text-xs sm:text-sm text-white/60 mt-1">{m.desc}</div>
                </div>
              </div>
              <button
                onClick={(e) => handleInstall(e, m.name)}
                className={`w-full mt-4 py-3 px-4 rounded-xl font-medium transition-all active:scale-95 ${
                  isInstalled
                    ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                    : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30"
                }`}
              >
                {isInstalled ? "✓ Installed" : "Install"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Dev Home Component
const DevHome: React.FC<DevHomeProps> = ({ onModuleClick }) => {
  const devModules: Module[] = [
    { name: "Dev Chat", desc: "Chat with other devs", icon: "💬", path: "/hackflow/modules/dev-chat" },
    { name: "Help Chat", desc: "Guides & notes", icon: "❓", path: "/hackflow/modules/help-chat" },
    { name: "Web Playground", desc: "Run JS/HTML", icon: "📝", path: "/hackflow/modules/web-playground" },
    { name: "iOS VSC", desc: "Mini code editor", icon: "🖥️", path: "/hackflow/modules/ios-vsc" },
  ];

  return (
    <div className="p-6 pb-24">
      <h2 className="text-2xl font-bold mb-6 text-white/90">Developer Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {devModules.map((m) => (
          <div
            key={m.name}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:scale-105 hover:bg-white/10 transition-all hover:border-white/20"
            onClick={() => onModuleClick(m)}
          >
            <div className="text-4xl mb-3">{m.icon}</div>
            <div className="font-semibold text-lg text-white">{m.name}</div>
            <div className="text-sm text-white/60 mt-2">{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App
export default function Home() {
  const [navTab, setNavTab] = useState<'appstore' | 'devhome'>('appstore');

  const handleModuleClick = (module: Module) => {
    alert(`Navigating to: ${module.name}\nPath: ${module.path}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
      <header className="text-center p-4 text-2xl font-bold bg-black/20 backdrop-blur sticky top-0 z-10 border-b border-white/10">
        Hackflow
      </header>

      <main className="flex-1 overflow-auto">
        {navTab === "appstore" && <AppStore onModuleClick={handleModuleClick} />}
        {navTab === "devhome" && <DevHome onModuleClick={handleModuleClick} />}
      </main>

      {/* Fixed Bottom Navigation with Liquid Glass Effect */}
      <LiquidGlass
        displacementScale={60}
        blurAmount={0.3}
        saturation={140}
        aberrationIntensity={2.5}
        elasticity={0.2}
        cornerRadius={20}
        style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "1rem",
          width: "min(980px, 96%)",
          zIndex: 60,
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <BottomNav tab={navTab} onChange={setNavTab} />
      </LiquidGlass>
    </div>
  );
}