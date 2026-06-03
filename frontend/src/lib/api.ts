import { Recipe, User, RecipeCreate } from "@/types";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth as firebaseAuth } from "@/lib/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const authApi = {
  login: async (email: string, password: string): Promise<{ id_token: string }> => {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const id_token = await userCredential.user.getIdToken();
    return { id_token };
  },
};

export const recipeApi = {
  list: (keyword?: string) =>
    request<Recipe[]>(
      keyword
        ? `/recipes/?keyword=${encodeURIComponent(keyword)}`
        : "/recipes/",
    ),
  get: (id: string) => request<Recipe>(`/recipes/${id}`),
  create: (data: RecipeCreate, token: string) =>
    request<Recipe>(
      "/recipes/",
      { method: "POST", body: JSON.stringify(data) },
      token,
    ),
  update: (id: string, data: Partial<RecipeCreate>, token: string) =>
    request<Recipe>(
      `/recipes/${id}`,
      { method: "PUT", body: JSON.stringify(data) },
      token,
    ),
  delete: (id: string, token: string) =>
    request<void>(`/recipes/${id}`, { method: "DELETE" }, token),
};

export const userApi = {
  me: (token: string) => request<User>("/users/me", {}, token),
};