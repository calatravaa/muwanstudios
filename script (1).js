    (function () {
      var el = document.getElementById('quote');
      if (!el) return;
      var Q = [
        '\u201cMake it simple. Make it memorable. Make it move.\u201d',
        '\u201cEvery big channel started with one post nobody watched.\u201d',
        '\u201cAttention is earned in the first three seconds.\u201d',
        '\u201cConsistency beats talent when talent isn\u2019t consistent.\u201d',
        '\u201cShip it, learn from it, make the next one better.\u201d',
        '\u201cA good idea is half the work. The edit is the other half.\u201d',
        '\u201cBe the reason someone stops scrolling today.\u201d',
        '\u201cSmall steps, posted daily, add up to big numbers.\u201d',
        '\u201cYour next video could be the one that changes everything.\u201d',
        '\u201cCreate like nobody\u2019s counting views. Then count them.\u201d',
        '\u201cThe best time to post was yesterday. The second best is now.\u201d',
        '\u201cStay curious. Stay hungry. Stay editing.\u201d',
        '\u201cGood design is a quiet kind of persuasion.\u201d',
        '\u201cDream big, cut tight, post often.\u201d',
        '\u201cNot every post goes viral. Every post teaches something.\u201d',
        '\u201cKeep showing up. The algorithm notices eventually.\u201d',
        '\u201cMake something today that future you will be proud of.\u201d',
        '\u201cIdeas are cheap. Finished videos are rare.\u201d'
      ];
      var last = -1;
      try { last = parseInt(localStorage.getItem('mm-quote'), 10); if (isNaN(last)) last = -1; } catch (e) {}
      function pick() {
        var i;
        do { i = Math.floor(Math.random() * Q.length); } while (i === last && Q.length > 1);
        last = i;
        try { localStorage.setItem('mm-quote', String(i)); } catch (e) {}
        el.textContent = Q[i];
        el.classList.remove('qin'); void el.offsetWidth; el.classList.add('qin');
      }
      pick();
      el.addEventListener('click', pick);
    })();
    

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
var ctc=d.getElementById('contact');function onS(){var m=h.scrollHeight-innerHeight;bar.style.transform='scaleX('+(m>0?scrollY/m:0)+')';up.classList.toggle('on',scrollY>600);var r=ctc&&ctc.getBoundingClientRect();up.classList.toggle('gone',!!(r&&r.height>0&&r.top<innerHeight*.75))}
addEventListener('scroll',onS,{passive:true});onS();
var ct=0;function count(){var id=++ct;if(rm)return;if(window.__cc){window.__cc();return}d.querySelectorAll('.proof b').forEach(function(b){b.dataset.o=b.dataset.o||b.textContent;var m=b.dataset.o.match(/^(\D*)([\d.]+)(.*)$/);if(!m)return;var to=parseFloat(m[2]),dec=(m[2].split('.')[1]||'').length,t0=performance.now();(function f(n){var p=Math.min((n-t0)/1400,1),e=1-Math.pow(1-p,3);b.textContent=m[1]+(to*e).toFixed(dec)+m[3];if(p<1&&id===ct)requestAnimationFrame(f)})(t0)})}
window.replayCount=count;var els=[].slice.call(d.querySelectorAll('.mm,.proofrow,section .head,.cat,.cwrap,.proof>div,.duty,.bgcol,.crow,.mq'));
els.forEach(function(e,i){e.classList.add('rv');if(e.matches('.cat'))e.style.setProperty('--tx',(i%2?'':'-')+'48px')});
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(x,i){var t=x.target;if(x.isIntersecting){t.style.transitionDelay=(i*90)+'ms';t.classList.remove('up');t.classList.add('in');if(t.classList.contains('proofrow'))count()}else{t.style.transitionDelay='0ms';t.classList.remove('in');t.classList.toggle('up',x.boundingClientRect.top<0)}})},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
els.forEach(function(e){io.observe(e)});
if(!rm){var h1=d.querySelector('.hero h1'),lg=d.querySelector('.mm .logo'),mq=null,tk=false;
function mv(){tk=false;var y=scrollY;if(h1){h1.style.transform='translateY('+(y*.25)+'px)';h1.style.opacity=Math.max(0,1-y/650)}
if(mq)mq.style.transform='translateX('+(mq.parentNode.getBoundingClientRect().top*-.35)+'px)'}
addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(mv)}},{passive:true});mv()}
var links=[].slice.call(d.querySelectorAll('.bar nav a'));
var so=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting&&!document.documentElement.classList.contains('tabs'))links.forEach(function(a){a.classList.toggle('act',a.getAttribute('href')==='#'+x.target.id)})})},{rootMargin:'-40% 0px -55% 0px'});
links.forEach(function(a){var s=d.querySelector(a.getAttribute('href'));if(s)so.observe(s)});
if(!rm&&matchMedia('(hover:hover)').matches){
var sp=d.createElement('div');sp.className='spot';d.body.appendChild(sp);
addEventListener('mousemove',function(e){sp.style.setProperty('--x',e.clientX+'px');sp.style.setProperty('--y',e.clientY+'px')},{passive:true});
d.querySelectorAll('.btn,.pill').forEach(function(b){
b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.2)+'px '+((e.clientY-r.top-r.height/2)*.3)+'px'});
b.addEventListener('mouseleave',function(){b.style.translate=''})})}
})();

/* ---- 3. live social: Instagram preview, TikTok as a simple link card ---- */
(function(){
var box=document.getElementById('live');if(!box)return;
var ig=document.getElementById('lv-ig'),tt=document.getElementById('lv-tt'),st=document.getElementById('lv-st'),btn=document.getElementById('lv-r'),on=false,vis=false,EVERY=300000;
var TT_URL='https://www.tiktok.com/@marketmind.id';
tt.innerHTML='<a class="ttfb" href="'+TT_URL+'" target="_blank" rel="noopener"><b>@marketmind.id</b><span>Watch on TikTok \u2197</span></a>';
function load(){
ig.innerHTML='<iframe src="https://www.instagram.com/market.mind.id/embed/" title="MarketMindID on Instagram" loading="lazy" scrolling="no" allowtransparency="true"></iframe>';
st.textContent='Updated '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+' \u00b7 Instagram auto-refreshes every 5 min';
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
    x.addEventListener('click', function () { if (window.__ccOne) window.__ccOne(x); else if (window.replayCount) window.replayCount(); });
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

/* ---- 5. tabbed views: one screen at a time, contact always at the bottom ---- */
(function () {
  var d = document, h = d.documentElement;
  var nav = d.querySelector('.bar nav');
  if (!nav || !d.querySelector('.hero')) return;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var VIEWS = ['home', 'work', 'experience', 'background'];
  var ALIAS = { about: 'background', cv: 'home', marketmind: 'home', live: 'home' };
  var MAP = [['.who', 'home'], ['.proofrow', 'home'], ['.mm', 'home'], ['#live', 'home'],
             ['#work', 'work'], ['#experience', 'experience'], ['#background', 'background']];
  var CARDS = [
    ['work', 'Work', 'Brand identity, content strategy and video projects.', 'pink', 'orange'],
    ['experience', 'Experience', 'Company work, live streaming and live selling.', 'green', 'teal'],
    ['background', 'Background', 'Education, languages, tools and skills.', 'purple', 'indigo'],
    ['contact', 'Contact', 'Open to work worldwide. Available now.', 'orange', 'yellow']
  ];
  var contact = d.getElementById('contact');
  var items = [];
  MAP.forEach(function (m) { var e = d.querySelector(m[0]); if (e) items.push({ el: e, v: m[1] }); });

  // home launcher cards
  var pr = d.querySelector('.proofrow');
  var L = d.createElement('div');
  L.className = 'launch';
  L.innerHTML = CARDS.map(function (c, i) {
    return '<a class="lc" href="#' + c[0] + '" style="--a:var(--' + c[3] + ');--b:var(--' + c[4] + ')">' +
      '<span class="go" aria-hidden="true">\u2197</span><span class="no">0' + (i + 1) + '</span>' +
      '<span class="lt"><b>' + c[1] + '</b><span>' + c[2] + '</span></span></a>';
  }).join('');
  if (pr && pr.parentNode) { pr.parentNode.insertBefore(L, pr.nextSibling); items.push({ el: L, v: 'home' }); }

  // extra scroll-reveal (the base .rv list in layer 2 does not cover these)
  var extra = [].slice.call(d.querySelectorAll('.who, .lc, #live, #contact .cintro, #contact .social, #contact footer'));
  extra.forEach(function (e) { e.classList.add('rv'); });
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (x, i) {
        var t = x.target;
        if (x.isIntersecting) { t.style.transitionDelay = (i * 90) + 'ms'; t.classList.add('in'); }
        else { t.style.transitionDelay = '0ms'; t.classList.remove('in'); }
      });
    }, { threshold: .1, rootMargin: '0px 0px -6% 0px' });
    extra.forEach(function (e) { io2.observe(e); });
  } else { extra.forEach(function (e) { e.classList.add('in'); }); }

  // floating back button
  var fb = d.createElement('button');
  fb.className = 'fback'; fb.type = 'button'; fb.setAttribute('aria-label', 'Back to home');
  fb.innerHTML = '<span class="ar" aria-hidden="true">\u2190</span><span>Back</span>';
  d.body.appendChild(fb);

  h.classList.add('tabs');
  var links = [].slice.call(nav.querySelectorAll('a'));
  var cur = null;

  function norm(x) { x = (x || '').replace('#', ''); x = ALIAS[x] || x; return VIEWS.indexOf(x) > -1 ? x : 'home'; }

  function ensureOpen(v) {
    var mine = [];
    items.forEach(function (it) { if (it.v === v) [].forEach.call(it.el.querySelectorAll('.cat'), function (c) { mine.push(c); }); });
    if (mine.length && !mine.some(function (c) { return c.classList.contains('open'); })) mine[0].querySelector('.cathead').click();
  }

  // which tab should look active: Contact while you are at the bottom, otherwise the current view
  function want() {
    var near = contact && contact.getBoundingClientRect().top < innerHeight * 0.55;
    return near ? 'contact' : cur;
  }
  var syncing = false;
  function sync() {
    if (syncing) return; syncing = true;
    var w = want();
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + w;
      if (a.classList.contains('act') !== on) a.classList.toggle('act', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    syncing = false;
  }
  new MutationObserver(sync).observe(nav, { subtree: true, attributes: true, attributeFilter: ['class'] });
  var tk = false;
  addEventListener('scroll', function () { if (!tk) { tk = true; requestAnimationFrame(function () { tk = false; sync(); }); } }, { passive: true });

  function show(v) {
    items.forEach(function (it) { it.el.classList.toggle('vh', it.v !== v); });
    cur = v;
    fb.classList.toggle('on', v !== 'home');
    sync();
    links.forEach(function (a) {
      if (a.getAttribute('href') === '#' + v && nav.scrollWidth > nav.clientWidth)
        nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: calm ? 'auto' : 'smooth' });
    });
    ensureOpen(v);
  }

  function scrollToId(id) {
    var el = d.getElementById(id);
    if (el) setTimeout(function () { el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' }); }, 60);
  }

  function go(raw, push) {
    var id = (raw || '').replace('#', ''), v = norm(id);
    // Contact lives at the bottom of every view: scroll to it without swapping the view
    if (id === 'contact') { if (cur === null) show('home'); scrollToId('contact'); return; }
    if (v !== cur) { show(v); window.scrollTo({ top: 0, behavior: 'instant' }); }
    // clicking the tab you are already on now scrolls to the top instead of doing nothing
    else if (push && id !== 'marketmind' && id !== 'live') { window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }); }
    if (push && location.hash !== '#' + v && id !== 'contact') { try { history.pushState(null, '', '#' + v); } catch (err) {} }
    if (id === 'contact' || id === 'marketmind' || id === 'live') scrollToId(id);
  }

  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id || (VIEWS.indexOf(id) < 0 && !ALIAS[id] && id !== 'contact')) return;
    e.preventDefault();
    go(id, true);
  });
  fb.addEventListener('click', function () { go('home', true); });
  var brand = d.querySelector('.bar > span');
  if (brand) brand.addEventListener('click', function () { go('home', true); });
  addEventListener('popstate', function () { go(location.hash, false); });

  go(location.hash, false);
})();

/* ---- 6. stat count-up: staggered, eased, progress bar, burst, tilt, tap to replay ---- */
(function () {
  var d = document;
  var stats = [].slice.call(d.querySelectorAll('.proof > div'));
  if (!stats.length) return;
  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COLORS = ['#2563eb', '#5856d6', '#22c55e', '#14b8a6', '#f97316', '#ec4899'];
  var runs = new WeakMap();

  stats.forEach(function (s) {
    var b = s.querySelector('b');
    b.dataset.o = b.dataset.o || b.textContent;
    var bar = d.createElement('i');
    bar.className = 'pbar'; bar.setAttribute('aria-hidden', 'true');
    bar.appendChild(d.createElement('u'));
    s.appendChild(bar);
    s.tabIndex = 0; s.setAttribute('role', 'button');
    s.title = 'Tap to replay';
    s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); s.click(); } });
  });

  function burst(s, n) {
    if (rm || !s.animate) return;
    var b = s.querySelector('b'), r = s.getBoundingClientRect(), br = b.getBoundingClientRect();
    var cx = br.left - r.left + br.width / 2, cy = br.top - r.top + br.height / 2;
    for (var i = 0; i < n; i++) {
      var p = d.createElement('i');
      var a = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 70, sz = 5 + Math.random() * 6;
      p.className = 'spark'; p.setAttribute('aria-hidden', 'true');
      p.style.cssText = 'left:' + cx + 'px;top:' + cy + 'px;width:' + sz + 'px;height:' + sz + 'px;background:' + COLORS[i % COLORS.length];
      s.appendChild(p);
      var an = p.animate([
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: 'translate(calc(-50% + ' + (Math.cos(a) * dist) + 'px),calc(-50% + ' + (Math.sin(a) * dist) + 'px)) scale(0)', opacity: 0 }
      ], { duration: 700 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.3,1)' });
      an.onfinish = (function (el) { return function () { el.remove(); }; })(p);
    }
  }

  function run(s, delay, dur) {
    var b = s.querySelector('b'), bar = s.querySelector('.pbar u');
    var m = b.dataset.o.match(/^(\D*)([\d.]+)(.*)$/);
    if (!m) return;
    var to = parseFloat(m[2]), dec = (m[2].split('.')[1] || '').length;
    var id = (runs.get(s) || 0) + 1, t0;
    runs.set(s, id);
    s.classList.add('counting');
    b.textContent = m[1] + (0).toFixed(dec) + m[3];
    bar.style.transform = 'scaleX(0)';
    function f(n) {
      if (runs.get(s) !== id) return;
      if (t0 === undefined) t0 = n;
      var p = Math.min((n - t0 - delay) / dur, 1);
      if (p < 0) { requestAnimationFrame(f); return; }
      var e = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
      b.textContent = m[1] + (to * e).toFixed(dec) + m[3];
      bar.style.transform = 'scaleX(' + e + ')';
      if (p < 1) { requestAnimationFrame(f); return; }
      s.classList.remove('counting');
      burst(s, 14);
      if (b.animate) b.animate([{ scale: 1 }, { scale: 1.12 }, { scale: 1 }], { duration: 500, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    }
    requestAnimationFrame(f);
  }

  window.__cc = function () { if (rm) return; stats.forEach(function (s, i) { run(s, i * 220, 1300 + i * 350); }); };
  window.__ccOne = function (s) { if (rm) return; burst(s, 8); run(s, 0, 1400); };

  // hover: number tilts toward the cursor, soft glow follows it
  if (!rm && matchMedia('(hover: hover)').matches) {
    stats.forEach(function (s) {
      var b = s.querySelector('b');
      s.addEventListener('pointermove', function (e) {
        var r = s.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        s.style.setProperty('--mx', (x * 100) + '%'); s.style.setProperty('--my', (y * 100) + '%');
        b.style.transform = 'perspective(600px) rotateY(' + ((x - 0.5) * 16) + 'deg) rotateX(' + ((0.5 - y) * 12) + 'deg) scale(1.06)';
      });
      s.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }
})();

/* ---- bubble cursor: outlined circles that follow, react to hover, click and movement ---- */
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var d = document, h = d.documentElement;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ring = d.createElement('div'); ring.className = 'bub-ring'; ring.setAttribute('aria-hidden', 'true');
  var dot = d.createElement('div'); dot.className = 'bub-dot'; dot.setAttribute('aria-hidden', 'true');
  d.body.appendChild(ring); d.body.appendChild(dot);
  h.classList.add('bub-on');

  var mx = -100, my = -100, rx = -100, ry = -100, seen = false, lx = 0, ly = 0, lastPop = 0;
  var HOT = 'a[href], button, [role="button"], summary, label, select, .pill, .cathead, .cdo, .tile:not(.soon):not(.choice), .proof > div, .bar > span, .quote, .totop';

  function spawn(cls, x, y, size, extra) {
    var el = d.createElement('div');
    el.className = cls;
    el.style.width = el.style.height = size + 'px';
    el.style.left = (-size / 2) + 'px'; el.style.top = (-size / 2) + 'px';
    el.style.setProperty('--x', x + 'px'); el.style.setProperty('--y', y + 'px');
    for (var k in extra) el.style.setProperty(k, extra[k]);
    d.body.appendChild(el);
    el.addEventListener('animationend', function () { el.remove(); });
  }

  // ring eases toward the pointer, the dot stays exact
  function loop() {
    rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
    ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
    dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // move: small outlined bubbles drift up from the trail
  d.addEventListener('pointermove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (!seen) { seen = true; rx = mx; ry = my; ring.classList.add('on'); dot.classList.add('on'); }
    var t = e.target;
    ring.classList.toggle('hov', !!(t.closest && t.closest(HOT)));
    if (calm) return;
    var now = performance.now(), dist = Math.hypot(mx - lx, my - ly);
    if (dist > 38 && now - lastPop > 60) {
      lx = mx; ly = my; lastPop = now;
      var size = 6 + Math.random() * 14;
      spawn('bub-pop', mx, my, size, {
        '--dx': ((Math.random() - 0.5) * 36) + 'px',
        '--dy': (-26 - Math.random() * 40) + 'px',
        '--d': (700 + Math.random() * 500) + 'ms'
      });
    }
  }, { passive: true });

  // click: ripple ring + a burst of outlined bubbles
  d.addEventListener('pointerdown', function (e) {
    ring.classList.add('down');
    if (calm) return;
    spawn('bub-rip', e.clientX, e.clientY, 90, { '--d': '650ms' });
    for (var i = 0; i < 7; i++) {
      var a = (Math.PI * 2 * i) / 7 + Math.random() * 0.6, r = 36 + Math.random() * 46;
      spawn('bub-pop', e.clientX, e.clientY, 6 + Math.random() * 12, {
        '--dx': Math.cos(a) * r + 'px', '--dy': Math.sin(a) * r + 'px',
        '--d': (600 + Math.random() * 400) + 'ms'
      });
    }
  });
  d.addEventListener('pointerup', function () { ring.classList.remove('down'); });
  d.addEventListener('pointercancel', function () { ring.classList.remove('down'); });
  h.addEventListener('pointerleave', function () { ring.classList.remove('on'); dot.classList.remove('on'); seen = false; });
})();

/* ---- more interaction: 3D tilt on cards/tiles, magnetic nav, keyboard shortcuts ---- */
(function () {
  var d = document, h = d.documentElement;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // keyboard: press 1-5 to jump between Home / Work / Experience / Background / Contact
  var links = [].slice.call(d.querySelectorAll('.bar nav a'));
  var hint = d.createElement('div'); hint.className = 'kbd-hint'; hint.setAttribute('role', 'status'); d.body.appendChild(hint);
  var ht;
  if (fine) links.forEach(function (a, i) { a.title = 'Shortcut: press ' + (i + 1); });
  d.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    var n = parseInt(e.key, 10);
    if (!(n >= 1 && n <= links.length)) return;
    e.preventDefault();
    links[n - 1].click();
    hint.textContent = n + '  \u2192  ' + links[n - 1].textContent.trim();
    hint.classList.add('on'); clearTimeout(ht);
    ht = setTimeout(function () { hint.classList.remove('on'); }, 1100);
  });

  if (!fine || calm) return;

  // magnetic nav links
  var nav = d.querySelector('.bar nav');
  if (nav) {
    nav.addEventListener('pointermove', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a) return;
      var r = a.getBoundingClientRect();
      a.style.translate = ((e.clientX - r.left - r.width / 2) * 0.22) + 'px ' + ((e.clientY - r.top - r.height / 2) * 0.3) + 'px';
    });
    nav.addEventListener('pointerout', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (a) a.style.translate = '';
    });
  }

  // 3D tilt that eases toward the pointer and settles back
  var SEL = '.lc, .tile:not(.soon):not(.choice)', MAX = 7;
  var active = new Map(), raf = 0;
  function kick() { if (!raf) raf = requestAnimationFrame(step); }
  function step() {
    raf = 0; var busy = false;
    active.forEach(function (s, el) {
      s.x += (s.tx - s.x) * 0.14; s.y += (s.ty - s.y) * 0.14;
      var mag = Math.hypot(s.x, s.y);
      if (!s.tx && !s.ty && mag < 0.002) { el.style.rotate = ''; active.delete(el); return; }
      busy = true;
      el.style.rotate = (-s.y) + ' ' + s.x + ' 0 ' + (mag * 2 * MAX) + 'deg';
    });
    if (busy) raf = requestAnimationFrame(step);
  }
  d.addEventListener('pointermove', function (e) {
    var el = e.target.closest && e.target.closest(SEL);
    active.forEach(function (s, k) { if (k !== el) { s.tx = 0; s.ty = 0; } });
    if (el) {
      var r = el.getBoundingClientRect();
      var s = active.get(el) || { x: 0, y: 0, tx: 0, ty: 0 };
      s.tx = (e.clientX - r.left) / r.width - 0.5; s.ty = (e.clientY - r.top) / r.height - 0.5;
      active.set(el, s);
      var p = el.parentNode;
      if (p && !p.__persp) { p.style.perspective = '900px'; p.__persp = 1; }
    }
    kick();
  }, { passive: true });
  h.addEventListener('pointerleave', function () { active.forEach(function (s) { s.tx = 0; s.ty = 0; }); kick(); });
})();
