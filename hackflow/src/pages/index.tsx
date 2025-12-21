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
  const [installing, setInstalling] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const modules: Module[] = [
    { name: "Network Tools", desc: "Offline JS/HTML Tools", icon: "🔌", path: "/hackflow/modules/network-tools" },
    { name: "Web Experiments", desc: "Run JS playground", icon: "🌐", path: "/hackflow/modules/web-experiments" },
    { name: "Shortcuts Launcher", desc: "Trigger Shortcuts", icon: "⚡", path: "/hackflow/modules/shortcuts-launcher" },
    { name: "Snake Game", desc: "Classic snake game", icon: "🐍", path: "/hackflow/modules/snake-game" },
    { name: "2048 Game", desc: "Addictive number puzzle", icon: "🎮", path: "/hackflow/modules/2048-game" },
  ];

  // Load installed apps from persistent storage on mount
  React.useEffect(() => {
    const loadInstalledApps = async () => {
      try {
        const result = await (window as any).storage.get('hackflow-installed-apps');
        if (result && result.value) {
          const apps = JSON.parse(result.value);
          setInstalledApps(apps);
        }
      } catch (error) {
        console.log('No saved installation state found');
      } finally {
        setLoading(false);
      }
    };
    loadInstalledApps();
  }, []);

  // Save installed apps to persistent storage whenever it changes
  React.useEffect(() => {
    if (!loading) {
      const saveInstalledApps = async () => {
        try {
          await (window as any).storage.set('hackflow-installed-apps', JSON.stringify(installedApps));
        } catch (error) {
          console.error('Failed to save installation state:', error);
        }
      };
      saveInstalledApps();
    }
  }, [installedApps, loading]);

  const handleInstall = async (e: React.MouseEvent<HTMLButtonElement>, module: Module) => {
    e.stopPropagation();
    
    if (installedApps.includes(module.name)) {
      // Uninstall
      setInstalledApps(installedApps.filter(name => name !== module.name));
      return;
    }

    // Install
    setInstalling(module.name);
    
    try {
      // Convert module name to filename (e.g., "Network Tools" -> "network-tools")
      const fileName = module.name.toLowerCase().replace(/\s+/g, '-');
      const configUrl = `/config/${fileName}.mobileconfig`;
      
      // Fetch the .mobileconfig file
      const response = await fetch(configUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch configuration file');
      }
      
      const configText = await response.text();
      
      // Create blob and download
      const blob = new Blob([configText], { type: 'application/x-apple-aspen-config' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${fileName}.mobileconfig`;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(downloadUrl);
      
      // Mark as installed
      setInstalledApps([...installedApps, module.name]);
      
      // Show success message (toast would be better but keeping it simple)
      alert(`✅ ${module.name} profile downloaded. If on iOS, Safari will prompt installation.`);
      
    } catch (error) {
      console.error('Installation error:', error);
      alert(`⚠️ Failed to install ${module.name}. Make sure the configuration file exists.`);
    } finally {
      setInstalling(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white/90">Available Apps</h2>
          {!loading && installedApps.length > 0 && (
            <p className="text-sm text-green-400 mt-1">
              {installedApps.length} app{installedApps.length !== 1 ? 's' : ''} installed
            </p>
          )}
        </div>
        {!loading && installedApps.length > 0 && (
          <button
            onClick={async () => {
              if (confirm('Clear all installation records? This will not uninstall the apps from your device.')) {
                setInstalledApps([]);
              }
            }}
            className="px-3 py-2 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition"
          >
            Clear All
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <div className="mt-4 text-white/70">Checking installed apps...</div>
        </div>
      ) : (
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
                  onClick={(e) => handleInstall(e, m)}
                  disabled={installing === m.name}
                  className={`w-full mt-4 py-3 px-4 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isInstalled
                      ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                      : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30"
                  }`}
                >
                  {installing === m.name ? "⏳ Installing..." : isInstalled ? "✓ Installed" : "Install"}
                </button>
              </div>
            );
          })}
        </div>
      )}
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
  const [showBrowserWarning, setShowBrowserWarning] = useState(false);

  // Check if user is on Safari
  React.useEffect(() => {
    const userAgent = navigator.userAgent;
    const isSafari = /^((?!chrome|crios|android|edg|firefox|fxios|samsungbrowser).)*safari/i.test(userAgent);
    if (!isSafari && navTab === 'appstore') {
      setShowBrowserWarning(true);
    } else {
      setShowBrowserWarning(false);
    }
  }, [navTab]);

  const handleModuleClick = (module: Module) => {
    alert(`Navigating to: ${module.name}\nPath: ${module.path}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
      <header className="text-center p-4 text-2xl font-bold bg-black/20 backdrop-blur sticky top-0 z-10 border-b border-white/10">
        Hackflow
      </header>

      {/* Browser Warning */}
      {showBrowserWarning && (
        <div className="mx-4 mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
          <div className="text-2xl">⚠️</div>
          <div className="flex-1">
            <div className="font-semibold text-yellow-400">Safari Recommended</div>
            <div className="text-sm text-yellow-200/80 mt-1">
              For best results installing .mobileconfig files on iOS, please use Safari browser.
            </div>
          </div>
          <button 
            onClick={() => setShowBrowserWarning(false)}
            className="text-yellow-400 hover:text-yellow-300"
          >
            ✕
          </button>
        </div>
      )}

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