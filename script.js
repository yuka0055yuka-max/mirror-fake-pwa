function removeExifFromBase64(base64Image) {
  const marker = 'data:image/jpeg;base64,';
  if (!base64Image || !base64Image.startsWith(marker)) return base64Image;

  const binary = atob(base64Image.replace(marker, ''));
  let result = binary.slice(0, 2); // SOIマーカー保持
  let offset = 2;

  while (offset + 4 <= binary.length) {
    const markerStart = binary.charCodeAt(offset);
    const markerType = binary.charCodeAt(offset + 1);
    const length = binary.charCodeAt(offset + 2) * 256 + binary.charCodeAt(offset + 3);

    if (isNaN(length) || offset + length + 2 > binary.length) break;

    const segment = binary.slice(offset, offset + length + 2);

    // Exifセグメント (APP1) を除外
    if (!(markerStart === 0xFF && markerType === 0xE1)) {
      result += segment;
    }

    offset += length + 2;
  }

  return marker + btoa(result);
}
