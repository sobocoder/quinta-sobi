# Reservas de la Quinta (versión web para Netlify)

Calendario compartido para reservar la quinta entre Juli, Nacho, Gus, Lore, Patri, Nico, Caro y Belu.
La página está en `public/`. Las reservas las guarda una función de Netlify en Netlify Blobs.
Entra todo en el plan gratis.

No pide clave: cualquiera que tenga el link puede ver y editar las reservas. Compartilo solo con la familia.

## Qué hay en la carpeta

- `public/index.html`: la página.
- `netlify/functions/reservas.mjs`: el servidor. Lee, guarda y borra reservas.
- `netlify/functions/foto.mjs`: entrega la foto de fondo.
- `netlify/datos/foto.mjs`: la foto, guardada dentro del proyecto.
- `herramientas/cambiar-foto.mjs`: para cambiar la foto de fondo.
- `netlify.toml`: le dice a Netlify qué publicar (la carpeta `public`) y qué versión de Node usar.
- `package.json`: la única dependencia (`@netlify/blobs`).

## Publicarla con GitHub

1. Subí **el contenido** de esta carpeta a un repo de GitHub con *Add file → Upload files*. `netlify.toml` tiene que quedar en la raíz del repo.
2. En app.netlify.com: *Add new project → Import an existing project → GitHub*, elegí el repo y tocá *Deploy*.
3. Si el proyecto figura como privado, tocá *Make public* para que la familia pueda entrar sin cuenta de Netlify.

Después, cada cambio que subas a GitHub se publica solo.

## Publicarla con la terminal (necesitás Node 22 o más nuevo)

Desde esta carpeta:

```
npm install
npx netlify-cli login
npx netlify-cli deploy --prod
```

La primera vez te pregunta si querés crear un proyecto nuevo: decí que sí.

**Ojo:** arrastrar la carpeta a Netlify Drop no sirve. Así no se publican las funciones y no se pueden guardar reservas.

## Cambiar nombres o colores

Están en la lista `FAMILIA`, al principio del script de `public/index.html`.
Si agregás o cambiás a alguien, actualizá también la lista `FAMILIA` de `netlify/functions/reservas.mjs`, con los mismos `id`.

## Cambiar la foto de fondo

Desde la carpeta del proyecto (necesitás Node):

```
node herramientas/cambiar-foto.mjs ruta/a/la-foto.jpg
```

Después volvé a publicar.

## Si algo no anda

- **"No se encontró la función del servidor":** las funciones no se publicaron (pasa si arrastraste la carpeta a Netlify Drop). Publicá con GitHub o con la terminal.
- **Logs de la función:** en Netlify, *Logs → Functions → reservas*.
