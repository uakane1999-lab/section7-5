"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

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
    <div style={container}>
      <h1 style={{ marginBottom: 24 }}>🔐 ログイン</h1>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} type="email" placeholder="メールアドレス" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input style={inputStyle} type="password" placeholder="パスワード" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        {error && <p style={{ color: "red", marginBottom: 8 }}>{error}</p>}
        <button type="submit" style={btnStyle}>ログイン</button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        アカウントをお持ちでない方は <Link href="/register" style={{ color: "#2196F3" }}>新規登録</Link>
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
  width: "100%", padding: "10px", background: "#2196F3", color: "white",
  border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer",
};
