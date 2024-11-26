// Friends management
const friends = {
  async sendRequest(userId) {
    try {
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ userId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }
      
      showNotification(data.message, 'success');
      return data;
    } catch (error) {
      console.error('Friend request error:', error);
      showNotification(error.message, 'error');
      throw error;
    }
  },

  async getRequests() {
    try {
      const response = await fetch('/api/friends/requests', {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch friend requests');
      return await response.json();
    } catch (error) {
      console.error('Get requests error:', error);
      throw error;
    }
  },

  async acceptRequest(userId) {
    try {
      const response = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ userId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }
      
      showNotification(data.message, 'success');
      // Refresh the requests section to show updated state
      window.showDashboardSection('requests');
      return data;
    } catch (error) {
      console.error('Accept request error:', error);
      showNotification(error.message, 'error');
      throw error;
    }
  },

  async removeFriend(userId) {
    try {
      const response = await fetch('/api/friends/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ userId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }
      
      showNotification(data.message, 'success');
      // Refresh the friends section to show updated state
      window.showDashboardSection('friends');
      return data;
    } catch (error) {
      console.error('Remove friend error:', error);
      showNotification(error.message, 'error');
      throw error;
    }
  }
};