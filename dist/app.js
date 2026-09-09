'use strict';
const data = window.BETAR;
const $ = (id) => document.getElementById(id);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches) document.documentElement.classList.add('motion');
let unlocked = false;
const passwordHints = ['you + me', 'bracelet', 'our names', 'BETHANY + PETAR', 'our combined names'];
let revealedHints = 0;
function revealPasswordHint() {
  if (revealedHints >= passwordHints.length) return;
  const hint = document.createElement('li');
  hint.textContent = passwordHints[revealedHints++];
  $('password-hints').hidden = false;
  $('hint-list').append(hint);
}
function resetPasswordHints() {
  revealedHints = 0;
  $('hint-list').replaceChildren();
  $('password-hints').hidden = true;
}
const gate = $('gate');
const site = $('site');
const password = $('password');
let observer;
function revealContent() {
  if (!('IntersectionObserver' in window)) { document.documentElement.classList.remove('motion'); return; }
  observer?.disconnect();
  observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold: 0.07});
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
function openSite() {
  unlocked = true;
  site.hidden = false;
  site.inert = false;
  document.body.classList.remove('locked');
  gate.classList.add('open');
  gate.inert = true;
  try { sessionStorage.setItem('betar-unlocked', 'yes'); } catch {}
  revealContent();
  site.querySelector('a').focus({preventScroll:true});
  tick();
}
$('unlock-form').addEventListener('submit', event => {
  event.preventDefault();
  if (password.value.trim().toLowerCase() === 'betar') { $('password-error').textContent = ''; openSite(); }
  else { revealPasswordHint(); $('password-error').textContent = 'Not quite, my love. Here’s a little help.'; password.setAttribute('aria-invalid','true'); gate.classList.remove('shake'); void gate.offsetWidth; gate.classList.add('shake'); password.select(); }
});
password.addEventListener('input', () => { password.removeAttribute('aria-invalid'); $('password-error').textContent = ''; });
$('show-password').addEventListener('click', () => { const show = password.type === 'password'; password.type = show ? 'text' : 'password'; $('show-password').textContent = show ? 'Hide' : 'Show'; $('show-password').setAttribute('aria-label', show ? 'Hide password' : 'Show password'); });
$('lock').addEventListener('click', () => {
  $('our-video').pause();
  if ($('lightbox').open) $('lightbox').close();
  resetPasswordHints(); $('password-error').textContent=''; password.removeAttribute('aria-invalid'); unlocked=false; site.hidden=true; site.inert=true; gate.inert=false; gate.classList.remove('open'); document.body.classList.add('locked'); password.value=''; password.type='password'; $('show-password').textContent='Show'; $('show-password').setAttribute('aria-label','Show password');
  try { sessionStorage.removeItem('betar-unlocked'); } catch {}
  window.scrollTo(0,0);password.focus();
});
function elapsed(now) {
  const seconds = Math.max(0, Math.floor((now - new Date(data.togetherSince).getTime())/1000));
  return {days: Math.floor(seconds/86400),hours:Math.floor(seconds/3600)%24,minutes:Math.floor(seconds/60)%60,seconds:seconds%60};
}
function tick() { if (!unlocked) return; const parts=elapsed(Date.now()); Object.entries(parts).forEach(([key,value])=> $(key).textContent=key==='days'?String(value):String(value).padStart(2,'0')); }
setInterval(tick,1000);
// All copy comes from the editable content file; textContent keeps notes as plain text.
const memories = [data.firstPhoto, ...data.memories];
const lunaMemory = {image:'luna',title:'Forever loved, Luna.',caption:'Always part of your heart. Always welcome in our little collection of memories.',alt:'Luna resting at home'};
const gallery = $('gallery');
data.memories.forEach((photo,index)=>{
 const button=document.createElement('button');button.className='memory-card reveal';button.setAttribute('aria-label',`Open photo: ${photo.title}`);
 const frame=document.createElement('div');frame.className='memory-image';const img=document.createElement('img');img.src=`assets/${photo.image}.webp`;img.alt=photo.alt;img.loading='lazy';img.decoding='async';[img.width,img.height]=data.imageSizes[photo.image];
 const zoom=document.createElement('span');zoom.className='memory-zoom';zoom.textContent='↗';zoom.setAttribute('aria-hidden','true');frame.append(img,zoom);
 const meta=document.createElement('div');meta.className='memory-meta';const title=document.createElement('h3');title.textContent=photo.title;const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');meta.append(title,number);button.append(frame,meta);button.addEventListener('click',()=>openPhoto(index+1));gallery.append(button);
});
for (const [element, rows] of [['bethany-facts',data.bethanyFacts],['petar-facts',data.petarFacts]]) {
 const list=document.createElement('dl');for(const [label,value] of rows){const row=document.createElement('div');row.className='fact-row';const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=value;row.append(dt,dd);list.append(row);}$(element).append(list);
}
for (const event of data.timeline) {
 const future=event.dream || new Date(event.date).getTime()>Date.now();const item=document.createElement('article');item.className=`timeline-item reveal${future?' future':''}${event.special?' special':''}`;
 const date=document.createElement(event.dream?'span':'time');date.className='eyebrow';date.textContent=event.label;if(!event.dream)date.dateTime=event.date;
 const title=document.createElement('h3');title.textContent=event.title;const text=document.createElement('p');text.textContent=event.text;item.append(date,title);if(event.text)item.append(text);
 if(future){const label=document.createElement('span');label.className='future-label';label.textContent=event.dream?'A DAYDREAM, NOT A DATE':'STILL AHEAD';item.append(label);}$('timeline').append(item);
}
let photoIndex=0;
const dialog=$('lightbox');
function renderPhoto() {const photo=photoIndex === -1 ? lunaMemory : memories[photoIndex];$('lightbox-img').src=`assets/${photo.image}.webp`;$('lightbox-img').alt=photo.alt;$('lightbox-title').textContent=photo.title;$('lightbox-caption').textContent=photo.caption;$('lightbox-index').textContent=photoIndex===-1?'IN LOVING MEMORY':photoIndex===0?'OUR VERY FIRST PHOTO':`MEMORY ${String(photoIndex).padStart(2,'0')} / ${data.memories.length}`;}
$('luna-open').addEventListener('click',()=>openPhoto(-1));
function openPhoto(index){document.querySelector('.lightbox-nav').hidden=index===-1;photoIndex=index;renderPhoto();dialog.showModal();document.body.style.overflow='hidden';}
function stepPhoto(direction){if(photoIndex===-1)return;photoIndex=(photoIndex+direction+memories.length)%memories.length;renderPhoto();}
document.querySelector('[data-special="first"]').addEventListener('click',()=>openPhoto(0));
$('close-lightbox').addEventListener('click',()=>dialog.close());$('previous-photo').addEventListener('click',()=>stepPhoto(-1));$('next-photo').addEventListener('click',()=>stepPhoto(1));
dialog.addEventListener('close',()=>document.body.style.overflow='');dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();stepPhoto(-1);}if(event.key==='ArrowRight'){event.preventDefault();stepPhoto(1);}});
let framePending=false;
window.addEventListener('scroll',()=>{if(framePending||reducedMotion.matches||!unlocked)return;framePending=true;requestAnimationFrame(()=>{if(window.scrollY<900)document.documentElement.style.setProperty('--hero-shift',`${Math.min(window.scrollY*.09,60)}px`);framePending=false;});},{passive:true});
try {if(sessionStorage.getItem('betar-unlocked')==='yes') openSite();} catch {}

const ourVideo = $('our-video');
const playVideo = $('play-video');
function videoPlaybackError() {
  playVideo.hidden = false;
  $('video-play-label').textContent = 'Try playing again';
  $('video-status').hidden = false;
  $('video-status').textContent = 'The video couldn’t start. Try again, or open it directly below.';
  $('video-fallback').hidden = false;
}
playVideo.addEventListener('click', async () => {
  if (!unlocked) return;
  if (ourVideo.ended) ourVideo.currentTime = 0;
  ourVideo.muted = false;
  ourVideo.volume = 1;
  $('video-status').hidden = true;
  $('video-fallback').hidden = true;
  try {
    await ourVideo.play();
    ourVideo.focus({preventScroll: true});
  } catch { videoPlaybackError(); }
});
ourVideo.addEventListener('play', () => { playVideo.hidden = true; $('video-status').hidden = true; $('video-fallback').hidden = true; });
ourVideo.addEventListener('ended', () => { playVideo.hidden = false; $('video-play-label').textContent = 'Play again'; });
ourVideo.addEventListener('error', videoPlaybackError);
