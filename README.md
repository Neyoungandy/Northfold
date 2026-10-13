# Northfold catalogue (mock.shop)

Product page that loads one item from Shopify’s public practice API at mock.shop. Plain HTML, CSS, and one `script.js` module. Default product is the Hoodie (`hoodie-old`). Pass `?handle=sweatpants` (or any other handle) to try a different one.

On load the page fetches title, description, price, images and variants. Prices convert from CAD into the currency for the visitor’s location (IP lookup), and the header dropdown can switch currency. Picking a variant updates the price and the main photo when that variant has an image. Thumbnails work with mouse and keyboard. Add to cart stores the line in `localStorage` so the header count survives a refresh. The cart drawer lists each line and a subtotal.

**Decision:** I kept the cart in `localStorage` instead of memory only, because the brief asked for the count to survive reload, and that is the simplest place a browser will keep a JSON array.

**Next:** Point the same fetch at a real Northfold storefront API once the Shopify theme is running, and send the cart to Checkout.
