import React, { useState } from "react"

export default function NetworkTools() {
  const [code, setCode] = useState<string>("Write your JS/HTML code here...")

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Network Tools</h2>
      <p className="text-sm text-white/70 mb-4">Offline JS/HTML tools for network experiments.</p>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-72 p-3 rounded-lg bg-black/20 border border-white/10" />
      <div className="mt-4">
        <button onClick={() => alert("Simulated run!")} className="px-4 py-2 bg-blue-500 rounded-md">Run</button>
      </div>
    </div>
  )
}
