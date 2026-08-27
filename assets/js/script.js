const CONFIG = {
  whatsapp: "5571996754698",
  instagram: "https://www.instagram.com/palivotattoo/",
  ga4: "G-PWEH5VKX5H"
};

const categoryOrder = [
  ["fine-art","Fine Art"],
  ["fine-line","Fine Line"],
  ["cristao","Cristão"],
  ["realismo","Realismo"],
  ["escrita","Escrita"]
];

let selectedTattoo = null;

function track(name, params={}) {
  if (typeof window.gtag === "function") window.gtag("event", name, params);
}

function cardHTML(t) {
  const unavailable = t.status !== "disponivel";
  const statusLabel = unavailable ? "Indisponível" : "Disponível";
  return `<article class="tattoo-card ${unavailable ? "is-unavailable":""}" data-id="${t.id}">
    <div class="tattoo-art"><img loading="lazy" width="700" height="900" src="${t.imagem}" alt="Arte de teste ${t.id} — substituir pela tatuagem real"></div>
    <div class="tattoo-info">
      <div class="tattoo-top"><span class="tattoo-id">${t.id}</span><span class="status ${t.status}">${statusLabel}</span></div>
      <small>${t.categoriaNome} · arte temporária de teste</small>
      <div class="price-block" aria-label="Preço de teste">
        <span class="price-from">DE: <strong>${t.precoDe || "R$000"}</strong></span>
        <span class="price-to">POR: <strong>${t.precoPor || "R$000"}</strong></span>
      </div>
      <button type="button" class="btn ${unavailable ? "btn-ghost":"btn-primary"} choose-tattoo" ${unavailable?"disabled":""} data-id="${t.id}">${unavailable ? "Indisponível" : "Quero essa"}</button>
    </div>
  </article>`;
}

function renderCatalog() {
  categoryOrder.forEach(([slug]) => {
    const el = document.querySelector(`[data-carousel="${slug}"]`);
    if (!el) return;
    el.innerHTML = window.TATTOOS.filter(t => t.categoria === slug).map(cardHTML).join("");
  });
  document.querySelectorAll(".choose-tattoo:not([disabled])").forEach(btn => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      selectTattoo(btn.dataset.id);
    });
  });
}

function selectTattoo(id) {
  selectedTattoo = window.TATTOOS.find(t => t.id === id && t.status === "disponivel");
  if (!selectedTattoo) return;
  const box = document.querySelector("#selectedPreview");
  box.innerHTML = `<img src="${selectedTattoo.imagem}" alt=""><div><small>Tatuagem selecionada</small><strong>${selectedTattoo.id}</strong><div>${selectedTattoo.categoriaNome}</div><div class="selected-price">DE: ${selectedTattoo.precoDe} · POR: ${selectedTattoo.precoPor}</div></div>`;
  box.classList.add("show");
  document.querySelector("#tattooId").value = selectedTattoo.id;
  const submit = document.querySelector("#submitWhatsapp");
  submit.disabled = false;
  submit.removeAttribute("aria-disabled");
  track("select_tattoo",{tattoo_id:selectedTattoo.id,tattoo_style:selectedTattoo.categoria});
  document.querySelector("#reserva").scrollIntoView({behavior:"smooth",block:"start"});
}

function setupCarousels() {
  document.querySelectorAll(".carousel").forEach(carousel => {
    let down=false,startX=0,startScroll=0,moved=false;
    carousel.addEventListener("pointerdown", e => {
      if (e.target.closest("button, a, input, select, textarea")) return;
      down=true; moved=false; startX=e.clientX; startScroll=carousel.scrollLeft;
      carousel.classList.add("dragging");
      carousel.setPointerCapture?.(e.pointerId);
    });
    carousel.addEventListener("pointermove", e => {
      if(!down)return;
      const delta=e.clientX-startX;
      if(Math.abs(delta)>5)moved=true;
      carousel.scrollLeft=startScroll-delta;
    });
    ["pointerup","pointercancel","pointerleave"].forEach(ev => carousel.addEventListener(ev,()=>{down=false;carousel.classList.remove("dragging")}));
  });
  document.querySelectorAll("[data-scroll]").forEach(btn => btn.addEventListener("click",()=>{
    const carousel=document.querySelector(`[data-carousel="${btn.dataset.scroll}"]`);
    carousel?.scrollBy({left:(btn.dataset.dir==="next"?1:-1)*Math.min(420,carousel.clientWidth*.8),behavior:"smooth"});
  }));
}

function setupSectionSelector(){
  const select=document.querySelector("#sectionSelect");
  select?.addEventListener("change",()=>{
    const target=document.querySelector(select.value);
    target?.scrollIntoView({behavior:"smooth",block:"start"});
  });
}

function setupForm() {
  const form=document.querySelector("#leadForm");
  const msg=document.querySelector("#formMessage");
  const submit=document.querySelector("#submitWhatsapp");
  submit.disabled = true;
  submit.setAttribute("aria-disabled","true");

  form.addEventListener("submit", e => {
    e.preventDefault();
    msg.classList.remove("show");
    if(!selectedTattoo){
      msg.textContent="Escolha uma tatuagem disponível antes de enviar.";
      msg.classList.add("show");
      return;
    }
    const data=new FormData(form);
    const nome=(data.get("nome")||"").trim();
    const telefone=(data.get("telefone")||"").trim();
    if(!nome || !telefone){
      msg.textContent="Preencha seu nome e WhatsApp.";
      msg.classList.add("show");
      return;
    }
    const obs=(data.get("observacao")||"").trim();
    const text=`Olá! Vim pelo site do Palivo Tattoo Studio e quero saber sobre esta tatuagem:\n\n*Tatuagem:* ${selectedTattoo.id}\n*Estilo:* ${selectedTattoo.categoriaNome}\n*Preço exibido:* DE: ${selectedTattoo.precoDe} · POR: ${selectedTattoo.precoPor}\n*Status no momento do clique:* Disponível\n*Nome:* ${nome}\n*Meu WhatsApp:* ${telefone}\n*Atendimento:* Jacobina${obs?`\n*Observação:* ${obs}`:""}\n\nQuero verificar a disponibilidade e os próximos passos.`;
    track("lead_whatsapp",{event_category:"tattoo_offer",tattoo_id:selectedTattoo.id,tattoo_style:selectedTattoo.categoria,tattoo_name:selectedTattoo.nome||selectedTattoo.id,atendimento:"jacobina"});
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`,"_blank","noopener");
  });
}

function setupReveal(){
  if(!("IntersectionObserver" in window)){
    document.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
    return;
  }
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.08});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
}

document.addEventListener("DOMContentLoaded",()=>{renderCatalog();setupCarousels();setupSectionSelector();setupForm();setupReveal()});
