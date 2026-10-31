/* Muwan Syahdan portfolio | script.js
   1) tiles, categories, groups  2) scroll animation  3) live embeds  4) smooth close  5) interaction layer */

/* ---- 1. tiles / categories / groups / copy ---- */
(function () {
  var cur = document.getElementById('cursor');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Slide the surviving tiles from their old position to their new one.
  function flip(host, mutate) {
    var els = Array.prototype.filter.call(host.children, function (el) { return !el.hidden; });
    var first = els.map(function (el) { return el.getBoundingClientRect(); });
    mutate();
    if (calm) return;
    els.forEach(function (el, i) {
      if (el.hidden) return;
      var last = el.getBoundingClientRect();
      var dx = first[i].left - last.left;
      var dy = first[i].top - last.top;
      if (!dx && !dy) return;
      el.style.transition = 'none';
      el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      void el.offsetWidth;
      el.style.transition = 'transform 0.55s cubic-bezier(0.2, 0.7, 0.2, 1)';
      el.style.transform = '';
    });
  }

  // Categories: one open at a time
  var cats = document.querySelectorAll('.cat');
  function setCat(c, state) {
    c.classList.toggle('open', state);
    c.querySelector('.cathead').setAttribute('aria-expanded', String(state));
  }
  cats.forEach(function (c) {
    c.querySelector('.cathead').addEventListener('click', function () {
      var willOpen = !c.classList.contains('open');
      c.parentElement.querySelectorAll('.cat').forEach(function (o) { setCat(o, false); });
      setCat(c, willOpen);
    });
  });

  // A description outside its button still toggles the category, except on its link
  document.querySelectorAll('.cdo').forEach(function (p) {
    p.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      p.previousElementSibling.querySelector('.cathead').click();
    });
  });

  // Groups: one tile that splits into numbered tiles
  document.querySelectorAll('.group').forEach(function (g) {
    var openBtn = g.querySelector('.gtile');
    var panel = g.querySelector('.gpanel');
    var closeBtn = g.querySelector('.gclose');
    function set(state) {
      cur.classList.remove('on');
      flip(g.parentElement, function () {
        g.classList.toggle('open', state);
        openBtn.hidden = state;
        panel.hidden = !state;
        openBtn.setAttribute('aria-expanded', String(state));
      });
      if (state) { closeBtn.focus({ preventScroll: true }); } else { openBtn.focus({ preventScroll: true }); }
    }
    openBtn.addEventListener('click', function () { set(true); });
    closeBtn.addEventListener('click', function () { set(false); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  });

  // Cursor label
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('pointermove', function (e) {
      var b = e.target.closest ? e.target.closest('.tile, .duty, .mm, .chips li') : null;
      if (!b) return;
      var r = b.getBoundingClientRect();
      b.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      b.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    document.addEventListener('mousemove', function (e) {
      cur.style.transform = 'translate(' + (e.clientX + 16) + 'px,' + (e.clientY + 16) + 'px)';
    });
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest ? e.target.closest('.tile[data-label]') : null;
      if (t) {
        cur.textContent = t.getAttribute('data-label') + (t.tagName === 'A' ? ' ↗' : ' +');
        cur.classList.add('on');
      } else {
        cur.classList.remove('on');
      }
    });
  }

  // Copy buttons
  document.querySelectorAll('.copy').forEach(function (btn) {
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      var node = document.getElementById(btn.getAttribute('data-target'));
      var text = node.textContent.trim();
      function done(msg) {
        btn.textContent = msg;
        setTimeout(function () { btn.textContent = label; }, 1600);
      }
      function select() {
        var r = document.createRange();
        r.selectNodeContents(node);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
        done('Selected, press copy');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done('Copied'); }, select);
      } else {
        select();
      }
    });
  });

  document.getElementById('to-top').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
  });
  // Open the CV panel when the nav link is used
  document.querySelectorAll('a[href="#cv"]').forEach(function (l) {
    l.addEventListener('click', function () {
      var c = document.getElementById('cat-cv');
      if (c && !c.classList.contains('open')) c.querySelector('.cathead').click();
    });
  });
})();

/* ---- 2. scroll animation ---- */
(function(){
var d=document,h=d.documentElement,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
h.classList.add('js');
var bar=d.createElement('div');bar.className='pg';d.body.appendChild(bar);
var up=d.createElement('button');up.className='totop';up.type='button';up.setAttribute('aria-label','Back to top');up.textContent='\u2191';d.body.appendChild(up);
up.onclick=function(){scrollTo({top:0,behavior:rm?'auto':'smooth'})};
function onS(){var m=h.scrollHeight-innerHeight;bar.style.transform='scaleX('+(m>0?scrollY/m:0)+')';up.classList.toggle('on',scrollY>600)}
addEventListener('scroll',onS,{passive:true});onS();
var ct=0;function count(){var id=++ct;if(rm)return;d.querySelectorAll('.proof b').forEach(function(b){b.dataset.o=b.dataset.o||b.textContent;var m=b.dataset.o.match(/^(\D*)([\d.]+)(.*)$/);if(!m)return;var to=parseFloat(m[2]),dec=(m[2].split('.')[1]||'').length,t0=performance.now();(function f(n){var p=Math.min((n-t0)/1400,1),e=1-Math.pow(1-p,3);b.textContent=m[1]+(to*e).toFixed(dec)+m[3];if(p<1&&id===ct)requestAnimationFrame(f)})(t0)})}
window.replayCount=count;var els=[].slice.call(d.querySelectorAll('.mm,.proofrow,section .head,.cat,.cwrap,.proof>div,.duty,.bgcol,.crow,.mq'));
els.forEach(function(e,i){e.classList.add('rv');if(e.matches('.cat'))e.style.setProperty('--tx',(i%2?'':'-')+'48px')});
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(x,i){var t=x.target;if(x.isIntersecting){t.style.transitionDelay=(i*90)+'ms';t.classList.remove('up');t.classList.add('in');if(t.classList.contains('proofrow'))count()}else{t.style.transitionDelay='0ms';t.classList.remove('in');t.classList.toggle('up',x.boundingClientRect.top<0)}})},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
els.forEach(function(e){io.observe(e)});
if(!rm){var h1=d.querySelector('.hero h1'),lg=d.querySelector('.mm .logo'),mq=null,tk=false;
function mv(){tk=false;var y=scrollY;if(h1){h1.style.transform='translateY('+(y*.25)+'px)';h1.style.opacity=Math.max(0,1-y/650)}
if(lg)lg.style.transform='rotate('+(Math.sin(y/180)*6)+'deg)';
if(mq)mq.style.transform='translateX('+(mq.parentNode.getBoundingClientRect().top*-.35)+'px)'}
addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(mv)}},{passive:true});mv()}
var links=[].slice.call(d.querySelectorAll('.bar nav a'));
var so=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting)links.forEach(function(a){a.classList.toggle('act',a.getAttribute('href')==='#'+x.target.id)})})},{rootMargin:'-40% 0px -55% 0px'});
links.forEach(function(a){var s=d.querySelector(a.getAttribute('href'));if(s)so.observe(s)});
if(!rm&&matchMedia('(hover:hover)').matches){
var sp=d.createElement('div');sp.className='spot';d.body.appendChild(sp);
addEventListener('mousemove',function(e){sp.style.setProperty('--x',e.clientX+'px');sp.style.setProperty('--y',e.clientY+'px')},{passive:true});
d.querySelectorAll('.btn,.pill').forEach(function(b){
b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.2)+'px '+((e.clientY-r.top-r.height/2)*.3)+'px'});
b.addEventListener('mouseleave',function(){b.style.translate=''})})}
})();

/* ---- 3. live social embeds ---- */
(function(){
var box=document.getElementById('live');if(!box)return;
var ig=document.getElementById('lv-ig'),tt=document.getElementById('lv-tt'),st=document.getElementById('lv-st'),btn=document.getElementById('lv-r'),on=false,vis=false,EVERY=300000;
function load(){
ig.innerHTML='<iframe src="https://www.instagram.com/market.mind.id/embed/" title="MarketMindID on Instagram" loading="lazy" scrolling="no" allowtransparency="true"></iframe>';
tt.innerHTML='<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@marketmind.id" data-unique-id="marketmind.id" data-embed-type="creator" style="max-width:780px;min-width:288px"><section><a target="_blank" rel="noopener" href="https://www.tiktok.com/@marketmind.id?refer=creator_embed">@marketmind.id</a></section></blockquote>';
var old=document.getElementById('tt-js');if(old)old.remove();
var sc=document.createElement('script');sc.id='tt-js';sc.async=true;sc.src='https://www.tiktok.com/embed.js';document.body.appendChild(sc);
st.textContent='Updated '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+' \u00b7 auto-refreshes every 5 min';
}
btn.addEventListener('click',load);
if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(x){vis=x.isIntersecting;if(vis&&!on){on=true;load()}})},{rootMargin:'300px'}).observe(box)}else{on=true;load()}
setInterval(function(){if(on&&vis&&!document.hidden)load()},EVERY);
})();

/* ---- 4. smooth group close ---- */
(function(){
var calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.group').forEach(function(g){
var panel=g.querySelector('.gpanel'),btn=g.querySelector('.gclose'),pass=false;
if(!panel||!btn)return;
function smooth(){
if(calm){pass=true;btn.click();pass=false;return}
panel.classList.add('closing');
setTimeout(function(){pass=true;btn.click();pass=false;panel.classList.remove('closing')},360);
}
btn.addEventListener('click',function(e){if(pass)return;e.stopImmediatePropagation();if(!panel.classList.contains('closing'))smooth()},true);
panel.addEventListener('keydown',function(e){if(e.key==='Escape'&&!pass){e.stopPropagation();smooth()}},true);
});
})();

/* =====================================================================
   INTERACTION LAYER
   ===================================================================== */
(function () {
  var d = document, h = d.documentElement;
  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // 1. Hero name: split into letters that light up on hover / tap
  var h1 = d.querySelector('.hero h1');
  if (h1) {
    var word = h1.textContent.trim();
    var pal = [['#007aff', '#5856d6'], ['#5856d6', '#af52de'], ['#af52de', '#ff2d55'], ['#ff2d55', '#ff9500'], ['#ff9500', '#ffcc00']];
    h1.setAttribute('aria-label', word);
    h1.textContent = '';
    word.split('').forEach(function (c, i) {
      var s = d.createElement('span'), p = pal[i % pal.length];
      s.className = 'ch'; s.textContent = c; s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i); s.style.setProperty('--c1', p[0]); s.style.setProperty('--c2', p[1]);
      s.addEventListener('pointerdown', function () { s.classList.add('hit'); setTimeout(function () { s.classList.remove('hit'); }, 700); });
      h1.appendChild(s);
    });
  }

  // 2. Nav: sliding capsule + background hue follows the active section
  var nav = d.querySelector('.bar nav');
  if (nav) {
    var ind = d.createElement('span'); ind.className = 'ind'; nav.prepend(ind);
    var place = function () {
      var a = nav.querySelector('a.act');
      if (!a) { ind.style.opacity = 0; h.removeAttribute('data-sec'); return; }
      ind.style.opacity = 1;
      ind.style.width = a.offsetWidth + 'px'; ind.style.height = a.offsetHeight + 'px';
      ind.style.transform = 'translate(' + a.offsetLeft + 'px,' + a.offsetTop + 'px)';
      h.setAttribute('data-sec', a.getAttribute('href').slice(1));
    };
    new MutationObserver(place).observe(nav, { subtree: true, attributes: true, attributeFilter: ['class'] });
    addEventListener('resize', place); place();
  }

  // 3. Liquid blobs lean toward the pointer
  var bl = d.querySelector('.liquid .blobs');
  if (bl && fine && !rm) {
    var raf = 0, px = 0, py = 0;
    addEventListener('pointermove', function (e) {
      px = (e.clientX / innerWidth - .5) * 40; py = (e.clientY / innerHeight - .5) * 40;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; bl.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0)'; });
    }, { passive: true });
  }

  // 4. Colored stars in the marquee
  d.querySelectorAll('.mq span').forEach(function (s) {
    s.innerHTML = s.textContent.replace(/\u2726/g, '<i class="st">\u2726</i>');
  });

  // 5. Toast when copying email / phone
  var tt = d.createElement('div'), tm;
  tt.className = 'toast'; tt.setAttribute('role', 'status'); d.body.appendChild(tt);
  function toast(m) { tt.textContent = m; tt.classList.add('on'); clearTimeout(tm); tm = setTimeout(function () { tt.classList.remove('on'); }, 1800); }
  d.querySelectorAll('.copy').forEach(function (b) {
    var label = b.textContent;
    b.addEventListener('click', function () {
      setTimeout(function () { if (b.textContent !== label) toast(b.textContent === 'Copied' ? 'Copied to clipboard \u2713' : b.textContent); }, 120);
    });
  });

  // 6. Tap a stat to replay the count-up
  d.querySelectorAll('.proof > div').forEach(function (x) {
    x.addEventListener('click', function () { if (window.replayCount) window.replayCount(); });
  });

  // 7. Cursor label takes the color of the category you're hovering
  var cur = d.getElementById('cursor');
  if (cur && fine) {
    var last = null;
    d.addEventListener('mouseover', function (e) {
      var c = e.target.closest && e.target.closest('.cat');
      if (!c || c === last) return;
      last = c;
      var cs = getComputedStyle(c);
      cur.style.setProperty('--ac', cs.getPropertyValue('--ac').trim());
      cur.style.setProperty('--ac2', cs.getPropertyValue('--ac2').trim());
    });
  }
})();
