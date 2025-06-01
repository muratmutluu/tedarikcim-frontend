import axios from "axios";

const baseURL = "http://localhost:8000";

const options = {
  baseURL,
};

const axiosInstance = axios.create(options);

export default axiosInstance;
