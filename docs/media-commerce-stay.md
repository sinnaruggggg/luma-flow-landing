# Commerce, stay and culture photograph provenance

Collected 2026-09-16 for 20 illustrative sample sites. The manifest is `src/editorial/data/media-commerce-stay.json`.

## Coverage

- Hospitality, retail, food and culture (`other`): 20 photographs per industry, 80 total.
- Every consecutive four records within an industry form one site's image set, in editorial, minimal, trust, impact and photography order.
- Each selected record has a unique upstream photo ID and downloaded SHA-256. No crop variants are used to inflate uniqueness.
- Files are locally stored JPEGs requested at 1200px width and quality 80.
- Korean alt descriptions were written after inspecting all four contact sheets. They describe visible content and do not identify fictional venues, room categories or products as photographed facts.

## Public collection route and license

Public Unsplash search HTML was fetched without cookies or credentials. Each selected figure explicitly supplied `https://unsplash.com/license` as its license, plus photo page, creator and original description in public structured metadata. Unsplash+ and sponsored figures were excluded. The `/napi/search/photos` route returned HTTP 401 and was not used further. No authentication or rate-limit bypass was attempted.

Individual source URL, photographer, license URL, source ID, original description and SHA-256 are retained per image in the manifest. The [Unsplash License](https://unsplash.com/license) is a permissive photography copyright license, not a guarantee of all trademark, artwork, architecture, privacy or other third-party permissions. Images are illustrative and must not imply that the fictional sample company owns the depicted location or manufactures the depicted object. For actual customer deployment, replace with client-approved photography or review necessary third-party permissions, especially gallery artworks.

## Visual review

Contact sheets are under `artifacts/media-commerce-stay/`. Reviewed at full sheet size: all 80 selected images fit their industry. Four initial candidates were excluded: a second angle of the same hotel room, a near-duplicate living room, and two bare household coffee tables that did not illustrate food service adequately. Sheets retain pre-assignment ordering; the manifest has balanced four-image groups.

Collection helper: `scripts/collect-media-commerce-stay.mjs`. Final annotation and grouping helper: `scripts/finalize-media-commerce-stay.mjs`. These are one-time collection artifacts, not runtime dependencies; do not rerun against the final manifest without reviewing group order and annotations.
