"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { recipeApi } from "@/lib/api";
import { Recipe } from "@/types";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/Header";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    recipeApi
      .list()
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 32 }}>読み込み中...</p>;

  return (
    <>
      <Header />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h1>🍽️ レシピ一覧</h1>
          <div style={{ display: "flex", gap: 8 }}>
            {user && (
              <Link href="/recipes/new" style={btn("#4CAF50")}>
                + 新規作成
              </Link>
            )}
            <Link href="/" style={btn("#999")}>
              ← TOP
            </Link>
          </div>
        </div>

        {recipes.length === 0 ? (
          <p style={{ color: "#666" }}>まだレシピがありません</p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {recipes.map((r) => (
              <Link key={r.id} href={`/recipes/${r.id}`}>
                <div style={cardStyle}>
                  <h2 style={{ fontSize: 18, marginBottom: 4 }}>{r.title}</h2>
                  <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
                    by {r.user.username}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid #eee",
  borderRadius: 8,
  padding: 16,
  cursor: "pointer",
  transition: "box-shadow 0.2s",
};

function btn(bg: string): React.CSSProperties {
  return {
    background: bg,
    color: "white",
    padding: "8px 16px",
    borderRadius: 6,
    fontSize: 14,
  };
}