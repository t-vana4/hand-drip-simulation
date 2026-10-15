# ハンドドリップ ダイヤルイン

湯量・湯温・抽出時間を動かして、一杯の味のバランスを探るシミュレーター。iPhone のホーム画面に追加すると、アプリとしてオフラインでも動く。淹れた記録（豆の名前・感想つき）は端末の中に残る。

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | アプリ本体（画面・計算・記録） |
| `manifest.webmanifest` | アプリ名・アイコン・全画面表示の設定 |
| `sw.js` | オフラインで開けるようにする仕組み（Service Worker） |
| `icons/` | ホーム画面用アイコン |

パスはすべて相対指定なので、リポジトリ名は何でもよい。

## GitHub Pages で公開する

1. GitHub で新しいリポジトリを作る（例: `hand-drip`）。
   - Public なら無料で Pages を使える。Private で使う場合は有料プラン（Pro / Team / Enterprise）が必要。
2. このフォルダの中身をリポジトリ直下に置いて push する。

   ```sh
   git init
   git add .
   git commit -m "Add hand drip dial-in app"
   git branch -M main
   git remote add origin git@github.com:<ユーザー名>/hand-drip.git
   git push -u origin main
   ```

   コマンドを使わない場合は、リポジトリ画面の「Add file → Upload files」にフォルダの中身をドラッグしてもよい。
3. リポジトリの **Settings → Pages** を開き、**Build and deployment** を次のようにして Save する。
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)`
4. 数分後、`https://<ユーザー名>.github.io/hand-drip/` で開けるようになる。

## iPhone に入れる

1. iPhone の **Safari** で公開した URL を開く。
2. 共有ボタン →「**ホーム画面に追加**」を選ぶ。「Web アプリとして開く」の項目がある場合はオンのままにする。
3. ホーム画面のアイコンから起動する。一度開いたあとは、電波がなくても使える。

## 更新するとき

- `index.html` を直して push すれば、次にオンラインで開いたときに新しい版が読み込まれる。
- アイコンなど `index.html` 以外のファイルを差し替えたときは、`sw.js` の `VERSION`（例: `v1` → `v2`）も上げてから push する。

## 記録について

- 記録と最後に使ったレシピは、ブラウザの保存領域（localStorage）に保存される。サーバーには送られない。
- ホーム画面のアプリと、Safari で開いたページは保存場所が別。記録はアプリ側で付ける。
- ホーム画面のアイコンを削除すると、記録も消える。他の端末とは同期しない。
- `<ユーザー名>.github.io` の下にある他の Pages サイトとは保存領域を共有する（キー名を分けているので混ざることはない）。

## 補足

- 抽出中は画面が消灯しないようにしている。iOS のバージョンによっては効かない場合がある。
- フォントは Google Fonts から読み込み、一度読み込んだ分は端末に保存される。オフラインで未保存の文字は、iPhone 内蔵の明朝体・ゴシック体で表示される。
- 数値は簡易モデルによる目安。
