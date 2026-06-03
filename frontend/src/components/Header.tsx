"use client";

import Link from "next/link"; // 正しいNext.jsのLinkに変えます
import { useRouter } from "next/navigation"; // Next.js用のルーター

export default function Header() {
  const router = useRouter();

  // ブラウザ環境のときだけtokenをチェックするNext.js用の安全な書き方
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/"); // Next.jsの安全な画面遷移
    router.refresh();
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>
        <Link href="/" style={styles.logoLink}>
          🍳 ふわっとレシピ
        </Link>
      </h1>

      <nav style={styles.nav}>
        {/* Next.jsでは to="/" ではなく href="/" と書きます */}
        <Link href="/" style={styles.link}>
          レシピ一覧
        </Link>
        {token ? (
          <>
            <Link href="/recipes/new" style={styles.link}>
              投稿
            </Link>
            <Link href="/mypage" style={styles.link}>
              マイページ
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              ログアウト
            </button>
          </>
        ) : (
          <Link href="/login" style={styles.link}>
            ログイン
          </Link>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#fff",
    borderBottom: "1px solid #f3ebe1",
  },
  logo: { margin: 0, fontSize: "20px" },
  logoLink: { color: "#5c4033", textDecoration: "none", fontWeight: "bold" },
  nav: { display: "flex", gap: "20px", alignItems: "center" },
  link: { color: "#6e5643", textDecoration: "none", fontSize: "15px" },
  logoutButton: {
    background: "none",
    border: "1px solid #dcd0c0",
    color: "#8b7355",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
};
