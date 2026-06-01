import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 16px", textAlign: "center" }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>🍳 Recipe Share</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>みんなのレシピを共有しよう</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link href="/recipes" style={btnStyle("#4CAF50")}>レシピを見る</Link>
        <Link href="/login" style={btnStyle("#2196F3")}>ログイン</Link>
        <Link href="/register" style={btnStyle("#9C27B0")}>新規登録</Link>
      </div>
    </main>
  );
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    background: bg,
    color: "white",
    padding: "10px 24px",
    borderRadius: 8,
    fontWeight: "bold",
  };
}
