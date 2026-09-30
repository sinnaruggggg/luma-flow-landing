# Photo provenance — brand, medical, education and IT

Checked 2026-09-16. The manifest is `src/editorial/data/media-care-brand.json`.

80 distinct Unsplash photo IDs are assigned in manifest order: 20 per industry, four per style in this order: editorial, minimal, trust, impact, photography. Every record includes the original photo page, photographer, license URL and SHA-256 of the downloaded file. Download size is a maximum width of 1200 pixels at JPEG quality 80; no image is reused as a crop variant.

Sources were obtained from public Unsplash photo-search metadata without authentication. Both `premium` and `plus` records were excluded; only the standard `images.unsplash.com` photo host was accepted. The [Unsplash License](https://unsplash.com/license) permits commercial use and downloading; attribution is appreciated. This is not a representation that model, trademark or property releases have been obtained. Actual client deployment should replace illustrative facilities with authorized client photography where the image might imply ownership or a real service location.

All four contact sheets were visually reviewed. Rejected candidates included a prominent clinic logo, branded computer hardware, near-identical classroom views and two architecture images that looked rendered. Medical photography is empty facilities or equipment, with no patients. Dental equipment is described as dental equipment, not a general-examination room. No pictured facility is represented as belonging to the fictional sample business.

The Korean alternative text is manually written from visual inspection rather than copied from source captions. Contact sheets are under `artifacts/media-care-brand/`. The additive collection script is `scripts/collect-media-care-brand.mjs`; it rejects premium sources and duplicate IDs/hashes. Source files are served locally rather than hotlinked.

## Verification

- 80 unique source IDs and SHA-256 hashes.
- 20 records for each of the four industries.
- Source URL, author, license and local file present for every record.
- Reviewed desktop contact sheets for content fit, conspicuous branding and near duplicates.
- Photographic authenticity cannot be forensically guaranteed from contributor metadata alone; visibly rendered candidates were rejected.
