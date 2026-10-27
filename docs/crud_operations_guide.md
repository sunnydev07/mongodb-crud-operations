# Comprehensive MongoDB CRUD Operations Guide

This guide provides a structured, in-depth explanation of all fundamental CRUD (Create, Read, Update, Delete) operations in MongoDB, based on the curriculum in [`CRUD Operations.docx`](../CRUD%20Operations.docx).

---

## 1. CREATE Operations (Insertion)

MongoDB stores records as BSON (Binary JSON) documents within collections.

### Methods
- `insertOne(doc)`: Inserts a single document into the collection.
- `insertMany([doc1, doc2, ...])`: Inserts multiple documents in batch mode.

### Schema Example from Lab
Each document contains:
```javascript
{
  productId: 1,
  productName: "Product 1",
  category: "Mobile",
  brand: "Samsung",
  price: 1500,
  stock: 11,
  rating: 3.5,
  inStock: true,
  tags: ["electronics", "new"],
  seller: {
    sellerId: 1001,
    sellerName: "Seller 1"
  },
  createdAt: ISODate("2026-10-27T08:00:00Z")
}
```

---

## 2. READ Operations (Find & Filter)

MongoDB's `find()` method retrieves documents matching a filter predicate.

### Comparison Operators

| Operator | Meaning | Example |
| :--- | :--- | :--- |
| `$eq` | Equal to (default) | `{ category: "Laptop" }` |
| `$ne` | Not equal to | `{ brand: { $ne: "Dell" } }` |
| `$gt` | Greater than | `{ price: { $gt: 20000 } }` |
| `$gte` | Greater than or equal | `{ price: { $gte: 10000 } }` |
| `$lt` | Less than | `{ price: { $lt: 10000 } }` |
| `$lte` | Less than or equal | `{ price: { $lte: 30000 } }` |
| `$in` | In an array of values | `{ brand: { $in: ["Dell", "HP"] } }` |
| `$nin` | Not in array | `{ category: { $nin: ["Mouse"] } }` |

### Range Queries
To find values within an interval, combine `$gte` and `$lte`:
```javascript
db.products.find({
  price: { $gte: 10000, $lte: 30000 }
});
```

### Querying Embedded / Nested Documents
Use dot notation with quotes to query fields inside subdocuments:
```javascript
db.products.find({
  "seller.sellerName": "Seller 10"
});
```

---

## 3. UPDATE Operations (Modification)

MongoDB updates require explicit update operators (e.g., `$set`, `$inc`) to prevent accidentally replacing the entire document.

### Methods
- `updateOne(filter, update, options)`: Updates the first matching document.
- `updateMany(filter, update, options)`: Updates all matching documents.
- `replaceOne(filter, replacement, options)`: Replaces the entire document except `_id`.

### Field Update Operators
- **`$set`**: Modifies an existing field or creates it if it doesn't exist:
  ```javascript
  db.products.updateOne({ productId: 1 }, { $set: { price: 10000 } });
  ```
- **`$inc`**: Increments/decrements numeric fields:
  ```javascript
  db.products.updateOne({ productId: 6 }, { $inc: { stock: 20 } });  // +20
  db.products.updateOne({ productId: 6 }, { $inc: { stock: -5 } });  // -5
  ```
- **`$unset`**: Deletes a field from documents:
  ```javascript
  db.products.updateOne({ productId: 7 }, { $unset: { rating: "" } });
  ```

### Array Update Operators
- **`$push`**: Appends an item to an array (duplicates allowed):
  ```javascript
  db.products.updateOne({ productId: 4 }, { $push: { tags: "sale" } });
  ```
- **`$addToSet`**: Appends an item only if it does not already exist (prevents duplicates):
  ```javascript
  db.products.updateOne({ productId: 5 }, { $addToSet: { tags: "electronics" } });
  ```

---

## 4. DELETE Operations (Removal)

### Methods
- `deleteOne(filter)`: Deletes the first document matching the filter.
- `deleteMany(filter)`: Deletes all documents matching the filter.
- `drop()`: Deletes the entire collection.

### Targeted Deletions
```javascript
// Delete by ID
db.products.deleteOne({ productId: 10 });

// Delete by Category
db.products.deleteMany({ category: "Laptop" });

// Delete by Condition
db.products.deleteMany({ price: { $gt: 30000 } });
```
