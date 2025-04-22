document.addEventListener('DOMContentLoaded', () => {
    // Load comments on the home page
    const commentsContainer = document.getElementById('comments-container');
    if (commentsContainer) {
        loadAllComments();
    }
    
    // Load user comments on the dashboard page
    const myCommentsContainer = document.getElementById('my-comments-container');
    if (myCommentsContainer) {
        loadUserComments();
    }
    
    // Comment form event listener
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCreateComment);
    }
});

// Load all comments for the home page
async function loadAllComments() {
    const commentsContainer = document.getElementById('comments-container');
    
    try {
        const comments = await commentsAPI.getAllComments();
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
            return;
        }
        
        commentsContainer.innerHTML = '';
        comments.forEach(comment => {
            commentsContainer.appendChild(createCommentElement(comment));
        });
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsContainer.innerHTML = '<p class="error">Failed to load comments. Please try again later.</p>';
    }
}

// Load user's comments for the dashboard
async function loadUserComments() {
    const myCommentsContainer = document.getElementById('my-comments-container');
    
    try {
        const comments = await commentsAPI.getUserComments();
        
        if (comments.length === 0) {
            myCommentsContainer.innerHTML = '<p class="no-comments">You haven\'t posted any comments yet.</p>';
            return;
        }
        
        myCommentsContainer.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = createCommentElement(comment, true);
            myCommentsContainer.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Error loading user comments:', error);
        myCommentsContainer.innerHTML = '<p class="error">Failed to load your comments. Please try again later.</p>';
    }
}

// Create a comment element
function createCommentElement(comment, isUserComment = false) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.dataset.id = comment.id;
    
    const commentHeader = document.createElement('div');
    commentHeader.className = 'comment-header';
    
    const author = document.createElement('span');
    author.className = 'comment-author';
    author.textContent = comment.author || 'Anonymous';
    
    const date = document.createElement('span');
    date.className = 'comment-date';
    date.textContent = new Date(comment.createdAt).toLocaleString();
    
    commentHeader.appendChild(author);
    commentHeader.appendChild(date);
    
    const commentContent = document.createElement('div');
    commentContent.className = 'comment-content';
    commentContent.textContent = comment.content;
    
    commentDiv.appendChild(commentHeader);
    commentDiv.appendChild(commentContent);
    
    // Add edit and delete buttons for user's own comments
    if (isUserComment) {
        const commentActions = document.createElement('div');
        commentActions.className = 'comment-actions';
        
        const editButton = document.createElement('button');
        editButton.className = 'edit-comment-btn';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => handleEditComment(comment.id));
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-comment-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => handleDeleteComment(comment.id));
        
        commentActions.appendChild(editButton);
        commentActions.appendChild(deleteButton);
        commentDiv.appendChild(commentActions);
    }
    
    return commentDiv;
}

// Handle creating a new comment
async function handleCreateComment(event) {
    event.preventDefault();
    
    const contentInput = document.getElementById('comment-content');
    const content = contentInput.value.trim();
    
    if (!content) {
        showNotification('Please enter a comment before submitting.', 'error');
        return;
    }
    
    try {
        const newComment = await commentsAPI.createComment({ content });
        
        // Clear the form
        contentInput.value = '';
        
        // If we're on the home page, add the comment to the list
        const commentsContainer = document.getElementById('comments-container');
        if (commentsContainer) {
            // Remove "no comments" message if it exists
            const noCommentsMsg = commentsContainer.querySelector('.no-comments');
            if (noCommentsMsg) {
                commentsContainer.innerHTML = '';
            }
            
            // Add the new comment to the top
            const commentElement = createCommentElement(newComment);
            commentsContainer.insertBefore(commentElement, commentsContainer.firstChild);
        }
        
        showNotification('Comment posted successfully!', 'success');
    } catch (error) {
        console.error('Error posting comment:', error);
        showNotification('Failed to post comment. Please try again later.', 'error');
    }
}

// Handle editing a comment
async function handleEditComment(commentId) {
    const commentDiv = document.querySelector(`.comment[data-id="${commentId}"]`);
    const commentContent = commentDiv.querySelector('.comment-content');
    const currentContent = commentContent.textContent;
    
    // Transform content into editable textarea
    commentContent.innerHTML = '';
    const textarea = document.createElement('textarea');
    textarea.className = 'edit-comment-textarea';
    textarea.value = currentContent;
    commentContent.appendChild(textarea);
    
    // Replace edit button with save button
    const actionDiv = commentDiv.querySelector('.comment-actions');
    const oldButtons = actionDiv.innerHTML;
    
    const saveButton = document.createElement('button');
    saveButton.className = 'save-comment-btn';
    saveButton.textContent = 'Save';
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-edit-btn';
    cancelButton.textContent = 'Cancel';
    
    actionDiv.innerHTML = '';
    actionDiv.appendChild(saveButton);
    actionDiv.appendChild(cancelButton);
    
    // Focus the textarea
    textarea.focus();
    
    // Save button handler
    saveButton.addEventListener('click', async () => {
        const newContent = textarea.value.trim();
        
        if (!newContent) {
            showNotification('Comment cannot be empty.', 'error');
            return;
        }
        
        try {
            await commentsAPI.updateComment(commentId, { content: newContent });
            
            // Restore comment content with updated text
            commentContent.innerHTML = '';
            commentContent.textContent = newContent;
            
            // Restore original buttons
            actionDiv.innerHTML = oldButtons;
            
            showNotification('Comment updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating comment:', error);
            showNotification('Failed to update comment. Please try again later.', 'error');
        }
    });
    
    // Cancel button handler
    cancelButton.addEventListener('click', () => {
        // Restore original content
        commentContent.innerHTML = '';
        commentContent.textContent = currentContent;
        
        // Restore original buttons
        actionDiv.innerHTML = oldButtons;
    });
}

// Handle deleting a comment
async function handleDeleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
        return;
    }
    
    try {
        await commentsAPI.deleteComment(commentId);
        
        // Remove the comment from the UI
        const commentDiv = document.querySelector(`.comment[data-id="${commentId}"]`);
        commentDiv.remove();
        
        // Check if there are no more comments
        const commentsContainer = document.getElementById('my-comments-container');
        if (commentsContainer && commentsContainer.children.length === 0) {
            commentsContainer.innerHTML = '<p class="no-comments">You haven\'t posted any comments yet.</p>';
        }
        
        showNotification('Comment deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting comment:', error);
        showNotification('Failed to delete comment. Please try again later.', 'error');
    }
}

// Show notification message
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// API methods for comments
const commentsAPI = {
    // Get all comments
    getAllComments: async function() {
        const response = await fetch('/api/comments');
        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }
        return await response.json();
    },
    
    // Get comments for current user
    getUserComments: async function() {
        const response = await fetch('/api/comments/user');
        if (!response.ok) {
            throw new Error('Failed to fetch user comments');
        }
        return await response.json();
    },
    
    // Create a new comment
    createComment: async function(commentData) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });
        if (!response.ok) {
            throw new Error('Failed to create comment');
        }
        return await response.json();
    },
    
    // Update a comment
    updateComment: async function(commentId, commentData) {
        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });
        if (!response.ok) {
            throw new Error('Failed to update comment');
        }
        return await response.json();
    },
    
    // Delete a comment
    deleteComment: async function(commentId) {
        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }
        return await response.json();
    }
};