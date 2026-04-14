-- =============================================================================
-- HOME Imob — Seed de Dados Mock
-- Gerado em: 2026-04-14
-- Executar no Supabase Dashboard > SQL Editor
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CLIENTES (15)
-- -----------------------------------------------------------------------------
INSERT INTO public.clientes (id, nome, tipo_pessoa, cpf_cnpj, email, telefone, endereco, papeis, notas, created_at, updated_at) VALUES
('00000000-0000-0000-0001-000000000001', 'Rodrigo Schaefer', 'PF', '042.331.989-10', 'rodrigo.schaefer@gmail.com', '(48) 99901-2233', 'Rua das Nações, 245, Jurerê Internacional, Florianópolis/SC', ARRAY['proprietario'], 'Proprietário do apartamento na Trindade. Prefere contato por WhatsApp.', NOW() - INTERVAL '8 months', NOW()),
('00000000-0000-0000-0001-000000000002', 'Fernanda Wachholz', 'PF', '187.654.321-00', 'fernanda.wachholz@outlook.com', '(48) 99834-5567', 'Av. Beira Mar Norte, 3040, Apto 602, Florianópolis/SC', ARRAY['proprietario'], 'Proprietária do studio no Itacorubi. Exigente com triagem de inquilinos.', NOW() - INTERVAL '9 months', NOW()),
('00000000-0000-0000-0001-000000000003', 'Carlos Meurer', 'PF', '356.789.012-34', 'carlos.meurer@hotmail.com', '(48) 98877-4411', 'Rua das Gaivotas, 110, Ingleses, Florianópolis/SC', ARRAY['proprietario'], 'Proprietário da casa nos Ingleses. Mora no interior do estado.', NOW() - INTERVAL '10 months', NOW()),
('00000000-0000-0000-0001-000000000004', 'Beatriz Zimmermann', 'PF', '521.098.765-43', 'beatriz.zimmermann@gmail.com', '(47) 98855-3322', 'Rua do Príncipe, 550, Centro, Joinville/SC', ARRAY['proprietario'], 'Proprietária de apartamento em Joinville. Investidora com 3 imóveis na carteira.', NOW() - INTERVAL '7 months', NOW()),
('00000000-0000-0000-0001-000000000005', 'André Becker', 'PF', '698.543.210-87', 'andre.becker@email.com', '(47) 99700-8822', 'Rua Joinville, 1200, Cordeiros, Itajaí/SC', ARRAY['proprietario'], 'Proprietário em Itajaí. Comprou o imóvel como investimento.', NOW() - INTERVAL '6 months', NOW()),
('00000000-0000-0000-0001-000000000006', 'Patrícia Lange', 'PF', '789.012.345-67', 'patricia.lange@gmail.com', '(48) 99922-1144', 'Rua Dep. Antônio Edu Vieira, 390, Apto 201, Trindade, Florianópolis/SC', ARRAY['inquilino'], 'Inquilina modelo. Nunca atrasou um pagamento.', NOW() - INTERVAL '5 months', NOW()),
('00000000-0000-0000-0001-000000000007', 'Lucas Reinhardt', 'PF', '234.567.890-12', 'lucas.reinhardt@outlook.com', '(48) 98811-7766', 'Rua Lauro Linhares, 900, Apto 304, Itacorubi, Florianópolis/SC', ARRAY['inquilino'], 'Programador, trabalha em home office. Muito zeloso com o imóvel.', NOW() - INTERVAL '9 months', NOW()),
('00000000-0000-0000-0001-000000000008', 'Mariana Furtado', 'PF', '345.678.901-23', 'mariana.furtado@gmail.com', '(48) 99833-5500', 'Rua das Gaivotas, 110, Casa, Ingleses, Florianópolis/SC', ARRAY['inquilino'], 'Família com 2 filhos. Contrato de 30 meses.', NOW() - INTERVAL '4 months', NOW()),
('00000000-0000-0000-0001-000000000009', 'Gabriel Oliveira', 'PF', '456.789.012-34', 'gabriel.oliveira@hotmail.com', '(47) 98899-2211', 'Rua do Príncipe, 500, Centro, Joinville/SC', ARRAY['inquilino'], 'Recém transferido do Rio de Janeiro para trabalhar na WEG.', NOW() - INTERVAL '3 months', NOW()),
('00000000-0000-0000-0001-000000000010', 'Camila Ramos', 'PF', '567.890.123-45', 'camila.ramos@gmail.com', '(47) 99744-6633', 'Rua Joinville, 1100, Apto 102, Cordeiros, Itajaí/SC', ARRAY['inquilino', 'comprador'], 'Interessada em comprar o imóvel ao final do contrato de locação.', NOW() - INTERVAL '2 months', NOW()),
('00000000-0000-0000-0001-000000000011', 'Felipe Teixeira', 'PF', '678.901.234-56', 'felipe.teixeira@email.com', '(48) 99611-4455', 'Rua Bocaiúva, 2100, Centro, Florianópolis/SC', ARRAY['comprador'], 'Empresário. Quer comprar na planta ou seminovo em Florianópolis.', NOW() - INTERVAL '1 month', NOW()),
('00000000-0000-0000-0001-000000000012', 'Juliana Soares', 'PF', '789.012.345-78', 'juliana.soares@outlook.com', '(47) 98733-9900', 'Rua 2400, 80, Nações, Balneário Camboriú/SC', ARRAY['comprador'], 'Médica. Procura apartamento de alto padrão em BC ou Floripa.', NOW() - INTERVAL '3 weeks', NOW()),
('00000000-0000-0000-0001-000000000013', 'Henrique Borges', 'PF', '890.123.456-89', 'henrique.borges@gmail.com', '(47) 99522-3388', 'Rua Joaquim Nabuco, 620, América, Joinville/SC', ARRAY['proprietario', 'vendedor'], 'Vende casa própria para se mudar para Florianópolis.', NOW() - INTERVAL '5 weeks', NOW()),
('00000000-0000-0000-0001-000000000014', 'Construtora Litoral SC Ltda', 'PJ', '12.345.678/0001-90', 'contato@litoralsc.com.br', '(48) 3322-7700', 'Av. Hercílio Luz, 900, sala 502, Centro, Florianópolis/SC', ARRAY['proprietario'], 'Construtora parceira. Carteira de imóveis comerciais em Florianópolis e BC.', NOW() - INTERVAL '1 year', NOW()),
('00000000-0000-0000-0001-000000000015', 'Farmácias Rede Sul Ltda', 'PJ', '98.765.432/0001-10', 'expansao@redesul.com.br', '(47) 3344-5566', 'Rua Jerônimo Coelho, 200, Centro, Joinville/SC', ARRAY['inquilino'], 'Rede em expansão. Locam pontos comerciais em cidades de SC.', NOW() - INTERVAL '8 months', NOW());

-- -----------------------------------------------------------------------------
-- 2. IMÓVEIS (30) — ON CONFLICT DO NOTHING para idempotência
-- -----------------------------------------------------------------------------
INSERT INTO public.imoveis
  (slug, titulo, descricao, tipo, finalidade, preco, area_m2, quartos, banheiros, vagas, endereco, bairro, cidade, uf, cep, destaque, status, updated_at)
VALUES
('casa-jurere-internacional-florianopolis','Casa de Alto Padrão em Jurerê Internacional','Residência de luxo em condomínio fechado com piscina privativa, área gourmet completa e acabamento premium. A 200m da praia, cercada por jardins paisagísticos.','residencial','venda',3800000,380,4,4,3,'Rua das Nações, 245','Jurerê Internacional','Florianópolis','SC','88053-100',true,'ativo',now()),
('apartamento-lagoa-conceicao-florianopolis','Apartamento com Vista para a Lagoa da Conceição','Unidade moderna com sacada panorâmica, cozinha americana integrada e varanda com vista privilegiada para a Lagoa. Condomínio com academia e salão de festas.','residencial','venda',1200000,110,3,2,2,'Rua Laurindo Januário da Silveira, 1540','Lagoa da Conceição','Florianópolis','SC','88062-300',true,'ativo',now()),
('cobertura-centro-florianopolis','Cobertura Duplex no Centro de Florianópolis','Cobertura com terraço privativo, churrasqueira, 2 suítes e living amplo com pé direito duplo. Vista para o mar e acesso a todos os serviços do centro.','residencial','venda',2100000,220,4,3,3,'Rua Felipe Schmidt, 780','Centro','Florianópolis','SC','88010-000',true,'ativo',now()),
('apartamento-trindade-florianopolis','Apartamento para Alugar na Trindade','Apartamento bem localizado próximo à UFSC, com layout inteligente, varanda e vaga coberta. Ideal para profissionais e estudantes.','residencial','locação',3200,65,2,1,1,'Rua Deputado Antônio Edu Vieira, 390','Trindade','Florianópolis','SC','88036-000',false,'ativo',now()),
('studio-itacorubi-florianopolis','Studio Moderno no Itacorubi','Studio compacto e funcional, com cozinha americana, banheiro moderno e vaga de garagem. Próximo ao Parque do Córrego Grande e centros empresariais.','residencial','locação',2100,38,1,1,1,'Rua Lauro Linhares, 900','Itacorubi','Florianópolis','SC','88034-001',false,'ativo',now()),
('casa-ingleses-florianopolis','Casa a 500m da Praia dos Ingleses','Casa espaçosa com quintal, área de lazer e garagem para 2 carros. A 5 minutos da praia, em rua tranquila e bem arborizada.','residencial','locação',4800,150,3,2,2,'Rua das Gaivotas, 110','Ingleses','Florianópolis','SC','88058-600',false,'ativo',now()),
('sala-comercial-centro-florianopolis','Sala Comercial no Centro de Florianópolis','Sala com 80m² em andar alto, vista mar, recepção, 2 ambientes e copa. Excelente localização para escritórios e consultórios.','comercial','venda',650000,80,0,1,1,'Av. Hercílio Luz, 502','Centro','Florianópolis','SC','88020-000',false,'ativo',now()),
('loja-estreito-florianopolis','Loja Comercial no Estreito','Ponto comercial em avenida de alto fluxo, frente de vidro, depósito nos fundos e banheiro. Aceita diversos ramos de atividade.','comercial','locação',4500,95,0,1,1,'Av. Mauro Ramos, 1200','Estreito','Florianópolis','SC','88070-000',false,'ativo',now()),
('apartamento-corrego-grande-florianopolis','Apartamento 3 Dormitórios no Córrego Grande','Apartamento em andar intermediário com sacada, suite e dois dormitórios. Condomínio com portaria 24h, playground e piscina.','residencial','venda',780000,90,3,2,2,'Rua Waldemar Vieira, 200','Córrego Grande','Florianópolis','SC','88037-000',false,'ativo',now()),
('apartamento-frente-mar-balneario-camboriu','Apartamento Frente Mar em Balneário Camboriú','Alto padrão na Avenida Atlântica com vista direta para o mar, amplo living integrado, 2 suítes e varandão. Condomínio com spa, piscina aquecida e segurança 24h.','residencial','venda',3200000,190,4,3,3,'Av. Atlântica, 1800','Centro','Balneário Camboriú','SC','88330-320',true,'ativo',now()),
('cobertura-pioneiros-balneario-camboriu','Cobertura de Luxo no Bairro Pioneiros','Cobertura com piscina privativa, churrasqueira, 3 suítes e living com pé direito duplo. Vista 360° para o mar e a Serra. Uma das coberturas mais exclusivas de BC.','residencial','venda',2400000,210,3,3,2,'Rua 3100, 400','Pioneiros','Balneário Camboriú','SC','88337-000',true,'ativo',now()),
('apartamento-nacoes-balneario-camboriu','Apartamento 2 Suítes no Bairro Nações','Apartamento em prédio novo, com varanda gourmet, 2 suítes e vaga dupla. Próximo ao comércio e a 10 minutos da praia central.','residencial','venda',950000,85,2,2,2,'Rua 2400, 155','Nações','Balneário Camboriú','SC','88338-000',false,'ativo',now()),
('casa-condominio-barra-sul-balneario-camboriu','Casa em Condomínio Fechado na Barra Sul','Casa ampla em condomínio de alto padrão com segurança 24h, piscina, área gourmet e jardim privativo. A 300m do canal de Barra Sul.','residencial','venda',1800000,280,4,3,3,'Av. do Estado, 3500','Barra Sul','Balneário Camboriú','SC','88339-000',true,'ativo',now()),
('apartamento-centro-balneario-camboriu-locacao','Apartamento para Alugar no Centro de Balneário Camboriú','Apartamento mobiliado a 3 quadras da praia, com varanda, 2 dormitórios e vaga. Aceita contrato anual ou temporada.','residencial','locação',5500,80,2,2,2,'Rua 1000, 320','Centro','Balneário Camboriú','SC','88330-000',false,'ativo',now()),
('studio-centro-balneario-camboriu','Studio Moderno a 2 Quadras da Praia Central','Studio compacto e bem acabado, com cozinha integrada e varanda. Ideal para moradia ou investimento em temporada.','residencial','locação',3200,42,1,1,1,'Rua 800, 90','Centro','Balneário Camboriú','SC','88330-010',false,'ativo',now()),
('sala-comercial-centro-balneario-camboriu','Sala Comercial no Centro de Balneário Camboriú','Sala em edifício comercial moderno, 65m², 2 vagas, em área de alto tráfego. Ideal para consultórios, escritórios e serviços.','comercial','venda',480000,65,0,1,2,'Av. Central, 450','Centro','Balneário Camboriú','SC','88330-100',false,'ativo',now()),
('casa-america-joinville','Casa Espaçosa no Bairro América — Joinville','Casa em lote de 400m² com piscina, área gourmet, 4 dormitórios sendo 1 suíte. Bairro nobre de Joinville, próximo a escolas e shoppings.','residencial','venda',750000,200,4,3,3,'Rua Joaquim Nabuco, 620','América','Joinville','SC','89204-020',false,'ativo',now()),
('apartamento-anita-garibaldi-joinville','Apartamento 3 Dormitórios no Anita Garibaldi','Apartamento em prédio consolidado, com sala de estar e jantar, suite, 2 dormitórios e garagem coberta. Ótima localização central.','residencial','venda',420000,80,3,2,2,'Rua Anita Garibaldi, 1100','Anita Garibaldi','Joinville','SC','89202-000',false,'ativo',now()),
('casa-condominio-gloria-joinville','Casa em Condomínio no Glória — Joinville','Casa térrea em condomínio fechado com portaria, playground e área de lazer. 3 dormitórios, suite, quintal com churrasqueira.','residencial','venda',580000,160,3,2,2,'Rua Floresta, 900','Glória','Joinville','SC','89216-000',false,'ativo',now()),
('apartamento-centro-joinville-locacao','Apartamento para Alugar no Centro de Joinville','Apartamento com 2 dormitórios, living integrado e vaga coberta. No coração de Joinville, a passos do comércio e transporte.','residencial','locação',2400,65,2,1,1,'Rua do Príncipe, 500','Centro','Joinville','SC','89201-000',false,'ativo',now()),
('galpao-industrial-bucarein-joinville','Galpão Industrial no Bucarein — Joinville','Galpão com pé direito de 8m, piso industrial reforçado, escritório integrado, refeitório e pátio para manobra de carretas.','comercial','venda',1200000,600,0,2,10,'Rua Otto Boehm, 1500','Bucarein','Joinville','SC','89206-000',false,'ativo',now()),
('loja-centro-joinville-locacao','Loja Comercial no Centro de Joinville','Ponto comercial de esquina com 120m², vitrine dupla, mezanino e banheiro. Excelente visibilidade e fluxo de pedestres.','comercial','locação',5800,120,0,1,2,'Rua Jerônimo Coelho, 200','Centro','Joinville','SC','89201-010',false,'ativo',now()),
('apartamento-centro-blumenau-venda','Apartamento 3 Dormitórios no Centro de Blumenau','Apartamento bem conservado com sala ampla, cozinha planejada, 3 dormitórios e vaga coberta. Próximo ao Parque Vila Germânica.','residencial','venda',380000,85,3,2,2,'Rua XV de Novembro, 850','Centro','Blumenau','SC','89010-000',false,'ativo',now()),
('casa-ponta-aguda-blumenau','Casa com Piscina no Ponta Aguda — Blumenau','Casa em 2 pavimentos com piscina, área gourmet, 4 dormitórios sendo 2 suítes. Bairro valorizado com vistas para o vale.','residencial','venda',620000,180,4,3,3,'Rua Dr. Amadeu da Luz, 430','Ponta Aguda','Blumenau','SC','89051-000',false,'ativo',now()),
('apartamento-victor-konder-blumenau-locacao','Apartamento para Alugar no Victor Konder','Apartamento luminoso com 2 dormitórios, varanda, vaga coberta e condomínio com academia. Bairro tranquilo.','residencial','locação',2200,68,2,1,1,'Rua Victor Konder, 780','Victor Konder','Blumenau','SC','89012-000',false,'ativo',now()),
('casa-garcia-blumenau-locacao','Casa para Alugar no Bairro Garcia — Blumenau','Casa com 3 dormitórios, sala espaçosa, quintal gramado e garagem para 2 carros. Bairro residencial tranquilo.','residencial','locação',3500,140,3,2,2,'Rua Humberto de Campos, 340','Garcia','Blumenau','SC','89030-000',false,'ativo',now()),
('sala-comercial-centro-blumenau-locacao','Sala Comercial para Alugar no Centro de Blumenau','Sala climatizada em edifício corporativo, 55m², recepção compartilhada e 2 vagas. Ideal para escritórios e consultorias.','comercial','locação',3200,55,0,1,2,'Rua 7 de Setembro, 510','Centro','Blumenau','SC','89010-200',false,'ativo',now()),
('apartamento-centro-itajai-venda','Apartamento 2 Dormitórios no Centro de Itajaí','Apartamento com sala, cozinha, 2 dormitórios e garagem. Localização central, próximo a bancos e comércio.','residencial','venda',390000,70,2,1,1,'Rua Hercílio Luz, 320','Centro','Itajaí','SC','88301-000',false,'ativo',now()),
('casa-fazenda-itajai-venda','Casa com Quintal no Bairro Fazenda — Itajaí','Casa térrea com 3 dormitórios, sala, quintal com churrasqueira e garagem coberta. Próximo ao Porto de Itajaí.','residencial','venda',520000,150,3,2,2,'Rua Cel. Marcos Konder, 780','Fazenda','Itajaí','SC','88303-000',false,'ativo',now()),
('apartamento-cordeiros-itajai-locacao','Apartamento para Alugar nos Cordeiros — Itajaí','Apartamento com 2 dormitórios, living espaçoso, área de serviço e garagem coberta. Bairro em crescimento com fácil acesso à BR-101.','residencial','locação',2000,60,2,1,1,'Rua Joinville, 1100','Cordeiros','Itajaí','SC','88307-000',false,'ativo',now())
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. LEADS (12)
-- -----------------------------------------------------------------------------
INSERT INTO public.leads (id, nome, email, telefone, interesse, tipo_interesse, valor_min, valor_max, bairro_interesse, stage, prioridade, origem, corretor, notas, created_at, updated_at) VALUES
('00000000-0000-0000-0002-000000000001','Ana Costa','ana.costa@gmail.com','(48) 99811-3344','locação','residencial',2000,4000,'Trindade','lead','baixa','site',NULL,'Entrou pelo chat perguntando sobre apartamentos para alugar perto da UFSC.',NOW()-INTERVAL '5 days',NOW()-INTERVAL '5 days'),
('00000000-0000-0000-0002-000000000002','Bruno Mendes',NULL,'(48) 98822-5566','locação','residencial',1500,2500,'Itacorubi','lead','baixa','whatsapp',NULL,'Mandou mensagem no WhatsApp do site. Perguntou sobre studios.',NOW()-INTERVAL '3 days',NOW()-INTERVAL '3 days'),
('00000000-0000-0000-0002-000000000003','Carolina Freitas','carolina.freitas@outlook.com','(47) 99733-7788','venda','residencial',800000,1500000,'Centro','atendimento','media','portais','Ana Lima','Veio do Zap Imóveis. Quer apartamento de alto padrão em BC ou Floripa.',NOW()-INTERVAL '3 weeks',NOW()-INTERVAL '2 days'),
('00000000-0000-0000-0002-000000000004','Diego Santos','diego.santos@email.com','(47) 98844-9900','venda','residencial',400000,700000,'Nações','atendimento','media','indicacao','Marco Vieira','Indicado pelo cliente Henrique Borges. Quer 2 quartos em BC.',NOW()-INTERVAL '2 weeks',NOW()-INTERVAL '1 day'),
('00000000-0000-0000-0002-000000000005','Elena Martins','elena.martins@gmail.com','(48) 99655-1122','venda','residencial',1000000,2500000,'Lagoa da Conceição','visita','alta','whatsapp','Ana Lima','Muito interessada na cobertura do Centro. Visita marcada.',NOW()-INTERVAL '5 weeks',NOW()-INTERVAL '3 days'),
('00000000-0000-0000-0002-000000000006','Fábio Alves','fabio.alves@hotmail.com','(48) 98866-3344','locação','comercial',3000,6000,'Centro','visita','alta','telefone','Marco Vieira','Empresário buscando sala ou loja no Centro de Florianópolis.',NOW()-INTERVAL '4 weeks',NOW()-INTERVAL '2 days'),
('00000000-0000-0000-0002-000000000007','Gisele Pereira','gisele.pereira@gmail.com','(47) 99577-5566','venda','residencial',900000,1100000,'Nações','proposta','alta','site','Ana Lima','Proposta elaborada para o apt Nações. Aguardando resposta.',NOW()-INTERVAL '7 weeks',NOW()-INTERVAL '4 days'),
('00000000-0000-0000-0002-000000000008','Henrique Lima',NULL,'(47) 98888-7788','venda','residencial',700000,900000,'América','proposta','alta','portais','Marco Vieira','Proposta para a casa no América, Joinville. Em análise.',NOW()-INTERVAL '6 weeks',NOW()-INTERVAL '5 days'),
('00000000-0000-0000-0002-000000000009','Igor Rodrigues','igor.rodrigues@email.com','(48) 99499-9900','venda','residencial',1800000,2500000,'Barra Sul','negociacao','alta','indicacao','Ana Lima','Negociando a Casa Barra Sul. Pediu carência de 90 dias.',NOW()-INTERVAL '10 weeks',NOW()-INTERVAL '2 days'),
('00000000-0000-0000-0002-000000000010','Juliana Torres','juliana.torres@outlook.com','(47) 98900-1122','venda','comercial',400000,700000,'Centro','negociacao','alta','whatsapp','Marco Vieira','Interessada na sala comercial de BC. Negociando desconto de 5%.',NOW()-INTERVAL '9 weeks',NOW()-INTERVAL '1 day'),
('00000000-0000-0000-0002-000000000011','Kleber Nunes','kleber.nunes@gmail.com','(48) 99311-3344','venda','residencial',2000000,4500000,'Jurerê Internacional','fechamento','alta','indicacao','Ana Lima','Interessado na Casa Jurerê. Financiamento aprovado. Assinatura em 7 dias.',NOW()-INTERVAL '12 weeks',NOW()-INTERVAL '1 day'),
('00000000-0000-0000-0002-000000000012','Laura Medeiros','laura.medeiros@email.com','(47) 98922-5566','venda','residencial',950000,1300000,'Lagoa da Conceição','fechamento','alta','presencial','Marco Vieira','Apt Lagoa Conceição. Contraproposta aceita. Aguardando documentação.',NOW()-INTERVAL '11 weeks',NOW()-INTERVAL '2 days');

-- -----------------------------------------------------------------------------
-- 4. LEAD INTERACTIONS (24)
-- -----------------------------------------------------------------------------
INSERT INTO public.lead_interactions (id, lead_id, tipo, descricao, created_at) VALUES
(gen_random_uuid(),'00000000-0000-0000-0002-000000000001','nota','Lead entrou pelo chat do site. Perguntou sobre aptos 2 quartos perto da UFSC, aluguel até R$ 3.500.',NOW()-INTERVAL '5 days'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000001','whatsapp','Enviado WhatsApp de boas-vindas com 2 opções na Trindade e Itacorubi. Sem resposta até o momento.',NOW()-INTERVAL '4 days'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000002','whatsapp','Cliente enviou mensagem no WhatsApp do site perguntando sobre studios com garagem abaixo de R$ 2.200.',NOW()-INTERVAL '3 days'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000002','nota','Enviadas 3 opções de studio. Aguardando confirmação de visita.',NOW()-INTERVAL '2 days'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000003','ligacao','Ligação de 15 min. Quer aptos 3 quartos, varanda gourmet, valor até R$ 1,5M. BC ou Floripa.',NOW()-INTERVAL '3 weeks'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000003','email','Enviado material com 4 opções via e-mail. Cliente confirmou interesse em 2 delas.',NOW()-INTERVAL '2 days'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000004','ligacao','Primeiro contato. Diego tem pré-aprovação de R$ 650k. Quer 2 suítes, 2 vagas, próximo à praia.',NOW()-INTERVAL '2 weeks'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000004','whatsapp','Enviado catálogo de opções em BC e Floripa. Confirmou preferência por BC.',NOW()-INTERVAL '1 day'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000005','visita','Visita realizada na Cobertura Centro Florianópolis. Cliente adorou o terraço, perguntou sobre condições.',NOW()-INTERVAL '3 weeks'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000005','ligacao','Ligação de follow-up. Pediu simulação de financiamento para R$ 1,5M em 30 anos.',NOW()-INTERVAL '3 days'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000006','visita','Visita à Sala Comercial Centro Florianópolis. Pediu prazo de 30 dias para decidir.',NOW()-INTERVAL '2 weeks'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000006','whatsapp','Enviou fotos do seu ponto atual para comparação. Interessado também na Loja Estreito.',NOW()-INTERVAL '2 days'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000007','proposta','Proposta formal elaborada: R$ 920.000 para o Apt Nações. Proprietário recebeu e está analisando.',NOW()-INTERVAL '1 week'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000007','nota','Proprietário pediu 72h para responder. Gisele confirmou que pode esperar até sexta.',NOW()-INTERVAL '4 days'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000008','visita','Visita presencial à Casa América em Joinville. Trouxe o pai como consultor.',NOW()-INTERVAL '5 weeks'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000008','proposta','Proposta enviada: R$ 720.000. Proprietário contra-propôs R$ 740.000. Em análise.',NOW()-INTERVAL '5 days'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000009','negociacao','Igor solicitou carência de 90 dias para entrega de chaves. Proprietário aceitou com acréscimo de 2% no valor.',NOW()-INTERVAL '3 weeks'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000009','nota','Advogado de Igor revisando contrato. Assinatura prevista para próxima semana.',NOW()-INTERVAL '2 days'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000010','negociacao','Juliana pediu desconto de 5% na Sala BC. Oferecemos 3% + 2 meses de condomínio grátis.',NOW()-INTERVAL '2 weeks'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000010','ligacao','Ligação de 20 min. Juliana aceitou a contra-proposta. Formalizando documentação.',NOW()-INTERVAL '1 day'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000011','nota','Financiamento aprovado pelo Banco do Brasil (R$ 2,1M). Kleber quer assinar em 7 dias.',NOW()-INTERVAL '1 week'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000011','ligacao','Confirmada data de assinatura para 18/04/2026. Cartório escolhido pelo cliente.',NOW()-INTERVAL '1 day'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000012','nota','Laura aceitou contraproposta de R$ 1.140.000. Pediu 10 dias para reunir documentação.',NOW()-INTERVAL '2 weeks'),
(gen_random_uuid(),'00000000-0000-0000-0002-000000000012','email','Documentação recebida. Análise jurídica em andamento. Assinatura prevista em 10 dias.',NOW()-INTERVAL '2 days');

-- -----------------------------------------------------------------------------
-- 5. CONTRATOS (5)
-- -----------------------------------------------------------------------------
INSERT INTO public.contratos (id, imovel_id, proprietario_id, inquilino_id, valor_aluguel, data_inicio, data_fim, dia_vencimento, taxa_administracao, status, created_at, updated_at) VALUES
(
  '00000000-0000-0000-0003-000000000001',
  (SELECT id FROM public.imoveis WHERE slug = 'apartamento-trindade-florianopolis'),
  '00000000-0000-0000-0001-000000000001',
  '00000000-0000-0000-0001-000000000006',
  3200, '2025-11-01', '2027-10-31', 10, 8.0, 'ativo', '2025-11-01', NOW()
),
(
  '00000000-0000-0000-0003-000000000002',
  (SELECT id FROM public.imoveis WHERE slug = 'studio-itacorubi-florianopolis'),
  '00000000-0000-0000-0001-000000000002',
  '00000000-0000-0000-0001-000000000007',
  2100, '2025-10-01', '2027-09-30', 5, 8.0, 'ativo', '2025-10-01', NOW()
),
(
  '00000000-0000-0000-0003-000000000003',
  (SELECT id FROM public.imoveis WHERE slug = 'casa-ingleses-florianopolis'),
  '00000000-0000-0000-0001-000000000003',
  '00000000-0000-0000-0001-000000000008',
  4800, '2025-12-01', '2027-11-30', 10, 8.0, 'ativo', '2025-12-01', NOW()
),
(
  '00000000-0000-0000-0003-000000000004',
  (SELECT id FROM public.imoveis WHERE slug = 'apartamento-centro-joinville-locacao'),
  '00000000-0000-0000-0001-000000000004',
  '00000000-0000-0000-0001-000000000009',
  2400, '2026-01-01', '2027-12-31', 10, 8.0, 'ativo', '2026-01-01', NOW()
),
(
  '00000000-0000-0000-0003-000000000005',
  (SELECT id FROM public.imoveis WHERE slug = 'apartamento-cordeiros-itajai-locacao'),
  '00000000-0000-0000-0001-000000000005',
  '00000000-0000-0000-0001-000000000010',
  2000, '2026-02-01', '2028-01-31', 10, 8.0, 'ativo', '2026-02-01', NOW()
);

-- -----------------------------------------------------------------------------
-- 6. PAGAMENTOS (25)
-- -----------------------------------------------------------------------------
-- ctr-01: nov/2025–abr/2026 (6)
INSERT INTO public.pagamentos (id, contrato_id, referencia, valor, data_vencimento, data_pagamento, status, created_at) VALUES
('00000000-0000-0000-0004-000000000001','00000000-0000-0000-0003-000000000001','11/2025',3200,'2025-11-10','2025-11-09','pago','2025-11-01'),
('00000000-0000-0000-0004-000000000002','00000000-0000-0000-0003-000000000001','12/2025',3200,'2025-12-10','2025-12-08','pago','2025-12-01'),
('00000000-0000-0000-0004-000000000003','00000000-0000-0000-0003-000000000001','01/2026',3200,'2026-01-10','2026-01-09','pago','2026-01-01'),
('00000000-0000-0000-0004-000000000004','00000000-0000-0000-0003-000000000001','02/2026',3200,'2026-02-10','2026-02-07','pago','2026-02-01'),
('00000000-0000-0000-0004-000000000005','00000000-0000-0000-0003-000000000001','03/2026',3200,'2026-03-10','2026-03-10','pago','2026-03-01'),
('00000000-0000-0000-0004-000000000006','00000000-0000-0000-0003-000000000001','04/2026',3200,'2026-04-10',NULL,'pendente','2026-04-01');
-- ctr-02: out/2025–abr/2026 (7)
INSERT INTO public.pagamentos (id, contrato_id, referencia, valor, data_vencimento, data_pagamento, status, created_at) VALUES
('00000000-0000-0000-0004-000000000007','00000000-0000-0000-0003-000000000002','10/2025',2100,'2025-10-05','2025-10-04','pago','2025-10-01'),
('00000000-0000-0000-0004-000000000008','00000000-0000-0000-0003-000000000002','11/2025',2100,'2025-11-05','2025-11-05','pago','2025-11-01'),
('00000000-0000-0000-0004-000000000009','00000000-0000-0000-0003-000000000002','12/2025',2100,'2025-12-05','2025-12-03','pago','2025-12-01'),
('00000000-0000-0000-0004-000000000010','00000000-0000-0000-0003-000000000002','01/2026',2100,'2026-01-05','2026-01-05','pago','2026-01-01'),
('00000000-0000-0000-0004-000000000011','00000000-0000-0000-0003-000000000002','02/2026',2100,'2026-02-05','2026-02-04','pago','2026-02-01'),
('00000000-0000-0000-0004-000000000012','00000000-0000-0000-0003-000000000002','03/2026',2100,'2026-03-05','2026-03-05','pago','2026-03-01'),
('00000000-0000-0000-0004-000000000013','00000000-0000-0000-0003-000000000002','04/2026',2100,'2026-04-05',NULL,'pendente','2026-04-01');
-- ctr-03: dez/2025–abr/2026, mar/2026 atrasado (5)
INSERT INTO public.pagamentos (id, contrato_id, referencia, valor, data_vencimento, data_pagamento, status, created_at) VALUES
('00000000-0000-0000-0004-000000000014','00000000-0000-0000-0003-000000000003','12/2025',4800,'2025-12-10','2025-12-09','pago','2025-12-01'),
('00000000-0000-0000-0004-000000000015','00000000-0000-0000-0003-000000000003','01/2026',4800,'2026-01-10','2026-01-10','pago','2026-01-01'),
('00000000-0000-0000-0004-000000000016','00000000-0000-0000-0003-000000000003','02/2026',4800,'2026-02-10','2026-02-09','pago','2026-02-01'),
('00000000-0000-0000-0004-000000000017','00000000-0000-0000-0003-000000000003','03/2026',4800,'2026-03-10',NULL,'atrasado','2026-03-01'),
('00000000-0000-0000-0004-000000000018','00000000-0000-0000-0003-000000000003','04/2026',4800,'2026-04-10',NULL,'pendente','2026-04-01');
-- ctr-04: jan/2026–abr/2026 (4)
INSERT INTO public.pagamentos (id, contrato_id, referencia, valor, data_vencimento, data_pagamento, status, created_at) VALUES
('00000000-0000-0000-0004-000000000019','00000000-0000-0000-0003-000000000004','01/2026',2400,'2026-01-10','2026-01-09','pago','2026-01-01'),
('00000000-0000-0000-0004-000000000020','00000000-0000-0000-0003-000000000004','02/2026',2400,'2026-02-10','2026-02-10','pago','2026-02-01'),
('00000000-0000-0000-0004-000000000021','00000000-0000-0000-0003-000000000004','03/2026',2400,'2026-03-10','2026-03-08','pago','2026-03-01'),
('00000000-0000-0000-0004-000000000022','00000000-0000-0000-0003-000000000004','04/2026',2400,'2026-04-10',NULL,'pendente','2026-04-01');
-- ctr-05: fev/2026–abr/2026 (3)
INSERT INTO public.pagamentos (id, contrato_id, referencia, valor, data_vencimento, data_pagamento, status, created_at) VALUES
('00000000-0000-0000-0004-000000000023','00000000-0000-0000-0003-000000000005','02/2026',2000,'2026-02-10','2026-02-08','pago','2026-02-01'),
('00000000-0000-0000-0004-000000000024','00000000-0000-0000-0003-000000000005','03/2026',2000,'2026-03-10','2026-03-10','pago','2026-03-01'),
('00000000-0000-0000-0004-000000000025','00000000-0000-0000-0003-000000000005','04/2026',2000,'2026-04-10',NULL,'pendente','2026-04-01');

-- -----------------------------------------------------------------------------
-- 7. REPASSES (19 — apenas pagamentos pago)
-- -----------------------------------------------------------------------------
INSERT INTO public.repasses (id, contrato_id, mes_referencia, valor_bruto, taxa_administracao, valor_liquido, data_repasse, status, created_at) VALUES
('00000000-0000-0000-0005-000000000001','00000000-0000-0000-0003-000000000001','11/2025',3200,256,2944,'2025-11-14','realizado','2025-11-14'),
('00000000-0000-0000-0005-000000000002','00000000-0000-0000-0003-000000000001','12/2025',3200,256,2944,'2025-12-13','realizado','2025-12-13'),
('00000000-0000-0000-0005-000000000003','00000000-0000-0000-0003-000000000001','01/2026',3200,256,2944,'2026-01-14','realizado','2026-01-14'),
('00000000-0000-0000-0005-000000000004','00000000-0000-0000-0003-000000000001','02/2026',3200,256,2944,'2026-02-12','realizado','2026-02-12'),
('00000000-0000-0000-0005-000000000005','00000000-0000-0000-0003-000000000001','03/2026',3200,256,2944,'2026-03-15','realizado','2026-03-15'),
('00000000-0000-0000-0005-000000000006','00000000-0000-0000-0003-000000000002','10/2025',2100,168,1932,'2025-10-09','realizado','2025-10-09'),
('00000000-0000-0000-0005-000000000007','00000000-0000-0000-0003-000000000002','11/2025',2100,168,1932,'2025-11-10','realizado','2025-11-10'),
('00000000-0000-0000-0005-000000000008','00000000-0000-0000-0003-000000000002','12/2025',2100,168,1932,'2025-12-08','realizado','2025-12-08'),
('00000000-0000-0000-0005-000000000009','00000000-0000-0000-0003-000000000002','01/2026',2100,168,1932,'2026-01-10','realizado','2026-01-10'),
('00000000-0000-0000-0005-000000000010','00000000-0000-0000-0003-000000000002','02/2026',2100,168,1932,'2026-02-09','realizado','2026-02-09'),
('00000000-0000-0000-0005-000000000011','00000000-0000-0000-0003-000000000002','03/2026',2100,168,1932,'2026-03-10','realizado','2026-03-10'),
('00000000-0000-0000-0005-000000000012','00000000-0000-0000-0003-000000000003','12/2025',4800,384,4416,'2025-12-14','realizado','2025-12-14'),
('00000000-0000-0000-0005-000000000013','00000000-0000-0000-0003-000000000003','01/2026',4800,384,4416,'2026-01-15','realizado','2026-01-15'),
('00000000-0000-0000-0005-000000000014','00000000-0000-0000-0003-000000000003','02/2026',4800,384,4416,'2026-02-14','realizado','2026-02-14'),
('00000000-0000-0000-0005-000000000015','00000000-0000-0000-0003-000000000004','01/2026',2400,192,2208,'2026-01-14','realizado','2026-01-14'),
('00000000-0000-0000-0005-000000000016','00000000-0000-0000-0003-000000000004','02/2026',2400,192,2208,'2026-02-15','realizado','2026-02-15'),
('00000000-0000-0000-0005-000000000017','00000000-0000-0000-0003-000000000004','03/2026',2400,192,2208,'2026-03-13','realizado','2026-03-13'),
('00000000-0000-0000-0005-000000000018','00000000-0000-0000-0003-000000000005','02/2026',2000,160,1840,'2026-02-13','realizado','2026-02-13'),
('00000000-0000-0000-0005-000000000019','00000000-0000-0000-0003-000000000005','03/2026',2000,160,1840,'2026-03-15','realizado','2026-03-15');

-- -----------------------------------------------------------------------------
-- 8. VISTORIAS (8)
-- -----------------------------------------------------------------------------
INSERT INTO public.vistorias (id, contrato_id, tipo, data, laudo, created_at) VALUES
('00000000-0000-0000-0006-000000000001','00000000-0000-0000-0003-000000000001','entrada','2025-11-01','Imóvel em ótimas condições. Pintura nova, piso sem avarias, instalações elétricas e hidráulicas funcionando perfeitamente. Vaga coberta limpa. Chaves entregues à inquilina.','2025-11-01'),
('00000000-0000-0000-0006-000000000002','00000000-0000-0000-0003-000000000002','entrada','2025-10-01','Studio entregue com mobiliário conforme contrato. Ar-condicionado funcionando, cozinha americana em ordem. Pequeno arranhão na porta do armário registrado em laudo.','2025-10-01'),
('00000000-0000-0000-0006-000000000003','00000000-0000-0000-0003-000000000003','entrada','2025-12-01','Casa em excelente estado. Quintal gramado, churrasqueira limpa, garagem para 2 carros. Todas as divisórias internas sem avarias. Laudo assinado por ambas as partes.','2025-12-01'),
('00000000-0000-0000-0006-000000000004','00000000-0000-0000-0003-000000000004','entrada','2026-01-01','Apartamento recém pintado e com piso novo. Instalações hidráulicas revisadas antes da entrega. Vaga identificada e demarcada. Inquilino recebeu 2 jogos de chaves.','2026-01-01'),
('00000000-0000-0000-0006-000000000005','00000000-0000-0000-0003-000000000005','entrada','2026-02-01','Imóvel entregue conforme descrito. Cozinha e banheiro sem infiltrações. Área de serviço com tanque e ponto para máquina. Garagem coberta identificada.','2026-02-01'),
('00000000-0000-0000-0006-000000000006','00000000-0000-0000-0003-000000000001','periodica','2026-02-15','Vistoria de rotina após 3 meses. Imóvel bem conservado pela inquilina. Identificada pequena infiltração no teto do banheiro (comunicada para manutenção). Demais áreas em ordem.','2026-02-15'),
('00000000-0000-0000-0006-000000000007','00000000-0000-0000-0003-000000000002','periodica','2026-01-15','Vistoria periódica. Studio em bom estado. Arranhão na porta do armário permanece — inquilino ciente da responsabilidade ao final do contrato. Aparelhos em funcionamento.','2026-01-15'),
('00000000-0000-0000-0006-000000000008','00000000-0000-0000-0003-000000000003','periodica','2026-03-01','Vistoria de 3 meses. Família bem estabelecida. Pequeno furo na tela da janela da sala (substituição agendada). Quintal com jardim mantido. Churrasqueira limpa.','2026-03-01');

-- -----------------------------------------------------------------------------
-- 9. MANUTENÇÕES (8)
-- -----------------------------------------------------------------------------
INSERT INTO public.manutencoes (id, imovel_id, titulo, descricao, status, custo, data_abertura, data_conclusao, created_at) VALUES
('00000000-0000-0000-0007-000000000001',(SELECT id FROM public.imoveis WHERE slug='apartamento-trindade-florianopolis'),'Infiltração no teto do banheiro','Inquilina relatou mancha de umidade no teto do banheiro social após chuvas fortes. Necessário inspeção no apartamento do andar superior.','aberta',NULL,'2026-02-16',NULL,'2026-02-16'),
('00000000-0000-0000-0007-000000000002',(SELECT id FROM public.imoveis WHERE slug='studio-itacorubi-florianopolis'),'Torneira da pia com vazamento','Inquilino reportou gotejamento na torneira da pia do banheiro. Aperto de vedação ou troca de peça necessária.','aberta',NULL,'2026-03-20',NULL,'2026-03-20'),
('00000000-0000-0000-0007-000000000003',(SELECT id FROM public.imoveis WHERE slug='casa-ingleses-florianopolis'),'Pintura interna — sala e quartos','Inquilina solicitou repintura das paredes da sala e dos 3 quartos. Tintas claras com manchas de umidade do inverno passado.','em_andamento',1800,'2026-03-05',NULL,'2026-03-05'),
('00000000-0000-0000-0007-000000000004',(SELECT id FROM public.imoveis WHERE slug='apartamento-trindade-florianopolis'),'Reparo elétrico — disjuntor da cozinha','Disjuntor da cozinha desarmando com frequência. Eletricista contratado para inspeção e substituição do quadro.','em_andamento',650,'2026-04-02',NULL,'2026-04-02'),
('00000000-0000-0000-0007-000000000005',(SELECT id FROM public.imoveis WHERE slug='apartamento-centro-joinville-locacao'),'Troca de fechadura — porta principal','Inquilino perdeu chave reserva. Solicitada troca de cilindro e confecção de 3 novas chaves.','em_andamento',280,'2026-04-05',NULL,'2026-04-05'),
('00000000-0000-0000-0007-000000000006',(SELECT id FROM public.imoveis WHERE slug='casa-ingleses-florianopolis'),'Revisão hidráulica completa','Revisão preventiva de toda a rede hidráulica antes da renovação do contrato. Substituição de sifões e registros.','concluida',920,'2025-12-10','2025-12-15','2025-12-10'),
('00000000-0000-0000-0007-000000000007',(SELECT id FROM public.imoveis WHERE slug='studio-itacorubi-florianopolis'),'Instalação de ar-condicionado split','Proprietária solicitou instalação de split 9000 BTUs no dormitório para valorizar o imóvel.','concluida',2400,'2026-01-08','2026-01-10','2026-01-08'),
('00000000-0000-0000-0007-000000000008',(SELECT id FROM public.imoveis WHERE slug='apartamento-cordeiros-itajai-locacao'),'Troca de revestimento do banheiro','Azulejos antigos com trincas na área do box. Substituição completa do revestimento do banheiro.','concluida',3200,'2025-12-20','2026-01-05','2025-12-20');

-- -----------------------------------------------------------------------------
-- 10. PROPOSTAS (4)
-- -----------------------------------------------------------------------------
INSERT INTO public.propostas (id, imovel_id, comprador_id, proprietario_id, imovel_descricao, comprador_nome, proprietario_nome, valor_pedido, valor_oferta, contraproposta, data, validade, status, corretor, created_at, updated_at) VALUES
(
  '00000000-0000-0000-0008-000000000001',
  (SELECT id FROM public.imoveis WHERE slug='casa-america-joinville'),
  '00000000-0000-0000-0001-000000000011',
  '00000000-0000-0000-0001-000000000013',
  'Casa Espaçosa no Bairro América — Joinville',
  'Felipe Teixeira','Henrique Borges',
  750000,720000,740000,'2026-04-01','2026-04-15','contraproposta','Marco Vieira',
  NOW()-INTERVAL '13 days',NOW()-INTERVAL '5 days'
),
(
  '00000000-0000-0000-0008-000000000002',
  (SELECT id FROM public.imoveis WHERE slug='apartamento-lagoa-conceicao-florianopolis'),
  '00000000-0000-0000-0001-000000000012',
  '00000000-0000-0000-0001-000000000002',
  'Apartamento com Vista para a Lagoa da Conceição',
  'Juliana Soares','Fernanda Wachholz',
  1200000,1140000,NULL,'2026-03-28','2026-04-28','aguardando','Ana Lima',
  NOW()-INTERVAL '17 days',NOW()-INTERVAL '2 days'
),
(
  '00000000-0000-0000-0008-000000000003',
  (SELECT id FROM public.imoveis WHERE slug='apartamento-nacoes-balneario-camboriu'),
  '00000000-0000-0000-0001-000000000012',
  '00000000-0000-0000-0001-000000000014',
  'Apartamento 2 Suítes no Bairro Nações',
  'Juliana Soares','Construtora Litoral SC Ltda',
  950000,920000,NULL,'2026-02-15','2026-03-15','aceita','Ana Lima',
  NOW()-INTERVAL '58 days',NOW()-INTERVAL '30 days'
),
(
  '00000000-0000-0000-0008-000000000004',
  (SELECT id FROM public.imoveis WHERE slug='apartamento-corrego-grande-florianopolis'),
  '00000000-0000-0000-0001-000000000011',
  '00000000-0000-0000-0001-000000000001',
  'Apartamento 3 Dormitórios no Córrego Grande',
  'Felipe Teixeira','Rodrigo Schaefer',
  780000,700000,NULL,'2026-01-10','2026-01-25','recusada','Marco Vieira',
  NOW()-INTERVAL '94 days',NOW()-INTERVAL '80 days'
);

-- -----------------------------------------------------------------------------
-- 11. VISITAS DE VENDAS (6)
-- -----------------------------------------------------------------------------
INSERT INTO public.visitas_vendas (id, lead_id, imovel_id, data, status, corretor, notas, created_at) VALUES
(
  '00000000-0000-0000-0009-000000000001',
  '00000000-0000-0000-0002-000000000005',
  (SELECT id FROM public.imoveis WHERE slug='cobertura-centro-florianopolis'),
  '2026-03-22 10:00:00','realizada','Ana Lima','Visita de 1h. Elena adorou o terraço e a vista. Pediu simulação de financiamento.','2026-03-18'
),
(
  '00000000-0000-0000-0009-000000000002',
  '00000000-0000-0000-0002-000000000009',
  (SELECT id FROM public.imoveis WHERE slug='casa-condominio-barra-sul-balneario-camboriu'),
  '2026-03-15 14:30:00','realizada','Ana Lima','Igor veio com a esposa. Visitaram 2 unidades no condomínio. Iniciou negociação.','2026-03-10'
),
(
  '00000000-0000-0000-0009-000000000003',
  '00000000-0000-0000-0002-000000000008',
  (SELECT id FROM public.imoveis WHERE slug='casa-america-joinville'),
  '2026-03-28 09:00:00','realizada','Marco Vieira','Henrique trouxe o pai para avaliar. Muito positivo. Proposta elaborada na semana seguinte.','2026-03-25'
),
(
  '00000000-0000-0000-0009-000000000004',
  '00000000-0000-0000-0002-000000000003',
  (SELECT id FROM public.imoveis WHERE slug='apartamento-frente-mar-balneario-camboriu'),
  '2026-04-18 11:00:00','agendada','Ana Lima','Carolina confirmou presença. Vem de Joinville especialmente para ver o imóvel.','2026-04-12'
),
(
  '00000000-0000-0000-0009-000000000005',
  '00000000-0000-0000-0002-000000000004',
  (SELECT id FROM public.imoveis WHERE slug='apartamento-nacoes-balneario-camboriu'),
  '2026-04-20 15:00:00','agendada','Marco Vieira','Diego quer ver pessoalmente antes de fechar. Será a segunda visita.','2026-04-14'
),
(
  '00000000-0000-0000-0009-000000000006',
  '00000000-0000-0000-0002-000000000001',
  (SELECT id FROM public.imoveis WHERE slug='apartamento-centro-itajai-venda'),
  '2026-03-05 10:00:00','cancelada','Marco Vieira','Lead cancelou no dia anterior. Pediu reagendamento mas não retornou.','2026-03-01'
);

-- -----------------------------------------------------------------------------
-- 12. CAPTAÇÕES (8)
-- -----------------------------------------------------------------------------
INSERT INTO public.captacoes (id, endereco, proprietario, telefone, tipo, valor_estimado, status, corretor, data, created_at) VALUES
('00000000-0000-0000-000a-000000000001','Rua XV de Novembro, 1200, Centro, Florianópolis/SC','Roberto Kessler','(48) 99711-2233','Apartamento 3 dormitórios — 90m²',750000,'prospectando','Ana Lima','2026-03-10','2026-03-10'),
('00000000-0000-0000-000a-000000000002','Av. Atlântica, 2200, Centro, Balneário Camboriú/SC','Marina Volkmann','(47) 98822-4455','Studio frente mar — 45m²',400000,'prospectando','Marco Vieira','2026-03-15','2026-03-15'),
('00000000-0000-0000-000a-000000000003','Rua Lauro Linhares, 450, Itacorubi, Florianópolis/SC','Paulo Grützmann','(48) 99533-6677','Apartamento 2 dormitórios — 72m²',580000,'em_avaliacao','Ana Lima','2026-02-20','2026-02-20'),
('00000000-0000-0000-000a-000000000004','Rua 3100, 180, Pioneiros, Balneário Camboriú/SC','Simone Langer','(47) 98644-8899','Casa em condomínio fechado — 260m²',1200000,'em_avaliacao','Marco Vieira','2026-02-28','2026-02-28'),
('00000000-0000-0000-000a-000000000005','Rua do Príncipe, 800, Centro, Joinville/SC','Eduardo Niehues','(47) 99455-0011','Apartamento 3 dormitórios — 88m²',450000,'em_avaliacao','Ana Lima','2026-01-15','2026-01-15'),
('00000000-0000-0000-000a-000000000006','Rua Joaquim Nabuco, 300, América, Joinville/SC','Cristiane Welter','(47) 98366-2233','Casa com piscina — 220m²',680000,'autorizado','Ana Lima','2025-12-10','2025-12-10'),
('00000000-0000-0000-000a-000000000007','Rua XV de Novembro, 600, Centro, Blumenau/SC','Márcio Hübner','(47) 99277-4455','Sala comercial — 80m²',320000,'autorizado','Marco Vieira','2025-11-20','2025-11-20'),
('00000000-0000-0000-000a-000000000008','Rua Getúlio Vargas, 450, Centro, Itajaí/SC','Vanessa Pedrosa','(47) 98188-6677','Apartamento 2 dormitórios — 65m²',380000,'recusado','Marco Vieira','2025-11-05','2025-11-05');

-- -----------------------------------------------------------------------------
-- 13. BLOG POSTS (3)
-- -----------------------------------------------------------------------------
INSERT INTO public.blog_posts (id, titulo, slug, resumo, conteudo, cover_url, status, autor, tags, published_at, created_at, updated_at) VALUES
(
  '00000000-0000-0000-000b-000000000001',
  'Como Escolher o Bairro Ideal para Morar em Florianópolis',
  'como-escolher-bairro-ideal-florianopolis',
  'Florianópolis oferece bairros para todos os estilos de vida. Saiba como escolher o certo para você.',
  E'## Florianópolis tem um bairro para cada estilo de vida\n\nA capital catarinense é conhecida pela diversidade de seus bairros — cada um com personalidade própria. Antes de tomar uma decisão, é fundamental entender o que cada região tem a oferecer em termos de infraestrutura, custo de vida e qualidade de acesso.\n\n## Principais bairros e seus perfis\n\n**Jurerê Internacional** é sinônimo de sofisticação e alto padrão. Com praias exclusivas, restaurantes badalados e condomínios fechados, é a escolha de quem busca um estilo de vida premium.\n\n**Lagoa da Conceição** atrai um público jovem e criativo. A combinação de natureza exuberante, bares descolados e uma comunidade diversa fazem deste bairro um dos mais cobiçados de Floripa.\n\n**Trindade e Itacorubi** são os bairros dos profissionais e universitários. Com fácil acesso à UFSC e ao centro empresarial, oferecem ótimo custo-benefício.\n\n## Nossa dica\n\nVisite os bairros em diferentes horários do dia antes de decidir. A HOME Imob tem corretores especializados em cada região e pode ajudá-lo a encontrar o imóvel certo para o seu perfil.',
  NULL,'publicado','Ana Lima',
  ARRAY['florianópolis','bairros','guia','morar em floripa'],
  '2026-03-10 09:00:00','2026-03-08','2026-03-10'
),
(
  '00000000-0000-0000-000b-000000000002',
  'Financiamento Imobiliário: Tudo que Você Precisa Saber',
  'financiamento-imobiliario-guia-completo',
  'Entenda as modalidades, taxas e documentos necessários para financiar seu imóvel com segurança.',
  E'## Por que entender o financiamento é tão importante?\n\nComprar um imóvel é uma das maiores decisões financeiras da vida. Mesmo que você já tenha uma parte do valor, o financiamento imobiliário costuma ser o caminho mais acessível para a realização desse sonho.\n\n## SFH x SFI: qual a diferença?\n\nO **Sistema Financeiro de Habitação (SFH)** é voltado para imóveis de até R$ 1,5 milhão e permite o uso do FGTS. As taxas costumam ser mais favoráveis — entre 10% e 12% ao ano. Já o **Sistema Financeiro Imobiliário (SFI)** cobre imóveis acima desse valor.\n\n## Documentos essenciais\n\nPara dar entrada no processo: documentos pessoais (RG, CPF, comprovante de renda dos últimos 3 meses), extrato do FGTS e a documentação do imóvel (matrícula atualizada, certidão negativa de débitos e habite-se).\n\n## Dica prática\n\nSimule em pelo menos 3 bancos diferentes antes de fechar negócio. A HOME Imob possui parceiros financeiros que podem ajudá-lo a conseguir as melhores condições do mercado.',
  NULL,'publicado','Marco Vieira',
  ARRAY['financiamento','crédito imobiliário','FGTS','SFH','compra'],
  '2026-02-20 10:00:00','2026-02-18','2026-02-20'
),
(
  '00000000-0000-0000-000b-000000000003',
  'Mercado Imobiliário em Santa Catarina: Perspectivas para 2026',
  'mercado-imobiliario-santa-catarina-2026',
  'Análise das tendências e oportunidades no mercado imobiliário catarinense para os próximos meses.',
  E'## Um mercado em constante crescimento\n\nSanta Catarina consolidou-se como um dos mercados imobiliários mais aquecidos do Brasil. A combinação de qualidade de vida, crescimento econômico e migração de profissionais de outros estados criou uma demanda consistente.\n\n## Destaques por cidade\n\nFlorianópolis segue valorizada pelo turismo e pelo crescimento do setor de tecnologia. Balneário Camboriú mantém sua reputação com lançamentos de alto padrão. Joinville e Blumenau apresentam ótimo custo-benefício para investidores.\n\n*Este artigo está em elaboração. Em breve publicaremos a análise completa.*',
  NULL,'rascunho','Ana Lima',
  ARRAY['mercado imobiliário','santa catarina','2026','investimento'],
  NULL,'2026-04-10','2026-04-10'
);

-- -----------------------------------------------------------------------------
-- VERIFICAÇÃO FINAL
-- -----------------------------------------------------------------------------
SELECT 'clientes' AS tabela, count(*) AS total FROM public.clientes
UNION ALL SELECT 'imoveis', count(*) FROM public.imoveis
UNION ALL SELECT 'leads', count(*) FROM public.leads
UNION ALL SELECT 'lead_interactions', count(*) FROM public.lead_interactions
UNION ALL SELECT 'contratos', count(*) FROM public.contratos
UNION ALL SELECT 'pagamentos', count(*) FROM public.pagamentos
UNION ALL SELECT 'repasses', count(*) FROM public.repasses
UNION ALL SELECT 'vistorias', count(*) FROM public.vistorias
UNION ALL SELECT 'manutencoes', count(*) FROM public.manutencoes
UNION ALL SELECT 'propostas', count(*) FROM public.propostas
UNION ALL SELECT 'visitas_vendas', count(*) FROM public.visitas_vendas
UNION ALL SELECT 'captacoes', count(*) FROM public.captacoes
UNION ALL SELECT 'blog_posts', count(*) FROM public.blog_posts
ORDER BY tabela;
