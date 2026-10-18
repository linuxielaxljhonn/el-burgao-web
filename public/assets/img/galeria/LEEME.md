# Fotos de la galería

Sube aquí tus fotos reales de encuentros, rutas, paisajes y vehículos.

## Cómo añadir una foto

1. Copia el archivo de imagen (jpg/png/webp) en esta carpeta.
   Ejemplo: `concentracion-primavera-2025-01.jpg`

2. Abre `/src/data/gallery.json` y en la entrada correspondiente
   rellena el campo `"src"` con la ruta:

   ```json
   "src": "/assets/img/galeria/concentracion-primavera-2025-01.jpg"
   ```

3. Mientras `"src"` esté vacío (`""`), esa foto se mostrará con un
   placeholder de color y emoji — así no hay huecos rotos.

## Recomendaciones

- Formato: JPG para fotos normales, WebP si quieres menos peso.
- Tamaño recomendado: 1600px de ancho máximo (no hace falta más,
  se redimensiona con CSS). Comprime antes de subir si pesa más
  de 500 KB — herramientas como squoosh.app van bien.
- Nombra los archivos en minúsculas, sin espacios ni acentos
  (usa guiones), para evitar problemas de URL.
