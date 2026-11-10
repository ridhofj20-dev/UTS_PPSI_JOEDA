import { AuthResponse, ComplaintDetail, PublicComplaint, RegionItem, AgencyItem, CategoryItem, UserProfile } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lampung_report_token");
};

export const setStoredToken = (token: string, user: UserProfile): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("lampung_report_token", token);
  localStorage.setItem("lampung_report_user", JSON.stringify(user));
};

export const getStoredUser = (): UserProfile | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("lampung_report_user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const clearStoredAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("lampung_report_token");
  localStorage.removeItem("lampung_report_user");
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(
        errorJson.error?.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (err: any) {
    // If backend is unreachable, throw informative error
    console.warn(`[API Client] Error on ${endpoint}:`, err.message);
    throw err;
  }
}

