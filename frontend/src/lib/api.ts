import { Recipe, User, RecipeCreate } from "@/types";

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

// authApiは削除（Firebase Authで認証するため不要）

// Recipes　id関連をstringに変更 + listにkeyword追加
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

// Users
export const userApi = {
  me: (token: string) => request<User>("/users/me", {}, token),
};
