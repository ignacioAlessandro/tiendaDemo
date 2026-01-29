"use client";

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default apiClient;
