PALIVO TATTOO STUDIO — V1.2

Landing page estática em HTML + CSS + JavaScript puro.

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

CATÁLOGO DE TESTE
As 15 artes são PLACEHOLDERS e não representam trabalhos reais do Palivo.

COMO TROCAR UMA TATUAGEM
1. Coloque a imagem real em assets/images/tattoos/
2. Abra assets/js/tattoos.js
3. No ID desejado, troque `imagem`
4. Atualize `precoDe`, `precoPor` e `status`

STATUS PERMITIDOS
- status: "disponivel"
- status: "indisponivel"

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
