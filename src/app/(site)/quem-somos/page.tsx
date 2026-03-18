import Image from 'next/image'

export default function QuemSomosPage() {
  return (
    <div className="container pt-32 pb-12 md:pt-40 md:pb-20 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Quem Somos</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Mais de 10 anos ajudando famílias e empresas a encontrar o imóvel certo, sem complicação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            {/* Aqui entraria uma foto da equipe ou do escritório */}
            <span className="text-muted-foreground font-medium">Foto da Equipe / Escritório</span>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Nossa História</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Nascemos com um objetivo claro: tornar a busca por imóvel mais fácil e menos estressante. Comprar, alugar ou vender não precisa ser complicado — e a gente está aqui para provar isso.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Usamos tecnologia para facilitar o processo, mas o atendimento é sempre humano. Nossa equipe ouve o que você precisa e te ajuda a tomar a melhor decisão, sem pressão.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">+1.000</h3>
              <p className="font-medium text-foreground">Imóveis Negociados</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">98%</h3>
              <p className="font-medium text-foreground">Clientes Satisfeitos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
