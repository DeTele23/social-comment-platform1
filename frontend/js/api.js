export async function apiRequest(endpoint, method = "GET", data = null) {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : null,
      });
  
      // Try parsing only if response has content
      let result;
      const contentType = response.headers.get("Content-Type");
  
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = { message: await response.text() };
      }
  
      if (!response.ok) {
        throw new Error(result.message || "Request failed");
      }
  
      return result;
    } catch (error) {
      console.error(`[API] ${method} /api/${endpoint} failed:`, error);
      throw error;
    }
  }  