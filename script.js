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
const photoHeroImage = photoHero?.querySelector("[data-photo-image]");
const photoHeroMeta = photoHero?.querySelector("[data-photo-meta]");
const photoHeroCaption = photoHero?.querySelector("[data-photo-caption]");
const photoSlides = [
  {
    src: "images/photography-main.jpg",
    alt: "Eine Korean-Air-Maschine vor einem SWISS-Flugzeug am Flughafen",
    meta: "Spotting / Flughafen Zürich",
    caption: "Korean Air und SWISS am Flughafen Zürich."
  },
  {
    src: "images/gallery/DSC00032.jpg",
    alt: "Ein SWISS Airbus A340 im Anflug über der Landschaft",
    meta: "Spotting / Anflug Zürich",
    caption: "Ein SWISS Airbus A340 im Landeanflug."
  },
  {
    src: "images/gallery/DSC00500.jpg",
    alt: "Nahaufnahme des Weissach-RS-Schriftzugs an einem Porsche",
    meta: "Automotive / Porsche",
    caption: "Ein Weissach Porsche GT3 RS"
  },
  {
    src: "images/gallery/DSC00830.jpg",
    alt: "Vier blaue Porsche-Sportwagen in einer Reihe",
    meta: "Automotive / Porsche",
    caption: "Porsche GT3 & GT4 RS",
    desktopCaptionLines: ["Porsche GT3 ", "& GT4 RS"]
  },
  {
    src: "images/gallery/DSC01179.jpg",
    alt: "Ein goldener Lamborghini Aventador SVJ auf einer Strasse",
    meta: "Automotive / Lamborghini",
    caption: "Aventador SVJ",
    captionTop: true
  }
];
let photoSlideIndex = 0;
let photoRotation;
let photoRotationPaused = false;

function showNextPhoto() {
  if (!photoHeroImage || document.hidden) return;
  photoHero.classList.add("is-changing");
  photoHeroImage.classList.add("is-changing");
  window.setTimeout(() => {
    photoSlideIndex = (photoSlideIndex + 1) % photoSlides.length;
    const slide = photoSlides[photoSlideIndex];
    photoHeroImage.src = slide.src;
    photoHeroImage.alt = slide.alt;
    photoHero.classList.toggle("caption-top",Boolean(slide.captionTop));
    photoHeroMeta.textContent = slide.meta;
    photoHeroCaption.textContent = "";
    if (slide.desktopCaptionLines) {
      photoHeroCaption.append(document.createTextNode(slide.desktopCaptionLines[0]));
      const desktopBreak = document.createElement("br");
      desktopBreak.className = "desktop-caption-break";
      photoHeroCaption.append(desktopBreak,document.createTextNode(slide.desktopCaptionLines[1]));
    } else {
      photoHeroCaption.textContent = slide.caption;
    }
    const imageReady = photoHeroImage.decode ? photoHeroImage.decode() : Promise.resolve();
    imageReady.catch(() => {}).finally(() => {
      photoHero.classList.remove("is-changing");
      photoHeroImage.classList.remove("is-changing");
    });
  },450);
}

function startPhotoRotation(delay = 5000) {
  window.clearTimeout(photoRotation);
  if (photoRotationPaused) return;
  photoRotation = window.setTimeout(() => {
    showNextPhoto();
    startPhotoRotation();
  },delay);
}

if (photoHeroImage && photoSlides.length > 1) {
  photoSlides.slice(1).forEach(slide => {
    const preload = new Image();
    preload.src = slide.src;
  });
  startPhotoRotation(2500);
  const canPausePhotoRotation = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canPausePhotoRotation) {
    photoHero.addEventListener("pointerenter", () => {
      photoRotationPaused = true;
      window.clearTimeout(photoRotation);
    });
    photoHero.addEventListener("pointerleave", () => {
      photoRotationPaused = false;
      startPhotoRotation();
    });
  }
}

const tourTrigger = document.querySelector("#tourTrigger");
const flightLayer = document.querySelector("#flightLayer");
const tourStops = [
  { id: "start",title: "Willkommen",message: "Ein kurzer Überblick über mich.",x: .22,y: 8 },
  { id: "profil",title: "Mein Weg",message: "Meine Ausbildung auf einen Blick.",x: .72,y: -10 },
  { id: "hobbys",title: "Fotografie",message: "Mein Ausgleich neben dem Code.",x: .34,y: 12 },
  { id: "projekte",title: "Projekte",message: "Eine Auswahl meiner Arbeiten.",x: .67,y: -6 },
  { id: "kenntnisse",title: "Kenntnisse",message: "Technologien, die ich einsetze.",x: .26,y: 10 },
  { id: "kontakt",title: "Kontakt",message: "Hier kannst du mich erreichen.",x: .62,y: -8 }
];
const tourPlaneShape = `<svg viewBox="0 0 512 480" aria-hidden="true">
  <path class="plane-body" d="M480 192H366L261 9Q254 0 243 0h-47q-9 0-4 10l80 182H160l-65-81q-5-7-13-7H53q-9 0-4 11l47 77H48q-20 0-34 14T0 240t14 34 34 14h48l-47 77q-5 11 7 13h26q8 0 13-7l65-83h112l-80 182q-4 10 4 10h47q11 0 18-9l105-183h114q32 0 32-32v-32q0-32-32-32Z"/>
  <path class="plane-detail" d="M365 192 326 240l40 48M96 192l30 48-30 48"/>
</svg>`;
let tourRun = 0;

const pause = duration => new Promise(resolve => window.setTimeout(resolve,duration));

function stopTour() {
  tourRun += 1;
  flightLayer.replaceChildren();
  tourTrigger.setAttribute("aria-pressed","false");
  tourTrigger.querySelector(".tour-trigger-label").textContent = "Entdecken";
}

async function startTour() {
  const currentRun = ++tourRun;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const plane = document.createElement("div");
  const tooltip = document.createElement("div");
  const progress = document.createElement("span");
  const title = document.createElement("strong");
  const copy = document.createElement("p");
  let currentX = window.innerWidth - 104;
  let currentY = 22;
  let facingDirection = 1;

  plane.className = "tour-plane";
  plane.innerHTML = tourPlaneShape;
  plane.style.transform = `translate3d(${currentX}px,${currentY}px,0)`;
  tooltip.className = "tour-tooltip";
  tooltip.append(progress,title,copy);
  flightLayer.replaceChildren(plane,tooltip);
  tourTrigger.setAttribute("aria-pressed","true");
  tourTrigger.querySelector(".tour-trigger-label").textContent = "Stoppen";

  for (let index = 0; index < tourStops.length; index += 1) {
    if (currentRun !== tourRun) return;
    const stop = tourStops[index];
    const section = document.getElementById(stop.id);
    const anchor = section.querySelector(".section-label,.eyebrow,h1,h2") || section;
    const anchorRect = anchor.getBoundingClientRect();
    const documentHeight = document.documentElement.scrollHeight;
    const anchorDocumentTop = anchorRect.top + window.scrollY;
    const desiredAnchorTop = 128 + index % 3 * 26;
    const targetScrollY = Math.max(0,Math.min(documentHeight - window.innerHeight,anchorDocumentTop - desiredAnchorTop));
    const finalAnchorTop = anchorDocumentTop - targetScrollY;
    const rect = {
      top: finalAnchorTop,
      bottom: finalAnchorTop + anchorRect.height,
      height: anchorRect.height
    };
    const sideX = window.innerWidth * stop.x;
    const nextX = Math.max(18,Math.min(window.innerWidth - 104,sideX));
    const travelDirection = nextX < currentX ? -1 : 1;
    tooltip.classList.remove("visible");

    if (!reduceMotion && travelDirection !== facingDirection) {
      plane.classList.add("turning");
      const turnAnimation = plane.animate([
        { transform: `translate3d(${currentX}px,${currentY}px,0) scaleX(${facingDirection})`, offset: 0 },
        { transform: `translate3d(${currentX}px,${currentY}px,0) scaleX(${facingDirection * .12}) rotate(-2deg)`, offset: .46 },
        { transform: `translate3d(${currentX}px,${currentY}px,0) scaleX(${travelDirection * .12}) rotate(2deg)`, offset: .54 },
        { transform: `translate3d(${currentX}px,${currentY}px,0) scaleX(${travelDirection})`, offset: 1 }
      ], { duration: 420,easing: "cubic-bezier(.4,0,.2,1)",fill: "forwards" });
      try { await turnAnimation.finished; } catch (_) {}
      turnAnimation.cancel();
      plane.classList.remove("turning");
      if (currentRun !== tourRun) return;
    }
    facingDirection = travelDirection;
    plane.style.transform = `translate3d(${currentX}px,${currentY}px,0) scaleX(${facingDirection})`;

    const planeAboveAnchor = rect.top > 150;
    const anchorSideY = planeAboveAnchor ? rect.top - 54 : rect.bottom + 16;
    const nextY = Math.max(82,Math.min(window.innerHeight - 150,anchorSideY + stop.y));
    window.scrollTo({ top: targetScrollY,behavior: reduceMotion ? "auto" : "smooth" });

    if (!reduceMotion) {
      plane.classList.add("flying");
      const deltaX = nextX - currentX;
      const deltaY = nextY - currentY;
      const distance = Math.hypot(deltaX,deltaY);
      const arc = Math.min(155,Math.max(70,distance * .18));
      const direction = travelDirection;
      const climbBank = direction * -5;
      const descentBank = direction * 4;
      const routeOffset = (index % 3 - 1) * 18;
      const flightLevel = Math.max(62,Math.min(currentY,nextY) - arc + routeOffset);
      const curveXOne = currentX + deltaX * .2;
      const curveXTwo = currentX + deltaX * .45;
      const curveXThree = currentX + deltaX * .7;
      const curveXFour = currentX + deltaX * .9;
      const curveYOne = currentY + (flightLevel - currentY) * .62;
      const curveYTwo = flightLevel;
      const curveYThree = flightLevel + 5;
      const curveYFour = nextY + (flightLevel - nextY) * .42;
      const flightAnimation = plane.animate([
        { transform: `translate3d(${currentX}px,${currentY}px,0) scaleX(${direction}) rotate(0deg)`, offset: 0 },
        { transform: `translate3d(${curveXOne}px,${curveYOne}px,0) scaleX(${direction}) rotate(${climbBank}deg)`, offset: .2 },
        { transform: `translate3d(${curveXTwo}px,${curveYTwo}px,0) scaleX(${direction}) rotate(0deg)`, offset: .45 },
        { transform: `translate3d(${curveXThree}px,${curveYThree}px,0) scaleX(${direction}) rotate(0deg)`, offset: .7 },
        { transform: `translate3d(${curveXFour}px,${curveYFour}px,0) scaleX(${direction}) rotate(${descentBank}deg)`, offset: .9 },
        { transform: `translate3d(${nextX}px,${nextY}px,0) scaleX(${direction}) rotate(0deg)`, offset: 1 }
      ], { duration: Math.min(1500,Math.max(900,distance * 1.35)),easing: "cubic-bezier(.4,.08,.2,1)",fill: "forwards" });
      try { await flightAnimation.finished; } catch (_) {}
      flightAnimation.cancel();
      plane.classList.remove("flying");
    }
    if (currentRun !== tourRun) return;
    currentX = nextX;
    currentY = nextY;
    plane.style.transform = `translate3d(${currentX}px,${currentY}px,0) scaleX(${travelDirection})`;

    progress.textContent = `${String(index + 1).padStart(2,"0")} / ${String(tourStops.length).padStart(2,"0")}`;
    title.textContent = stop.title;
    copy.textContent = stop.message;
    const tooltipWidth = Math.min(300,window.innerWidth - 32);
    const tooltipHeight = tooltip.offsetHeight || 112;
    const tooltipTargetX = nextX < window.innerWidth / 2 ? nextX + 96 : nextX - tooltipWidth - 18;
    const tooltipLeft = Math.max(16,Math.min(window.innerWidth - tooltipWidth - 16,tooltipTargetX));
    const spaceAbove = rect.top - 16;
    const spaceBelow = window.innerHeight - rect.bottom - 16;
    const placeAbove = spaceAbove >= tooltipHeight + 40 || spaceAbove > spaceBelow;
    const tooltipTargetY = placeAbove ? rect.top - tooltipHeight - 28 : rect.bottom + 48;
    const tooltipTop = Math.max(78,Math.min(window.innerHeight - tooltipHeight - 16,tooltipTargetY));
    tooltip.style.left = `${tooltipLeft}px`;
    tooltip.style.top = `${tooltipTop}px`;
    tooltip.classList.add("visible");
    await pause(reduceMotion ? 1050 : 1500);
  }

  if (currentRun === tourRun) stopTour();
}

tourTrigger?.addEventListener("click", () => {
  if (tourTrigger.getAttribute("aria-pressed") === "true") stopTour();
  else startTour();
});

const animatedElements = document.querySelectorAll(
  ".section-label, .section-heading, .profile-grid, .hobby-grid > *, .timeline-item, .project-card, .skill-groups article, .working-style, .contact > *"
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
