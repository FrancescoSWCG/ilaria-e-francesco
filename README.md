# Sito matrimonio - Ilaria e Francesco

Sito statico monopagina per il matrimonio.

## Struttura

```text
wedding-site-github-pages/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   └── images/
│       └── .gitkeep
└── README.md
```

## Pubblicazione con GitHub Pages

1. Crea un nuovo repository GitHub, ad esempio `matrimonio`.
2. Carica tutti i file di questa cartella nel repository.
3. Vai in `Settings` → `Pages`.
4. In `Build and deployment`, seleziona:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Salva.
6. Dopo qualche minuto il sito sarà disponibile all'indirizzo indicato da GitHub Pages.

## Aggiornare le foto

Inserisci le immagini nella cartella:

```text
assets/images/
```

Poi, in `index.html`, sostituisci i blocchi placeholder dello slider con tag immagine, ad esempio:

```html
<div class="hero-slide">
  <img src="assets/images/foto-1.jpg" alt="Ilaria e Francesco">
</div>
```
