/* =========================================================
 * 프로젝트 카드 캐러셀 + 상세 팝업
 * projects.js의 Projects 배열을 읽어 화면을 그립니다.
 * ========================================================= */

const carousel = document.getElementById("carousel");
const dotsWrap = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");

const AUTOPLAY_MS = 4500;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let current = 0;
let timer = null;
const cards = [];
const dots = [];

/* ---------------------------------------------------------
 * 텍스트 처리
 * 사용자 데이터는 먼저 이스케이프해서 XSS를 막고,
 * 그다음 `코드`와 [미작성] 표시만 HTML로 바꿉니다.
 * --------------------------------------------------------- */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function rich(str) {
    return escapeHtml(str)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\[([^\]]+)\]/g, '<mark class="todo">[$1]</mark>');
}

const icons = {
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    github:
        '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>'
};

/* ---------------------------------------------------------
 * 카드 만들기
 * --------------------------------------------------------- */
function createCard(project, index) {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.style.setProperty("--accent", project.accent);
    card.style.setProperty("--accent2", project.accent2);
    card.setAttribute("aria-label", `${project.title} 프로젝트, 열어서 자세히 보기`);

    const tags = project.tags.slice(0, 5)
        .map(t => `<span class="tag">${rich(t)}</span>`)
        .join("");

    card.innerHTML = `
    <span class="card-mono" aria-hidden="true">${escapeHtml(project.title.charAt(0).toUpperCase())}</span>
    <div class="card-top">
      <span class="card-num">${String(index + 1).padStart(2, "0")} / ${String(Projects.length).padStart(2, "0")}</span>
      <span class="card-org">${rich(project.org)}</span>
    </div>
    <h2>${escapeHtml(project.title)}</h2>
    <p class="card-sub">${rich(project.subtitle)}</p>
    <div class="card-tags">${tags}</div>
    <span class="card-cta">자세히 보기 ${icons.arrow}</span>
  `;

    // 가운데 카드면 팝업, 옆 카드면 그 카드로 이동
    card.addEventListener("click", () => {
        if (dragMoved) return;
        if (index === current) openModal(project);
        else goTo(index);
    });

    card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            index === current ? openModal(project) : goTo(index);
        }
    });

    // 마우스 위치를 따라 빛이 움직이는 효과
    card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });

    return card;
}

function createDot(project, index) {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `${project.title}로 이동`);
    dot.style.setProperty("--dot-color", project.accent);
    dot.addEventListener("click", () => goTo(index));
    return dot;
}

/* ---------------------------------------------------------
 * 카드 배치: 가운데 기준 상대 위치(offset)로 3D 변형을 계산
 * offset 0 = 가운데, -1 = 왼쪽, 1 = 오른쪽
 * --------------------------------------------------------- */
function layout() {
    const n = Projects.length;
    const mobile = window.innerWidth <= 720;
    const shiftX = mobile ? 70 : 62;   // 옆 카드가 얼마나 비켜나는지 (카드 너비 대비 %)

    cards.forEach((card, i) => {
        let offset = i - current;
        if (offset > n / 2) offset -= n;     // 끝과 처음이 이어지도록 보정
        if (offset < -n / 2) offset += n;

        const abs = Math.abs(offset);
        const visible = abs <= 2;

        card.style.transform = `
      translateX(${offset * shiftX}%)
      translateZ(${-abs * 220}px)
      rotateY(${-offset * 30}deg)
      scale(${1 - abs * 0.08})
    `;
        card.style.opacity = visible ? String(1 - abs * 0.3) : "0";
        card.style.zIndex = String(10 - abs);
        card.style.pointerEvents = visible ? "auto" : "none";
        card.classList.toggle("is-active", offset === 0);
        card.setAttribute("aria-current", offset === 0 ? "true" : "false");
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === current);
        dot.setAttribute("aria-selected", String(i === current));
    });
}

function goTo(index) {
    const n = Projects.length;
    current = (index + n) % n;
    layout();
    restartAutoplay();
}

const next = () => goTo(current + 1);
const prev = () => goTo(current - 1);

/* ---------------------------------------------------------
 * 자동 재생: 마우스를 올리거나 팝업이 열리면 멈춤
 * --------------------------------------------------------- */
function startAutoplay() {
    if (reduceMotion || timer || modal.open) return;
    timer = setInterval(next, AUTOPLAY_MS);
}

function stopAutoplay() {
    clearInterval(timer);
    timer = null;
}

function restartAutoplay() {
    stopAutoplay();
    if (!carouselHovered) startAutoplay();
}

let carouselHovered = false;
carousel.addEventListener("mouseenter", () => { carouselHovered = true; stopAutoplay(); });
carousel.addEventListener("mouseleave", () => { carouselHovered = false; startAutoplay(); });
carousel.addEventListener("focusin", stopAutoplay);

// 다른 탭으로 가면 멈춤
document.addEventListener("visibilitychange", () => {
    document.hidden ? stopAutoplay() : startAutoplay();
});

/* ---------------------------------------------------------
 * 드래그 / 스와이프
 * --------------------------------------------------------- */
let dragStartX = null;
let dragMoved = false;

carousel.addEventListener("pointerdown", e => {
    dragStartX = e.clientX;
    dragMoved = false;
});

window.addEventListener("pointerup", e => {
    if (dragStartX === null) return;
    const dx = e.clientX - dragStartX;
    dragStartX = null;
    if (Math.abs(dx) > 50) {
        dragMoved = true;           // 드래그 직후의 click은 무시
        dx < 0 ? next() : prev();
        setTimeout(() => (dragMoved = false), 0);
    }
});

/* ---------------------------------------------------------
 * 상세 팝업
 * --------------------------------------------------------- */
function renderModal(p) {
    const meta = [
        ["기간", p.period],
        ["팀", p.team],
        ["역할", p.myRole]
    ].map(([k, v]) => `<div><dt>${k}</dt><dd>${rich(v)}</dd></div>`).join("");

    const responsibilities = p.responsibilities
        .map(r => `<li>${rich(r)}</li>`)
        .join("");

    const stack = p.stack.map(s => `
    <div class="m-stack-row">
      <span class="group">${escapeHtml(s.group)}</span>
      <div class="tags">${s.items.map(t => `<span class="tag">${rich(t)}</span>`).join("")}</div>
    </div>
  `).join("");

    const troubles = p.troubleshooting.map((t, i) => `
    <details ${i === 0 ? "open" : ""}>
      <summary>
        <span class="num">${String(i + 1).padStart(2, "0")}</span>
        <span>${rich(t.title)}</span>
        ${icons.chev}
      </summary>
      <div class="ts-flow">
        <div class="ts-step problem"><b>문제</b><p>${rich(t.problem)}</p></div>
        <div class="ts-step cause"><b>원인</b><p>${rich(t.cause)}</p></div>
        <div class="ts-step solution"><b>해결</b><p>${rich(t.solution)}</p></div>
      </div>
    </details>
  `).join("");

    const links = p.links.map(l => l.url
        ? `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${icons.github}${escapeHtml(l.label)}</a>`
        : `<a aria-disabled="true">${icons.github}${escapeHtml(l.label)} <mark class="todo">[URL]</mark></a>`
    ).join("");

    return `
    <header class="m-hero">
      <button class="m-close" type="button" aria-label="닫기">${icons.close}</button>
      <p class="m-org">${rich(p.org)}</p>
      <h2 id="modalTitle">${escapeHtml(p.title)}</h2>
      <p class="m-sub">${rich(p.subtitle)}</p>
      <dl class="m-meta">${meta}</dl>
    </header>

    <div class="m-body">
      <section class="m-section">
        <h3>Overview</h3>
        <p class="m-overview">${rich(p.overview)}</p>
      </section>

      <section class="m-section">
        <h3>What I Did</h3>
        <ul class="m-list">${responsibilities}</ul>
      </section>

      <section class="m-section">
        <h3>Tech Stack</h3>
        <div class="m-stack">${stack}</div>
      </section>

      <section class="m-section">
        <h3>Troubleshooting</h3>
        <div class="ts">${troubles}</div>
      </section>

      <section class="m-section">
        <h3>Links</h3>
        <div class="m-links">${links}</div>
      </section>
    </div>
  `;
}

function openModal(project) {
    stopAutoplay();
    modal.style.setProperty("--accent", project.accent);
    modal.style.setProperty("--accent2", project.accent2);
    modalBody.innerHTML = renderModal(project);
    modalBody.scrollTop = 0;
    modal.showModal();
    document.documentElement.classList.add("lock");   // 뒤쪽 페이지 스크롤 막기
    modalBody.querySelector(".m-close").addEventListener("click", closeModal);
}

function closeModal() {
    if (!modal.open || modal.classList.contains("closing")) return;
    if (reduceMotion) return finishClose();
    modal.classList.add("closing");
    modal.addEventListener("animationend", finishClose, { once: true });
}

function finishClose() {
    modal.classList.remove("closing");
    modal.close();
}

modal.addEventListener("close", () => {
    document.documentElement.classList.remove("lock");
    cards[current].focus({ preventScroll: true });
    startAutoplay();
});

// 바깥(배경) 클릭 시 닫기: dialog 자체를 클릭하면 배경 영역
modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
});

// ESC: 기본 동작 대신 닫힘 애니메이션을 거치도록
modal.addEventListener("cancel", e => {
    e.preventDefault();
    closeModal();
});

/* ---------------------------------------------------------
 * 키보드
 * --------------------------------------------------------- */
document.addEventListener("keydown", e => {
    if (modal.open) return;
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
});

prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);
window.addEventListener("resize", layout);

/* ---------------------------------------------------------
 * 시작
 * --------------------------------------------------------- */
Projects.forEach((p, i) => {
    const card = createCard(p, i);
    const dot = createDot(p, i);
    cards.push(card);
    dots.push(dot);
    carousel.appendChild(card);
    dotsWrap.appendChild(dot);
});

layout();
startAutoplay();