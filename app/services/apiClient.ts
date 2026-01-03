// app/lib/apiClient.ts
"use client";

import axios from "axios"; //esta linea da error 

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: false, // lo dejamos en false por ahora (JWT en header)
});

// Helper para configurar token en memoria
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

apiClient.interceptors.request.use((config) => { //config tambien da error
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default apiClient;
