import React from "react"
import LiquidGlass from "liquid-glass-react"

type Props = {
  tab: "appstore" | "devhome"
  onChange: (tab: "appstore" | "devhome") => void
}

export default function BottomNav({ tab, onChange }: Props) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(980px,96%)] bg-white backdrop-blur-md rounded-xl flex justify-around p-2 border border-white/10 shadow-lg z-50">
      <LiquidGlass
        onClick={() => onChange("appstore")}
        className={`flex-1 py-2 px-4 rounded-lg flex flex-col items-center gap-1 transition-all ${
          tab === "appstore" ? "text-blue-300 bg-white/5 shadow" : "text-black/70 hover:text-black/90"
        }`}
      >
        <div className="text-2xl">📦</div>
        <span className="text-sm font-medium">App Store</span>
      </LiquidGlass>
      <LiquidGlass
        displacementScale={64}
        blurAmount={0.1}
        saturation={130}
        aberrationIntensity={2}
        elasticity={0.35}
        cornerRadius={100}
        padding="8px 16px"
        onClick={() => console.log('Button clicked!')}
      >
        <span className="text-white font-medium">Click Me</span>
      </LiquidGlass>
      <LiquidGlass
        onClick={() => onChange("devhome")}
        className={`flex-1 py-2 px-4 rounded-lg flex flex-col items-center gap-1 transition-all ${
          tab === "devhome" ? "text-blue-300 bg-white/5 shadow" : "text-black/70 hover:text-black/90"
        }`}
      >
        <div className="text-2xl">💻</div>
        <span className="text-sm font-medium">Dev Home</span>
      </LiquidGlass>
    </div>
  )
}
