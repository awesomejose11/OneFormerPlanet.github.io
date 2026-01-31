const promos = [
  {
    src: "EpisodePromo.png",
    title: "Latest Fanshow Episode!",
    text: "Aftermath of the Earth",
    ctaText: "Watch Now",
    ctaLink: "https://youtu.be/tUZv22gGZ2M?si=a6clIdG9YzPDl5js"
  },
  {
    src: "WebsitePromo.png",
    title: "Welcome to the website!",
    text: "The official website for OneFormerPlanet's YouTube channel!",
    ctaText: "Explore",
    ctaLink: "#"
  },
  {
    src: "BetaWarn.png",
    title: "Website in Beta",
    text: "This website is still in beta. Some features may not work as expected.",
    ctaText: "I understand,",
    ctaLink: "#"
  }
];

let currentIndex = 0;

function setPromoElements(index) {
  const promo = promos[index] || promos[0];
  const img = document.getElementById('promoImage');
  const title = document.getElementById('promoTitle');
  const text = document.getElementById('promoText');
  const cta = document.getElementById('promoCTABtn');
  if (img && promo.src) img.src = promo.src;
  if (title) title.textContent = promo.title || '';
  if (text) text.textContent = promo.text || '';
  if (cta) {
    cta.textContent = promo.ctaText || 'Learn more';
    cta.dataset.link = promo.ctaLink || '#';
  }
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % promos.length;
  setPromoElements(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + promos.length) % promos.length;
  setPromoElements(currentIndex);
}

function toggleSlide() { nextSlide(); }

document.addEventListener('DOMContentLoaded', () => {
  setPromoElements(currentIndex);
  const cta = document.getElementById('promoCTABtn');
  if (cta) {
    cta.addEventListener('click', (e) => {
      const link = e.currentTarget.dataset.link || '#';
      if (link && link !== '#') window.open(link, '_blank');
      else alert('CTA clicked: ' + (promos[currentIndex] && promos[currentIndex].title));
    });
  }
});

// Projects page: image upload, drag/drop, preview, and persistence
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('projectFilesInput');
  const dropZone = document.getElementById('projectDropZone');
  const gallery = document.getElementById('projectGallery');
  const selectBtn = document.getElementById('selectImagesBtn');
  if (!gallery || !dropZone) return;

  // Load saved images from localStorage
  try {
    const saved = JSON.parse(localStorage.getItem('projectImages') || '[]');
    saved.forEach(item => createProjectCardFromDataURL(item.dataURL, item.name));
  } catch (e) { /* ignore parse errors */ }

  selectBtn?.addEventListener('click', (e) => { e.preventDefault(); fileInput && fileInput.click(); });

  fileInput?.addEventListener('change', (e) => {
    handleFiles(e.target.files);
    fileInput.value = '';
  });

  dropZone.addEventListener('click', () => fileInput && fileInput.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('hover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('hover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault(); dropZone.classList.remove('hover');
    handleFiles(e.dataTransfer.files);
  });

  function handleFiles(files) {
    const arr = Array.from(files).filter(f => f.type && f.type.startsWith('image/'));
    arr.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        createProjectCardFromDataURL(reader.result, file.name);
        saveImage(reader.result, file.name);
      };
      reader.readAsDataURL(file);
    });
  }

  function createProjectCardFromDataURL(dataURL, name) {
    const article = document.createElement('article');
    article.className = 'card';
    article.innerHTML = `
      <div class="thumb" aria-hidden="true"><img src="${dataURL}" alt="${name}" style="width:100%;height:100%;object-fit:cover"></div>
      <div class="meta">
        <div class="kind">User Image</div>
        <h2 class="title">${escapeHtml(name)}</h2>
        <p class="desc">Uploaded from Explorer</p>
        <div class="row">
          <div class="watch">
            <a class="btn secondary" href="#" onclick="return false">Details</a>
            <a class="btn" href="${dataURL}" target="_blank" rel="noopener noreferrer">Open</a>
          </div>
        </div>
      </div>`;
    gallery.prepend(article);
  }

  function saveImage(dataURL, name) {
    try {
      const list = JSON.parse(localStorage.getItem('projectImages') || '[]');
      list.unshift({ dataURL, name });
      localStorage.setItem('projectImages', JSON.stringify(list.slice(0, 30)));
    } catch (e) { /* ignore storage errors */ }
  }

  function escapeHtml(str) { return String(str).replace(/[&"'<>]/g, (s) => ({'&':'&amp;','"':'&quot;','\'':'&#39;','<':'&lt;','>':'&gt;'}[s])); }
});