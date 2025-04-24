// js/api.js
export async function apiRequest(endpoint, method = "GET", data = null) {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : null,
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Request failed");
  
      return result;
    } catch (error) {
      console.error(`[API] ${method} /api/${endpoint} failed:`, error);
      throw error;
    }
  }
  