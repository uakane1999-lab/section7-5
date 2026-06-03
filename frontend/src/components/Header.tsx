import Link from "next/link";

export default function Header() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <header>
      <h1>レシピ共有アプリ</h1>

      <nav>
          <Link href="/">レシピ一覧</Link>  {/* ← href に変更！ */}
          {token ? (
            <>
              <Link href="/recipes/new">投稿</Link>  {/* ← href に変更！ */}
              <Link href="/mypage">マイページ</Link>  {/* ← href に変更！ */}
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <Link href="/login">ログイン</Link>  {/* ← href に変更！ */}
          )}
        </nav>
    </header>
  );
}
