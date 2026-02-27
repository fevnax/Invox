import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

const formatCurrentDate = () => {
  const d = new Date();
  return `${d.getDate()} / ${d.getMonth() + 1} / ${d.getFullYear()}`;
};

app.get("/", (_req, res) => {
  res.render("purchase");
});

app.post("/invoice", (req, res) => {
  const {
    customerName,
    customerAddress,
    paymentMethod,
    cardNumber,
    cardName,
    upiId,
    upiName,
    accountNumber,
    accountName,
    ifsc,
    paypalEmail,
    cashName,
    otherDetails
  } = req.body;

  let rawItems = [];
  try {
    rawItems = JSON.parse(req.body.items || "[]");
  } catch {
    rawItems = [];
  }

  const items = [];
  let subtotal = 0;

  for (const ri of rawItems) {
    const price = parseFloat(ri.price) || 0;
    const quantity = parseInt(ri.qty, 10) || 1;
    const total = price * quantity;
    subtotal += total;
    items.push({ name: ri.name, price, quantity, total });
  }


  const tax = subtotal * 0.18;
  const finalTotal = subtotal + tax;
  const date = formatCurrentDate();

  const invoiceNumber = `INV-${Date.now()}`;

  res.render("invoice", {
    customerName,
    customerAddress,
    paymentMethod,
    cardNumber,
    cardName,
    upiId,
    upiName,
    accountNumber,
    accountName,
    ifsc,
    paypalEmail,
    cashName,
    otherDetails,
    invoiceNumber,
    items,
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: finalTotal.toFixed(2),
    date,
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Your API is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`);
});
