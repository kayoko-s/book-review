import { createSlice } from "@reduxjs/toolkit";

const bookReviewsSlice = createSlice({
  name: "bookReviews",
  initialState: {
    reviews: [],
    offset: 0,
    loading: false,
  },
  reducers: {
    setReviews(state, action) {
      state.reviews = action.payload;
    },
    setOffset(state, action) {
      state.offset = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export default bookReviewsSlice;
