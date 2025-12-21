import React from "react"
import { useRouter } from "next/router"

const modules = [
  { name: "Network Tools", desc: "Offline JS/HTML Tools", icon: "🔌", path: "/hackflow/modules/network-tools" },
  { name: "Web Experiments", desc: "Run JS playground", icon: "🌐", path: "/hackflow/modules/web-experiments" },
  { name: "Shortcuts Launcher", desc: "Trigger Shortcuts", icon: "⚡", path: "/hackflow/modules/shortcuts-launcher" },
]

export default function AppStore() {
  const router = useRouter()

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {modules.map((m) => (
          <div
            key={m.name}
            className="card bg-white/5 border border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => router.push(m.path)}
          >
            <div className="icon text-3xl mb-3">{m.icon}</div>
            <div className="font-semibold text-lg">{m.name}</div>
            <div className="text-sm text-white/60 mt-2">{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
