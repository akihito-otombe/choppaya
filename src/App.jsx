import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export default function App() {
  return (
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">choppaya — Clean Start</h1>
      <p className="text-slate-600 mb-6">Vite + React 19 + Tailwind をGitHubだけで構築。</p>
      <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
        <CheckCircle size={18} />
        <span>OK。あとで Canvas の React コードを <code>src/App.jsx</code> に貼り替えてください。</span>
      </div>
    </motion.div>
  )
}
