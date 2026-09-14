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
- Firebase: Firestore (datos de eventos **e imágenes de QR**), Auth con
  email/password (un solo usuario admin) — sin Firebase Storage, ver
  "Cambio de decisión" más abajo
- Tailwind CSS
- Despliegue en Vercel vía `git push`, sin configuración adicional más
  allá de variables de entorno

## Cambio de decisión: QR en Firestore, no en Storage

El plan original guardaba el QR en Firebase Storage. Durante la
implementación, Firebase empezó a exigir una cuenta de facturación
(plan Blaze, con tarjeta registrada) para habilitar Storage, incluso
para uso dentro de la capa gratuita. Para no obligar al vendedor a dar
una tarjeta de crédito, el QR se guarda en su lugar como texto
(base64) directo en el campo `qrImageData` del documento del evento en
Firestore — ver "Modelo de datos". Esto mantiene todo dentro de la
capa 100% gratuita de Firebase (Spark), a costa de un límite de tamaño
de imagen (ver esa sección).

## Arquitectura

Todo el acceso a Firebase ocurre desde el cliente (Client Components +
Firebase JS SDK), sin Firebase Admin SDK ni rutas de API:

- La página pública lee `events` directamente desde Firestore (lectura
  pública permitida por las reglas).
- El panel admin usa Firebase Auth (client SDK) para iniciar sesión, y
  con la sesión activa escribe directamente a Firestore (las reglas
  exigen `request.auth != null` para escribir).

Esto es suficiente porque solo hay un admin y las reglas de seguridad
de Firestore ya hacen el trabajo de autorización — no se necesita una
capa de backend adicional.

Un módulo `lib/firebase.js` inicializa la app de Firebase leyendo las
variables `NEXT_PUBLIC_FIREBASE_*`. `lib/qrImage.js` convierte el
archivo de imagen elegido en el navegador a un data URI base64
(`FileReader.readAsDataURL`), rechazando archivos de más de 600 KB
antes de intentar guardarlos.

## Modelo de datos (Firestore, colección `events`)

```
{
  title: string,
  eventDate: timestamp,
  location: string,
  price: number,
  qrImageData: string,  // data URI base64 de la imagen del QR
  createdAt: timestamp
}
```

Firestore limita cada documento a 1 MB. `lib/qrImage.js` rechaza
archivos de más de 600 KB antes de codificarlos (base64 infla el
tamaño ~33%), dejando margen de sobra para el resto de los campos. Un
QR típico (PNG que comparte el proveedor) pesa muy por debajo de eso.

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
  - Formulario "Publicar nuevo evento": convierte la imagen del QR a
    base64 en el navegador, más nombre, fecha, lugar y precio; crea el
    documento en Firestore con todo incluido.
  - Lista de todos los eventos (pasados y futuros), pasados mostrados
    visualmente atenuados con badge "Pasado" vs. "Activo".
  - Editar: mismo formulario, precargado (incluida una vista previa
    del QR actual). El admin puede reemplazar la imagen del QR o
    dejarla igual — al reemplazarla simplemente se sobrescribe el
    campo `qrImageData`, no hay un archivo aparte que borrar.
  - Eliminar: confirmación simple antes de borrar el documento de
    Firestore (el QR se va con él, al estar en el mismo documento).
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
`request.auth != null`. Esto ya cubre el QR, al vivir dentro del mismo
documento — no hay reglas de Storage que mantener.

Se entrega listo para pegar en la consola de Firebase.

## Variables de entorno

`NEXT_PUBLIC_FIREBASE_*` (apiKey, authDomain, projectId,
messagingSenderId, appId) — sin credenciales hardcodeadas en el
código. Se entrega `.env.local.example` con las claves vacías.

## Entregables

- Proyecto Next.js funcional, corriendo en local con `npm run dev`.
- `README.md` con pasos para: crear el proyecto en Firebase Console
  (Firestore, Auth email/password); crear el usuario admin; pegar las
  reglas de seguridad; llenar `.env.local`; subir el repo a GitHub y
  conectarlo en Vercel con las mismas variables de entorno.
