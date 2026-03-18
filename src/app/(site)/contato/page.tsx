import { MapPin, Mail, Phone, Building } from 'lucide-react'
import { FormContato } from '@/components/site/FormContato'

export default function ContatoPage() {
  return (
    <div className="container pt-32 pb-12 md:pt-40 md:pb-20 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Fale Conosco</h1>
            <p className="text-lg text-muted-foreground">
              Pode mandar uma mensagem ou ligar. Estamos aqui para responder qualquer dúvida, sem enrolação.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Nosso Endereço</h3>
                <p className="text-muted-foreground">Rua Exemplo, 123 - Sala 45<br />Centro, Cidade - UF</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Telefone / WhatsApp</h3>
                <p className="text-muted-foreground">+55 (11) 99999-9999<br />+55 (11) 3333-3333</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">E-mail</h3>
                <p className="text-muted-foreground">contato@imobiliariexemplo.com.br</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 md:p-8 rounded-3xl shadow-lg border">
          <h2 className="text-2xl font-bold mb-6">Envie uma Mensagem</h2>
          <FormContato />
        </div>
      </div>
    </div>
  )
}
