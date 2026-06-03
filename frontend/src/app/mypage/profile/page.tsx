import Header from "@/components/Header";

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 600, margin: "0 auto", padding: 32 }}>
        <h1 style={{ marginBottom: 24 }}>プロフィール設定</h1>

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
            border: "1px solid #ddd",
          }}
        />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            ユーザー名
          </label>
          <input
            type="text"
            placeholder="ユーザー名を入力"
            style={{
              width: "100%",
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            プロフィール画像URL
          </label>
          <input
            type="text"
            placeholder="画像URLを入力"
            style={{
              width: "100%",
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 8 }}>自己紹介</label>
          <textarea
            placeholder="自己紹介を入力"
            rows={5}
            style={{
              width: "100%",
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          />
        </div>

        <button
          type="button"
          style={{
            background: "#333",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          保存する
        </button>
      </main>
    </>
  );
}
