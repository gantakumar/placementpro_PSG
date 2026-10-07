import { useEffect, useRef } from 'react';
import './App.css'; // exact CSS copied from the original index.html <style> block
import './ui-enhance.css'; // polished/interactive UI layer (additive, no class renames)

/**
 * This component preserves the ORIGINAL PlacementPro design and behaviour
 * pixel-for-pixel:
 *  - App.css        = the exact <style> block from the original index.html
 *  - /app-shell.html = the exact <body> markup (modals, landing page, app shell)
 *  - /legacy-app.js  = the exact client-side JS logic (COMPANIES data, exam
 *                      engine, dashboard/admin/holder rendering, auth flow),
 *                      only patched to (a) point at the new Express API
 *                      instead of the old PHP endpoints and (b) fix a
 *                      pre-existing bug where the admin/holder dashboards
 *                      called an undefined getUsers() function.
 *
 * Why load the markup/script as static files instead of inlining them as
 * JSX/strings? The original app manipulates the DOM directly by element id
 * (document.getElementById(...).innerHTML = ...) via plain <script> tags with
 * inline onclick="..." handlers. Loading them as real <script src> / fetched
 * HTML preserves that behavior exactly, with zero risk of subtle bugs from
 * re-transcribing ~1000 lines of markup and ~1100 lines of JS by hand.
 */
function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/app-shell.html')
      .then((r) => r.text())
      .then((html) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = html;

        // Only ever inject the legacy script once, even if this effect
        // re-runs (e.g. React Fast Refresh during development).
        if (!window.__placementProScriptLoaded) {
          window.__placementProScriptLoaded = true;
          const script = document.createElement('script');
          script.src = '/legacy-app.js';
          script.async = false;
          document.body.appendChild(script);

          // Alumni Connect layer — alumni directory, mentorship/mock
          // interview booking, interview experience feed, referral
          // requests and the Q&A forum. Loaded after the legacy app so
          // it can reuse api()/toast()/currentUser.
          const connect = document.createElement('script');
          connect.src = '/connect-app.js';
          connect.async = false;
          document.body.appendChild(connect);

          // Visual/interaction polish layer (ripples, scroll reveal,
          // pointer glow, counters). Loaded after the legacy app so it can
          // observe and re-decorate any DOM the legacy renderers produce.
          const ui = document.createElement('script');
          ui.src = '/ui-enhance.js';
          ui.async = false;
          document.body.appendChild(ui);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <div ref={containerRef} />;
}

export default App;
