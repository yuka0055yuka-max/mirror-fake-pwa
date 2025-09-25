# 🪞 mirror_fake Lite

**mirror_fake Lite** は、画像のExif情報を解析し、加工の痕跡をスコア化することで「フェイクの可能性」を診断できるオフラインツールです。さらに、Exif情報を削除して安全な画像として再出力することも可能です。

このツールはWebブラウザ上で動作しますが、すべての処理はユーザーの端末内で完結する **オフライン対応のPWA（Progressive Web App）** です。画像は外部に送信されることなく、安全に解析・加工されます。

📡 公開ページ：  
👉 [https://yuka0055yuka-max.github.io/mirror-fake-pwa/](https://yuka0055yuka-max.github.io/mirror-fake-pwa/)

---

## 🔍 機能一覧

- **Exif診断**：画像に含まれるメタデータ（撮影日時、GPS、ソフトウェア情報など）を解析  
- **加工の疑いスコア表示**：Photoshop痕跡や日時の不一致などを元にスコアリング  
- **理由の可視化**：なぜそのスコアになったのか、具体的な根拠をリスト表示  
- **Exif削除機能**：Canvasで再描画し、Exifを完全除去した画像を生成  
- **安全画像のダウンロード**：削除済み画像をワンクリックで保存  
- **デモ画像で試せる**：加工済み／未加工のサンプル画像を使って機能を体験可能（※Lite版では非搭載）

---

## 🧠 スコアリングロジックの例

| 条件 | 加点 |
|------|------|
| ソフトウェア項目に "Adobe Photoshop" の痕跡 | +40% |
| 撮影日時とデジタル化日時が不一致 | +20% |
| GPS情報が手動で追加された可能性 | +15% |
| 加工ソフトの痕跡（ProcessingSoftware） | +25% |

---

## 📦 使い方

1. 画像を選択  
2. Exif情報と加工スコアが表示される  
3. 必要に応じて「Exif削除」ボタンを押す  
4. 安全な画像をダウンロード

---

## 📸 出力画像について

- 出力される画像は、**元の解像度（ピクセルサイズ）を保持**しています  
- Exif情報（回転・GPS・ソフトウェア履歴など）は完全に削除されます  
- 画像の見た目が変わる場合があります（例：縦横の補正が消える）

---

## ⚠️ 利用上の注意

- 本ツールはExif情報を元に **加工の可能性を推定するものであり、100%の正確性を保証するものではありません**  
- 診断結果の利用は **すべて自己責任** でお願いします  
- 画像はすべて **オフラインで処理され、外部に送信されることはありません**

---

## 🧑‍💻 クレジット

- 開発：**YUME**  
- ライセンス：MIT License  
- 公開ページ：[mirror_fake Lite](https://yuka0055yuka-max.github.io/mirror-fake-pwa/)

---

## 📜 ライセンス

このプロジェクトは [MIT License](LICENSE) のもとで公開されています。  
誰でも自由に利用・改変・再配布が可能です。




# 🪞 mirror_fake Lite (English Version)

**mirror_fake Lite** is an offline tool that analyzes the Exif metadata of images and calculates a score to estimate the likelihood of digital manipulation. It also allows users to remove Exif data and export a clean, safe version of the image.

This tool runs entirely in your web browser and performs all operations locally on your device. It is a **Progressive Web App (PWA)**, meaning it works offline and does not send any images or data to external servers.

📡 Live site:  
👉 [https://yuka0055yuka-max.github.io/mirror-fake-pwa/](https://yuka0055yuka-max.github.io/mirror-fake-pwa/)

---

## 🔍 Features

- **Exif Analysis**: Extracts metadata such as timestamp, GPS location, camera model, and editing software  
- **Manipulation Score**: Calculates a score based on signs of editing or inconsistencies in metadata  
- **Reason Breakdown**: Displays the reasons behind the score in a clear, readable format  
- **Exif Removal**: Uses Canvas to redraw the image and strip all metadata  
- **Safe Image Download**: Allows users to download the cleaned image with one click  
- **Demo Images**: Try the tool with sample edited and unedited images (not included in Lite version)

---

## 🧠 Scoring Logic Examples

| Condition | Score |
|-----------|-------|
| "Adobe Photoshop" detected in software tag | +40% |
| Mismatch between original and digitized timestamps | +20% |
| GPS data appears manually added | +15% |
| Editing software detected in ProcessingSoftware tag | +25% |

---

## 📦 How to Use

1. Select an image  
2. View Exif metadata and manipulation score  
3. Click the “Remove Exif” button if needed  
4. Download the safe image

---

## 📸 About the Output Image

- The output image retains its **original resolution**  
- All Exif metadata (rotation, GPS, editing history) is **completely removed**  
- Visual changes may occur (e.g., rotation correction may be lost)

---

## ⚠️ Disclaimer

- This tool provides an **estimated score** based on Exif metadata and does **not guarantee 100% accuracy**  
- Use the results **at your own discretion**  
- All image processing is done **offline**, and no data is transmitted externally

---

## 🧑‍💻 Credits

- Developer: **YUME**  
- License: MIT License  
- Live site: [mirror_fake Lite](https://yuka0055yuka-max.github.io/mirror-fake-pwa/)

---

## 📜 License

This project is released under the [MIT License](LICENSE).  
You are free to use, modify, and redistribute it.
