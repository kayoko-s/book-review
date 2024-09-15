import { configureStore } from "@reduxjs/toolkit";
import bookReviewsReducer from "./bookReviewsSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    BookReviews: bookReviewsReducer,
    user: userReducer,
  },
});

export default store;
