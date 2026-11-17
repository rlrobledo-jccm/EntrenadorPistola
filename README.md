# Entrenador Pistola 10 m

App web instalable (PWA) para seguir un plan de entrenamiento de pistola de aire 10 m hasta la competición de mediados de febrero de 2027. Funciona sin conexión una vez abierta por primera vez y se puede convertir en APK de Android con PWABuilder.

## Qué hace

- **Hoy:** la sesión que toca según la fecha (13 semanas desde el 16/11/2026), con casillas y un timer por ejercicio.
- **Timers con señales acústicas:** parada, ventana de 8 s, señal externa, abortos obligados, disparo único, reloj de competición (15 + 75 min), medio simulacro y control.
- **Semáforo dentro del timer:** verde, amarillo, rojo, aborto, y anuncio acertado o fallado. Marcar un color cuenta el disparo y pasa al descanso.
- **Físico y movilidad guiados:** bloques A y B paso a paso, movilidad por zonas (tobillos, rodillas, cadera, torsión de tronco, muñecas, codos, hombros, cuello) y calentamientos de sesión y de competición.
- **Registro y Excel:** cada sesión se guarda en el móvil y se exporta a `PracticaTiro_Pistola10m.xlsx` con las hojas Resumen, Sesiones, Semanal y Controles. «Abrir Excel guardado» recupera las sesiones desde ese fichero.

## Contenido del repositorio

```
index.html               la app (un solo fichero)
manifest.webmanifest     manifiesto de la PWA (nombre, iconos, colores, accesos directos)
sw.js                    service worker: funcionamiento sin conexión
icons/                   iconos 192, 512, maskable, Apple y favicon
screenshots/             capturas que PWABuilder usa para la ficha de la app
docs/                    PDF de la programación y del físico y calentamiento
.nojekyll                evita que GitHub Pages procese el sitio con Jekyll
```

## 1. Publicar en GitHub Pages

GitHub Pages en una cuenta gratuita necesita un repositorio **público**: todo lo que subas, incluida la carpeta `docs/`, será visible. Tus sesiones no se suben: se quedan en el móvil y en tu Excel.

1. Crea un repositorio nuevo en GitHub. Si quieres el APK sin barra de dirección (paso 3), llámalo `TU_USUARIO.github.io`; si no, cualquier nombre sirve.
2. Descomprime el zip y sube **el contenido** de la carpeta, no el zip: *Add file → Upload files* y arrastra todos los ficheros y carpetas. Comprueba que `.nojekyll` se ha subido; si el navegador no lo coge, créalo con *Add file → Create new file*, nombre `.nojekyll` y contenido vacío.
3. *Settings → Pages → Build and deployment*: fuente *Deploy from a branch*, rama `main`, carpeta `/ (root)`. Guarda.
4. Al cabo de un minuto la app estará en `https://TU_USUARIO.github.io/NOMBRE_REPO/` (o en `https://TU_USUARIO.github.io/` si usaste ese nombre).

Con git en lugar de la web:

```bash
cd entrenador-pistola-10m
git init -b main
git add .
git commit -m "Entrenador Pistola 10 m"
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git
git push -u origin main
```

## 2. Instalar en el móvil sin APK

Abre la dirección en Chrome para Android → menú ⋮ → **Instalar app** (o *Añadir a pantalla de inicio*). Queda como una app más, a pantalla completa y sin conexión.

## 3. Generar el APK con PWABuilder

1. Entra en [pwabuilder.com](https://www.pwabuilder.com), pega la dirección de GitHub Pages y pulsa *Start*. Debe detectar el manifiesto, el service worker y los iconos.
2. *Package for stores → Android → Generate package*. Deja *Signing key* en **New** la primera vez.
3. Descarga el zip. Dentro hay:
   - un `.apk` para instalar directamente en el móvil (activa *Instalar apps desconocidas* para el navegador o la app Archivos);
   - un `.aab`, solo para publicar en Google Play;
   - `signing.keystore` y `signing-key-info.txt`: **guárdalos**. Sin ellos no podrás generar actualizaciones que se instalen encima de la app;
   - `assetlinks.json`.
4. **Quitar la barra de dirección del APK:** Android solo confía en la app si `assetlinks.json` está en `https://DOMINIO/.well-known/assetlinks.json`, en la raíz del dominio. En GitHub Pages eso solo es posible con un repositorio llamado `TU_USUARIO.github.io` (o con un dominio propio). Sube el fichero a la carpeta `.well-known/` de ese repositorio. Si la app está en un subdirectorio (`/NOMBRE_REPO/`), el APK funciona igual pero muestra una barra fina con la dirección arriba.

Cuando cambies la app, no hace falta regenerar el APK: el APK abre la versión publicada en GitHub Pages y se actualiza solo.

## Excel: cómo se guarda y se abre

Una app web, instalada o como APK de PWABuilder, no puede escribir sola en una carpeta concreta del móvil. Por eso:

- **Guardar Excel** descarga `PracticaTiro_Pistola10m.xlsx` con todas las sesiones. Si Chrome pregunta dónde guardarlo, elige `Documentos/PracticaTiro`; si va a Descargas, muévelo allí con la app Archivos y sustituye el anterior.
- **Abrir Excel guardado** te deja elegir ese fichero y añade a la app las sesiones que le falten. Sirve para cambiar de móvil o recuperar datos.
- Las sesiones viven en el almacenamiento de la app. **Si desinstalas la app o borras sus datos, se pierden**: guarda el Excel después de cada sesión.

## Actualizar la app

Edita los ficheros y súbelos. Si cambias algo más que `index.html`, sube el número de `CACHE` en `sw.js` (`tiro10m-v2` → `tiro10m-v3`) para que los móviles descarguen la versión nueva. La app se actualiza la siguiente vez que la abras con conexión.

## Notas

- Necesita conexión la primera vez para descargar la librería de Excel ([SheetJS](https://sheetjs.com), servida desde cdnjs) y las fuentes; después funciona sin señal.
- Los avisos sonoros necesitan el volumen multimedia subido y la pantalla encendida. Usa *Probar sonido* en Timers antes de la primera sesión.
- Las fechas del plan (inicio 16/11/2026, competición 13/02/2027) están al principio del script de `index.html`, en las constantes `START` y `COMP`, y en el objeto `W` con las sesiones de cada semana.
- No incluye licencia. Si vas a compartir el código, añade un fichero `LICENSE`.
