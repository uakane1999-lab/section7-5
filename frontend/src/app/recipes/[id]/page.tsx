"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header"; // 階層を合わせました

// ひとまず画面を動かすための仮の型定義（後でtypesからインポートしてもOK）
interface Recipe {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  image_url: string | null;
  user_id: string;
}

export default function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id; // URLからIDを取得
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  // const [commentBody, setCommentBody] = useState("");
  // const [commentError, setCommentError] = useState("");

  // モックのコメント一覧
  // const [comments, setComments] = useState([
  //   {
  //     id: 1,
  //     username: "ユーザーA",
  //     body: "とても美味しそうですね！今度作ってみます。",
  //   },
  //   {
  //     id: 2,
  //     username: "ユーザーB",
  //     body: "隠し味にみりんを入れるとさらにコクが出ました！",
  //   },
  // ]);

  // 現在のログインユーザー（モック：編集・削除ボタンのテスト用）
  // 投稿者と同じID「101」にしておけば、ボタンが表示されます
  const currentUser = {
    id: "101",
    getIdToken: async () => "mock-firebase-token",
  };

  useEffect(() => {
    // APIが繋がるまでのダミーデータ
    const mockData: Recipe = {
      id: id,
      title: id === "1" ? "ふわとろオムライス" : "美味しい料理",
      ingredients: "卵 2個, ご飯 1膳, ケチャップ 適量, 玉ねぎ 1/4個",
      instructions:
        "1. 玉ねぎを炒める。 \n2. ご飯を加えてチキンライスを作る。 \n3. 卵をふわとろに焼いて上にのせる。",
      image_url:
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=600",
      user_id: "101", // 投稿者ID
    };

    setRecipe(mockData);
    setLoading(false);
  }, [id]);

  // レシピ削除処理（Firebaseトークン対応）
  const handleDelete = async () => {
    if (!confirm("このレシピを削除しますか？")) return;
    try {
      const token = await currentUser?.getIdToken();
      if (!token) return;

      console.log("Firebaseトークンを使って削除します:", token);
      // await recipeApi.delete(id, token);

      alert("レシピを削除しました（モック）");
      router.push("/recipes");
    } catch (error) {
      console.error("削除エラー:", error);
    }
  };

  // コメント投稿処理
  // const handleCommentSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!commentBody.trim()) {
  //     setCommentError("コメントを入力してください");
  //     return;
  //   }

  //   const newComment = {
  //     id: Date.now(),
  //     username: "自分",
  //     body: commentBody,
  //   };

  //   setComments([...comments, newComment]);
  //   setCommentBody("");
  //   setCommentError("");
  // };

  if (loading)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>読み込み中...</div>
    );
  if (!recipe)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        レシピが見つかりませんでした
      </div>
    );

  // 投稿者本人かどうかの判定（user_idが一致するか）
  const isOwner = currentUser && recipe.user_id === currentUser.id;

  return (
    <div style={styles.container}>
      <Header />

      <main style={styles.main}>
        {/* 戻るリンク */}
        <div style={styles.backNav}>
          <Link href="/" style={styles.backLink}>
            ← レシピ一覧に戻る
          </Link>
        </div>

        {/* レシピ詳細カード */}
        <div style={styles.detailCard}>
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              style={styles.recipeImg}
            />
          )}

          <div style={styles.cardBody}>
            <div style={styles.headerRow}>
              <h1 style={styles.title}>{recipe.title}</h1>
              {/* 投稿者本人のみ編集・削除ボタンを表示 */}
              {isOwner && (
                <div style={styles.ownerActions}>
                  <button style={styles.editBtn}>編集</button>
                  <button onClick={handleDelete} style={styles.deleteBtn}>
                    削除
                  </button>
                </div>
              )}
            </div>

            <p style={styles.meta}>
              👤 投稿者: ユーザー {recipe.user_id} 　⏱️ 調理時間: 15分
            </p>

            {/* タグ表示 */}
            <div style={styles.tags}>
              <span style={styles.tag}>#卵</span>
              <span style={styles.tag}>#洋食</span>
              <span style={styles.tag}>#定番</span>
            </div>

            <hr style={styles.divider} />

            <h3 style={styles.subTitle}>🍳 材料</h3>
            <p style={styles.textBlock}>{recipe.ingredients}</p>

            <h3 style={styles.subTitle}>📝 作り方</h3>
            <p style={styles.textBlock}>{recipe.instructions}</p>
          </div>
        </div>

        {/* コメントセクション */}
        {/* <div style={styles.commentSection}>
          <h3 style={styles.commentTitle}>💬 コメント ({comments.length})</h3> */}

          {/* コメント一覧 */}
          {/* <div style={styles.commentList}>
            {comments.map((comment) => (
              <div key={comment.id} style={styles.commentCard}>
                <p style={styles.commentUser}>
                  <strong>{comment.username}</strong>
                </p>
                <p style={styles.commentText}>{comment.body}</p>
              </div>
            ))}
          </div> */}

          {/* コメント投稿フォーム */}
          {/* <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
            <textarea
              placeholder="美味しい予感がしたらコメントを残そう！"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              style={styles.textarea}
            /> */}
            {/* {commentError && <p style={styles.errorText}>{commentError}</p>} */}
            {/* <button type="submit" style={styles.submitBtn}>
              コメントを投稿する
            </button>
          </form>
        </div> */}
      </main>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#fdfbf7",
    minHeight: "100vh",
    color: "#5c4033",
    fontFamily: "sans-serif",
  },
  main: { maxWidth: "800px", margin: "0 auto", padding: "20px" },
  backNav: { marginBottom: "20px" },
  backLink: {
    color: "#8b7355",
    textDecoration: "none",
    fontWeight: "bold" as "bold",
  },
  detailCard: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(220, 210, 195, 0.3)",
    border: "1px solid #f3ebe1",
    marginBottom: "30px",
  },
  recipeImg: { width: "100%", height: "350px", objectFit: "cover" as "cover" },
  cardBody: { padding: "30px" },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as "wrap",
    gap: "10px",
  },
  title: { fontSize: "28px", color: "#5c4033", margin: 0 },
  ownerActions: { display: "flex", gap: "10px" },
  editBtn: {
    background: "#e6c5a3",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold" as "bold",
  },
  deleteBtn: {
    background: "#e97474",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold" as "bold",
  },
  meta: { color: "#888", fontSize: "14px", marginTop: "10px" },
  tags: { display: "flex", gap: "8px", marginTop: "10px" },
  tag: {
    background: "#f3ebe1",
    color: "#a08060",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold" as "bold",
  },
  divider: {
    border: "none",
    borderBottom: "1px solid #f3ebe1",
    margin: "25px 0",
  },
  subTitle: {
    fontSize: "18px",
    color: "#6e5643",
    borderLeft: "4px solid #e6c5a3",
    paddingLeft: "10px",
    marginBottom: "12px",
  },
  textBlock: {
    whiteSpace: "pre-wrap" as "pre-wrap",
    lineHeight: "1.6",
    color: "#5c4033",
    marginBottom: "25px",
  },
  commentSection: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(220, 210, 195, 0.3)",
    border: "1px solid #f3ebe1",
  },
  commentTitle: { fontSize: "18px", color: "#5c4033", marginBottom: "20px" },
  commentList: {
    display: "flex",
    flexDirection: "column" as "column",
    gap: "15px",
    marginBottom: "25px",
  },
  commentCard: {
    background: "#fcfbfa",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #f3ebe1",
  },
  commentUser: { margin: "0 0 4px 0", fontSize: "14px", color: "#6e5643" },
  commentText: { margin: 0, fontSize: "14px", color: "#5c4033" },
  commentForm: {
    display: "flex",
    flexDirection: "column" as "column",
    gap: "10px",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #dcd0c0",
    outline: "none",
    resize: "none" as "none",
    fontSize: "14px",
    fontFamily: "sans-serif",
  },
  submitBtn: {
    background: "#8b7355",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold" as "bold",
    alignSelf: "flex-end",
  },
  errorText: { color: "#e97474", fontSize: "12px", margin: 0 },
};
