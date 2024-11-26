const profile = {
  async updateProfile(formData) {
    try {
      const form = new FormData();
      
      // Add basic fields
      form.append('username', formData.get('username'));
      form.append('college', formData.get('college'));
      form.append('bio', formData.get('bio'));
      
      // Add preferences with correct field names
      form.append('preferences.budget', formData.get('preferences.budget'));
      form.append('preferences.location', formData.get('preferences.location'));
      form.append('preferences.gender', formData.get('preferences.gender'));
      
      // Only add profile picture if provided
      const profilePic = formData.get('profilePic');
      if (profilePic && profilePic.size > 0) {
        form.append('profilePic', profilePic);
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        },
        body: form
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const data = await response.json();
      showNotification(data.message, 'success');
      
      // Fetch updated profile to display immediately
      const updatedProfile = await profile.getProfile();
      displayProfile(updatedProfile); // Call a function to update the UI
      
      return data.user;
    } catch (error) {
      console.error('Profile update error:', error);
      showNotification(error.message || 'Failed to update profile', 'error');
      throw error;
    }
  },

  async getProfile(userId = null) {
    try {
      const url = userId ? `/api/users/${userId}` : '/api/users/profile';
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }
};

// Notification function
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000); // Dismiss after 3 seconds
}

// Example UI update function// Update the profile and refresh the UI
async function updateProfile(formData) {
  try {
    const updatedProfile = await profile.updateProfile(formData);
    
    // Update the profile UI immediately after updating
    displayProfile(updatedProfile);

    // Optionally, you can call `profile.getProfile()` here if needed to fetch the updated profile from the server
  } catch (error) {
    console.error('Profile update error:', error);
    showNotification(error.message || 'Failed to update profile', 'error');
  }
}

// Function to display updated profile details
function displayProfile(profileData) {
  // Update profile elements in the UI
  document.getElementById('username').textContent = profileData.username;
  document.getElementById('college').textContent = profileData.college;
  document.getElementById('bio').textContent = profileData.bio;

  // Update profile picture with new data
  if (profileData.profilePicURL) {
    const profilePic = document.getElementById('profilePic');
    profilePic.src = `${profileData.profilePicURL}?t=${new Date().getTime()}`; // Cache busting
  }
}
