function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function downloadBlob(blob, fileName) {
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = fileName || 'download';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
}

export function datedExcelFileName(baseName) {
  const safe = String(baseName || 'export')
    .replace(/\.xlsx?$/i, '')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${safe || 'export'}-${new Date().toISOString().slice(0, 10)}.xls`;
}

export function buildSpreadsheetMlBlob(sheetName, headers, rows) {
  const headerRow = `<Row>${headers
    .map((header) => `<Cell><Data ss:Type="String">${escapeXml(header)}</Data></Cell>`)
    .join('')}</Row>`;

  const dataRows = rows
    .map(
      (row) =>
        `<Row>${headers
          .map((_, index) => `<Cell><Data ss:Type="String">${escapeXml(row[index] ?? '')}</Data></Cell>`)
          .join('')}</Row>`
    )
    .join('');

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="${escapeXml(sheetName || 'Sheet1')}">
    <Table>
      ${headerRow}
      ${dataRows}
    </Table>
  </Worksheet>
</Workbook>`;

  return new Blob([xml], { type: 'application/vnd.ms-excel' });
}

export function parseContentDispositionFileName(header) {
  if (!header || typeof header !== 'string') {
    return null;
  }

  const utfMatch = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) {
    try {
      return decodeURIComponent(utfMatch[1].trim());
    } catch {
      return utfMatch[1].trim();
    }
  }

  const quoted = header.match(/filename="([^"]+)"/i);
  if (quoted?.[1]) {
    return quoted[1];
  }

  const plain = header.match(/filename=([^;]+)/i);
  return plain?.[1]?.trim() ?? null;
}

export function exportRowsToExcel({ fileName, sheetName = 'Sheet1', headers = [], rows = [], mapRow } = {}) {
  const cells = (rows ?? []).map((row, index) =>
    typeof mapRow === 'function' ? mapRow(row, index) : row
  );
  const blob = buildSpreadsheetMlBlob(sheetName, headers, cells);
  const downloadName =
    /\.xlsx?$/i.test(String(fileName ?? '')) ? fileName : datedExcelFileName(fileName);
  downloadBlob(blob, downloadName);
}
