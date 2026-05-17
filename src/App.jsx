import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  CheckCircle2, Users, Sparkles, Copy, RotateCcw, ChevronDown, ChevronUp,
  Plus, X, AlertCircle, Equal, BookOpen, ScrollText,
  Search, ArrowLeftRight, Banknote, ReceiptText, FileSearch,
  CircleAlert, CircleCheck, CircleMinus, CirclePlus, Hash, ClipboardPaste,
  Check, Hand, Undo2, ClipboardList, Pencil, Stamp, Clock,
  Eye, Calendar, Info, ArrowUp, MessageSquare, ListTodo, Inbox,
  ArrowDownToLine, ArrowUpFromLine, Archive, Download, FileSpreadsheet,
  LogIn, LogOut, User, FolderOpen, FilePlus2, Save, Cloud, CloudOff,
  Mail, Lock, AlertTriangle
} from 'lucide-react';
import { auth, db, googleProvider } from './firebase';
import {
  onAuthStateChanged, signOut,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import {
  collection, doc, setDoc, getDocs, deleteDoc,
  query, orderBy, serverTimestamp
} from 'firebase/firestore';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;500;600;700&family=Tajawal:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;500;700&family=Cairo:wght@300;400;600;700;900&display=swap');

* { box-sizing: border-box; }
body { font-family: 'Tajawal', system-ui, sans-serif; }

.font-display { font-family: 'Reem Kufi', 'Cairo', sans-serif; letter-spacing: -0.01em; }
.font-body { font-family: 'Tajawal', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }

.paper-bg {
  background-color: #FBF7EE;
  background-image:
    radial-gradient(at 15% 10%, rgba(168, 142, 92, 0.08) 0px, transparent 50%),
    radial-gradient(at 85% 90%, rgba(15, 61, 46, 0.06) 0px, transparent 50%);
}

.paper-card {
  background: linear-gradient(180deg, #FEFCF6 0%, #FAF5E8 100%);
  box-shadow: 0 1px 0 rgba(15, 61, 46, 0.08), 0 8px 24px -8px rgba(120, 53, 15, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.ledger-line {
  background-image: linear-gradient(to bottom, transparent 0, transparent calc(100% - 1px), rgba(15, 61, 46, 0.08) 100%);
  background-size: 100% 2.5rem;
}

.ink-shadow { text-shadow: 0 1px 0 rgba(15, 61, 46, 0.04); }

.stamp {
  border: 2px solid currentColor; border-radius: 8px; padding: 4px 12px;
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 700; letter-spacing: 0.02em; transform: rotate(-1deg);
  box-shadow: inset 0 0 0 1px currentColor;
}

.manual-stamp {
  position: relative; display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border: 1.5px solid #b45309; color: #b45309;
  background: rgba(254, 243, 199, 0.6); border-radius: 4px;
  font-weight: 700; font-size: 10px; letter-spacing: 0.05em;
  transform: rotate(-2deg); font-family: 'Reem Kufi', sans-serif;
}

.divider-double {
  border-top: 1px solid rgba(15, 61, 46, 0.25);
  border-bottom: 1px solid rgba(15, 61, 46, 0.25);
  height: 4px; background: transparent;
}

.btn-primary {
  background: linear-gradient(180deg, #1a5d44 0%, #0F3D2E 100%);
  color: #FBF7EE; border: 1px solid #0a2a20;
  box-shadow: 0 2px 0 #0a2a20, 0 4px 12px -2px rgba(15, 61, 46, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.15s;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 3px 0 #0a2a20, 0 6px 16px -2px rgba(15, 61, 46, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2); }
.btn-primary:active { transform: translateY(1px); }

.btn-secondary {
  background: #FEFCF6; color: #0F3D2E;
  border: 1px solid rgba(15, 61, 46, 0.25); transition: all 0.15s;
}
.btn-secondary:hover { background: #F5EFE0; border-color: rgba(15, 61, 46, 0.5); }

.btn-danger {
  background: #FEFCF6; color: #991B1B;
  border: 1px solid rgba(153, 27, 27, 0.3); transition: all 0.15s;
}
.btn-danger:hover { background: #FEF2F2; border-color: rgba(153, 27, 27, 0.5); }

.btn-resolve {
  background: linear-gradient(180deg, #d97706 0%, #b45309 100%);
  color: #FFFBEB; border: 1px solid #92400e;
  box-shadow: 0 2px 0 #78350f, 0 4px 10px -2px rgba(180, 83, 9, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.15s;
}
.btn-resolve:hover { transform: translateY(-1px); }

.btn-resolve-mini {
  background: linear-gradient(180deg, #d97706 0%, #b45309 100%);
  color: #FFFBEB; border: 1px solid #92400e;
  box-shadow: 0 1px 0 #78350f, inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.15s;
}
.btn-resolve-mini:hover { transform: translateY(-1px); }

.input-field {
  background: #FEFCF6; border: 1px solid rgba(15, 61, 46, 0.2);
  border-radius: 6px; padding: 8px 12px;
  font-family: 'Tajawal', sans-serif; color: #1c1917; transition: all 0.15s;
}
.input-field:focus { outline: none; border-color: #0F3D2E; box-shadow: 0 0 0 3px rgba(15, 61, 46, 0.1); }

.tabular { font-variant-numeric: tabular-nums; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-up { animation: fadeUp 0.3s ease-out backwards; }

@keyframes slideIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
.animate-slide-in { animation: slideIn 0.2s ease-out backwards; }

@keyframes modalIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
.animate-modal-in { animation: modalIn 0.18s ease-out; }

@keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
.animate-overlay { animation: overlayIn 0.15s ease-out; }

.scroll-hide::-webkit-scrollbar { display: none; }

.copy-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 3px; border-radius: 4px; background: transparent;
  color: rgba(15, 61, 46, 0.4); transition: all 0.15s; cursor: pointer;
  border: none;
}
.copy-btn:hover { background: rgba(15, 61, 46, 0.08); color: #0F3D2E; }
.copy-btn.copied { color: #0F3D2E; background: rgba(15, 61, 46, 0.1); }

.row-hover .copy-btn-row,
.row-hover .row-actions { opacity: 0; transition: opacity 0.15s; }
.row-hover:hover .copy-btn-row,
.row-hover:hover .row-actions { opacity: 1; }
@media (max-width: 768px) {
  .row-hover .copy-btn-row,
  .row-hover .row-actions { opacity: 1; }
}

.icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 4px; border-radius: 5px; background: transparent;
  color: rgba(15, 61, 46, 0.45); transition: all 0.15s; cursor: pointer;
  border: 1px solid transparent;
}
.icon-btn:hover { background: rgba(15, 61, 46, 0.08); color: #0F3D2E; border-color: rgba(15, 61, 46, 0.15); }

.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(15, 61, 46, 0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}

.toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: #0F3D2E; color: #FBF7EE; padding: 10px 18px; border-radius: 999px;
  font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 13px;
  display: inline-flex; align-items: center; gap: 8px;
  box-shadow: 0 10px 30px -10px rgba(15, 61, 46, 0.5);
  z-index: 100; animation: fadeUp 0.2s ease-out;
}

/* Scroll-to-top floating button */
.scroll-to-ref {
  position: sticky;
  bottom: 16px;
  margin-right: auto;
  margin-left: 8px;
  background: linear-gradient(180deg, #1a5d44 0%, #0F3D2E 100%);
  color: #FBF7EE;
  border: 1px solid #0a2a20;
  border-radius: 999px;
  padding: 8px 14px;
  font-family: 'Reem Kufi', sans-serif;
  font-weight: 700;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 6px 16px -4px rgba(15, 61, 46, 0.5);
  z-index: 30;
  cursor: pointer;
  transition: all 0.15s;
}
.scroll-to-ref:hover { transform: translateY(-2px); }

/* Customer status badges (pending / resolved manually) */
.cust-badge {
  display: inline-flex; align-items: center; gap: 3px;
  padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;
  font-family: 'Reem Kufi', sans-serif;
}
.cust-badge-pending {
  background: #DBEAFE; color: #1E3A8A; border: 1px solid rgba(30, 58, 138, 0.2);
}
.cust-badge-resolved {
  background: #FEF3C7; color: #92400E; border: 1px solid rgba(180, 83, 9, 0.25);
}
`;

// ===================== HELPERS =====================
const fmt = (n) => {
  if (n === undefined || n === null || isNaN(n)) return '0.00';
  return Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtSigned = (n) => (n > 0 ? '+' : n < 0 ? '−' : '') + fmt(n);

const copyToClipboard = (text) => {
  return new Promise((resolve) => {
    const str = String(text);
    const execFallback = () => {
      try {
        const ta = document.createElement('textarea');
        ta.value = str;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '0'; ta.style.left = '0';
        ta.style.width = '1px'; ta.style.height = '1px';
        ta.style.padding = '0'; ta.style.border = 'none';
        ta.style.outline = 'none'; ta.style.boxShadow = 'none';
        ta.style.background = 'transparent'; ta.style.opacity = '0';
        ta.style.zIndex = '-1';
        document.body.appendChild(ta);
        const isIOS = /ipad|iphone|ipod/i.test(navigator.userAgent);
        if (isIOS) {
          ta.contentEditable = 'true'; ta.readOnly = false;
          const range = document.createRange();
          range.selectNodeContents(ta);
          const sel = window.getSelection();
          sel.removeAllRanges(); sel.addRange(range);
          ta.setSelectionRange(0, str.length);
        } else {
          ta.focus(); ta.select();
        }
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        resolve(ok);
      } catch (err) { resolve(false); }
    };
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(str).then(() => resolve(true)).catch(() => execFallback());
    } else {
      execFallback();
    }
  });
};

// ========== EXPORT TO EXCEL (HTML table → Excel) ==========
// Uses an HTML table with .xls extension — opens in Excel with full Arabic + RTL support.
const exportToExcel = (rows, headers, filename, options = {}) => {
  const { title = '', summary = [] } = options;

  const escapeHtml = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const colCount = headers.length;

  // Header row
  const headerHtml = headers.map(h =>
    `<th style="background-color:#0F3D2E;color:#FBF7EE;padding:8px 12px;border:1px solid #0a2a20;font-weight:bold;font-family:Tahoma;text-align:center;">${escapeHtml(h.label)}</th>`
  ).join('');

  // Data rows
  const rowsHtml = rows.map((row, i) => {
    const cells = headers.map(h => {
      const v = row[h.key];
      const isNum = h.type === 'number';
      const bg = i % 2 === 0 ? '#FEFCF6' : '#FAF5E8';
      if (isNum) {
        const numVal = typeof v === 'number' ? v : parseFloat(v) || 0;
        return `<td style="padding:6px 10px;border:1px solid #d4c8a8;background-color:${bg};font-family:Consolas,monospace;text-align:left;" x:num="${numVal}">${numVal.toFixed(2)}</td>`;
      }
      return `<td style="padding:6px 10px;border:1px solid #d4c8a8;background-color:${bg};font-family:Tahoma;text-align:right;">${escapeHtml(v)}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  // Summary rows
  const summaryHtml = summary.length > 0
    ? `<tr><td colspan="${colCount}" style="height:12px;border:none;background-color:#FBF7EE;"></td></tr>` +
      summary.map(s => {
        const isTotal = s.bold;
        const bg = isTotal ? '#E8F0EB' : '#FAF5E8';
        const fontWeight = isTotal ? 'bold' : 'normal';
        const color = isTotal ? '#0F3D2E' : '#1c1917';
        const numVal = typeof s.value === 'number' ? s.value : parseFloat(s.value) || 0;
        return `<tr>
<td colspan="${colCount - 1}" style="padding:8px 12px;border:1px solid #d4c8a8;background-color:${bg};font-weight:${fontWeight};text-align:right;font-family:Tahoma;color:${color};">${escapeHtml(s.label)}</td>
<td style="padding:8px 12px;border:1px solid #d4c8a8;background-color:${bg};font-weight:bold;text-align:left;font-family:Consolas,monospace;color:${color};" x:num="${numVal}">${numVal.toFixed(2)}</td>
</tr>`;
      }).join('')
    : '';

  // Title rows
  const titleHtml = title
    ? `<tr><td colspan="${colCount}" style="padding:14px;border:1px solid #0a2a20;background-color:#0F3D2E;color:#FBF7EE;font-size:16pt;font-weight:bold;text-align:center;font-family:Tahoma;">${escapeHtml(title)}</td></tr>
<tr><td colspan="${colCount}" style="padding:6px;border:1px solid #d4c8a8;background-color:#FAF5E8;text-align:center;font-size:9pt;color:#5c4a2c;font-family:Tahoma;">${escapeHtml(new Date().toLocaleDateString('en-GB'))} — دفتر المطابقة البنكية</td></tr>`
    : '';

  // Full HTML — UTF-8 BOM + RTL workbook setting
  const html = `\uFEFF<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!--[if gte mso 9]><xml>
<x:ExcelWorkbook>
<x:ExcelWorksheets>
<x:ExcelWorksheet>
<x:Name>قائمة المعالجة</x:Name>
<x:WorksheetOptions>
<x:DisplayRightToLeft/>
<x:DefaultRowHeight>300</x:DefaultRowHeight>
</x:WorksheetOptions>
</x:ExcelWorksheet>
</x:ExcelWorksheets>
</x:ExcelWorkbook>
</xml><![endif]-->
</head>
<body>
<table border="1" cellspacing="0" cellpadding="0" dir="rtl">
<thead>
${titleHtml}
<tr>${headerHtml}</tr>
</thead>
<tbody>
${rowsHtml}
${summaryHtml}
</tbody>
</table>
</body>
</html>`;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.xls') ? filename : `${filename}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const parseBank = (text) => {
  return text.split('\n').map(line => line.trim()).filter(Boolean).map((line, i) => {
    let parts = line.split('\t').map(p => p.trim()).filter(Boolean);
    if (parts.length < 2) {
      parts = line.split(/[;,]|\s{2,}/).map(p => p.trim()).filter(Boolean);
    }
    if (parts.length < 2) return null;
    const amountStr = parts[parts.length - 1].replace(/[^\d.\-]/g, '');
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) return null;
    let reference, date = null, description = null;
    if (parts.length === 2) {
      reference = parts[0];
    } else if (parts.length === 3) {
      reference = parts[parts.length - 2];
      if (/^\d{1,4}[\-\/.]\d{1,2}[\-\/.]\d{1,4}$/.test(parts[0])) date = parts[0];
    } else {
      // 4+ cols: date | description | reference | amount
      reference = parts[parts.length - 2];
      if (/^\d{1,4}[\-\/.]\d{1,2}[\-\/.]\d{1,4}$/.test(parts[0])) date = parts[0];
      description = parts.slice(1, -2).join(' ');
    }
    if (!reference) return null;
    return { id: `b${i}-${Math.random().toString(36).slice(2, 7)}`, reference, amount, date, description };
  }).filter(Boolean);
};

const parseInternal = (text) => {
  return text.split('\n').map(line => line.trim()).filter(Boolean).map((line, i) => {
    let parts;
    // إذا فيه Tab → استخدمه فقط (يحافظ على الأوصاف الكبيرة كاملة)
    if (line.includes('\t')) {
      parts = line.split('\t').map(p => p.trim()).filter(Boolean);
    } else {
      // بدون Tab: نعتمد على المبلغ في النهاية كحد فاصل
      // نبحث عن آخر رقم في السطر (هو المبلغ)
      const match = line.match(/^(.+?)\s+(\S+?)\s+([\d,.\-]+(?:\.\d+)?)\s*$/);
      if (match) {
        // 3 أقسام: المرجع | الباقي كاسم/وصف | المبلغ
        parts = [match[1].trim(), match[2].trim() + ' ' + (match[3] ? '' : '')].filter(Boolean);
        // أعد البناء بشكل صحيح
        const lastSpaceBeforeNum = line.lastIndexOf(' ', line.length - match[3].length - 1);
        if (lastSpaceBeforeNum > 0) {
          // كل اللي قبل المبلغ
          const beforeAmount = line.substring(0, lastSpaceBeforeNum).trim();
          const firstSpace = beforeAmount.indexOf(' ');
          if (firstSpace > 0) {
            const reference = beforeAmount.substring(0, firstSpace).trim();
            const customer = beforeAmount.substring(firstSpace).trim();
            parts = [reference, customer, match[3]];
          } else {
            parts = null;
          }
        } else {
          parts = null;
        }
      } else {
        // محاولة أخيرة: فصل بفاصلة أو فاصلة منقوطة
        parts = line.split(/[;,]/).map(p => p.trim()).filter(Boolean);
      }
    }

    if (!parts || parts.length < 3) return null;
    const amount = parseFloat(parts[parts.length - 1].replace(/[^\d.\-]/g, ''));
    if (isNaN(amount)) return null;
    const reference = parts[0];
    // كل اللي بين المرجع والمبلغ = اسم/وصف العميل (كامل، بدون قص)
    const customer = parts.slice(1, -1).join(' ').trim();
    if (!reference || !customer) return null;
    return { id: `i${i}-${Math.random().toString(36).slice(2, 7)}`, reference, customer, amount };
  }).filter(Boolean);
};

const parseBulkCustomers = (text) => {
  return text.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
    let parts = line.split('\t').map(p => p.trim()).filter(Boolean);
    if (parts.length < 2) {
      parts = line.split(/[;,]|\s{2,}/).map(p => p.trim()).filter(Boolean);
    }
    if (parts.length < 2) return null;
    const amount = parseFloat(parts[parts.length - 1].replace(/[^\d.\-]/g, ''));
    if (isNaN(amount)) return null;
    const customer = parts.slice(0, -1).join(' ');
    if (!customer) return null;
    return { customer, amount: amount.toString() };
  }).filter(Boolean);
};

const reconcile = (bank, internal, manuallyResolvedRefs, resolvedCustomers) => {
  const bankByRef = {};
  bank.forEach(b => {
    if (!bankByRef[b.reference]) bankByRef[b.reference] = { total: 0, entries: [] };
    bankByRef[b.reference].total += b.amount;
    bankByRef[b.reference].entries.push(b);
  });
  const intByRef = {};
  internal.forEach(e => {
    if (!intByRef[e.reference]) intByRef[e.reference] = [];
    intByRef[e.reference].push(e);
  });
  const allRefs = Array.from(new Set([...Object.keys(bankByRef), ...Object.keys(intByRef)]));

  return allRefs.map(ref => {
    const bankInfo = bankByRef[ref];
    const customers = intByRef[ref] || [];
    const bankAmount = bankInfo?.total || 0;
    const internalTotal = customers.reduce((s, c) => s + c.amount, 0);
    const diff = internalTotal - bankAmount;

    // Count which customers are still "open" (not marked resolved manually)
    const customersWithStatus = customers.map(c => {
      const r = resolvedCustomers[c.id];
      return { ...c, resolution: r || null };
    });
    const openCustomers = customersWithStatus.filter(c => !c.resolution);
    const allCustomersResolved = customers.length > 0 && openCustomers.length === 0;

    let baseStatus;
    if (!bankInfo) baseStatus = 'only_internal';
    else if (!customers.length) baseStatus = 'only_bank';
    else if (Math.abs(diff) < 0.005) baseStatus = 'matched';
    else if (diff > 0) baseStatus = 'surplus';
    else baseStatus = 'shortage';

    const isManualResolved =
      (manuallyResolvedRefs.has(ref) || allCustomersResolved) && baseStatus !== 'matched';
    const displayStatus = isManualResolved ? 'matched' : baseStatus;

    return {
      reference: ref,
      bankAmount,
      bankDate: bankInfo?.entries[0]?.date || null,
      bankDescription: bankInfo?.entries[0]?.description || null,
      bankEntries: bankInfo?.entries || [],
      customers: customersWithStatus,
      internalTotal,
      diff,
      status: displayStatus,
      baseStatus,
      isManualResolved,
      autoResolvedByCustomers: allCustomersResolved && !manuallyResolvedRefs.has(ref) && baseStatus !== 'matched'
    };
  }).sort((a, b) => {
    const order = { shortage: 0, surplus: 1, only_bank: 2, only_internal: 3, matched: 4 };
    const aRank = order[a.status];
    const bRank = order[b.status];
    if (aRank !== bRank) return aRank - bRank;
    if (a.status === 'matched') return (a.isManualResolved ? 1 : 0) - (b.isManualResolved ? 1 : 0);
    return 0;
  });
};

const diagnose = (actual, correct) => {
  const issues = [];
  const actualByName = {};
  actual.forEach(c => {
    if (!actualByName[c.customer]) actualByName[c.customer] = { count: 0, total: 0, entries: [] };
    actualByName[c.customer].count++;
    actualByName[c.customer].total += c.amount;
    actualByName[c.customer].entries.push(c);
  });
  const correctByName = {};
  correct.forEach(c => { correctByName[c.customer] = (correctByName[c.customer] || 0) + c.amount; });

  Object.keys(actualByName).forEach(name => {
    if (actualByName[name].count > 1) {
      issues.push({
        type: 'duplicate', customer: name,
        count: actualByName[name].count,
        amounts: actualByName[name].entries.map(e => e.amount),
        total: actualByName[name].total,
        expected: correctByName[name] || 0
      });
    }
  });
  Object.keys(actualByName).forEach(name => {
    if (!(name in correctByName) && actualByName[name].count === 1) {
      issues.push({ type: 'extra', customer: name, amount: actualByName[name].total });
    }
  });
  Object.keys(correctByName).forEach(name => {
    if (!(name in actualByName)) {
      issues.push({ type: 'missing', customer: name, expectedAmount: correctByName[name] });
    }
  });
  Object.keys(correctByName).forEach(name => {
    if (actualByName[name] && actualByName[name].count === 1) {
      const a = actualByName[name].total;
      const c = correctByName[name];
      if (Math.abs(a - c) > 0.005) {
        issues.push({ type: 'wrong_amount', customer: name, actualAmount: a, correctAmount: c, diff: a - c });
      }
    }
  });
  return issues;
};

const SAMPLE_BANK = `POS-1001\t5000.00
POS-1002\t3500.00
POS-1003\t2000.00
POS-1004\t1500.00
POS-1005\t4200.00
POS-1006\t2750.00`;

const SAMPLE_BANK_FULL = `26-04-26\tINCOMING SARIE TRANSFER Value date 04/26/2026 from جمانه هشام at #2245 Purpose of Payment\tPOS-1001\t5000.00
26-04-26\tINCOMING SARIE TRANSFER Reference Number FT26116ABCD UTI Ref ***572206 from محمد الزهراني\tPOS-1002\t3500.00
27-04-26\tINCOMING SARIE TRANSFER from خالد القحطاني amount 2000.00 SAR Purpose Payment\tPOS-1003\t2000.00
27-04-26\tINCOMING SARIE TRANSFER from عبدالله السبيعي amount 1500.00 SAR\tPOS-1004\t1500.00
28-04-26\tINCOMING SARIE TRANSFER from منى الحربي\tPOS-1005\t4200.00
28-04-26\tINCOMING SARIE TRANSFER from عميل غير معروف\tPOS-1006\t2750.00`;

const SAMPLE_INTERNAL = `POS-1001\tأحمد الغامدي\t2000.00
POS-1001\tسارة العتيبي\t3000.00
POS-1002\tمحمد الزهراني\t3500.00
POS-1003\tخالد القحطاني\t1500.00
POS-1003\tفهد الشمري\t300.00
POS-1003\tنورة الدوسري\t400.00
POS-1004\tعبدالله السبيعي\t1500.00
POS-1004\tعبدالله السبيعي\t500.00
POS-1005\tمنى الحربي\t4200.00
POS-1007\tريم المطيري\t1800.00`;

const STATUS_META = {
  matched: { label: 'مطابق', color: '#0F3D2E', bg: '#E8F0EB', icon: CircleCheck, desc: 'مطابقة تامة' },
  surplus: { label: 'زيادة', color: '#92400E', bg: '#FEF3C7', icon: CirclePlus, desc: 'السجل أكثر من البنك' },
  shortage: { label: 'نقص', color: '#991B1B', bg: '#FEE2E2', icon: CircleMinus, desc: 'السجل أقل من البنك' },
  only_bank: { label: 'في البنك فقط', color: '#1E3A8A', bg: '#DBEAFE', icon: Banknote, desc: 'لا يوجد سجل داخلي' },
  only_internal: { label: 'في السجل فقط', color: '#5B21B6', bg: '#EDE9FE', icon: ReceiptText, desc: 'لا يوجد سجل بنكي' }
};

// ===================== UI COMPONENTS =====================
const CopyButton = ({ text, label = '', size = 12, className = '', showToast }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      if (showToast) showToast(`نُسخ: ${label || text}`);
      setTimeout(() => setCopied(false), 1500);
    } else {
      if (showToast) showToast('⚠️ تعذّر النسخ تلقائياً');
    }
  };
  return (
    <button onClick={handleCopy} className={`copy-btn ${copied ? 'copied' : ''} ${className}`} title={label ? `نسخ ${label}` : 'نسخ'} type="button">
      {copied ? <Check size={size} strokeWidth={3} /> : <Copy size={size} />}
    </button>
  );
};

const ParsedPreview = ({ entries, type = 'bank', color = '#0F3D2E', accentBg = 'rgba(15, 61, 46, 0.05)' }) => {
  if (entries.length === 0) return null;
  const hasDate = type === 'bank' && entries.some(e => e.date);
  return (
    <div className="mt-3 rounded-lg overflow-hidden border" style={{ background: '#FEFCF6', borderColor: 'rgba(15, 61, 46, 0.12)' }}>
      <div className="px-3 py-2 flex items-center justify-between" style={{ background: accentBg, borderBottom: '1px solid rgba(15, 61, 46, 0.08)' }}>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={12} style={{ color }} strokeWidth={2.5} />
          <span className="font-display text-[11px] font-bold" style={{ color }}>
            تم استخراج {entries.length} حركة نظيفة
          </span>
        </div>
        <span className="font-display text-[9px] tracking-[0.25em] opacity-50" style={{ color }}>مـعـايـنـة</span>
      </div>
      <div className="max-h-40 overflow-y-auto scroll-hide">
        {entries.slice(0, 100).map((e, i) => (
          <div key={i} className="px-3 py-1.5 flex items-center justify-between gap-2 border-b last:border-b-0" style={{ borderColor: 'rgba(15, 61, 46, 0.05)' }}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="font-mono text-[10px] opacity-40 w-6 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
              {hasDate && <span className="font-mono text-[10px] opacity-50 flex-shrink-0 hidden sm:inline" dir="ltr">{e.date || '—'}</span>}
              <span className="font-mono text-xs font-bold truncate" style={{ color }} dir="ltr">{e.reference}</span>
              {type === 'internal' && <span className="font-body text-xs opacity-70 truncate flex-shrink min-w-0">· {e.customer}</span>}
            </div>
            <span className="font-mono text-xs font-bold tabular flex-shrink-0">{fmt(e.amount)}</span>
          </div>
        ))}
      </div>
      {entries.length > 100 && (
        <div className="px-3 py-1.5 text-center font-body text-[10px] opacity-60 border-t" style={{ borderColor: 'rgba(15, 61, 46, 0.08)' }}>
          + {entries.length - 100} حركة إضافية...
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, color, bg, delay = 0, onClick, active }) => (
  <button onClick={onClick} className="paper-card rounded-xl p-4 animate-fade-up text-right transition-all hover:translate-y-[-2px]" style={{
    animationDelay: `${delay}ms`,
    boxShadow: active ? `0 0 0 2px ${color}, 0 1px 0 rgba(15, 61, 46, 0.08), 0 8px 24px -8px rgba(120, 53, 15, 0.15)` : undefined
  }}>
    <div className="flex items-start justify-between mb-3">
      <div className="rounded-lg p-2" style={{ background: bg, color: color }}>
        <Icon size={18} strokeWidth={2} />
      </div>
      {active && <div className="text-[10px] font-display tracking-widest font-bold" style={{ color }}>● مفعّل</div>}
    </div>
    <div className="font-mono text-2xl font-bold tabular" style={{ color }}>{value}</div>
    <div className="text-sm font-body opacity-70 mt-1" style={{ color: '#1c1917' }}>{label}</div>
    {sub && <div className="text-xs font-body opacity-50 mt-0.5" style={{ color: '#1c1917' }}>{sub}</div>}
  </button>
);

const Pill = ({ status, size = 'sm', isManual = false }) => {
  const m = STATUS_META[status];
  if (!m) return null;
  const Icon = m.icon;
  const sizes = { sm: 'text-xs px-2 py-0.5 gap-1', md: 'text-sm px-3 py-1 gap-1.5' };
  return (
    <span className="inline-flex items-center gap-1.5 flex-wrap">
      <span className={`inline-flex items-center font-bold font-body rounded-md ${sizes[size]}`} style={{ color: m.color, background: m.bg }}>
        <Icon size={size === 'sm' ? 12 : 14} strokeWidth={2.5} />
        {m.label}
      </span>
      {isManual && (
        <span className="manual-stamp">
          <Hand size={9} strokeWidth={2.5} />
          يدوياً
        </span>
      )}
    </span>
  );
};

// ===================== MODAL =====================
const Modal = ({ open, onClose, title, icon: Icon, color = '#0F3D2E', children, footer }) => {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay animate-overlay" onClick={onClose} dir="rtl">
      <div
        className="paper-card rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(15, 61, 46, 0.12)' }}>
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="rounded-lg p-2" style={{ background: color, color: '#FBF7EE' }}>
                <Icon size={16} strokeWidth={2.5} />
              </div>
            )}
            <h3 className="font-display text-lg font-bold" style={{ color }}>{title}</h3>
          </div>
          <button onClick={onClose} className="icon-btn">
            <X size={16} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="p-4 border-t" style={{ borderColor: 'rgba(15, 61, 46, 0.12)' }}>{footer}</div>
        )}
      </div>
    </div>
  );
};

// ===================== AUTH SCREEN =====================
const AuthScreen = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('signin'); // signin | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const friendlyError = (code) => {
    const messages = {
      'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
      'auth/user-not-found': 'لا يوجد حساب بهذا البريد',
      'auth/wrong-password': 'كلمة المرور غير صحيحة',
      'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة',
      'auth/email-already-in-use': 'هذا البريد مسجل مسبقاً',
      'auth/weak-password': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
      'auth/popup-closed-by-user': 'تم إغلاق نافذة جوجل قبل إكمال الدخول',
      'auth/network-request-failed': 'مشكلة في الاتصال بالإنترنت'
    };
    return messages[code] || 'حدث خطأ — حاول مرة أخرى';
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true); setError('');
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true); setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="paper-bg min-h-screen flex items-center justify-center px-4">
      <style>{STYLES}</style>
      <div className="paper-card rounded-2xl p-8 w-full max-w-md animate-fade-up">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-2xl p-3 mb-3" style={{ background: '#0F3D2E', color: '#FBF7EE' }}>
            <BookOpen size={28} strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-2xl font-bold ink-shadow" style={{ color: '#0F3D2E' }}>دفتر المطابقة</h1>
          <p className="font-body text-sm opacity-70 mt-1" style={{ color: '#1c1917' }}>
            {mode === 'signin' ? 'سجّل دخولك للوصول إلى مطابقاتك' : 'أنشئ حساباً جديداً'}
          </p>
        </div>

        {/* Google Sign-in */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="btn-secondary w-full font-body font-bold text-sm rounded-lg px-4 py-3 flex items-center justify-center gap-2 mb-4 disabled:opacity-40"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          المتابعة بحساب Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1" style={{ background: 'rgba(15, 61, 46, 0.15)' }} />
          <span className="font-display text-[10px] tracking-widest opacity-60" style={{ color: '#0F3D2E' }}>أو</span>
          <div className="h-px flex-1" style={{ background: 'rgba(15, 61, 46, 0.15)' }} />
        </div>

        {/* Email/Password */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div>
            <label className="font-display text-xs font-bold mb-1 flex items-center gap-1.5" style={{ color: '#0F3D2E' }}>
              <Mail size={11} />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="input-field text-sm w-full"
              dir="ltr"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="font-display text-xs font-bold mb-1 flex items-center gap-1.5" style={{ color: '#0F3D2E' }}>
              <Lock size={11} />
              كلمة المرور <span className="opacity-50 font-normal">(6 أحرف على الأقل)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field text-sm w-full"
              dir="ltr"
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <div className="rounded-md p-2.5 flex items-start gap-2" style={{ background: '#FEE2E2' }}>
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#991B1B' }} />
              <p className="font-body text-xs" style={{ color: '#991B1B' }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || password.length < 6}
            className="btn-primary w-full font-display font-bold text-sm rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <LogIn size={14} />
            {loading ? 'جارٍ...' : mode === 'signin' ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
            className="font-body text-xs opacity-70 hover:opacity-100"
            style={{ color: '#0F3D2E' }}
          >
            {mode === 'signin' ? 'ما عندك حساب؟ سجّل الآن' : 'عندك حساب؟ سجّل الدخول'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ===================== SAVED RECONCILIATIONS BAR =====================
const SavedReconciliationsBar = ({ user, currentId, currentName, savedList, onLoad, onNew, onRename, onDelete, onSignOut, syncStatus }) => {
  const [showList, setShowList] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [newName, setNewName] = useState('');

  const startRename = (item) => {
    setRenamingId(item.id);
    setNewName(item.name);
  };

  const submitRename = () => {
    if (newName.trim() && renamingId) {
      onRename(renamingId, newName.trim());
    }
    setRenamingId(null);
    setNewName('');
  };

  return (
    <div className="border-b-2 sticky top-0 z-30" style={{
      borderColor: 'rgba(15, 61, 46, 0.15)',
      background: 'rgba(251, 247, 238, 0.95)',
      backdropFilter: 'blur(8px)'
    }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 flex-wrap">
        {/* Current reconciliation */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FolderOpen size={14} style={{ color: '#0F3D2E' }} />
          <div className="font-display text-xs opacity-60" style={{ color: '#0F3D2E' }}>مطابقة حالية:</div>
          {renamingId === 'current' ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={submitRename}
              onKeyDown={(e) => { if (e.key === 'Enter') submitRename(); if (e.key === 'Escape') { setRenamingId(null); setNewName(''); } }}
              className="input-field font-body font-bold text-sm py-1 px-2 flex-1 min-w-0 max-w-xs"
              autoFocus
              placeholder="اسم المطابقة"
            />
          ) : (
            <button
              onClick={() => { setRenamingId('current'); setNewName(currentName); }}
              className="font-display font-bold text-sm truncate hover:opacity-70 flex items-center gap-1"
              style={{ color: '#0F3D2E' }}
              title="انقر للتعديل"
            >
              {currentName || 'بدون اسم'}
              <Pencil size={10} className="opacity-40" />
            </button>
          )}

          {/* Sync indicator */}
          {syncStatus === 'syncing' && (
            <span className="font-body text-[10px] opacity-60 flex items-center gap-1" style={{ color: '#1E3A8A' }}>
              <Cloud size={11} className="animate-pulse-soft" />
              جارٍ الحفظ...
            </span>
          )}
          {syncStatus === 'synced' && (
            <span className="font-body text-[10px] opacity-60 flex items-center gap-1" style={{ color: '#0F3D2E' }}>
              <Check size={11} strokeWidth={3} />
              محفوظ
            </span>
          )}
          {syncStatus === 'error' && (
            <span className="font-body text-[10px] opacity-80 flex items-center gap-1" style={{ color: '#991B1B' }}>
              <CloudOff size={11} />
              فشل الحفظ
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onNew}
            className="btn-secondary font-body font-bold text-xs rounded-md px-2.5 py-1.5 flex items-center gap-1.5"
            title="مطابقة جديدة"
          >
            <FilePlus2 size={12} />
            <span className="hidden sm:inline">جديدة</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowList(!showList)}
              className="btn-secondary font-body font-bold text-xs rounded-md px-2.5 py-1.5 flex items-center gap-1.5"
            >
              <FolderOpen size={12} />
              <span className="hidden sm:inline">المطابقات</span>
              <span className="font-mono text-[10px] opacity-70">({savedList.length})</span>
              <ChevronDown size={11} className={`transition-transform ${showList ? 'rotate-180' : ''}`} />
            </button>

            {showList && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowList(false)} />
                <div className="absolute top-full left-0 mt-2 paper-card rounded-xl w-72 sm:w-80 max-h-96 overflow-y-auto z-40 animate-slide-in" style={{ boxShadow: '0 20px 40px -10px rgba(15, 61, 46, 0.3)' }}>
                  <div className="p-3 border-b sticky top-0" style={{ borderColor: 'rgba(15, 61, 46, 0.1)', background: '#FEFCF6' }}>
                    <div className="font-display text-xs font-bold flex items-center gap-1.5" style={{ color: '#0F3D2E' }}>
                      <FolderOpen size={12} />
                      المطابقات المحفوظة
                    </div>
                  </div>
                  {savedList.length === 0 ? (
                    <div className="p-6 text-center">
                      <Archive size={24} className="mx-auto mb-2 opacity-40" />
                      <p className="font-body text-xs opacity-60">لا توجد مطابقات محفوظة</p>
                    </div>
                  ) : (
                    <div>
                      {savedList.map((item) => (
                        <div key={item.id} className={`p-3 border-b last:border-b-0 hover:bg-black/[0.02] flex items-center gap-2 ${item.id === currentId ? 'bg-green-50/40' : ''}`} style={{ borderColor: 'rgba(15, 61, 46, 0.05)' }}>
                          <button
                            onClick={() => { onLoad(item.id); setShowList(false); }}
                            className="flex-1 text-right min-w-0"
                          >
                            <div className="font-body font-bold text-sm truncate flex items-center gap-1.5" style={{ color: '#0F3D2E' }}>
                              {item.id === currentId && <Check size={12} strokeWidth={3} style={{ color: '#0F3D2E' }} />}
                              {item.name}
                            </div>
                            <div className="font-mono text-[10px] opacity-50 mt-0.5">
                              {item.updatedAt ? new Date(item.updatedAt.seconds * 1000).toLocaleDateString('en-GB') : '—'}
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`هل تريد حذف "${item.name}"؟`)) {
                                onDelete(item.id);
                              }
                            }}
                            className="icon-btn"
                            style={{ color: '#991B1B' }}
                            title="حذف"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="h-5 w-px mx-1" style={{ background: 'rgba(15, 61, 46, 0.15)' }} />

          {/* User */}
          <div className="flex items-center gap-1.5">
            <div className="rounded-full p-1.5" style={{ background: '#0F3D2E', color: '#FBF7EE' }}>
              <User size={11} strokeWidth={2.5} />
            </div>
            <span className="font-body text-xs opacity-70 hidden md:inline" style={{ color: '#0F3D2E' }}>
              {user.email?.split('@')[0] || 'مستخدم'}
            </span>
            <button onClick={onSignOut} className="icon-btn" title="تسجيل خروج">
              <LogOut size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================== MAIN APP =====================
export default function App() {
  // ===== Auth state =====
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ===== Reconciliation state =====
  const [currentReconciliationId, setCurrentReconciliationId] = useState(null);
  const [currentReconciliationName, setCurrentReconciliationName] = useState('');
  const [savedReconciliations, setSavedReconciliations] = useState([]);
  const [syncStatus, setSyncStatus] = useState(null); // null | syncing | synced | error
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [bankText, setBankText] = useState('');
  const [internalText, setInternalText] = useState('');
  const [bankEntries, setBankEntries] = useState([]);
  const [internalEntries, setInternalEntries] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const [expandedRef, setExpandedRef] = useState(null);
  const [correctDist, setCorrectDist] = useState({});
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [manuallyResolvedRefs, setManuallyResolvedRefs] = useState(new Set());
  const [resolvedCustomers, setResolvedCustomers] = useState({});
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [activeView, setActiveView] = useState('reconcile');
  const resultsRef = useRef(null);
  const refRowRefs = useRef({});
  const saveTimeoutRef = useRef(null);
  const skipNextSaveRef = useRef(false);

  // ===== Auth listener =====
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) {
        // Reset everything inline on signout (avoid closure issues)
        setCurrentReconciliationId(null);
        setCurrentReconciliationName('');
        setSavedReconciliations([]);
        setBankText(''); setInternalText('');
        setBankEntries([]); setInternalEntries([]);
        setHasRun(false); setExpandedRef(null);
        setCorrectDist({}); setManuallyResolvedRefs(new Set());
        setResolvedCustomers({}); setSearchQuery(''); setActiveStatusFilter('all');
        setActiveView('reconcile');
      }
    });
    return unsub;
  }, []);

  // ===== Load saved reconciliations list =====
  const loadSavedList = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'users', user.uid, 'reconciliations'), orderBy('updatedAt', 'desc'));
      const snap = await getDocs(q);
      setSavedReconciliations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Load list error:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadSavedList();
      // Initialize new reconciliation if none active
      if (!currentReconciliationId) {
        const newId = `rec_${Date.now()}`;
        const monthName = new Date().toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
        setCurrentReconciliationId(newId);
        setCurrentReconciliationName(`مطابقة ${monthName}`);
      }
    }
  }, [user]);

  // ===== Auto-save (debounced) =====
  useEffect(() => {
    if (!user || !currentReconciliationId || authLoading || isLoadingData) return;
    if (skipNextSaveRef.current) { skipNextSaveRef.current = false; return; }
    // Only save if there's actual content
    if (!bankText && !internalText && Object.keys(resolvedCustomers).length === 0 && manuallyResolvedRefs.size === 0) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSyncStatus('syncing');

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const docRef = doc(db, 'users', user.uid, 'reconciliations', currentReconciliationId);
        await setDoc(docRef, {
          name: currentReconciliationName || 'بدون اسم',
          bankText,
          internalText,
          manuallyResolvedRefs: Array.from(manuallyResolvedRefs),
          resolvedCustomers,
          correctDist,
          hasRun,
          updatedAt: serverTimestamp()
        }, { merge: true });
        setSyncStatus('synced');
        // Refresh list silently
        loadSavedList();
        setTimeout(() => setSyncStatus(null), 1500);
      } catch (err) {
        console.error('Save error:', err);
        setSyncStatus('error');
        setTimeout(() => setSyncStatus(null), 3000);
      }
    }, 800);

    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [bankText, internalText, manuallyResolvedRefs, resolvedCustomers, correctDist, hasRun, currentReconciliationName, currentReconciliationId, user]);

  const handleResetState = () => {
    setBankText(''); setInternalText('');
    setBankEntries([]); setInternalEntries([]);
    setHasRun(false); setExpandedRef(null);
    setCorrectDist({}); setManuallyResolvedRefs(new Set());
    setResolvedCustomers({}); setSearchQuery(''); setActiveStatusFilter('all');
    setActiveView('reconcile');
  };

  const handleNewReconciliation = () => {
    const newId = `rec_${Date.now()}`;
    const dateStr = new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' });
    skipNextSaveRef.current = true;
    handleResetState();
    setCurrentReconciliationId(newId);
    setCurrentReconciliationName(`مطابقة ${dateStr}`);
    showToast('✓ مطابقة جديدة جاهزة');
  };

  const handleLoadReconciliation = async (id) => {
    if (!user) return;
    setIsLoadingData(true);
    try {
      const item = savedReconciliations.find(r => r.id === id);
      if (!item) { showToast('⚠️ لم نتمكن من تحميل المطابقة'); return; }

      skipNextSaveRef.current = true;
      setCurrentReconciliationId(id);
      setCurrentReconciliationName(item.name || 'بدون اسم');
      setBankText(item.bankText || '');
      setInternalText(item.internalText || '');
      setManuallyResolvedRefs(new Set(item.manuallyResolvedRefs || []));
      setResolvedCustomers(item.resolvedCustomers || {});
      setCorrectDist(item.correctDist || {});

      // Re-parse the texts to rebuild entries
      if (item.bankText) setBankEntries(parseBank(item.bankText));
      if (item.internalText) setInternalEntries(parseInternal(item.internalText));
      setHasRun(item.hasRun || false);
      setExpandedRef(null);
      setActiveStatusFilter('all');
      setSearchQuery('');

      showToast(`✓ تم فتح: ${item.name}`);
    } catch (err) {
      console.error('Load error:', err);
      showToast('⚠️ فشل التحميل');
    } finally {
      setTimeout(() => setIsLoadingData(false), 200);
    }
  };

  const handleRenameReconciliation = async (id, newName) => {
    if (!user || !newName.trim()) return;
    if (id === 'current' || id === currentReconciliationId) {
      setCurrentReconciliationName(newName.trim());
      showToast('✓ تم تغيير الاسم');
      return;
    }
    try {
      await setDoc(doc(db, 'users', user.uid, 'reconciliations', id), { name: newName.trim() }, { merge: true });
      loadSavedList();
      showToast('✓ تم تغيير الاسم');
    } catch (err) {
      showToast('⚠️ فشل التعديل');
    }
  };

  const handleDeleteReconciliation = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'reconciliations', id));
      if (id === currentReconciliationId) {
        handleNewReconciliation();
      } else {
        loadSavedList();
      }
      showToast('✓ تم الحذف');
    } catch (err) {
      showToast('⚠️ فشل الحذف');
    }
  };

  const handleSignOut = async () => {
    if (confirm('هل تريد تسجيل الخروج؟')) {
      await signOut(auth);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const results = useMemo(
    () => reconcile(bankEntries, internalEntries, manuallyResolvedRefs, resolvedCustomers),
    [bankEntries, internalEntries, manuallyResolvedRefs, resolvedCustomers]
  );

  const stats = useMemo(() => {
    const matched = results.filter(r => r.status === 'matched').length;
    const manualMatched = results.filter(r => r.isManualResolved).length;
    const surplus = results.filter(r => r.status === 'surplus').length;
    const shortage = results.filter(r => r.status === 'shortage').length;
    const onlyBank = results.filter(r => r.status === 'only_bank').length;
    const onlyInt = results.filter(r => r.status === 'only_internal').length;

    // Original totals (ثابت — مجموع كل البنك والسجل كما هو مدخل)
    const originalBank = bankEntries.reduce((s, e) => s + e.amount, 0);
    const originalInt = internalEntries.reduce((s, e) => s + e.amount, 0);
    const originalDiff = originalInt - originalBank;

    // Remaining totals (يتفاعل مع المطابقة):
    // - المراجع المطابقة تخرج تماماً من البنك والسجل
    // - المراجع غير المطابقة: نخصم منها العملاء المعالجين (matched/add/refund)
    let remainingBank = 0;
    let remainingInt = 0;
    results.forEach(r => {
      if (r.status === 'matched') return; // المطابقة تخرج كاملة
      remainingBank += r.bankAmount;
      // اخصم العملاء المعالجين من إجمالي السجل المتبقي
      const openCustomersTotal = r.customers
        .filter(c => !c.resolution)
        .reduce((s, c) => s + c.amount, 0);
      remainingInt += openCustomersTotal;
    });
    const remainingDiff = remainingInt - remainingBank;

    const issuesCount = surplus + shortage + onlyBank + onlyInt;
    return {
      matched, manualMatched, surplus, shortage, onlyBank, onlyInt,
      originalBank, originalInt, originalDiff,
      remainingBank, remainingInt, remainingDiff,
      // backward-compat aliases
      totalBank: originalBank, totalInt: originalInt, totalDiff: originalDiff,
      issuesCount, total: results.length
    };
  }, [results, bankEntries, internalEntries]);

  // Queue: all customers with action 'add' or 'refund'
  const queueItems = useMemo(() => {
    return Object.entries(resolvedCustomers)
      .filter(([_, v]) => v.action === 'add' || v.action === 'refund')
      .map(([id, v]) => ({ id, ...v }));
  }, [resolvedCustomers]);

  const queueStats = useMemo(() => {
    const addItems = queueItems.filter(q => q.action === 'add');
    const refundItems = queueItems.filter(q => q.action === 'refund');
    return {
      count: queueItems.length,
      addCount: addItems.length,
      refundCount: refundItems.length,
      addTotal: addItems.reduce((s, q) => s + q.amount, 0),
      refundTotal: refundItems.reduce((s, q) => s + q.amount, 0)
    };
  }, [queueItems]);

  const filteredResults = useMemo(() => {
    let arr = results;
    if (activeStatusFilter === 'issues') arr = arr.filter(r => r.status !== 'matched');
    else if (activeStatusFilter === 'manual') arr = arr.filter(r => r.isManualResolved);
    else if (activeStatusFilter !== 'all') arr = arr.filter(r => r.status === activeStatusFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();

      // هل المستخدم يبحث برقم؟ (مبلغ)
      const queryAsNumber = parseFloat(q.replace(/[^\d.\-]/g, ''));
      const isNumericSearch = !isNaN(queryAsNumber) && /^[\d.,\-\s]+$/.test(q);

      const matchesAmount = (amount) => {
        if (!isNumericSearch) return false;
        // مقارنة مرنة: يبحث 50 يطلع كل اللي فيهم 50 (50.00 / 1500 / 500 / 250)
        const amtStr = amount.toFixed(2);
        const amtStrNoDecimal = String(Math.round(amount));
        return amtStr.includes(q) || amtStrNoDecimal.includes(q);
      };

      arr = arr.filter(r => {
        // ١) المرجع
        if (r.reference.toLowerCase().includes(q)) return true;

        // ٢) التاريخ
        if (r.bankDate && r.bankDate.toLowerCase().includes(q)) return true;

        // ٣) وصف العملية البنكية (تفاصيل التحويل، اسم المحول، رقم الحساب، إلخ)
        if (r.bankDescription && r.bankDescription.toLowerCase().includes(q)) return true;

        // ٤) مبلغ البنك
        if (matchesAmount(r.bankAmount)) return true;

        // ٥) مبلغ السجل الإجمالي
        if (matchesAmount(r.internalTotal)) return true;

        // ٦) أسماء العملاء أو مبالغهم الفردية
        if (r.customers.some(c =>
          c.customer.toLowerCase().includes(q) ||
          matchesAmount(c.amount)
        )) return true;

        return false;
      });
    }
    return arr;
  }, [results, activeStatusFilter, searchQuery]);

  const handleMatch = () => {
    const b = parseBank(bankText);
    const i = parseInternal(internalText);
    setBankEntries(b);
    setInternalEntries(i);
    setHasRun(true);
    setExpandedRef(null);
    setCorrectDist({});
    setManuallyResolvedRefs(new Set());
    setResolvedCustomers({});
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleLoadSample = () => { setBankText(SAMPLE_BANK); setInternalText(SAMPLE_INTERNAL); };
  const handleLoadSampleFull = () => { setBankText(SAMPLE_BANK_FULL); setInternalText(SAMPLE_INTERNAL); };
  const handleReset = () => {
    setBankText(''); setInternalText('');
    setBankEntries([]); setInternalEntries([]);
    setHasRun(false); setExpandedRef(null);
    setCorrectDist({}); setManuallyResolvedRefs(new Set());
    setResolvedCustomers({});
    setSearchQuery(''); setActiveStatusFilter('all');
  };

  const updateCorrectDist = (ref, newDist) => {
    setCorrectDist(prev => ({ ...prev, [ref]: newDist }));
  };

  const toggleResolveRef = (ref) => {
    setManuallyResolvedRefs(prev => {
      const next = new Set(prev);
      if (next.has(ref)) { next.delete(ref); showToast('تم إلغاء المطابقة اليدوية'); }
      else { next.add(ref); showToast('✓ تمت المطابقة يدوياً'); }
      return next;
    });
  };

  const resolveCustomer = (customer, action, note = '', ref = '') => {
    setResolvedCustomers(prev => ({
      ...prev,
      [customer.id]: {
        action,
        note,
        customer: customer.customer,
        amount: customer.amount,
        ref: ref || customer.reference || ''
      }
    }));
    const msg = action === 'add' ? '✓ تم إضافة العميل لقائمة الإضافة' :
                action === 'refund' ? '✓ تم إضافة العميل لقائمة الاسترداد' :
                '✓ تمت مطابقة العميل';
    showToast(msg);
  };

  const unresolveCustomer = (customerId) => {
    setResolvedCustomers(prev => {
      const next = { ...prev };
      delete next[customerId];
      return next;
    });
    showToast('تم التراجع');
  };

  const scrollToRef = (ref) => {
    const el = refRowRefs.current[ref];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ===== Conditional renders (AFTER all hooks) =====
  if (authLoading) {
    return (
      <div dir="rtl" className="paper-bg min-h-screen flex items-center justify-center">
        <style>{STYLES}</style>
        <div className="text-center">
          <div className="inline-flex items-center justify-center rounded-2xl p-3 mb-3 animate-pulse-soft" style={{ background: '#0F3D2E', color: '#FBF7EE' }}>
            <BookOpen size={28} strokeWidth={2.5} />
          </div>
          <p className="font-display opacity-60" style={{ color: '#0F3D2E' }}>جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div dir="rtl" className="paper-bg min-h-screen pb-16">
      <style>{STYLES}</style>

      {/* SAVED RECONCILIATIONS BAR */}
      <SavedReconciliationsBar
        user={user}
        currentId={currentReconciliationId}
        currentName={currentReconciliationName}
        savedList={savedReconciliations}
        onLoad={handleLoadReconciliation}
        onNew={handleNewReconciliation}
        onRename={handleRenameReconciliation}
        onDelete={handleDeleteReconciliation}
        onSignOut={handleSignOut}
        syncStatus={syncStatus}
      />

      {/* HEADER */}
      <header className="relative overflow-hidden border-b-2" style={{ borderColor: 'rgba(15, 61, 46, 0.15)' }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `repeating-linear-gradient(0deg, #0F3D2E 0, #0F3D2E 1px, transparent 1px, transparent 32px)`
        }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6 relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-md p-1.5" style={{ background: '#0F3D2E', color: '#FBF7EE' }}>
                  <BookOpen size={16} strokeWidth={2.5} />
                </div>
                <div className="font-display text-xs tracking-[0.3em] opacity-70" style={{ color: '#0F3D2E' }}>
                  دفـتـر الـمـطـابـقـة
                </div>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight ink-shadow" style={{ color: '#0F3D2E' }}>
                مطابقة الحساب البنكي
                <br />
                <span className="text-2xl sm:text-3xl opacity-70 font-normal">مع سجل العملاء</span>
              </h1>
              <p className="font-body text-sm sm:text-base mt-3 max-w-xl leading-relaxed" style={{ color: '#3c2e1a' }}>
                أداة محاسبية ذكية تطابق إجمالي كل مرجع بين البنك والسجل الداخلي، وتُحدد بدقة الفروقات،
                المكررات، والأخطاء في توزيع المبالغ على العملاء.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 mt-1">
              <div className="stamp text-xs" style={{ color: '#7c2d12' }}>
                <ScrollText size={12} />
                نسخة المحاسب
              </div>
              <div className="font-mono text-[10px] opacity-50 tracking-wider" style={{ color: '#0F3D2E' }}>
                №{new Date().getFullYear()}/AR/REC
              </div>
            </div>
          </div>

          {/* View tabs */}
          {hasRun && (
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveView('reconcile')}
                className="font-display font-bold text-sm rounded-lg px-4 py-2 flex items-center gap-2 transition-all"
                style={{
                  background: activeView === 'reconcile' ? '#0F3D2E' : 'transparent',
                  color: activeView === 'reconcile' ? '#FBF7EE' : '#0F3D2E',
                  border: `1px solid ${activeView === 'reconcile' ? '#0F3D2E' : 'rgba(15, 61, 46, 0.25)'}`
                }}
              >
                <BookOpen size={14} />
                المطابقة
              </button>
              <button
                onClick={() => setActiveView('queue')}
                className="font-display font-bold text-sm rounded-lg px-4 py-2 flex items-center gap-2 transition-all relative"
                style={{
                  background: activeView === 'queue' ? '#1E3A8A' : 'transparent',
                  color: activeView === 'queue' ? '#FBF7EE' : '#1E3A8A',
                  border: `1px solid ${activeView === 'queue' ? '#1E3A8A' : 'rgba(30, 58, 138, 0.3)'}`
                }}
              >
                <Inbox size={14} />
                قائمة المعالجة
                {queueStats.count > 0 && (
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-full" style={{
                    background: activeView === 'queue' ? 'rgba(255,255,255,0.2)' : '#1E3A8A',
                    color: '#FBF7EE'
                  }}>
                    {queueStats.count}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
        <div className="divider-double max-w-6xl mx-auto" />
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-10">

        {activeView === 'reconcile' && (
          <>
            {/* INPUT SECTION */}
            <section>
              <div className="flex items-end gap-3 mb-5">
                <div className="font-display text-6xl font-bold opacity-15 leading-none" style={{ color: '#0F3D2E' }}>١</div>
                <div className="pb-1">
                  <div className="font-display text-xs tracking-[0.25em] opacity-60" style={{ color: '#0F3D2E' }}>الخطوة الأولى</div>
                  <h2 className="font-display text-2xl font-bold" style={{ color: '#0F3D2E' }}>إدخال البيانات</h2>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="paper-card rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 left-0 h-1" style={{ background: 'linear-gradient(90deg, #0F3D2E, #1a5d44, #0F3D2E)' }} />
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg p-1.5" style={{ background: '#0F3D2E', color: '#FBF7EE' }}>
                        <Banknote size={16} strokeWidth={2.5} />
                      </div>
                      <h3 className="font-display text-lg font-bold" style={{ color: '#0F3D2E' }}>الكشف البنكي</h3>
                    </div>
                    <span className="font-mono text-xs opacity-50">{parseBank(bankText).length} حركة</span>
                  </div>

                  <div className="space-y-1 mb-2">
                    <p className="font-body text-xs font-bold opacity-80" style={{ color: '#0F3D2E' }}>
                      الصق من البنك مباشرة أو الصيغة المبسّطة
                    </p>
                    <p className="font-body text-[11px] opacity-60" style={{ color: '#1c1917' }}>
                      ✓ كشف بنكي كامل: <span className="font-mono">تاريخ ← وصف ← مرجع ← مبلغ</span>
                      <br />
                      ✓ صيغة مبسّطة: <span className="font-mono">مرجع ← مبلغ</span>
                    </p>
                  </div>

                  <textarea
                    dir="ltr"
                    value={bankText}
                    onChange={(e) => setBankText(e.target.value)}
                    placeholder={`POS-1001\t5000.00\nأو الصق كشف البنك كاملاً كما هو`}
                    className="input-field font-mono text-xs w-full h-32 resize-none scroll-hide"
                    style={{ textAlign: 'left', lineHeight: '1.6' }}
                  />

                  <ParsedPreview entries={parseBank(bankText)} type="bank" color="#0F3D2E" accentBg="rgba(15, 61, 46, 0.05)" />
                </div>

                <div className="paper-card rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 left-0 h-1" style={{ background: 'linear-gradient(90deg, #7c2d12, #b45309, #7c2d12)' }} />
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg p-1.5" style={{ background: '#7c2d12', color: '#FBF7EE' }}>
                        <Users size={16} strokeWidth={2.5} />
                      </div>
                      <h3 className="font-display text-lg font-bold" style={{ color: '#7c2d12' }}>السجل الداخلي</h3>
                    </div>
                    <span className="font-mono text-xs opacity-50">{parseInternal(internalText).length} قيد</span>
                  </div>

                  <div className="space-y-1 mb-2">
                    <p className="font-body text-xs font-bold opacity-80" style={{ color: '#7c2d12' }}>
                      سجل العملاء على كل مرجع
                    </p>
                    <p className="font-body text-[11px] opacity-60" style={{ color: '#1c1917' }}>
                      ✓ الصيغة: <span className="font-mono">مرجع ← اسم/وصف ← مبلغ</span>
                      <br />
                      ✓ اسم العميل ممكن يكون قصير أو وصف طويل — يُقبل كاملاً
                      <br />
                      ✓ ممكن تكرّر المرجع مع أكثر من عميل
                    </p>
                  </div>

                  <textarea
                    dir="ltr"
                    value={internalText}
                    onChange={(e) => setInternalText(e.target.value)}
                    placeholder={`POS-1001\tأحمد الغامدي\t2000.00\nPOS-1001\tسارة العتيبي\t3000.00`}
                    className="input-field font-mono text-xs w-full h-32 resize-none scroll-hide"
                    style={{ textAlign: 'left', lineHeight: '1.6' }}
                  />

                  <ParsedPreview entries={parseInternal(internalText)} type="internal" color="#7c2d12" accentBg="rgba(124, 45, 18, 0.05)" />
                </div>
              </div>

              <div className="paper-card rounded-lg p-3 mb-4 flex items-start gap-2.5 border-r-4" style={{ borderColor: '#92400E' }}>
                <Sparkles size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#92400E' }} />
                <p className="font-body text-xs leading-relaxed opacity-80" style={{ color: '#1c1917' }}>
                  <span className="font-bold">المُحلّل الذكي:</span> الصق أي شيء — الكشف البنكي بكامل أعمدته،
                  أو صيغة مبسّطة، أو حتى من Excel. النظام يستخرج تلقائياً ما يحتاجه من <span className="font-bold">مرجع + مبلغ</span>،
                  ويتجاهل العناوين والوصف الزائد.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleMatch} disabled={!bankText.trim() || !internalText.trim()} className="btn-primary font-display font-bold text-sm rounded-lg px-5 py-2.5 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ArrowLeftRight size={16} strokeWidth={2.5} />
                  نفّذ المطابقة
                </button>
                <button onClick={handleLoadSample} className="btn-secondary font-body font-bold text-sm rounded-lg px-4 py-2.5 flex items-center gap-2">
                  <ClipboardPaste size={14} />
                  مثال بسيط
                </button>
                <button onClick={handleLoadSampleFull} className="btn-secondary font-body font-bold text-sm rounded-lg px-4 py-2.5 flex items-center gap-2">
                  <Banknote size={14} />
                  مثال كشف بنكي كامل
                </button>
                <button onClick={handleReset} className="btn-danger font-body font-bold text-sm rounded-lg px-4 py-2.5 flex items-center gap-2">
                  <RotateCcw size={14} />
                  مسح
                </button>
              </div>
            </section>

            {/* RESULTS */}
            {hasRun && results.length > 0 && (
              <section ref={resultsRef}>
                <div className="flex items-end gap-3 mb-5">
                  <div className="font-display text-6xl font-bold opacity-15 leading-none" style={{ color: '#0F3D2E' }}>٢</div>
                  <div className="pb-1">
                    <div className="font-display text-xs tracking-[0.25em] opacity-60" style={{ color: '#0F3D2E' }}>الخطوة الثانية</div>
                    <h2 className="font-display text-2xl font-bold" style={{ color: '#0F3D2E' }}>نتائج المطابقة</h2>
                  </div>
                </div>

                {/* Totals — قسمين: المتبقي للمعالجة + الإجمالي الأصلي */}
                <div className="paper-card rounded-xl p-5 mb-5 relative overflow-hidden">
                  {/* العنوان */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg p-1.5" style={{ background: '#0F3D2E', color: '#FBF7EE' }}>
                        <FileSearch size={14} strokeWidth={2.5} />
                      </div>
                      <h3 className="font-display text-base sm:text-lg font-bold" style={{ color: '#0F3D2E' }}>الميزان المحاسبي</h3>
                    </div>
                    {(stats.matched > 0 || Object.keys(resolvedCustomers).length > 0) && (
                      <span className="font-body text-[11px] px-2.5 py-1 rounded-full" style={{ background: '#E8F0EB', color: '#0F3D2E' }}>
                        🔄 يتفاعل تلقائياً مع المطابقات
                      </span>
                    )}
                  </div>

                  {/* القسم الأساسي: المتبقي بعد المعالجة */}
                  <div className="mb-4">
                    <div className="font-display text-[10px] tracking-[0.3em] opacity-60 mb-2 flex items-center gap-2" style={{ color: '#0F3D2E' }}>
                      <span>المتبقي للمعالجة</span>
                      <div className="h-px flex-1" style={{ background: 'rgba(15, 61, 46, 0.15)' }} />
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="paper-card rounded-lg p-3">
                        <div className="font-display text-[10px] tracking-[0.15em] opacity-50 mb-1" style={{ color: '#0F3D2E' }}>إجمالي البنك</div>
                        <div className="font-mono text-lg sm:text-2xl font-bold tabular" style={{ color: '#0F3D2E' }}>{fmt(stats.remainingBank)}</div>
                      </div>
                      <div className="paper-card rounded-lg p-3">
                        <div className="font-display text-[10px] tracking-[0.15em] opacity-50 mb-1" style={{ color: '#7c2d12' }}>إجمالي السجل</div>
                        <div className="font-mono text-lg sm:text-2xl font-bold tabular" style={{ color: '#7c2d12' }}>{fmt(stats.remainingInt)}</div>
                      </div>
                      <div className="paper-card rounded-lg p-3" style={{
                        background: Math.abs(stats.remainingDiff) < 0.005 ? 'linear-gradient(180deg, #E8F0EB 0%, #d4e3da 100%)' : undefined
                      }}>
                        <div className="font-display text-[10px] tracking-[0.15em] opacity-50 mb-1" style={{ color: '#0F3D2E' }}>صافي الفرق</div>
                        <div className="font-mono text-lg sm:text-2xl font-bold tabular" style={{
                          color: Math.abs(stats.remainingDiff) < 0.005 ? '#0F3D2E' : stats.remainingDiff > 0 ? '#92400E' : '#991B1B'
                        }}>
                          {fmtSigned(stats.remainingDiff)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* القسم الثانوي: الإجمالي الأصلي (ثابت كمرجع) */}
                  <div>
                    <div className="font-display text-[10px] tracking-[0.3em] opacity-50 mb-2 flex items-center gap-2" style={{ color: '#0F3D2E' }}>
                      <span>الإجمالي الأصلي</span>
                      <div className="h-px flex-1" style={{ background: 'rgba(15, 61, 46, 0.1)' }} />
                      <span className="text-[9px] opacity-70 font-body">(كمرجع — ثابت)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center opacity-70">
                      <div>
                        <div className="font-mono text-sm sm:text-base font-bold tabular" style={{ color: '#0F3D2E' }}>{fmt(stats.originalBank)}</div>
                      </div>
                      <div className="border-x" style={{ borderColor: 'rgba(15, 61, 46, 0.1)' }}>
                        <div className="font-mono text-sm sm:text-base font-bold tabular" style={{ color: '#7c2d12' }}>{fmt(stats.originalInt)}</div>
                      </div>
                      <div>
                        <div className="font-mono text-sm sm:text-base font-bold tabular" style={{
                          color: Math.abs(stats.originalDiff) < 0.005 ? '#0F3D2E' : stats.originalDiff > 0 ? '#92400E' : '#991B1B'
                        }}>
                          {fmtSigned(stats.originalDiff)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {Math.abs(stats.remainingDiff) < 0.005 && stats.remainingBank === 0 && stats.remainingInt === 0 && results.length > 0 && (
                    <div className="mt-4 pt-4 border-t flex items-center justify-center gap-2" style={{ borderColor: 'rgba(15, 61, 46, 0.15)' }}>
                      <CheckCircle2 size={18} style={{ color: '#0F3D2E' }} />
                      <span className="font-display font-bold" style={{ color: '#0F3D2E' }}>✓ تمت معالجة جميع المراجع — الحساب مغلق</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                  <StatCard icon={CircleCheck} label="مراجع مطابقة" value={stats.matched} sub={stats.manualMatched > 0 ? `منها ${stats.manualMatched} يدوياً` : null} color="#0F3D2E" bg="#E8F0EB" delay={0} onClick={() => setActiveStatusFilter('matched')} active={activeStatusFilter === 'matched'} />
                  <StatCard icon={CircleMinus} label="فيها نقص" value={stats.shortage} sub="السجل أقل من البنك" color="#991B1B" bg="#FEE2E2" delay={60} onClick={() => setActiveStatusFilter('shortage')} active={activeStatusFilter === 'shortage'} />
                  <StatCard icon={CirclePlus} label="فيها زيادة" value={stats.surplus} sub="السجل أكثر من البنك" color="#92400E" bg="#FEF3C7" delay={120} onClick={() => setActiveStatusFilter('surplus')} active={activeStatusFilter === 'surplus'} />
                  <StatCard icon={Banknote} label="في البنك فقط" value={stats.onlyBank} color="#1E3A8A" bg="#DBEAFE" delay={180} onClick={() => setActiveStatusFilter('only_bank')} active={activeStatusFilter === 'only_bank'} />
                  <StatCard icon={ReceiptText} label="في السجل فقط" value={stats.onlyInt} color="#5B21B6" bg="#EDE9FE" delay={240} onClick={() => setActiveStatusFilter('only_internal')} active={activeStatusFilter === 'only_internal'} />
                </div>

                {/* Filter & search */}
                <div className="paper-card rounded-xl p-3 mb-4 sticky top-2 z-20 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative flex-1 min-w-0">
                      <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث في كل شي: مرجع · اسم · مبلغ · تاريخ · وصف العملية..."
                        className="input-field text-sm w-full pr-9"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100">
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-body text-xs opacity-60">الفلتر:</span>
                      <span className="font-display text-xs font-bold px-2.5 py-1 rounded-md" style={{ background: '#0F3D2E', color: '#FBF7EE' }}>
                        {{
                          all: 'الكل',
                          issues: 'فيها فروقات',
                          matched: 'مطابقة',
                          shortage: 'نقص',
                          surplus: 'زيادة',
                          only_bank: 'في البنك فقط',
                          only_internal: 'في السجل فقط',
                          manual: 'يدوياً'
                        }[activeStatusFilter]}
                        <span className="opacity-70 mr-1">({filteredResults.length})</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 overflow-x-auto scroll-hide pb-1">
                    {[
                      { key: 'all', label: 'الكل', count: stats.total },
                      { key: 'issues', label: 'فيها فروقات', count: stats.issuesCount },
                      { key: 'matched', label: 'مطابقة', count: stats.matched },
                      { key: 'shortage', label: 'نقص', count: stats.shortage },
                      { key: 'surplus', label: 'زيادة', count: stats.surplus },
                      { key: 'only_bank', label: 'بنك فقط', count: stats.onlyBank },
                      { key: 'only_internal', label: 'سجل فقط', count: stats.onlyInt },
                      ...(stats.manualMatched > 0 ? [{ key: 'manual', label: 'تمت يدوياً', count: stats.manualMatched }] : []),
                    ].map(f => (
                      <button key={f.key} onClick={() => setActiveStatusFilter(f.key)} className={`font-body font-bold text-xs rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-all whitespace-nowrap ${activeStatusFilter === f.key ? '' : 'opacity-60 hover:opacity-100'}`} style={{
                        background: activeStatusFilter === f.key ? '#0F3D2E' : 'transparent',
                        color: activeStatusFilter === f.key ? '#FBF7EE' : '#0F3D2E',
                        border: `1px solid ${activeStatusFilter === f.key ? '#0F3D2E' : 'rgba(15, 61, 46, 0.25)'}`
                      }}>
                        {f.label}
                        <span className="font-mono opacity-70">({f.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* References list */}
                <div className="space-y-2.5">
                  {filteredResults.map((r, idx) => (
                    <ReferenceRow
                      key={r.reference}
                      r={r}
                      rowRef={(el) => { if (el) refRowRefs.current[r.reference] = el; }}
                      isOpen={expandedRef === r.reference}
                      onToggle={() => setExpandedRef(expandedRef === r.reference ? null : r.reference)}
                      onClose={() => setExpandedRef(null)}
                      correctDist={correctDist[r.reference]}
                      setCorrectDist={(d) => updateCorrectDist(r.reference, d)}
                      onToggleResolve={() => toggleResolveRef(r.reference)}
                      onScrollUp={() => scrollToRef(r.reference)}
                      onResolveCustomer={resolveCustomer}
                      onUnresolveCustomer={unresolveCustomer}
                      onShowModal={(type, data) => setModal({ type, data })}
                      delay={idx * 25}
                      showToast={showToast}
                    />
                  ))}
                  {filteredResults.length === 0 && (
                    <div className="paper-card rounded-xl p-8 text-center opacity-60">
                      <FileSearch size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="font-body text-sm">لا توجد نتائج بهذا الفلتر{searchQuery && ' أو البحث'}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {hasRun && results.length === 0 && (
              <div className="paper-card rounded-xl p-8 text-center">
                <CircleAlert size={32} className="mx-auto mb-2" style={{ color: '#92400E' }} />
                <p className="font-body" style={{ color: '#92400E' }}>لم نتمكن من قراءة البيانات. تأكد من الصيغة.</p>
              </div>
            )}
          </>
        )}

        {/* QUEUE VIEW */}
        {activeView === 'queue' && (
          <QueueView
            queueItems={queueItems}
            queueStats={queueStats}
            onUnresolve={unresolveCustomer}
            onGoToRef={(ref) => { setActiveView('reconcile'); setExpandedRef(ref); setTimeout(() => scrollToRef(ref), 200); }}
            showToast={showToast}
          />
        )}
      </main>

      {/* MODAL */}
      {modal?.type === 'date' && (
        <Modal open={true} onClose={() => setModal(null)} title="تاريخ العملية البنكية" icon={Calendar} color="#0F3D2E">
          <div className="space-y-3">
            <div className="paper-card rounded-lg p-4">
              <div className="font-display text-xs tracking-widest opacity-50 mb-1">المرجع</div>
              <div className="font-mono font-bold text-lg" style={{ color: '#0F3D2E' }} dir="ltr">{modal.data.reference}</div>
            </div>
            <div className="paper-card rounded-lg p-4">
              <div className="font-display text-xs tracking-widest opacity-50 mb-1">التاريخ</div>
              {modal.data.date ? (
                <div className="font-mono font-bold text-2xl" style={{ color: '#0F3D2E' }} dir="ltr">{modal.data.date}</div>
              ) : (
                <div className="font-body opacity-60">لم يتم تحديد التاريخ في الكشف البنكي</div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === 'description' && (
        <Modal open={true} onClose={() => setModal(null)} title="تفاصيل العملية البنكية" icon={Info} color="#0F3D2E">
          <div className="space-y-3">
            <div className="paper-card rounded-lg p-4">
              <div className="font-display text-xs tracking-widest opacity-50 mb-1">المرجع</div>
              <div className="font-mono font-bold text-lg" style={{ color: '#0F3D2E' }} dir="ltr">{modal.data.reference}</div>
            </div>
            <div className="paper-card rounded-lg p-4">
              <div className="font-display text-xs tracking-widest opacity-50 mb-1">الوصف الكامل من البنك</div>
              {modal.data.description ? (
                <div className="font-body text-sm leading-relaxed mt-2 p-3 rounded-md" style={{ background: 'rgba(15, 61, 46, 0.04)' }} dir="ltr">
                  {modal.data.description}
                </div>
              ) : (
                <div className="font-body opacity-60">لا يوجد وصف تفصيلي لهذه العملية</div>
              )}
            </div>
            {modal.data.date && (
              <div className="paper-card rounded-lg p-4">
                <div className="font-display text-xs tracking-widest opacity-50 mb-1">التاريخ</div>
                <div className="font-mono font-bold" style={{ color: '#0F3D2E' }} dir="ltr">{modal.data.date}</div>
              </div>
            )}
            <div className="paper-card rounded-lg p-4">
              <div className="font-display text-xs tracking-widest opacity-50 mb-1">المبلغ</div>
              <div className="font-mono font-bold text-xl" style={{ color: '#0F3D2E' }}>{fmt(modal.data.amount)}</div>
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === 'resolve_customer' && (
        <ResolveCustomerModal
          data={modal.data}
          onClose={() => setModal(null)}
          onResolve={(action, note) => {
            resolveCustomer(modal.data.customer, action, note, modal.data.reference);
            setModal(null);
          }}
        />
      )}

      {toast && (
        <div className="toast">
          <Check size={14} strokeWidth={3} />
          {toast}
        </div>
      )}

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 pt-6 border-t" style={{ borderColor: 'rgba(15, 61, 46, 0.15)' }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-display text-xs opacity-50" style={{ color: '#0F3D2E' }}>
            <BookOpen size={12} />
            <span>دفتر المطابقة · أداة محاسبية</span>
          </div>
          <div className="font-mono text-[10px] opacity-40 tracking-wider" style={{ color: '#0F3D2E' }}>
            ◊  END  OF  LEDGER  ◊
          </div>
        </div>
      </footer>
    </div>
  );
}

// ===================== RESOLVE CUSTOMER MODAL =====================
const ResolveCustomerModal = ({ data, onClose, onResolve }) => {
  const [action, setAction] = useState('add');
  const [note, setNote] = useState('');

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="معالجة هذا العميل لاحقاً"
      icon={ListTodo}
      color="#1E3A8A"
      footer={
        <div className="flex items-center gap-2 justify-end">
          <button onClick={onClose} className="btn-secondary font-body font-bold text-sm rounded-lg px-4 py-2">
            إلغاء
          </button>
          <button
            onClick={() => onResolve(action, note)}
            className="btn-primary font-body font-bold text-sm rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <ListTodo size={14} />
            إضافة لقائمة المعالجة
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Customer info */}
        <div className="paper-card rounded-lg p-3 flex items-center justify-between">
          <div>
            <div className="font-display text-[10px] tracking-widest opacity-50">العميل</div>
            <div className="font-body font-bold">{data.customer.customer}</div>
            <div className="font-mono text-[11px] opacity-60 mt-0.5" dir="ltr">على المرجع: {data.reference}</div>
          </div>
          <div className="text-left">
            <div className="font-display text-[10px] tracking-widest opacity-50">المبلغ</div>
            <div className="font-mono font-bold text-lg" style={{ color: '#1E3A8A' }}>{fmt(data.customer.amount)}</div>
          </div>
        </div>

        {/* Action choice */}
        <div>
          <div className="font-display text-xs font-bold mb-2" style={{ color: '#1E3A8A' }}>
            نوع المعالجة المطلوبة:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAction('add')}
              className="paper-card rounded-lg p-3 text-right transition-all"
              style={{
                boxShadow: action === 'add' ? '0 0 0 2px #1E3A8A' : undefined
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="rounded-md p-1.5" style={{ background: '#DBEAFE', color: '#1E3A8A' }}>
                  <ArrowDownToLine size={14} strokeWidth={2.5} />
                </div>
                <span className="font-display font-bold text-sm" style={{ color: '#1E3A8A' }}>إضافة</span>
                {action === 'add' && <Check size={14} className="mr-auto" style={{ color: '#1E3A8A' }} />}
              </div>
              <p className="font-body text-[11px] opacity-70">يحتاج إصدار فاتورة أو إضافة للسجل</p>
            </button>

            <button
              onClick={() => setAction('refund')}
              className="paper-card rounded-lg p-3 text-right transition-all"
              style={{
                boxShadow: action === 'refund' ? '0 0 0 2px #991B1B' : undefined
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="rounded-md p-1.5" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                  <ArrowUpFromLine size={14} strokeWidth={2.5} />
                </div>
                <span className="font-display font-bold text-sm" style={{ color: '#991B1B' }}>استرداد</span>
                {action === 'refund' && <Check size={14} className="mr-auto" style={{ color: '#991B1B' }} />}
              </div>
              <p className="font-body text-[11px] opacity-70">يحتاج إصدار إشعار دائن أو رد المبلغ</p>
            </button>
          </div>
        </div>

        {/* Note */}
        <div>
          <div className="font-display text-xs font-bold mb-1.5 flex items-center gap-1.5" style={{ color: '#0F3D2E' }}>
            <MessageSquare size={11} />
            ملاحظة <span className="opacity-50 font-normal">(اختياري)</span>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="مثال: راجع مع المحاسب، السبب: تأخر التسجيل..."
            className="input-field text-sm w-full h-20 resize-none"
          />
        </div>
      </div>
    </Modal>
  );
};

// ===================== QUEUE VIEW =====================
const QueueView = ({ queueItems, queueStats, onUnresolve, onGoToRef, showToast }) => {
  const [filter, setFilter] = useState('all'); // all | add | refund

  const filtered = useMemo(() => {
    if (filter === 'all') return queueItems;
    return queueItems.filter(q => q.action === filter);
  }, [queueItems, filter]);

  const copyQueue = async () => {
    const header = 'اسم العميل\tالمبلغ\tالنوع\tالمرجع\tملاحظة\n';
    const txt = filtered.map(q => `${q.customer}\t${q.amount.toFixed(2)}\t${q.action === 'add' ? 'إضافة' : 'استرداد'}\t${q.ref}\t${q.note || ''}`).join('\n');
    const ok = await copyToClipboard(header + txt);
    showToast(ok ? '✓ تم نسخ القائمة كاملة' : '⚠️ تعذر النسخ');
  };

  const exportXls = (mode) => {
    let rows = [];
    let title = '';
    let filename = '';

    if (mode === 'all') {
      rows = queueItems;
      title = 'قائمة المعالجة الكاملة';
      filename = 'قائمة_المعالجة_الكاملة';
    } else if (mode === 'add') {
      rows = queueItems.filter(q => q.action === 'add');
      title = 'قائمة الإضافة (فواتير جديدة)';
      filename = 'قائمة_الإضافة';
    } else if (mode === 'refund') {
      rows = queueItems.filter(q => q.action === 'refund');
      title = 'قائمة الاسترداد (إشعارات دائنة)';
      filename = 'قائمة_الاسترداد';
    }

    if (rows.length === 0) {
      showToast('⚠️ لا توجد عناصر للتصدير');
      return;
    }

    const headers = mode === 'all'
      ? [
          { key: 'idx', label: '#' },
          { key: 'customer', label: 'اسم العميل' },
          { key: 'ref', label: 'المرجع' },
          { key: 'actionLabel', label: 'نوع المعالجة' },
          { key: 'note', label: 'ملاحظة' },
          { key: 'amount', label: 'المبلغ', type: 'number' }
        ]
      : [
          { key: 'idx', label: '#' },
          { key: 'customer', label: 'اسم العميل' },
          { key: 'ref', label: 'المرجع' },
          { key: 'note', label: 'ملاحظة' },
          { key: 'amount', label: 'المبلغ', type: 'number' }
        ];

    const dataRows = rows.map((q, i) => ({
      idx: i + 1,
      customer: q.customer,
      ref: q.ref,
      actionLabel: q.action === 'add' ? 'إضافة' : 'استرداد',
      note: q.note || '—',
      amount: q.amount
    }));

    const total = rows.reduce((s, q) => s + q.amount, 0);
    const summary = [];

    if (mode === 'all') {
      const addTotal = rows.filter(q => q.action === 'add').reduce((s, q) => s + q.amount, 0);
      const refundTotal = rows.filter(q => q.action === 'refund').reduce((s, q) => s + q.amount, 0);
      summary.push({ label: `عدد عملاء الإضافة: ${rows.filter(q => q.action === 'add').length} — الإجمالي`, value: addTotal });
      summary.push({ label: `عدد عملاء الاسترداد: ${rows.filter(q => q.action === 'refund').length} — الإجمالي`, value: refundTotal });
      summary.push({ label: `الإجمالي الكلي (${rows.length} عميل)`, value: total, bold: true });
    } else {
      summary.push({ label: `الإجمالي (${rows.length} ${rows.length === 1 ? 'عميل' : 'عملاء'})`, value: total, bold: true });
    }

    const date = new Date().toISOString().split('T')[0];
    exportToExcel(dataRows, headers, `${filename}_${date}`, { title, summary });
    showToast(`✓ تم تصدير ${rows.length} ${rows.length === 1 ? 'سجل' : 'سجلات'} إلى Excel`);
  };

  return (
    <section className="animate-fade-up">
      <div className="flex items-end gap-3 mb-5">
        <div className="font-display text-6xl font-bold opacity-15 leading-none" style={{ color: '#1E3A8A' }}>◈</div>
        <div className="pb-1">
          <div className="font-display text-xs tracking-[0.25em] opacity-60" style={{ color: '#1E3A8A' }}>قسم المعالجة المؤجلة</div>
          <h2 className="font-display text-2xl font-bold" style={{ color: '#1E3A8A' }}>قائمة المعالجة</h2>
        </div>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <div className="paper-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-md p-1.5" style={{ background: '#DBEAFE', color: '#1E3A8A' }}>
              <Inbox size={14} strokeWidth={2.5} />
            </div>
            <div className="font-display text-xs tracking-widest opacity-60" style={{ color: '#1E3A8A' }}>إجمالي القائمة</div>
          </div>
          <div className="font-mono text-2xl font-bold" style={{ color: '#1E3A8A' }}>{queueStats.count}</div>
        </div>
        <div className="paper-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-md p-1.5" style={{ background: '#DBEAFE', color: '#1E3A8A' }}>
              <ArrowDownToLine size={14} strokeWidth={2.5} />
            </div>
            <div className="font-display text-xs tracking-widest opacity-60" style={{ color: '#1E3A8A' }}>للإضافة (فاتورة)</div>
          </div>
          <div className="font-mono text-2xl font-bold tabular" style={{ color: '#1E3A8A' }}>{fmt(queueStats.addTotal)}</div>
          <div className="font-body text-xs opacity-60 mt-1">{queueStats.addCount} عميل</div>
        </div>
        <div className="paper-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-md p-1.5" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              <ArrowUpFromLine size={14} strokeWidth={2.5} />
            </div>
            <div className="font-display text-xs tracking-widest opacity-60" style={{ color: '#991B1B' }}>للاسترداد (دائن)</div>
          </div>
          <div className="font-mono text-2xl font-bold tabular" style={{ color: '#991B1B' }}>{fmt(queueStats.refundTotal)}</div>
          <div className="font-body text-xs opacity-60 mt-1">{queueStats.refundCount} عميل</div>
        </div>
      </div>

      {queueItems.length === 0 ? (
        <div className="paper-card rounded-xl p-12 text-center">
          <Archive size={40} className="mx-auto mb-3 opacity-40" style={{ color: '#1E3A8A' }} />
          <h3 className="font-display text-lg font-bold opacity-70 mb-1" style={{ color: '#1E3A8A' }}>
            قائمة المعالجة فارغة
          </h3>
          <p className="font-body text-sm opacity-60">
            ارجع لقسم المطابقة، اضغط على أي عميل فيه فرق، واختر "معالجة لاحقاً" مع نوع المعالجة (إضافة أو استرداد).
          </p>
        </div>
      ) : (
        <>
          {/* Export bar */}
          <div className="paper-card rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-md p-1.5" style={{ background: '#0F3D2E', color: '#FBF7EE' }}>
                <Download size={14} strokeWidth={2.5} />
              </div>
              <h3 className="font-display font-bold text-sm" style={{ color: '#0F3D2E' }}>تصدير القائمة إلى Excel</h3>
            </div>
            <p className="font-body text-xs opacity-70 mb-3" style={{ color: '#1c1917' }}>
              نزّل القائمة كاملة، أو نزّل كل نوع لوحده — الملفات تفتح مباشرة في Excel مع دعم كامل للعربية.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => exportXls('all')}
                className="btn-primary font-display font-bold text-xs rounded-lg px-3 py-2 flex items-center gap-1.5"
                title="تنزيل القائمة الكاملة (إضافة + استرداد)"
              >
                <FileSpreadsheet size={13} />
                القائمة الكاملة
                <span className="font-mono opacity-80 mr-1">({queueStats.count})</span>
              </button>
              <button
                onClick={() => exportXls('add')}
                disabled={queueStats.addCount === 0}
                className="btn-secondary font-display font-bold text-xs rounded-lg px-3 py-2 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ borderColor: 'rgba(30, 58, 138, 0.3)', color: '#1E3A8A' }}
                title="تنزيل قائمة الإضافة فقط"
              >
                <ArrowDownToLine size={12} />
                قائمة الإضافة
                <span className="font-mono opacity-80 mr-1">({queueStats.addCount})</span>
              </button>
              <button
                onClick={() => exportXls('refund')}
                disabled={queueStats.refundCount === 0}
                className="btn-secondary font-display font-bold text-xs rounded-lg px-3 py-2 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ borderColor: 'rgba(153, 27, 27, 0.3)', color: '#991B1B' }}
                title="تنزيل قائمة الاسترداد فقط"
              >
                <ArrowUpFromLine size={12} />
                قائمة الاسترداد
                <span className="font-mono opacity-80 mr-1">({queueStats.refundCount})</span>
              </button>
              <div className="h-6 w-px mx-1" style={{ background: 'rgba(15, 61, 46, 0.15)' }} />
              <button onClick={copyQueue} className="btn-secondary font-body font-bold text-xs rounded-lg px-3 py-2 flex items-center gap-1.5">
                <ClipboardList size={12} />
                نسخ (Tab-separated)
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="paper-card rounded-xl p-3 mb-4 flex items-center gap-2 flex-wrap">
            <span className="font-body text-xs opacity-60 px-1">عرض:</span>
            {[
              { key: 'all', label: 'الكل', count: queueStats.count },
              { key: 'add', label: 'إضافة', count: queueStats.addCount },
              { key: 'refund', label: 'استرداد', count: queueStats.refundCount }
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} className="font-body font-bold text-xs rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-all" style={{
                background: filter === f.key ? '#1E3A8A' : 'transparent',
                color: filter === f.key ? '#FBF7EE' : '#1E3A8A',
                border: `1px solid ${filter === f.key ? '#1E3A8A' : 'rgba(30, 58, 138, 0.3)'}`
              }}>
                {f.label}
                <span className="font-mono opacity-70">({f.count})</span>
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-2">
            {filtered.map((q, idx) => {
              const isAdd = q.action === 'add';
              const color = isAdd ? '#1E3A8A' : '#991B1B';
              const bg = isAdd ? '#DBEAFE' : '#FEE2E2';
              const Icon = isAdd ? ArrowDownToLine : ArrowUpFromLine;
              return (
                <div key={q.id} className="paper-card rounded-xl p-4 animate-fade-up" style={{
                  animationDelay: `${idx * 30}ms`,
                  borderRight: `4px solid ${color}`
                }}>
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="rounded-lg p-2 flex-shrink-0" style={{ background: bg, color }}>
                      <Icon size={16} strokeWidth={2.5} />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Top line: name + action badge */}
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-display font-bold text-[11px] px-2 py-0.5 rounded" style={{ background: bg, color }}>
                          {isAdd ? '📥 إضافة' : '📤 استرداد'}
                        </span>
                        <span className="font-body font-bold text-base">{q.customer}</span>
                      </div>

                      {/* Fields grid: customer / reference / amount, clearly labeled */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 mt-2">
                        <div>
                          <div className="font-display text-[9px] tracking-widest opacity-50">المرجع</div>
                          <div className="font-mono text-xs font-bold flex items-center gap-1" dir="ltr">
                            <Hash size={10} className="opacity-40" />
                            <span style={{ color: '#0F3D2E' }}>{q.ref}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-display text-[9px] tracking-widest opacity-50">المبلغ</div>
                          <div className="font-mono text-sm font-bold tabular" style={{ color }}>{fmt(q.amount)}</div>
                        </div>
                        {q.note && (
                          <div className="col-span-2 sm:col-span-3">
                            <div className="font-display text-[9px] tracking-widest opacity-50">ملاحظة</div>
                            <div className="font-body text-xs flex items-start gap-1 mt-0.5" style={{ color: '#1c1917' }}>
                              <MessageSquare size={9} className="mt-1 flex-shrink-0 opacity-50" />
                              <span>{q.note}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => onGoToRef(q.ref)}
                        className="btn-secondary font-body font-bold text-[11px] rounded-md px-2 py-1 flex items-center gap-1"
                        title="الذهاب للمرجع"
                      >
                        <ArrowLeftRight size={11} />
                        المرجع
                      </button>
                      <button
                        onClick={() => onUnresolve(q.id)}
                        className="btn-danger font-body font-bold text-[11px] rounded-md px-2 py-1 flex items-center gap-1"
                        title="إزالة من القائمة"
                      >
                        <Undo2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

// ===================== REFERENCE ROW =====================
const ReferenceRow = ({ r, rowRef, isOpen, onToggle, onClose, correctDist, setCorrectDist, onToggleResolve, onScrollUp, onResolveCustomer, onUnresolveCustomer, onShowModal, delay, showToast }) => {
  const meta = STATUS_META[r.status];
  const isIssue = r.status !== 'matched';
  const isManualResolved = r.isManualResolved;
  const wasAutoResolved = r.autoResolvedByCustomers;

  return (
    <div
      ref={rowRef}
      className="paper-card rounded-xl overflow-hidden animate-fade-up scroll-mt-20"
      style={{
        animationDelay: `${delay}ms`,
        borderRight: isIssue ? `4px solid ${meta.color}` : isManualResolved ? '4px solid #b45309' : '4px solid transparent'
      }}
    >
      {/* HEADER ROW */}
      <div className="p-4 flex items-center gap-2 sm:gap-3 flex-wrap">
        <button onClick={onToggle} className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity text-right">
          <div className="flex-shrink-0">
            <Pill status={r.status} isManual={isManualResolved} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <Hash size={12} className="opacity-40" />
              <span className="font-mono font-bold text-base truncate" style={{ color: '#0F3D2E' }} dir="ltr">{r.reference}</span>
              <span onClick={(e) => e.stopPropagation()}>
                <CopyButton text={r.reference} label="المرجع" size={11} showToast={showToast} />
              </span>

              {/* Eye icons - date & description */}
              {r.bankDate && (
                <button
                  onClick={(e) => { e.stopPropagation(); onShowModal('date', { reference: r.reference, date: r.bankDate, description: r.bankDescription, amount: r.bankAmount }); }}
                  className="icon-btn"
                  title="عرض تاريخ العملية"
                >
                  <Calendar size={11} />
                </button>
              )}
              {r.bankDescription && (
                <button
                  onClick={(e) => { e.stopPropagation(); onShowModal('description', { reference: r.reference, date: r.bankDate, description: r.bankDescription, amount: r.bankAmount }); }}
                  className="icon-btn"
                  title="عرض تفاصيل العملية"
                >
                  <Info size={11} />
                </button>
              )}
            </div>
            <div className="font-body text-xs opacity-60" style={{ color: '#1c1917' }}>
              {r.customers.length} {r.customers.length === 1 ? 'عميل' : 'عملاء'} · {isManualResolved ? (wasAutoResolved ? 'تمت معالجة كل العملاء' : `أصلاً: ${STATUS_META[r.baseStatus].desc}`) : meta.desc}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-5 text-left flex-shrink-0">
            <div>
              <div className="font-display text-[9px] tracking-widest opacity-50">بنك</div>
              <div className="font-mono font-bold tabular" style={{ color: '#0F3D2E' }}>{fmt(r.bankAmount)}</div>
            </div>
            <Equal size={14} className="opacity-30" />
            <div>
              <div className="font-display text-[9px] tracking-widest opacity-50">سجل</div>
              <div className="font-mono font-bold tabular" style={{ color: '#7c2d12' }}>{fmt(r.internalTotal)}</div>
            </div>
          </div>

          <div className="text-left flex-shrink-0">
            <div className="font-display text-[9px] tracking-widest opacity-50">فرق</div>
            <div className="font-mono font-bold tabular text-sm sm:text-base" style={{
              color: Math.abs(r.diff) < 0.005 || isManualResolved ? '#0F3D2E' : r.diff > 0 ? '#92400E' : '#991B1B'
            }}>
              {fmtSigned(r.diff)}
            </div>
          </div>
        </button>

        {/* Quick resolve button next to reference */}
        {isIssue && (
          <button
            onClick={onToggleResolve}
            className="btn-resolve-mini font-display font-bold text-[11px] rounded-md px-2.5 py-1.5 flex items-center gap-1.5 flex-shrink-0"
            title="مطابقة يدوية سريعة"
          >
            <Stamp size={12} strokeWidth={2.5} />
            <span className="hidden sm:inline">مطابقة يدوية</span>
            <span className="sm:hidden">يدوي</span>
          </button>
        )}

        <button onClick={onToggle} className="icon-btn flex-shrink-0" title={isOpen ? 'إغلاق' : 'فتح'}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* EXPANDED CONTENT */}
      {isOpen && (
        <div className="border-t" style={{ borderColor: 'rgba(15, 61, 46, 0.1)' }}>
          {isManualResolved && (
            <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-2 flex-wrap" style={{ background: 'rgba(254, 243, 199, 0.4)', borderBottom: '1px solid rgba(180, 83, 9, 0.2)' }}>
              <div className="flex items-center gap-2">
                <Stamp size={14} style={{ color: '#b45309' }} />
                <span className="font-display text-xs font-bold" style={{ color: '#b45309' }}>
                  {wasAutoResolved
                    ? 'تمت المطابقة تلقائياً — كل العملاء عُولجوا'
                    : `مرجع تم تأشيره كـ "تمت المطابقة يدوياً" — أصلاً فيه فرق ${fmtSigned(r.diff)}`}
                </span>
              </div>
              {!wasAutoResolved && (
                <button onClick={onToggleResolve} className="btn-secondary font-body font-bold text-xs rounded-md px-2.5 py-1 flex items-center gap-1.5">
                  <Undo2 size={12} />
                  إلغاء التأشير
                </button>
              )}
            </div>
          )}

          <div className="sm:hidden grid grid-cols-2 gap-3 p-4 border-b" style={{ borderColor: 'rgba(15, 61, 46, 0.08)' }}>
            <div className="text-center">
              <div className="font-display text-[10px] tracking-widest opacity-50">إجمالي البنك</div>
              <div className="font-mono text-lg font-bold tabular" style={{ color: '#0F3D2E' }}>{fmt(r.bankAmount)}</div>
            </div>
            <div className="text-center">
              <div className="font-display text-[10px] tracking-widest opacity-50">إجمالي السجل</div>
              <div className="font-mono text-lg font-bold tabular" style={{ color: '#7c2d12' }}>{fmt(r.internalTotal)}</div>
            </div>
          </div>

          {/* Customers */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Users size={14} style={{ color: '#7c2d12' }} />
                <h4 className="font-display font-bold text-sm" style={{ color: '#7c2d12' }}>العملاء المسجلين على هذا المرجع</h4>
              </div>
              {r.customers.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <button onClick={async (e) => {
                    e.stopPropagation();
                    const txt = r.customers.map(c => `${c.customer}\t${c.amount.toFixed(2)}`).join('\n');
                    const ok = await copyToClipboard(txt);
                    showToast(ok ? 'نُسخت قائمة العملاء كاملة' : '⚠️ تعذّر النسخ');
                  }} className="btn-secondary font-body font-bold text-[11px] rounded-md px-2 py-1 flex items-center gap-1">
                    <ClipboardList size={11} />
                    نسخ الكل
                  </button>
                  <button onClick={async (e) => {
                    e.stopPropagation();
                    const txt = r.customers.map(c => c.customer).join('\n');
                    const ok = await copyToClipboard(txt);
                    showToast(ok ? 'نُسخت أسماء العملاء' : '⚠️ تعذّر النسخ');
                  }} className="btn-secondary font-body font-bold text-[11px] rounded-md px-2 py-1 flex items-center gap-1">
                    <Users size={11} />
                    الأسماء
                  </button>
                </div>
              )}
            </div>

            {r.customers.length === 0 ? (
              <p className="font-body text-sm opacity-60 italic">لا يوجد عملاء مسجلين على هذا المرجع.</p>
            ) : (
              <div className="ledger-line">
                {r.customers.map((c, i) => (
                  <CustomerRow
                    key={c.id}
                    c={c}
                    i={i}
                    reference={r.reference}
                    isIssue={isIssue}
                    onResolveCustomer={onResolveCustomer}
                    onUnresolveCustomer={onUnresolveCustomer}
                    onShowModal={onShowModal}
                    showToast={showToast}
                  />
                ))}
                <div className="flex items-center justify-between pt-3 mt-1 border-t-2" style={{ borderColor: 'rgba(15, 61, 46, 0.2)' }}>
                  <div className="font-display font-bold text-sm" style={{ color: '#7c2d12' }}>الإجمالي</div>
                  <div className="font-mono text-base font-bold tabular" style={{ color: '#7c2d12' }}>{fmt(r.internalTotal)}</div>
                </div>
              </div>
            )}

            {/* Scroll to reference button - inside the expanded area */}
            <div className="mt-4 flex items-center justify-between gap-2 flex-wrap pt-3 border-t" style={{ borderColor: 'rgba(15, 61, 46, 0.08)' }}>
              <button onClick={onClose} className="btn-secondary font-body font-bold text-xs rounded-md px-3 py-1.5 flex items-center gap-1.5">
                <ChevronUp size={13} />
                إغلاق وعرض المرجع
              </button>
              <button onClick={onScrollUp} className="btn-secondary font-body font-bold text-xs rounded-md px-3 py-1.5 flex items-center gap-1.5">
                <ArrowUp size={13} />
                الرجوع لأعلى المرجع
              </button>
            </div>
          </div>

          {/* Diagnosis */}
          {isIssue && (
            <DiagnosisPanel
              r={r}
              correctDist={correctDist}
              setCorrectDist={setCorrectDist}
              onToggleResolve={onToggleResolve}
              showToast={showToast}
            />
          )}
        </div>
      )}
    </div>
  );
};

// ===================== CUSTOMER ROW =====================
const CustomerRow = ({ c, i, reference, isIssue, onResolveCustomer, onUnresolveCustomer, onShowModal, showToast }) => {
  const isResolved = !!c.resolution;
  const resolution = c.resolution;
  const isInQueue = resolution && (resolution.action === 'add' || resolution.action === 'refund');
  const isMatched = resolution && resolution.action === 'matched';

  let rowBg = 'transparent';
  if (isInQueue) rowBg = resolution.action === 'add' ? 'rgba(219, 234, 254, 0.3)' : 'rgba(254, 226, 226, 0.3)';
  else if (isMatched) rowBg = 'rgba(232, 240, 235, 0.4)';

  return (
    <div className="row-hover py-2 border-b last:border-b-0 transition-colors" style={{ borderColor: 'rgba(15, 61, 46, 0.06)', background: rowBg }}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="font-mono text-[10px] opacity-40 w-6 flex-shrink-0">{String(i + 1).padStart(2, '0')}</div>
          <div className="font-body text-sm truncate" style={{ color: '#1c1917', textDecoration: isMatched ? 'line-through' : 'none', opacity: isMatched ? 0.6 : 1 }}>
            {c.customer}
          </div>
          <span className="copy-btn-row">
            <CopyButton text={c.customer} label="الاسم" size={11} showToast={showToast} />
          </span>

          {/* Resolution badges */}
          {isInQueue && (
            <span className={`cust-badge ${resolution.action === 'add' ? 'cust-badge-pending' : ''}`} style={resolution.action === 'refund' ? { background: '#FEE2E2', color: '#991B1B', border: '1px solid rgba(153, 27, 27, 0.2)' } : {}}>
              {resolution.action === 'add' ? <ArrowDownToLine size={9} strokeWidth={2.5} /> : <ArrowUpFromLine size={9} strokeWidth={2.5} />}
              {resolution.action === 'add' ? 'بانتظار الإضافة' : 'بانتظار الاسترداد'}
            </span>
          )}
          {isMatched && (
            <span className="cust-badge cust-badge-resolved">
              <Check size={9} strokeWidth={3} />
              مطابق يدوياً
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Action buttons - only for issue references and not yet resolved */}
          {isIssue && !isResolved && (
            <div className="row-actions flex items-center gap-1">
              <button
                onClick={() => onShowModal('resolve_customer', { customer: c, reference })}
                className="btn-secondary font-body font-bold text-[10px] rounded-md px-2 py-0.5 flex items-center gap-1"
                title="معالجة لاحقاً (إضافة/استرداد)"
                style={{ background: '#DBEAFE', color: '#1E3A8A', borderColor: 'rgba(30, 58, 138, 0.2)' }}
              >
                <ListTodo size={10} strokeWidth={2.5} />
                معالجة
              </button>
              <button
                onClick={() => onResolveCustomer(c, 'matched', '', reference)}
                className="btn-secondary font-body font-bold text-[10px] rounded-md px-2 py-0.5 flex items-center gap-1"
                title="مطابقة هذا العميل يدوياً"
                style={{ background: '#FEF3C7', color: '#92400E', borderColor: 'rgba(180, 83, 9, 0.2)' }}
              >
                <Stamp size={10} strokeWidth={2.5} />
                مطابق
              </button>
            </div>
          )}

          {/* Undo button when resolved */}
          {isResolved && (
            <button
              onClick={() => onUnresolveCustomer(c.id)}
              className="icon-btn"
              title="تراجع"
            >
              <Undo2 size={11} />
            </button>
          )}

          <span className="copy-btn-row">
            <CopyButton text={c.amount.toFixed(2)} label="المبلغ" size={11} showToast={showToast} />
          </span>
          <div className="font-mono text-sm font-bold tabular" style={{ color: '#1c1917', opacity: isMatched ? 0.6 : 1 }}>{fmt(c.amount)}</div>
        </div>
      </div>

      {/* Note display if available */}
      {isInQueue && resolution.note && (
        <div className="mt-1 pr-9 font-body text-[11px] opacity-70 flex items-start gap-1" style={{ color: '#1c1917' }}>
          <MessageSquare size={9} className="mt-1 flex-shrink-0" />
          <span>{resolution.note}</span>
        </div>
      )}
    </div>
  );
};

// ===================== DIAGNOSIS PANEL =====================
const DiagnosisPanel = ({ r, correctDist, setCorrectDist, onToggleResolve, showToast }) => {
  const dist = correctDist || [];
  const [diagnoseClicked, setDiagnoseClicked] = useState(false);
  const [inputMode, setInputMode] = useState('rows');
  const [bulkText, setBulkText] = useState('');

  const addRow = () => { setCorrectDist([...dist, { customer: '', amount: '' }]); setDiagnoseClicked(false); };
  const updateRow = (i, field, val) => {
    const next = [...dist];
    next[i] = { ...next[i], [field]: val };
    setCorrectDist(next);
    setDiagnoseClicked(false);
  };
  const removeRow = (i) => {
    setCorrectDist(dist.filter((_, idx) => idx !== i));
    setDiagnoseClicked(false);
  };
  const fillFromCustomers = () => {
    setCorrectDist(r.customers.map(c => ({ customer: c.customer, amount: c.amount.toString() })));
    setDiagnoseClicked(false);
    showToast('تم النسخ من الحالي — عدّل الصحيح');
  };
  const applyBulk = () => {
    const parsed = parseBulkCustomers(bulkText);
    if (parsed.length === 0) { showToast('لم يتم التعرف على بيانات صحيحة'); return; }
    setCorrectDist(parsed);
    setBulkText(''); setInputMode('rows'); setDiagnoseClicked(false);
    showToast(`تم استيراد ${parsed.length} ${parsed.length === 1 ? 'عميل' : 'عملاء'}`);
  };
  const appendBulk = () => {
    const parsed = parseBulkCustomers(bulkText);
    if (parsed.length === 0) { showToast('لم يتم التعرف على بيانات صحيحة'); return; }
    setCorrectDist([...dist, ...parsed]);
    setBulkText(''); setInputMode('rows'); setDiagnoseClicked(false);
    showToast(`تم إضافة ${parsed.length} ${parsed.length === 1 ? 'عميل' : 'عملاء'}`);
  };

  const correctNorm = dist
    .filter(d => d.customer.trim() && d.amount !== '' && !isNaN(parseFloat(d.amount)))
    .map(d => ({ customer: d.customer.trim(), amount: parseFloat(d.amount) }));

  const correctTotal = correctNorm.reduce((s, c) => s + c.amount, 0);
  const correctMatchesBank = Math.abs(correctTotal - r.bankAmount) < 0.005;

  const issues = useMemo(() => {
    if (!diagnoseClicked || correctNorm.length === 0) return null;
    return diagnose(r.customers.map(c => ({ customer: c.customer, amount: c.amount })), correctNorm);
  }, [diagnoseClicked, correctNorm, r.customers]);

  return (
    <div className="border-t-2" style={{ borderColor: 'rgba(15, 61, 46, 0.15)', background: 'rgba(251, 247, 238, 0.5)' }}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="rounded-lg p-2 flex-shrink-0" style={{ background: '#0F3D2E', color: '#FBF7EE' }}>
              <FileSearch size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-display font-bold text-base" style={{ color: '#0F3D2E' }}>تشخيص الفرق</h4>
              <p className="font-body text-xs opacity-70 mt-0.5" style={{ color: '#1c1917' }}>
                أدخل التوزيع الصحيح للعملاء على هذا المرجع، وراح نحدد لك بالضبط وين الخطأ.
              </p>
            </div>
          </div>

          <button onClick={onToggleResolve} className="btn-resolve font-display font-bold text-xs rounded-lg px-3 py-2 flex items-center gap-1.5 flex-shrink-0">
            <Stamp size={13} strokeWidth={2.5} />
            تمت المطابقة يدوياً
          </button>
        </div>

        <div className="flex items-center gap-1 mb-3 p-1 rounded-lg w-fit" style={{ background: 'rgba(15, 61, 46, 0.06)' }}>
          <button onClick={() => setInputMode('rows')} className="font-body font-bold text-xs rounded-md px-3 py-1.5 flex items-center gap-1.5 transition-all" style={{
            background: inputMode === 'rows' ? '#FEFCF6' : 'transparent',
            color: '#0F3D2E',
            boxShadow: inputMode === 'rows' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
          }}>
            <Pencil size={11} />
            صف بصف
          </button>
          <button onClick={() => setInputMode('bulk')} className="font-body font-bold text-xs rounded-md px-3 py-1.5 flex items-center gap-1.5 transition-all" style={{
            background: inputMode === 'bulk' ? '#FEFCF6' : 'transparent',
            color: '#0F3D2E',
            boxShadow: inputMode === 'bulk' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
          }}>
            <ClipboardPaste size={11} />
            لصق دفعة من Excel
          </button>
        </div>

        {inputMode === 'bulk' && (
          <div className="animate-slide-in mb-3 paper-card rounded-lg p-3">
            <p className="font-body text-xs opacity-70 mb-2" style={{ color: '#1c1917' }}>
              الصق العملاء والمبالغ الصحيحة من Excel (عمودين): الاسم<span className="mx-1 opacity-40">←</span>المبلغ
            </p>
            <textarea
              dir="ltr"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={`أحمد الغامدي\t2000.00\nسارة العتيبي\t3000.00`}
              className="input-field font-mono text-sm w-full h-28 resize-none mb-2"
              style={{ textAlign: 'left' }}
            />
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={applyBulk} disabled={!bulkText.trim()} className="btn-primary font-body font-bold text-xs rounded-md px-3 py-1.5 flex items-center gap-1.5 disabled:opacity-40">
                <ArrowLeftRight size={11} />
                استبدال الكامل
              </button>
              {dist.length > 0 && (
                <button onClick={appendBulk} disabled={!bulkText.trim()} className="btn-secondary font-body font-bold text-xs rounded-md px-3 py-1.5 flex items-center gap-1.5 disabled:opacity-40">
                  <Plus size={11} />
                  إضافة للموجود
                </button>
              )}
              <span className="font-mono text-[11px] opacity-50 mr-auto">{parseBulkCustomers(bulkText).length} سطر صحيح</span>
            </div>
          </div>
        )}

        {inputMode === 'rows' && (
          <>
            <div className="space-y-2 mb-3">
              {dist.length === 0 && (
                <div className="text-center py-4 opacity-60">
                  <p className="font-body text-sm mb-3">ما في توزيع صحيح بعد</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button onClick={addRow} className="btn-primary font-body font-bold text-xs rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                      <Plus size={14} />
                      إضافة صف
                    </button>
                    <button onClick={fillFromCustomers} className="btn-secondary font-body font-bold text-xs rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                      <Copy size={12} />
                      نسخ من الحالي وعدّل
                    </button>
                    <button onClick={() => setInputMode('bulk')} className="btn-secondary font-body font-bold text-xs rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                      <ClipboardPaste size={12} />
                      أو الصق من Excel
                    </button>
                  </div>
                </div>
              )}

              {dist.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="font-mono text-[10px] opacity-40 w-5">{String(i + 1).padStart(2, '0')}</div>
                  <input type="text" placeholder="اسم العميل الصحيح" value={row.customer} onChange={(e) => updateRow(i, 'customer', e.target.value)} className="input-field text-sm flex-1" />
                  <input type="number" step="0.01" placeholder="المبلغ" value={row.amount} onChange={(e) => updateRow(i, 'amount', e.target.value)} className="input-field font-mono text-sm w-28 tabular" style={{ textAlign: 'left' }} dir="ltr" />
                  <button onClick={() => removeRow(i)} className="p-1.5 rounded hover:bg-red-50 opacity-50 hover:opacity-100" style={{ color: '#991B1B' }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {dist.length > 0 && (
              <div className="flex items-center justify-between py-2 px-2 mb-3 rounded-md flex-wrap gap-2" style={{ background: 'rgba(15, 61, 46, 0.04)' }}>
                <div className="flex items-center gap-2">
                  <button onClick={addRow} className="btn-secondary font-body font-bold text-xs rounded-md px-2.5 py-1 flex items-center gap-1">
                    <Plus size={12} />
                    صف
                  </button>
                  <span className="font-body text-xs opacity-60">إجمالي التوزيع الصحيح:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold tabular" style={{ color: correctMatchesBank ? '#0F3D2E' : '#991B1B' }}>{fmt(correctTotal)}</span>
                  <span className="font-body text-xs opacity-50">/ {fmt(r.bankAmount)}</span>
                  {correctMatchesBank && correctNorm.length > 0 && <CheckCircle2 size={14} style={{ color: '#0F3D2E' }} />}
                </div>
              </div>
            )}
          </>
        )}

        {dist.length > 0 && !correctMatchesBank && correctNorm.length > 0 && (
          <div className="flex items-start gap-2 p-2.5 rounded-md mb-3" style={{ background: '#FEE2E2' }}>
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#991B1B' }} />
            <p className="font-body text-xs leading-relaxed" style={{ color: '#991B1B' }}>
              مجموع التوزيع الصحيح <span className="font-mono font-bold">{fmt(correctTotal)}</span> لا يطابق مبلغ البنك <span className="font-mono font-bold">{fmt(r.bankAmount)}</span>. راجع المبالغ قبل التشخيص.
            </p>
          </div>
        )}

        {dist.length > 0 && (
          <button onClick={() => setDiagnoseClicked(true)} disabled={correctNorm.length === 0} className="btn-primary font-display font-bold text-sm rounded-lg px-4 py-2 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
            <Search size={14} strokeWidth={2.5} />
            شخّص الأخطاء
          </button>
        )}

        {issues && issues.length > 0 && (
          <div className="mt-5 space-y-2 animate-fade-up">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1" style={{ background: 'rgba(15, 61, 46, 0.2)' }} />
              <span className="font-display text-xs tracking-[0.2em] opacity-60" style={{ color: '#0F3D2E' }}>التشخيص · {issues.length} {issues.length === 1 ? 'ملاحظة' : 'ملاحظات'}</span>
              <div className="h-px flex-1" style={{ background: 'rgba(15, 61, 46, 0.2)' }} />
            </div>
            {issues.map((issue, i) => <IssueCard key={i} issue={issue} showToast={showToast} />)}
          </div>
        )}

        {issues && issues.length === 0 && (
          <div className="mt-5 p-4 rounded-lg flex items-center gap-3 animate-fade-up" style={{ background: '#E8F0EB' }}>
            <CheckCircle2 size={20} style={{ color: '#0F3D2E' }} />
            <div>
              <div className="font-display font-bold text-sm" style={{ color: '#0F3D2E' }}>الأسماء والمبالغ مطابقة للتوزيع الصحيح</div>
              <p className="font-body text-xs opacity-70 mt-0.5" style={{ color: '#1c1917' }}>لكن لا يزال هناك فرق إجمالي مع البنك — راجع التوزيع الصحيح إذا كان مكتمل.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===================== ISSUE CARD =====================
const IssueCard = ({ issue, showToast }) => {
  const ISSUE_META = {
    duplicate: { label: 'عميل مكرر', icon: Copy, color: '#92400E', bg: '#FEF3C7', border: '#F59E0B' },
    extra: { label: 'عميل زائد لا يفترض وجوده', icon: CirclePlus, color: '#7c2d12', bg: '#FED7AA', border: '#EA580C' },
    missing: { label: 'عميل ناقص لم يُسجل', icon: CircleMinus, color: '#5B21B6', bg: '#EDE9FE', border: '#8B5CF6' },
    wrong_amount: { label: 'مبلغ خاطئ', icon: AlertCircle, color: '#991B1B', bg: '#FEE2E2', border: '#DC2626' }
  };
  const m = ISSUE_META[issue.type];
  const Icon = m.icon;

  return (
    <div className="rounded-lg p-3 border-r-4" style={{ background: m.bg, borderColor: m.border }}>
      <div className="flex items-start gap-2.5">
        <Icon size={16} className="mt-0.5 flex-shrink-0" style={{ color: m.color }} strokeWidth={2.5} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-display font-bold text-sm" style={{ color: m.color }}>{m.label}</span>
            <div className="flex items-center gap-1">
              <span className="font-body text-sm font-bold" style={{ color: m.color }}>{issue.customer}</span>
              <CopyButton text={issue.customer} label="اسم العميل" size={11} showToast={showToast} />
            </div>
          </div>
          <div className="mt-2 font-body text-xs leading-relaxed" style={{ color: '#1c1917' }}>
            {issue.type === 'duplicate' && (
              <>
                هذا العميل ظهر <span className="font-bold">{issue.count} مرات</span> في السجل بمبالغ: <span className="font-mono font-bold">{issue.amounts.map(a => fmt(a)).join(' + ')}</span> = <span className="font-mono font-bold">{fmt(issue.total)}</span>.
                {issue.expected > 0 && <> المفترض يكون <span className="font-mono font-bold">{fmt(issue.expected)}</span> فقط <span className="block mt-1 font-bold" style={{ color: m.color }}>→ الفائض: {fmt(issue.total - issue.expected)}</span></>}
                {issue.expected === 0 && <span className="block mt-1 font-bold" style={{ color: m.color }}>→ ولا يفترض وجوده أصلاً</span>}
              </>
            )}
            {issue.type === 'extra' && <>هذا العميل مسجل في السجل بمبلغ <span className="font-mono font-bold">{fmt(issue.amount)}</span> لكنه غير موجود في التوزيع الصحيح. تأكد إذا كان في خطأ في المرجع أو الاسم.</>}
            {issue.type === 'missing' && <>هذا العميل يفترض يكون مسجل بمبلغ <span className="font-mono font-bold">{fmt(issue.expectedAmount)}</span> لكنه غير موجود في السجل. ربما تم تسجيله تحت مرجع آخر أو نُسي.</>}
            {issue.type === 'wrong_amount' && (
              <>
                المبلغ المسجل: <span className="font-mono font-bold">{fmt(issue.actualAmount)}</span> <span className="mx-1.5 opacity-50">←</span> الصحيح: <span className="font-mono font-bold">{fmt(issue.correctAmount)}</span>
                <span className="block mt-1 font-bold" style={{ color: m.color }}>→ الفرق: {fmtSigned(issue.diff)} ({issue.diff > 0 ? 'زائد عن الصحيح' : 'ناقص عن الصحيح'})</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};