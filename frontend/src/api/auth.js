// src/api/auth.js

// Demo Login API
export const loginUser = async (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "user" && password === "password") {
        resolve({ status: 200, data: { name: "John Doe" } });
      } else {
        reject({ status: 401, message: "Invalid credentials" });
      }
    }, 800);
  });
};

// ✅ Demo Register API (FIXED)
export const registerUser = async (formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 201, message: "Registered successfully" });
    }, 1000);
  });
};
