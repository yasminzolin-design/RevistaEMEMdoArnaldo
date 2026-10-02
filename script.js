const book = document.querySelector('#book');
const pages = [...document.querySelectorAll('.page')];
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const counter = document.querySelector('#counter');
let i = 0;
let busy = false;

book.classList.add('flipbook');
pages.forEach((page, idx) => {
  page.classList.remove('active');
  page.classList.add('flip-page');
  page.dataset.page = idx;
  page.style.zIndex = String(pages.length - idx);
});

function render(){
  pages.forEach((page, idx) => {
    page.classList.toggle('flipped', idx < i);
    page.classList.toggle('current', idx === i);
    page.setAttribute('aria-hidden', idx === i ? 'false' : 'true');
  });
  counter.textContent = `${i + 1} / ${pages.length}`;
  prev.disabled = i === 0;
  next.disabled = i === pages.length - 1;
}

function go(n){
  if (busy) return;
  const target = Math.max(0, Math.min(n, pages.length - 1));
  if (target === i) return;
  busy = true;
  i = target;
  render();
  setTimeout(() => busy = false, 760);
}

prev.onclick = () => go(i - 1);
next.onclick = () => go(i + 1);
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown') go(i + 1);
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(i - 1);
});

document.querySelector('#fullscreen').onclick = () =>
  document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();

// Clique nas laterais da página também vira a folha.
book.addEventListener('click', e => {
  if (e.target.closest('button, a')) return;
  const rect = book.getBoundingClientRect();
  const x = e.clientX - rect.left;
  if (x > rect.width * .68) go(i + 1);
  else if (x < rect.width * .32) go(i - 1);
});

// Swipe no celular/tablet.
let touchX = null;
book.addEventListener('touchstart', e => touchX = e.changedTouches[0].clientX, {passive:true});
book.addEventListener('touchend', e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 45) dx < 0 ? go(i + 1) : go(i - 1);
  touchX = null;
}, {passive:true});

render();
