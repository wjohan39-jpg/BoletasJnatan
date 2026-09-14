# Boletas de Concierto — Web App Design

## Contexto y objetivo

El vendedor actualmente recibe códigos QR de compra de boletas por parte
del organizador/proveedor y los publica como posts en Instagram/Facebook
para que los compradores los escaneen desde ahí. El objetivo es
reemplazar ese flujo con una página propia: el vendedor sube el QR a un
panel admin y el comprador entra directo a una página pública (enlazada
desde la bio de Instagram/Facebook) donde ve el QR en grande y lo
escanea.

Es un proyecto nuevo, de un solo administrador, sin necesidad de
funciones más allá de las descritas aquí (YAGNI: nada de categorías,
búsqueda, analítica, multi-admin, recorte/compresión de imagen,
pruebas automatizadas o notificaciones).

## Stack

- Next.js 14, App Router, JavaScript (no TypeScript)
- Firebase: Firestore (datos de eventos), Storage (imágenes de QR),
  Auth con email/password (un solo usuario admin)
- Tailwind CSS
- Despliegue en Vercel vía `git push`, sin configuración adicional más
  allá de variables de entorno

## Arquitectura

Todo el acceso a Firebase ocurre desde el cliente (Client Components +
Firebase JS SDK), sin Firebase Admin SDK ni rutas de API:

- La página pública lee `events` directamente desde Firestore (lectura
  pública permitida por las reglas).
- El panel admin usa Firebase Auth (client SDK) para iniciar sesión, y
  con la sesión activa escribe directamente a Firestore/Storage (las
  reglas exigen `request.auth != null` para escribir).

Esto es suficiente porque solo hay un admin y las reglas de seguridad
de Firestore/Storage ya hacen el trabajo de autorización — no se
necesita una capa de backend adicional.

Un módulo `lib/firebase.js` inicializa la app de Firebase leyendo las
variables `NEXT_PUBLIC_FIREBASE_*`. `next.config.js` debe permitir el
dominio de Firebase Storage en `images.remotePatterns` para usar
`next/image`.

## Modelo de datos (Firestore, colección `events`)

```
{
  title: string,
  eventDate: timestamp,
  location: string,
  price: number,
  qrImageUrl: string,   // URL pública de Storage
  qrImagePath: string,  // path en Storage, para poder borrarla
  createdAt: timestamp
}
```

## Vistas

### Página pública (`/`)

- Encabezado: nombre del negocio como constante editable en código
  (placeholder "Boletas [Nombre]"), no editable desde el admin.
- Feed vertical: consulta eventos con `eventDate >= ahora`, ordenados
  ascendente por fecha (el más próximo primero). Los eventos pasados
  no se borran de la base de datos, solo se excluyen del query/filtro.
- Cada tarjeta: imagen del QR en grande y nítida, nombre del
  concierto/artista, fecha y lugar, precio, texto "Escanea para
  comprar tu boleta".
- Footer con placeholders de redes sociales.
- 100% mobile-first (la mayoría del tráfico llega desde el link en
  bio de Instagram/Facebook).

### Panel admin (`/admin`)

- Ruta protegida: se suscribe a `onAuthStateChanged`; sin sesión
  muestra el formulario de login (email + contraseña), nunca el
  dashboard.
- Con sesión activa:
  - Formulario "Publicar nuevo evento": sube imagen del QR a Storage,
    más nombre, fecha, lugar y precio; crea el documento en Firestore.
  - Lista de todos los eventos (pasados y futuros), pasados mostrados
    visualmente atenuados con badge "Pasado" vs. "Activo".
  - Editar: mismo formulario, precargado. El admin puede reemplazar la
    imagen del QR (se borra el archivo anterior de Storage y se sube
    el nuevo) o dejarla igual.
  - Eliminar: confirmación simple antes de borrar el documento de
    Firestore y el archivo de Storage asociado.
  - Botón de cerrar sesión.

## Diseño visual

Dirección aprobada por el usuario vía mockup
(ver artifact publicado en la conversación). Estética concierto/vida
nocturna, mobile-first, alto contraste, QR como elemento dominante:

- **Paleta** (fondo oscuro, acentos vibrantes): fondo `#0a0a0f`,
  tarjetas `#120f19`/`#14121c`, acentos morado `#b026ff`, magenta
  `#ff2ec4`, cian `#21e6e6`; texto primario `#f6f3f9`, texto
  secundario `#8b8399`. Glows/blobs de color difuminados como fondo
  atmosférico (no gradientes planos de relleno).
- **Tipografía**: "Unbounded" (700/800) para títulos y wordmark,
  "Manrope" (400–800) para cuerpo de texto, vía Google Fonts.
- **Tarjetas de evento**: borde en anillo degradado (morado→magenta→
  cian), QR dentro de un panel blanco redondeado con sombra/glow del
  color de acento para que resalte y sea fácil de escanear desde la
  pantalla del celular.
- **Botones y controles**: grandes, fáciles de tocar con el pulgar,
  alto contraste.
- **Admin**: mismo sistema visual pero orientado a utilidad (dropzone
  para el QR, campos claros, lista con badges de estado).

## Reglas de seguridad

`firestore.rules`: lectura pública de `events`, escritura solo si
`request.auth != null`.

`storage.rules`: lectura pública de las imágenes, escritura solo si
`request.auth != null`.

Ambos archivos se entregan listos para pegar en la consola de
Firebase.

## Variables de entorno

`NEXT_PUBLIC_FIREBASE_*` (apiKey, authDomain, projectId,
storageBucket, messagingSenderId, appId) — sin credenciales
hardcodeadas en el código. Se entrega `.env.local.example` con las
claves vacías.

## Entregables

- Proyecto Next.js funcional, corriendo en local con `npm run dev`.
- `README.md` con pasos para: crear el proyecto en Firebase Console
  (Firestore, Storage, Auth email/password); crear el usuario admin;
  pegar las reglas de seguridad; llenar `.env.local`; subir el repo a
  GitHub y conectarlo en Vercel con las mismas variables de entorno.
