/* 
test: Playwrightのテストケースを定義するための関数。
expect: テストの結果が期待通りであるかどうかを検証するための関数。
*/
import { test, expect } from '@playwright/test';
// import LoginForm from '../LoginForm';

//test.describe は、関連するテストケースをグループ化するための関数。ここでは「ログイン画面のテスト」という名前のスイートを定義

/* 
  テストケース 1: 無効なメールアドレスのチェック
    目的: メールアドレスが無効な場合にエラーメッセージが表示されるかを確認します。
*/
test.describe('ログイン画面のテスト', () => {
  test('メールアドレスが無効な場合にエラーメッセージが表示されること', async ({ page }) => {
    await page.goto('http://localhost:5173'); // ログイン画面にアクセスします。

    await page.fill('#email', 'invalid-email'); // メールアドレスフィールドに無効なメールアドレスを入力。
    await page.fill('#password', 'password123'); // パスワードフィールドに任意のパスワードを入力。
    await page.click('button[type="submit"]'); // 「ログイン」ボタンをクリック。

    const errorMessage = await page.locator('p').textContent(); // エラーメッセージが表示されるかを取得。
    expect(errorMessage).toContain('メールアドレスが無効です'); // エラーメッセージが「メールアドレスが無効です」と含まれていることを確認。
  });

  /*
  テストケース 2: 入力不足のチェック
    目的: メールアドレスやパスワードが未入力の場合にエラーメッセージが表示されるかを確認。
   */
  test('入力が不足している場合にエラーメッセージが表示されること', async ({ page }) => {
    await page.goto('http://localhost:5173'); // ログイン画面にアクセス。

    await page.fill('#email', ''); // メールアドレスフィールドを空に。
    await page.fill('#password', ''); // パスワードフィールドも空に。
    await page.click('button[type="submit"]'); // 「ログイン」ボタンをクリック。

    const errorMessage = await page.locator('p').textContent(); // エラーメッセージが表示されるかを取得。
    expect(errorMessage).toContain('メールアドレスとパスワードを入力してください'); // エラーメッセージが「メールアドレスとパスワードを入力してください」と含まれていることを確認。
  });

  /*
  テストケース 3: 正しい入力のチェック
    目的: メールアドレスとパスワードが正しい場合にエラーメッセージが表示されないことを確認します。
  */
  test('正しい入力の場合にエラーメッセージが表示されないこと', async ({ page }) => {
    await page.goto('http://localhost:5173'); // ログイン画面にアクセスします。

    await page.fill('#email', 'valid@example.com'); // メールアドレスフィールドに正しいメールアドレスを入力します。
    await page.fill('#password', 'password123'); // パスワードフィールドに正しいパスワードを入力します。
    await page.click('button[type="submit"]'); // 「ログイン」ボタンをクリックします

    const errorMessage = await page.locator('p').count(); // エラーメッセージの数をカウントします。
    expect(errorMessage).toBe(0); // エラーメッセージが表示されていない（数が0）ことを確認します。
  });
});

/*
自分へのメッセージ
ターミナルで以下のコマンドを実行してテスト開始
npx playwright test
*/ 
