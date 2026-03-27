const API_URL = '/api';
let currentProjects = [];
let currentSkills = {};
let currentEditingProject = null;

// Check authentication
const token = localStorage.getItem('adminToken');
if (!token) {
  window.location.href = 'admin-login.html';
}

// Set username
document.getElementById('adminUsername').textContent = localStorage.getItem('adminUsername') || 'Admin';

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUsername');
  window.location.href = 'index.html';
});

// API Helper
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, options);
  
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
    throw new Error('Authentication failed');
  }
  
  return response.json();
}

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

// Tab Navigation
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Show corresponding content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
  });
});

// ===== PROJECTS =====

// Load projects
async function loadProjects() {
  try {
    currentProjects = await apiCall('/projects');
    renderProjects();
  } catch (error) {
    showToast('Fehler beim Laden der Projekte', 'error');
  }
}

// Render projects
function renderProjects() {
  const container = document.getElementById('projectsList');
  
  if (currentProjects.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>Noch keine Projekte vorhanden</p></div>';
    return;
  }
  
  container.innerHTML = currentProjects.map(project => `
    <div class="item-card" data-id="${project.id}">
      <div class="item-header">
        <h3>${project.de?.title || 'Unbenanntes Projekt'}</h3>
        <div class="item-actions">
          <button class="icon-btn" onclick="editProject(${project.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="icon-btn delete" onclick="deleteProject(${project.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <p class="item-desc">${project.de?.shortDesc || ''}</p>
      <div class="item-meta">
        ${project.technologies ? `<span class="meta-tag">${project.technologies.join(', ')}</span>` : ''}
        ${project.de?.duration ? `<span class="meta-tag"><i class="fas fa-clock"></i> ${project.de.duration}</span>` : ''}
      </div>
    </div>
  `).join('');
}

// Add project button
document.getElementById('addProjectBtn').addEventListener('click', () => {
  currentEditingProject = null;
  document.getElementById('projectModalTitle').textContent = 'Neues Projekt';
  document.getElementById('projectForm').reset();
  document.getElementById('projectId').value = '';
  document.getElementById('projectImagePreview').innerHTML = '';
  document.getElementById('projectModal').style.display = 'flex';
});

// Edit project
window.editProject = function(projectId) {
  const project = currentProjects.find(p => p.id === projectId);
  if (!project) return;
  
  currentEditingProject = project;
  document.getElementById('projectModalTitle').textContent = 'Projekt bearbeiten';
  
  // Fill form
  document.getElementById('projectId').value = project.id || '';
  document.getElementById('projectTitleDe').value = project.de?.title || '';
  document.getElementById('projectTitleEn').value = project.en?.title || '';
  document.getElementById('projectShortDescDe').value = project.de?.shortDesc || '';
  document.getElementById('projectShortDescEn').value = project.en?.shortDesc || '';
  document.getElementById('projectFullDescDe').value = project.de?.fullDesc || '';
  document.getElementById('projectFullDescEn').value = project.en?.fullDesc || '';
  document.getElementById('projectDurationDe').value = project.de?.duration || '';
  document.getElementById('projectDurationEn').value = project.en?.duration || '';
  document.getElementById('projectTechnologies').value = project.technologies?.join(', ') || '';
  document.getElementById('projectFeaturesDe').value = project.de?.features?.join(', ') || '';
  document.getElementById('projectFeaturesEn').value = project.en?.features?.join(', ') || '';
  document.getElementById('projectVideoUrl').value = project.videoUrl || '';
  document.getElementById('projectGithubUrl').value = project.githubUrl || '';
  document.getElementById('projectLiveUrl').value = project.liveUrl || '';
  
  // Show image preview if exists
  if (project.imageUrl) {
    document.getElementById('projectImagePreview').innerHTML = `<img src="${project.imageUrl}" alt="Preview">`;
  }
  
  document.getElementById('projectModal').style.display = 'flex';
};

// Delete project
window.deleteProject = async function(projectId) {
  if (!confirm('Projekt wirklich löschen?')) return;
  
  try {
    await apiCall(`/projects/${projectId}`, 'DELETE');
    showToast('Projekt gelöscht');
    loadProjects();
  } catch (error) {
    showToast('Fehler beim Löschen', 'error');
  }
};

// Close project modal
window.closeProjectModal = function() {
  document.getElementById('projectModal').style.display = 'none';
};

// Image upload preview
document.getElementById('projectImageUpload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('projectImagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
  };
  reader.readAsDataURL(file);
});

// Save project
document.getElementById('projectForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    // Handle image upload if present
    let imageUrl = currentEditingProject?.imageUrl || '';
    const imageFile = document.getElementById('projectImageUpload').files[0];
    
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const uploadResponse = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const uploadData = await uploadResponse.json();
      imageUrl = uploadData.url;
    }
    
    // Build project object
    const projectData = {
      id: document.getElementById('projectId').value || undefined,
      imageUrl: imageUrl,
      videoUrl: document.getElementById('projectVideoUrl').value,
      githubUrl: document.getElementById('projectGithubUrl').value,
      liveUrl: document.getElementById('projectLiveUrl').value,
      technologies: document.getElementById('projectTechnologies').value.split(',').map(t => t.trim()).filter(t => t),
      de: {
        title: document.getElementById('projectTitleDe').value,
        shortDesc: document.getElementById('projectShortDescDe').value,
        fullDesc: document.getElementById('projectFullDescDe').value,
        duration: document.getElementById('projectDurationDe').value,
        features: document.getElementById('projectFeaturesDe').value.split(',').map(f => f.trim()).filter(f => f)
      },
      en: {
        title: document.getElementById('projectTitleEn').value,
        shortDesc: document.getElementById('projectShortDescEn').value,
        fullDesc: document.getElementById('projectFullDescEn').value,
        duration: document.getElementById('projectDurationEn').value,
        features: document.getElementById('projectFeaturesEn').value.split(',').map(f => f.trim()).filter(f => f)
      }
    };
    
    await apiCall('/projects', 'POST', projectData);
    showToast('Projekt gespeichert');
    closeProjectModal();
    loadProjects();
  } catch (error) {
    showToast('Fehler beim Speichern', 'error');
  }
});

// ===== SKILLS =====

// Load skills
async function loadSkills() {
  try {
    currentSkills = await apiCall('/skills');
    renderSkills();
  } catch (error) {
    showToast('Fehler beim Laden der Skills', 'error');
  }
}

// Render skills
function renderSkills() {
  ['frontend', 'backend', 'tools'].forEach(category => {
    const container = document.getElementById(`${category}SkillsEditor`);
    const skills = currentSkills[category]?.skills || [];
    
    container.innerHTML = skills.map((skill, index) => `
      <div class="skill-item">
        <input type="text" class="skill-name" value="${skill.name || ''}" placeholder="Skill Name" data-category="${category}" data-index="${index}" data-field="name">
        <input type="text" class="skill-level" value="${skill.level || ''}" placeholder="Level" data-category="${category}" data-index="${index}" data-field="level">
        <button class="icon-btn delete" onclick="removeSkill('${category}', ${index})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  });
}

// Add skill buttons
document.querySelectorAll('.add-skill-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    if (!currentSkills[category]) currentSkills[category] = { skills: [] };
    if (!currentSkills[category].skills) currentSkills[category].skills = [];
    
    currentSkills[category].skills.push({ name: '', level: '' });
    renderSkills();
  });
});

// Remove skill
window.removeSkill = function(category, index) {
  currentSkills[category].skills.splice(index, 1);
  renderSkills();
};

// Update skill on input
document.addEventListener('input', (e) => {
  if (e.target.classList.contains('skill-name') || e.target.classList.contains('skill-level')) {
    const category = e.target.dataset.category;
    const index = parseInt(e.target.dataset.index);
    const field = e.target.dataset.field;
    
    if (currentSkills[category]?.skills?.[index]) {
      currentSkills[category].skills[index][field] = e.target.value;
    }
  }
});

// Save skills
document.getElementById('saveSkillsBtn').addEventListener('click', async () => {
  try {
    await apiCall('/skills', 'POST', currentSkills);
    showToast('Skills gespeichert');
  } catch (error) {
    showToast('Fehler beim Speichern', 'error');
  }
});

// ===== ABOUT =====

// Load about
async function loadAbout() {
  try {
    const about = await apiCall('/about');
    document.getElementById('aboutTextDe').value = about.de?.text || '';
    document.getElementById('aboutHighlightDe').value = about.de?.highlight || '';
    document.getElementById('aboutTextEn').value = about.en?.text || '';
    document.getElementById('aboutHighlightEn').value = about.en?.highlight || '';
  } catch (error) {
    showToast('Fehler beim Laden', 'error');
  }
}

// Save about
document.getElementById('saveAboutBtn').addEventListener('click', async () => {
  try {
    const aboutData = {
      de: {
        text: document.getElementById('aboutTextDe').value,
        highlight: document.getElementById('aboutHighlightDe').value
      },
      en: {
        text: document.getElementById('aboutTextEn').value,
        highlight: document.getElementById('aboutHighlightEn').value
      }
    };
    
    await apiCall('/about', 'POST', aboutData);
    showToast('Über mich gespeichert');
  } catch (error) {
    showToast('Fehler beim Speichern', 'error');
  }
});

// ===== STATS =====

// Load stats
async function loadStats() {
  try {
    const stats = await apiCall('/stats');
    document.getElementById('statsProjects').value = stats.projects || 0;
    document.getElementById('statsTechnologies').value = stats.technologies || 0;
    document.getElementById('statsCommits').value = stats.commits || 0;
  } catch (error) {
    showToast('Fehler beim Laden', 'error');
  }
}

// Save stats
document.getElementById('saveStatsBtn').addEventListener('click', async () => {
  try {
    const statsData = {
      projects: parseInt(document.getElementById('statsProjects').value) || 0,
      technologies: parseInt(document.getElementById('statsTechnologies').value) || 0,
      commits: parseInt(document.getElementById('statsCommits').value) || 0
    };
    
    await apiCall('/stats', 'POST', statsData);
    showToast('Statistiken gespeichert');
  } catch (error) {
    showToast('Fehler beim Speichern', 'error');
  }
});

// ===== CONTACT =====

// Load contact
async function loadContact() {
  try {
    const contact = await apiCall('/contact');
    document.getElementById('contactEmail').value = contact.email || '';
    document.getElementById('contactPhone').value = contact.phone || '';
    document.getElementById('contactName').value = contact.address?.name || '';
    document.getElementById('contactStreet').value = contact.address?.street || '';
    document.getElementById('contactCity').value = contact.address?.city || '';
    document.getElementById('contactGithub').value = contact.social?.github || '';
    document.getElementById('contactLinkedin').value = contact.social?.linkedin || '';
  } catch (error) {
    showToast('Fehler beim Laden', 'error');
  }
}

// Save contact
document.getElementById('saveContactBtn').addEventListener('click', async () => {
  try {
    const contactData = {
      email: document.getElementById('contactEmail').value,
      phone: document.getElementById('contactPhone').value,
      address: {
        name: document.getElementById('contactName').value,
        street: document.getElementById('contactStreet').value,
        city: document.getElementById('contactCity').value
      },
      social: {
        github: document.getElementById('contactGithub').value,
        linkedin: document.getElementById('contactLinkedin').value
      }
    };
    
    await apiCall('/contact', 'POST', contactData);
    showToast('Kontakt gespeichert');
  } catch (error) {
    showToast('Fehler beim Speichern', 'error');
  }
});

// Initialize
loadProjects();
loadSkills();
loadAbout();
loadStats();
loadContact();
