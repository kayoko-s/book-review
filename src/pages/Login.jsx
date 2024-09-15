import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// バリデーションスキーマ
const schema = Yup.object().shape({
  email: Yup.string()
    .email("無効なメールアドレスです")
    .required("メールアドレスは必須です"),
  password: Yup.string()
    .min(6, "パスワードは6文字以上必要です")
    .required("パスワードは必須です"),
});

// ユーザーをログインさせる関数
const loginUser = async (email, password) => {
  try {
    const responseLogin = await axios.post(
      "https://railway.bookreview.techtrain.dev/signin",
      { email, password }
    );
    console.log("Login Response:", responseLogin.data); // デバッグ用
    const token = responseLogin.data.token;

    const response = await axios.get(
      "https://railway.bookreview.techtrain.dev/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { token, userName: response.data.name };
  } catch (error) {
    console.error(
      "Error during login or fetching user data",
      error.response ? error.response.data : error.message
    );
    throw error; // エラーを再スローして呼び出し元で処理
  }
};

// ログインコンポーネント
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  // フォーム送信時の処理
  const onSubmit = async (data) => {
    try {
      const { token } = await loginUser(data.email, data.password);
      Cookies.set("token", token);

      alert("ログインに成功しました");
      navigate("/book-reviews");
    } catch (error) {
      console.error(
        "Login error",
        error.resonse ? error.response.data : error.message
      );
      alert(
        "ログインに失敗しました" +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  return (
    <div className="font-inter m-6">
      <h1 className="h1 mb-6">ログイン</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <label htmlFor="email">メールアドレス：</label>
          <input
            id="email"
            className="m-1 outline outline-gray-300 rounded px-2"
            type="email"
            {...register("email")}
            autoComplete="email"
          />
          {errors.email && <div>{errors.email.message}</div>}
        </div>
        <div className="mb-2">
          <label htmlFor="password">パスワード：</label>
          <input
            id="password"
            className="m-1 outline outline-gray-300 rounded px-2"
            type="password"
            {...register("password")}
            autoComplete="current-password"
          />
          {errors.password && <div>{errors.password.message}</div>}
        </div>
        <button
          type="submit"
          className="btn hover:text-blue-700 focus:outline-4 focus-visible:outline-4 outline bg-slate-200"
        >
          ログイン
        </button>

        <a className="hover:text-blue-700 a ml-2" href="/signup">
          新規登録画面へ
        </a>
      </form>
    </div>
  );
};

export default Login;
