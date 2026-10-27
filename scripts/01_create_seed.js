/**
 * 01_create_seed.js
 * MongoDB CREATE (Insert) Operations
 * 
 * Generates and inserts 50 realistic product documents into 'crudLabDB.products'
 * according to the exact schema specification from CRUD Operations.docx.
 */

const targetDb = typeof db !== "undefined" ? db.getSiblingDB("crudLabDB") : null;
const database = targetDb || db;

print("\n========================================================");
print("   MongoDB CRUD Lab: CREATE Operations (Data Seeding)");
print("========================================================\n");

print("Dropping previous 'products' collection...");
database.products.drop();

print("Inserting 50 product documents using insertOne()...");

for (let i = 1; i <= 50; i++) {
    database.products.insertOne({
        productId: i,
        productName: "Product " + i,
        category:
            i % 5 === 0 ? "Laptop" :
            i % 5 === 1 ? "Mobile" :
            i % 5 === 2 ? "Headphones" :
            i % 5 === 3 ? "Keyboard" :
                          "Mouse",

        brand:
            i % 3 === 0 ? "Dell" :
            i % 3 === 1 ? "Samsung" :
                          "HP",

        price: 1000 + (i * 500),

        stock: 10 + i,

        rating: 3 + ((i % 3) * 0.5),

        inStock: i % 4 !== 0,

        tags: [
            "electronics",
            i % 2 === 0 ? "featured" : "new"
        ],

        seller: {
            sellerId: 1000 + i,
            sellerName: "Seller " + i
        },

        createdAt: new Date()
    });
}

const totalCount = database.products.countDocuments();
print(`\n[SUCCESS] Successfully inserted ${totalCount} documents into 'crudLabDB.products'!`);

print("\n--- Sample Document (Product 1) ---");
const sample = database.products.findOne({ productId: 1 });
print(JSON.stringify(sample, null, 2));
print("\n[DONE] CREATE operations completed successfully.\n");
