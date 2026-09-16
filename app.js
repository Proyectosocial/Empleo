const categories=['Técnico en mantenimiento','Vendedor','Callcenter','Electricista','Técnico mecánico','Técnico instalador','Repositor'];
const cat=document.getElementById('cat'), jobs=document.getElementById('jobs'), status=document.getElementById('status'), where=document.getElementById('where');
categories.forEach(x=>cat.add(new Option(x,x)));

const demo={
'Técnico en mantenimiento':[['Técnico de mantenimiento industrial','Empresa demostración','Buenos Aires','Mantenimiento preventivo, diagnóstico de fallas y herramientas manuales.']],
'Vendedor':[['Vendedor técnico','Empresa demostración','Buenos Aires','Atención comercial, seguimiento de clientes y presupuestos.']],
'Callcenter':[['Operador de atención','Empresa demostración','Buenos Aires','Atención telefónica, registro de gestiones y seguimiento.']],
'Electricista':[['Electricista de mantenimiento','Empresa demostración','Buenos Aires','Tableros, instalaciones y diagnóstico eléctrico.']],
'Técnico mecánico':[['Técnico mecánico','Empresa demostración','Buenos Aires','Mantenimiento mecánico y uso de instrumentos de medición.']],
'Técnico instalador':[['Técnico instalador','Empresa demostración','Buenos Aires','Instalaciones, configuración y visitas técnicas.']],
'Repositor':[['Repositor','Empresa demostración','Buenos Aires','Reposición, stock y control de mercadería.']]
};
function clean(s=''){const d=document.createElement('div');d.innerHTML=String(s);return (d.textContent||'').replace(/\s+/g,' ').trim()}
function esc(s=''){return clean(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function relevant(j,q){const t=(j.title+' '+clean(j.description)).toLowerCase(); const keys={
'Técnico en mantenimiento':['maintenance','technician','mantenimiento'],
'Vendedor':['sales','account','vendedor'],
'Callcenter':['customer support','customer service','call center','support'],
'Electricista':['electrician','electrical','electricista'],
'Técnico mecánico':['mechanic','mechanical','mecánico'],
'Técnico instalador':['installer','installation','field technician','instalador'],
'Repositor':['stock','warehouse','inventory','repositor']
}; return (keys[q]||[]).some(k=>t.includes(k))}
function renderDemo(){
 const d=demo[cat.value]||[]; const loc=where.value.trim().toLowerCase();
 const list=d.filter(x=>!loc||x[2].toLowerCase().includes(loc));
 jobs.innerHTML=list.length?list.map(x=>`<article class="job"><h2>${esc(x[0])}</h2><div class="company">🏢 ${esc(x[1])}</div><div class="meta">📍 ${esc(x[2])} · Presencial</div><p class="desc">${esc(x[3])}</p><div class="source">Vista local de prueba — no es una oferta real.</div></article>`).join(''):'<div class="notice">No hay resultados en la vista local para ese filtro.</div>';
}
async function load(){
 status.textContent='Buscando ofertas…'; jobs.innerHTML='';
 // file:// often blocks cross-origin APIs. Keep app functional and explain live requirement.
 if(location.protocol==='file:'){
   renderDemo();
   status.textContent='Vista local activa. Para ofertas reales, publicá esta carpeta en GitHub Pages (HTTPS) o usá la versión PHP/XAMPP.';
   return;
 }
 try{
   const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),12000);
   const r=await fetch('https://remotive.com/api/remote-jobs',{signal:controller.signal});
   clearTimeout(timer); if(!r.ok) throw new Error('HTTP '+r.status);
   const d=await r.json(); let list=(d.jobs||[]).filter(j=>j.company_name&&j.url&&relevant(j,cat.value));
   const loc=where.value.trim().toLowerCase();
   if(loc) list=list.filter(j=>(j.candidate_required_location||'').toLowerCase().includes(loc));
   list=list.slice(0,20);
   jobs.innerHTML=list.length?list.map(j=>`<article class="job"><h2>${esc(j.title)}</h2><div class="company">🏢 ${esc(j.company_name)}</div><div class="meta">📍 ${esc(j.candidate_required_location||'Remoto')} · ${esc(j.job_type||'No informado')} · ${j.publication_date?new Date(j.publication_date).toLocaleDateString('es-AR'):'Fecha no informada'}</div><p class="desc">${esc(j.description).slice(0,450)}${clean(j.description).length>450?'…':''}</p><a class="apply" href="${j.url}" target="_blank" rel="noopener noreferrer">Postularse aquí</a><span class="source">Fuente: Remotive</span></article>`).join(''):'<div class="notice">La fuente respondió correctamente, pero no encontró ofertas para esta categoría/filtro.</div>';
   status.textContent='Última actualización: '+new Date().toLocaleString('es-AR');
 }catch(e){
   renderDemo();
   status.textContent='La fuente externa no respondió. La interfaz sigue funcionando en modo local. Para cobertura estable usá el backend PHP.';
 }
}
document.getElementById('go').addEventListener('click',load);
document.getElementById('refresh').addEventListener('click',load);
cat.addEventListener('change',load);
where.addEventListener('keydown',e=>{if(e.key==='Enter')load()});
load();
