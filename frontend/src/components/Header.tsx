import { Link } from "react-router-dom";

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
        <Link to="/">レシピ一覧</Link>
        {token ? (
          <>
            <Link to="/recipes/new">投稿</Link>
            <Link to="/mypage">マイページ</Link>
            <button onClick={handleLogout}>ログアウト</button>
          </>
        ) : (
          <Link to="/login">ログイン</Link>
        )}
      </nav>
    </header>
  );
}
