// API base URL - change this to your backend URL when deployed
const API_URL = 'http://localhost:5000/api';

// Helper function for making API calls
async function apiCall(endpoint, method = 'GET', data = null, includeToken = false) {
    const url = `${API_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json'
    };
    
    // Add authorization token if required
    if (includeToken) {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers,
        credentials: 'include'
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        
        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return { success: true };
        }
        
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.message || 'Something went wrong');
        }
        
        return responseData;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Auth API functions
const authAPI = {
    register: (userData) => apiCall('/auth/register', 'POST', userData),
    login: (credentials) => apiCall('/auth/login', 'POST', credentials),
    logout: () => apiCall('/auth/logout', 'POST', null, true),
    getCurrentUser: () => apiCall('/auth/user', 'GET', null, true),
    updatePassword: (passwordData) => apiCall('/auth/password', 'PUT', passwordData, true)
};

// Comments API functions
const commentsAPI = {
    getAllComments: () => apiCall('/comments'),
    getUserComments: () => apiCall('/comments/user', 'GET', null, true),
    createComment: (commentData) => apiCall('/comments', 'POST', commentData, true),
    updateComment: (commentId, commentData) => apiCall(`/comments/${commentId}`, 'PUT', commentData, true),
    deleteComment: (commentId) => apiCall(`/comments/${commentId}`, 'DELETE', null, true),
    addReply: (commentId, replyData) => apiCall(`/comments/${commentId}/replies`, 'POST', replyData, true),
    deleteReply: (commentId, replyId) => apiCall(`/comments/${commentId}/replies/${replyId}`, 'DELETE', null, true)
};