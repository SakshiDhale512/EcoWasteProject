# EcoWaste — Smart Waste Management

A responsive, beginner-friendly static website built with **HTML5, CSS3, and vanilla JavaScript**. No build step, framework, paid API, or backend is needed to display the website.

> **Demo notice:** collection/contact/newsletter forms are front-end demonstrations only. They validate user input in the browser but do not transmit or store submissions. Dashboard figures are illustrative sample data, not verified achievements. Replace contact placeholders before publishing.

## Project structure

```text
eco-waste/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run locally

1. Download and extract the `eco-waste` folder.
2. Open `index.html` in a modern browser.
3. For a local development server, open the folder in Visual Studio Code and use an extension such as **Live Server**, or run Python from the project folder:

   ```bash
   python -m http.server 8000
   ```

4. Visit `http://localhost:8000`.

The website can also be opened directly as a file. A local server is useful for testing how static hosting behaves.

## Publish on GitHub Pages

1. Sign in to GitHub and create a new repository, for example `eco-waste`. For a public portfolio, a public repository is convenient.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root (not inside an extra nested folder).
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then save.
6. Wait for GitHub Pages to publish the site. The URL appears in the Pages settings. It will usually look like `https://YOUR-USERNAME.github.io/eco-waste/`.
7. Whenever you commit changes to the selected branch, Pages republishes the static site.

## Publish on Netlify

### Option A: Connect a Git repository

1. Push the four project files to GitHub.
2. Sign in to Netlify and choose **Add new site → Import an existing project**.
3. Connect GitHub and select the `eco-waste` repository.
4. Leave the build command blank and set the publish directory to `.` (the repository root).
5. Deploy the site. Netlify will provide a public URL; you can optionally configure a custom domain.

### Option B: Manual deploy

1. Sign in to Netlify.
2. Open the manual deploy / deploy manually option in the Sites area.
3. Drag the **contents** of the `eco-waste` folder (the four files) into the deploy drop zone.
4. Wait for the upload to finish and open the generated site URL.

Netlify's dashboard labels may change slightly over time, but the key is to publish the directory containing `index.html`.

## Included interactions

- Responsive sticky navigation and mobile menu
- Smooth anchor navigation and active-section highlighting
- Scroll-triggered reveal effects and animated illustrative counters
- Searchable waste-sorting guide with item-specific disposal and safety tips
- Waste-type detail dialogs and article “Read more” dialogs
- Accessible FAQ accordion
- Client-side collection/contact form validation with explicit demo notices
- Demo newsletter form validation
- Current footer year and back-to-top control
- Reduced-motion support and graceful image fallback styling

## Before using this for a real service

- Replace placeholder email, phone, service-area, and social links with verified details.
- Review all waste-sorting guidance against the local municipal rules where the site will operate. Bin colours and accepted materials vary by location.
- Connect forms to a secure backend or an appropriate form provider. Add server-side validation, spam protection, secure transport, data retention rules, and a privacy notice before collecting personal information.
- Replace illustrative impact metrics with sourced, verifiable data and explain the measurement period.
- For production, consider self-hosting fonts and images or replacing external image URLs with locally licensed assets.

## Image and font notes

Images are loaded from Unsplash and fonts from Google Fonts. A network connection is needed for these external assets. If an image fails to load, the page includes fallback styling; you may replace the image URLs with local assets if preferred.
