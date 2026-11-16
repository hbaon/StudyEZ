// StudyEZ service worker: keeps the app working offline once it has been opened online.
// The build replaces the placeholder below with { version, files } listing every built file.
const PRECACHE = {"version":"e295057be75d","files":["./","./assets/accy201-exXQ-T7o.js","./assets/atms140-CXBZBI6j.js","./assets/chem102-Bes1-jhN.js","./assets/chem104-CCZlcUa1.js","./assets/chem202-Y4WVUfIZ.js","./assets/chem204-CmepVh0l.js","./assets/chem236-DVnYm9jN.js","./assets/chem312-BbO6BHc5.js","./assets/chem420-CWFlKBme.js","./assets/chem436-MQ4ejifY.js","./assets/chem440-DdGLgMsS.js","./assets/chem442-DeXbQd_X.js","./assets/chem444-CJpFaVDu.js","./assets/cloud-DRtrI1OE.js","./assets/cs101-EtxanGD3.js","./assets/cs124-p_tgHLg8.js","./assets/cs128-BbvETOMj.js","./assets/cs173-CITx3-kD.js","./assets/cs210-BJzCdN7w.js","./assets/cs222-CcKyOoej.js","./assets/cs225-DsNSCi2m.js","./assets/cs233-C5i3-D6x.js","./assets/cs341-fR9uus0Y.js","./assets/cs357-B55l6xWb.js","./assets/cs361-DpUhxGuT.js","./assets/cs374-BQ4tMqTk.js","./assets/cs411-BMNL4B_w.js","./assets/cs421-B1Vh1sGC.js","./assets/cs425-BMIgeSO-.js","./assets/cs438-BjPJJJV4.js","./assets/cs440-Nv8rg64E.js","./assets/cs446-Do5Gbvlg.js","./assets/cs461-BpFDvhDF.js","./assets/econ102-ChcLa80H.js","./assets/econ103-BvQtGJwQ.js","./assets/ib150-uqMYLvY5.js","./assets/index-D-9aDJzN.js","./assets/index-DtM3Xqyw.css","./assets/lls100-BxeIw_wv.js","./assets/math221-B0IUSDRj.js","./assets/math227-D-p2qsa9.js","./assets/math231-Bp06TTC0.js","./assets/math241-5L0QhlOT.js","./assets/math257-C3bYR17U.js","./assets/math285-DS1iu-ne.js","./assets/math441-i65jc6sf.js","./assets/math442-CFE7qVe7.js","./assets/mcb150-DNXfWel9.js","./assets/phys101-Dmeztn-U.js","./assets/phys102-LoEKSiPu.js","./assets/phys211-D7v2kQRv.js","./assets/phys212-CMYM7qg2.js","./assets/phys213-BcnjLK52.js","./assets/phys214-BDJOD3B9.js","./assets/phys225-C3bP30El.js","./assets/phys325-C8Fbarp0.js","./assets/phys427-DjYEKKcB.js","./assets/phys435-Cn-PQU2G.js","./assets/phys485-IC1x6rmU.js","./assets/phys486-wU8gqVXV.js","./assets/ps101-Blf_q4wp.js","./assets/psyc100-BsGN59xm.js","./assets/question-BK_qazt0.js","./assets/rhet105-v3RSnUDj.js","./assets/soc100-BWyLVniG.js","./assets/stat100-461APjDa.js","./assets/stat107-CAikCg0l.js","./assets/stat400-D4W9YqA2.js","./assets/WorldMapPage-CfGNWNyU.js","./favicon.svg","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-512.png","./index.html","./manifest.webmanifest"]};
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
