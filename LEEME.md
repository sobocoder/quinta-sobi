# Reservas de la Quinta (versión web para Netlify)

Calendario compartido para reservar la quinta entre Juli, Nacho, Gus, Lore, Patri, Nico, Caro y Belu.
La página está en `public/`. Las reservas las guarda una función de Netlify en Netlify Blobs.
Entra todo en el plan gratis.

## Qué hay en la carpeta

- `public/index.html`: la página.
- `netlify/functions/reservas.mjs`: el servidor. Lee, guarda y borra reservas, y pide la clave de la familia.
- `netlify/functions/foto.mjs`: entrega la foto de fondo, solo a quien tiene la clave.
- `netlify/datos/foto.mjs`: la foto, guardada dentro del proyecto.
- `netlify/lib/clave.mjs`: el control de la clave que usan las dos funciones.
- `herramientas/cambiar-foto.mjs`: para cambiar la foto de fondo.
- `netlify.toml`: le dice a Netlify qué publicar (la carpeta `public`) y qué versión de Node usar.
- `package.json`: la única dependencia (`@netlify/blobs`).

## Antes de empezar: elegí la clave de la familia

Usá algo sin espacios ni tildes, por ejemplo `nogal-2026`, así funciona dentro del link.
La clave no va en ningún archivo: se carga en Netlify como la variable `CLAVE_QUINTA`.

## Opción A: con GitHub (no instalás nada)

1. Creá un repositorio en GitHub (puede ser privado). Subí **el contenido** de esta carpeta con *Add file → Upload files*, arrastrando todo. `netlify.toml` tiene que quedar en la raíz del repo.
2. Entrá a app.netlify.com con tu cuenta de GitHub. Andá a *Add new project → Import an existing project → GitHub*, elegí el repo y tocá *Deploy*. No hace falta cambiar nada: la configuración sale de `netlify.toml`.
3. Cuando termine, andá a *Project configuration → Environment variables → Add a variable*. Poné key `CLAVE_QUINTA` y como valor tu clave.
4. Andá a *Deploys → Trigger deploy → Deploy project* para que la función tome la clave.
5. Opcional: en *Project configuration → Change project name* poné, por ejemplo, `quinta-familia`. Así te queda `https://quinta-familia.netlify.app`.

Después, cada cambio que subas a GitHub se publica solo.

## Opción B: con la terminal (necesitás Node 22 o más nuevo)

Desde esta carpeta:

```
npm install
npx netlify-cli login
npx netlify-cli deploy --prod
npx netlify-cli env:set CLAVE_QUINTA "tu-clave"
npx netlify-cli deploy --prod
```

- El primer `deploy` te pregunta si querés crear un proyecto nuevo: decí que sí.
- El segundo `deploy` es para que la función tome la clave.

**Ojo:** arrastrar la carpeta a Netlify Drop no sirve. Así no se publica la función y no se pueden guardar reservas.

## Compartirla con la familia

Mandales el link con la clave al final:

```
https://quinta-familia.netlify.app/#clave=nogal-2026
```

La primera vez que lo abren, la clave queda guardada en ese celu o compu y se borra de la barra de direcciones.
Si alguien entra sin la clave, la página se la pide.

## Cambiar la clave

1. Cambiá `CLAVE_QUINTA` en Netlify.
2. Volvé a publicar (paso 4 de la opción A, o `deploy --prod` en la opción B).

La próxima vez que entren, a todos les va a pedir la clave nueva.

## Cambiar nombres o colores

Están en la lista `FAMILIA`, al principio del script de `public/index.html`.
Si agregás o cambiás a alguien, actualizá también la lista `FAMILIA` de `netlify/functions/reservas.mjs`, con los mismos `id`.

## La foto de fondo

La foto no está en `public/`: la entrega la función `foto.mjs`, y solo a quien tiene la clave.
Así, alguien que llegue al link sin la clave no la ve.

Para cambiarla, desde la carpeta del proyecto (necesitás Node):

```
node herramientas/cambiar-foto.mjs ruta/a/la-foto.jpg
```

Después volvé a publicar.

## Si algo no anda

- **"No se encontró la función del servidor":** la función no se publicó (pasa si arrastraste la carpeta). Usá la opción A o la B.
- **"Falta configurar la clave en Netlify":** falta la variable `CLAVE_QUINTA`, o no volviste a publicar después de crearla.
- **Logs de la función:** en Netlify, *Logs → Functions → reservas*.
