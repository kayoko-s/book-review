import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setReviews, setLoading } from "../store/bookReviewsSlice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/logout";
import ReviewItem from "../components/ReviewItem";

const BookReviews = () => {
  const reviews = useSelector((state) => state.bookReviews.reviews);
  const loading = useSelector((state) => state.bookReviews.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const [userName, setUserName] = useState(null);

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchReviews = async () => {
      dispatch(setLoading(true));
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const userResponse = await axios.get(
          `https://railway.bookreview.techtrain.dev/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserName(userResponse.data.name);

        const reviewsResponse = await axios.get(
          `https://railway.bookreview.techtrain.dev/books?offset=${offset}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(setReviews(reviewsResponse.data));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Token is expired. Redirecting to login.");
          Cookies.remove("token");
          setUserName(null);
          navigate("/login");
        } else {
          console.error("Error fetching book reviews", error.message);
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchReviews();
  }, [offset, token]);

  const handleNext = () => {
    setOffset(offset + 10);
  };

  const handlePrevious = () => {
    if (offset > 0) {
      setOffset(offset - 10);
    }
  };

  const handleLogout = () => {
    logout();
    setUserName(null);
    navigate("/login");
  };

  const handleDelete = (id) => {
    dispatch(setReviews(reviews.filter((review) => review.id !== id)));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="leading-6 bg-slate-100 font-normal p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-6">書籍レビュー一覧</h1>
        <div>
          {token ? (
            <>
              {userName ? (
                <>
                  <span>こんにちは、{userName}さん</span>
                  <a
                    className="btn bg-blue-500 text-zinc-500 py-2 px-4 rounded m-2"
                    href="/profile"
                  >
                    ユーザー情報編集
                  </a>
                  <button
                    onClick={handleLogout}
                    className="btn bg-red-500 text-zinc-500 py-2 px-4 rounded m-2"
                  >
                    ログアウト
                  </button>
                  <a
                    className="btn bg-blue-500 text-zinc-500 py-2 px-4 rounded m-2"
                    href="/book-reviews/new"
                  >
                    新しいレビューを登録
                  </a>
                </>
              ) : (
                <div>Loading user info...</div>
              )}
            </>
          ) : (
            <a
              className="btn bg-blue-500 text-zinc-500 py-2 px-4 rounded m-2"
              href="/login"
            >
              ログイン
            </a>
          )}
        </div>
      </header>
      <ul className="list-none p-0">
        {Array.isArray(reviews) &&
          reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              isCurrentUser={token && review.reviewer === userName}
              onDelete={handleDelete}
            />
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
