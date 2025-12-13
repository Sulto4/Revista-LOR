# Ghid: rulare Lighthouse și publicare pe Netlify

Acest ghid explică rapid cum să testezi local toate schimbările actuale (preload hero + LQIP) și cum să le pui pe site pentru a rula Lighthouse pe producție.

## 1) Pregătire
- **Node 18+ și npm** instalate.
- Fișier `.env.local` cu cheile Supabase (aceleași ca pe Netlify):
  ```bash
  VITE_SUPABASE_URL="https://<project>.supabase.co"
  VITE_SUPABASE_ANON_KEY="<anon-key>"
  ```
- Instalează dependențele o singură dată:
  ```bash
  npm install
  ```

## 2) Rulare locală în modul producție (pentru un scor realist)
1. Compilează build-ul de producție:
   ```bash
   npm run build
   ```
2. Rulează serverul de preview (servește exact build-ul din `dist/`):
   ```bash
   npm run preview -- --host --port 4173
   ```
3. Deschide `http://localhost:4173` în Chrome.

> Poți folosi `npm run dev -- --host --port 5173` pentru verificări rapide, dar pentru Lighthouse folosește `preview` ca să vezi comportamentul real al LQIP/preload.

## 3) Cum rulezi Lighthouse (Chrome DevTools)
1. Deschide pagina (homepage) în **Incognito** și închide toate extensiile care pot altera rezultatele.
2. DevTools → tab „Lighthouse” → selectează **Mobile** și doar categoria **Performance** pentru runde rapide.
3. Network/CPU throttling în panelul Lighthouse: lasă setările implicite (Slow 4G / 4× CPU) pentru rezultate comparabile cu rapoartele anterioare.
4. Pentru un „cold start” real: înainte de fiecare rundă folosește `Ctrl+Shift+R` (hard reload) și rulează în Incognito (cache gol). Pentru „warm cache”, rulează a doua oară fără a închide fila.
5. Repetă de 2–3 ori și notează media; LCP ar trebui să se îmbunătățească la a doua rulare datorită cache-ului și preload-ului.

## 4) Cum vezi comportamentul hero preload + LQIP
- În DevTools → Network: observă că există un request foarte devreme către Supabase (scriptul inline din `index.html`) și că imaginile au placeholders blur până se încarcă.
- În Application → Local Storage: cheia folosită pentru cache-ul hero (`revista-hero-cache`/similar) ar trebui să fie populată după prima vizită.

## 5) Publicare pe Netlify (pentru Lighthouse pe producție)
1. Asigură-te că variabilele **VITE_SUPABASE_URL** și **VITE_SUPABASE_ANON_KEY** sunt setate în „Site settings → Environment variables”.
2. Comanda de build în Netlify: `npm run build`. Directorul de publicare: `dist`.
3. Dacă site-ul e conectat la GitHub, un push pe branch-ul configurat va declanșa automat deploy-ul cu schimbările noi.
4. Pentru un test manual/rapid, poți folosi Netlify CLI (opțional):
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify link   # dacă nu e deja legat de site
   netlify deploy --build --prod
   ```
5. După deploy, deschide URL-ul de producție și rulează Lighthouse la fel ca la pasul 3.

## 6) Ce să urmărești în rapoarte
- **LCP element**: ar trebui să fie imaginea hero, iar request-ul ei să apară devreme în waterfall.
- **First Contentful Paint**: textul din hero ar trebui să apară imediat, chiar dacă imaginea se încarcă progresiv.
- **Diagnostics**: mesajul „LCP request is not discoverable in initial document” ar trebui să dispară sau să apară mai rar pe runda caldă.
