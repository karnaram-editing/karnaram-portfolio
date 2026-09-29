const API_URL =
  "https://script.google.com/macros/s/AKfycbx5co4UqJZK9_HUIHgkDHd73U1hcm7llIMbMAPJwUAkWPLfg41AjS06vu2I3_xjRIw1/exec";

const grid = document.getElementById("projects");
const statusEl = document.getElementById("status");
const emptyEl = document.getElementById("empty");


/* ============================= */
/* LOAD PORTFOLIO */
/* ============================= */

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


/* ============================= */
/* DETECT VIDEO RATIO */
/* ============================= */

function getVideoRatio(filename) {

  const name = String(filename || "").toLowerCase();

  /* 9:16 Vertical */
  if (name.includes("_9x16")) {
    return "vertical";
  }

  /* 16:9 Landscape */
  if (name.includes("_16x9")) {
    return "landscape";
  }

  /* 1:1 Square */
  if (name.includes("_1x1")) {
    return "square";
  }

  /* Default */
  return "landscape";
}


/* ============================= */
/* CLEAN VIDEO TITLE */
/* ============================= */

function cleanTitle(filename) {

  let title = String(filename || "");

  /* Remove file extension */
  title = title.replace(/\.[^/.]+$/, "");

  /* Remove video ratio */
  title = title.replace(/_9x16/gi, "");
  title = title.replace(/_16x9/gi, "");
  title = title.replace(/_1x1/gi, "");

  /* Remove starting number */
  title = title.replace(/^\d+[_-]?/, "");

  /* Replace _ and - with spaces */
  title = title.replace(/[_-]+/g, " ");

  /* Remove extra spaces */
  title = title.replace(/\s+/g, " ").trim();

  /* Title Case */
  return title.replace(/\w\S*/g, function(word) {
    return (
      word.charAt(0).toUpperCase() +
      word.slice(1).toLowerCase()
    );
  });
}


/* ============================= */
/* RENDER PROJECTS */
/* ============================= */

function renderProjects(projects) {

  grid.innerHTML = "";

  if (!projects || !projects.length) {

    statusEl.textContent = "0 projects";

    emptyEl.hidden = false;

    return;
  }

  statusEl.textContent = `${projects.length} projects`;

  emptyEl.hidden = true;


  projects.forEach((project, index) => {

    const card = document.createElement("article");

    card.className = "card";


    /* Detect ratio */
    const ratioClass = getVideoRatio(project.name);


    /* Clean title */
    const title = cleanTitle(project.name);


    card.innerHTML = `
      <div class="media ${ratioClass}">

        <iframe
          src="${escapeAttr(project.videoUrl)}"
          title="${escapeAttr(title)}"
          loading="${index < 2 ? "eager" : "lazy"}"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen>
        </iframe>

      </div>

      <div class="card-body">

        <div class="card-title">
          ${escapeHtml(title)}
        </div>

        <div class="card-cat">
          ${escapeHtml(
            project.category ||
            "VIDEO EDITING · MOTION DESIGN"
          )}
        </div>

      </div>
    `;


    grid.appendChild(card);

  });
}


/* ============================= */
/* HTML SECURITY */
/* ============================= */

function escapeHtml(value) {

  return String(value ?? "").replace(/[&<>"']/g, function(c) {

    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[c];

  });
}


function escapeAttr(value) {

  return escapeHtml(value);

}


/* ============================= */
/* FOOTER YEAR */
/* ============================= */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* ============================= */
/* START */
/* ============================= */

loadPortfolio();
