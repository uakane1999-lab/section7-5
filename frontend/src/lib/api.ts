import { Token, Recipe, User, RecipeCreate } from "@/types";

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

// Auth
export const authApi = {
  // 変更後：emailとfirebase_uidを削除し、id_tokenを受け取る形に修正
  register: (data: { username: string; id_token: string }) =>
    request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ログインはそのまま（もしバックエンドから変更の指定がなければ一旦維持）
  login: (email: string, password: string) =>
    request<Token>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// Recipes
export const recipeApi = {
  list: () => request<Recipe[]>("/recipes/"),

  get: (id: number) => request<Recipe>(`/recipes/${id}`),

  create: (data: RecipeCreate, token: string) =>
    request<Recipe>(
      "/recipes/",
      { method: "POST", body: JSON.stringify(data) },
      token,
    ),

  update: (id: number, data: Partial<RecipeCreate>, token: string) =>
    request<Recipe>(
      `/recipes/${id}`,
      { method: "PUT", body: JSON.stringify(data) },
      token,
    ),

  delete: (id: number, token: string) =>
    request<void>(`/recipes/${id}`, { method: "DELETE" }, token),
};

// Users
export const userApi = {
  me: (token: string) => request<User>("/users/me", {}, token),
};
