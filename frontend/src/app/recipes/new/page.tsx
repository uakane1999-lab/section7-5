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
    <>
      <Header />
      <main style={{ maxWidth: 600, margin: "0 auto", padding: 32 }}>
        <h1>レシピ投稿</h1>

        <RecipeForm submitLabel="投稿する" onSubmit={handleCreate} />
      </main>
    </>
  );
}
