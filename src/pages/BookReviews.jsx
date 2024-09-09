import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import bookReviewsSlice from "../store/bookReviewsSlice";
import ReviewItem from "../components/ReviewItem"; // ReviewItemコンポーネントを後で作成
import Cookies from "js-cookie"; // js-cookie をインポート

const BookReviews = () => {
  const reviews = useSelector((state) => state.reviews);
  const dispatch = useDispatch();
  console.log(reviews);

  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        console.log("Token from cookies:", token); // トークンが正しく取得できているか確認

        const response = await axios.get(
          `https://railway.bookreview.techtrain.dev/books?offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // トークンをリクエストヘッダーに設定
            },
          }
        );
        console.log(response.data);
        dispatch(bookReviewsSlice.actions.setReviews(response.data));
      } catch (error) {
        console.error("Error fetching book reviews", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [offset, dispatch]);

  const handleNext = () => {
    setOffset(offset + 10);
  };

  const handlePrevious = () => {
    if (offset > 0) {
      setOffset(offset - 10);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="leading-6 bg-slate-100 font-normal p-4">
      <h1 className="h1 leading-6 mb-6">書籍レビュー一覧</h1>
      <ul className="font-normal list-none p-0">
        {reviews &&
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
