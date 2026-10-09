const menu=document.querySelector('.menu-toggle');
const nav=document.getElementById('navigation');
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(expanded));nav.classList.toggle('open',expanded);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}});
const modal=document.getElementById('preview-dialog');
const title=document.getElementById('dialog-title');
const body=document.getElementById('dialog-body');
function openDialog(heading,content){title.textContent=heading;body.innerHTML=content;modal.showModal();}
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
  const action=button.dataset.action;
  if(action==='reviews')openDialog('Avaliações no Google','<p>O perfil profissional do Google será vinculado após a confirmação do endereço público correto.</p><p class="prototype-note">As avaliações desta seção são espaços reservados. Não foram criados depoimentos nem notas fictícias.</p>');
}));
document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>{const template=document.getElementById(button.dataset.dialog);openDialog(template.content.querySelector('h2').textContent,template.content.querySelector('div').innerHTML);}));
document.querySelectorAll('[data-legal]').forEach(button=>button.addEventListener('click',()=>openDialog(button.dataset.legal,'<p>Espaço reservado para o documento aprovado para este consultório.</p><p class="prototype-note">O texto legal ainda precisa ser fornecido e deve refletir o funcionamento real do site e os serviços utilizados.</p>')));
document.querySelectorAll('.dialog-close').forEach(button=>button.addEventListener('click',()=>modal.close()));
modal.addEventListener('click',event=>{if(event.target===modal){const r=modal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)modal.close();}});
