import Link from "next/link";
import Header from "@/components/Header";

export default function MyPage() {
  const myRecipes = [
    { id: 1, title: "オムライス", description: "ふわとろ卵の定番レシピ" },
    { id: 2, title: "カレー", description: "野菜たっぷりカレー" },
  ];

  return (
    <>
      <Header />

      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "48px 20px",
          backgroundColor: "#fdfbf7",
          minHeight: "100vh",
        }}
      >
        <h1
          style={{
            marginBottom: 24,
            color: "#5c4033",
            fontSize: 32,
          }}
        >
          マイページ
        </h1>

        <section
          style={{
            background: "#fff",
            border: "1px solid #f3ebe1",
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
            boxShadow: "0 4px 16px rgba(220, 210, 195, 0.3)",
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
                border: "2px solid #f3ebe1",
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
                <h2
                  style={{
                    color: "#5c4033",
                    margin: 0,
                  }}
                >
                  プロフィール
                </h2>

                <Link
                  href="/mypage/profile"
                  style={{
                    display: "inline-block",
                    background: "#e6c5a3",
                    color: "#fff",
                    padding: "10px 16px",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  プロフィール設定
                </Link>
              </div>

              <p style={{ marginBottom: 8, color: "#5c4033" }}>
                <strong>ユーザー名：</strong>
                サンプルユーザー
              </p>

              <p style={{ color: "#5c4033" }}>
                <strong>自己紹介：</strong>
                料理が好きです。
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            background: "#fff",
            border: "1px solid #f3ebe1",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 16px rgba(220, 210, 195, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                color: "#5c4033",
                margin: 0,
              }}
            >
              自分の投稿一覧
            </h2>

            <Link
              href="/recipes/new"
              style={{
                background: "#e6c5a3",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: "bold",
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
                  border: "1px solid #f3ebe1",
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#fcfbfa",
                }}
              >
                <div>
                  <h3
                    style={{
                      marginBottom: 6,
                      color: "#5c4033",
                    }}
                  >
                    {recipe.title}
                  </h3>

                  <p
                    style={{
                      color: "#8b7355",
                      margin: 0,
                    }}
                  >
                    {recipe.description}
                  </p>
                </div>

                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  style={{
                    border: "1px solid #dcd0c0",
                    color: "#5c4033",
                    padding: "8px 14px",
                    borderRadius: 8,
                    textDecoration: "none",
                    background: "#fff",
                  }}
                >
                  編集
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
