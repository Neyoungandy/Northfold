# Northfold theme

Shopify theme section for the product page. Title, price, description, images and variants all come from Liquid. Merchants edit benefits, heading, background and quantity in the theme editor — no developer needed for copy changes.

`templates/product.json` uses `sections/northfold-product.liquid` instead of the default product section. Add to cart is `{% form 'product', product %}`. Benefits live in `snippets/northfold-benefits.liquid` so the section stays short.

**Decision:** I put section CSS and the variant-price script in `{% stylesheet %}` and `{% javascript %}` on the section, not a global asset, so the product page styles do not leak onto every other template.

**Next:** Point the header and cart at the same Northfold look, then connect a real catalogue once products are in the store.

Reviewers should open the unpublished theme via Online Store → Themes → Preview → Share preview (not the store’s live/default theme URL).
