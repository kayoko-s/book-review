import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Compressor from "compressorjs";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// バリデーションスキーマの定義
const schema = Yup.object().shape({
  name: Yup.string().required("ユーザー名は必須です"), // これは後ほど消すかも
  email: Yup.string()
    .email("無効なメールアドレスです")
    .required("メールアドレスは必須です"),
  password: Yup.string()
    .min(6, "パスワードは6文字以上必要です")
    .required("パスワードは必須です"),
  icon: Yup.mixed().required("アイコンは必須です"),
});

// ユーザー作成関数
const createUser = async (name, email, password) => {
  const response = await axios.post(
    "https://railway.bookreview.techtrain.dev/users",
    {
      name,
      email,
      password,
    }
  );
  console.log("Create User Response:", response.data); // デバッグ用
  return response.data; // token と idを含むデータを返す
};

// アイコン画像のアップロード
const uploadIcon = async (file, token) => {
  const formData = new FormData();
  formData.append("icon", file);

  const response = await axios.post(
    "https://railway.bookreview.techtrain.dev/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.iconUrl; // アップロードされたアイコンのURLを返す
};

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  // フォーム送信ハンドラー
  const onSubmit = async (data) => {
    try {
      // ユーザー作成
      const { token } = await createUser(data.name, data.email, data.password);
      Cookies.set("token", token);
      // Cookies.set("userName", userName);

      if (data.icon instanceof File) {
        // 画像をリサイズ
        new Compressor(data.icon, {
          quality: 0.8,
          success: async (compressedFile) => {
            try {
              // アイコン画像のアップロード
              const iconUrl = await uploadIcon(compressedFile, token);
              console.log("Uploaded icon URL:", iconUrl);

              // ユーザー作成とアイコンアップロードが成功したら通知
              alert("ユーザー登録が成功しました");
              navigate("/book-reviews"); // 登録後に書籍レビュー一覧画面にリダイレクト
            } catch (error) {
              console.error("Icon upload error:", error.message);
              alert("アイコンのアップロードに失敗しました");
            }
          },
          error(err) {
            console.error("Compression error:", err);
            alert("アイコンの圧縮に失敗しました");
          },
        });
      } else {
        alert("アイコンの選択に問題があります");
      }
    } catch (error) {
      console.error("User creation error:", error.message);
      alert("ユーザー登録に失敗しました");
    }
  };
  // API 2回呼ぶ usersでtoken取得、upload  トークンを保存、圧縮、アップロードのAPIを呼ぶ！！！

  return (
    <div className="font-inter m-6">
      <h1 className="h1 mb-6">新規登録</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <label htmlFor="name">ユーザー名：</label>
          <input
            id="name"
            className="m-1 outline outline-gray-300 rounded"
            type="text"
            {...register("name")}
            autoComplete="name"
          />
          {errors.name && <div>{errors.name.message}</div>}
        </div>
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
            autoComplete="new-password"
          />
          {errors.password && <div>{errors.password.message}</div>}
        </div>
        <div className="mb-2">
          <label htmlFor="icon">ユーザアイコン：</label>
          <input
            id="icon"
            className="m-1 border-slate-500"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setValue("icon", file);
              }
            }}
          />
          {errors.icon && <div>{errors.icon.message}</div>}
        </div>
        <button
          className="btn hover:text-blue-700 focus:outline-6 focus-visible:outline-4 outline bg-slate-200"
          type="submit"
        >
          登録
        </button>
        <a className="hover:text-blue-700 a ml-2" href="/login">
          ログイン画面へ
        </a>
      </form>
    </div>
  );
};

export default Signup;
