# Northfold catalogue (mock.shop)

Product page that loads one item from Shopify’s public practice API at mock.shop. Plain HTML, CSS, and one `script.js` module. Default product is the Hoodie (`hoodie-old`). Pass `?handle=sweatpants` (or any other handle) to try a different one.

On load the page fetches title, description, price, images and variants. Prices use the currency mock.shop returns, formatted with `Intl.NumberFormat`. Picking a variant updates the price and the main photo when that variant has an image. Thumbnails work with mouse and keyboard. Add to cart stores the line in `localStorage` so the header count survives a refresh. The cart drawer lists each line and a subtotal.

**Decision:** I dropped the IP-based currency switcher. Converted prices are not what a store would charge, and sending every visitor’s IP to a third-party API was extra scope. Shopify would set country prices on a real storefront.

**Next:** Point the same fetch at a real Northfold storefront API once the Shopify theme is running, and send the cart to Checkout.
