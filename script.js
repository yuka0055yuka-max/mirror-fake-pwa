document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("upload").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = document.getElementById("preview");
      img.onload = function () {
        EXIF.getData(img, function () {
          const allMetaData = EXIF.getAllTags(this);
          const info = JSON.stringify(allMetaData, null, 2);
          document.getElementById("info").textContent = info;

          const score = Object.keys(allMetaData).length;
          document.getElementById("score").textContent =
            score === 0
              ? "✅ フェイクの可能性は低い（Exifなし）"
              : `⚠️ フェイク判定スコア: ${score}`;
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("cleanBtn").addEventListener("click", function () {
    const img = document.getElementById("preview");
    if (!img.src) return;

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(function (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.getElementById("download");
      link.href = url;
      link.download = "safe_image.jpg";
      link.style.display = "inline";
      link.textContent = "✅ 削除完了！安全な画像をダウンロード";
    }, "image/jpeg", 0.95);
  });
});
