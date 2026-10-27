/**
 * 02_read_operations.js
 * MongoDB READ (Find) Operations & Query Operators
 * 
 * Demonstrates:
 * 1. Exact equality filtering ({ category: "Laptop" })
 * 2. Boolean filtering ({ inStock: true })
 * 3. Comparison operators ($gt, $lt, $gte, $lte)
 * 4. Compound range queries ($gte AND $lte)
 * 5. Querying embedded/nested documents ("seller.sellerName")
 */

const targetDb = typeof db !== "undefined" ? db.getSiblingDB("crudLabDB") : null;
const database = targetDb || db;

print("\n========================================================");
print("   MongoDB CRUD Lab: READ (Find) Operations");
print("========================================================\n");

// Q1: Find all products belonging to the Laptop category
print("--------------------------------------------------------");
print("[Q1] Find all products belonging to the Laptop category:");
print("Query: db.products.find({ category: 'Laptop' })");
const laptops = database.products.find({ category: "Laptop" }).toArray();
print(`Result Count: ${laptops.length} products`);
laptops.slice(0, 3).forEach(p => {
    print(` - ID: ${p.productId}, Name: ${p.productName}, Category: ${p.category}, Brand: ${p.brand}, Price: Rs. ${p.price}`);
});

// Q2: Find all products that are currently in stock
print("\n--------------------------------------------------------");
print("[Q2] Find all products that are currently in stock:");
print("Query: db.products.find({ inStock: true })");
const inStockProducts = database.products.find({ inStock: true }).toArray();
print(`Result Count: ${inStockProducts.length} products`);
inStockProducts.slice(0, 3).forEach(p => {
    print(` - ID: ${p.productId}, Name: ${p.productName}, Stock: ${p.stock}, InStock: ${p.inStock}`);
});

// Q3: Find products whose price is greater than 20000
print("\n--------------------------------------------------------");
print("[Q3] Find products whose price is greater than 20000:");
print("Query: db.products.find({ price: { $gt: 20000 } })");
const expensive = database.products.find({ price: { $gt: 20000 } }).toArray();
print(`Result Count: ${expensive.length} products`);
expensive.slice(0, 3).forEach(p => {
    print(` - ID: ${p.productId}, Name: ${p.productName}, Price: Rs. ${p.price}`);
});

// Q4: Find products whose price is less than 10000
print("\n--------------------------------------------------------");
print("[Q4] Find products whose price is less than 10000:");
print("Query: db.products.find({ price: { $lt: 10000 } })");
const budget = database.products.find({ price: { $lt: 10000 } }).toArray();
print(`Result Count: ${budget.length} products`);
budget.slice(0, 3).forEach(p => {
    print(` - ID: ${p.productId}, Name: ${p.productName}, Price: Rs. ${p.price}`);
});

// Q5: Find products whose price is between 10000 and 30000
print("\n--------------------------------------------------------");
print("[Q5] Find products whose price is between 10000 and 30000:");
print("Query: db.products.find({ price: { $gte: 10000, $lte: 30000 } })");
const midRange = database.products.find({ price: { $gte: 10000, $lte: 30000 } }).toArray();
print(`Result Count: ${midRange.length} products`);
midRange.slice(0, 3).forEach(p => {
    print(` - ID: ${p.productId}, Name: ${p.productName}, Price: Rs. ${p.price}`);
});

// Q6: Find products sold by Seller 10
print("\n--------------------------------------------------------");
print("[Q6] Find products sold by Seller 10 (Embedded Document Query):");
print("Query: db.products.find({ 'seller.sellerName': 'Seller 10' })");
const seller10Products = database.products.find({ "seller.sellerName": "Seller 10" }).toArray();
print(`Result Count: ${seller10Products.length} product(s)`);
seller10Products.forEach(p => {
    print(` - ID: ${p.productId}, Name: ${p.productName}, Seller: ${JSON.stringify(p.seller)}`);
});

print("\n[DONE] READ operations completed successfully.\n");
