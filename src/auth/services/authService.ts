import { apiAuth } from "../../api/api";
import type { User } from "../../types/types";

interface ErorResponse {
  response?: {
    data?: {
      detail: string;
    };
  };
}

//TOKEN MANAGMENT

export function getToken() {
  return localStorage.getItem(accessToken);
}

export function logout() {
  localStorage.removeItem(accessToken);
  window.location.href = "/login";
}

//API MANAGMENT

const accessToken = "access_token";

export async function registerUser(user: Omit<User, "id">) {
  try {
    await apiAuth.register(user);
    return true;
  } catch (e) {
    const axiosError = e as ErorResponse;
    return axiosError.response?.data?.detail;
  }
}

export async function login(user: Omit<User, "id">) {
  try {
    const resp = await apiAuth.login(user);
    const access_token = resp.data.access_token;

    localStorage.setItem(accessToken, access_token);
    return true;
  } catch (e) {
    const axiosError = e as ErorResponse;
    return axiosError.response?.data?.detail;
  }
}

export async function isAuth() {
  const token = getToken();
  if (!token) return false;

  try {
    const resp = await apiAuth.checAuth();
    return resp.data.auth;
  } catch {
    //logout()
    return false;
  }
}
