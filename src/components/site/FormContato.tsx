'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
// Simulando componentes do Shadcn que talvez não tenha adicionado:
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
// Vamos criar um form simples nativo com estilos base para contornar

import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea' // Não adicionamos ainda

export function FormContato({ imovelId }: { imovelId?: string }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Simplificando o form por enquanto enquanto não geramos os componentes do shadcn (Form, Textarea)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      telefone: formData.get('telefone'),
      mensagem: formData.get('mensagem'),
      imovel_id: imovelId,
      origem: 'site',
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setSuccess(true)
        e.currentTarget.reset()
      } else {
        alert('Erro ao enviar o contato. Tente novamente.')
      }
    } catch (error) {
      alert('Erro interno. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-6 bg-green-50 text-green-700 rounded-xl text-center">
        <h3 className="font-semibold text-lg mb-2">Mensagem enviada!</h3>
        <p>Recebemos seu contato e retornamos em breve.</p>
        <Button variant="outline" className="mt-4" onClick={() => setSuccess(false)}>
          Enviar nova mensagem
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="nome" className="text-sm font-medium">Nome Completo</label>
        <Input id="nome" name="nome" placeholder="Seu nome" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">E-mail</label>
          <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
        </div>
        <div className="space-y-2">
          <label htmlFor="telefone" className="text-sm font-medium">Telefone/WhatsApp</label>
          <Input id="telefone" name="telefone" placeholder="(00) 00000-0000" required />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="mensagem" className="text-sm font-medium">Mensagem</label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
          placeholder="Olá, tenho interesse neste imóvel e gostaria de mais informações..."
          required
        ></textarea>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar Mensagem'}
      </Button>
    </form>
  )
}
