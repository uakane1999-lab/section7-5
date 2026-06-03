"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
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

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    background: "#fff",
    borderBottom: "1px solid #eee",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoLink: {
    color: "#333",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  link: {
    color: "#333",
    fontSize: 14,
  },
  logoutButton: {
    background: "none",
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 14,
  },
};