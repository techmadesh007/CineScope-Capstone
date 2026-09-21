import axios from "axios";

const api = axios.create({
  baseURL: "https://cinescope-backend-h7cv.onrender.com",
});

export default api;