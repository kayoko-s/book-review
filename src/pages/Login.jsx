import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useState } from "react";
import Cookie from "js-cookie";

// バリデーションスキーマの定義
const schema = Yup.object().shape({
  email: Yup.string()
    .email("無効なメールアドレスです")
    .required("メールアドレスは必須です"),
  password: Yup.string()
    .min(6, "パスワードは6文字以上必要です")
    .required("パスワードは必須です"),
});

// ログイン処理関数
const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      "https://railway.bookreview.techtrain.dev/signin",
      { email, password }
    );
    return response.data.token; // トークンを返す
  } catch (error) {
    console.error("Login error", error.response?.data || error.message);
    throw error;
  }
};

// ユーザー情報取得処理関数
const getUserInfo = async (token) => {
  try {
    const response = await axios.get(
      "https://railway.bookreview.techtrain.dev/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Get user info error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [userInfo, setUserInfo] = useState(null);

  // フォーム送信ハンドラー
  const onSubmit = async (data) => {
    try {
      // ユーザー認証
      const token = await loginUser(data.email, data.password);
      Cookie.set("token", token);

      // ユーザー情報取得
      const user = await getUserInfo(token);
      setUserInfo(user);

      // ログイン成功メッセージ
      alert("ログインに成功しました");
    } catch (error) {
      console.error("Login error", error.message);
      alert("ログインに失敗しました");
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
            className="m-1 outline outline-gray-300 rounded"
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
            className="m-1 outline outline-gray-300 rounded"
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
      {userInfo && (
        <div>
          <a className="hover:text-blue-700 a ml-2" href="/book-reviews">
            書籍一覧表へ
          </a>
          <h2>ユーザー情報</h2>
          <p>名前： {userInfo.name}</p>
          <img src={userInfo.iconUrl} alt="User Icon" />
        </div>
      )}
    </div>
  );
};

export default Login;
