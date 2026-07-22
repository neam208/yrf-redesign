(() => {
  "use strict";

  const configPath = "/race-day-links.json";
  const refreshIntervalMs = 60_000;
  let refreshInProgress = false;

  function isActiveLink(entry) {
    if (!entry || entry.enabled !== true || typeof entry.url !== "string") return false;

    try {
      const url = new URL(entry.url);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }

  function makeExternalLink(link, url, label) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    if (label) link.textContent = label;
  }

  function applyConfiguredLinks(name, entry, fallbackLabel) {
    if (!isActiveLink(entry)) return;

    document.querySelectorAll(`[data-race-day-link="${name}"]`).forEach((link) => {
      makeExternalLink(link, entry.url, entry.label || link.dataset.raceDayLabel || fallbackLabel);
      link.hidden = false;
    });
  }

  function applyResults(entry) {
    if (!isActiveLink(entry)) return;

    const year = String(entry.year || "2026");
    const label = entry.label || `View ${year} Results`;

    document.querySelectorAll('[data-race-day-link="results"]').forEach((link) => {
      makeExternalLink(link, entry.url, link.dataset.raceDayLabel || label);
    });

    document.querySelectorAll("[data-race-day-results-year]").forEach((element) => {
      element.textContent = year;
    });

    document.querySelectorAll("[data-race-day-results-status]").forEach((input) => {
      input.value = "Available now";
      input.setAttribute("aria-label", `${year} results available now`);
    });

    const currentCard = document.querySelector("[data-race-day-results-card]");
    if (currentCard) {
      makeExternalLink(currentCard, entry.url);
      currentCard.classList.remove("result-card--pending");
      currentCard.classList.add("result-card--featured");
      currentCard.dataset.source = "latest";
      currentCard.dataset.keywords = `${year} latest official results`;
      currentCard.removeAttribute("aria-disabled");

      const tag = currentCard.querySelector("[data-race-day-results-tag]");
      const copy = currentCard.querySelector("[data-race-day-results-copy]");
      const action = currentCard.querySelector("[data-race-day-results-action]");
      if (tag) tag.textContent = "Latest";
      if (copy) copy.textContent = `Official ${year} results.`;
      if (action) action.textContent = "Open results";
    }

    document.querySelectorAll('.result-card[data-source="latest"]:not([data-race-day-results-card])').forEach((card) => {
      card.dataset.source = "archive";
    });

    const filter = document.querySelector("#results-filter");
    if (filter) filter.dispatchEvent(new Event("change"));
  }

  async function refreshRaceDayLinks() {
    if (refreshInProgress) return;
    refreshInProgress = true;

    try {
      const configUrl = new URL(configPath, window.location.origin);
      configUrl.searchParams.set("refresh", Date.now().toString());

      const response = await fetch(configUrl, {
        cache: "no-store",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) return;

      const config = await response.json();
      applyConfiguredLinks("liveTracking", config.liveTracking, "Live Leaderboard");
      applyConfiguredLinks("mapTracking", config.mapTracking, "Marathon Map Tracker");
      applyResults(config.results);
    } catch {
      // Keep the page's safe default links if the race-day config is unavailable.
    } finally {
      refreshInProgress = false;
    }
  }

  refreshRaceDayLinks();

  window.setInterval(() => {
    if (!document.hidden) refreshRaceDayLinks();
  }, refreshIntervalMs);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshRaceDayLinks();
  });
})();
