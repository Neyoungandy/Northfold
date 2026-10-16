# Northfold theme

Product page section with Liquid product data, merchant-editable benefits, fetch add to cart, and a free-shipping bar. The bar’s first paint uses `cart.total_price`. After add, the Cart API returns the product and header sections so the remaining amount and cart count update without a reload. The threshold is a theme editor number (default 60), not a figure in the script.

**Decision:** Cart URLs are always `window.Shopify.routes.root + 'cart/add.js'` so markets/locales stay correct. The bar is a labelled `<progress>` with `aria-live` on the remaining/success copy.

**Next:** Care copy shows when `custom.care_instructions` is set on the product; leave it blank to hide the block. After add, a cart drawer opens from the same Cart API `sections` response.

Reviewers: unpublished Share preview, GitHub `day-4` branch, storefront password in the note (not here).
