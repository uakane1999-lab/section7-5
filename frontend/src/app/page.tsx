"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { Recipe } from "@/types";

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

const RECIPE_IMAGES: { [key: string]: string } = {
  "1": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=400",
  "2": "https://images.unsplash.com/photo-1580442151529-343f2f6e0e27?q=80&w=400",
  "3": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400",
  "4": "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=400",
};

const RECIPE_TAGS: { [key: string]: string } = {
  "1": "#卵 #洋食",
  "2": "#魚 #和食",
  "3": "#野菜 #時短",
  "4": "#肉 #カレー",
};

export default function RecipeListPage() {
  const [searchWord, setSearchWord] = useState("");

  const filteredRecipes = MOCK_RECIPES.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchWord.toLowerCase()),
  );

  const handleClear = () => {
    setSearchWord("");
  };

  return (
    <div style={styles.container}>
      <Header />

      <main style={styles.main}>
        <div style={styles.searchSection}>
          <div style={styles.searchForm}>
            <input
              type="text"
              placeholder="料理名を入力..."
