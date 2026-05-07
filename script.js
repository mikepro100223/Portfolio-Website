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
  return skillDetails?.[category]?.[currentLang]?.skills || [];
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

const translations = {
  de: {
    title: "Mein Portfolio",
    header: "Yucan You",
    home: "Startseite",
    about: "Über mich",
    skills: "Skills",
    projects: "Projekte",
    contact: "Kontakt",
    heroTitle: "Willkommen zu meinem Portfolio",
    heroSubtitle: "Willkommen auf meiner Portfolio-Website.",
    ctaPrimary: "Projekte ansehen",
    ctaSecondary: "Kontakt aufnehmen",
    //aboutText: "Erzähle deine Geschichte hier.",
    aboutHighlight: "Ich bin ein leidenschaftlicher Entwickler mit einer Vorliebe für schönes Design und sauberen Code.",
    projectsText: "Präsentiere deine Projekte hier.",
    contactText: "Nimm Kontakt mit mir auf.",
    footer: "© 2026 Yucan You",
    project1Title: "Portfolio Website",
    project1Desc: "Eine moderne, interaktive Portfolio-Website mit Animationen",
    project2Title: "Projekt 2",
    project2Desc: "Beschreibung deines Projekts hier...",
    project3Title: "Projekt 3",
    project3Desc: "Beschreibung deines Projekts hier...",
    project4Title: "Projekt 4",
    project4Desc: "Beschreibung deines Projekts hier...",
    learnMore: "Mehr erfahren",
    emailLabel: "Email",
    phoneLabel: "Telefon",
    addressLabel: "Adresse",
    socialLabel: "Social Media",
    technologies: "Technologien",
    duration: "Dauer",
    backButton: "← Zurück",
    langBtn: "🇬🇧 EN",
    skillsFrontend: "Frontend",
    skillsBackend: "Backend",
    skillsTools: "Tools",
    statProjects: "Projekte",
    statTechnologies: "Technologien",
    statCommits: "Commits",
  },
  en: {
    title: "My Portfolio",
    header: "Yucan You",
    home: "Home",
    about: "About",
    skills: "Skills",
    projects: "Projects",
    contact: "Contact",
    heroTitle: "Welcome to My Portfolio",
    heroSubtitle: "Welcome to my portfolio website.",
    ctaPrimary: "View Projects",
    ctaSecondary: "Get in Touch",
    aboutText: "Tell your story here.",
    aboutHighlight: "I am a passionate developer with a love for beautiful design and clean code.",
    projectsText: "Showcase your projects here.",
    contactText: "Get in touch with me.",
    footer: "© 2026 Yucan You",
    project1Title: "Portfolio Website",
    project1Desc: "A modern, interactive portfolio website with animations",
    project2Title: "Project 2",
    project2Desc: "Description of your project here...",
    project3Title: "Project 3",
    project3Desc: "Description of your project here...",
    project4Title: "Project 4",
    project4Desc: "Description of your project here...",
    learnMore: "Learn More",
    emailLabel: "Email",
    phoneLabel: "Phone",
    addressLabel: "Address",
    socialLabel: "Social Media",
    technologies: "Technologies",
    duration: "Duration",
    backButton: "← Back",
    langBtn: "🇩🇪 DE",
    skillsFrontend: "Frontend",
    skillsBackend: "Backend",
    skillsTools: "Tools",
    statProjects: "Projects",
    statTechnologies: "Technologies",
    statCommits: "Commits",
  },
};

const projectDetails = {
  1: {
    de: {
      title: "Portfolio Website - Test Projekt",
      shortDesc: "Eine moderne, interaktive Portfolio-Website mit Animationen",
      fullDesc:
        "Dies ist ein Test-Projekt, das zeigt, wie ein vollständiges Projekt dargestellt werden kann. Diese Website wurde mit modernen Webtechnologien entwickelt und verfügt über Particle-Animationen, Dark Mode, mehrsprachige Unterstützung und glassmorphische Design-Elemente. Das Projekt demonstriert fortgeschrittene CSS-Techniken, JavaScript-Animationen und responsive Design-Prinzipien.",
      technologies: ["HTML5", "CSS3", "JavaScript", "Canvas API"],
      duration: "2 Wochen",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      features: ["🎨 Glassmorphism Design", "✨ Particle Animationen", "🌓 Dark/Light Mode", "🌍 DE/EN Sprachen", "📱 Responsive Design"],
      githubUrl: "#",
      liveUrl: "#"
    },
    en: {
      title: "Portfolio Website - Test Project",
      shortDesc: "A modern, interactive portfolio website with animations",
      fullDesc:
        "This is a test project demonstrating how a complete project can be presented. This website was built with modern web technologies and features particle animations, dark mode, multilingual support, and glassmorphic design elements. The project demonstrates advanced CSS techniques, JavaScript animations, and responsive design principles.",
      technologies: ["HTML5", "CSS3", "JavaScript", "Canvas API"],
      duration: "2 weeks",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      features: ["🎨 Glassmorphism Design", "✨ Particle Animations", "🌓 Dark/Light Mode", "🌍 DE/EN Languages", "📱 Responsive Design"],
      githubUrl: "#",
      liveUrl: "#"
    },
  },
  2: {
    de: {
      title: "Projekt 2",
      shortDesc: "Beschreibung deines Projekts hier...",
      fullDesc:
        "Dies ist die ausführliche Beschreibung deines zweiten Projekts. Teile deine Erfolge und was du gelernt hast.",
      technologies: ["React", "Node.js", "MongoDB"],
      duration: "4 Monate",
      image: "⚙️",
    },
    en: {
      title: "Project 2",
      shortDesc: "Description of your project here...",
      fullDesc:
        "This is the detailed description of your second project. Share your achievements and what you learned.",
      technologies: ["React", "Node.js", "MongoDB"],
      duration: "4 months",
      image: "⚙️",
    },
  },
  3: {
    de: {
      title: "Projekt 3",
      shortDesc: "Beschreibung deines Projekts hier...",
      fullDesc:
        "Dies ist die ausführliche Beschreibung deines dritten Projekts. Beschreibe die Ziele und das Endergebnis.",
      technologies: ["Python", "Flask", "SQL"],
      duration: "2 Monate",
      image: "🐍",
    },
    en: {
      title: "Project 3",
      shortDesc: "Description of your project here...",
      fullDesc:
        "This is the detailed description of your third project. Describe the goals and final result.",
      technologies: ["Python", "Flask", "SQL"],
      duration: "2 months",
      image: "🐍",
    },
  },
  4: {
    de: {
      title: "Projekt 4",
      shortDesc: "Beschreibung deines Projekts hier...",
      fullDesc:
        "Dies ist die ausführliche Beschreibung deines vierten Projekts. Erkläre die innovativen Aspekte.",
      technologies: ["Vue.js", "Firebase", "Figma"],
      duration: "5 Monate",
      image: "✨",
    },
    en: {
      title: "Project 4",
      shortDesc: "Description of your project here...",
      fullDesc:
        "This is the detailed description of your fourth project. Explain the innovative aspects.",
      technologies: ["Vue.js", "Firebase", "Figma"],
      duration: "5 months",
      image: "✨",
    },
  },
};

let currentLang = "de";
let isDarkMode = true; // Always dark mode
let currentProject = null;
let currentSkill = null;

const skillDetails = {
  frontend: {
    de: {
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
    en: {
      title: "Frontend Development",
      icon: "🎨",
      description: "Frontend development encompasses creating the visual and interactive parts of a website that users directly see and interact with. It's about design, user experience, and technical implementation in the browser.",
      skills: [
        {
          name: "HTML",
          level: "Advanced",
          description: "HTML (HyperText Markup Language) is the basic structure of every webpage. It defines the content and hierarchy of elements like headings, paragraphs, images, and links.",
          experience: "3+ years"
        },
        {
          name: "CSS",
          level: "Advanced",
          description: "CSS (Cascading Style Sheets) is responsible for visual styling. I use it to create layouts, colors, animations, and responsive designs that work on all devices.",
          experience: "3+ years"
        },
        {
          name: "JavaScript",
          level: "Advanced",
          description: "JavaScript makes websites interactive. From simple click events to complex animations and API calls - JavaScript brings websites to life.",
          experience: "2+ years"
        },
        {
          name: "React",
          level: "Intermediate",
          description: "React is a modern JavaScript library for building interactive user interfaces. With reusable components, complex applications can be developed efficiently.",
          experience: "1+ year"
        }
      ]
    }
  },
  backend: {
    de: {
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
          level: "Mittel",
          description: "Python ist eine vielseitige Programmiersprache, die ich für Backend-Entwicklung, Datenanalyse und Automatisierung einsetze. Sie ist bekannt für ihre Lesbarkeit und Effizienz.",
          experience: "1+ Jahre"
        },
        {
          name: "SQL",
          level: "Mittel",
          description: "SQL (Structured Query Language) ist die Sprache für relationale Datenbanken. Damit kann ich Daten effizient abfragen, speichern und verwalten.",
          experience: "2+ Jahre"
        },
        {
          name: "MongoDB",
          level: "Grundlagen",
          description: "MongoDB ist eine NoSQL-Datenbank, die Daten in flexiblen JSON-ähnlichen Dokumenten speichert. Ideal für moderne, skalierbare Anwendungen.",
          experience: "<1 Jahr"
        }
        ,
        {
          name: "C#",
          level: "Mittel",
          description: "C# ist eine leistungsfähige, statisch typisierte Sprache für Anwendungen unter .NET — ideal für Backend, APIs und Desktop-Anwendungen.",
          experience: "2+ Jahre"
        },
        {
          name: ".NET",
          level: "Mittel",
          description: ".NET ist die Laufzeitplattform für C#-Anwendungen; verwendet für serverseitige Dienste, APIs und Cross-Platform-Apps.",
          experience: "1+ Jahre"
        }
      ]
    },
    en: {
      title: "Backend Development",
      icon: "⚙️",
      description: "Backend development refers to server-side logic, databases, and APIs that run in the background. This is where data is processed, stored, and provided to the frontend.",
      skills: [
        {
          name: "Node.js",
          level: "Advanced",
          description: "Node.js enables running JavaScript on the server. I use it to develop server-side applications, REST APIs, and real-time services.",
          experience: "2+ years"
        },
        {
          name: "Python",
          level: "Intermediate",
          description: "Python is a versatile programming language that I use for backend development, data analysis, and automation. It's known for its readability and efficiency.",
          experience: "2+ years"
        },
        {
          name: "SQL",
          level: "Intermediate",
          description: "SQL (Structured Query Language) is the language for relational databases. I use it to efficiently query, store, and manage data.",
          experience: "1+ year"
        },
        {
          name: "MongoDB",
          level: "Beginner",
          description: "MongoDB is a NoSQL database that stores data in flexible JSON-like documents. Ideal for modern, scalable applications.",
          experience: "1 year"
        }
        ,
        {
          name: "C#",
          level: "Intermediate",
          description: "C# is a powerful, statically typed language used with .NET for backend, APIs and desktop applications.",
          experience: "1+ year"
        },
        {
          name: ".NET",
          level: "Intermediate",
          description: ".NET is the runtime/platform for C# applications; used for server-side services, APIs and cross-platform apps.",
          experience: "1+ year"
        }
      ]
    }
  },
  tools: {
    de: {
      title: "Tools & Workflow",
      icon: "🛠️",
      description: "Professionelle Entwicklung erfordert den Einsatz der richtigen Tools. Von Versionskontrolle über Code-Editoren bis zu Design-Tools - diese Werkzeuge steigern die Produktivität und Qualität.",
      skills: [
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
          level: "Grundlagen",
          description: "Docker ermöglicht die Containerisierung von Anwendungen. Das sorgt für konsistente Entwicklungs- und Produktionsumgebungen.",
          experience: "1+ Jahr"
        }
        ,
        {
          name: "Powershell",
          level: "Mittel",
          description: "Powershell nutze ich für Automatisierung, DevOps-Skripte und Systemadministration unter Windows und cross-platform mit PowerShell Core.",
          experience: "2+ Jahre"
        }
      ]
    },
    en: {
      title: "Tools & Workflow",
      icon: "🛠️",
      description: "Professional development requires using the right tools. From version control to code editors and design tools - these tools increase productivity and quality.",
      skills: [
        {
          name: "Git",
          level: "Advanced",
          description: "Git is a version control system that enables team collaboration and makes code history traceable. Essential for modern software development.",
          experience: "3+ years"
        },
        {
          name: "VS Code",
          level: "Advanced",
          description: "Visual Studio Code is my main code editor. With extensions, shortcuts, and integrated tools, it significantly accelerates development.",
          experience: "3+ years"
        },
        {
          name: "Figma",
          level: "Intermediate",
          description: "Figma is a collaborative design tool for UI/UX design. I use it to create prototypes and work closely with designers.",
          experience: "1+ year"
        },
        {
          name: "Docker",
          level: "Beginner",
          description: "Docker enables containerization of applications. This ensures consistent development and production environments.",
          experience: "1 year"
        }
        ,
        {
          name: "Powershell",
          level: "Intermediate",
          description: "I use PowerShell for automation, DevOps scripts and system administration on Windows and cross-platform with PowerShell Core.",
          experience: "1+ year"
        }
      ]
    }
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


function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.title = translations[lang].title;
  
  // Header
  const headerH1 = document.querySelector(".gradient-text");
  if (headerH1) headerH1.textContent = translations[lang].header;
  
  // Update language button
  
  // Navigation
  const navLinks = document.querySelectorAll("nav a");
  if (navLinks[0]) navLinks[0].textContent = translations[lang].home;
  if (navLinks[1]) navLinks[1].textContent = translations[lang].about;
  if (navLinks[2]) navLinks[2].textContent = translations[lang].skills;
  if (navLinks[3]) navLinks[3].textContent = translations[lang].projects;
  if (navLinks[4]) navLinks[4].textContent = translations[lang].contact;
  
  // Hero Section
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) heroTitle.textContent = translations[lang].heroTitle;
  
  const heroSubtitle = document.querySelector(".hero-subtitle");
  if (heroSubtitle) heroSubtitle.textContent = translations[lang].heroSubtitle;
  
  const ctaButtons = document.querySelectorAll(".cta-button");
  if (ctaButtons[0]) ctaButtons[0].textContent = translations[lang].ctaPrimary;
  if (ctaButtons[1]) ctaButtons[1].textContent = translations[lang].ctaSecondary;
  
  // About Section
  const aboutText = document.querySelector("#about .about-text p:first-child");
  if (aboutText) aboutText.textContent = translations[lang].aboutText;
  
  const highlightText = document.querySelector(".highlight-text");
  if (highlightText) highlightText.textContent = translations[lang].aboutHighlight;
  
  const statLabels = document.querySelectorAll(".stat-label");
  if (statLabels[0]) statLabels[0].textContent = translations[lang].statProjects;
  if (statLabels[1]) statLabels[1].textContent = translations[lang].statTechnologies;
  if (statLabels[2]) statLabels[2].textContent = translations[lang].statCommits;
  
  // Skills Section
  const skillCards = document.querySelectorAll(".skill-card h3");
  if (skillCards[0]) skillCards[0].textContent = translations[lang].skillsFrontend;
  if (skillCards[1]) skillCards[1].textContent = translations[lang].skillsBackend;
  if (skillCards[2]) skillCards[2].textContent = translations[lang].skillsTools;
  
  // Section Headers
  const sectionHeaders = document.querySelectorAll(".section-header h2");
  if (sectionHeaders[0]) sectionHeaders[0].textContent = translations[lang].about;
  if (sectionHeaders[1]) sectionHeaders[1].textContent = translations[lang].skills;
  if (sectionHeaders[2]) sectionHeaders[2].textContent = translations[lang].projects;
  if (sectionHeaders[3]) sectionHeaders[3].textContent = translations[lang].contact;
  
  // Contact Section
  const contactIntro = document.querySelector(".contact-intro");
  if (contactIntro) contactIntro.textContent = translations[lang].contactText;
  
  const contactHeaders = document.querySelectorAll(".contact-item h3");
  if (contactHeaders[0]) contactHeaders[0].textContent = translations[lang].emailLabel;
  if (contactHeaders[1]) contactHeaders[1].textContent = translations[lang].phoneLabel;
  if (contactHeaders[2]) contactHeaders[2].textContent = translations[lang].addressLabel;
  
  // Footer
  const footer = document.querySelector("footer p");
  if (footer) footer.textContent = translations[lang].footer;
  
  // Projects
  const projectCards = document.querySelectorAll(".project-card");
  
  if (projectCards[0]) {
    const card0Title = projectCards[0].querySelector("h3");
    const card0Desc = projectCards[0].querySelector("p");
    const card0Link = projectCards[0].querySelector(".project-link");
    if (card0Title) card0Title.textContent = translations[lang].project1Title;
    if (card0Desc) card0Desc.textContent = translations[lang].project1Desc;
    if (card0Link) card0Link.innerHTML = `${translations[lang].learnMore} <span class="arrow">→</span>`;
  }
  
  if (projectCards[1]) {
    const card1Title = projectCards[1].querySelector("h3");
    const card1Desc = projectCards[1].querySelector("p");
    const card1Link = projectCards[1].querySelector(".project-link");
    if (card1Title) card1Title.textContent = translations[lang].project2Title;
    if (card1Desc) card1Desc.textContent = translations[lang].project2Desc;
    if (card1Link) card1Link.innerHTML = `${translations[lang].learnMore} <span class="arrow">→</span>`;
  }
  
  if (projectCards[2]) {
    const card2Title = projectCards[2].querySelector("h3");
    const card2Desc = projectCards[2].querySelector("p");
    const card2Link = projectCards[2].querySelector(".project-link");
    if (card2Title) card2Title.textContent = translations[lang].project3Title;
    if (card2Desc) card2Desc.textContent = translations[lang].project3Desc;
    if (card2Link) card2Link.innerHTML = `${translations[lang].learnMore} <span class="arrow">→</span>`;
  }
  
  if (projectCards[3]) {
    const card3Title = projectCards[3].querySelector("h3");
    const card3Desc = projectCards[3].querySelector("p");
    const card3Link = projectCards[3].querySelector(".project-link");
    if (card3Title) card3Title.textContent = translations[lang].project4Title;
    if (card3Desc) card3Desc.textContent = translations[lang].project4Desc;
    if (card3Link) card3Link.innerHTML = `${translations[lang].learnMore} <span class="arrow">→</span>`;
  }
  
  if (currentProject) {
    showProjectDetail(currentProject);
  }

  // Recalculate nav marker after label widths change.
  requestAnimationFrame(updateNavProgress);
}

function showProjectDetail(projectId) {
  currentProject = projectId;
  const project = projectDetails[projectId][currentLang];
  const modal = document.getElementById("projectModal");
  const detailContainer = document.getElementById("projectDetail");

  // Build video section if videoUrl exists
  const videoSection = project.videoUrl ? `
    <div class="project-video">
      <iframe 
        src="${project.videoUrl}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
  ` : (project.image ? `<div class="project-image">${project.image}</div>` : '');

  // Build features section if features exist
  const featuresSection = project.features ? `
    <div class="meta-item">
      <h4>${currentLang === 'de' ? 'Features' : 'Features'}</h4>
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
        <i class="fas fa-external-link-alt"></i> ${currentLang === 'de' ? 'Live Demo' : 'Live Demo'}
      </a>` : ''}
    </div>
  ` : '';

  const technologyTags = renderProjectTechnologyTags(project.technologies || []);

  detailContainer.innerHTML = `
    <div class="project-detail-header">
      <button class="back-button" onclick="closeProjectDetail()">${
        translations[currentLang].backButton
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
          <h4>${translations[currentLang].technologies}</h4>
          <div class="tech-tags">
            ${technologyTags}
          </div>
        </div>
        ` : ''}
        <div class="meta-item">
          <h4>${translations[currentLang].duration}</h4>
          <p>${project.duration}</p>
        </div>
        ${featuresSection}
      </div>
    </div>
  `;

  attachTechnologyTagListeners(detailContainer);

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeProjectDetail() {
  currentProject = null;
  const modal = document.getElementById("projectModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

function showSkillDetail(skillKey) {
  currentSkill = skillKey;
  const skill = skillDetails[skillKey][currentLang];
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
        translations[currentLang].backButton
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
}

function closeSkillDetail() {
  currentSkill = null;
  const modal = document.getElementById("skillModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

function updateProjectCards() {
  const projectsGrid = document.querySelector('.projects-grid');
  if (!projectsGrid) return;

  // Render static projects from `projectDetails` (1-based ids)
  const ids = Object.keys(projectDetails).sort((a,b) => Number(a) - Number(b));

  projectsGrid.innerHTML = ids.map(id => {
    const proj = projectDetails[id][currentLang] || projectDetails[id].de || {};
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
  
  const lang = currentLang;
  const projectData = project[lang] || project.de || {};
  const modal = document.getElementById("projectModal");
  const detailContainer = document.getElementById("projectDetail");
  
  const videoSection = project.videoUrl ? `
    <div class="project-video">
      <iframe src="${project.videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
      <button class="back-button" onclick="closeProjectDetail()">${translations[lang].backButton}</button>
      <h2>${projectData.title}</h2>
    </div>
    <div class="project-detail-content">
      ${videoSection}
      <p class="project-full-desc">${projectData.fullDesc || ''}</p>
      ${actionButtons}
      <div class="project-meta">
        ${technologyTags ? `
          <div class="meta-item">
            <h4>${translations[lang].technologies}</h4>
            <div class="tech-tags">
              ${technologyTags}
            </div>
          </div>
        ` : ''}
        ${projectData.duration ? `
          <div class="meta-item">
            <h4>${translations[lang].duration}</h4>
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
  
  // Initialize language (default)
  setLanguage(currentLang);
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
