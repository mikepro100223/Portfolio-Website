const projects = [
  {
    title: "EV3-Roboter",
    summary: "Ein programmierter Roboter, der Linien folgt, Hindernissen ausweicht und Aufgaben mit einem Kranarm löst.",
    description: "Für dieses laufende Robotikprojekt programmiere ich einen Lego-EV3-Roboter mit Python. Ich entwickle und teste schrittweise Funktionen für Linienverfolgung, Hinderniserkennung und Bewegungsabläufe. Aktuell arbeite ich an einem Kranarm, der Hindernisse aus dem Weg räumen kann. Dabei lerne ich besonders viel über Sensorik, Fehlersuche und das Zusammenspiel von Hard- und Software.",
    technologies: ["Python", "Lego EV3", "Robotik"], duration: "Laufendes Projekt",
    videoId: "OKg1xoUKLe8", youtubeUrl: "https://youtu.be/OKg1xoUKLe8", githubUrl: "https://github.com/mikepro100223/automated_car"
  },
  {
    title: "Smarte Lagerverwaltung",
    summary: "Hackathon-Prototyp zur Erkennung von Lagerbeständen mit Kamera und YOLOv8.",
    description: "Beim Hackathon Baden Hackt 2026 entwickelte ich in einem Zweierteam innerhalb von zwei Tagen einen funktionierenden Prototyp. Eine Kamera erkennt Objekte im Lager; die Anwendung aktualisiert daraus den Bestand und kann bei knappem Vorrat eine E-Mail auslösen. Ich war an Konzeption, Bilderkennung und Umsetzung beteiligt. Das Projekt hat mir gezeigt, wie wichtig klare Aufgabenverteilung und schnelle Tests unter Zeitdruck sind.",
    technologies: ["Python", "YOLOv8", "Computer Vision"], duration: "2 Tage · Teamprojekt",
    videoId: "3_DIj80E2vQ", youtubeUrl: "https://www.youtube.com/watch?v=3_DIj80E2vQ", githubUrl: "https://github.com/mikepro100223/KI-Lagerhaltungs-System"
  },
  {
    title: "Snake im Game-Boy-Stil",
    summary: "Ein responsives Browser-Spiel mit eigener Steuerung und einer Benutzeroberfläche im Retro-Look.",
    description: "Ich habe das klassische Snake-Spiel als Webanwendung umgesetzt und die Oberfläche an einen Game Boy angelehnt. Neben der Spiellogik lag mein Fokus auf einer Steuerung, die sowohl mit Tastatur als auch auf mobilen Geräten funktioniert. Das Projekt hat meine Kenntnisse im Umgang mit JavaScript-Events, Zuständen und responsivem CSS vertieft.",
    technologies: ["HTML", "CSS", "JavaScript"], duration: "Eigenprojekt", imageUrl: "images/Snake.png",
    githubUrl: "https://github.com/mikepro100223/snake", liveUrl: "https://yucansnake.netlify.app/"
  },
  {
    title: "Minesweeper",
    summary: "Das Logikspiel als responsive Web-App mit klarer Bedienung für Desktop und Smartphone.",
    description: "Bei meiner Minesweeper-Version habe ich das Spielfeld, die Zufallsverteilung der Minen und die Auswertung der Spielzüge selbst programmiert. Besondere Aufmerksamkeit galt einer verständlichen Oberfläche und der Bedienbarkeit auf kleinen Bildschirmen. So konnte ich Logik, DOM-Manipulation und responsives Design in einem kompakten Projekt verbinden.",
    technologies: ["HTML", "CSS", "JavaScript"], duration: "Eigenprojekt", imageUrl: "images/MineSweeper.png",
    githubUrl: "https://github.com/mikepro100223/Minesweeper", liveUrl: "https://yucanminesweeper.netlify.app/"
  }
];

const projectList = document.querySelector("#projectList");
const dialog = document.querySelector("#projectDialog");
const projectDetail = document.querySelector("#projectDetail");
const tags = items => items.map(item => `<span class="tag">${item}</span>`).join("");

projectList.innerHTML = projects.map((project, index) => `
  <button class="project-card reveal" type="button" data-project="${index}" aria-label="Details zu ${project.title} öffnen">
    <span class="project-index">0${index + 1}</span><h3>${project.title}</h3>
    <p>${project.summary}</p><span class="tags">${tags(project.technologies)}</span>
    <span class="project-arrow" aria-hidden="true">↗</span>
  </button>`).join("");

function showProject(index) {
  const project = projects[index];
  const videoPreview = project.videoId
    ? `<div class="dialog-media video-media">
        <iframe src="https://www.youtube-nocookie.com/embed/${project.videoId}?rel=0&amp;playsinline=1" title="Video zu ${project.title}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        <a class="video-fallback" href="${project.youtubeUrl}" target="_blank" rel="noopener noreferrer">Falls das Video nicht lädt: auf YouTube ansehen ↗</a>
      </div>`
    : "";
  const media = project.imageUrl
    ? `<div class="dialog-media image-media"><img src="${project.imageUrl}" alt="Screenshot des Projekts ${project.title}"></div>`
    : project.videoId
      ? videoPreview
      : `<div class="dialog-media"><div class="dialog-placeholder">${String(index + 1).padStart(2,"0")}</div></div>`;
  const links = [
    project.youtubeUrl ? `<a href="${project.youtubeUrl}" target="_blank" rel="noopener noreferrer">Video auf YouTube ↗</a>` : "",
    project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Live ansehen ↗</a>` : "",
    project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">Code auf GitHub ↗</a>` : ""
  ].join("");
  projectDetail.innerHTML = `${media}<div class="dialog-body">
    <p class="eyebrow">Projekt 0${index + 1}</p><h2 id="dialogTitle">${project.title}</h2>
    <p>${project.description}</p><div class="dialog-meta">${tags([...project.technologies, project.duration])}</div>
    <div class="dialog-links">${links}</div></div>`;
  dialog.showModal();
}

projectList.addEventListener("click", event => {
  const card = event.target.closest("[data-project]");
  if (card) showProject(Number(card.dataset.project));
});
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

const photoFocus = document.querySelector("[data-photo-focus]");
const focusDial = photoFocus?.querySelector(".focus-dial");
const focusOutput = photoFocus?.querySelector(".focus-output");
const focusIdeas = [
  ["01 / Licht", "Licht macht aus einem Augenblick eine Stimmung."],
  ["02 / Perspektive", "Ein neuer Blickwinkel macht Gewohntes wieder interessant."],
  ["03 / Moment", "Der richtige Moment erzählt mehr als eine gestellte Szene."]
];
let focusIndex = 0;

focusDial?.addEventListener("click", () => {
  focusIndex = (focusIndex + 1) % focusIdeas.length;
  photoFocus.classList.add("is-changing");
  window.setTimeout(() => {
    const [label, statement] = focusIdeas[focusIndex];
    focusOutput.querySelector("span").textContent = label;
    focusOutput.querySelector("strong").textContent = statement;
    photoFocus.classList.remove("is-changing");
  }, 180);
});

const themeToggle = document.querySelector("#themeToggle");
const themeToggleText = themeToggle?.querySelector(".theme-toggle-text");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function getActiveTheme() {
  return document.documentElement.dataset.theme || (systemTheme.matches ? "dark" : "light");
}

function updateThemeButton() {
  const isDark = getActiveTheme() === "dark";
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  if (themeToggleText) themeToggleText.textContent = isDark ? "Licht an" : "Licht aus";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#101512" : "#f5f2eb");
}

themeToggle?.addEventListener("click", () => {
  document.documentElement.dataset.theme = getActiveTheme() === "dark" ? "light" : "dark";
  document.body.classList.remove("theme-changing");
  void document.body.offsetWidth;
  document.body.classList.add("theme-changing");
  updateThemeButton();
});

const handleSystemThemeChange = () => {
  delete document.documentElement.dataset.theme;
  updateThemeButton();
};

if (systemTheme.addEventListener) {
  systemTheme.addEventListener("change", handleSystemThemeChange);
} else {
  systemTheme.addListener(handleSystemThemeChange);
}

updateThemeButton();

const photoHero = document.querySelector("[data-photo-hero]");
photoHero?.addEventListener("pointermove", event => {
  const bounds = photoHero.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  photoHero.style.setProperty("--photo-x", `${x * 100}%`);
  photoHero.style.setProperty("--photo-y", `${y * 100}%`);
});
photoHero?.addEventListener("pointerleave", () => {
  photoHero.style.setProperty("--photo-x", "50%");
  photoHero.style.setProperty("--photo-y", "50%");
});

const animatedElements = document.querySelectorAll(
  ".section-label, .section-heading, .profile-grid, .timeline-item, .project-card, .skill-groups article, .working-style, .contact > *"
);
animatedElements.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const navLinks = [...document.querySelectorAll("nav a")];
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });
document.querySelectorAll("main section[id]").forEach(section => navObserver.observe(section));
document.querySelector("#year").textContent = new Date().getFullYear();
