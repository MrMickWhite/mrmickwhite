# mrmickwhite.software — Sitio raíz

Página principal del dominio: portafolio de Miguel Eduardo Montoya E.
(mrmickwhite), estudiante de Ingeniería de Software y de Tecnología Superior
en Operación y Mantenimiento de Drones. Organiza los sitios de marca (Labs,
Fly, E-Sports) y lista en vivo los repositorios públicos de GitHub.

## Estructura

```
index.html        → toda la página (una sola, con scroll)
css/app.css        → sistema de diseño ("directorio raíz" / terminal)
js/common.js       → header, menú, reveal-on-scroll, año automático
js/projects.js     → conecta con la API de GitHub y renderiza los proyectos
js/main.js         → arranque de la página
assets/images/     → retrato profesional (miguel-portrait.webp)
assets/icons/      → favicon
```

## Cómo se actualizan los proyectos automáticamente

La sección "Proyectos" no tiene una lista escrita a mano. En su lugar,
`js/projects.js` intenta primero la API de cuenta de usuario:

```
https://api.github.com/users/MrMickWhite/repos?per_page=100&sort=updated
```

y, solo si esa responde 404 (porque `MrMickWhite` resultara ser una
organización en vez de una cuenta personal), reintenta con:

```
https://api.github.com/orgs/MrMickWhite/repos?per_page=100&sort=updated
```

Esta es la API pública de GitHub — no necesita ninguna clave ni token, y
funciona igual desde cualquier navegador. Cuando creas un repositorio nuevo
en tu cuenta `MrMickWhite` y lo haces público, aparecerá solo en esta
página la próxima vez que alguien la visite (hay una caché de 30 minutos en
el navegador del visitante para no saturar la API).

**Para que un proyecto muestre el botón "Ver demo en vivo"**, ese repositorio
necesita tener configurado un sitio (GitHub Pages, o el campo "Website" del
repositorio en GitHub) — eso es lo que la API expone como `homepage`. Si no
lo tiene, la tarjeta solo muestra "Ver código", lo cual es correcto para
proyectos de escritorio como BanquitoComunitario.

**Para que la descripción se vea bien**, ponle una descripción corta a cada
repositorio desde GitHub (ícono del engranaje, junto al nombre del repo, en
la página principal del repositorio). Si no la tiene, se muestra un texto
genérico de respaldo.

### Si algún día quieres ocultar un repo de la lista

Abre `js/projects.js` y busca la constante `EXCLUDE` cerca del principio del
archivo. Agrega el nombre exacto del repositorio entre comillas, por ejemplo:

```js
const EXCLUDE = ['nombre-del-repo-a-ocultar'];
```

## Identidad visual

Sin logo: la marca se apoya en el retrato profesional de Miguel en el hero y
en el monograma de texto "MM" del header/footer. Fondo casi negro con
cuadrícula sutil tipo terminal. Acentos en verde oliva, dorado, terracota y
lavanda — la misma familia de colores de marca, en una versión más sobria
pensada para un perfil profesional.

## Datos de contacto configurados

- Correo: `mrmickdesign@gmail.com`
- GitHub: `github.com/MrMickWhite`
- Instagram: `@_mr.mickwhite`

A propósito, **no hay número de WhatsApp en este sitio** — es la página de
presentación profesional, no de venta directa, así que se evita exponer ese
dato aquí.

## Cómo probar localmente

```bash
python -m http.server 5500
```

Abre `http://localhost:5500`. La sección de proyectos necesita conexión a
internet real para mostrar los repos (no funciona completamente sin red,
pero el resto del sitio sí se ve).

## Publicar en GitHub Pages

1. Sube esta carpeta a un repositorio nuevo (por ejemplo, uno llamado igual
   que tu usuario/organización, o cualquier nombre — para el dominio raíz no
   importa cuál).
2. En **Settings → Pages**, activa la publicación desde la rama principal.
3. Mantén el archivo `CNAME` (ya contiene `mrmickwhite.software`, sin
   subdominio).
4. En tu proveedor de DNS, el registro para el dominio raíz normalmente es de
   tipo `A` apuntando a las IPs de GitHub Pages (185.199.108.153,
   185.199.109.153, 185.199.110.153, 185.199.111.153), a diferencia de los
   subdominios (`labs`, `fly`) que usan `CNAME`. Revisa la documentación de
   GitHub Pages sobre "dominio personalizado apex" si tu proveedor de DNS no
   lo deja claro.
