
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
const PIE_COLORS=['#41498E','#D44B60','#6974B8','#E58A98','#343C7C','#B83E54','#8E96CE','#F0B5BF','#5963A5','#C85D70','#AAB0DD','#E9A0AD'];
function pieChart(items){
 const valid=items.filter(x=>Number.isFinite(Number(x.value))&&Number(x.value)>0);
 const total=valid.reduce((a,x)=>a+Number(x.value),0);
 if(!valid.length||!total) return '<div class="empty-state">There is not enough positive numeric data to create a pie chart.</div>';
 let cursor=0;
 const stops=valid.map((x,i)=>{const start=cursor;cursor+=Number(x.value)/total*100;return `${PIE_COLORS[i%PIE_COLORS.length]} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;}).join(',');
 const legend=valid.map((x,i)=>`<div class="pie-legend-item"><span class="pie-swatch" style="background:${PIE_COLORS[i%PIE_COLORS.length]}"></span><span class="pie-legend-name">${esc(x.name)}</span><strong>${(Number(x.value)/total*100).toFixed(1)}%</strong><small>${money(Number(x.value))}</small></div>`).join('');
 return `<div class="pie-layout"><div class="pie-chart" role="img" aria-label="Pie chart showing each property's share of total actual OPEX" style="background:conic-gradient(${stops})"><div class="pie-hole"><strong>${money(total)}</strong><span>Total actual OPEX</span></div></div><div class="pie-legend">${legend}</div></div>`;
}
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
 <div class="two-col overview-charts">${section('Portfolio expenditure overview','Compare year-to-date actual OPEX across the properties.',`<div class="chart-bars">${bars}</div>`)}
 ${section('Actual OPEX distribution','Each property’s share of total year-to-date actual operating expenditure.',pieChart(data.map(x=>({name:x[1],value:Number(x[3])}))))}</div>
 <div class="toolbar"><button class="action-button" id="toggle-portfolio" type="button">Show portfolio performance</button></div><div id="portfolio-table" class="hidden">${section('Portfolio performance','A consolidated view of each property’s operating position.',table(heads.slice(1,12),body))}</div>
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


// Workbook upload: each visitor gets an independent, in-browser dashboard.
(function workbookUpload(){
 const input=document.getElementById('workbook-upload');
 if(!input) return;
 const content=document.getElementById('content');
 const navEl=document.getElementById('main-nav');
 let uploadedSheets=null, uploadedNav=[], activeUploadSheet=null;
 const cleanName=s=>String(s||'').trim();
 const safeText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const numeric=v=>typeof v==='number'&&Number.isFinite(v);
 const fmtCell=(v,h='')=>{
   if(v===null||v===undefined||v==='') return '—';
   if(numeric(v)){
     const label=String(h).toLowerCase();
     if(label.includes('%')||label.includes('rate')||label.includes('margin')) return (Math.abs(v)<=1?v*100:v).toFixed(1)+'%';
     if(/budget|actual|opex|expense|spend|variance|salary|security|lawma|collection|balance|amount|revenue|cost|nom/i.test(label)) return new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(v);
     return new Intl.NumberFormat('en-NG',{maximumFractionDigits:2}).format(v);
   }
   return safeText(v);
 };
 function makeTable(rows){
   const maxCols=Math.min(18,Math.max(1,...rows.map(r=>r.length)));
   const head=(rows[0]||[]).slice(0,maxCols);
   const body=rows.slice(1).filter(r=>r.some(v=>v!==null&&v!==''));
   return `<div class="table-wrap"><table><thead><tr>${Array.from({length:maxCols},(_,i)=>`<th>${safeText(head[i]||`Column ${i+1}`)}</th>`).join('')}</tr></thead><tbody>${body.map(r=>`<tr>${Array.from({length:maxCols},(_,i)=>`<td>${fmtCell(r[i],head[i])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 }
 function numericColumn(rows){
   const headers=rows[0]||[]; const candidates=[];
   for(let c=0;c<headers.length;c++){
     const vals=rows.slice(1).map(r=>r[c]).filter(numeric);
     if(vals.length>=2 && /actual|opex|expense|spend|budget|revenue|collection|amount|total/i.test(String(headers[c]||''))) candidates.push({c,vals,score:vals.length});
   }
   if(candidates.length) return candidates.sort((a,b)=>b.score-a.score)[0].c;
   let best=-1,count=0;
   for(let c=0;c<headers.length;c++){const n=rows.slice(1).filter(r=>numeric(r[c])).length;if(n>count){count=n;best=c;}}
   return count>=2?best:-1;
 }
 function chartFor(rows){
   const col=numericColumn(rows); if(col<0) return '<div class="empty-state">No comparable numeric column was detected for a chart. The worksheet data is still available below.</div>';
   const head=rows[0]||[], items=rows.slice(1).filter(r=>r.some(v=>v!==null&&v!=='')&&numeric(r[col])).slice(0,30);
   const max=Math.max(1,...items.map(r=>Math.abs(r[col])));
   const nameCol=head.findIndex((h,i)=>i!==col && /property|location|name|site|description|particular|expense|category/i.test(String(h||'')));
   return `<div class="chart-bars">${items.map((r,i)=>`<div class="chart-row"><div class="chart-name">${safeText(r[nameCol>=0?nameCol:0]||`Item ${i+1}`)}</div><div class="chart-track"><div class="chart-fill" style="width:${Math.max(1,Math.abs(r[col])/max*100)}%"></div></div><div class="chart-amount">${fmtCell(r[col],head[col])}</div></div>`).join('')}</div>`;
 }
 function uploadedPie(rows){
   const col=numericColumn(rows); if(col<0) return '<div class="empty-state">No suitable numeric data was found for a pie chart.</div>';
   const head=rows[0]||[]; const nameCol=head.findIndex((h,i)=>i!==col&&/property|location|name|site|description|particular|expense|category/i.test(String(h||'')));
   const items=rows.slice(1).filter(r=>r.some(v=>v!==null&&v!=='')&&numeric(r[col])&&r[col]>0&&!/total|grand total|sum total/i.test(String(r[nameCol>=0?nameCol:0]||''))).slice(0,15).map((r,i)=>({name:String(r[nameCol>=0?nameCol:0]||`Item ${i+1}`),value:r[col]}));
   const total=items.reduce((a,x)=>a+x.value,0); if(!items.length||!total) return '<div class="empty-state">There is not enough positive numeric data to create a pie chart.</div>';
   let cursor=0; const stops=items.map((x,i)=>{const start=cursor;cursor+=x.value/total*100;return `${PIE_COLORS[i%PIE_COLORS.length]} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;}).join(',');
   const legend=items.map((x,i)=>`<div class="pie-legend-item"><span class="pie-swatch" style="background:${PIE_COLORS[i%PIE_COLORS.length]}"></span><span class="pie-legend-name">${safeText(x.name)}</span><strong>${(x.value/total*100).toFixed(1)}%</strong><small>${fmtCell(x.value,head[col])}</small></div>`).join('');
   return `<div class="pie-layout"><div class="pie-chart" role="img" aria-label="Pie chart showing workbook data distribution" style="background:conic-gradient(${stops})"><div class="pie-hole"><strong>${fmtCell(total,head[col])}</strong><span>Total</span></div></div><div class="pie-legend">${legend}</div></div>`;
 }
 function renderUploadedOverview(){
   const summary=uploadedNav.find(x=>x.type==='summary')||uploadedNav[0];
   const rows=uploadedSheets[summary.sheet]||[];
   const properties=uploadedNav.filter(x=>x.type==='property');
   const numericCols=(rows[0]||[]).map((h,i)=>({h,i})).filter(x=>/budget|actual|opex|expense|revenue|collection|variance|nom/i.test(String(x.h||'')));
   content.innerHTML=`<div class="welcome"><div><div class="eyebrow">UPLOADED WORKBOOK</div><h1>${safeText(summary.sheet)}</h1><p>Your workbook has been read in this browser. Hidden worksheets are excluded from the dashboard.</p></div><div class="period-chip">${properties.length} PROPERTY / DATA SHEETS</div></div>
   <div class="kpi-grid">${numericCols.slice(0,4).map(x=>{const vals=rows.slice(1).map(r=>r[x.i]).filter(numeric);const sum=vals.reduce((a,b)=>a+b,0);return `<article class="kpi"><div class="kpi-label">${safeText(x.h||'Total')}</div><div class="kpi-value">${fmtCell(sum,x.h)}</div><div class="kpi-sub">Sum of numeric entries</div></article>`}).join('')}</div>
   <section class="panel chart-panel"><div class="panel-head"><div><h2>Workbook overview</h2><p>Visual comparison using the most relevant numeric column detected in the summary sheet.</p></div></div>${chartFor(rows)}</section>
   <section class="panel chart-panel"><div class="panel-head"><div><h2>Expense distribution</h2><p>Share of the detected numeric measure across workbook items.</p></div></div>${uploadedPie(rows)}</section>
   <div class="toolbar"><button class="action-button" id="uploaded-toggle">Show portfolio performance</button></div><div id="uploaded-portfolio" class="hidden"><section class="panel"><div class="panel-head"><div><h2>Portfolio performance</h2><p>Summary worksheet data.</p></div></div>${makeTable(rows)}</section></div>
   <section class="panel"><div class="panel-head"><div><h2>Workbook sheets</h2><p>Select a sheet from the navigation to view its full information.</p></div></div><div class="metric-list">${uploadedNav.map(x=>`<div><span>${safeText(x.label)}</span><strong>${(uploadedSheets[x.sheet]||[]).length} rows</strong></div>`).join('')}</div></section>`;
   document.getElementById('uploaded-toggle').onclick=()=>{const el=document.getElementById('uploaded-portfolio');el.classList.toggle('hidden');document.getElementById('uploaded-toggle').textContent=el.classList.contains('hidden')?'Show portfolio performance':'Hide portfolio performance'};
 }
 function renderUploadedSheet(sheet){
   activeUploadSheet=sheet; const rows=uploadedSheets[sheet]||[];
   const navItem=uploadedNav.find(x=>x.sheet===sheet);
   document.getElementById('page-heading').textContent=navItem?.label||sheet;
   content.innerHTML=`<div class="welcome"><div><div class="eyebrow">WORKBOOK SHEET</div><h1>${safeText(navItem?.label||sheet)}</h1><p>Data imported from the selected visible worksheet.</p></div><div class="period-chip">${rows.length} ROWS</div></div><section class="panel chart-panel"><div class="panel-head"><div><h2>Data visualisation</h2><p>Automatically selected numeric measure from this worksheet.</p></div></div>${chartFor(rows)}</section><section class="panel"><div class="panel-head"><div><h2>${safeText(sheet)} · full data</h2><p>All non-empty rows and columns are shown below.</p></div></div>${makeTable(rows)}</section>`;
   navEl.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.dataset.sheet===sheet));
 }
 function setupUploadedNav(){
   navEl.innerHTML=uploadedNav.map((x,i)=>`<a href="#" class="nav-link ${i===0?'active':''}" data-sheet="${safeText(x.sheet)}"><span class="nav-icon">${x.type==='summary'?'▦':x.type==='comparison'?'⇄':'⌂'}</span><span>${safeText(x.label)}</span></a>`).join('');
   navEl.querySelectorAll('[data-sheet]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const s=a.dataset.sheet;if(uploadedNav[0].sheet===s)renderUploadedOverview();else renderUploadedSheet(s);navEl.querySelectorAll('.nav-link').forEach(n=>n.classList.toggle('active',n===a));document.getElementById('sidebar').classList.remove('open')}));
 }
 input.addEventListener('change',async e=>{
   const file=e.target.files?.[0]; if(!file)return;
   if(!window.XLSX){alert('The Excel reader could not load. Please check your internet connection and try again.');input.value='';return;}
   try{
     const buffer=await file.arrayBuffer(); const wb=XLSX.read(buffer,{type:'array',cellDates:false});
     const visible=wb.SheetNames.filter(n=>wb.Workbook?.Sheets?.find(s=>s.name===n)?.Hidden!==1 && wb.Workbook?.Sheets?.find(s=>s.name===n)?.Hidden!==2);
     if(!visible.length) throw new Error('No visible worksheets were found in this workbook.');
     uploadedSheets={}; visible.forEach(n=>{uploadedSheets[n]=XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1,defval:null,raw:true,blankrows:false});});
     const summaryName=visible.find(n=>/^summary(\s*1)?$/i.test(cleanName(n)))||visible.find(n=>/summary|overview|consolidat|portfolio/i.test(n))||visible[0];
     const comparisonName=visible.find(n=>/summary\s*\(?2\)?|comparison|comparative/i.test(n)&&n!==summaryName);
     uploadedNav=[{sheet:summaryName,label:'Overview',type:'summary'}];
     if(comparisonName) uploadedNav.push({sheet:comparisonName,label:'Expense Comparison',type:'comparison'});
     visible.filter(n=>n!==summaryName&&n!==comparisonName).forEach(n=>uploadedNav.push({sheet:n,label:n.replace(/\s+/g,' ').trim(),type:'property'}));
     setupUploadedNav(); document.getElementById('page-heading').textContent='Overview'; renderUploadedOverview();
     const foot=document.querySelector('footer'); if(foot) foot.innerHTML=`Cresswell Facility Management <span>·</span> Viewing ${safeText(file.name)} · Hidden worksheets excluded`;
   }catch(err){alert('Could not read this workbook: '+err.message+'\nPlease upload a valid Excel workbook.');}
   input.value='';
 });
 const toggle=document.getElementById('toggle-portfolio'); if(toggle) toggle.addEventListener('click',()=>{const el=document.getElementById('portfolio-table');el.classList.toggle('hidden');toggle.textContent=el.classList.contains('hidden')?'Show portfolio performance':'Hide portfolio performance'});
})();
