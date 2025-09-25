document.getElementById('upload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function() {
    const base64 = reader.result;
    const img = new Image();
    img.onload = function() {
      document.getElementById('preview').src = base64;

      EXIF.getData(img, function() {
        const tags = {
          software: EXIF.getTag(this, 'Software'),
          make: EXIF.getTag(this, 'Make'),
          model: EXIF.getTag(this, 'Model'),
          gps: EXIF.getTag(this, 'GPSLatitude'),
          datetime: EXIF.getTag(this, 'DateTimeOriginal'),
          comment: EXIF.getTag(this, 'UserComment')
        };

        let score = 0;
        let info = '';

        if (tags.software) {
          score += 60;
          info += `加工アプリ: ${tags.software}<br>`;
        }
        if (tags.gps) {
          score += 30;
          info += `GPS情報あり<br>`;
        }
        if (tags.make || tags.model) {
          score += 10;
          info += `機種: ${tags.make || ''} ${tags.model || ''}<br>`;
        }
        if (tags.datetime) {
          score += 10;
          info += `撮影日時: ${tags.datetime}<br>`;
        }
        if (tags.comment) {
          score += 10;
          info += `コメント: ${tags.comment}<br>`;
        }

        document.getElementById('score').innerHTML =
          `加工の疑い：<strong class="${score >= 50 ? 'danger' : 'safe'}">${score}%</strong>`;
        document.getElementById('info').innerHTML = info || 'Exif情報なし';
      });
    };
    img.src = base64;

    document.getElementById('cleanBtn').onclick = function() {
      const stripped = removeExifFromBase64(base64);
      document.getElementById('preview').src = stripped;
      document.getElementById('score').innerHTML =
        `<span class="safe">Exif削除済み。安全な画像です。</span>`;
      document.getElementById('info').innerHTML = '';

      document.getElementById('download').href = stripped;
      document.getElementById('download').download = 'safe_image.jpg';
      document.getElementById('download').style.display = 'inline';
      document.getElementById('download').textContent = '安全な画像をダウンロード';
    };
  };
  reader.readAsDataURL(file);
});
