export default function ProfilePage() {
  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 32 }}>
      <h1 style={{ marginBottom: 24 }}>プロフィール設定</h1>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>ユーザー名</label>
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
  );
}
