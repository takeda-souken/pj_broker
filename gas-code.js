/**
 * Google Apps Script — SG Broker Study App Backend
 *
 * Setup:
 * 1. Create a new Google Spreadsheet
 * 2. Create sheets named: QuizLog, SessionSummary, Feedback
 * 3. Extensions > Apps Script > paste this code
 * 4. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the URL and paste it into the app's Settings > Cloud Sync
 *
 * Each sheet will have headers auto-created on first write.
 *
 * v2: Added StateSnapshot sheet for cross-device sync.
 *     doPost with action=StateSnapshot saves app state.
 *     doGet with ?action=getSnapshot returns the latest snapshot.
 */

const HEADERS = {
  QuizLog: ['timestamp', 'sentAt', 'module', 'topic', 'questionId', 'selected', 'correct', 'isCorrect', 'timeMs', 'mode'],
  SessionSummary: ['timestamp', 'sentAt', 'module', 'mode', 'score', 'total', 'accuracy', 'passed', 'elapsedMs', 'avgTimeMs', 'byTopic'],
  Feedback: ['timestamp', 'sentAt', 'type', 'module', 'questionId', 'message'],
  SakuraRoom: ['timestamp', 'sentAt', 'conversationId', 'nodeId', 'choiceLabel', 'flags', 'axes'],
  StateSnapshot: ['timestamp', 'sentAt', 'snapshotJson'],
};

// ─── DEV_ prefixed sheets (localhost data isolation) ───
// Dynamically accept DEV_* actions using the same headers as the base action
function getHeaders(action) {
  if (HEADERS[action]) return HEADERS[action];
  // DEV_ prefix → use base action headers
  if (action.startsWith('DEV_')) {
    const base = action.slice(4);
    if (HEADERS[base]) return HEADERS[base];
  }
  return null;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const headers = getHeaders(action);

    if (!headers) {
      return jsonResponse({ ok: false, error: 'Unknown action: ' + action });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(action);

    // Auto-create sheet with headers if missing
    if (!sheet) {
      sheet = ss.insertSheet(action);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }

    // Auto-add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }

    // StateSnapshot: special handling — keep only latest row (overwrite)
    if (action === 'StateSnapshot' || action === 'DEV_StateSnapshot') {
      if (sheet.getLastRow() > 1) {
        // Clear all data rows, keep header
        sheet.deleteRows(2, sheet.getLastRow() - 1);
      }
    }

    const row = headers.map(col => {
      if (col === 'timestamp') return new Date();
      if (col === 'byTopic' || col === 'snapshotJson' || col === 'flags' || col === 'axes') {
        return JSON.stringify(data[col] !== undefined ? data[col] : {});
      }
      return data[col] !== undefined ? data[col] : '';
    });

    sheet.appendRow(row);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || '';

  // GET ?action=getSnapshot — return the latest StateSnapshot
  if (action === 'getSnapshot') {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheetName = (e.parameter.dev === '1') ? 'DEV_StateSnapshot' : 'StateSnapshot';
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet || sheet.getLastRow() < 2) {
        return jsonResponse({ ok: true, snapshot: null });
      }

      // Read the last row (latest snapshot)
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const lastRow = sheet.getRange(sheet.getLastRow(), 1, 1, sheet.getLastColumn()).getValues()[0];

      const result = {};
      headers.forEach((h, i) => {
        if (h === 'snapshotJson') {
          try { result[h] = JSON.parse(lastRow[i]); } catch { result[h] = lastRow[i]; }
        } else if (h === 'timestamp') {
          result[h] = lastRow[i] instanceof Date ? lastRow[i].toISOString() : lastRow[i];
        } else {
          result[h] = lastRow[i];
        }
      });

      return jsonResponse({ ok: true, snapshot: result });
    } catch (err) {
      return jsonResponse({ ok: false, error: err.message });
    }
  }

  return jsonResponse({ status: 'SG Broker GAS Backend is running', version: 2 });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
