'use client'

import { useState } from 'react'
import { SendHorizontal, Sparkles, MessageSquare, Bot, ArrowRight, Users, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CorretorVirtual() {
    const [input, setInput] = useState('')
    const [isRecording, setIsRecording] = useState(false)

    const suggestions = [
        'Opções para investimentos em Florianópolis',
        'Lançamentos em Balneário Camboriú',
        'Apartamentos com 3 suítes até R$ 2M',
        'Coberturas em Itapema',
    ]

    return (
        <section className="py-24 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950/20">
            {/* Decorative details */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-white/10 to-transparent" />

            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
                            Corretor Virtual
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            Respostas imediatas sobre dúvidas, sugestões personalizadas de imóveis com base no seu perfil.
                        </p>
                    </div>

                    {/* Chat Interface structure */}
                    <div className="relative group">
                        {/* Glossy Background decoration */}
                        <div className="absolute -inset-4 bg-gradient-to-b from-accent/10 to-transparent blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700" />

                        <div className="relative bg-white dark:bg-zinc-900/50 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm">
                            {/* Chat Window Header */}
                            <div className="bg-zinc-900 dark:bg-zinc-800/80 px-6 py-4 flex items-center justify-between border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <div className="absolute inset-0 bg-emerald-500/40 rounded-full animate-ping" />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/80">
                                        Assistente Ativo
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 opacity-60">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">
                                        Resposta Instantânea
                                    </span>
                                </div>
                            </div>

                            {/* Chat Message Content Area */}
                            <div className="p-8 md:p-12 min-h-[350px] flex flex-col items-center justify-center text-center space-y-10">
                                <div className="space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                                        <Bot className="h-8 w-8 text-accent shrink-0" />
                                    </div>
                                    <p className="text-2xl font-serif italic text-zinc-700 dark:text-zinc-300">
                                        Olá! Como posso ajudar você hoje?
                                    </p>
                                    <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto font-medium">
                                        Descreva o imóvel dos seus sonhos, o tamanho da sua família, ou faça uma pergunta sobre nossos serviços.
                                    </p>
                                </div>

                                {/* Suggestion Pills */}
                                <div className="flex flex-wrap justify-center gap-3">
                                    {suggestions.map((text, i) => (
                                        <button
                                            key={i}
                                            className="px-5 py-2.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-accent/40 text-[13px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-accent transition-all duration-300 shadow-sm"
                                        >
                                            {text}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="bg-zinc-50/50 dark:bg-black/20 p-6 border-t border-zinc-200 dark:border-white/5">
                                <div className="relative max-w-3xl mx-auto group/input">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={isRecording ? "Ouvindo..." : "Ex: Tenho 3 filhos e quero um apartamento no centro de Florianópolis"}
                                        className="w-full h-14 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-2xl pl-6 pr-28 text-sm font-medium focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
                                    />
                                    <div className="absolute right-2 top-2 flex items-center gap-2">
                                        <button
                                            onClick={() => setIsRecording(!isRecording)}
                                            className={cn(
                                                "h-10 w-10 flex items-center justify-center rounded-xl transition-all border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5",
                                                isRecording ? "bg-red-500/10 border-red-500/50 text-red-500 animate-pulse" : "bg-zinc-50 dark:bg-zinc-800 text-zinc-400"
                                            )}
                                        >
                                            <Mic className="h-4 w-4" />
                                        </button>
                                        <button className="h-10 w-10 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg group-hover/input:shadow-accent/20">
                                            <SendHorizontal className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subtext info */}
                        <div className="mt-6 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                            <span className="flex items-center gap-2">
                                <MessageSquare className="h-3 w-3" /> Tempo médio: 3s
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Graphic elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />
        </section>
    )
}
