const menu=document.querySelector('.menu-toggle');
const nav=document.getElementById('navigation');
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(expanded));nav.classList.toggle('open',expanded);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}});
const modal=document.getElementById('preview-dialog');
const title=document.getElementById('dialog-title');
const body=document.getElementById('dialog-body');
function openDialog(heading,content){title.textContent=heading;body.innerHTML=content;modal.showModal();}
document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>{const template=document.getElementById(button.dataset.dialog);openDialog(template.content.querySelector('h2').textContent,template.content.querySelector('div').innerHTML);}));
document.querySelectorAll('.dialog-close').forEach(button=>button.addEventListener('click',()=>modal.close()));
modal.addEventListener('click',event=>{if(event.target===modal){const r=modal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)modal.close();}});

// Carrossel manual: botões, teclado e gesto horizontal.
document.querySelectorAll('.photo-carousel').forEach(carousel=>{
  const slides=[...carousel.querySelectorAll('[data-carousel-slide]')];
  const dots=[...carousel.querySelectorAll('[data-carousel-dot]')];
  const counter=carousel.querySelector('.carousel-count');
  const viewport=carousel.querySelector('.carousel-viewport');
  let current=0;
  let gesture=null;
  function show(index){
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>{slide.hidden=i!==current;});
    dots.forEach((dot,i)=>{dot.classList.toggle('is-active',i===current);dot.setAttribute('aria-current',String(i===current));});
    counter.textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  }
  carousel.querySelector('[data-carousel-prev]').addEventListener('click',()=>show(current-1));
  carousel.querySelector('[data-carousel-next]').addEventListener('click',()=>show(current+1));
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i)));
  carousel.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(current+(event.key==='ArrowLeft'?-1:1));}
  });
  viewport.addEventListener('pointerdown',event=>{if(event.isPrimary)gesture={x:event.clientX,y:event.clientY,id:event.pointerId};});
  viewport.addEventListener('pointerup',event=>{
    if(!gesture||event.pointerId!==gesture.id)return;
    const dx=event.clientX-gesture.x;
    const dy=event.clientY-gesture.y;
    gesture=null;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))show(current+(dx<0?1:-1));
  });
  viewport.addEventListener('pointercancel',()=>{gesture=null;});
});

// Sanfonas nativas com transição de altura e conteúdo, inclusive no fechamento.
document.querySelectorAll('.animated-accordion').forEach(details=>{
  const summary=details.querySelector(':scope > summary');
  const panel=details.querySelector(':scope > .accordion-panel');
  let animation=null;
  let expanded=details.open;
  details.classList.toggle('is-expanded',expanded);
  details.addEventListener('toggle',()=>{if(!animation){expanded=details.open;details.classList.toggle('is-expanded',expanded);}});
  summary.addEventListener('click',event=>{
    if(matchMedia('(prefers-reduced-motion: reduce)').matches||!panel.animate)return;
    event.preventDefault();
    const startHeight=details.open?panel.getBoundingClientRect().height:0;
    const startOpacity=details.open?Number(getComputedStyle(panel).opacity):0;
    expanded=!expanded;
    if(animation)animation.cancel();
    details.open=true;
    details.classList.toggle('is-expanded',expanded);
    panel.style.overflow='hidden';
    const endHeight=expanded?panel.scrollHeight:0;
    const currentAnimation=panel.animate([
      {height:startHeight+'px',opacity:startOpacity,transform:'translateY(0)'},
      {height:endHeight+'px',opacity:expanded?1:0,transform:expanded?'translateY(0)':'translateY(-6px)'}
    ],{duration:360,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
    animation=currentAnimation;
    currentAnimation.onfinish=()=>{
      if(animation!==currentAnimation)return;
      details.open=expanded;
      currentAnimation.cancel();
      panel.style.removeProperty('overflow');
      animation=null;
    };
  });
});

// Carrossel de artigos: scroll nativo para toque, setas e teclado.
document.querySelectorAll('.article-carousel').forEach(carousel=>{
  const track=carousel.querySelector('.articles-grid');
  const cards=[...track.querySelectorAll('.article-card')];
  const previous=carousel.querySelector('[data-articles-prev]');
  const next=carousel.querySelector('[data-articles-next]');
  const status=carousel.querySelector('.article-carousel-status');
  const format=value=>String(value).padStart(2,'0');
  const step=()=>cards[0].getBoundingClientRect().width+20;
  function update(){
    const first=Math.round(track.scrollLeft/step());
    const visible=Math.max(1,Math.round((track.clientWidth+20)/step()));
    const last=Math.min(cards.length,first+visible);
    status.textContent=format(first+1)+(last>first+1?'–'+format(last):'')+' / '+format(cards.length);
    previous.disabled=track.scrollLeft<2;
    next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;
  }
  function move(direction){track.scrollBy({left:direction*step(),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  previous.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  track.addEventListener('keydown',event=>{if(event.target!==track)return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowLeft'?-1:1);}});
  track.addEventListener('scroll',update,{passive:true});
  new ResizeObserver(update).observe(track);
  update();
});
