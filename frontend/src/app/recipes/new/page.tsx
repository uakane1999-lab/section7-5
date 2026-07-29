// 投稿画面
"use client";

import { useRouter } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";
import { recipeApi } from "@/lib/api";
import Header from "@/components/Header";

export default function RecipeCreatePage() {
  const router = useRouter();

  const handleCreate = async (data: {
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
      await recipeApi.create(data, token);
      router.push("/recipes");
    } catch (error) {
      console.error(error);
      alert("レシピの投稿に失敗しました");
    }
  };

  return (
    <div style={pageStyle}>
      <Header />

      <main style={mainStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>レシピ投稿</h1>

          <p style={leadStyle}>
            あなたのおすすめレシピをみんなに共有しましょう。
          </p>

          <RecipeForm submitLabel="投稿する" onSubmit={handleCreate} />
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
