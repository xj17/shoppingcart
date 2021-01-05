import React from "react";
import App from "./App";
import dva from "dva";
import products from "./models/products";
import cart from "./models/cart";
// import chioce from "./models/chioce";

const app = dva();
app.router(() => <App />);
app.model(products);
app.model(cart);
// app.model(chioce);
app.start("#root");
