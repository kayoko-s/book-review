import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const ReviewItem = ({ review, isCurrentUser, onDelete }) => {
  const navigate = useNavigate(); // useNavigateフックを取得

  const handleClick = async () => {
    // 書籍の詳細ページに遷移
    navigate(`/detail/${encodeURIComponent(review.id)}`);

    // 非同期でログを送信
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      await axios.post(
        "https://railway.bookreview.techtrain.dev/logs",
        {
          selectBookId: review.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error sending log:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("このレビューを削除しますか？")) {
      try {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/login");
          return;
        }

        await axios.delete(
          `https://railway.bookreview.techtrain.dev/books/${review.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        onDelete(review.id);
      } catch (error) {
        console.error("Error deleting review", error);
      }
    }
  };

  return (
    <li
      className="border-2 border-solid border-slate-300 rounded-lg p-[15] mb-4 cursor-pointer"
      onClick={handleClick} // クリック時のハンドラを追加
    >
      <h2 className="text-2xl mb-2.5">{review.title}</h2>
      <p className="mb-2.5">{review.detail}</p>
      <p className="italic mb-2.5">レビュー：{review.review}</p>
      <p className="italic mb-2.5">レビュアー： {review.reviewer}</p>
      <a
        href={review.url}
        className="hover:underline no-underline text-blue-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        詳細
      </a>
      {isCurrentUser && (
        <div className="mt-2">
          <a
            href={`/book-reviews/edit/${review.id}`}
            className="btn bg-green-500 text-zinc-500 py-1 px-3 rounded m-2"
          >
            編集
          </a>
          <button
            onClick={handleDelete}
            className="btn bg-red-500 text-zinc-500 py-1 px-3 rounded m-2"
          >
            削除
          </button>
        </div>
      )}
    </li>
  );
};

// プロパティの方を定義する
ReviewItem.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    review: PropTypes.string.isRequired,
    reviewer: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  isCurrentUser: PropTypes.bool,
  onDelete: PropTypes.func,
};

ReviewItem.defaultProps = {
  isCurrentUser: false,
  onDelete: () => {},
};

export default ReviewItem;
