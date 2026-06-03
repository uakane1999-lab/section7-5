import Link from "next/link";

export default function MyPage() {
  const myRecipes = [
    { id: 1, title: "オムライス", description: "ふわとろ卵の定番レシピ" },
    { id: 2, title: "カレー", description: "野菜たっぷりカレー" },
  ];

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 32 }}>
      <h1 style={{ marginBottom: 24 }}>マイページ</h1>

      <section
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 24,
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img
            src="https://placehold.jp/120x120.png"
            alt="プロフィール画像"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #ddd",
            }}
          />

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <h2>プロフィール</h2>

              <Link
                href="/mypage/profile"
                style={{
                  display: "inline-block",
                  background: "#333",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: 8,
                  textDecoration: "none",
                }}
              >
                プロフィール設定
              </Link>
            </div>

            <p style={{ marginBottom: 8 }}>
              <strong>ユーザー名：</strong>サンプルユーザー
            </p>

            <p>
              <strong>自己紹介：</strong>料理が好きです。
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2>自分の投稿一覧</h2>

          <Link
            href="/recipes/new"
            style={{
              background: "#333",
              color: "white",
              padding: "10px 16px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            ＋ 新規投稿
          </Link>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {myRecipes.map((recipe) => (
            <div
              key={recipe.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ marginBottom: 6 }}>{recipe.title}</h3>
                <p style={{ color: "#666" }}>{recipe.description}</p>
              </div>

              <Link
                href={`/recipes/${recipe.id}/edit`}
                style={{
                  border: "1px solid #333",
                  color: "#333",
                  padding: "8px 14px",
                  borderRadius: 8,
                  textDecoration: "none",
                }}
              >
                編集
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
