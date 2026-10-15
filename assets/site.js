// assets/site.js — the shared CTVA header and footer, so every public page has the same menu.
// Replaces the page's old <nav class="navbar"> (each page used to carry its own, slightly different
// copy) and adds the shared footer to pages that don't have one. Loaded with defer, after theme.css.
(function () {
  var LINKS = [
    ["index.html#events", "Events"],
    ["tournaments.html", "Tournaments"],
    ["league.html", "League"],
    ["teams.html", "Teams"],
    ["players.html", "Players"],
    ["auction.html", "Auction"],
    ["index.html#photos", "Archive"],
    ["tribute.html", "In memory"],
  ];
  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  // Pages that belong under a menu item without being it.
  var SECTION = { "player.html": "players.html", "auction-signup.html": "auction.html", "auction-vote.html": "auction.html", "my-profile.html": "auction.html", "thaimun-2026.html": "index.html#photos" };
  var current = SECTION[page] || page;

  function link(href, label) {
    var here = href === current || (href.indexOf("#") < 0 && href === page);
    return '<a href="' + href + '"' + (here ? ' aria-current="page"' : "") + ">" + label + "</a>";
  }
  var links = LINKS.map(function (l) { return link(l[0], l[1]); }).join("");
  var brand =
    '<a class="cx-brand" href="index.html" aria-label="CTVA home">' +
    '<img src="images/TeamLogos/CTVA_Logo_v3.png" alt="" width="50" height="50">' +
    "<span><b>CTVA</b><small>Canadian Tamil Volleyball Association</small></span></a>";

  var header = document.createElement("header");
  header.className = "cx-header";
  header.innerHTML =
    '<div class="cx-wrap cx-head-in">' + brand +
    '<nav class="cx-nav" aria-label="Main">' + links + "</nav>" +
    '<a class="cx-cta" href="petition.html">Sign the petition</a>' +
    '<details class="cx-menu"><summary aria-label="Menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></summary>' +
    '<nav class="cx-menu-pop" aria-label="Main">' + links + '<a class="cx-cta" href="petition.html">Sign the petition</a></nav></details>' +
    "</div>";

  var old = document.querySelector("nav.navbar");
  if (old) old.replaceWith(header);
  else document.body.insertBefore(header, document.body.firstChild);

  // Close the phone menu after choosing a same-page link (e.g. Archive on the homepage).
  header.querySelectorAll(".cx-menu-pop a").forEach(function (a) {
    a.addEventListener("click", function () { header.querySelector(".cx-menu").open = false; });
  });

  if (!document.querySelector("footer")) {
    var footer = document.createElement("footer");
    footer.className = "cx-footer";
    footer.innerHTML =
      '<div class="cx-wrap"><div class="cx-foot-in">' +
      "<div>" + brand.replace("Canadian Tamil Volleyball Association", "Since 1989") +
      "<p>The home of Tamil-Canadian volleyball. 29 clubs, one community, rooted in Scarborough.</p></div>" +
      '<div><h4>Play</h4><ul><li><a href="index.html#events">Upcoming events</a></li><li><a href="tournaments.html">Tournament results</a></li><li><a href="league.html">League</a></li><li><a href="teams.html">Teams</a></li></ul></div>' +
      '<div><h4>Community</h4><ul><li><a href="index.html#photos">Archive</a></li><li><a href="petition.html">Sign the petition</a></li><li><a href="tribute.html">In memory</a></li><li><a href="auction.html">Auction</a></li></ul></div>' +
      '<div><h4>Contact</h4><ul><li><a href="mailto:info@ctva.ca">info@ctva.ca</a></li><li>Scarborough, Toronto, ON</li></ul></div>' +
      '</div><div class="cx-foot-note"><span>© ' + new Date().getFullYear() + " Canadian Tamil Volleyball Association</span><span>In loving memory of Mahinthan</span></div></div>";
    document.body.appendChild(footer);
  }
})();
