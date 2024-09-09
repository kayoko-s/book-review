import PropTypes from "prop-types";

const ReviewItem = ({ review }) => {
  return (
    <li className="border-2 border-solid border-slate-300 rounded-lg p-[15] mb-4">
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
    </li>
  );
};

// プロパティの方を定義する
ReviewItem.propTypes = {
  review: PropTypes.shape({
    title: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    review: PropTypes.string.isRequired,
    reviewer: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReviewItem;
