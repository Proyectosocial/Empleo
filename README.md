# Empleo Técnico — GitHub Pages corregido

1. Subí index.html, app.js y style.css al mismo repositorio.
2. En GitHub: Settings > Pages > Deploy from a branch > main / root.
3. Abrí la URL HTTPS de GitHub Pages.

Importante: al abrir index.html directamente con file://, el navegador puede bloquear APIs externas.
Por eso esta versión muestra una vista local funcional y sólo intenta ofertas reales cuando está publicada por HTTP/HTTPS.

Para búsquedas reales más estables y múltiples proveedores, usar la versión PHP/XAMPP con backend.

## Vigencia
La app sólo muestra ofertas con fecha de publicación dentro de los últimos 30 días y las ordena de más reciente a más antigua.

## Filtro geográfico
Se agregó desplegable de Zona (CABA / Gran Buenos Aires) y un segundo desplegable dinámico de barrios/localidades.

La selección de Gran Buenos Aires ahora está dividida en Zona Norte, Zona Oeste y Zona Sur, cada una con su lista dinámica de localidades.

## Detalle y postulación
El botón Postularse aquí abre primero el detalle completo recibido de la fuente. Desde allí, Ir a la publicación y postularme abre la URL original de la oferta en una pestaña nueva.

## Categorías
El desplegable de búsqueda incluye 25 categorías, desde Personal de Maestranza hasta Supervisor de Soporte, con términos de búsqueda equivalentes en español/inglés para la fuente de empleos.

## Vigencia predeterminada
La búsqueda muestra por defecto únicamente ofertas publicadas durante los últimos 15 días, ordenadas desde la más reciente.
