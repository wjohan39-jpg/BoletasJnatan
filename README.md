# Boletas [Nombre]

App para publicar códigos QR de boletos de concierto en una página propia,
en lugar de subirlos como post a Instagram/Facebook. Incluye una página
pública con el feed de eventos y un panel admin para publicarlos.

Los QR se guardan directo en Firestore (no en Firebase Storage), así que
no hace falta una tarjeta de crédito ni el plan de pago de Firebase — todo
corre en la capa gratuita.

## Requisitos

- Node.js 18.17 o superior
- Una cuenta de Firebase (gratuita) y una cuenta de Vercel (gratuita)

## 1. Crear el proyecto en Firebase Console

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) y crea un proyecto nuevo.
2. **Firestore Database** → Crear base de datos → modo producción → elige una región.
3. **Authentication** → Sign-in method → habilita **Correo electrónico/contraseña**.
4. En **Configuración del proyecto → General → Tus apps**, crea una app web (ícono `</>`) y copia el objeto `firebaseConfig` — lo usarás en el paso 4.

## 2. Crear el usuario admin

En **Authentication → Users → Add user**, crea el único usuario admin con el correo y contraseña que usará el vendedor para entrar a `/admin`.

## 3. Pegar las reglas de seguridad

En **Firestore Database → Reglas**, reemplaza el contenido con el de `firestore.rules` (en la raíz de este repo) y publica.

## 4. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Llena `.env.local` con los valores del `firebaseConfig` del paso 1:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 5. Correr en local

```bash
npm install
npm run dev
```

- Página pública: [http://localhost:3000](http://localhost:3000)
- Panel admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## 6. Subir a GitHub y desplegar en Vercel

```bash
git remote add origin <url-de-tu-repo>
git push -u origin main
```

1. En [vercel.com](https://vercel.com), importa el repo de GitHub.
2. En **Environment Variables**, agrega las mismas 5 variables `NEXT_PUBLIC_FIREBASE_*` del paso 4 con sus valores reales.
3. Despliega. Cada `git push` a `main` vuelve a desplegar automáticamente.

## Cambiar el nombre del negocio

El placeholder "Boletas [Nombre]" aparece en `app/page.js`, `app/layout.js`
(metadata) y `app/admin/page.js` — reemplázalo por el nombre real del
negocio en esos tres archivos.

## Sobre el tamaño del QR

El QR se guarda como texto dentro del mismo documento del evento en
Firestore, que tiene un límite de 1 MB por documento. El panel admin
rechaza imágenes de más de 600 KB con un mensaje claro — un QR normal
(PNG o JPG que te comparte el proveedor) pesa muchísimo menos que eso.
