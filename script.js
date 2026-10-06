const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('siteNav');
const header = document.querySelector('.site-header');
const year = document.getElementById('year');
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

if (year) year.textContent = new Date().getFullYear();

navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => nav.classList.remove('open'));
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

const savedTheme = localStorage.getItem('kelvin-theme');
if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;

function updateThemeButton() {
  const light = root.dataset.theme === 'light';
  if (themeToggle) {
    themeToggle.querySelector('.theme-icon').textContent = light ? '☾' : '☼';
    themeToggle.querySelector('.theme-label').textContent = light ? 'Dark' : 'Light';
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    themeToggle.setAttribute('title', light ? 'Switch to dark mode' : 'Switch to light mode');
  }
}

updateThemeButton();

themeToggle?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('kelvin-theme', root.dataset.theme);
  updateThemeButton();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.10 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const projectData = {
  krakatau: {
    kicker: 'DISASTER IMPACT ANALYTICS · SEP 2026',
    title: 'Anak Krakatau 2026',
    text: 'An impact analytics dashboard bringing together eruption activity, aviation disruption, population exposure, health-response readiness, and regional effects into one interactive experience.',
    method: 'Multi-source public data synthesis + impact visualization',
    stack: 'Python · HTML/CSS/JS · Chart.js · Leaflet',
    url: 'https://kelvinirawanc.github.io/anak_krakatau_dashboard_v4/'
  },
  karhutla: {
    kicker: 'PUBLIC DATA ANALYTICS · SEP 2026',
    title: 'Karhutla Indonesia 2026',
    text: 'A monitoring dashboard designed to turn fragmented public information into a single operational view of hotspot activity, fire coverage, air quality, response operations, and six priority provinces.',
    method: 'Public-source collection + validation + dashboard storytelling',
    stack: 'Python · HTML/CSS/JS · Chart.js · Leaflet',
    url: 'https://kelvinirawanc.github.io/karhutla-2026/'
  },
  bank: {
    kicker: 'COMPETITIVE INTELLIGENCE · AUG 2026',
    title: 'Bank Competitors Tracker',
    text: 'A comparative review analytics dashboard using Google Play written reviews to benchmark Allo Bank against selected apps through rating, sentiment, topic, pain-point, and trend analysis.',
    method: 'Review collection + deduplication + deterministic sentiment/topic baseline',
    stack: 'Python · Google Play data · Chart.js · HTML/CSS/JS',
    url: 'https://kelvinirawanc.github.io/bank_competitors_analysis/'
  }
};

const modal = document.getElementById('projectModal');
const closeModal = () => {
  modal?.classList.remove('show');
  modal?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};

document.querySelectorAll('[data-project]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const project = projectData[btn.dataset.project];
    if (!project || !modal) return;
    document.getElementById('modalKicker').textContent = project.kicker;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalText').textContent = project.text;
    document.getElementById('modalMethod').textContent = project.method;
    document.getElementById('modalStack').textContent = project.stack;
    document.getElementById('modalLink').href = project.url;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  });
});

document.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});


// Presentation view: ?fullscreen=1 starts a clean, full-viewport reading mode.
// Browsers generally block automatic native fullscreen without a user gesture,
// so this mode keeps normal scrolling while removing the site chrome.
const presentationExit = document.getElementById('presentationExit');
const presentationExitBtn = document.getElementById('presentationExitBtn');
const presentationParam = new URLSearchParams(window.location.search).get('fullscreen');

function enterPresentationMode(){
  document.body.classList.add('presentation-mode');
  presentationExit?.classList.add('show');
  presentationExit?.setAttribute('aria-hidden','false');
}

function exitPresentationMode(){
  document.body.classList.remove('presentation-mode');
  presentationExit?.classList.remove('show');
  presentationExit?.setAttribute('aria-hidden','true');
  const url = new URL(window.location.href);
  url.searchParams.delete('fullscreen');
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  if (document.fullscreenElement) document.exitFullscreen?.().catch(()=>{});
}

if (presentationParam === '1' || presentationParam === 'true') enterPresentationMode();

presentationExitBtn?.addEventListener('click', exitPresentationMode);

// Optional native fullscreen from the keyboard. The browser still requires a gesture.
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'f' && !event.ctrlKey && !event.metaKey && !event.altKey) {
    const tag = document.activeElement?.tagName;
    if (!['INPUT','TEXTAREA','BUTTON','A','SELECT'].includes(tag)) {
      document.documentElement.requestFullscreen?.().catch(()=>{});
    }
  }
});

document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    enterPresentationMode();
  }
});
