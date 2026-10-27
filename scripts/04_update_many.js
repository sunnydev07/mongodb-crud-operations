/**
 * 04_update_many.js
 * MongoDB UPDATE Operations: updateMany()
 * 
 * Demonstrates:
 * 1. Modifying multiple documents satisfying a category condition
 * 2. Applying arithmetic updates ($inc) across all matching brand records
 * 3. Inspecting matchedCount vs modifiedCount
 */

const targetDb = typeof db !== "undefined" ? db.getSiblingDB("crudLabDB") : null;
const database = targetDb || db;

print("\n========================================================");
print("   MongoDB CRUD Lab: Multi-Document Updates (updateMany)");
print("========================================================\n");

// Task 1: Set inStock to true for all products belonging to the Laptop category
print("[Task 1] Set inStock to true for all Laptop products:");
print("Command: db.products.updateMany({ category: 'Laptop' }, { $set: { inStock: true } })");

const beforeCount = database.products.countDocuments({ category: "Laptop", inStock: false });
print(`Laptops currently out of stock: ${beforeCount}`);

const res1 = database.products.updateMany(
    { category: "Laptop" },
    { $set: { inStock: true } }
);

print(`Result -> Matched: ${res1.matchedCount}, Modified: ${res1.modifiedCount}`);
const afterCount = database.products.countDocuments({ category: "Laptop", inStock: true });
print(`Total Laptops now in stock: ${afterCount} (All Laptops are now inStock = true)`);

// Task 2: Increase the price of all Samsung products by 1000
print("\n--------------------------------------------------------");
print("[Task 2] Increase the price of all Samsung products by 1000 using $inc:");
print("Command: db.products.updateMany({ brand: 'Samsung' }, { $inc: { price: 1000 } })");

const samsungSampleBefore = database.products.findOne({ brand: "Samsung" });
print(`Sample Samsung Product (ID: ${samsungSampleBefore.productId}) Price Before: Rs. ${samsungSampleBefore.price}`);

const res2 = database.products.updateMany(
    { brand: "Samsung" },
    { $inc: { price: 1000 } }
);

print(`Result -> Matched: ${res2.matchedCount}, Modified: ${res2.modifiedCount}`);
const samsungSampleAfter = database.products.findOne({ productId: samsungSampleBefore.productId });
print(`Sample Samsung Product (ID: ${samsungSampleAfter.productId}) Price After: Rs. ${samsungSampleAfter.price}`);

// Task 3: Bulk tag addition for featured electronics
print("\n--------------------------------------------------------");
print("[Task 3] Add 'deal_of_the_day' tag to all products with rating >= 4.0 using $addToSet:");
const res3 = database.products.updateMany(
    { rating: { $gte: 4.0 } },
    { $addToSet: { tags: "deal_of_the_day" } }
);
print(`Result -> Matched: ${res3.matchedCount}, Modified: ${res3.modifiedCount}`);

print("\n[DONE] Multi-Document Update operations completed successfully.\n");
