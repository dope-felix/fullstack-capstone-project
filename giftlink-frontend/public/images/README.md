# Gift images

Place source JPEG or PNG photos in this directory, then run
`npm run optimize:images` from `giftlink-frontend` (`npm.cmd run optimize:images`
in Windows PowerShell).

The script generates WebP files under `optimized/` at widths up to 480, 960,
and 1440 pixels, without enlarging small photos. It also updates
`src/generated/gift-images.json`. Include both the generated images and manifest
when saving changes.

`GiftImage` uses the manifest to let the browser choose a size suited to the
screen. Source photos remain available as a fallback. Images without a manifest
entry, including external URLs, use their original URL.

The gallery loads the first three images immediately and lazy-loads later rows.
The main photo on the details page loads immediately.
