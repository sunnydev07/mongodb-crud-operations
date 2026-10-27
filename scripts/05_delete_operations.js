/**
 * 05_delete_operations.js
 * MongoDB DELETE Operations: deleteOne(), deleteMany(), and drop()
 * 
 * Demonstrates:
 * 1. deleteOne() - Removing a single targeted document by filter
 * 2. deleteMany() - Removing multiple documents matching a category or range filter
 * 3. deleteMany({}) - Deleting all documents while preserving collection & index metadata
 * 4. drop() - Removing the entire collection from the database
 */

const targetDb = typeof db !== "undefined" ? db.getSiblingDB("crudLabDB") : null;
const database = targetDb || db;

print("\n========================================================");
print("   MongoDB CRUD Lab: DELETE Operations & Collection Drop");
print("========================================================\n");

// Task 1: Delete product whose productId is 10
print("[Task 1] Delete product whose productId is 10 using deleteOne():");
print("Command: db.products.deleteOne({ productId: 10 })");
const res1 = database.products.deleteOne({ productId: 10 });
print(`Deleted Count: ${res1.deletedCount}`);
const verifyP10 = database.products.findOne({ productId: 10 });
print(`Verification -> Does Product 10 exist? ${verifyP10 !== null ? "YES" : "NO (Deleted successfully)"}`);

// Task 2: Delete all products belonging to the Laptop category
print("\n--------------------------------------------------------");
print("[Task 2] Delete all products belonging to the Laptop category:");
print("Command: db.products.deleteMany({ category: 'Laptop' })");
const res2 = database.products.deleteMany({ category: "Laptop" });
print(`Deleted Count: ${res2.deletedCount} Laptop products`);
const laptopCountAfter = database.products.countDocuments({ category: "Laptop" });
print(`Verification -> Remaining Laptops: ${laptopCountAfter}`);

// Task 3: Delete all products whose price is greater than 30000
print("\n--------------------------------------------------------");
print("[Task 3] Delete all products whose price is greater than 30000:");
print("Command: db.products.deleteMany({ price: { $gt: 30000 } })");
const res3 = database.products.deleteMany({ price: { $gt: 30000 } });
print(`Deleted Count: ${res3.deletedCount} expensive products`);
const expensiveCountAfter = database.products.countDocuments({ price: { $gt: 30000 } });
print(`Verification -> Remaining products with price > 30000: ${expensiveCountAfter}`);

// Task 4: Delete all documents without deleting the collection itself
print("\n--------------------------------------------------------");
print("[Task 4] Delete all documents without deleting collection: db.products.deleteMany({})");
const countBeforeClear = database.products.countDocuments();
print(`Documents in collection before deleteMany({}): ${countBeforeClear}`);

const resAll = database.products.deleteMany({});
print(`Deleted Count: ${resAll.deletedCount}`);

const countAfterClear = database.products.countDocuments();
const collectionExistsAfterDelete = database.getCollectionNames().includes("products");
print(`Documents in collection after deleteMany({}): ${countAfterClear}`);
print(`Does the 'products' collection still exist in the database? ${collectionExistsAfterDelete ? "YES (Metadata preserved)" : "NO"}`);

// Task 5: drop() vs deleteMany({}) demonstration
print("\n--------------------------------------------------------");
print("[Task 5] Dropping the collection entirely: db.products.drop()");
const dropResult = database.products.drop();
print(`Drop returned: ${dropResult}`);
const collectionExistsAfterDrop = database.getCollectionNames().includes("products");
print(`Does the 'products' collection exist after drop()? ${collectionExistsAfterDrop ? "YES" : "NO (Collection removed completely)"}`);

print("\n========================================================");
print("   Summary: deleteMany({}) vs drop()");
print("========================================================");
print(" - deleteMany({}): Documents -> DELETED | Collection -> PRESERVED | Indexes -> PRESERVED");
print(" - drop()        : Documents -> DELETED | Collection -> DELETED   | Indexes -> DELETED");
print("========================================================\n");

print("[DONE] DELETE operations completed successfully.\n");
