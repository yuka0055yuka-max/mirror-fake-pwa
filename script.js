document.addEventListener("DOMContentLoaded", function () {
  const upload = document.getElementById("upload");
  const preview = document.getElementById("preview");
  const score = document.getElementById("score");
  const info = document.getElementById("info");
  const cleanBtn = document.getElementById("cleanBtn");
  const download = document.getElementById("download");

  function analyzeExif(meta) {
    let score = 0;
    let reasons = [];

    if (meta.Software && /photoshop/i.test(meta.Software)) {
      score += 40;
      reasons.push("🖌 ソフトウェアに 'Adobe Photoshop' の痕跡: +40%");
    }

    if (
      meta.DateTimeOriginal &&
      meta.DateTimeDigitized &&
      meta.DateTimeOriginal !== meta.DateTimeDigitized
    ) {
      score += 20;
      reasons.push("⏰ 撮影日時とデジタル化日時が不一致: +20%");
    }

    if (meta.GPSLatitude || meta.GPSLongitude) {
      score += 15;
      reasons.push("📍 GPS情報が手動で追加された可能性: +15%");
    }

    if (meta.ProcessingSoftware) {
      score += 25;
      reasons.push(`🧪 加工ソフトの痕跡 (${meta.ProcessingSoftware}): +25%`);
    }

    return { score, reasons };
  }

  upload.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      preview.onload = function () {
        EXIF.getData(preview, function () {
          const allMetaData = EXIF.getAllTags(this);
          const rawInfo = JSON.stringify(allMetaData, null, 2);
          info.innerHTML = `<details><summary>📦 Exif生データを表示</summary><pre>${rawInfo}</pre></details>`;

          const analysis = analyzeExif(allMetaData);
          score.textContent =
            analysis.score === 0
              ? "✅ フェイクの可能性は低い（Exifなし）"
              : `⚠️ 加工の疑いスコア: ${analysis.score}%`;
          score.className = analysis.score >= 50 ? "danger" : "safe";

          if (analysis.reasons.length > 0) {
            const list = analysis.reasons.map((r) => `<li>${r}</li>`).join("");
            info.innerHTML += `<ul>${list}</ul>`;
          }
        });
      };
      preview.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  cleanBtn.addEventListener("click", function () {
    if (!preview.src) {
      score.textContent = "❌ 画像が読み込まれていません";
      score.className = "danger";
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = preview.naturalWidth;
    canvas.height = preview.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(preview, 0, 0);

    canvas.toBlob(function (blob) {
      const url = URL.createObjectURL(blob);
      download.href = url;
      download.download = "safe_image.jpg";
      download.style.display = "inline";
      download.textContent = "✅ 削除完了！安全な画像をダウンロード";
      score.textContent = "✅ Exif削除済み、安全な画像です";
      score.className = "safe";
    }, "image/jpeg", 0.95);
  });
});
