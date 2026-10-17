# Northfold theme

Announcement bar at the top of every page (header group). Merchants edit the message, optional link, and colours in the theme editor. Empty message hides the bar. Dismiss uses sessionStorage so it stays gone for the rest of that visit, then comes back next visit. Assumed: changing the copy mid-visit does not bring it back until a new session.

**Decision:** sessionStorage, not localStorage, because the ticket is “this visit”, not “forever”. The close control is a real button so keyboard users can tab to it and press Enter.

**Next:** If a new promo should interrupt a dismissed visit, store a hash of the message in sessionStorage and show the bar again when the copy changes.

Day 4 product work is unchanged: fetch add to cart, free-shipping bar, drawer.
