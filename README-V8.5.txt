S&N Wedding — V8.5 FINAL vine-scroll fix

Replace ONLY script.js in repository saeedandniloufar-wedding.
No other files are changed.

Fix: story-vines progress was mixing #site-relative coordinates with document coordinates,
so the vines stopped after the last photo. This version keeps the existing vine appearance
and simply reveals the same edge vines continuously down the page.
