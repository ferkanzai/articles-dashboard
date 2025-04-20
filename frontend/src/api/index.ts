import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const fetcher = axios.create({
  baseURL: BASE_URL,
});

export const api = {
  get: fetcher.get,
  post: fetcher.post,
  put: fetcher.put,
  delete: fetcher.delete,
};
