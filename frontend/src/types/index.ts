export interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string | null;
  ingredients: string[];
  steps: string[];
  author_id: number;
  author: User;
  created_at: string;
  updated_at: string | null;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface RecipeCreate {
  title: string;
  description?: string;
  ingredients: string[];
  steps: string[];
}
