# DepiViano — Centro de Estética Avanzada & Gel Neutro

Sitio web desarrollado para **DepiViano**, un centro de estética dedicado a la prestación de servicios profesionales (**Depilación Definitiva Láser**, **HIFU**, **Liposonix** y **Limpiezas Faciales**) y a la comercialización del **Gel Neutro para estética "DepiViano"**.

## Propósito del proyecto

Ofrecer a clientas y profesionales de la estética una plataforma web clara, responsiva y visualmente cuidada (paleta rosado suave pastel combinada con fotografía de depilación definitiva láser) para:
- Explorar tratamientos estéticos y formatos del Gel Neutro DepiViano.
- Armar una selección de turnos o pedidos en una bolsa interactiva persistida en `localStorage`.
- Consultar reseñas verificadas y la ubicación exacta del establecimiento (**Emilio Mitre 75 4 B**).
- Enviar consultas y pedidos mediante un formulario conectado a **Formspree**.

## Estructura y tecnologías

- **HTML5 semántico**: Organización en `<header>`, `<nav>`, `<main>`, `<section>` y `<footer>`.
- **CSS3 (`src/styles.css`) + Tailwind CSS**:
  - Tipografías de Google Fonts (`Playfair Display` y `Plus Jakarta Sans`).
  - Fondo rosado pastel suave combinado con degradados e imagen de depilación láser.
  - Sección **Productos** estructurada de forma responsiva con **Flexbox**.
  - Sección **Reseñas** organizada con **CSS Grid**.
  - Sección **Contacto** adaptada a distintos dispositivos mediante **Media Queries**.
- **Multimedia y Navegación**: Lista desordenada (`<ul>`) con enlaces internos y bloque multimedia con fotografía del gabinete y mapa interactivo (`<iframe>`).
- **JavaScript / React + TypeScript**: Filtros por categoría, bolsa de selección con controles de cantidad y envío por Formspree.

## Configuración de Formspree

1. Creá un formulario en [Formspree](https://formspree.io/) y copiá tu endpoint (`https://formspree.io/f/TU_ID_FORMSPREE`).
2. Reemplazá `FORMSPREE_ENDPOINT` en `src/App.tsx` con tu URL real de Formspree.

## Datos del establecimiento

- **Dirección:** Emilio Mitre 75 4 B
- **Teléfono:** 6252-7514

## Cómo subir este proyecto a un repositorio Git

```bash
git init
git add .
git commit -m "Sitio web DepiViano"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/depiviano-web.git
git push -u origin main
```
