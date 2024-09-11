import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import BookReviews from "./pages/BookReviews";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import bookReviewsReducer from "./store/bookReviewsSlice";
import Cookies from "js-cookie";
import PrivateRoute from "./components/PrivateRoute"; // PrivateRoute をインポート

const store = configureStore({
  reducer: {
    bookReviews: bookReviewsReducer, // 変更: スライスのリデューサーを指定
  },
});

const App = () => {
  const isAuthenticated = !!Cookies.get("token");

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/signup"
            element={
              isAuthenticated ? <Navigate to="/book-reviews" /> : <Signup />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/book-reviews" /> : <Login />
            }
          />
          <Route
            path="/book-reviews"
            element={<PrivateRoute element={<BookReviews />} />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
