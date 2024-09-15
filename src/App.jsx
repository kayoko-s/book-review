import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import BookReviews from "./pages/BookReviews";
import BookReviewForm from "./pages/BookReviewForm";
import BookReviewEdit from "./pages/BookReviewEdit";
import BookDetail from "./pages/BookDetail";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import bookReviewsReducer from "./store/bookReviewsSlice";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";

const store = configureStore({
  reducer: {
    bookReviews: bookReviewsReducer,
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/book-reviews"
            element={<PrivateRoute element={<BookReviews />} />}
          />
          <Route
            path="/book-reviews/new"
            element={<PrivateRoute element={<BookReviewForm />} />}
          />
          <Route
            path="/book-reviews/edit/:id"
            element={<PrivateRoute element={<BookReviewEdit />} />}
          />
          <Route
            path="/detail/:id"
            element={<PrivateRoute element={<BookDetail />} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute element={<Profile />} />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
