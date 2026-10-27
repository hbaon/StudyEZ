// StudyEZ service worker: keeps the app working offline once it has been opened online.
// The build replaces the placeholder below with { version, files } listing every built file.
const PRECACHE = {"version":"d3603bcba158","files":["./","./assets/atms140-CXBZBI6j.js","./assets/chem102-Bes1-jhN.js","./assets/cloud-DVJ_2vPP.js","./assets/cs124-DWMBREyd.js","./assets/cs128-DLj9KNrx.js","./assets/cs173-CITx3-kD.js","./assets/cs210-BJzCdN7w.js","./assets/cs222-CcKyOoej.js","./assets/cs225-DsNSCi2m.js","./assets/cs233-C8qvclxh.js","./assets/cs341-Bbh9mMWT.js","./assets/cs357-B5vb1Ap-.js","./assets/cs361-DpUhxGuT.js","./assets/cs374-BQ4tMqTk.js","./assets/cs411-BdwGhm59.js","./assets/cs421-Dc9BW2w2.js","./assets/cs425-BMIgeSO-.js","./assets/cs438-BjPJJJV4.js","./assets/cs440-Nv8rg64E.js","./assets/cs446-Do5Gbvlg.js","./assets/cs461-BpFDvhDF.js","./assets/econ102-ChcLa80H.js","./assets/econ103-BvQtGJwQ.js","./assets/index-A30DOgPl.js","./assets/index-DcT9tYQw.css","./assets/lls100-BxeIw_wv.js","./assets/math221-B0IUSDRj.js","./assets/math231-Bp06TTC0.js","./assets/math241-5L0QhlOT.js","./assets/math257-C3bYR17U.js","./assets/math285-DS1iu-ne.js","./assets/phys211-D7v2kQRv.js","./assets/phys212-CMYM7qg2.js","./assets/psyc100-BsGN59xm.js","./assets/question-BK_qazt0.js","./assets/rhet105-v3RSnUDj.js","./assets/stat107-BGj4UU9p.js","./assets/stat400-D4W9YqA2.js","./favicon.svg","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-512.png","./index.html","./manifest.webmanifest"]};
const APP_CACHE = `studyez-${PRECACHE.version}`;
const FONT_CACHE = "studyez-fonts";
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

// Save every file of this version, so all tabs and every course's questions work offline.
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(APP_CACHE).then((cache) => cache.addAll(PRECACHE.files)));
});

// Delete files from older versions once this one takes over.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((name) => name.startsWith("studyez-") && name !== APP_CACHE && name !== FONT_CACHE).map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

// The page asks a waiting new version to take over when the player presses "Update".
self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (request.mode === "navigate") {
      // The page itself: try the network first so updates arrive, and use the saved copy offline.
      event.respondWith(fetch(request).catch(() => caches.match("./index.html")));
      return;
    }
    // Built files have unique names per version, so a saved copy is always right.
    event.respondWith(caches.match(request, { ignoreSearch: true }).then((saved) => saved || fetch(request)));
    return;
  }

  if (FONT_HOSTS.includes(url.hostname)) {
    // Fonts: use the saved copy if there is one, otherwise download and save it.
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const saved = await cache.match(request);
        if (saved) return saved;
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
      }),
    );
  }
  // Everything else (sign-in, sync, the leaderboard) goes straight to the network.
});
