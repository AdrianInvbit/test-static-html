# ClonVercel Test Lab — `test-static-html`

Aplicación web estática de prueba, versión **v0.1.0**, para validar la importación Git y el despliegue de sitios estáticos en ClonVercel.

## Objetivo

Disponer de una página sencilla, completa y predecible que se pueda abrir en local, versionar con Git e importar en ClonVercel sin backend, sin frameworks y sin dependencias de tiempo de ejecución.

La interfaz muestra los datos de la aplicación, un contador interactivo y un indicador de que JavaScript se ha inicializado correctamente.

## Tecnologías

- HTML5 semántico
- CSS3
- JavaScript nativo
- Node.js 18 o superior, solo para ejecutar las pruebas locales
- Sin frameworks y sin dependencias externas de producción

## Estructura

```text
test-static-html/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── tests/
│   └── smoke.test.mjs
├── app-meta.json
├── package.json
├── README.md
└── .gitignore
```

`app-meta.json` es el archivo de metadatos local. Contiene el identificador, la versión y el commit. El navegador no consulta Git: si puede leer este archivo lo usa; si no, aplica los valores embebidos en `js/app.js`.

## Ejecución local

La aplicación no necesita servidor. Abre `index.html` en el navegador.

Si prefieres servirla por HTTP (recomendado para que el navegador pueda leer `app-meta.json`):

```bash
npx --yes serve .
```

Después visita la URL que muestre el comando, normalmente `http://localhost:3000`.

No hay que instalar dependencias del proyecto. `npx serve` es opcional y no forma parte de la aplicación.

## Ejecución de pruebas

Requisito: Node.js 18 o superior.

```bash
npm test
```

Equivalente directo:

```bash
node tests/smoke.test.mjs
```

Las pruebas comprueban:

- que existen los archivos necesarios
- la integridad básica de `index.html`
- que la versión `v0.1.0` y el commit `No disponible` están alineados
- que el contador incrementa, decrementa y vuelve a cero

## Despliegue estático

1. Publica el contenido del directorio del proyecto, manteniendo la misma estructura relativa.
2. Configura el directorio de salida / raíz de publicación como `.` y el archivo de entrada como `index.html`.
3. No definas un comando de build. No hay dependencias que instalar.
4. Conserva rutas relativas (`css/styles.css`, `js/app.js`, `app-meta.json`) para poder servir la app en la raíz o bajo un subdirectorio.
5. Si ClonVercel inyecta el identificador de commit durante el despliegue, debe actualizar `app-meta.json` (campo `commit`). Hasta entonces el valor visible será `No disponible`.

## Matriz de pruebas previstas para ClonVercel

| Caso | Resultado esperado |
| --- | --- |
| Importación Git del repositorio | El proyecto se reconoce como aplicación estática `test-static-html`. |
| Despliegue sin build | Se publica `index.html` con sus recursos relativos. |
| Apertura de la URL desplegada | Aparecen el título, el identificador, la tecnología, la versión `v0.1.0` y el commit. |
| Contador en producción | Incrementar, decrementar y reiniciar actualizan el valor sin recargar. |
| Indicador de JavaScript | El pie pasa a «JavaScript inicializado correctamente». |
| Despliegue bajo subdirectorio | CSS, JS y metadatos siguen cargando porque las rutas son relativas. |
| Inyección de commit (cuando exista) | `app-meta.json` muestra el commit real; no se generan valores ficticios en el código. |
| Sitio sin backend | No hay llamadas a APIs externas ni rutas de servidor. |

## Limitaciones conocidas

- El commit se muestra como `No disponible` hasta que el proceso de despliegue lo escriba en `app-meta.json`.
- Al abrir `index.html` como archivo local, algunos navegadores bloquean `fetch`. La página sigue funcionando con los metadatos embebidos en `js/app.js`.
- No hay enrutado, autenticación ni datos persistentes: el contador se reinicia al recargar.
- No incluye mapa de origen, empaquetado ni pipeline de CI propio.

## Versión

- Aplicación: `v0.1.0`
- Commit: `No disponible`
