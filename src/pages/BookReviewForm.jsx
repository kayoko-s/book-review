import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const BookReviewForm = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [detail, setDetail] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // エラーメッセージを表示するための状態
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // フォーム送信前にエラーをリセット

    try {
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // フォームデータのバリデーション
      if (!title.trim() || !review.trim()) {
        setError("タイトルとレビューの両方を入力してください。");
        setLoading(false);
        return;
      }

      // データの送信
      await axios.post(
        "https://railway.bookreview.techtrain.dev/books",
        {
          title,
          url,
          detail,
          review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 投稿成功後に一覧画面にリダイレクト
      navigate("/book-reviews");
    } catch (error) {
      if (error.response) {
        // サーバーが返したエラーレスポンスを表示
        console.error("Error submitting review", error.response.data);

        // エラーメッセージを詳細に表示
        const errorMessage =
          error.response.data.ErrorMessageJP ||
          error.response.data.ErrorMessageEN ||
          "レビューの送信に失敗しました。";
        setError(errorMessage);
      } else {
        // サーバーエラー以外のエラー
        console.error("Error submitting review", error.message);
        setError("レビューの送信に失敗しました。");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">書籍レビュー登録</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="title">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="url">
            URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="url">
            詳細
          </label>
          <input
            type="text"
            id="detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="review">
            レビュー
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="border rounded p-2 w-full"
            rows="4"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 mb-4">
            {error} {/* エラーメッセージを表示 */}
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "送信中..." : "送信"}
        </button>
      </form>
    </div>
  );
};

export default BookReviewForm;
