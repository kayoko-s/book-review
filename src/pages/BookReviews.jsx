import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setReviews, setLoading } from "../store/bookReviewsSlice";
import ReviewItem from "../components/ReviewItem";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const BookReviews = () => {
  const reviews = useSelector((state) => state.bookReviews.reviews); // 修正: state.bookReviewsからレビューを取得
  const loading = useSelector((state) => state.bookReviews.loading); // 修正: state.bookReviewsからローディング状態を取得
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      dispatch(setLoading(true)); // 修正: ローディング状態を設定
      try {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `https://railway.bookreview.techtrain.dev/books?offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(setReviews(response.data));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // トークンが期限切れの場合の処理
          console.error("Token is expired. Redirecting to login.");
          Cookies.remove("token"); // トークンを削除
          Cookies.remove("userName"); // ユーザー名も削除
          navigate("/login"); // ログイン画面にリダイレクト
        } else {
          console.error("Error fetching book reviews", error.message);
        }
      } finally {
        dispatch(setLoading(false)); // 修正: ローディング状態を解除
      }
    };

    fetchReviews();
  }, [offset, dispatch, navigate]);

  const handleNext = () => {
    setOffset(offset + 10);
  };

  const handlePrevious = () => {
    if (offset > 0) {
      setOffset(offset - 10);
    }
  };

  const userName = Cookies.get("userName") || "ゲスト"; // ここでユーザー名を取得し表示する

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="leading-6 bg-slate-100 font-normal p-4">
      <header className="mb-6">
        <h1 className="h1 leading-6 mb-6">書籍レビュー一覧</h1>
        <div>
          {userName !== "ゲスト" ? (
            <span>こんにちは、{userName}さん</span>
          ) : (
            <a
              className="btn bg-blue-500 text-white py-2 px-4 rounded"
              href="/login"
            >
              ログイン
            </a>
          )}
        </div>
      </header>
      <ul className="font-normal list-none p-0">
        {Array.isArray(reviews) &&
          reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
      </ul>
      <div className="flex justify-between mt-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handlePrevious}
          disabled={offset === 0}
        >
          前へ
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleNext}
        >
          次へ
        </button>
      </div>
    </div>
  );
};

export default BookReviews;
