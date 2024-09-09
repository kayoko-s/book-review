import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "../LoginForm";
import { expect, test } from "vitest";
import React from "react";

// テスト１
test("renders login from with email and password fields and a submit button", () => {
  render(<LoginForm />);

  // フォームのレンダリング確認
  expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument();
  const buttons = screen.getAllByRole("button", { name: /ログイン/i });
  expect(buttons.length).toBeGreaterThan(0);
});

// テスト2
test("shows error message when form is submitted with empty fields", () => {
  render(<LoginForm />);

  const buttons = screen.getAllByRole("button", { name: /ログイン/i });
  if (buttons.length > 0) {
    fireEvent.click(buttons[0]);
  }

  expect(
    screen.getAllByText(/メールアドレスとパスワードを入力してください/i)
  ).toHaveLength(1); // メッセージが１つだけ存在することを確認
});

// テスト3
test("shows error message for invalid email", () => {
  render(<LoginForm />);

  fireEvent.change(screen.getByLabelText(/メールアドレス/i), {
    target: { value: "invalidemail" },
  });
  fireEvent.change(screen.getByLabelText(/パスワード/i), {
    target: { value: "password123" },
  });
  fireEvent.click(screen.getAllByRole("button", { name: /ログイン/i })[0]);

  expect(screen.getByText(/メールアドレスが無効です/i)).toBeInTheDocument();
});

// 実行は  yarn vitest
