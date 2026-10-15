# 余白の珈琲

湯量・湯温・抽出時間・挽き目を動かして、一杯の味のバランスを探るシミュレーター。iPhone のホーム画面に追加すると、アプリとしてオフラインでも動く。淹れた記録（豆の名前・感想つき）は端末の中に残る。

公開中のアプリ: https://t-vana4.github.io/hand-drip-simulation/

ソースコードは [MIT License](LICENSE) で公開している。参照・複製・改変・再配布は自由にしてよい。

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | アプリ本体（画面・計算・記録） |
| `manifest.webmanifest` | アプリ名・アイコン・全画面表示の設定 |
| `sw.js` | オフラインで開けるようにする仕組み（Service Worker） |
| `icons/` | ホーム画面用アイコン |

ビルドは不要。パスはすべて相対指定なので、リポジトリ名は何でもよい。

## 手元で動かす

clone したフォルダで簡易サーバーを起動し、ブラウザで `http://localhost:8000/` を開く。

```sh
git clone https://github.com/t-vana4/hand-drip-simulation.git
cd hand-drip-simulation
python3 -m http.server 8000
```

`index.html` をファイルとして直接開いても動くが、その場合はオフライン用の仕組み（Service Worker）が働かない。

## フォークして自分の GitHub Pages で使う

1. このリポジトリの右上にある **Fork** を押し、自分のアカウントにコピーする。リポジトリ名は変えてもよい。
   - Public リポジトリなら無料で Pages を使える。Private で使う場合は有料プラン（Pro / Team / Enterprise）が必要。
2. フォークしたリポジトリの **Settings → Pages** を開き、**Build and deployment** を次のようにして Save する。
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)`
3. 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` で開けるようになる。

フォークの代わりに、clone したものを自分の新しいリポジトリへ push してもよい。

```sh
git remote set-url origin git@github.com:<ユーザー名>/<リポジトリ名>.git
git push -u origin main
```

## iPhone に入れる

1. iPhone の **Safari** でアプリの URL を開く。
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
- 挽き目は「細挽き・中細挽き・中挽き・中粗挽き・粗挽き」の5段階で、中細挽きを基準に計算する。呼び名が指す粗さはミルによって異なる。
- 挽き目と抽出時間は独立して動かせる。実際の抽出では挽き目で落ちる速さが変わるため、現実には難しい組み合わせも作れる。
- 挽き目を追加する前の記録は、中細挽きで淹れたものとして読み込む。

## ライセンス

[MIT License](LICENSE)。使用・複製・改変・再配布・販売のいずれも自由にしてよい。再配布するときは、著作権表示とライセンス文（`LICENSE` の内容）を残すこと。ソフトウェアは無保証で提供する。

アイコンを含め、このリポジトリに含まれるファイルはすべて同じライセンスに従う。フォント（Shippori Mincho、Zen Kaku Gothic New、DM Mono）は Google Fonts から読み込んでいるだけでリポジトリには含めておらず、それぞれ [SIL Open Font License](https://openfontlicense.org/) に従う。
