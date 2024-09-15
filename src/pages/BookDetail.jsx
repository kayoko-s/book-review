import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const BookDetail = () => {
  const { id } = useParams(); // URL パラメータから書籍IDを取得
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // 書籍情報を取得
        const response = await axios.get(
          `https://railway.bookreview.techtrain.dev/books/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("書籍情報の取得に失敗しました。");
        navigate("/book-reviews"); // エラーが発生した場合、一覧画面に戻る
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div>
      <h1>タイトル：{book.title}</h1>
      <p>URL：{book.url}</p>
      <p>詳細：{book.detail}</p>
      <p>レビュー：{book.review}</p>
      <p>レビュアー：{book.reviewer}</p>
      <p>自分のレビュー：{book.isMine ? "はい" : "いいえ"}</p>
    </div>
  );
};

export default BookDetail;
