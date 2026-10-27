/**
 * 03_update_single.js
 * MongoDB UPDATE Operations: updateOne() and Update Operators
 * 
 * Demonstrates:
 * 1. $set - Modifying single and multiple fields
 * 2. $set on nested/embedded objects ("seller.sellerName")
 * 3. $push - Appending to an array
 * 4. $addToSet - Adding to an array only if not already present (no duplicates)
 * 5. $inc - Increasing and decreasing numeric values
 * 6. $unset - Removing fields
 * 7. Combined multi-operator updateOne() call
 */

const targetDb = typeof db !== "undefined" ? db.getSiblingDB("crudLabDB") : null;
const database = targetDb || db;

print("\n========================================================");
print("   MongoDB CRUD Lab: Single Document Updates (updateOne)");
print("========================================================\n");

// Task 1: Change price of Product 1 to 10000
print("[Task 1] Change the price of Product 1 to 10000:");
print("Command: db.products.updateOne({ productId: 1 }, { $set: { price: 10000 } })");
const res1 = database.products.updateOne({ productId: 1 }, { $set: { price: 10000 } });
const p1 = database.products.findOne({ productId: 1 });
print(`Matched: ${res1.matchedCount}, Modified: ${res1.modifiedCount}`);
print(`Verification -> Product 1 new price: Rs. ${p1.price}`);

// Task 2: Updating multiple fields of Product 2
print("\n[Task 2] Update the price (15000) and stock (100) of Product 2:");
print("Command: db.products.updateOne({ productId: 2 }, { $set: { price: 15000, stock: 100 } })");
const res2 = database.products.updateOne(
    { productId: 2 },
    { $set: { price: 15000, stock: 100 } }
);
const p2 = database.products.findOne({ productId: 2 });
print(`Matched: ${res2.matchedCount}, Modified: ${res2.modifiedCount}`);
print(`Verification -> Product 2 price: Rs. ${p2.price}, stock: ${p2.stock}`);

// Task 3: Change seller name of Product 3 to "Premium Seller"
print("\n[Task 3] Change seller name of Product 3 to 'Premium Seller' (Nested field):");
print("Command: db.products.updateOne({ productId: 3 }, { $set: { 'seller.sellerName': 'Premium Seller' } })");
const res3 = database.products.updateOne(
    { productId: 3 },
    { $set: { "seller.sellerName": "Premium Seller" } }
);
const p3 = database.products.findOne({ productId: 3 });
print(`Matched: ${res3.matchedCount}, Modified: ${res3.modifiedCount}`);
print(`Verification -> Product 3 seller: ${JSON.stringify(p3.seller)}`);

// Task 4: Add "sale" to the tags array of Product 4
print("\n[Task 4] Add 'sale' to the tags array of Product 4 using $push:");
print("Command: db.products.updateOne({ productId: 4 }, { $push: { tags: 'sale' } })");
const res4 = database.products.updateOne(
    { productId: 4 },
    { $push: { tags: "sale" } }
);
const p4 = database.products.findOne({ productId: 4 });
print(`Matched: ${res4.matchedCount}, Modified: ${res4.modifiedCount}`);
print(`Verification -> Product 4 tags: ${JSON.stringify(p4.tags)}`);

// Task 5: Add "electronics" to the tags of Product 5 without creating duplicate
print("\n[Task 5] Add 'electronics' to tags of Product 5 without duplicate using $addToSet:");
print("Command: db.products.updateOne({ productId: 5 }, { $addToSet: { tags: 'electronics' } })");
const res5 = database.products.updateOne(
    { productId: 5 },
    { $addToSet: { tags: "electronics" } }
);
const p5 = database.products.findOne({ productId: 5 });
print(`Matched: ${res5.matchedCount}, Modified: ${res5.modifiedCount} (0 modified means duplicate was avoided!)`);
print(`Verification -> Product 5 tags: ${JSON.stringify(p5.tags)}`);

// Task 6: Increase the stock of Product 6 by 20
print("\n[Task 6] Increase the stock of Product 6 by 20 using $inc:");
print("Command: db.products.updateOne({ productId: 6 }, { $inc: { stock: 20 } })");
const p6Before = database.products.findOne({ productId: 6 });
const res6a = database.products.updateOne({ productId: 6 }, { $inc: { stock: 20 } });
const p6AfterInc = database.products.findOne({ productId: 6 });
print(`Previous Stock: ${p6Before.stock} -> New Stock: ${p6AfterInc.stock}`);

// Task 7: Decrease the stock of Product 6 by 5
print("\n[Task 7] Decrease the stock of Product 6 by 5 using negative $inc:");
print("Command: db.products.updateOne({ productId: 6 }, { $inc: { stock: -5 } })");
const res6b = database.products.updateOne({ productId: 6 }, { $inc: { stock: -5 } });
const p6AfterDec = database.products.findOne({ productId: 6 });
print(`Previous Stock: ${p6AfterInc.stock} -> New Stock: ${p6AfterDec.stock}`);

// Task 8: Remove rating field from Product 7 using $unset
print("\n[Task 8] Remove 'rating' field from Product 7 using $unset:");
print("Command: db.products.updateOne({ productId: 7 }, { $unset: { rating: '' } })");
database.products.updateOne({ productId: 7 }, { $unset: { rating: "" } });
const p7 = database.products.findOne({ productId: 7 });
print(`Verification -> Product 7 has rating field? ${p7.rating !== undefined}`);

// Task 9: Combined Multi-Operator Update on Product 10
print("\n[Task 9] Combined multi-operator update on Product 10 ($set + $inc + $push):");
const res10 = database.products.updateOne(
    { productId: 10 },
    {
        $set: {
            price: 25000,
            inStock: true
        },
        $inc: {
            stock: 10
        },
        $push: {
            tags: "sale"
        }
    }
);
const p10 = database.products.findOne({ productId: 10 });
print(`Verification -> Product 10: price=${p10.price}, inStock=${p10.inStock}, stock=${p10.stock}, tags=${JSON.stringify(p10.tags)}`);

print("\n[DONE] Single Document Update operations completed successfully.\n");
