# teamB_section7

# 1. コンテナを一度停止して削除
`docker-compose down`

# 2. 再びバックグラウンドで起動
`docker-compose up -d`

# 3.Dockerの再構築
`docker-compose up -d --build`


# Dev Containers を使う（推奨）
VSCodeごとコンテナの中に入り込む方法です。
メリット： PC側にPythonを1ミリも入れなくていい。メンバー全員が完全に同じエディタ環境になり、コードの自動補完やエラーチェックが100%正確に動く。
デメリット： 初回に拡張機能を入れたり、コンテナを開き直したりする手惑いがある（慣れれば数秒です）。

1. 必要なVSCode拡張機能のインストール
VSCodeの拡張機能（左側のテトリスのようなアイコン）から、以下の2つを検索してインストールしてください。
- Dev Containers（Microsoft公式）
- Python（Microsoft公式）

2. VSCodeの左下の 「><」のような青いマーク を押します。

画面上部に出てくるメニューから、「実行中のコンテナにアタッチする...（Attach to Running Container...）」 を探してクリックします。
動いているコンテナの一覧が表示されるので、その中から cooking_backend を選びます。

3. コンテナ内のフォルダを開く手順
VSCodeの左上にある 「ファイル（File）」 ＞ 「フォルダーを開く（Open Folder...）」 をクリックします。
画面上部に入力バーが表示され、現在のパス（場所）が表示されます。
今回のバックエンドのDockerfileで WORKDIR /app と設定しているので、入力バーに /app と入力されていることを確認します（もし違っていたら /app と打ち込んでください）。
「OK」 ボタン（またはEnterキー）を押します。