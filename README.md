PALIVO TATTOO STUDIO — V2.0 SUPABASE

Landing page em HTML + CSS + JavaScript puro, com catálogo e painel administrativo conectados ao Supabase.

PAINEL ADMINISTRATIVO
- Endereço: /admin/
- Usuário exibido no login: Palivo
- O painel permite cadastrar, editar e excluir tatuagens.
- Permite upload de JPG, PNG ou WebP de até 8 MB.
- Permite alterar preços, categoria, ordem e status.
- A chave de disponibilidade atualiza o catálogo sem novo deploy.
- O acesso é protegido pelo Supabase Auth e pelas políticas RLS do banco.

STATUS DISPONÍVEIS
- disponivel: aparece com o botão "Quero essa".
- em_negociacao: fica visível, mas bloqueada temporariamente.
- indisponivel: fica visível, mas não pode ser selecionada.

ARQUIVO DE CONEXÃO
- assets/js/supabase-config.js contém apenas a Project URL e a Publishable Key.
- A Publishable Key é pública por definição e as alterações dependem de login + RLS.
- Nunca inserir Secret Key ou service_role nos arquivos do site.

DADOS CONFIGURADOS
- WhatsApp: 55 71 99675-4698
- Instagram: @palivotattoo
- GA4: G-PWEH5VKX5H
- Atendimento das ofertas: somente no estúdio em Jacobina

ALTERAÇÕES V1.1
- Hero trocado por vídeo otimizado em MP4.
- Fine Art movido para o início do catálogo.
- Status agora usa somente `disponivel` ou `indisponivel`.
- Cada tattoo possui `precoDe` e `precoPor`.
- Formulário não pergunta cidade.
- Botão final fica desabilitado até uma tattoo válida ser escolhida.
- Clique em `Quero essa` foi isolado do drag do carrossel para não perder o evento.
- Paleta reforçada em cimento queimado, preto e dourado brilhante.
- Textura de cimento aplicada em várias seções.
- Header fixo com seletor de partes do site e Instagram.
- Ícones vetoriais reconhecíveis de WhatsApp e Instagram.
- FAQ atualizado.
- Responsividade mobile refeita para evitar overflow do header e manter os carrosséis dentro do viewport.

CATÁLOGO
O site não usa mais assets/js/tattoos.js. As artes são carregadas da tabela public.tattoos no Supabase.

COMO ADMINISTRAR
1. Acesse https://SEU-DOMINIO/admin/
2. Entre como Palivo e use a senha cadastrada no Supabase.
3. Clique em Nova tatuagem para cadastrar uma arte.
4. Use a chavinha no catálogo administrativo para disponibilizar ou indisponibilizar.

WHATSAPP
O número fica em assets/js/script.js, dentro de CONFIG.whatsapp.
O evento `lead_whatsapp` dispara somente no envio validado que efetivamente abre o WhatsApp.

GA4
Measurement ID preservado: G-PWEH5VKX5H
Eventos auxiliares: select_tattoo
Evento de conversão: lead_whatsapp

VÍDEO
Hero: assets/videos/hero-palivo.mp4
Arquivo otimizado para web a partir do material enviado.


COPY V1.2
Campanha: Setembro com o Palivo.
A copy do hero, introdução do catálogo, categorias, bloco de escolha e fechamento foi atualizada para campanha promocional de setembro. Funcionalidades, GA4, WhatsApp, catálogo e preços foram preservados.
