import React from "react"
import { useRouter } from "next/router"

const devModules = [
  { name: "Dev Chat", desc: "Chat with other devs", icon: "💬", path: "/hackflow/modules/dev-chat" },
  { name: "Help Chat", desc: "Guides & notes", icon: "❓", path: "/hackflow/modules/help-chat" },
  { name: "Web Playground", desc: "Run JS/HTML", icon: "📝", path: "/hackflow/modules/web-playground" },
  { name: "iOS VSC", desc: "Mini code editor", icon: "🖥️", path: "/hackflow/modules/ios-vsc" },
]

export default function DevHome() {
  const router = useRouter()

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {devModules.map((m) => (
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
