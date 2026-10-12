# Northfold Stoneware Mug

Product page for Northfold’s first piece: a $28 stoneware mug available in three glazes (Oat, Slate, and Moss). Built with a single `index.html` and `styles.css` — no frameworks or libraries.

The page includes a header with navigation, a product section with image gallery, title, price, glaze radio buttons, quantity input and Add to cart button, three short benefit statements, and a footer. Layout is single-column below 750px and two-column above.

**Decision:** I used radio buttons + CSS `:has()` to switch the main gallery image instead of JavaScript. The brief only allowed HTML and CSS, and this approach still keeps the gallery fully keyboard-accessible.

**Next steps:** Connect the Add to cart button to a real Shopify cart (after tonight’s Partner account setup) and make the main photo update automatically when a glaze is selected.