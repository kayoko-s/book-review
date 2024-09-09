import { configureStore } from "@reduxjs/toolkit";
import bookReviewsReducer from "./bookReviewsSlice";

const store = configureStore({
  reducer: {
    BookReviews: bookReviewsReducer,
  },
});

export default store;
