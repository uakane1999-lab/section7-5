// ログイン画面
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import Header from "@/components/Header";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = await authApi.login(email, password);
      await login(token.access_token);
      router.push("/recipes");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
    }
  };

  return (
    <div style={pageStyle}>
      <Header />

      <main style={mainStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>🔐 ログイン</h1>
          <p style={leadStyle}>
            アカウントにログインして、レシピを投稿しましょう。
          </p>

          <form onSubmit={handleSubmit}>
            <input
              style={inputStyle}
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              style={inputStyle}
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p style={errorStyle}>{error}</p>}

            <button type="submit" style={btnStyle}>
              ログイン
            </button>
          </form>

          <p style={registerTextStyle}>
            アカウントをお持ちでない方は{" "}
            <Link href="/register" style={registerLinkStyle}>
              新規登録
            </Link>
          </p>
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
  maxWidth: 420,
  margin: "40px auto",
  padding: 32,
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #f3ebe1",
  boxShadow: "0 4px 16px rgba(220, 210, 195, 0.3)",
};

const titleStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 26,
  color: "#5c4033",
};

const leadStyle: React.CSSProperties = {
  margin: "0 0 24px",
  fontSize: 14,
  color: "#8b7355",
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "12px 14px",
  marginBottom: 14,
  border: "1px solid #dcd0c0",
  borderRadius: 8,
  fontSize: 15,
  backgroundColor: "#fcfbfa",
  color: "#5c4033",
  outline: "none",
};

const btnStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  background: "#e6c5a3",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  color: "#c0392b",
  margin: "0 0 12px",
  fontSize: 14,
};

const registerTextStyle: React.CSSProperties = {
  marginTop: 18,
  fontSize: 14,
  textAlign: "center",
  color: "#8b7355",
};

const registerLinkStyle: React.CSSProperties = {
  color: "#6e5643",
  fontWeight: "bold",
  textDecoration: "none",
};
