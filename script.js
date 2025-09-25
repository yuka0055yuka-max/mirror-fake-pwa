document.addEventListener("DOMContentLoaded", function () {
    // UI要素の取得
    const uploadInput = document.getElementById("upload");
    const loader = document.getElementById("loader");
    const resultsDiv = document.getElementById("results");
    const previewImg = document.getElementById("preview");
    
    // スコア表示関連
    const scoreText = document.getElementById("score-text");
    const scoreLabel = document.getElementById("score-label");
    const scoreCircleFg = document.getElementById("score-circle-fg");
    const circleLength = 2 * Math.PI * 45; // SVG circleの円周

    // 情報表示関連
    const infoDiv = document.getElementById("info");
    
    // ボタン関連
    const cleanBtn = document.getElementById("cleanBtn");
    const downloadLink = document.getElementById("download");

    // 初期化
    scoreCircleFg.setAttribute("stroke-dasharray", circleLength);
    scoreCircleFg.setAttribute("stroke-dashoffset", circleLength);

    /**
     * Exifデータを解析してスコアと根拠を返す関数
     * @param {object} meta - EXIF.jsから取得したメタデータ
     * @returns {{score: number, reasons: string[]}}
     */
    function analyzeExif(meta) {
        let score = 0;
        let reasons = [];

        // ルール1: ソフトウェア情報
        if (meta.Software) {
            score += 40;
            reasons.push(`🖌 編集ソフトの痕跡: <strong>${meta.Software}</strong> が使用された可能性があります。`);
        }

        // ルール2: 日時情報の不一致
        if (meta.DateTimeOriginal && meta.DateTimeDigitized && meta.DateTimeOriginal !== meta.DateTimeDigitized) {
            score += 30;
            reasons.push(`⏰ 撮影日時とデジタル化日時が一致しません。スキャンや再保存された可能性があります。`);
        }

        // ルール3: GPS情報 (手動追加の可能性を考慮)
        // ここでは単純にGPSがあればスコアを加算
        if (meta.GPSLatitude || meta.GPSLongitude) {
            score += 15;
            reasons.push(`📍 位置情報(GPS)が含まれています。意図せずプライバシーが漏れる可能性があります。`);
        }
        
        // ルール4: 画像の向き (後から回転させた可能性)
        if (meta.Orientation && meta.Orientation !== 1) {
             score += 15;
             reasons.push(`🔄 画像の向きが標準ではありません。撮影後に回転処理が加えられた可能性があります。`);
        }

        // スコアが100を超えないように調整
        score = Math.min(score, 100);

        return { score, reasons };
    }

    /**
     * スコアメーターを更新する関数
     * @param {number} score 
     */
    function updateScoreMeter(score) {
        // 1. パーセンテージテキストを更新
        scoreText.textContent = `${score}%`;

        // 2. メーターの色を更新
        let color = 'var(--safe-color)';
        if (score >= 70) {
            color = 'var(--danger-color)';
            scoreLabel.textContent = '🚨 フェイクの可能性が非常に高いです';
        } else if (score >= 40) {
            color = 'var(--warning-color)';
            scoreLabel.textContent = '⚠️ 加工されている疑いがあります';
        } else {
            scoreLabel.textContent = '✅ フェイクの可能性は低いです';
        }
        scoreCircleFg.style.stroke = color;

        // 3. メーターのアニメーション
        const offset = circleLength - (score / 100) * circleLength;
        scoreCircleFg.setAttribute("stroke-dashoffset", offset);
    }
    
    /**
     * 画像が選択されたときの処理
     */
    uploadInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        // 結果を非表示にし、ローダーを表示
        resultsDiv.style.display = "none";
        downloadLink.style.display = "none";
        loader.style.display = "block";

        const reader = new FileReader();
        reader.onload = function (event) {
            previewImg.src = event.target.result;
            
            previewImg.onload = function () {
                EXIF.getData(previewImg, function () {
                    const allMetaData = EXIF.getAllTags(this);
                    const analysis = analyzeExif(allMetaData);

                    // 結果を表示
                    displayResults(analysis, allMetaData);

                    // ローダーを非表示にし、結果を表示
                    loader.style.display = "none";
                    resultsDiv.style.display = "block";
                });
            };
        };
        reader.readAsDataURL(file);
    });

    /**
     * 解析結果を画面に表示する関数
     * @param {object} analysis - analyzeExifの結果
     * @param {object} rawData - Exifの生データ
     */
    function displayResults(analysis, rawData) {
        updateScoreMeter(analysis.score);

        let infoHTML = '';
        if (analysis.reasons.length > 0) {
            const reasonsHTML = analysis.reasons.map(r => {
                let borderColor = 'var(--warning-color)';
                if (r.includes('編集ソフト')) borderColor = 'var(--danger-color)';
                if (r.includes('位置情報')) borderColor = 'var(--safe-color)';
                return `<li style="border-left-color: ${borderColor};">${r}</li>`;
            }).join("");
            infoHTML += `<h3>🔍 加工解析の根拠</h3><ul class="reasons-list">${reasonsHTML}</ul>`;
        }
        
        const rawInfoStr = Object.keys(rawData).length > 0 
            ? JSON.stringify(rawData, null, 2)
            : "この画像にはExifデータが含まれていません。";
            
        infoHTML += `
            <details>
                <summary>📦 Exif生データを表示</summary>
                <pre style="background-color: #f0f0f0; padding: 1em; border-radius: 8px; white-space: pre-wrap; word-break: break-all;">${rawInfoStr}</pre>
            </details>
        `;
        
        infoDiv.innerHTML = infoHTML;
    }

    /**
     * Exif削除ボタンがクリックされたときの処理
     */
    cleanBtn.addEventListener("click", function () {
        if (!previewImg.src) {
            alert("画像が読み込まれていません");
            return;
        }

        // 新しい画像を作成してExifを削除
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = previewImg.naturalWidth;
        canvas.height = previewImg.naturalHeight;
        ctx.drawImage(previewImg, 0, 0);

        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = "safe_image.jpg"; // ダウンロードファイル名
            downloadLink.textContent = "✅ 安全な画像をダウンロード";
            downloadLink.style.display = "inline-block";
            
            // 安全化されたことをユーザーに通知
            scoreLabel.textContent = "✨ Exifが削除され、安全な画像になりました";
            scoreCircleFg.style.stroke = 'var(--safe-color)';
            scoreText.textContent = '0%';
            const offset = circleLength;
            scoreCircleFg.setAttribute("stroke-dashoffset", offset);

        }, "image/jpeg", 0.95); // JPEG形式、品質95%で出力
    });
});
