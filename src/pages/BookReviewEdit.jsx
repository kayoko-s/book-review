import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const BookReviewEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState({
    title: "",
    url: "",
    detail: "",
    review: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchReview = async () => {
      setLoading(true);
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `https://railway.bookreview.techtrain.dev/books/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReview(response.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching review data");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.put(
        `https://railway.bookreview.techtrain.dev/books/${id}`,
        review,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/book-reviews");
    } catch (err) {
      console.error(err);
      setError("Error updating review");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("このレビューを削除しますか？")) {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        await axios.delete(
          `https://railway.bookreview.techtrain.dev/books/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        navigate("/book-reviews");
      } catch (err) {
        console.error(err);
        setError("Error deleting review");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">書籍レビュー編集</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="title">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={review.title}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="url">
            URL
          </label>
          <input
            type="text"
            id="url"
            name="url"
            value={review.url}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="detail">
            詳細
          </label>
          <textarea
            id="detail"
            name="detail"
            value={review.detail}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="review">
            レビュー
          </label>
          <textarea
            id="review"
            name="review"
            value={review.review}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          更新
        </button>
      </form>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        削除
      </button>
    </div>
  );
};

export default BookReviewEdit;
