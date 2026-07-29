import Header from "@/components/Header";

export default function ProfilePage() {
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
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: 32,
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #f3ebe1",
            boxShadow: "0 4px 16px rgba(220, 210, 195, 0.3)",
          }}
        >
          <h1
            style={{
              marginBottom: 24,
              color: "#5c4033",
              fontSize: 28,
            }}
          >
            プロフィール設定
          </h1>

          <img
            src="https://placehold.jp/150x150.png"
            alt="プロフィール画像"
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              margin: "0 auto 24px",
              border: "2px solid #f3ebe1",
            }}
          />

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#5c4033",
                fontWeight: "bold",
              }}
            >
              ユーザー名
            </label>

            <input
              type="text"
              placeholder="ユーザー名を入力"
              style={{
                width: "100%",
                padding: 12,
                border: "1px solid #dcd0c0",
                borderRadius: 8,
                backgroundColor: "#fcfbfa",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#5c4033",
                fontWeight: "bold",
              }}
            >
              プロフィール画像URL
            </label>

            <input
              type="text"
              placeholder="画像URLを入力"
              style={{
                width: "100%",
                padding: 12,
                border: "1px solid #dcd0c0",
                borderRadius: 8,
                backgroundColor: "#fcfbfa",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#5c4033",
                fontWeight: "bold",
              }}
            >
              自己紹介
            </label>

            <textarea
              placeholder="自己紹介を入力"
              rows={5}
              style={{
                width: "100%",
                padding: 12,
                border: "1px solid #dcd0c0",
                borderRadius: 8,
                backgroundColor: "#fcfbfa",
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="button"
            style={{
              background: "#e6c5a3",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            保存する
          </button>
        </div>
      </main>
    </>
  );
}
