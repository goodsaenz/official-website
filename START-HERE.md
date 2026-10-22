# GoodSaenz shopping cart + Custom Glow Lamps — Preview v0.1

This is a **working front-end preview**, not a live e-commerce checkout. Nothing here creates an Azure order, uploads reference images, submits a quote, or charges a card.

## Files in this folder

- `Custom-Glow-Lamps.html` — product configuration, personalization, four font-choice galleries, acrylic swatches, UV resin finish selection, image picker for custom requests, and **Add to cart**.
- `Cart.html` — shared cart view with multiple independently customized Glow Lamps; edit, remove, change quantity; quoted items separate from fixed-price items; shipping request toggle.
- `goodsaenz-cart.js` — shared cart model and GoodSaenz product price matrix. Uses `sessionStorage` for **temporary same-tab preview testing**; no server integration or real-payment capability.
- `goodsaenz-shop.css` — GoodSaenz-inspired opal responsive styling shared by both pages.
- `Custom-Glow-Lamp-Florence.jpg` — your example lamp photo.

The HTML pages also look for `goodsaenz-wordmark.png` in their folder (already part of your existing GoodSaenz GitHub site). If the logo isn't there, they fall back to text.

## Try it on GitHub Pages

1. Upload all **five** files above to the same folder in your `official-website` GitHub repository. You don't need to upload this Markdown file unless you want to.
2. Make sure `goodsaenz-wordmark.png` exists in the same folder (or use the text fallback).
3. Open `https://goodsaenz.com/Custom-Glow-Lamps.html` after publication (or your GitHub Pages testing URL).
4. Configure a lamp, press **Add to cart**, add another lamp, edit its name, remove it, and choose shipping or pickup in the cart.
5. **Do not change the live ornament ordering page yet.** Existing customer submissions should keep following the functioning standalone flow until the Azure multi-item checkout has been verified.

## Important preview limitations

- **Prices** for all six presets are the approved customer-facing grid:

  | Acrylic | Engrave-only | Single-color resin | Multicolor resin |
  |---|---:|---:|---:|
  | Clear | $40 | $60 | $80 |
  | Translucent | $50 | $70 | $90 |
  | Specialty | $60 | $80 | $100 |

- Fully custom designs, unlisted acrylic, unlisted specialty, or "Other" fill colors become **quote required**. Quote forms do not send anything yet.
- Shipping is nationwide US **by quote before payment**. International shipping is out of scope for now.
- Client-side prices are **display-only**; Azure must recalculate and authorize them before creating Stripe Checkout.
- Price includes applicable product sales taxes; Azure/Stripe must determine actual tax obligations by the sale's destination and fulfillment. For eligible tax-inclusive selling prices, tax is extracted from price, **not added on top**. Shipping quote is extra and may itself be taxable.
- **No reference image is uploaded or carried into the cart**. Only a count is shown, as a warning. A secure upload endpoint, server file validation, size limits, malware controls, storage and deletion policy are necessary before enabling uploads.
- Cart data are stored **temporarily in sessionStorage** to demonstrate cross-page navigation in one tab. Real customer personalizations, especially student names or other private information, need server-side cart records and suitable data-protection controls before launch. Don't test with real private information.
- Design-color swatches are **illustrative only** until actual inventory and engraving/curing compatibility are confirmed.
- Taxes, Stripe, and prices must not be trusted or calculated authoritatively from browser code.

## Next backend development step

The attached **Teacher-Ornaments-Form(8).html** currently calls a single-order Azure `/api/orders` API, which may return a `checkoutUrl` and redirect directly to Stripe. This preview deliberately does not call that endpoint because it only has the existing one-item workflow.

Next, retrieve the current GitHub source for Azure `goodsaenz-orders-api`, especially the **orders function**, price validation, Stripe Checkout creation, Cosmos/Table/Blob record model, and webhook handler. Extend it to accept a cart with separate product types and variants. Add a secure server-side cart containing personalization and reference assets; validate price and item types in Azure; create one order and Stripe Checkout session with multiple lines; record payment at the order level and fulfillment at the item level; create separate quote records without payment; and support quote-approved shipping without accidentally taking payment before approval.

Once end-to-end tested with Stripe test mode and verified webhook reconciliation, the original ornament page can be safely converted to **Add to cart** and this preview's disabled checkout controls can be activated. Owner order alerts remain a post-launch enhancement per the current prioritization, so check PAID and QUOTE_REQUIRED records manually in the interim.
