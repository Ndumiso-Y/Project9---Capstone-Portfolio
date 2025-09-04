
function qs(sel, ctx=document){return ctx.querySelector(sel)}
function qsa(sel, ctx=document){return Array.from(ctx.querySelectorAll(sel))}

window.handleImgError = function(img){
  img.alt = img.alt || "placeholder";
  img.style.background = 'linear-gradient(135deg, var(--primary), #ddd)';
  img.style.objectFit = 'contain';
  img.removeAttribute('src');
  img.closest('.card__media, figure')?.classList.add('no-image');
};

document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.split('/').pop() || 'index.html';
  qsa('.site-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === path) a.setAttribute('aria-current','page');
  });

  const toggle = qs('#navToggle');
  const nav = qs('#siteNav');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const y = qs('#year'); if(y) y.textContent = new Date().getFullYear();

  // Tooltips helper on mobile
  const skillInfo = qs('#skillInfo');
  const skillNotes = qs('#skillNotes');
  if(skillInfo && skillNotes){
    skillInfo.addEventListener('click', () => {
      const hidden = skillNotes.hasAttribute('hidden');
      if(hidden) skillNotes.removeAttribute('hidden'); else skillNotes.setAttribute('hidden','');
      skillInfo.setAttribute('aria-expanded', hidden ? 'true' : 'false');
    });
  }

  // Delegated modal open handler
  document.addEventListener('click', (ev) => {
    const trigger = ev.target.closest('[data-modal-open]');
    if(!trigger) return;
    ev.preventDefault();
    const id = trigger.getAttribute('data-modal-open');
    const modal = qs('#'+id);
    if(modal){
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      const close = modal.querySelector('[data-modal-close]');
      close?.focus();
      const onEsc = (e)=>{ if(e.key==='Escape'){ closeModal(modal); document.removeEventListener('keydown', onEsc)} };
      document.addEventListener('keydown', onEsc);
      modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(modal) });
      close?.addEventListener('click', ()=> closeModal(modal));
    }
  });
  function closeModal(m){
    m.setAttribute('hidden','');
    document.body.style.overflow = '';
  }

  // Lightbox gallery (Design Work)
  const overlay = qs('#lightboxOverlay');
  if(overlay){
    const imgEl = overlay.querySelector('.lightbox__img');
    const prev = overlay.querySelector('.lightbox__prev');
    const next = overlay.querySelector('.lightbox__next');
    const close = overlay.querySelector('.lightbox__close');
    let list = []; let index = 0;

    qsa('.gallery img').forEach((img,i,arr)=>{
      img.addEventListener('click', () => {
        list = arr;
        index = i;
        openLightbox();
      });
    });
    qsa('.lightbox[data-src]').forEach((btn, i, arr)=>{
      btn.addEventListener('click', () => {
        list = arr.map(b=>({src: b.getAttribute('data-src')}));
        index = i;
        openLightbox(true);
      });
    });

    function setSrc(src){ imgEl.src = src; }
    function openLightbox(custom=false){
      overlay.removeAttribute('hidden');
      overlay.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
      setTimeout(()=> overlay.focus(), 0);
      if(custom){ setSrc(list[index].src); } else { setSrc(list[index].src || list[index].getAttribute('src')); }
    }
    function hideOverlay(){
      overlay.setAttribute('hidden','');
      overlay.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
      imgEl.removeAttribute('src');
    }
    function move(delta){
      if(!list || !list.length) return;
      index = (index + delta + list.length) % list.length;
      if(list[index].src) setSrc(list[index].src); else setSrc(list[index].getAttribute('src'));
    }
    prev?.addEventListener('click', ()=>move(-1));
    next?.addEventListener('click', ()=>move(1));
    close?.addEventListener('click', hideOverlay);
    overlay.addEventListener('click', (e)=>{ if(e.target===overlay) hideOverlay(); });
    imgEl?.addEventListener('dblclick', hideOverlay);
    document.addEventListener('keydown', (e)=>{
      if(overlay.hasAttribute('hidden')) return;
      if(e.key==='Escape') hideOverlay();
      if(e.key==='ArrowLeft') move(-1);
      if(e.key==='ArrowRight') move(1);
    });
  }

  // One-audio-at-a-time
  const audios = qsa('audio');
  audios.forEach(a => a.addEventListener('play', () => {
    audios.forEach(b => { if(b!==a) b.pause() });
  }));
});
