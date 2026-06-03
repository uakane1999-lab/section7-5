import { useState } from "react";

type RecipeFormProps = {
  initialValues?: {
    title: string;
    ingredients: string;
    instructions: string;
  };
  submitLabel: string;
  onSubmit: (data: {
    title: string;
    ingredients: string;
    instructions: string;
  }) => void;
};

export default function RecipeForm({
  initialValues,
  submitLabel,
  onSubmit,
}: RecipeFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [ingredients, setIngredients] = useState(
    initialValues?.ingredients ?? "",
  );
  const [instructions, setInstructions] = useState(
    initialValues?.instructions ?? "",
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !ingredients || !instructions) {
      setError("すべての項目を入力してください");
      return;
    }

    setError("");

    onSubmit({
      title,
      ingredients,
      instructions,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {error && <p style={errorStyle}>{error}</p>}

      <div style={fieldStyle}>
        <label style={labelStyle}>タイトル</label>
        <input
          style={inputStyle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例：オムライス"
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>材料</label>
        <textarea
          style={textareaStyle}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="例：卵、ご飯、ケチャップ"
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>作り方</label>
        <textarea
          style={textareaStyle}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="例：材料を炒めて、卵で包む"
        />
      </div>

      <button type="submit" style={submitButtonStyle}>
        {submitLabel}
      </button>
    </form>
  );
}

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  background: "white",
  padding: 24,
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const labelStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "#333",
};

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: 8,
  fontSize: 14,
};

const textareaStyle: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: 8,
  fontSize: 14,
  minHeight: 100,
};

const submitButtonStyle: React.CSSProperties = {
  padding: "12px",
  background: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  color: "#e53935",
  background: "#ffebee",
  padding: 10,
  borderRadius: 8,
};
