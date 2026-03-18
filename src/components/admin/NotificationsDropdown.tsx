'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Clock, AlertTriangle, CheckCircle, FileText, User, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
    id: string
    title: string
    description: string
    time: string
    type: 'info' | 'warning' | 'success' | 'urgent'
    icon: React.ElementType
    read: boolean
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Aluguel Atrasado',
        description: 'Imóvel: Apt. Moderno — Bela Vista. Inquilino: Maria Fernanda.',
        time: '2 horas atrás',
        type: 'urgent',
        icon: AlertTriangle,
        read: false,
    },
    {
        id: '2',
        title: 'Nova Proposta',
        description: 'Recebida proposta de R$ 3.2M para Casa Espetacular — Jardins.',
        time: '5 horas atrás',
        type: 'info',
        icon: FileText,
        read: false,
    },
    {
        id: '3',
        title: 'Manutenção Concluída',
        description: 'Reparo na rede elétrica concluído — Cobertura Duplex.',
        time: 'Ontem',
        type: 'success',
        icon: CheckCircle,
        read: true,
    },
    {
        id: '4',
        title: 'Novo Lead',
        description: 'João Gabriel demonstrou interesse via site.',
        time: 'Ontem',
        type: 'info',
        icon: User,
        read: true,
    },
]

export function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState(mockNotifications)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const unreadCount = notifications.filter(n => !n.read).length

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors border border-white/5",
                    isOpen ? "bg-white/10 text-white border-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
            >
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-zinc-900" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-white/5 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <h3 className="text-sm font-bold text-white">Notificações</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-[10px] uppercase tracking-wider font-bold text-accent hover:text-accent/80 transition-colors"
                            >
                                Ler todas
                            </button>
                        )}
                    </div>

                    <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-white/[0.03]">
                                {notifications.map((n) => {
                                    const Icon = n.icon
                                    return (
                                        <div
                                            key={n.id}
                                            className={cn(
                                                "p-4 hover:bg-white/[0.02] transition-colors flex gap-3 group relative",
                                                !n.read && "bg-accent/[0.02]"
                                            )}
                                        >
                                            {!n.read && (
                                                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full" />
                                            )}
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                                n.type === 'urgent' ? 'bg-red-500/10 text-red-500' :
                                                    n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        n.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                                                            'bg-blue-500/10 text-blue-500'
                                            )}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className={cn("text-xs font-semibold leading-tight mb-0.5", n.read ? "text-zinc-300" : "text-white")}>
                                                    {n.title}
                                                </p>
                                                <p className="text-[11px] text-zinc-500 leading-normal line-clamp-2">
                                                    {n.description}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-zinc-600 font-medium uppercase tracking-tight">
                                                    <Clock className="h-3 w-3" />
                                                    {n.time}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-sm text-zinc-500">Nenhuma notificação</p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-white/5 bg-white/[0.02]">
                        <button className="w-full py-2 text-[11px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider">
                            Ver histórico completo
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
