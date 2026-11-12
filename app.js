
const NAV = [{"file": "index.html", "sheet": "SUMMARY", "label": "Overview"}, {"file": "comparison.html", "sheet": "SUMMARY (2)", "label": "Expense Comparison"}, {"file": "property-1.html", "sheet": "AMORI", "label": "Amori"}, {"file": "property-2.html", "sheet": "ACE 1 PREST", "label": "Ace 1"}, {"file": "property-3.html", "sheet": "ACE 2 PREST", "label": "Ace 2"}, {"file": "property-4.html", "sheet": "ACE 3 PREST", "label": "Ace 3"}, {"file": "property-5.html", "sheet": "KT 2 PREST", "label": "Kt 2"}, {"file": "property-6.html", "sheet": "ROSWELL PREST", "label": "Roswell"}, {"file": "property-7.html", "sheet": "CROMWELL 1 PREST", "label": "Cromwell 1"}, {"file": "property-8.html", "sheet": "CROMWELL 2 PREST ", "label": "Cromwell 2"}, {"file": "property-9.html", "sheet": "FAICEK PREST", "label": "Faicek"}, {"file": "property-10.html", "sheet": "SCH VIEW 1", "label": "Sch View 1"}, {"file": "property-11.html", "sheet": "DESTINY", "label": "Destiny"}, {"file": "property-12.html", "sheet": "ROSEWOOD 1", "label": "Rosewood 1"}];
const sheetName = document.body.dataset.sheet;
const currentFile = document.body.dataset.page;
const money = n => (typeof n === 'number' && Number.isFinite(n)) ? new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(n) : '—';
const number = n => (typeof n === 'number' && Number.isFinite(n)) ? new Intl.NumberFormat('en-NG',{maximumFractionDigits:1}).format(n) : (n ?? '—');
const pct = n => (typeof n === 'number' && Number.isFinite(n)) ? (n*100).toFixed(1)+'%' : '—';
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = (v, header='') => {
  if (v == null || v === '') return '—';
  const h=String(header).toLowerCase();
  if (typeof v === 'number') {
    if (h.includes('rate') || h.includes('percentage') || h.includes('nom)')) return pct(v);
    if (h.includes('budget') || h.includes('actual') || h.includes('variance') || h.includes('opex') || h.includes('balance') || h.includes('collection') || h.includes('surplus') || h.includes('increment') || h.includes('salary') || h.includes('security') || h.includes('lawma')) return money(v);
    return number(v);
  }
  return esc(v);
};
const rows = window.OPEX_DATA[sheetName] || [];
const nav = document.getElementById('main-nav');
nav.innerHTML = NAV.map(item=>`<a class="nav-link ${item.file===currentFile?'active':''}" href="${item.file}"><span class="nav-icon">${item.file==='index.html'?'▦':item.file==='comparison.html'?'⇄':'⌂'}</span><span>${esc(item.label)}</span></a>`).join('');
document.getElementById('menu-toggle').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
function kpi(label,value,sub=''){return `<article class="kpi"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div>${sub?`<div class="kpi-sub">${sub}</div>`:''}</article>`}
function table(headers, body, opts={}) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${body.map(row=>`<tr>${row.map((v,i)=>`<td>${opts.raw? v : fmt(v,headers[i])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function section(title,desc,inner){return `<section class="panel"><div class="panel-head"><div><h2>${title}</h2>${desc?`<p>${desc}</p>`:''}</div></div>${inner}</section>`}
function overview(){
 const r=rows, heads=r[0]||[], data=r.slice(1,13), total=r[13]||[];
 const at=i=>total[i];
 const spend=at(3), budget=at(4), collect=at(10), monthly=at(2);
 const max=Math.max(...data.map(x=>Number(x[3])||0),1);
 const bars=data.map(x=>`<div class="bar-row"><div class="bar-label">${esc(x[1])}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(2,(Number(x[3])||0)/max*100)}%"></div></div><div class="bar-value">${money(x[3])}</div></div>`).join('');
 const body=data.map(x=>x.slice(1,12));
 document.getElementById('content').innerHTML=`
 <div class="welcome"><div><div class="eyebrow">TEAM B · MANAGEMENT REPORT</div><h1>Operating expenses at a glance</h1><p>Portfolio-wide budget, expenditure and collection performance through September 2026.</p></div><div class="period-chip">YTD · SEPTEMBER 2026</div></div>
 <div class="kpi-grid">${kpi('Monthly OPEX budget',money(monthly),'Across 12 properties')}${kpi('Actual OPEX · YTD',money(spend),'Recorded expenditure')}${kpi('Budget OPEX · YTD',money(budget),'Year-to-date allocation')}${kpi('Actual collections · YTD',money(collect),'Total property collections')}</div>
 ${section('Portfolio performance','A consolidated view of each property’s operating position.',table(heads.slice(1,12),body))}
 <div class="two-col">${section('Actual OPEX by property','Year-to-date expenditure comparison.',`<div class="bar-list">${bars}</div>`)}
 ${section('Key portfolio indicators','Totals from the workbook.',`<div class="metric-list"><div><span>Variance against YTD budget</span><strong>${money(at(5))}</strong></div><div><span>OPEX run rate</span><strong>${pct(at(8))}</strong></div><div><span>Annual OPEX balance</span><strong>${money(at(9))}</strong></div><div><span>Collection less YTD OPEX</span><strong>${money(at(11))}</strong></div></div>`)}</div>
 <div class="note">Figures are presented as stored in the supplied workbook. Negative variances indicate actual expenditure above budget where the workbook defines variance as budget less actual.</div>`;
}
function comparison(){
 const r=rows;
 const headers=r[0]||[];
 const locations=headers.slice(2,14);
 const budgetRows=r.slice(1,4);
 const actualHeader=r[6]||[];
 const actualRows=r.slice(7,10);
 const compareRows=r.slice(12,16);
 const locRows=r.slice(19,32);
 const nomRows=r.slice(35,48);
 const renderMatrix=(head, data)=>table(['Expense category',...head.slice(2,15)],data.map(x=>[x[1],...x.slice(2,15)]));
 const matrix=(title,desc,head,data)=>section(title,desc,renderMatrix(head,data));
 const perfHead=['Location','OPEX','Budget','NOM','Budget'];
 const perf=locRows.filter(x=>x[1] && x[1]!=='TOTAL').map(x=>[x[1],x[2],x[3],x[4],x[5]]);
 const nomPerf=nomRows.filter(x=>x[1] && x[1]!=='TOTAL').map(x=>[x[1],x[2],x[3],x[4],x[5]]);
 document.getElementById('content').innerHTML=`
 <div class="welcome"><div><div class="eyebrow">CROSS-PROPERTY ANALYSIS</div><h1>Expense comparison</h1><p>Compare key expense categories, actual spending and operating performance across the property portfolio.</p></div><div class="period-chip">YTD · SEPTEMBER 2026</div></div>
 ${matrix('Budget by expense category','Year-to-date budget allocation for Salary, Security and Lawma.',headers,budgetRows)}
 ${matrix('Actual expenditure by expense category','Actual year-to-date spend for the same three categories.',actualHeader,actualRows)}
 ${section('Budget versus actual · key categories','Portfolio totals and utilisation for the three selected expense lines.',table(['Category','Actual YTD','Budget YTD','Variance','Run rate'],compareRows.map(x=>[x[1],x[2],x[3],x[4],x[5]])))}
 ${section('OPEX and NOM by property','The lower sections of Summary 2 compare each location’s operating expense and net operating margin. Some budget/actual cells are blank in the source workbook and are shown as em dashes.',table(perfHead,perf))}
 ${section('Actual OPEX and NOM by property','A second view of actual OPEX and NOM values recorded for each property.',table(['Location','OPEX','Actual','NOM','Actual'],nomPerf))}
 <div class="note">Interpretation: Summary 2 is a comparative analysis sheet, not a second portfolio overview. The original workbook’s section labels and figures are retained; blanks are not estimated.</div>`;
}
function property(){
 const head=rows[0]||[];
 const body=rows.slice(1).filter(r=>r.some(v=>v!==null&&v!==''));
 const title=(head[1]||sheetName).toString();
 const total=body.find(r=>r[1]===null || String(r[1]||'').toLowerCase().includes('total')) || body[body.length-1];
 const details=body.filter(r=>r!==total && r[1]);
 const val=(r,idx)=>r?.[idx];
 const headers=head.slice(1,10);
 const data=details.map(r=>r.slice(1,10));
 const monthly=val(total,2), actual=val(total,3), budget=val(total,4), variance=val(total,5), run=val(total,6), annual=val(total,7);
 document.getElementById('content').innerHTML=`
 <div class="welcome"><div><div class="eyebrow">PROPERTY PERFORMANCE</div><h1>${esc(title)}</h1><p>Operating expense breakdown and budget performance using the figures and reporting period shown in this worksheet.</p></div><div class="period-chip">PROPERTY REPORT</div></div>
 <div class="kpi-grid">${kpi('Monthly budget',money(monthly))}${kpi('Actual OPEX · YTD',money(actual))}${kpi('Budget OPEX · YTD',money(budget))}${kpi('YTD run rate',pct(run))}</div>
 ${section('Expense breakdown','Actual expenditure compared with the year-to-date budget and annualised position.',table(headers,data))}
 ${section('Annual position','Totals and annualised figures from the property worksheet.',`<div class="metric-list"><div><span>Variance · YTD</span><strong>${money(variance)}</strong></div><div><span>Annual OPEX budget</span><strong>${money(annual)}</strong></div><div><span>Annual balance (actual basis)</span><strong>${money(val(total,9))}</strong></div></div>`)}
 <div class="note">The property worksheet is displayed using its available calculated values. Empty source cells remain blank; figures are not reconstructed where the workbook has no value.</div>`;
}
if(sheetName==='SUMMARY') overview();
else if(sheetName==='SUMMARY (2)') comparison();
else property();
