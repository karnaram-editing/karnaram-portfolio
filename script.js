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

  projects.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="media">
        <iframe
          src="${escapeAttr(project.videoUrl)}"
          title="${escapeAttr(project.title)}"
          loading="${index < 2 ? "eager" : "lazy"}"
          allow="autoplay; fullscreen"
          allowfullscreen>
        </iframe>
      </div>
      <div class="card-body">
        <div class="card-title">${escapeHtml(project.title)}</div>
        <div class="card-cat">${escapeHtml(project.category || "VIDEO EDITING · MOTION DESIGN")}</div>
      </div>`;
    grid.appendChild(card);
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
  script.src = `${API_URL}?callback=${callbackName}&v=${Date.now()}`;
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
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}

document.getElementById("year").textContent = new Date().getFullYear();
loadPortfolio();
