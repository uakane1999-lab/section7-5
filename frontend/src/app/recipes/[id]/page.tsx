"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { recipeApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Recipe } from "@/types";

// ---- コメントの型（バックエンド実装後に lib/api.ts へ移動） ----
type Comment = {
  id: number;
  user_id: number;
  username: string;
  body: string;
  created_at: string;
};

// ---- モックコメント（API疎通後に差し替え） ----
const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    user_id: 201,
    username: "たろう",
    body: "美味しそう！作ってみます🍳",
    created_at: "2026-06-02",
  },
  {
    id: 2,
    user_id: 202,
    username: "はなこ",
    body: "卵ふわふわになりました！",
    created_at: "2026-06-03",
  },
];

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>(); // ← すでにstringなのでNumber()不要
  const router = useRouter();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [commentBody, setCommentBody] = useState("");
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    recipeApi
      .get(id) // ← Number(id) → id に変更
      .then(setRecipe)
      .finally(() => setLoading(false));
  }, [id]);

  // 修正後（Firebaseのtokenを取得して渡す）
  const handleDelete = async () => {
    if (!confirm("このレシピを削除しますか？")) return;
    const token = await user?.getIdToken();
    if (!token) return;
    await recipeApi.delete(id, token); // ← Number(id) → id に変更
    router.push("/recipes");
  };

  // コメント投稿（モック：API疎通後に差し替え）
  const handleCommentSubmit = () => {
    if (!commentBody.trim()) {
      setCommentError("コメントを入力してください");
      return;
    }
    const newComment: Comment = {
      id: comments.length + 1,
      user_id: user?.uid ? 999 : 0,
      username: user?.displayName ?? "ゲスト",
      body: commentBody,
      created_at: new Date().toISOString().slice(0, 10),
    };
    setComments([...comments, newComment]);
    setCommentBody("");
    setCommentError("");
  };

  if (loading) return <p style={{ padding: 32 }}>読み込み中...</p>;
  if (!recipe)
    return <p style={{ padding: 32 }}>レシピが見つかりませんでした。</p>;

  const isOwner = user && recipe.user_id === user.uid;

  return (
    <div style={styles.container}>
      <Header />

      <main style={styles.main}>
        {/* 一覧に戻るリンク */}
        <Link href="/recipes" style={styles.backLink}>
          ← 一覧に戻る
        </Link>

        {/* レシピ画像 */}
        <div style={styles.imageWrap}>
          <img
            src={
              recipe.image_url ||
              "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800"
            }
            alt={recipe.title}
            style={styles.image}
          />
        </div>

        {/* タイトル・メタ情報 */}
        <div style={styles.card}>
          <h1 style={styles.title}>{recipe.title}</h1>
          <div style={styles.meta}>
            <span>👤 ユーザー {recipe.user_id}</span>
            <span>⏱️ 15分</span>
            <span style={styles.tag}>#おすすめ</span>
          </div>

          {/* 投稿者本人のみ：編集・削除ボタン */}
          {isOwner && (
            <div style={styles.ownerActions}>
              <Link href={`/recipes/${recipe.id}/edit`} style={styles.editBtn}>
                ✏️ 編集
              </Link>
              <button onClick={handleDelete} style={styles.deleteBtn}>
                🗑️ 削除
              </button>
            </div>
          )}
        </div>

        {/* 材料 */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🥕 材料</h2>
          <p style={styles.body}>{recipe.ingredients}</p>
        </div>

        {/* 手順 */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 作り方</h2>
          {recipe.instructions
            .split("\n")
            .filter(Boolean)
            .map((step, i) => (
              <div key={i} style={styles.step}>
                <span style={styles.stepNum}>{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
        </div>

        {/* コメント一覧 */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>💬 コメント</h2>
          {comments.length === 0 ? (
            <p style={styles.noComment}>まだコメントはありません。</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} style={styles.commentCard}>
                <div style={styles.commentMeta}>
                  <span style={styles.commentUser}>👤 {c.username}</span>
                  <span style={styles.commentDate}>{c.created_at}</span>
                </div>
                <p style={styles.commentBody}>{c.body}</p>
              </div>
            ))
          )}
        </div>

        {/* コメント投稿フォーム（ログイン時のみ） */}
        {user ? (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>コメントを投稿</h2>
            {commentError && <p style={styles.error}>{commentError}</p>}
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="コメントを入力..."
              style={styles.textarea}
            />
            <button onClick={handleCommentSubmit} style={styles.submitBtn}>
              送信
            </button>
          </div>
        ) : (
          <p style={styles.loginPrompt}>
            コメントするには{" "}
            <Link href="/login" style={styles.loginLink}>
              ログイン
            </Link>{" "}
            してください。
          </p>
        )}
      </main>
    </div>
  );
}

// ---- スタイル ----
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#fdfbf7",
    minHeight: "100vh",
    color: "#5c4033",
    fontFamily: "sans-serif",
  },
  main: { maxWidth: "800px", margin: "0 auto", padding: "30px 20px" },
  backLink: {
    display: "inline-block",
    marginBottom: 20,
    color: "#8b7355",
    textDecoration: "none",
    fontSize: 14,
  },
  imageWrap: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    boxShadow: "0 4px 16px rgba(220,210,195,0.3)",
  },
  image: { width: "100%", height: 320, objectFit: "cover", display: "block" },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "24px",
    marginBottom: 24,
    boxShadow: "0 4px 12px rgba(220,210,195,0.2)",
    border: "1px solid #f3ebe1",
  },
  title: { fontSize: 26, fontWeight: "bold", margin: "0 0 12px 0" },
  meta: {
    display: "flex",
    gap: 16,
    fontSize: 13,
    color: "#888",
    alignItems: "center",
    flexWrap: "wrap",
  },
  tag: {
    background: "#f3ebe1",
    color: "#a08060",
    borderRadius: 99,
    padding: "2px 10px",
    fontWeight: "bold",
    fontSize: 12,
  },
  ownerActions: { display: "flex", gap: 12, marginTop: 20 },
  editBtn: {
    padding: "8px 20px",
    background: "#e6c5a3",
    color: "#fff",
    borderRadius: 8,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: "bold",
  },
  deleteBtn: {
    padding: "8px 20px",
    background: "#f4a4a4",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: "bold",
    cursor: "pointer",
  },
  section: {
    background: "#fff",
    borderRadius: 16,
    padding: "24px",
    marginBottom: 20,
    boxShadow: "0 4px 12px rgba(220,210,195,0.2)",
    border: "1px solid #f3ebe1",
  },
  sectionTitle: {
    fontSize: 16,
    color: "#6e5643",
    borderBottom: "2px solid #e6c5a3",
    paddingBottom: 8,
    marginBottom: 16,
  },
  body: { lineHeight: 1.8, fontSize: 15 },
  step: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 12,
    fontSize: 15,
  },
  stepNum: {
    minWidth: 28,
    height: 28,
    background: "#e6c5a3",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 13,
    flexShrink: 0,
  },
  commentCard: {
    borderBottom: "1px solid #f3ebe1",
    paddingBottom: 12,
    marginBottom: 12,
  },
  commentMeta: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentUser: { fontWeight: "bold", fontSize: 13, color: "#8b7355" },
  commentDate: { fontSize: 12, color: "#aaa" },
  commentBody: { fontSize: 14, lineHeight: 1.7, margin: 0 },
  noComment: { color: "#aaa", fontSize: 14 },
  textarea: {
    width: "100%",
    minHeight: 80,
    padding: 12,
    borderRadius: 8,
    border: "1px solid #dcd0c0",
    fontSize: 14,
    color: "#5c4033",
    backgroundColor: "#fcfbfa",
    resize: "vertical",
    boxSizing: "border-box",
  },
  submitBtn: {
    marginTop: 10,
    padding: "10px 24px",
    background: "#e6c5a3",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: { color: "#e07070", fontSize: 13, marginBottom: 8 },
  loginPrompt: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    padding: "20px 0",
  },
  loginLink: { color: "#e6a87c", fontWeight: "bold" },
};
