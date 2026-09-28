const API_URL = "https://script.google.com/macros/s/AKfycbx5co4UqJZK9_HUIHgkDHd73U1hcm7llIMbMAPJwUAkWPLfg41AjS06vu2I3_xjRIw1/exec";

const grid = document.getElementById("projects");
const statusEl = document.getElementById("status");
const emptyEl = document.getElementById("empty");

function renderProjects(projects) {
  grid.innerHTML = "";

  if (!projects || !projects.length) {
    statusEl.textContent = "0 projects";
    emptyEl.hidden = false;
    return;
  }

  statusEl.textContent = `${projects.length} projects`;

  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "card";

    // Google Drive direct video URL
    const directVideoUrl =
      `https://drive.google.com/uc?export=download&id=${encodeURIComponent(project.id)}`;

    card.innerHTML = `
      <div class="media">
        <video
          class="portfolio-video"
          controls
          playsinline
          webkit-playsinline
          preload="metadata"
          src="${escapeAttr(directVideoUrl)}"
          title="${escapeAttr(project.title)}">
        </video>

        <div class="video-fallback" hidden>
          <iframe
            src="${escapeAttr(project.videoUrl)}"
            title="${escapeAttr(project.title)}"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen>
          </iframe>

          <a
            class="open-video"
            href="${escapeAttr(project.videoUrl)}"
            target="_blank"
            rel="noopener">
            Open video ↗
          </a>
        </div>
      </div>

      <div class="card-body">
        <div class="card-title">
          ${escapeHtml(project.title)}
        </div>

        <div class="card-cat">
          ${escapeHtml(
            project.category || "VIDEO EDITING · MOTION DESIGN"
          )}
        </div>
      </div>
    `;

    grid.appendChild(card);

    const video = card.querySelector(".portfolio-video");
    const fallback = card.querySelector(".video-fallback");

    // If direct video doesn't work, use Google Drive preview
    video.addEventListener("error", () => {
      video.hidden = true;
      fallback.hidden = false;
    });
  });
}

function loadPortfolio() {
  const callbackName = "__karnaramPortfolio_" + Date.now();

  window[callbackName] = function(data) {
    try {
      renderProjects(data);
    } finally {
      delete window[callbackName];
      script.remove();
    }
  };

  const script = document.createElement("script");

  script.src =
    `${API_URL}?callback=${callbackName}&v=${Date.now()}`;

  script.onerror = () => {
    statusEl.textContent = "Could not load projects";
    emptyEl.hidden = false;

    delete window[callbackName];
    script.remove();
  };

  document.body.appendChild(script);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}

document.getElementById("year").textContent =
  new Date().getFullYear();

loadPortfolio();
/* Mobile-friendly portfolio video player */

.media {
  position: relative;
  overflow: hidden;
  background: #050505;
}

.portfolio-video {
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
  background: #000;
  object-fit: contain;
}

.video-fallback {
  position: absolute;
  inset: 0;
  background: #000;
}

.video-fallback iframe {
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
}

.open-video {
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 2;
  padding: 9px 13px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-decoration: none;
  font-size: 12px;
  border: 1px solid #555;
}

@media (max-width: 700px) {
  .media {
    aspect-ratio: 16 / 10;
  }

  .portfolio-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
