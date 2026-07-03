import { ArrowUpRight, Lock, Sparkles } from "lucide-react"

export function AiChatPlaceholder() {
  return (
    <div className="group w-full max-w-lg">
      <div className="relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-1.5 shadow-2xl ring-1 ring-white/5 backdrop-blur-xl transition-all duration-500 hover:border-zinc-600/50 hover:bg-zinc-900/80">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />

        <div className="relative flex items-center gap-4 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-300">
            <Sparkles width={18} height={18} strokeWidth={1.5} />
          </div>

          <div className="flex flex-1 flex-col text-left">
            <span className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              Asistente IA
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs font-normal tracking-wide text-zinc-400">
                Beta
              </span>
            </span>
            <div className="mt-0.5 flex items-center gap-1">
              <span className="text-xs text-zinc-500">Iniciando sistemas de lenguaje</span>
              <span className="animate-subtle-pulse text-xs text-zinc-500">...</span>
            </div>
          </div>

          <button
            type="button"
            disabled
            aria-label="Enviar mensaje (no disponible)"
            className="flex cursor-not-allowed items-center justify-center rounded-xl border border-transparent bg-zinc-800/50 p-2 text-zinc-600 transition-colors group-hover:bg-zinc-800 group-hover:text-zinc-500"
          >
            <ArrowUpRight width={20} height={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1 text-xs font-normal tracking-wide text-zinc-600">
        <Lock width={14} height={14} strokeWidth={1.5} />
        El chat estará disponible al finalizar la remodelación.
      </p>
    </div>
  )
}
