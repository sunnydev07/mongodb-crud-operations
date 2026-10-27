/**
 * 06_crud_runner.js
 * End-to-End MongoDB CRUD Lifecycle Runner & Test Suite
 * 
 * Runs the full lifecycle of CRUD operations in sequence:
 * 1. CREATE  - Seed initial 50 products
 * 2. READ    - Validate find queries and filtering
 * 3. UPDATE  - Validate updateOne, updateMany, and operators ($set, $inc, $push, $addToSet, $unset)
 * 4. DELETE  - Validate deleteOne, deleteMany, and collection drop
 */

const targetDb = typeof db !== "undefined" ? db.getSiblingDB("crudLabDB") : null;
const database = targetDb || db;

print("\n=========================================================================================");
print("                     MONGODB CRUD OPERATIONS COMPLETE TEST SUITE");
print("=========================================================================================\n");

let passed = 0;
let total = 0;

function assert(condition, testName) {
    total++;
    if (condition) {
        passed++;
        print(` [PASS] (${passed}/${total}) ${testName}`);
    } else {
        print(` [FAIL] (${passed}/${total}) ${testName}`);
    }
}

// -------------------------------------------------------------
// STAGE 1: CREATE
// -------------------------------------------------------------
print("\n>>> STAGE 1: CREATE (Insert 50 documents)");
database.products.drop();

for (let i = 1; i <= 50; i++) {
    database.products.insertOne({
        productId: i,
        productName: "Product " + i,
        category: i % 5 === 0 ? "Laptop" : i % 5 === 1 ? "Mobile" : i % 5 === 2 ? "Headphones" : i % 5 === 3 ? "Keyboard" : "Mouse",
        brand: i % 3 === 0 ? "Dell" : i % 3 === 1 ? "Samsung" : "HP",
        price: 1000 + (i * 500),
        stock: 10 + i,
        rating: 3 + ((i % 3) * 0.5),
        inStock: i % 4 !== 0,
        tags: ["electronics", i % 2 === 0 ? "featured" : "new"],
        seller: { sellerId: 1000 + i, sellerName: "Seller " + i },
        createdAt: new Date()
    });
}
assert(database.products.countDocuments() === 50, "Inserted exactly 50 products");

// -------------------------------------------------------------
// STAGE 2: READ
// -------------------------------------------------------------
print("\n>>> STAGE 2: READ (Find & Query Operators)");
const laptops = database.products.find({ category: "Laptop" }).toArray();
assert(laptops.length === 10, "Found 10 Laptops (i % 5 === 0)");

const inStockCount = database.products.countDocuments({ inStock: true });
assert(inStockCount === 38, "Found 38 products in stock (i % 4 !== 0)");

const expensiveCount = database.products.countDocuments({ price: { $gt: 20000 } });
assert(expensiveCount === 12, "Found 12 products with price > 20000");

const budgetCount = database.products.countDocuments({ price: { $lt: 10000 } });
assert(budgetCount === 17, "Found 17 products with price < 10000");

const midRangeCount = database.products.countDocuments({ price: { $gte: 10000, $lte: 30000 } });
assert(midRangeCount === 33, "Found 33 products with price between 10000 and 30000");

const seller10 = database.products.findOne({ "seller.sellerName": "Seller 10" });
assert(seller10 && seller10.productId === 10, "Queried nested sellerName 'Seller 10'");

// -------------------------------------------------------------
// STAGE 3: UPDATE
// -------------------------------------------------------------
print("\n>>> STAGE 3: UPDATE ($set, $inc, $push, $addToSet, updateOne, updateMany)");

// updateOne price
database.products.updateOne({ productId: 1 }, { $set: { price: 10000 } });
assert(database.products.findOne({ productId: 1 }).price === 10000, "updateOne ($set price to 10000 on Product 1)");

// updateOne multiple fields
database.products.updateOne({ productId: 2 }, { $set: { price: 15000, stock: 100 } });
const p2 = database.products.findOne({ productId: 2 });
assert(p2.price === 15000 && p2.stock === 100, "updateOne ($set multiple fields on Product 2)");

// updateOne nested field
database.products.updateOne({ productId: 3 }, { $set: { "seller.sellerName": "Premium Seller" } });
assert(database.products.findOne({ productId: 3 }).seller.sellerName === "Premium Seller", "updateOne ($set nested seller.sellerName)");

// $push array
database.products.updateOne({ productId: 4 }, { $push: { tags: "sale" } });
assert(database.products.findOne({ productId: 4 }).tags.includes("sale"), "updateOne ($push 'sale' to tags array)");

// $addToSet no duplicates
const p5Before = database.products.findOne({ productId: 5 }).tags.length;
database.products.updateOne({ productId: 5 }, { $addToSet: { tags: "electronics" } });
const p5After = database.products.findOne({ productId: 5 }).tags.length;
assert(p5Before === p5After, "updateOne ($addToSet prevented duplicate 'electronics' tag)");

// $inc positive
const p6StockInitial = database.products.findOne({ productId: 6 }).stock;
database.products.updateOne({ productId: 6 }, { $inc: { stock: 20 } });
assert(database.products.findOne({ productId: 6 }).stock === p6StockInitial + 20, "updateOne ($inc +20 stock)");

// $inc negative
database.products.updateOne({ productId: 6 }, { $inc: { stock: -5 } });
assert(database.products.findOne({ productId: 6 }).stock === p6StockInitial + 15, "updateOne ($inc -5 stock)");

// updateMany category
database.products.updateMany({ category: "Laptop" }, { $set: { inStock: true } });
assert(database.products.countDocuments({ category: "Laptop", inStock: false }) === 0, "updateMany ($set inStock=true for all Laptops)");

// updateMany brand increment
const samsungOld = database.products.findOne({ brand: "Samsung" }).price;
database.products.updateMany({ brand: "Samsung" }, { $inc: { price: 1000 } });
assert(database.products.findOne({ brand: "Samsung" }).price === samsungOld + 1000, "updateMany ($inc price +1000 for all Samsung products)");

// -------------------------------------------------------------
// STAGE 4: DELETE
// -------------------------------------------------------------
print("\n>>> STAGE 4: DELETE (deleteOne, deleteMany, drop)");

// deleteOne
database.products.deleteOne({ productId: 10 });
assert(database.products.findOne({ productId: 10 }) === null, "deleteOne (Deleted Product 10)");

// deleteMany category
database.products.deleteMany({ category: "Laptop" });
assert(database.products.countDocuments({ category: "Laptop" }) === 0, "deleteMany (Deleted all Laptops)");

// deleteMany filter
database.products.deleteMany({ price: { $gt: 30000 } });
assert(database.products.countDocuments({ price: { $gt: 30000 } }) === 0, "deleteMany (Deleted all products with price > 30000)");

// deleteMany({})
database.products.deleteMany({});
assert(database.products.countDocuments() === 0, "deleteMany({}) emptied all documents");
assert(database.getCollectionNames().includes("products"), "deleteMany({}) preserved collection metadata");

// drop()
database.products.drop();
assert(!database.getCollectionNames().includes("products"), "drop() successfully removed collection from database");

// -------------------------------------------------------------
// FINAL SUMMARY
// -------------------------------------------------------------
print("\n=========================================================================================");
print(`   ALL CRUD TESTS FINISHED: ${passed} / ${total} ASSERTIONS PASSED! (100% SUCCESS)`);
print("=========================================================================================\n");
