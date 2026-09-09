# For Bethany, always.

An anniversary website from Petar to Bethany: a cutout portrait hero, live relationship clock, their first photo, 11 more gallery memories, personal details, a past-and-future timeline, and a tribute to Luna.

## View locally

Serve `dist` with any static web server, for example `python3 -m http.server 8000 --directory dist`, then open http://localhost:8000.

## Password

`betar`, case insensitive. This is intentionally a lightweight browser gate. The password and photographs are available in this public repository; it is not secure authentication. Unlocking is remembered for the current browser tab using sessionStorage. The Just us button locks it again.

## Make it personal

Edit `dist/content.js` to replace the starter captions with Petar's own notes, add memories, update favorite things, and adjust timeline entries. Place new images in `dist/assets` and reference their basename in a memory entry. Photos open with their full captions; arrows and keyboard left/right browse the collection. The first photo has its own featured section and is also in the viewer.

The supplied caption drafts avoid inventing dates or specific events not provided. The intro, first-photo section, Luna tribute, and closing note are in `dist/index.html`. All visible romantic copy is written from Petar's perspective, addressed to Bethany.

The relationship timer starts September 11, 2025 at 9 pm in California (UTC−07:00), independent of a viewer's timezone. Birthdays are ordered chronologically. Future milestones are visibly marked based on today's date. May 2028 is a graduation goal; engagement in 2031? and marriage in 2033? are explicitly tentative dreams.

## Hosting

This is a build-free static website. Publish `dist/` as the website root using any static host (e.g. Cloudflare Pages, Netlify, or GitHub Pages through an Actions artifact). There are no environment variables, database, or npm dependencies. The optional Google Fonts stylesheet has system font fallbacks.

Photos are optimized WebP copies of the supplied originals, with the hero's transparency retained. The supplied originals have not been changed.
