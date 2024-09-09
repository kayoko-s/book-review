import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import BookReviews from "./pages/BookReviews";
import { Provider } from "react-redux";
import { createStore } from "@reduxjs/toolkit";
import bookReviewsSlice from "./store/bookReviewsSlice";
// import LoginForm from "./LoginForm"; // ←unit test用

const store = createStore(bookReviewsSlice.reducer);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/book-reviews"
          element={
            <Provider store={store}>
              <BookReviews />
            </Provider>
          }
        />
        <Route path="/" element={<Login />} /> {/* デフォルトのルート */}
      </Routes>
    </Router>
  );
};

// unit test用
// function App() {
//   return (
//     <div className="App">
//       <LoginForm />
//     </div>
//   );
// }

export default App;
