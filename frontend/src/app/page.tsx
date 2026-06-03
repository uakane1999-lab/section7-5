"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { Recipe } from "@/types"; // ← "../types/recipe" から変更

// りつさんの設計に合わせたダミーデータ（idをnumber型に統一）
const MOCK_RECIPES: Recipe[] = [
  {
    id: "1",
    title: "ふわとろオムライス",
    ingredients: "卵, ご飯",
    instructions: "炒める",
    image_url: null,
    user_id: "101",
    user: { id: "101", username: "ユーザーA", avatar_url: null },
    created_at: "2026-06-01",
    updated_at: "2026-06-01",
  },
  {
    id: "2",
    title: "定番！サバの味噌煮",
    ingredients: "サバ, 味噌",
    instructions: "煮込む",
    image_url: null,
    user_id: "102",
    user: { id: "102", username: "ユーザーB", avatar_url: null },
    created_at: "2026-06-01",
    updated_at: "2026-06-01",
  },
  {
    id: "3",
    title: "10分でできるサラダ",
    ingredients: "レタス, トマト",
    instructions: "混ぜる",
    image_url: null,
    user_id: "103",
    user: { id: "103", username: "ユーザーC", avatar_url: null },
    created_at: "2026-06-02",
    updated_at: "2026-06-02",
  },
  {
    id: "4",
    title: "スパイス香るカレー",
    ingredients: "肉, カレールー",
    instructions: "煮込む",
    image_url: null,
    user_id: "104",
    user: { id: "104", username: "ユーザーD", avatar_url: null },
    created_at: "2026-06-02",
    updated_at: "2026-06-02",
  },
];

// 画像の割り当てを分かりやすくするためのURLリスト
const RECIPE_IMAGES: { [key: string]: string } = {
  "1": "https://images.unsplash.com/photo-1595295333158-4742f28fbe93?q=80&w=400", // オムライス
  "2": "https://images.unsplash.com/photo-1580442151529-343f2f6e0e27?q=80&w=400", // 変更：今度こそ焼き魚・煮魚系の和食画像！
  "3": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400", // サラダ
  "4": "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=400", // カレー
};

// タグを動的に出すためのリスト
const RECIPE_TAGS: { [key: string]: string } = {
  "1": "#卵 #洋食",
  "2": "#魚 #和食",
  "3": "#野菜 #時短",
  "4": "#肉 #カレー",
};

export default function RecipeListPage() {
  const [searchWord, setSearchWord] = useState("");

  // 検索処理：料理名（title）に含まれているかチェック（材料は考慮しない仕様）
  const filteredRecipes = MOCK_RECIPES.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchWord.toLowerCase()),
  );

  return (
    <div style={styles.container}>
      <Header />

      <main style={styles.main}>
        {/* 検索エリア：料理名入力のみ考慮 */}
        <div style={styles.searchSection}>
          <div style={styles.searchForm}>
            <input
              type="text"
              placeholder="料理名を入力..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>
          {searchWord && (
            <p style={styles.searchResultText}>
              「{searchWord}」の検索結果: {filteredRecipes.length}件
            </p>
          )}
        </div>

        {/* レシピ一覧エリア */}
        <h3 style={styles.sectionTitle}>◆ みんなの新着レシピ</h3>

        <div style={styles.grid}>
          {filteredRecipes.map((recipe) => (
            <Link
              href={`/recipes/${recipe.id}`}
              key={recipe.id}
              style={styles.cardLink}
            >
              <div style={styles.card}>
                {/* 水彩画風のダミー画像（Unsplashから取得） */}
                <img
                  src={
                    RECIPE_IMAGES[recipe.id] ||
                    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=400"
                  }
                  alt={recipe.title}
                  style={styles.cardImg}
                />
                <div style={styles.cardBody}>
                  <h4 style={styles.recipeTitle}>{recipe.title}</h4>
                  <div style={styles.cardMeta}>
                    <span>👤 ユーザー {recipe.user_id}</span>
                    <span>⏱️ 15分</span>
                  </div>
                  {/* タグを動的に表示 */}
                  <div style={styles.cardTags}>
                    {RECIPE_TAGS[recipe.id] || "#おすすめ"}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>
            一致する料理が見つかりませんでした。
          </p>
        )}

        {/* ページネーション（モック） */}
        <div style={styles.pagination}>
          <span style={styles.activePage}>1</span>
          <span style={styles.pageLink}>2</span>
          <span style={styles.pageLink}>3</span>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#fdfbf7",
    minHeight: "100vh",
    color: "#5c4033",
    fontFamily: "sans-serif",
  },
  main: { maxWidth: "900px", margin: "0 auto", padding: "30px 20px" },
  searchSection: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(220, 210, 195, 0.3)",
    border: "1px solid #f3ebe1",
    marginBottom: "30px",
  },
  searchForm: {
    display: "flex",
    alignItems: "center",
    position: "relative" as "relative",
  },
  searchInput: {
    flex: 1,
    padding: "12px 40px 12px 16px",
    borderRadius: "8px",
    border: "1px solid #dcd0c0",
    fontSize: "16px",
    backgroundColor: "#fcfbfa",
    color: "#5c4033",
    outline: "none",
  },
  searchIcon: {
    position: "absolute" as "absolute",
    right: "16px",
    fontSize: "18px",
    color: "#8b7355",
  },
  searchResultText: {
    margin: "10px 0 0 4px",
    fontSize: "14px",
    color: "#8b7355",
    fontWeight: "bold" as "bold",
  },
  sectionTitle: {
    fontSize: "18px",
    color: "#6e5643",
    marginBottom: "20px",
    borderBottom: "2px solid #e6c5a3",
    paddingBottom: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
  },
  cardLink: { textDecoration: "none", color: "inherit" },
  card: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(220, 210, 195, 0.2)",
    border: "1px solid #f3ebe1",
  },
  cardImg: { width: "100%", height: "160px", objectFit: "cover" as "cover" },
  cardBody: { padding: "16px" },
  recipeTitle: { margin: "0 0 8px 0", fontSize: "16px", color: "#5c4033" },
  cardMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#888",
    marginBottom: "8px",
  },
  cardTags: {
    fontSize: "12px",
    color: "#a08060",
    fontWeight: "bold" as "bold",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "40px",
  },
  activePage: {
    padding: "6px 12px",
    background: "#e6c5a3",
    color: "#fff",
    borderRadius: "4px",
    fontWeight: "bold" as "bold",
  },
  pageLink: { padding: "6px 12px", color: "#8b7355", cursor: "pointer" },
};
