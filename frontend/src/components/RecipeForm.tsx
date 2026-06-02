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

    onSubmit({
      title,
      ingredients,
      instructions,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}

      <div>
        <label>タイトル</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例：オムライス"
        />
      </div>

      <div>
        <label>材料</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="例：卵、ご飯、ケチャップ"
        />
      </div>

      <div>
        <label>作り方</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="例：材料を炒めて、卵で包む"
        />
      </div>

      <button type="submit">{submitLabel}</button>
    </form>
  );
}
