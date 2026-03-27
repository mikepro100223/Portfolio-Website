const API_URL = 'http://localhost:3000/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('errorMessage');
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  errorDiv.style.display = 'none';
  
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store token
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUsername', data.username);
      
      // Redirect to dashboard
      window.location.href = 'admin-dashboard.html';
    } else {
      throw new Error(data.error || 'Login failed');
    }
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
  }
});

// Check if already logged in
if (localStorage.getItem('adminToken')) {
  fetch(`${API_URL}/verify`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.valid) {
      window.location.href = 'admin-dashboard.html';
    }
  })
  .catch(() => {
    // Token invalid, stay on login page
    localStorage.removeItem('adminToken');
  });
}
