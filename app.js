const categories=['Técnico en mantenimiento','Vendedor','Callcenter','Electricista','Técnico mecánico','Técnico instalador','Repositor'];
const cat=document.getElementById('cat'), jobs=document.getElementById('jobs'), status=document.getElementById('status'), where=document.getElementById('where'), zone=document.getElementById('zone');
categories.forEach(x=>cat.add(new Option(x,x)));

const locations={
 caba:['Agronomía','Almagro','Balvanera','Barracas','Belgrano','Boedo','Caballito','Chacarita','Coghlan','Colegiales','Constitución','Flores','Floresta','La Boca','Liniers','Mataderos','Monserrat','Monte Castro','Nueva Pompeya','Núñez','Palermo','Parque Chacabuco','Parque Chas','Parque Patricios','Paternal','Puerto Madero','Recoleta','Retiro','Saavedra','San Cristóbal','San Nicolás','San Telmo','Vélez Sarsfield','Versalles','Villa Crespo','Villa del Parque','Villa Devoto','Villa Lugano','Villa Luro','Villa Ortúzar','Villa Pueyrredón','Villa Real','Villa Riachuelo','Villa Santa Rita','Villa Soldati','Villa Urquiza'],
 norte:['Beccar','Bella Vista','Boulogne','Escobar','General Pacheco','Grand Bourg','José C. Paz','Martínez','Munro','Olivos','Pilar','San Fernando','San Isidro','San Miguel','Tigre','Vicente López','Villa Adelina','Villa Ballester'],
 oeste:['Caseros','Ciudadela','El Palomar','Haedo','Hurlingham','Ituzaingó','La Matanza','Merlo','Moreno','Morón','Ramos Mejía','San Justo','Tapiales','Villa Luzuriaga'],
 sur:['Adrogué','Avellaneda','Banfield','Berazategui','Bernal','Burzaco','Ezeiza','Florencio Varela','Gerli','Lanús','Lomas de Zamora','Monte Grande','Quilmes','Temperley','Wilde']
};
function fillLocations(){
 where.innerHTML='<option value="">Todas las localidades</option>';
 const z=zone.value;
 if(z) locations[z].forEach(x=>where.add(new Option(x,x)));
}
zone.addEventListener('change',()=>{fillLocations();load()});
where.addEventListener('change',load);


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

let currentJobs=[];
function openJob(i){
 const j=currentJobs[i]; if(!j) return;
 const content=document.getElementById('modalContent');
 content.innerHTML=`<h2>${esc(j.title)}</h2>
 <div class="company">🏢 ${esc(j.company_name)}</div>
 <div class="meta">📍 ${esc(j.candidate_required_location||'Remoto')} · ${esc(j.job_type||'No informado')} · ${j.publication_date?new Date(j.publication_date).toLocaleDateString('es-AR'):'Fecha no informada'}</div>
 <h3>Oferta completa</h3>
 <div class="full-desc">${j.description||'La fuente no proporcionó una descripción completa.'}</div>
 <div class="notice">La postulación se completa en el sitio original donde fue publicada la oferta.</div>
 <a class="external" href="${j.url}" target="_blank" rel="noopener noreferrer">Ir a la publicación y postularme ↗</a>`;
 const m=document.getElementById('jobModal'); m.classList.add('show');m.setAttribute('aria-hidden','false');
}
function closeJob(){const m=document.getElementById('jobModal');m.classList.remove('show');m.setAttribute('aria-hidden','true')}
document.getElementById('closeModal').addEventListener('click',closeJob);
document.getElementById('jobModal').addEventListener('click',e=>{if(e.target.id==='jobModal')closeJob()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeJob()});

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
   const d=await r.json(); const cutoff=Date.now()-30*24*60*60*1000;
   let list=(d.jobs||[]).filter(j=>{
     const published=Date.parse(j.publication_date||'');
     return j.company_name&&j.url&&relevant(j,cat.value)&&Number.isFinite(published)&&published>=cutoff&&published<=Date.now();
   }).sort((a,b)=>Date.parse(b.publication_date)-Date.parse(a.publication_date));
   const loc=where.value.trim().toLowerCase();
   if(loc) {
     list=list.filter(j=>(j.candidate_required_location||'').toLowerCase().includes(loc));
   } else if(zone.value==='caba') {
     list=list.filter(j=>/buenos aires|caba|argentina/i.test(j.candidate_required_location||''));
   } else if(['norte','oeste','sur'].includes(zone.value)) {
     const terms=locations[zone.value].map(x=>x.toLowerCase());
     list=list.filter(j=>terms.some(x=>(j.candidate_required_location||'').toLowerCase().includes(x)));
   }
   list=list.slice(0,20);
   currentJobs=list;
   jobs.innerHTML=list.length?list.map((j,i)=>`<article class="job"><h2>${esc(j.title)}</h2><div class="company">🏢 ${esc(j.company_name)}</div><div class="meta">📍 ${esc(j.candidate_required_location||'Remoto')} · ${esc(j.job_type||'No informado')} · ${j.publication_date?new Date(j.publication_date).toLocaleDateString('es-AR'):'Fecha no informada'}</div><p class="desc">${esc(j.description).slice(0,450)}${clean(j.description).length>450?'…':''}</p><button class="detail-btn" onclick="openJob(${i})">Postularse aquí</button><span class="source">Fuente: Remotive</span></article>`).join(''):'<div class="notice">La fuente respondió correctamente, pero no encontró ofertas para esta categoría/filtro.</div>';
   status.textContent='Ofertas: últimos 30 días · Última actualización: '+new Date().toLocaleString('es-AR');
 }catch(e){
   renderDemo();
   status.textContent='La fuente externa no respondió. La interfaz sigue funcionando en modo local. Para cobertura estable usá el backend PHP.';
 }
}
document.getElementById('go').addEventListener('click',load);
document.getElementById('refresh').addEventListener('click',load);
cat.addEventListener('change',load);

load();
