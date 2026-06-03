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
    <>
      <Header />
      <main style={{ maxWidth: 600, margin: "0 auto", padding: 32 }}>
        <h1>レシピ編集</h1>

        <RecipeForm submitLabel="更新する" onSubmit={handleUpdate} />

        <button
          type="button"
          onClick={handleDelete}
          style={{
            marginTop: 16,
            background: "#e53935",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          削除する
        </button>
      </main>
    </>
  );
}
