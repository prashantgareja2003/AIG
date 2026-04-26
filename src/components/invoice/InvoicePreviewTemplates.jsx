import React from "react";

export const DefaultTemplate = ({ formData, items, formatNumber, numberToWords, calculateSubtotal, calculateCGST, calculateSGST, calculateTax, calculateDiscount, calculateTotal }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&family=IBM+Plex+Serif:wght@400;600&display=swap');
        .invoice-preview * { margin: 0; padding: 0; box-sizing: border-box; }
        .invoice-preview {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 13px;
          color: #1c1c1c;
        }
        .invoice-preview .page {
          width: 100%;
          background: #fff;
        }
        .invoice-preview .hd {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          border-bottom: 3px solid #2E2E2E;
        }
        .invoice-preview .hd-left {
          padding: 28px 32px;
          flex: 1;
        }
        .invoice-preview .hd-right {
          background: #2E2E2E;
          padding: 28px 32px;
          text-align: right;
          min-width: 220px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .invoice-preview .co-name {
          font-family: 'IBM Plex Serif', serif;
          font-size: 28px;
          font-weight: 600;
          color: #2E2E2E;
          line-height: 1.1;
        }
        .invoice-preview .co-addr {
          margin-top: 8px;
          font-size: 12px;
          color: #777;
          line-height: 1.75;
        }
        .invoice-preview .co-gstin {
          margin-top: 8px;
          font-size: 11.5px;
          color: #aaa;
        }
        .invoice-preview .co-gstin strong { color: #555; }
        .invoice-preview .hd-right .inv-type {
          font-family: 'IBM Plex Serif', serif;
          font-size: 20px;
          font-style: italic;
          color: rgba(255,255,255,0.85);
          font-weight: 400;
        }
        .invoice-preview .hd-right .inv-no-block {
          margin-top: 10px;
        }
        .invoice-preview .hd-right .inv-no-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.45);
        }
        .invoice-preview .hd-right .inv-no-value {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
        }
        .invoice-preview .hd-right .inv-date {
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          margin-top: 4px;
        }
        .invoice-preview .info-strip {
          display: flex;
          background: #f4f7f7;
          border-bottom: 1px solid #e2e8e8;
        }
        .invoice-preview .info-cell {
          flex: 1;
          padding: 12px 20px;
          border-right: 1px solid #e2e8e8;
        }
        .invoice-preview .info-cell:last-child { border-right: none; }
        .invoice-preview .info-cell .ik {
          font-size: 9.5px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #2E2E2E;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .invoice-preview .info-cell .iv {
          font-weight: 600;
          color: #222;
          font-size: 12.5px;
        }
        .invoice-preview .parties {
          display: flex;
          border-bottom: 1px solid #dde4e4;
        }
        .invoice-preview .party {
          flex: 1;
          padding: 20px 28px;
          border-right: 1px solid #dde4e4;
        }
        .invoice-preview .party:last-child { border-right: none; }
        .invoice-preview .party .p-label {
          font-size: 9.5px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #2E2E2E;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .invoice-preview .party .p-name {
          font-family: 'IBM Plex Serif', serif;
          font-size: 16px;
          font-weight: 600;
          color: #111;
          margin-bottom: 5px;
        }
        .invoice-preview .party .p-addr {
          font-size: 12px;
          color: #666;
          line-height: 1.75;
        }
        .invoice-preview .party .p-gstin {
          margin-top: 9px;
          font-size: 11px;
          background: #eef3f3;
          display: inline-block;
          padding: 3px 8px;
          border-radius: 3px;
          color: #3a7a74;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .invoice-preview .tbl-wrap { border-bottom: 1px solid #dde4e4; overflow-x: auto; }
        .invoice-preview table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
        }
        .invoice-preview thead tr {
          background: #2E2E2E;
        }
        .invoice-preview thead th {
          padding: 10px 18px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          text-align: left;
        }
        .invoice-preview thead th.r { text-align: right; }
        .invoice-preview tbody tr:nth-child(even) { background: #f8fbfb; }
        .invoice-preview tbody td {
          padding: 15px 18px;
          border-bottom: 1px solid #eef2f2;
          color: #333;
          vertical-align: middle;
        }
        .invoice-preview tbody td.r { text-align: right; }
        .invoice-preview .it-name {
          font-family: 'IBM Plex Serif', serif;
          font-size: 14px;
          font-weight: 600;
          color: #111;
        }
        .invoice-preview .it-hsn {
          font-size: 11px;
          color: #aaa;
          margin-top: 2px;
        }
        .invoice-preview .it-amt {
          font-family: 'IBM Plex Serif', serif;
          font-size: 15px;
          font-weight: 600;
          color: #2E2E2E;
        }
        .invoice-preview .bottom {
          display: flex;
          flex-wrap: wrap;
        }
        .invoice-preview .bottom-left {
          flex: 1;
          border-right: 1px solid #dde4e4;
        }
        .invoice-preview .bottom-right {
          width: 260px;
          flex-shrink: 0;
        }
        .invoice-preview .words-box {
          padding: 16px 24px;
          border-bottom: 1px solid #eef2f2;
        }
        .invoice-preview .words-box .wl {
          font-size: 9.5px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #2E2E2E;
          font-weight: 600;
          margin-bottom: 5px;
        }
        .invoice-preview .words-box .wv {
          font-family: 'IBM Plex Serif', serif;
          font-style: italic;
          font-size: 13px;
          color: #333;
          line-height: 1.5;
        }
        .invoice-preview .terms-box {
          padding: 16px 24px;
        }
        .invoice-preview .terms-box .tl {
          font-size: 9.5px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #aaa;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .invoice-preview .terms-box ol {
          padding-left: 15px;
          color: #999;
          font-size: 11.5px;
          line-height: 1.85;
        }
        .invoice-preview .tot-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 20px;
          border-bottom: 1px solid #eef2f2;
          font-size: 12.5px;
        }
        .invoice-preview .tot-row .tl { color: #888; }
        .invoice-preview .tot-row .tv { font-weight: 600; color: #333; }
        .invoice-preview .tot-row.subtotal {
          background: #f4f7f7;
        }
        .invoice-preview .tot-grand {
          background: #2E2E2E;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
        }
        .invoice-preview .tot-grand .gl {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.55);
          font-weight: 600;
        }
        .invoice-preview .tot-grand .gv {
          font-family: 'IBM Plex Serif', serif;
          font-size: 20px;
          font-weight: 600;
          color: #fff;
        }
        .invoice-preview .sig-strip {
          border-top: 1px solid #dde4e4;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 28px;
          background: #f4f7f7;
          flex-wrap: wrap;
          gap: 10px;
        }
        .invoice-preview .veh-info {
          font-size: 12px;
          color: #666;
        }
        .invoice-preview .veh-info strong { color: #333; }
        .invoice-preview .sig-right {
          text-align: right;
        }
        .invoice-preview .sig-right .sl {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #aaa;
        }
        .invoice-preview .sig-right .sn {
          font-family: 'IBM Plex Serif', serif;
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
          margin-top: 2px;
        }
      `}
    </style>
    <div className="invoice-preview">
      <div className="page">
        {/* HEADER */}
        <div className="hd">
          <div className="hd-left">
            <div className="co-name">{formData.fromName}</div>
            <div className="co-addr">
              {formData.fromAddress?.replace(/\n/g, '<br/>')}
            </div>
            <div className="co-gstin">GSTIN: <strong>{formData.fromGSTIN}</strong></div>
          </div>
          <div className="hd-right">
            <div className="inv-type">Tax Invoice</div>
            <div className="inv-no-block">
              <div className="inv-no-label">Invoice No.</div>
              <div className="inv-no-value">{formData.invoiceNumber}</div>
              <div className="inv-date">
                {formData.issueDate?.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} &nbsp;|&nbsp; {formData.timeOfRemoval}
              </div>
            </div>
          </div>
        </div>

        {/* INFO STRIP */}
        <div className="info-strip">
          <div className="info-cell">
            <div className="ik">Invoice Date</div>
            <div className="iv">{formData.issueDate?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
          </div>
          <div className="info-cell">
            <div className="ik">Date of Removal</div>
            <div className="iv">{formData.dateOfRemoval?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
          </div>
          <div className="info-cell">
            <div className="ik">Time of Removal</div>
            <div className="iv">{formData.timeOfRemoval}</div>
          </div>
          <div className="info-cell">
            <div className="ik">Mode of Delivery</div>
            <div className="iv">{formData.modeOfDelivery}</div>
          </div>
          <div className="info-cell">
            <div className="ik">State Code</div>
            <div className="iv">{formData.stateCode}</div>
          </div>
        </div>

        {/* PARTIES */}
        <div className="parties">
          <div className="party">
            <div className="p-label">Bill From</div>
            <div className="p-name">{formData.senderName}</div>
            <div className="p-addr">
              {formData.fromAddress?.replace(/\n/g, '<br/>')}
            </div>
            <div className="p-gstin">GSTIN: {formData.fromGSTIN}</div>
          </div>
          <div className="party">
            <div className="p-label">Bill To</div>
            <div className="p-name">{formData.clientName}</div>
            <div className="p-addr">
              {formData.clientAddress?.replace(/\n/g, '<br/>')}
            </div>
            <div className="p-gstin">GSTIN: {formData.clientGSTIN}</div>
          </div>
        </div>

        {/* TABLE */}
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th style={{width: '36px'}}>Sr.</th>
                <th>Description of Goods</th>
                <th>HSN Code</th>
                <th className="r">Quantity (Kgs)</th>
                <th className="r">Rate per Kg (₹)</th>
                <th className="r">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{color: '#ccc', fontWeight: '700'}}>{idx + 1}</td>
                  <td>
                    <div className="it-name">{item.description || '—'}</div>
                    <div className="it-hsn">HSN: {item.hsnCode || '—'}</div>
                  </td>
                  <td>{item.hsnCode || '—'}</td>
                  <td className="r">{formatNumber(item.quantity)}</td>
                  <td className="r">{formatNumber(item.rate)}</td>
                  <td className="r it-amt">{formatNumber(item.quantity * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOTTOM */}
        <div className="bottom">
          <div className="bottom-left">
            <div className="words-box">
              <div className="wl">Amount in Words</div>
              <div className="wv">{numberToWords(calculateTotal())}</div>
            </div>
            <div className="terms-box">
              <div className="tl">Terms &amp; Conditions</div>
              <ol>
                {formData.terms.map((term, idx) => (
                  <li key={idx}>{term}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="bottom-right">
            <div className="tot-row subtotal">
              <span className="tl">Taxable Amount</span>
              <span className="tv">₹{formatNumber(calculateSubtotal())}</span>
            </div>
            {formData.taxRate > 0 && (
              <>
                <div className="tot-row">
                  <span className="tl">SGST @ {(formData.taxRate / 2)}%</span>
                  <span className="tv">₹{formatNumber(calculateSGST())}</span>
                </div>
                <div className="tot-row">
                  <span className="tl">CGST @ {(formData.taxRate / 2)}%</span>
                  <span className="tv">₹{formatNumber(calculateCGST())}</span>
                </div>
                <div className="tot-row">
                  <span className="tl">Total Tax</span>
                  <span className="tv">₹{formatNumber(calculateTax())}</span>
                </div>
              </>
            )}
            {formData.discount > 0 && (
              <div className="tot-row">
                <span className="tl">Discount ({formData.discount}%)</span>
                <span className="tv">-₹{formatNumber(calculateDiscount())}</span>
              </div>
            )}
            <div className="tot-grand">
              <span className="gl">Grand Total</span>
              <span className="gv">₹{formatNumber(calculateTotal())}</span>
            </div>
          </div>
        </div>

        {/* SIG STRIP */}
        <div className="sig-strip">
          <div className="veh-info">
            Vehicle No.: <strong>{formData.vehicleNumber}</strong>
          </div>
          <div className="sig-right">
            <div className="sl">For {formData.fromName}</div>
            <div className="sn">Authorised Signatory</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ModernTemplate = ({ formData, items, formatNumber, numberToWords, calculateSubtotal, calculateCGST, calculateSGST, calculateTax, calculateDiscount, calculateTotal }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100 relative">
    <div className="h-4 bg-gradient-to-r from-indigo-600 to-purple-600 w-full absolute top-0 left-0"></div>
    <div className="p-10 pt-12">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">INVOICE</h1>
          <p className="text-gray-500 mt-2 font-medium">{formData.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{formData.fromName}</h2>
          <div className="text-gray-600 text-sm mt-2 whitespace-pre-line leading-relaxed">{formData.fromAddress?.replace(/\n/g, '<br/>')}</div>
          <p className="text-gray-500 text-sm mt-1">GSTIN: <span className="font-semibold text-gray-700">{formData.fromGSTIN}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 mb-10">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">Billed To</p>
          <h3 className="text-lg font-bold text-gray-900">{formData.clientName}</h3>
          <div className="text-gray-600 text-sm mt-2 whitespace-pre-line leading-relaxed">{formData.clientAddress?.replace(/\n/g, '<br/>')}</div>
          <p className="text-gray-500 text-sm mt-2">GSTIN: <span className="font-semibold text-gray-700">{formData.clientGSTIN}</span></p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <div className="space-y-4">
            <div className="flex justify-between border-b border-indigo-100 pb-3">
              <span className="text-gray-600 text-sm font-medium">Issue Date</span>
              <span className="text-gray-900 text-sm font-bold">{formData.issueDate?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between border-b border-indigo-100 pb-3">
              <span className="text-gray-600 text-sm font-medium">Date of Removal</span>
              <span className="text-gray-900 text-sm font-bold">{formData.dateOfRemoval?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm font-medium">State Code</span>
              <span className="text-gray-900 text-sm font-bold">{formData.stateCode}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10 rounded-2xl overflow-hidden border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs tracking-wider border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Item Description</th>
              <th className="px-6 py-4">HSN</th>
              <th className="px-6 py-4 text-right">Qty</th>
              <th className="px-6 py-4 text-right">Rate</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, idx) => (
              <tr key={idx} className="bg-white">
                <td className="px-6 py-4 font-medium text-gray-900">{item.description}</td>
                <td className="px-6 py-4 text-gray-500">{item.hsnCode}</td>
                <td className="px-6 py-4 text-right text-gray-600">{formatNumber(item.quantity)}</td>
                <td className="px-6 py-4 text-right text-gray-600">{formatNumber(item.rate)}</td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatNumber(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-10">
        <div className="w-1/2 space-y-3">
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900">₹{formatNumber(calculateSubtotal())}</span>
          </div>
          {formData.taxRate > 0 && (
            <>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>SGST ({formData.taxRate / 2}%)</span>
                <span>₹{formatNumber(calculateSGST())}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>CGST ({formData.taxRate / 2}%)</span>
                <span>₹{formatNumber(calculateCGST())}</span>
              </div>
            </>
          )}
          {formData.discount > 0 && (
            <div className="flex justify-between text-red-500 text-sm">
              <span>Discount ({formData.discount}%)</span>
              <span>-₹{formatNumber(calculateDiscount())}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-4 border-t-2 border-gray-900 mt-4">
            <span className="text-lg font-bold text-gray-900">Total Amount</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ₹{formatNumber(calculateTotal())}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 pt-8 border-t border-gray-100">
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Terms & Conditions</h4>
          <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
            {formData.terms.map((term, idx) => (
              <li key={idx}>{term}</li>
            ))}
          </ul>
        </div>
        <div className="text-right flex flex-col justify-end">
          <div className="mb-8 text-xs text-gray-400 uppercase tracking-wider font-bold">Authorized Signature</div>
          <div className="w-48 h-px bg-gray-300 ml-auto mb-2"></div>
          <p className="text-sm font-semibold text-gray-900">{formData.senderName}</p>
        </div>
      </div>
    </div>
  </div>
);

export const MinimalTemplate = ({ formData, items, formatNumber, numberToWords, calculateSubtotal, calculateCGST, calculateSGST, calculateTax, calculateDiscount, calculateTotal }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 font-sans">
    <div className="flex justify-between items-baseline mb-12 border-b-2 border-black pb-8">
      <div>
        <h1 className="text-5xl font-black text-black tracking-tighter uppercase">Invoice</h1>
        <p className="text-gray-500 font-medium mt-2">#{formData.invoiceNumber}</p>
      </div>
      <div className="text-right">
        <h2 className="text-xl font-bold text-black">{formData.fromName}</h2>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-12 mb-12">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Bill To</p>
        <p className="font-bold text-black text-lg">{formData.clientName}</p>
        <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{formData.clientAddress?.replace(/\n/g, '<br/>')}</p>
        <p className="text-gray-500 text-sm mt-2">GSTIN: {formData.clientGSTIN}</p>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Details</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span className="font-medium text-black">{formData.issueDate?.toLocaleDateString('en-GB')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Vehicle:</span>
            <span className="font-medium text-black">{formData.vehicleNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">State Code:</span>
            <span className="font-medium text-black">{formData.stateCode}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="mb-12">
      <table className="w-full text-left text-sm">
        <thead className="border-b-2 border-black">
          <tr>
            <th className="py-3 font-bold text-black">Description</th>
            <th className="py-3 font-bold text-black text-right">Qty</th>
            <th className="py-3 font-bold text-black text-right">Rate</th>
            <th className="py-3 font-bold text-black text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item, idx) => (
            <tr key={idx}>
              <td className="py-4 text-black">{item.description}</td>
              <td className="py-4 text-gray-600 text-right">{formatNumber(item.quantity)}</td>
              <td className="py-4 text-gray-600 text-right">{formatNumber(item.rate)}</td>
              <td className="py-4 text-black font-medium text-right">{formatNumber(item.quantity * item.rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="flex justify-end mb-16 border-t border-black pt-6">
      <div className="w-64 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-black">{formatNumber(calculateSubtotal())}</span>
        </div>
        {formData.taxRate > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax ({formData.taxRate}%)</span>
            <span className="font-medium text-black">{formatNumber(calculateTax())}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-black border-t-2 border-black pt-3 mt-3">
          <span>Total</span>
          <span>₹{formatNumber(calculateTotal())}</span>
        </div>
      </div>
    </div>

    <div className="text-xs text-gray-500 text-center border-t border-gray-200 pt-8">
      {formData.notes || "Thank you for your business."}
    </div>
  </div>
);
