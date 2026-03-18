'use client'

import { useEffect, useState, useRef } from 'react'

interface CounterProps {
    end: number
    duration?: number
    suffix?: string
    decimals?: number
}

export function Counter({ end, duration = 2000, suffix = '', decimals = 0 }: CounterProps) {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const elementRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                } else {
                    // Se quiser que reinicie toda vez que sai e volta:
                    // setIsVisible(false); setCount(0);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px' // Margem para garantir que o usuário veja
            }
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let startTimestamp: number | null = null
        let animationFrame: number

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)

            // Easing function: easeOutExpo
            const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

            setCount(easing * end)

            if (progress < 1) {
                animationFrame = window.requestAnimationFrame(step)
            }
        }

        animationFrame = window.requestAnimationFrame(step)

        return () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame)
        }
    }, [isVisible, end, duration])

    return (
        <span ref={elementRef} className="inline-block min-w-[1ch]">
            {Math.round(count).toLocaleString('pt-BR', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}
            {suffix}
        </span>
    )
}
