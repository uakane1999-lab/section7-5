"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import { recipeApi } from "@/lib/api";
import { Recipe } from "@/types";

export default function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // TODO: Firebase接続後に差し替え
  const currentUser = {
    id: "101",
    getIdToken: async () => "mock-firebase-token",
  };

  useEffect(() => {
    recipeApi
      .get(id)
      .then((data) => setRecipe(data))
      .catch(() => setError("レシピの取得に失敗しました"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("このレシピを削除しますか？")) return;
    try {
      const token = await currentUser?.getIdToken();
      if (!token) return;
      // TODO: Firebase接続後に有効化
      // await recipeApi.delete(id, token);
      alert("レシピを削除しました（モック）");
      router.push("/");
    } catch (error) {
      console.error("削除エラー:", error);
    }
  };

  if (loading)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>読み込み中...</div>
    );

  if (error)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        {error}
      </div>
    );

  if (!recipe)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        レシピが見つかりませんでした
      </div>
    );

  // TODO: Firebase接続後に current_user.id と recipe.user_id で判定
  const isOwner = currentUser && recipe.user_id === currentUser.id;

  return (
    <div style={styles.container}>
      <Header />

      <main style={styles.main}>
        <div style={styles.backNav}>
          <Link href="/" style={styles.backLink}>
            ← レシピ一覧に戻る
          </Link>
        </div>

        <div style={styles.detailCard}>
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              style={styles.recipeImg}
            />
          )}

          <div style={styles.cardBody}>
            <div style={styles.headerRow}>
              <h1 style={styles.title}>{recipe.title}</h1>
              {isOwner && (
                <div style={styles.ownerActions}>
                  <button style={styles.editBtn}>編集</button>
                  <button onClick={handleDelete} style={styles.deleteBtn}>
                    削除
                  </button>
                </div>
              )}
            </div>

            <p style={styles.meta}>
              👤 投稿者: {recipe.user.username}
            </p>

            <hr style={styles.divider} />

            <h3 style={styles.subTitle}>🍳 材料</h3>
            <p style={styles.textBlock}>{recipe.ingredients}</p>

            <h3 style={styles.subTitle}>📝 作り方</h3>
            <p style={styles.textBlock}>{recipe.instructions}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#fdfbf7",
    minHeight: "100vh",
    color: "#5c4033",
    fontFamily: "sans-serif",
  },
  main: { maxWidth: "800px", margin: "0 auto", padding: "30px 20px" },
  backNav: { marginBottom: "20px" },
  backLink: { color: "#8b7355", fontSize: "14px" },
  detailCard: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(220, 210, 195, 0.2)",
    border: "1px solid #f3ebe1",
  },
  recipeImg: { width: "100%", height: "300px", objectFit: "cover" },
  cardBody: { padding: "24px" },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  title: { fontSize: "24px", color: "#5c4033", margin: 0 },
  ownerActions: { display: "flex", gap: "8px" },
  editBtn: {
    padding: "6px 16px",
    background: "#e6c5a3",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#5c4033",
    fontSize: "14px",
  },
  deleteBtn: {
    padding: "6px 16px",
    background: "#e88080",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#fff",
    fontSize: "14px",
  },
  meta: { fontSize: "14px", color: "#888", marginBottom: "16px" },
  tags: { display: "flex", gap: "8px", marginBottom: "16px" },
  tag: {
    padding: "4px 10px",
    background: "#fdf3e7",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#a08060",
  },
  divider: { border: "none", borderTop: "1px solid #f3ebe1", margin: "16px 0" },
  subTitle: { fontSize: "16px", color: "#6e5643", marginBottom: "8px" },
  textBlock: {
    fontSize: "14px",
    color: "#5c4033",
    lineHeight: "1.8",
    whiteSpace: "pre-wrap",
  },
};
