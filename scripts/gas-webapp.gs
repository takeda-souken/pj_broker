/**
 * BrokerPassSG — GAS Web App
 * Handles: QuizLog, SessionSummary, Feedback, SakuraRoom, StateSnapshot (sync)
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();

// ─── POST handler ───
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'Unknown';

    // StateSnapshot → special handling (sync)
    if (action === 'StateSnapshot' || action === 'DEV_StateSnapshot') {
      return handleSnapshot(data, action.startsWith('DEV_'));
    }

    // Other actions → append to sheet
    const sheetName = action;
    let sheet = SS.getSheetByName(sheetName);
    if (!sheet) {
      sheet = SS.insertSheet(sheetName);
      // Auto-create headers from data keys
      const headers = Object.keys(data).filter(k => k !== 'action');
      sheet.appendRow(['timestamp', ...headers]);
    }

    // Auto-expand headers if new keys arrive
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const dataKeys = Object.keys(data).filter(k => k !== 'action');
    for (const key of dataKeys) {
      if (!headers.includes(key)) {
        headers.push(key);
        sheet.getRange(1, headers.length).setValue(key);
      }
    }

    const row = headers.map(h => {
      if (h === 'timestamp') return new Date().toISOString();
      const val = data[h];
      return typeof val === 'object' ? JSON.stringify(val) : (val ?? '');
    });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── GET handler (fetch snapshot) ───
function doGet(e) {
  try {
    const action = e.parameter.action;
    const isDev = e.parameter.dev === '1';

    if (action === 'getSnapshot') {
      const sheetName = isDev ? 'DEV_StateSnapshot' : 'StateSnapshot';
      const sheet = SS.getSheetByName(sheetName);
      if (!sheet || sheet.getLastRow() < 2) {
        return jsonResponse({ ok: true, snapshot: null });
      }

      // Get the latest row
      const lastRow = sheet.getLastRow();
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const values = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];

      const obj = {};
      headers.forEach((h, i) => {
        if (h === 'snapshotJson') {
          try { obj[h] = JSON.parse(values[i]); } catch { obj[h] = values[i]; }
        } else {
          obj[h] = values[i];
        }
      });

      return jsonResponse({ ok: true, snapshot: obj });
    }

    return jsonResponse({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ─── Snapshot handler ───
function handleSnapshot(data, isDev) {
  const sheetName = isDev ? 'DEV_StateSnapshot' : 'StateSnapshot';
  let sheet = SS.getSheetByName(sheetName);
  if (!sheet) {
    sheet = SS.insertSheet(sheetName);
    sheet.appendRow(['timestamp', 'sentAt', 'snapshotJson']);
  }

  // Append new snapshot (keep history)
  sheet.appendRow([
    new Date().toISOString(),
    data.sentAt || '',
    JSON.stringify(data.snapshotJson || {}),
  ]);

  // Keep only last 50 snapshots to avoid bloat
  const lastRow = sheet.getLastRow();
  if (lastRow > 51) {
    sheet.deleteRows(2, lastRow - 51);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
