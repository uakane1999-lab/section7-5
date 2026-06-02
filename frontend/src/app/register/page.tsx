"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await authApi.register(form);
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "登録に失敗しました");
    }
  };

  return (
    <div style={container}>
      <h1 style={{ marginBottom: 24 }}>📝 新規登録</h1>
      <form onSubmit={handleSubmit}>
        {(["username", "email", "password"] as const).map((field) => (
          <input key={field} style={inputStyle}
            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
            placeholder={field === "username" ? "ユーザー名" : field === "email" ? "メールアドレス" : "パスワード"}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            required />
        ))}
        {error && <p style={{ color: "red", marginBottom: 8 }}>{error}</p>}
        <button type="submit" style={btnStyle}>登録する</button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        すでにアカウントをお持ちの方は <Link href="/login" style={{ color: "#2196F3" }}>ログイン</Link>
      </p>
    </div>
  );
}

const container: React.CSSProperties = {
  maxWidth: 400, margin: "80px auto", padding: 32, background: "white",
  borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};
const inputStyle: React.CSSProperties = {
  display: "block", width: "100%", padding: "10px 12px", marginBottom: 12,
  border: "1px solid #ddd", borderRadius: 6, fontSize: 14,
};
const btnStyle: React.CSSProperties = {
  width: "100%", padding: "10px", background: "#9C27B0", color: "white",
  border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer",
};
