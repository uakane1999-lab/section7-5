// Userの埋め込み型（レシピレスポンス内のauthor情報）
export interface RecipeAuthor {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface Recipe {
  id: string; // UUIDなのでstringに変更
  title: string;
  ingredients: string; // 改行区切りの文字列
  instructions: string; // 改行区切りの文字列
  image_url: string | null;
  user_id: string; // UUIDなのでstringに変更
  user: RecipeAuthor; // ネストしたユーザー情報
  created_at: string;
  updated_at: string | null;
}

export interface RecipeCreate {
  title: string;
  ingredients: string;
  instructions: string;
  image_url?: string;
}

// Firebase AuthのユーザーはFirebase SDKの型を使うため
// Userインターフェースはバックエンドのusersテーブル用のみ残す
export interface User {
  id: string; // UUIDなのでstringに変更
  firebase_uid: string;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

// Tokenは Firebase Auth を使うため不要なので削除
