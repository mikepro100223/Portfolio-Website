// Static, single-page site — no backend or database.
// All content is provided locally via `projectDetails` and `skillDetails` objects.

// Dynamic content loaded from API
// No dynamic backend content — keep static data only

const SKILL_CARD_INDEX = {
  frontend: 0,
  backend: 1,
  tools: 2,
};

const TECHNOLOGY_ALIASES = {
  html5: 'html',
  css3: 'css',
  js: 'javascript',
  'canvas api': 'javascript',
  canvas: 'javascript',
  node: 'node.js',
  vue: 'vue.js',
  vscode: 'vs code',
};

const TECHNOLOGY_CATEGORY_HINTS = {
  html: 'frontend',
  css: 'frontend',
  javascript: 'frontend',
  react: 'frontend',
  'vue.js': 'frontend',
  'node.js': 'backend',
  python: 'backend',
  sql: 'backend',
  mongodb: 'backend',
  flask: 'backend',
  firebase: 'backend',
  git: 'tools',
  figma: 'tools',
  docker: 'tools',
  'vs code': 'tools',
};

function normalizeTechnologyName(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function getCategorySkills(category) {
  return skillDetails?.[category]?.skills || [];
}

function buildTechnologyMap() {
  const map = new Map();

  ['frontend', 'backend', 'tools'].forEach((category) => {
    getCategorySkills(category).forEach((skill) => {
      const name = (skill?.name || '').trim();
      if (!name) {
        return;
      }

      map.set(normalizeTechnologyName(name), { name, category });
    });
  });

  Object.entries(TECHNOLOGY_ALIASES).forEach(([alias, canonical]) => {
    const canonicalEntry = map.get(normalizeTechnologyName(canonical));
    if (canonicalEntry) {
      map.set(normalizeTechnologyName(alias), canonicalEntry);
    }
  });

  return map;
}

function resolveProjectTechnology(techName, technologyMap) {
  let normalized = normalizeTechnologyName(techName);
  if (!normalized) {
    return null;
  }

  if (TECHNOLOGY_ALIASES[normalized]) {
    normalized = normalizeTechnologyName(TECHNOLOGY_ALIASES[normalized]);
  }

  const directMatch = technologyMap.get(normalized);
  if (directMatch) {
    return directMatch;
  }

  const hintedCategory = TECHNOLOGY_CATEGORY_HINTS[normalized];
  if (hintedCategory) {
    const skillMatch = getCategorySkills(hintedCategory).find((skill) =>
      normalizeTechnologyName(skill?.name) === normalized
    );

    return {
      name: skillMatch?.name || String(techName).trim(),
      category: hintedCategory,
    };
  }

  for (const [key, value] of technologyMap.entries()) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return value;
    }
  }

  return null;
}

function getLinkedProjectTechnologies(technologies) {
  if (!Array.isArray(technologies) || technologies.length === 0) {
    return [];
  }

  const technologyMap = buildTechnologyMap();
  const result = [];
  const seen = new Set();

  technologies.forEach((techName) => {
    const resolved = resolveProjectTechnology(techName, technologyMap);
    if (!resolved) {
      return;
    }

    const dedupeKey = `${normalizeTechnologyName(resolved.name)}::${resolved.category}`;
    if (seen.has(dedupeKey)) {
      return;
    }

    seen.add(dedupeKey);
    result.push(resolved);
  });

  return result;
}

function renderProjectTechnologyTags(technologies) {
  const linkedTechnologies = getLinkedProjectTechnologies(technologies);

  return linkedTechnologies
    .map(
      (item) =>
        `<button type="button" class="tech-tag tech-tag-link" data-skill-category="${item.category}">${item.name}</button>`
    )
    .join('');
}

function navigateToSkillCategory(category) {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) {
    return;
  }

  closeProjectDetail();

  const headerHeight = document.querySelector('header')?.offsetHeight || 70;
  const targetTop = skillsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
  window.scrollTo({ top: targetTop, behavior: 'smooth' });

  const targetIndex = SKILL_CARD_INDEX[category];
  if (typeof targetIndex !== 'number') {
    return;
  }

  const skillCards = document.querySelectorAll('.skill-card');
  const targetCard = skillCards[targetIndex];
  if (!targetCard) {
    return;
  }

  targetCard.classList.add('tech-focus');
  setTimeout(() => {
    targetCard.classList.remove('tech-focus');
  }, 1500);
}

function attachTechnologyTagListeners(rootElement = document) {
  rootElement.querySelectorAll('.tech-tag-link').forEach((tag) => {
    tag.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const category = tag.getAttribute('data-skill-category');
      navigateToSkillCategory(category);
    });
  });
}

const UI_LABELS = {
  technologies: "Technologien",
  duration: "Dauer",
  backButton: "← Zurück",
};

const projectDetails = {
  1: {
    title: "Lego EV3 Roboter",
    shortDesc: "Ein Lego EV3 Roboter, den ich programmiert habe, um verschiedene Hindernisse zu überwinden",
    fullDesc:
      "In diesem Projekt habe ich einen Lego EV3 Roboter programmiert, um verschiedene Aufgaben zu erfüllen. Der Roboter kann Linien folgen, Hindernissen ausweichen und einfache Bewegungsabläufe ausführen. Durch die Verwendung von Python und der EV3-Programmierumgebung konnte ich die Funktionen des Roboters erweitern und anpassen. Das Projekt ist ein fortlaufendes Experimentieren mit der Robotik, um die Möglichkeiten des EV3-Kits voll auszuschöpfen. Momentan beschäftige ich mich mit Hinderniss Räumung per Kranarm.",
    technologies: ["Python", "EV3"],
    duration: "Work in Progress",
    videoUrl: "https://youtu.be/OKg1xoUKLe8",
    image: "🤖",
    githubUrl: "https://github.com/mikepro100223/automated_car",
  },
  2: {
    title: "KI-Lagerhaltungs-System",
    shortDesc: "Ein KI-gestütztes Lagerhaltungs-System durch Image-Erkennung",
    fullDesc:
      "Am Hackathon Baden Hackt 2026, habe ich in einem Team von 2 Personen ein KI-gestütztes Lagerhaltungs-System entwickelt, das mithilfe von Bilderkennung die Lagerbestände automatisch verwalten kann und auf Bedarf auch Email senden zum Nachfüllen. Durch den Einsatz von Python und YOLO V8 konnten wir eine effiziente Lösung schaffen, die es ermöglicht, den Lagerbestand in Echtzeit zu überwachen und Engpässe frühzeitig zu erkennen. Das Projekt wurde innerhalb von 2 Tagen erfolgreich umgesetzt und demonstriert die Möglichkeiten der KI in der Logistikbranche.",
    technologies: ["Python", "YOLO V8"],
    duration: "2 Tage Hackathon",
    videoUrl: "https://www.youtube.com/watch?v=3_DIj80E2vQ",
    image: "⚙️",
    githubUrl: "https://github.com/mikepro100223/KI-Lagerhaltungs-System",
  },
  3: {
    title: "Snake Game",
    shortDesc: "Ein klassisches Snake-Spiel als eine Web-App entwickelt im Stil von einem Game-Boy",
    fullDesc:
      "In diesem Projekt habe ich ein klassisches Snake-Spiel als Web-App entwickelt. Während dem Programmieren kam ich auf die Idee, das Design an den Stil eines Game-Boys anzulehnen, um dem Spiel einen nostalgischen Touch zu verleihen. Das Ergebnis ist eine unterhaltsame und visuell ansprechende Version des beliebten Spiels, die sowohl auf Desktop- als auch auf mobilen Geräten funktioniert.",
    technologies: ["HTML", "CSS", "JavaScript"],
    duration: "1 Tag",
    image: "🐍",
    imageUrl: "images/Snake.png", 
    githubUrl: "https://github.com/mikepro100223/snake",
    liveUrl: "https://yucansnake.netlify.app/",
  },
  4: {
    title: "MineSweeper",
    shortDesc: "Ein originelles Minesweeper-Spiel als eine Web-App entwickelt",
    fullDesc:
      "In diesem Projekt habe ich ein klassisches Minesweeper-Spiel als Web-App entwickelt. Das Design ist einfach und benutzerfreundlich, mit klaren Grafiken und intuitiven Bedienelementen. Wie auch meine anderen Spiele, ist es möglich dieses am Handy auszuprobieren. Das Spiel bietet eine unterhaltsame Möglichkeit, Logik und Strategie zu üben, während es gleichzeitig an das nostalgische Gefühl des Originalspiels erinnert.",
    technologies: ["HTML", "CSS", "JavaScript"],
    duration: "1 Tag",
    image: "💣",
    imageUrl: "images/MineSweeper.png",
    githubUrl: "https://github.com/mikepro100223/Minesweeper",
    liveUrl: "https://yucanminesweeper.netlify.app/",
  },
};

let isDarkMode = true; // Always dark mode
let currentProject = null;
let currentSkill = null;

function getYouTubeEmbedUrl(url) {
  if (!url) return '';

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes('youtu.be')) {
      const videoId = parsedUrl.pathname.replace(/^\//, '').trim();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (parsedUrl.hostname.includes('youtube.com')) {
      if (parsedUrl.pathname === '/watch') {
        const videoId = parsedUrl.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }

      if (parsedUrl.pathname.startsWith('/embed/')) {
        return url;
      }
    }
  } catch {
    return url;
  }

  return url;
}

const skillDetails = {
  frontend: {
    title: "Frontend Entwicklung",
    icon: "🎨",
    description: "Frontend-Entwicklung umfasst die Erstellung der visuellen und interaktiven Teile einer Website, die Benutzer direkt sehen und mit denen sie interagieren. Es geht um Design, Benutzererfahrung und die technische Umsetzung im Browser.",
    skills: [
      {
        name: "HTML",
        level: "Fortgeschritten",
        description: "HTML (HyperText Markup Language) ist die Grundstruktur jeder Webseite. Es definiert den Inhalt und die Hierarchie von Elementen wie Überschriften, Absätzen, Bildern und Links.",
        experience: "2+ Jahre"
      },
      {
        name: "CSS",
        level: "Fortgeschritten",
        description: "CSS (Cascading Style Sheets) ist für das visuelle Styling verantwortlich. Damit gestalte ich Layouts, Farben, Animationen und responsive Designs, die auf allen Geräten funktionieren.",
        experience: "2+ Jahre"
      },
      {
        name: "JavaScript",
        level: "Fortgeschritten",
        description: "JavaScript macht Websites interaktiv. Von einfachen Klick-Events bis zu komplexen Animationen und API-Abfragen - JavaScript bringt Leben in die Webseite.",
        experience: "2+ Jahre"
      },
      {
        name: "React",
        level: "Mittel",
        description: "React ist eine moderne JavaScript-Bibliothek für den Bau von interaktiven Benutzeroberflächen. Mit wiederverwendbaren Komponenten lassen sich komplexe Anwendungen effizient entwickeln.",
        experience: "1+ Jahre"
      }
    ]
  },
  backend: {
    title: "Backend Entwicklung",
    icon: "⚙️",
    description: "Backend-Entwicklung bezieht sich auf die serverseitige Logik, Datenbanken und APIs, die im Hintergrund laufen. Hier werden Daten verarbeitet, gespeichert und für das Frontend bereitgestellt.",
    skills: [
      {
        name: "Node.js",
        level: "Fortgeschritten",
        description: "Node.js ermöglicht die Ausführung von JavaScript auf dem Server. Damit kann ich serverseitige Anwendungen, REST APIs und Real-time Services entwickeln.",
        experience: "1+ Jahre"
      },
      {
        name: "Python",
        level: "Fortgeschritten",
        description: "Python ist eine vielseitige Programmiersprache, die ich für Backend-Entwicklung, Datenanalyse und Automatisierung einsetze. Sie ist bekannt für ihre Lesbarkeit und Effizienz.",
        experience: "1+ Jahre"
      },
      {
        name: "SQL",
        level: "Fortgeschritten",
        description: "SQL (Structured Query Language) ist die Sprache für relationale Datenbanken. Damit kann ich Daten effizient abfragen, speichern und verwalten.",
        experience: "2+ Jahre"
      },
      {
        name: "MongoDB",
        level: "Grundlagen",
        description: "MongoDB ist eine NoSQL-Datenbank, die Daten in flexiblen JSON-ähnlichen Dokumenten speichert. Ideal für moderne, skalierbare Anwendungen.",
        experience: "<1 Jahr"
      },
      {
        name: "C#",
        level: "Fortgeschritten",
        description: "C# ist eine leistungsfähige, statisch typisierte Sprache für Anwendungen unter .NET - ideal für Backend, APIs und Desktop-Anwendungen.",
        experience: "2+ Jahre"
      },
      {
        name: ".NET",
        level: "Fortgeschritten",
        description: ".NET ist die Laufzeitplattform für C#-Anwendungen; verwendet für serverseitige Dienste, APIs und Cross-Platform-Apps.",
        experience: "1+ Jahre"
      }
    ]
  },
  tools: {
    title: "Tools & Workflow",
    icon: "🛠️",
    description: "Professionelle Entwicklung erfordert den Einsatz der richtigen Tools. Von Versionskontrolle über Code-Editoren bis zu Design-Tools - diese Werkzeuge steigern die Produktivität und Qualität.",
    skills: [
      {
        name: "EV3",
        level: "Fortgeschritten",
        description: "Lego EV3 ist ein Robotics-Kit, mit dem ich verschiedene Projekte umgesetzt habe, darunter autonome Fahrzeuge und Robotik-Wettbewerbe.",
        experience: "5+ Jahr"
      },
      {
        name: "Git",
        level: "Fortgeschritten",
        description: "Git ist ein Versionskontrollsystem, das die Zusammenarbeit im Team ermöglicht und den Code-Verlauf nachvollziehbar macht. Unverzichtbar für moderne Softwareentwicklung.",
        experience: "3+ Jahre"
      },
      {
        name: "VS Code",
        level: "Fortgeschritten",
        description: "Visual Studio Code ist mein Haupt-Code-Editor. Mit Extensions, Shortcuts und integrierten Tools beschleunigt es die Entwicklung erheblich.",
        experience: "3+ Jahre"
      },
      {
        name: "Figma",
        level: "Mittel",
        description: "Figma ist ein kollaboratives Design-Tool für UI/UX-Design. Damit erstelle ich Prototypen und arbeite eng mit Designern zusammen.",
        experience: "1+ Jahre"
      },
      {
        name: "Docker",
        level: "Mittel",
        description: "Docker ermöglicht die Containerisierung von Anwendungen. Das sorgt für konsistente Entwicklungs- und Produktionsumgebungen.",
        experience: "1+ Jahr"
      },
      {
        name: "Powershell",
        level: "Mittel",
        description: "Powershell nutze ich für Automatisierung, DevOps-Skripte und Systemadministration unter Windows und cross-platform mit PowerShell Core.",
        experience: "2+ Jahre"
      },
      {
        name: "YOLO V8",
        level: "Mittel",
        description: "YOLO V8 ist ein leistungsstarkes Objekterkennungssystem, das ich für das KI-Lagerhaltungs-System eingesetzt habe.",
        experience: "1 Jahr"
      }
    ]
  }
};

// ===== PARTICLE ANIMATION =====
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 50;
    
    this.resize();
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = document.documentElement.scrollHeight;
  }
  
  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const isDark = document.body.classList.contains('dark-mode');
    
    this.particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = isDark 
        ? `rgba(34, 211, 238, ${particle.opacity})` 
        : `rgba(8, 145, 178, ${particle.opacity})`;
      this.ctx.fill();
    });
    
    // Connect nearby particles
    this.particles.forEach((p1, i) => {
      this.particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = isDark
            ? `rgba(34, 211, 238, ${0.1 * (1 - distance / 100)})`
            : `rgba(8, 145, 178, ${0.15 * (1 - distance / 100)})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// ===== SCROLL REVEAL ANIMATION =====
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  
  reveals.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const revealPoint = 100;
    
    if (elementTop < windowHeight - revealPoint) {
      element.classList.add('active');
    }
  });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

// Dark mode is preserved via `body.dark-mode` state and `isDarkMode` variable.
// UI toggles have been removed; dark mode can still be set by `isDarkMode` value in localStorage.

function updateNavProgress() {
  const navLinks = Array.from(document.querySelectorAll("nav .nav-link"));
  if (!navLinks.length) return;

  const navList = navLinks[0].closest("ul");
  if (!navList) return;

  const sections = navLinks.map((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return null;
    return document.querySelector(href);
  });

  if (!sections[0]) return;

  const header = document.querySelector("header");
  const headerOffset = header ? header.offsetHeight : 70;
  const markerY = window.scrollY + headerOffset + 12;

  let currentIndex = 0;
  sections.forEach((section, index) => {
    if (section && markerY >= section.offsetTop) {
      currentIndex = index;
    }
  });

  const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
  let sectionProgress = 0;

  if (nextIndex !== currentIndex && sections[currentIndex] && sections[nextIndex]) {
    const startTop = sections[currentIndex].offsetTop;
    const endTop = sections[nextIndex].offsetTop;
    if (endTop > startTop) {
      sectionProgress = Math.min(Math.max((markerY - startTop) / (endTop - startTop), 0), 1);
    }
  }

  const navRect = navList.getBoundingClientRect();
  const centers = navLinks.map((link) => {
    const rect = link.getBoundingClientRect();
    return (rect.left - navRect.left) + rect.width / 2;
  });

  const startCenter = centers[currentIndex] ?? 0;
  const endCenter = centers[nextIndex] ?? startCenter;
  const fillWidth = startCenter + ((endCenter - startCenter) * sectionProgress);

  navList.style.setProperty("--nav-progress-width", `${Math.max(fillWidth, 0)}px`);

  navLinks.forEach((link, index) => {
    link.classList.toggle("active", index === currentIndex);
  });
}

/* Glass droplet indicator that follows the active nav item */
let hoveredGlassTarget = null;

function updateGlassIndicator() {
  const header = document.querySelector('header');
  const indicator = document.querySelector('.glass-indicator');
  const navLinks = Array.from(document.querySelectorAll('.glass-nav-container .nav-link'));
  if (!header || !indicator || navLinks.length === 0) return;

  const headerOffset = header ? header.offsetHeight : 70;
  const markerY = window.scrollY + headerOffset + 12;
  const docHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;

  let currentIndex = 0;
  navLinks.forEach((link, index) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const section = document.querySelector(href);
    if (!section) return;
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
    const sectionBottom = section.getBoundingClientRect().bottom + window.pageYOffset;
    
    if (markerY >= sectionTop) {
      currentIndex = index;
    }
    
    // Special handling for last section (Kontakt/Footer): if near bottom, select it
    if (index === navLinks.length - 1 && window.scrollY + viewportHeight >= docHeight - 100) {
      currentIndex = index;
    }
  });

  const targetElement = hoveredGlassTarget && header.contains(hoveredGlassTarget)
    ? hoveredGlassTarget
    : navLinks[currentIndex];
  if (!targetElement) return;

  const headerRect = header.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  const targetCenterX = (targetRect.left - headerRect.left) + targetRect.width / 2;
  const targetCenterY = (targetRect.top - headerRect.top) + targetRect.height / 2;

  const paddingX = 8;
  const paddingY = 6;
  const newWidth = Math.max(targetRect.width + paddingX * 2, 28);
  const newHeight = Math.max(targetRect.height + paddingY * 2, 28);

  indicator.style.width = `${newWidth}px`;
  indicator.style.height = `${newHeight}px`;
  indicator.style.left = `${targetCenterX}px`;
  indicator.style.top = `${targetCenterY}px`;
  indicator.style.borderRadius = `${newHeight / 2}px`;

  // choose a color for the active item (can be tuned per index or per section)
  const colors = ['rgba(255,255,255,0.30)', 'rgba(255,255,255,0.26)', 'rgba(255,255,255,0.24)', 'rgba(255,255,255,0.22)', 'rgba(255,255,255,0.20)'];
  const color = colors[currentIndex % colors.length];
  indicator.style.setProperty('--indicator-color', color);
  header.style.setProperty('--indicator-color', color);
}

function bindGlassHoverTargets() {
  const header = document.querySelector('header');
  const navLinks = Array.from(document.querySelectorAll('.glass-nav-container .nav-link'));
  const hoverTargets = navLinks.filter(Boolean);
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (isTouchDevice) {
    hoveredGlassTarget = null;
    updateGlassIndicator();
    return;
  }

  hoverTargets.forEach((target) => {
    target.addEventListener('pointerenter', () => {
      hoveredGlassTarget = target;
      updateGlassIndicator();
    });

    target.addEventListener('pointerleave', () => {
      if (hoveredGlassTarget === target) {
        hoveredGlassTarget = null;
      }
      updateGlassIndicator();
    });
  });

  if (header) {
    header.addEventListener('pointerleave', () => {
      hoveredGlassTarget = null;
      updateGlassIndicator();
    });
  }
}

// Smooth scroll for center nav links
document.addEventListener('click', (e) => {
  const target = e.target.closest('.glass-nav-container .nav-link');
  if (!target) return;
  e.preventDefault();
  const href = target.getAttribute('href');
  if (!href || !href.startsWith('#')) return;
  const section = document.querySelector(href);
  if (!section) return;
  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 70;
  const top = section.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;
  window.scrollTo({ top, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  updateGlassIndicator();
});

window.addEventListener('resize', () => updateGlassIndicator());

document.addEventListener('DOMContentLoaded', () => {
  bindGlassHoverTargets();
  updateGlassIndicator();
  updateNavProgress();
});


function showProjectDetail(projectId) {
  currentProject = projectId;
  const project = projectDetails[projectId];
  const modal = document.getElementById("projectModal");
  const detailContainer = document.getElementById("projectDetail");
  const videoSrc = getYouTubeEmbedUrl(project.videoUrl);

  // Build video section if videoUrl exists
  const videoSection = videoSrc ? `
    <div class="project-video">
      <iframe 
        src="${videoSrc}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
  ` : (project.imageUrl ? `
  <div class="project-image">
    <img src="${project.imageUrl}" alt="${project.title}">
  </div>
` : '');

  // Build features section if features exist
  const featuresSection = project.features ? `
    <div class="meta-item">
      <h4>Features</h4>
      <ul class="feature-list">
        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  // Build action buttons if URLs exist
  const actionButtons = (project.githubUrl || project.liveUrl) ? `
    <div class="project-actions">
      ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="action-btn github-btn">
        <i class="fab fa-github"></i> GitHub
      </a>` : ''}
      ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="action-btn live-btn">
        <i class="fas fa-external-link-alt"></i> Live Demo
      </a>` : ''}
    </div>
  ` : '';

  const technologyTags = renderProjectTechnologyTags(project.technologies || []);

  detailContainer.innerHTML = `
    <div class="project-detail-header">
      <button class="back-button" onclick="closeProjectDetail()">${
        UI_LABELS.backButton
      }</button>
      <h2>${project.title}</h2>
    </div>
    <div class="project-detail-content">
      ${videoSection}
      <p class="project-full-desc">${project.fullDesc}</p>
      ${actionButtons}
      <div class="project-meta">
        ${technologyTags ? `
        <div class="meta-item">
          <h4>${UI_LABELS.technologies}</h4>
          <div class="tech-tags">
            ${technologyTags}
          </div>
        </div>
        ` : ''}
        <div class="meta-item">
          <h4>${UI_LABELS.duration}</h4>
          <p>${project.duration}</p>
        </div>
        ${featuresSection}
      </div>
    </div>
  `;

  attachTechnologyTagListeners(detailContainer);

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden"; // NEU
}

function closeProjectDetail() {
  currentProject = null;
  const modal = document.getElementById("projectModal");
  modal.style.display = "none";
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

function showSkillDetail(skillKey) {
  currentSkill = skillKey;
  const skill = skillDetails[skillKey];
  const modal = document.getElementById("skillModal");
  const detailContainer = document.getElementById("skillDetail");

  const skillsHTML = skill.skills.map(s => `
    <div class="skill-detail-card">
      <div class="skill-detail-header">
        <h4>${s.name}</h4>
        <span class="skill-level">${s.level}</span>
      </div>
      <p class="skill-description">${s.description}</p>
      <div class="skill-experience">
        <i class="fas fa-clock"></i> ${s.experience}
      </div>
    </div>
  `).join('');

  detailContainer.innerHTML = `
    <div class="project-detail-header">
      <button class="back-button" onclick="closeSkillDetail()">${
        UI_LABELS.backButton
      }</button>
      <div class="skill-detail-title">
        <span class="skill-icon-large">${skill.icon}</span>
        <h2>${skill.title}</h2>
      </div>
    </div>
    <div class="project-detail-content">
      <p class="project-full-desc">${skill.description}</p>
      <div class="skills-detail-grid">
        ${skillsHTML}
      </div>
    </div>
  `;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
}

function closeSkillDetail() {
  currentSkill = null;
  const modal = document.getElementById("skillModal");
  modal.style.display = "none";
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

function updateProjectCards() {
  const projectsGrid = document.querySelector('.projects-grid');
  if (!projectsGrid) return;

  // Render static projects from `projectDetails` (1-based ids)
  const ids = Object.keys(projectDetails).sort((a,b) => Number(a) - Number(b));

  projectsGrid.innerHTML = ids.map(id => {
    const proj = projectDetails[id] || {};
    const icon = proj.image || '📁';
    return `
      <div class="project-card" data-project-id="${id}" style="cursor: pointer;">
        <div class="project-icon">${icon}</div>
        <h3>${proj.title || 'Projekt'}</h3>
        <p>${proj.shortDesc || ''}</p>
      </div>
    `;
  }).join('');

  attachProjectCardListeners();
}

// Attach click listeners to static project cards
function attachProjectCardListeners() {
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    card.style.cursor = 'pointer';
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);

    newCard.addEventListener('click', function () {
      const projectId = parseInt(this.getAttribute('data-project-id'));
      if (projectId) {
        showProjectDetail(projectId);
      } else {
        const index = Array.from(document.querySelectorAll('.project-card')).indexOf(this);
        showProjectDetail(index + 1);
      }
    });
  });
}

function showDynamicProject(project) {
  if (!project) return;

  const projectData = project;
  const modal = document.getElementById("projectModal");
  const detailContainer = document.getElementById("projectDetail");
  const videoSrc = getYouTubeEmbedUrl(project.videoUrl);
  
  const videoSection = videoSrc ? `
    <div class="project-video">
      <iframe src="${videoSrc}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  ` : (project.imageUrl ? `<div class="project-image"><img src="${project.imageUrl}" alt="${projectData.title}" style="width:100%;max-height:500px;object-fit:contain;border-radius:15px;"></div>` : '');
  
  const featuresSection = projectData.features && projectData.features.length > 0 ? `
    <div class="meta-item">
      <h4>Features</h4>
      <ul class="feature-list">
        ${projectData.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>
  ` : '';
  
  const actionButtons = (project.githubUrl || project.liveUrl) ? `
    <div class="project-actions">
      ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="action-btn github-btn">
        <i class="fab fa-github"></i> GitHub
      </a>` : ''}
      ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="action-btn live-btn">
        <i class="fas fa-external-link-alt"></i> Live Demo
      </a>` : ''}
    </div>
  ` : '';

  const technologyTags = renderProjectTechnologyTags(project.technologies || []);
  
  detailContainer.innerHTML = `
    <div class="project-detail-header">
      <button class="back-button" onclick="closeProjectDetail()">${UI_LABELS.backButton}</button>
      <h2>${projectData.title}</h2>
    </div>
    <div class="project-detail-content">
      ${videoSection}
      <p class="project-full-desc">${projectData.fullDesc || ''}</p>
      ${actionButtons}
      <div class="project-meta">
        ${technologyTags ? `
          <div class="meta-item">
            <h4>${UI_LABELS.technologies}</h4>
            <div class="tech-tags">
              ${technologyTags}
            </div>
          </div>
        ` : ''}
        ${projectData.duration ? `
          <div class="meta-item">
            <h4>${UI_LABELS.duration}</h4>
            <p>${projectData.duration}</p>
          </div>
        ` : ''}
        ${featuresSection}
      </div>
    </div>
  `;

  attachTechnologyTagListeners(detailContainer);
  
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded!");
  
  // Initialize particle system
  const particleSystem = new ParticleSystem();
  
  // Initialize scroll reveal
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // Navigation progress marker
  window.addEventListener('scroll', updateNavProgress, { passive: true });
  window.addEventListener('resize', updateNavProgress);
  window.addEventListener('load', updateNavProgress);
  
  // Initialize counter animations
  animateCounters();
  
  // Project cards interaction - initial setup
  attachProjectCardListeners();

  // Skill cards interaction
  const skillCards = document.querySelectorAll(".skill-card");
  const skillKeys = ['frontend', 'backend', 'tools'];
  skillCards.forEach((card, index) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", function () {
      showSkillDetail(skillKeys[index]);
    });
  });

  // Modal close on backdrop click - Project Modal
  const modal = document.getElementById("projectModal");
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeProjectDetail();
    }
  });
  
  // Modal close on backdrop click - Skill Modal
  const skillModal = document.getElementById("skillModal");
  skillModal.addEventListener("click", function (e) {
    if (e.target === skillModal) {
      closeSkillDetail();
    }
  });
  
  // Smooth scroll for navigation
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      
      // Special case for #home - scroll to top
      if (href === '#home') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        setTimeout(updateNavProgress, 120);
        return;
      }
      
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 70; // Account for sticky header
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setTimeout(updateNavProgress, 120);
      }
    });
  });
  
  // Resize particle canvas on window resize
  window.addEventListener('resize', () => {
    particleSystem.resize();
  });
  
  // Initialize dark mode (no UI toggle)
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }
  
  updateNavProgress();
  // Render static project tiles
  updateProjectCards();
});

// Escape key to close modals
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeProjectDetail();
    closeSkillDetail();
  }
});
