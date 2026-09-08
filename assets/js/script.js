const CONFIG={whatsapp:"5571996754698",instagram:"https://www.instagram.com/palivotattoo/",ga4:"G-PWEH5VKX5H"};
const categoryOrder=[["fine-art","Fine Art"],["fine-line","Fine Line"],["cristao","Cristão"],["realismo","Realismo"],["escrita","Escrita"]];
let tattoos=[];
let cart=[];

function track(name,params={}){if(typeof window.gtag==="function")window.gtag("event",name,params)}
function escapeHTML(value=""){return String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c])}
function money(value){return Number(value||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function imageURL(path){if(!path)return"";if(/^https?:\/\//i.test(path))return path;return`${window.PALIVO_SUPABASE.url}/storage/v1/object/public/tattoos/${path}`}
function normalizedTattoo(row){return{uuid:row.id,id:row.codigo,categoria:row.categoria,categoriaNome:row.categoria_nome,imagem:imageURL(row.imagem_path),status:row.status,precoDe:money(row.preco_de),precoPor:money(row.preco_por)}}

function cardHTML(t){
  const unavailable=t.status!=="disponivel";
  const added=cart.some(item=>item.id===t.id);
  const statusLabel=t.status==="em_negociacao"?"Em negociação":unavailable?"Indisponível":"Disponível";
  return `<article class="tattoo-card ${unavailable?"is-unavailable":""}" data-id="${escapeHTML(t.id)}">
    <button type="button" class="tattoo-art preview-art" data-id="${escapeHTML(t.id)}" aria-label="Ampliar arte ${escapeHTML(t.id)}"><img loading="lazy" width="700" height="900" src="${escapeHTML(t.imagem)}" alt="Tatuagem ${escapeHTML(t.id)}"><span class="zoom-hint">Ampliar</span></button>
    <div class="tattoo-info"><div class="tattoo-top"><span class="tattoo-id">${escapeHTML(t.id)}</span><span class="status ${escapeHTML(t.status)}">${statusLabel}</span></div>
    <small>${escapeHTML(t.categoriaNome)}</small><div class="price-block"><span class="price-from">DE: <strong>${escapeHTML(t.precoDe)}</strong></span><span class="price-to">POR: <strong>${escapeHTML(t.precoPor)}</strong></span></div>
    <button type="button" class="btn ${added?"btn-ghost":unavailable?"btn-ghost":"btn-primary"} choose-tattoo" ${unavailable||added?"disabled":""} data-id="${escapeHTML(t.id)}">${added?"Adicionada ao pedido ✓":unavailable?statusLabel:"Adicionar ao pedido"}</button></div></article>`;
}

function renderCatalog(){
  categoryOrder.forEach(([slug])=>{const el=document.querySelector(`[data-carousel="${slug}"]`);if(!el)return;const items=tattoos.filter(t=>t.categoria===slug);el.innerHTML=items.length?items.map(cardHTML).join(""):'<div class="catalog-empty">Nenhuma arte cadastrada nesta categoria.</div>'});
  document.querySelectorAll(".choose-tattoo:not([disabled])").forEach(btn=>btn.addEventListener("click",e=>{e.stopPropagation();addToCart(btn.dataset.id)}));
  document.querySelectorAll(".preview-art").forEach(btn=>btn.addEventListener("click",()=>openLightbox(btn.dataset.id)));
}

async function loadCatalog(){
  const cfg=window.PALIVO_SUPABASE;
  if(!cfg||cfg.url.startsWith("COLE_")||cfg.publishableKey.startsWith("COLE_")||!window.supabase)throw new Error("Supabase ainda não foi configurado.");
  const client=window.supabase.createClient(cfg.url,cfg.publishableKey);
  const{data,error}=await client.from("tattoos").select("*").order("ordem",{ascending:true}).order("criado_em",{ascending:false});
  if(error)throw error;tattoos=(data||[]).map(normalizedTattoo);renderCatalog();
}

function addToCart(id){
  const item=tattoos.find(t=>t.id===id&&t.status==="disponivel");
  if(!item||cart.some(t=>t.id===id))return;
  cart.push(item);updateCart();renderCatalog();
  track("select_tattoo",{tattoo_id:item.id,tattoo_style:item.categoria,cart_size:cart.length});
  document.querySelector("#reserva").scrollIntoView({behavior:"smooth",block:"start"});
}
function removeFromCart(id){cart=cart.filter(item=>item.id!==id);updateCart();renderCatalog()}
function updateCart(){
  const box=document.querySelector("#selectedPreview"),submit=document.querySelector("#submitWhatsapp");
  document.querySelector("#tattooId").value=cart.map(item=>item.id).join(",");
  if(!cart.length){box.classList.remove("show");box.innerHTML="";submit.disabled=true;submit.setAttribute("aria-disabled","true");return}
  box.innerHTML=`<div class="cart-title"><strong>Seu pedido</strong><span>${cart.length} ${cart.length===1?"arte selecionada":"artes selecionadas"}</span></div><div class="cart-items">${cart.map(item=>`<article class="cart-item"><img src="${escapeHTML(item.imagem)}" alt=""><div><strong>${escapeHTML(item.id)}</strong><span>${escapeHTML(item.categoriaNome)}</span><small>${escapeHTML(item.precoPor)}</small></div><button type="button" class="remove-item" data-id="${escapeHTML(item.id)}" aria-label="Remover ${escapeHTML(item.id)}">Remover</button></article>`).join("")}</div>`;
  box.classList.add("show");submit.disabled=false;submit.removeAttribute("aria-disabled");
  box.querySelectorAll(".remove-item").forEach(btn=>btn.addEventListener("click",()=>removeFromCart(btn.dataset.id)));
}

function openLightbox(id){const item=tattoos.find(t=>t.id===id);if(!item)return;const modal=document.querySelector("#artLightbox");document.querySelector("#lightboxImage").src=item.imagem;modal.hidden=false;modal.setAttribute("aria-hidden","false");document.body.classList.add("lightbox-open");document.querySelector("#closeLightbox").focus()}
function closeLightbox(){const modal=document.querySelector("#artLightbox");modal.hidden=true;modal.setAttribute("aria-hidden","true");document.querySelector("#lightboxImage").src="";document.body.classList.remove("lightbox-open")}
function setupLightbox(){const modal=document.querySelector("#artLightbox");document.querySelector("#closeLightbox").addEventListener("click",closeLightbox);modal.addEventListener("click",e=>{if(e.target===modal)closeLightbox()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)closeLightbox()})}

function setupCarousels(){document.querySelectorAll(".carousel").forEach(carousel=>{let down=false,startX=0,startScroll=0;carousel.addEventListener("pointerdown",e=>{if(e.target.closest("button,a,input,select,textarea"))return;down=true;startX=e.clientX;startScroll=carousel.scrollLeft;carousel.classList.add("dragging");carousel.setPointerCapture?.(e.pointerId)});carousel.addEventListener("pointermove",e=>{if(down)carousel.scrollLeft=startScroll-(e.clientX-startX)});["pointerup","pointercancel","pointerleave"].forEach(ev=>carousel.addEventListener(ev,()=>{down=false;carousel.classList.remove("dragging")}))});document.querySelectorAll("[data-scroll]").forEach(btn=>btn.addEventListener("click",()=>{const carousel=document.querySelector(`[data-carousel="${btn.dataset.scroll}"]`);carousel?.scrollBy({left:(btn.dataset.dir==="next"?1:-1)*Math.min(420,carousel.clientWidth*.8),behavior:"smooth"})}))}
function setupSectionSelector(){const select=document.querySelector("#sectionSelect");select?.addEventListener("change",()=>document.querySelector(select.value)?.scrollIntoView({behavior:"smooth",block:"start"}))}
function setupForm(){
  const form=document.querySelector("#leadForm"),msg=document.querySelector("#formMessage"),submit=document.querySelector("#submitWhatsapp");submit.disabled=true;submit.setAttribute("aria-disabled","true");
  form.addEventListener("submit",e=>{e.preventDefault();msg.classList.remove("show");if(!cart.length){msg.textContent="Adicione pelo menos uma tatuagem ao pedido.";msg.classList.add("show");return}const data=new FormData(form),nome=(data.get("nome")||"").trim(),telefone=(data.get("telefone")||"").trim();if(!nome||!telefone){msg.textContent="Preencha seu nome e WhatsApp.";msg.classList.add("show");return}const obs=(data.get("observacao")||"").trim();const arts=cart.map((item,index)=>`${index+1}. *${item.id}* — ${item.categoriaNome}\n   DE: ${item.precoDe} · POR: ${item.precoPor}`).join("\n\n");const text=`Olá! Vim pelo site do Palivo Tattoo Studio e montei este pedido:\n\n${arts}\n\n*Quantidade de artes:* ${cart.length}\n*Nome:* ${nome}\n*Meu WhatsApp:* ${telefone}\n*Atendimento:* Jacobina${obs?`\n*Observação:* ${obs}`:""}\n\nQuero verificar a disponibilidade e os próximos passos.`;track("lead_whatsapp",{event_category:"tattoo_offer",tattoo_ids:cart.map(item=>item.id).join(","),cart_size:cart.length,atendimento:"jacobina"});window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`,"_blank","noopener")});
}
function setupReveal(){if(!("IntersectionObserver"in window)){document.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.08});document.querySelectorAll(".reveal").forEach(el=>io.observe(el))}
document.addEventListener("DOMContentLoaded",async()=>{setupCarousels();setupSectionSelector();setupForm();setupReveal();setupLightbox();try{await loadCatalog()}catch(error){console.error(error);document.querySelectorAll(".carousel").forEach(el=>el.innerHTML='<div class="catalog-error">Não foi possível carregar as artes. Tente novamente em instantes.</div>')}});
