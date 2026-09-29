const API_URL = "https://script.google.com/macros/s/AKfycbx5co4UqJZK9_HUIHgkDHd73U1hcm7llIMbMAPJwUAkWPLfg41AjS06vu2I3_xjRIw1/exec";

const grid = document.getElementById("projects");
const statusEl = document.getElementById("status");
const emptyEl = document.getElementById("empty");

async function loadPortfolio() {
  try {
    statusEl.textContent = "Loading work…";

    const response = await fetch(`${API_URL}?v=${Date.now()}`);

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const projects = await response.json();

    renderProjects(projects);

  } catch (error) {
    console.error("Portfolio API error:", error);

    statusEl.textContent = "Could not load projects";
    emptyEl.hidden = false;
  }
}

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

    video.addEventListener("error", () => {
      video.hidden = true;
      fallback.hidden = false;
    });
  });
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
