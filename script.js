// ============================================================================
// CONFIGURAÇÃO DA GALERIA — ADICIONE NOVOS LINKS AQUI FACILMENTE
// Cada item aceita:
//   type: "image" | "video"
//   src: "URL direta da foto ou vídeo (.jpeg, .png, .mp4)"
//   category: "resultado" | "antes-depois" | "feedback"
//   categoryLabel: texto curto exibido no card
//   caption: legenda curta exibida no card e no lightbox
// ============================================================================

const RESULTS_GALLERY = [
  {
    type: "image",
    src: "https://i.imgur.com/zuPzRbr.jpeg",
    category: "resultado",
    categoryLabel: "Resultado",
    caption: "Design e alinhamento com naturalidade",
  },
  {
    type: "image",
    src: "https://i.imgur.com/vNAbbfL.jpeg",
    category: "resultado",
    categoryLabel: "Resultado",
    caption: "Fios preservados e simetria facial",
  },
  {
    type: "image",
    src: "https://i.imgur.com/ja7HIug.jpeg",
    category: "resultado",
    categoryLabel: "Resultado",
    caption: "Acabamento leve pensado para o rosto",
  },
  {
    type: "image",
    src: "https://i.imgur.com/kr7yXSz.jpeg",
    category: "resultado",
    categoryLabel: "Resultado",
    caption: "Resultado imediato pós-atendimento",
  },
  {
    type: "image",
    src: "https://i.imgur.com/eRY96rt.jpeg",
    category: "antes-depois",
    categoryLabel: "Antes",
    caption: "Antes do procedimento — avaliação inicial",
  },
  {
    type: "image",
    src: "https://i.imgur.com/a9sSJOd.jpeg",
    category: "antes-depois",
    categoryLabel: "Depois",
    caption: "Depois do procedimento — harmonia e definição",
  },
  {
    type: "image",
    src: "https://i.imgur.com/7RzydWz.jpeg",
    category: "resultado",
    categoryLabel: "Resultado",
    caption: "Sobrancelhas definidas sem aspecto artificial",
  },
  {
    type: "video",
    src: "https://i.imgur.com/rd4PUgk.mp4",
    category: "resultado",
    categoryLabel: "Vídeo",
    caption: "Resultado real em movimento no studio",
  },
  {
    type: "image",
    src: "https://i.imgur.com/zk1qON6.jpeg",
    category: "feedback",
    categoryLabel: "Feedback",
    caption: "Depoimento real de cliente atendida",
  },
  {
    type: "image",
    src: "https://i.imgur.com/fX5122O.jpeg",
    category: "feedback",
    categoryLabel: "Feedback",
    caption: "Relato de confiança e satisfação",
  },
];

// ============================================================================
// BASTIDORES & LOCAL DE ATENDIMENTO — ADICIONE NOVOS LINKS AQUI
// ============================================================================

const BEHIND_THE_SCENES = [
  {
    type: "video",
    src: "https://i.imgur.com/DIWY0y1.mp4",
    caption: "Atendimento personalizado e bastidores",
  },
  {
    type: "image",
    src: "https://i.imgur.com/DrmMiSP.jpeg",
    caption: "Espaço de atendimento em Campinas - SP",
  },
  {
    type: "image",
    src: "https://i.imgur.com/za89qQW.jpeg",
    caption: "Ambiente preparado para receber você",
  },
  {
    type: "image",
    src: "https://i.imgur.com/W0AoXrB.jpeg",
    caption: "Estrutura para atendimentos e cursos presenciais",
  },
  {
    type: "image",
    src: "https://i.imgur.com/4yakj2e.jpeg",
    caption: "Acompanhamento de perto em cada detalhe",
  },
];

// ============================================================================
// Estado e Referências de DOM
// ============================================================================

let activeFilter = "todos";
let activeLightboxItems = [];
let activeLightboxIndex = 0;
let lastFocusedElement = null;

const galleryContainer = document.getElementById("results-gallery");
const btsContainer = document.getElementById("bts-track");
const beforeAfterShowcase = document.getElementById("antes-depois-destaque");
const filterTabs = document.querySelectorAll(".filter-tab");

const baRange = document.getElementById("ba-range");
const baSliderWrap = document.getElementById("ba-slider");

const lightbox = document.getElementById("lightbox");
const lightboxStage = document.getElementById("lightbox-stage");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCloseBtn = document.getElementById("lightbox-close");
const lightboxPrevBtn = document.getElementById("lightbox-prev");
const lightboxNextBtn = document.getElementById("lightbox-next");

const menuToggle = document.getElementById("menu-toggle");
const mobileNav = document.getElementById("mobile-nav");

// ============================================================================
// Helpers de Mídia (com proteção contra quebra de imagem)
// ============================================================================

function createMediaElement(item, isThumbnail = true) {
  if (item.type === "video") {
    const video = document.createElement("video");
    video.src = item.src;
    video.playsInline = true;
    if (isThumbnail) {
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.preload = "metadata";
    } else {
      video.controls = true;
      video.autoplay = true;
    }
    video.addEventListener("error", () => {
      video.parentElement?.classList.add("is-error");
    });
    return video;
  }

  const img = document.createElement("img");
  img.src = item.src;
  img.alt = item.caption || "Registro de trabalho de Kezia Mendonça";
  img.referrerPolicy = "no-referrer";
  img.loading = isThumbnail ? "lazy" : "eager";
  img.addEventListener("error", () => {
    img.parentElement?.classList.add("is-error");
  });
  return img;
}

function createZoomIcon() {
  const span = document.createElement("span");
  span.className = "gallery-zoom-hint";
  span.setAttribute("aria-hidden", "true");
  span.innerHTML =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
  return span;
}

// ============================================================================
// Renderização da Galeria de Resultados
// ============================================================================

function renderResultsGallery() {
  if (!galleryContainer) return;

  const filtered =
    activeFilter === "todos"
      ? RESULTS_GALLERY
      : RESULTS_GALLERY.filter((item) => item.category === activeFilter);

  if (beforeAfterShowcase) {
    const showShowcase =
      activeFilter === "todos" || activeFilter === "antes-depois";
    beforeAfterShowcase.hidden = !showShowcase;
  }

  galleryContainer.innerHTML = "";

  filtered.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gallery-card";
    card.setAttribute("aria-label", `Ampliar: ${item.caption}`);

    const mediaBox = document.createElement("div");
    mediaBox.className = "gallery-media-box";
    mediaBox.appendChild(createMediaElement(item, true));
    mediaBox.appendChild(createZoomIcon());

    const fallback = document.createElement("div");
    fallback.className = "media-fallback";
    fallback.setAttribute("aria-hidden", "true");
    fallback.innerHTML = `<span>${item.categoryLabel}</span>`;
    mediaBox.appendChild(fallback);

    const meta = document.createElement("div");
    meta.className = "gallery-card-meta";

    const cat = document.createElement("span");
    cat.className = "gallery-card-cat";
    cat.textContent = item.categoryLabel;

    const caption = document.createElement("span");
    caption.className = "gallery-card-caption";
    caption.textContent = item.caption;

    meta.appendChild(cat);
    meta.appendChild(caption);

    card.appendChild(mediaBox);
    card.appendChild(meta);

    card.addEventListener("click", () => {
      openLightbox(filtered, index);
    });

    galleryContainer.appendChild(card);
  });
}

// ============================================================================
// Renderização de Bastidores / Espaço em Campinas
// ============================================================================

function renderBehindTheScenes() {
  if (!btsContainer) return;

  btsContainer.innerHTML = "";

  BEHIND_THE_SCENES.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "bts-card";
    card.setAttribute("aria-label", `Visualizar: ${item.caption}`);

    const mediaBox = document.createElement("div");
    mediaBox.className = "bts-media-box";
    mediaBox.appendChild(createMediaElement(item, true));
    mediaBox.appendChild(createZoomIcon());

    const fallback = document.createElement("div");
    fallback.className = "media-fallback";
    fallback.setAttribute("aria-hidden", "true");
    fallback.innerHTML = "<span>Studio Campinas</span>";
    mediaBox.appendChild(fallback);

    const caption = document.createElement("span");
    caption.className = "bts-caption";
    caption.textContent = item.caption;

    card.appendChild(mediaBox);
    card.appendChild(caption);

    card.addEventListener("click", () => {
      openLightbox(BEHIND_THE_SCENES, index);
    });

    btsContainer.appendChild(card);
  });
}

// ============================================================================
// Lightbox (Tela Cheia)
// ============================================================================

function renderLightboxStage() {
  if (!lightboxStage || !lightboxCaption) return;
  const current = activeLightboxItems[activeLightboxIndex];
  if (!current) return;

  lightboxStage.innerHTML = "";

  if (current.type === "pair") {
    const pairWrap = document.createElement("div");
    pairWrap.className = "lightbox-pair";

    const beforeWrap = document.createElement("div");
    beforeWrap.className = "lightbox-pair-item";
    const beforeLabel = document.createElement("span");
    beforeLabel.textContent = "Antes";
    const beforeImg = document.createElement("img");
    beforeImg.src = current.beforeSrc;
    beforeImg.alt = "Antes do procedimento";
    beforeImg.referrerPolicy = "no-referrer";
    beforeWrap.appendChild(beforeLabel);
    beforeWrap.appendChild(beforeImg);

    const afterWrap = document.createElement("div");
    afterWrap.className = "lightbox-pair-item";
    const afterLabel = document.createElement("span");
    afterLabel.textContent = "Depois";
    const afterImg = document.createElement("img");
    afterImg.src = current.afterSrc;
    afterImg.alt = "Depois do procedimento";
    afterImg.referrerPolicy = "no-referrer";
    afterWrap.appendChild(afterLabel);
    afterWrap.appendChild(afterImg);

    pairWrap.appendChild(beforeWrap);
    pairWrap.appendChild(afterWrap);
    lightboxStage.appendChild(pairWrap);
  } else {
    lightboxStage.appendChild(createMediaElement(current, false));
  }

  lightboxCaption.textContent = current.caption || "";

  const hasMultiple = activeLightboxItems.length > 1;
  if (lightboxPrevBtn) lightboxPrevBtn.hidden = !hasMultiple;
  if (lightboxNextBtn) lightboxNextBtn.hidden = !hasMultiple;
}

function openLightbox(items, startIndex = 0) {
  if (!lightbox) return;
  lastFocusedElement = document.activeElement;
  activeLightboxItems = items;
  activeLightboxIndex = startIndex;

  renderLightboxStage();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxCloseBtn?.focus();
}

function closeLightbox() {
  if (!lightbox || lightbox.hidden) return;
  lightbox.hidden = true;
  if (lightboxStage) lightboxStage.innerHTML = "";
  document.body.style.overflow = "";
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

function stepLightbox(direction) {
  if (activeLightboxItems.length <= 1) return;
  activeLightboxIndex =
    (activeLightboxIndex + direction + activeLightboxItems.length) %
    activeLightboxItems.length;
  renderLightboxStage();
}

// ============================================================================
// Event Listeners & Inicialização
// ============================================================================

function initInteractions() {
  // Filtros da galeria
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeFilter = tab.dataset.filter || "todos";
      filterTabs.forEach((btn) => {
        const selected = btn === tab;
        btn.classList.toggle("is-active", selected);
        btn.setAttribute("aria-selected", String(selected));
      });
      renderResultsGallery();
    });
  });

  // Slider Antes & Depois
  if (baRange && baSliderWrap) {
    const updateSlider = () => {
      baSliderWrap.style.setProperty("--ba-pos", `${baRange.value}%`);
    };
    baRange.addEventListener("input", updateSlider);
    updateSlider();
  }

  // Botão Ampliar Antes & Depois lado a lado
  document.querySelectorAll("[data-open-pair]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pairValue = btn.getAttribute("data-open-pair") || "";
      const [beforeSrc, afterSrc] = pairValue.split("|");
      if (beforeSrc && afterSrc) {
        openLightbox(
          [
            {
              type: "pair",
              beforeSrc,
              afterSrc,
              caption: "Comparativo Antes & Depois — Kezia Mendonça",
            },
          ],
          0
        );
      }
    });
  });

  // Controles do carrossel de bastidores
  const prevBtsBtn = document.getElementById("bts-prev");
  const nextBtsBtn = document.getElementById("bts-next");
  if (btsContainer && prevBtsBtn && nextBtsBtn) {
    const scrollAmount = () => Math.max(280, btsContainer.clientWidth * 0.7);
    prevBtsBtn.addEventListener("click", () => {
      btsContainer.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });
    nextBtsBtn.addEventListener("click", () => {
      btsContainer.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });
  }

  // Eventos do Lightbox
  lightboxCloseBtn?.addEventListener("click", closeLightbox);
  lightboxPrevBtn?.addEventListener("click", () => stepLightbox(-1));
  lightboxNextBtn?.addEventListener("click", () => stepLightbox(1));

  document.querySelectorAll("[data-lightbox-close]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  // Menu Mobile
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      mobileNav.hidden = isExpanded;
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
      });
    });
  }

  // Proteção de fallback para imagens estáticas (Hero / Sobre)
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.parentElement?.classList.add("is-error");
    });
  });

  // Ano automático no rodapé
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

renderResultsGallery();
renderBehindTheScenes();
initInteractions();
