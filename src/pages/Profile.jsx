// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/logout";

// バリデーションスキーマ
const schema = Yup.object().shape({
  name: Yup.string().required("名前は必須です"),
});

const Profile = () => {
  const [userData, setUserData] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get(
          "https://railway.bookreview.techtrain.dev/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data);
        reset(response.data); // 状態を設定する
      } catch (error) {
        console.error(
          "Error fetching user data",
          error.response ? error.response.data : error.message
        );
        navigate("/login");
      }
    };

    fetchUserData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("token");
      await axios.put("https://railway.bookreview.techtrain.dev/users", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("ユーザー情報が更新されました");
    } catch (error) {
      console.error("Error updating user data", error.message);
      alert("ユーザー情報の更新に失敗しました");
    }
  };

  const handleLogout = (event) => {
    event.preventDefault(); // フォームの送信を防ぐ
    logout(); // トークンを削除し、セッションを終了
    navigate("/login"); // ログイン画面にリダイレクト
  }; // 追加

  return (
    <div className="font-inter m-6">
      <h1 className="h1 mb-6">ユーザー情報編集</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <label htmlFor="name">名前：</label>
          <input
            id="name"
            className="m-1 outline outline-gray-300 rounded"
            type="text"
            {...register("name")}
          />
          {errors.name && <div>{errors.name.message}</div>}
        </div>
        <button
          type="submit"
          className="btn hover:text-blue-700 focus:outline-4 focus-visible:outline-4 outline bg-slate-200"
        >
          更新
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="btn bg-red-500 text-white py-2 px-4 rounded ml-4"
        >
          ログアウト
        </button>
      </form>
      <div className="mt-6">
        <h2 className="h2">ユーザー情報</h2>
        <p>名前： {userData.name || "未設定"}</p>
        <p>メール： {userData.email || "未設定"}</p>
      </div>
    </div>
  );
};

export default Profile;
