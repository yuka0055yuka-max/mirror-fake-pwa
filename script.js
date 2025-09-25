document.addEventListener("DOMContentLoaded", function () {
  const uploadInput = document.getElementById("upload");
  const resultsDiv = document.getElementById("results");
  const downloadBtn = document.getElementById("downloadSelected");

  const circleLength = 2 * Math.PI * 45;
  const selectedSafeImages = [];

  function analyzeExif(meta) {
    let score = 0;
    let reasons = [];

    if (meta.Software) {
      score += 40;
      reasons.push(`🖌 編集ソフトの痕跡: ${meta.Software}`);
    }
    if (meta.DateTimeOriginal && meta.DateTimeDigitized && meta.DateTimeOriginal !== meta.DateTimeDigitized) {
      score += 30;
      reasons.push(`⏰ 日時の不一致`);
    }
    if (meta.GPSLatitude || meta.GPSLongitude) {
      score += 15;
      reasons.push(`📍 GPS情報あり`);
    }
    if (meta.Orientation && meta.Orientation !== 1) {
      score += 15;
      reasons.push(`🔄 画像の向きが標準ではない`);
    }

    return { score: Math.min(score, 100), reasons };
  }

  function createCard(file, dataURL, analysis, meta) {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = dataURL;
    img.className = "preview";

    const scoreText = document.createElement("p");
    scoreText.innerHTML = `スコア: <strong>${analysis.score}%</strong>`;

    const reasonsList = document.createElement("ul");
    analysis.reasons.forEach(reason => {
      const li = document.createElement("li");
      li.textContent = reason;
      reasonsList.appendChild(li);
    });

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";

    const cleanBtn = document.createElement("button");
    cleanBtn.textContent = "Exif削除して安全化";
    cleanBtn.className = "button danger";

    cleanBtn.addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const tempImg = new Image();
      tempImg.src = dataURL;
      tempImg.onload = () => {
        canvas.width = tempImg.naturalWidth;
        canvas.height = tempImg.naturalHeight;
        ctx.drawImage(tempImg, 0, 0);
        canvas.toBlob(blob => {
          const safeURL = URL.createObjectURL(blob);
          selectedSafeImages.push({ url: safeURL, name: file.name.replace(/\.[^/.]+$/, "") + "_safe.jpg", checkbox });
          cleanBtn.textContent = "✅ 安全化完了";
          cleanBtn.disabled = true;
        }, "image/jpeg", 0.95);
      };
    });

    card.appendChild(img);
    card.appendChild(scoreText);
    card.appendChild(reasonsList);

    if (analysis.score >= 40) {
      card.appendChild(cleanBtn);
      card.appendChild(checkbox);
    }

    resultsDiv.appendChild(card);
  }

  uploadInput.addEventListener("change", function (e) {
    resultsDiv.innerHTML = "";
    selectedSafeImages.length = 0;

    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const dataURL = event.target.result;
        const img = new Image();
        img.src = dataURL;
        img.onload = function () {
          EXIF.getData(img, function () {
            const meta = EXIF.getAllTags(this);
            const analysis = analyzeExif(meta);
            createCard(file, dataURL, analysis, meta);
          });
        };
      };
      reader.readAsDataURL(file);
    });
  });

  downloadBtn.addEventListener("click", () => {
    selectedSafeImages.forEach(item => {
      if (item.checkbox.checked) {
        const a = document.createElement("a");
        a.href = item.url;
        a.download = item.name;
        a.click();
      }
    });
  });
});
