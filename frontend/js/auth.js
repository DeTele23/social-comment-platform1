document.addEventListener('DOMContentLoaded', () => {
    // Initialize auth state
    initializeAuth();
    
    // Register form event listener
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Login form event listener
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Update password form event listener
    const updatePasswordForm = document.getElementById('update-password-form');
    if (updatePasswordForm) {
        updatePasswordForm.addEventListener('submit', handleUpdatePassword);
    }
    
    // Logout link event listener
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
});

// Check if user is logged in and update UI
async function initializeAuth() {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const commentForm = document.getElementById('comment-form');
    const loginPrompt = document.getElementById('login-prompt');
    
    // Update navigation based on auth state
    if (token) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline-block';
        if (commentForm) commentForm.style.display = 'block';
        if (loginPrompt) loginPrompt.style.display = 'none';
        
        // Get user info if on dashboard
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            try {
                const userData = await authAPI.getCurrentUser();
                usernameDisplay.textContent = userData.username;
                
                // Load user's comments if on dashboard
                const myCommentsContainer = document.getElementById('my-comments-container');
                if (myCommentsContainer) {
                    loadUserComments();
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle invalid token
                if (error.message.includes('Authentication required')) {
                    logout();
                }
            }
        }
    } else {
        if (loginLink) loginLink.style.display = 'inline-block';
        if (registerLink) registerLink.style.display = 'inline-block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (commentForm) commentForm.style.display = 'none';
        if (loginPrompt) loginPrompt.style.display = 'block';
        
        // Redirect to login if on protected page
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }
    }
}

// Handle registration form submission
async function handleRegister(event) {
    event.preventDefault();
    const messageElement = document.getElementById('register-message');
    
    // Clear previous messages
    messageElement.textContent = '';
    messageElement.className = '';
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Client-side validation
    if (password !== confirmPassword) {
        messageElement.textContent = 'Passwords do not match';
        messageElement.className = 'error-message';
        return;
    }
    
    try {
        const response = await authAPI.register({ username, email, password });
        messageElement.textContent = 'Registration successful! Redirecting to login...';
        messageElement.className = 'success-message';
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    } catch (error) {
        messageElement.textContent = error.message || 'Registration failed';
        messageElement.className = 'error-message';
    }
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    const messageElement = document.getElementById('login-message');
    
    // Clear previous messages
    messageElement.textContent = '';
    messageElement.className = '';
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await authAPI.login({ username, password });
        
        // Store token
        localStorage.setItem('token', response.token);
        
        messageElement.textContent = 'Login successful! Redirecting...';
        messageElement.className = 'success-message';
        
        // Redirect to home page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        messageElement.textContent = error.message || 'Login failed';
        messageElement.className = 'error-message';
    }
}

// Handle password update form submission
async function handleUpdatePassword(event) {
    event.preventDefault();
    const messageElement = document.getElementById('password-update-message');
    
    // Clear previous messages
    messageElement.textContent = '';
    messageElement.className = '';
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    
    // Client-side validation
    if (newPassword !== confirmNewPassword) {
        messageElement.textContent = 'New passwords do not match';
        messageElement.className = 'error-message';
        return;
    }
    
    try {
        await authAPI.updatePassword({ currentPassword, newPassword });
        
        messageElement.textContent = 'Password updated successfully!';
        messageElement.className = 'success-message';
        
        // Clear form
        document.getElementById('update-password-form').reset();
    } catch (error) {
        messageElement.textContent = error.message || 'Failed to update password';
        messageElement.className = 'error-message';
    }
}

// Handle logout
async function handleLogout(event) {
    event.preventDefault();
    
    try {
        await authAPI.logout();
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear local storage and redirect
        logout();
    }
}

// Helper function to handle logout actions
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}