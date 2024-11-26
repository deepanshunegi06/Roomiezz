// Main application logic
document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('mainContent');
  const token = localStorage.getItem('token');
  if (token) {
    auth.token = token;
  }
  
  // Update navigation based on auth status
  function updateNavigation() {
    const navLinks = document.querySelector('.nav-links');
    if (auth.isAuthenticated()) {
      navLinks.innerHTML = `
        <a href="#" id="dashboardLink">Dashboard</a>
        <a href="#" id="searchLink">Search</a>
        <a href="#" class="btn" id="logoutLink">Logout</a>
      `;
      document.getElementById('dashboardLink').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('dashboard');
      });
      document.getElementById('searchLink').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('search');
      });
      document.getElementById('logoutLink').addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
        updateNavigation();
        navigate('home');
      });
    } else {
      navLinks.innerHTML = `
        <a href="#" id="homeLink">Home</a>
        <a href="#" id="loginLink">Login</a>
        <a href="#" id="registerLink" class="btn">Register</a>
      `;
      document.getElementById('homeLink').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('home');
      });
      document.getElementById('loginLink').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('login');
      });
      document.getElementById('registerLink').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('register');
      });
    }
  }

  // Router
  function navigate(page) {
    switch(page) {
      case 'home':
        renderHome();
        break;
      case 'dashboard':
        renderDashboard();
        break;
      case 'search':
        renderSearch();
        break;
      case 'login':
        renderLogin();
        break;
      case 'register':
        renderRegister();
        break;
    }
  }

  // Page Renderers
  function renderHome() {
    mainContent.innerHTML = `
      <div class="neumorphic form-container">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary-color);">
          Welcome to Roomiezz
        </h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">
          Find your perfect roommate near your college! Connect with like-minded students 
          and make your college life more enjoyable.
        </p>
        ${!auth.isAuthenticated() ? `
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button onclick="navigate('login')" class="btn">Login</button>
            <button onclick="navigate('register')" class="btn">Get Started</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderLogin() {
    mainContent.innerHTML = `
      <div class="neumorphic form-container">
        <h2 style="text-align: center; margin-bottom: 2rem; color: var(--primary-color);">Login</h2>
        <form id="loginForm">
          <div class="input-group">
            <label class="input-label" for="email">Email</label>
            <input type="email" id="email" class="input-field" required>
          </div>
          <div class="input-group">
            <label class="input-label" for="password">Password</label>
            <input type="password" id="password" class="input-field" required>
          </div>
          <div style="text-align: center;">
            <button type="submit" class="btn">Login</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      if (await auth.login({ email, password })) {
        updateNavigation();
        navigate('dashboard');
      }
    });
  }

  function renderRegister() {
    mainContent.innerHTML = `
      <div class="neumorphic form-container">
        <h2 style="text-align: center; margin-bottom: 2rem; color: var(--primary-color);">Register</h2>
        <form id="registerForm">
          <div class="input-group">
            <label class="input-label" for="username">Username</label>
            <input type="text" id="username" class="input-field" required>
          </div>
          <div class="input-group">
            <label class="input-label" for="email">Email</label>
            <input type="email" id="email" class="input-field" required>
          </div>
          <div class="input-group">
            <label class="input-label" for="password">Password</label>
            <input type="password" id="password" class="input-field" required>
          </div>
          <div style="text-align: center;">
            <button type="submit" class="btn">Register</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      if (await auth.register({ username, email, password })) {
        updateNavigation();
        navigate('dashboard');
      }
    });
  }

  function renderDashboard() {
    if (!auth.isAuthenticated()) {
      navigate('login');
      return;
    }

    profile.getProfile().then(user => {
      mainContent.innerHTML = `
        <div class="dashboard">
          <div class="sidebar neumorphic">
            <div class="profile-summary">
              <img src="${user.profilePic.startsWith('/uploads/') ? user.profilePic : '/uploads/default.jpg'}" 
                   alt="Profile" 
                   class="profile-pic"
                   onerror="this.src='/uploads/default.jpg'">
              <h3>${user.username}</h3>
              <p>${user.college || 'No college added'}</p>
            </div>
            <nav class="dashboard-nav">
              <button onclick="showDashboardSection('profile')" class="btn">Profile</button>
              <button onclick="showDashboardSection('requests')" class="btn">Friend Requests</button>
              <button onclick="showDashboardSection('friends')" class="btn">Friends</button>
            </nav>
          </div>
          <div class="content neumorphic" id="dashboardContent">
            <!-- Dashboard content will be loaded here -->
          </div>
        </div>
      `;
      showDashboardSection('profile');
    });
  }

  window.showDashboardSection = async function(section) {
    const content = document.getElementById('dashboardContent');
    
    switch(section) {
      case 'profile':
        const user = await profile.getProfile();
        content.innerHTML = `
          <h2 style="margin-bottom: 2rem; color: var(--primary-color);">Edit Profile</h2>
          <form id="profileForm">
            <div class="input-group">
              <label class="input-label" for="username">Username</label>
              <input type="text" name="username" id="username" value="${user.username}" class="input-field">
            </div>
            
            <div class="input-group">
              <label class="input-label" for="college">College</label>
              <input type="text" name="college" id="college" value="${user.college || ''}" class="input-field">
            </div>
            
            <div class="input-group">
              <label class="input-label" for="bio">Bio</label>
              <textarea name="bio" id="bio" class="input-field" style="min-height: 100px;">${user.bio || ''}</textarea>
            </div>
            
            <div class="preferences">
              <h3>Preferences</h3>
              <div class="input-group">
                <label class="input-label" for="budget">Monthly Budget ($)</label>
                <input type="number" name="preferences.budget" id="budget" 
                       value="${user.preferences?.budget || ''}" class="input-field">
              </div>
              
              <div class="input-group">
                <label class="input-label" for="location">Preferred Location</label>
                <input type="text" name="preferences.location" id="location" 
                       value="${user.preferences?.location || ''}" class="input-field">
              </div>
              
              <div class="input-group">
                <label class="input-label" for="gender">Gender Preference</label>
                <select name="preferences.gender" id="gender" class="input-field">
                  <option value="">Select Gender Preference</option>
                  <option value="male" ${user.preferences?.gender === 'male' ? 'selected' : ''}>Male</option>
                  <option value="female" ${user.preferences?.gender === 'female' ? 'selected' : ''}>Female</option>
                  <option value="any" ${user.preferences?.gender === 'any' ? 'selected' : ''}>Any</option>
                </select>
              </div>
            </div>
            
            <div class="input-group">
              <label class="input-label" for="profilePic">Profile Picture</label>
              <input type="file" name="profilePic" id="profilePic" accept="image/*" class="input-field">
            </div>
            
            <div style="text-align: center; margin-top: 1rem;">
              <button type="submit" class="btn">Save Profile</button>
            </div>
          </form>
        `;

        document.getElementById('profileForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          try {
            await profile.updateProfile(formData);
            showDashboardSection('profile');
          } catch (error) {
            console.error('Profile update error:', error);
          }
        });
        break;

      case 'requests':
        try {
          const requests = await friends.getRequests();
          content.innerHTML = `
            <div class="requests-container">
              <div class="received-requests neumorphic">
                <h3 style="margin-bottom: 1.5rem; color: var(--primary-color);">Received Requests</h3>
                <div class="friends-grid">
                  ${requests.received.length ? requests.received.map(user => `
                    <div class="user-card neumorphic">
                      <img src="${user.profilePic.startsWith('/uploads/') ? user.profilePic : '/uploads/default.jpg'}" 
                           alt="${user.username}" 
                           class="profile-pic"
                           onerror="this.src='/uploads/default.jpg'">
                      <h4>${user.username}</h4>
                      <button onclick="friends.acceptRequest('${user._id}')" class="btn">Accept</button>
                    </div>
                  `).join('') : '<p>No received requests</p>'}
                </div>
              </div>
              
              <div class="sent-requests neumorphic">
                <h3 style="margin-bottom: 1.5rem; color: var(--primary-color);">Sent Requests</h3>
                <div class="friends-grid">
                  ${requests.sent.length ? requests.sent.map(user => `
                    <div class="user-card neumorphic">
                      <img src="${user.profilePic.startsWith('/uploads/') ? user.profilePic : '/uploads/default.jpg'}" 
                           alt="${user.username}" 
                           class="profile-pic"
                           onerror="this.src='/uploads/default.jpg'">
                      <h4>${user.username}</h4>
                      <p>Pending</p>
                    </div>
                  `).join('') : '<p>No sent requests</p>'}
                </div>
              </div>
            </div>
          `;
        } catch (error) {
          console.error('Error fetching requests:', error);
          content.innerHTML = '<p>Error loading requests</p>';
        }
        break;

      case 'friends':
        try {
          const userData = await profile.getProfile();
          content.innerHTML = `
            <h3 style="margin-bottom: 1.5rem; color: var(--primary-color);">Friends</h3>
            <div class="friends-grid">
              ${userData.friends.length ? userData.friends.map(friend => `
                <div class="user-card neumorphic">
                  <img src="${friend.profilePic.startsWith('/uploads/') ? friend.profilePic : '/uploads/default.jpg'}" 
                       alt="${friend.username}" 
                       class="profile-pic"
                       onerror="this.src='/uploads/default.jpg'">
                  <h4>${friend.username}</h4>
                </div>
              `).join('') : '<p>No friends yet</p>'}
            </div>
          `;
        } catch (error) {
          console.error('Error fetching friends:', error);
          content.innerHTML = '<p>Error loading friends</p>';
        }
        break;
    }
  };

  function renderSearch() {
    if (!auth.isAuthenticated()) {
      navigate('login');
      return;
    }

    mainContent.innerHTML = `
      <div class="search-container">
        <div class="neumorphic">
          <h2 style="margin-bottom: 1.5rem; color: var(--primary-color);">Find Roommates</h2>
          <form id="searchForm" class="search-form">
            <div class="input-group">
              <label class="input-label" for="college">College</label>
              <input type="text" name="college" id="college" class="input-field" placeholder="Enter college name">
            </div>
            <div class="input-group">
              <label class="input-label" for="location">Location</label>
              <input type="text" name="location" id="location" class="input-field" placeholder="Enter location">
            </div>
            <div class="input-group">
              <label class="input-label" for="budget">Maximum Budget ($)</label>
              <input type="number" name="budget" id="budget" class="input-field" placeholder="Enter maximum budget">
            </div>
            <div class="input-group">
              <button type="submit" class="btn">Search</button>
            </div>
          </form>
        </div>
        <div class="search-results"></div>
      </div>
    `;

    document.getElementById('searchForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const criteria = Object.fromEntries(formData.entries());
      try {
        const results = await search.searchUsers(criteria);
        search.renderSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        document.querySelector('.search-results').innerHTML = 
          '<p class="neumorphic">An error occurred while searching. Please try again.</p>';
      }
    });
  }

  // Make navigate function globally available
  window.navigate = navigate;

  // Initialize
  updateNavigation();
  navigate('home');
});