"use client";

import { useParams, useRouter } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";
import { recipeApi } from "@/lib/api";
import Header from "@/components/Header";

export default function RecipeEditPage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = Number(params.id);

  const handleUpdate = async (data: {
    title: string;
    ingredients: string;
    instructions: string;
  }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("ログインしてください");
      router.push("/login");
      return;
    }

    try {
      await recipeApi.update(recipeId, data, token);
      router.push("/recipes");
    } catch (error) {
      console.error(error);
      alert("レシピの更新に失敗しました");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("ログインしてください");
      router.push("/login");
      return;
    }

    const ok = window.confirm("このレシピを削除しますか？");

    if (!ok) {
      return;
    }

    try {
      await recipeApi.delete(recipeId, token);
      router.push("/recipes");
    } catch (error) {
      console.error(error);
      alert("レシピの削除に失敗しました");
    }
  };

  return (
    <div style={pageStyle}>
      <Header />

      <main style={mainStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>レシピ編集</h1>
          <p style={leadStyle}>内容を修正して、レシピを更新できます。</p>

          <RecipeForm submitLabel="更新する" onSubmit={handleUpdate} />

          <button
            type="button"
            onClick={handleDelete}
            style={deleteButtonStyle}
          >
            削除する
          </button>
        </div>
      </main>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#fdfbf7",
  color: "#5c4033",
  fontFamily: "sans-serif",
};

const mainStyle: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: "48px 20px",
};

const cardStyle: React.CSSProperties = {
  maxWidth: 600,
  margin: "0 auto",
  padding: 32,
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #f3ebe1",
  boxShadow: "0 4px 16px rgba(220, 210, 195, 0.3)",
};

const titleStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 28,
  color: "#5c4033",
};

const leadStyle: React.CSSProperties = {
  margin: "0 0 24px",
  fontSize: 14,
  color: "#8b7355",
};

const deleteButtonStyle: React.CSSProperties = {
  marginTop: 16,
  background: "#c0392b",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
};
