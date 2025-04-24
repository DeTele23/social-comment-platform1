// js/comments.js
import { apiRequest } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const commentForm = document.getElementById("comment-form");
  const commentsContainer = document.getElementById("comments-container");
  const myCommentsContainer = document.getElementById("my-comments-container");

  // Post a new comment
  if (commentForm) {
    commentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = document.getElementById("comment-text").value;
      try {
        await apiRequest("postComment", "POST", { content: text });
        document.getElementById("comment-text").value = "";
        loadComments();
      } catch (err) {
        alert("Error posting comment: " + err.message);
      }
    });
  }

  // Load recent comments
  async function loadComments() {
    try {
      const comments = await apiRequest("getComments");
      const container = commentsContainer || myCommentsContainer;
      container.innerHTML = comments.map(c =>
        `<div class="comment"><strong>${c.username}</strong>: ${c.content}</div>`
      ).join("");
    } catch (err) {
      const container = commentsContainer || myCommentsContainer;
      container.innerHTML = `<p>Error loading comments: ${err.message}</p>`;
    }
  }

  if (commentsContainer || myCommentsContainer) {
    loadComments();
  }
});
