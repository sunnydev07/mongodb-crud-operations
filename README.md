# MongoDB CRUD Operations Practical Lab & Test Suite

[![MongoDB](https://img.shields.io/badge/MongoDB-8.2%2B-green.svg)](https://www.mongodb.com/)
[![Mongosh](https://img.shields.io/badge/mongosh-2.12%2B-blue.svg)](https://www.mongodb.com/docs/mongodb-shell/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A complete, practical implementation and automated test suite for **MongoDB CRUD Operations** based on the curriculum in [`CRUD Operations.docx`](./CRUD%20Operations.docx).

This repository contains fully functional, modular scripts to demonstrate **Create**, **Read (Find)**, **Update (Single & Multiple with all operators)**, and **Delete** operations, validated with an automated test runner with 100% assertion coverage.

---

## Table of Contents

- [Overview & Architecture](#overview--architecture)
- [Repository Structure](#repository-structure)
- [Prerequisites & Setup](#prerequisites--setup)
- [Quick Start](#quick-start)
- [CRUD Operations Breakdown](#crud-operations-breakdown)
  - [1. CREATE Operations](#1-create-operations)
  - [2. READ (Find) Operations & Questions Answered](#2-read-find-operations--questions-answered)
  - [3. UPDATE Operations & Operators](#3-update-operations--operators)
  - [4. DELETE Operations & deleteMany vs drop](#4-delete-operations--deletemany-vs-drop)
- [Test Suite Results](#test-suite-results)
- [Deep Dive Documentation](#deep-dive-documentation)
- [License](#license)

---

## Overview & Architecture

CRUD operations are the foundational building blocks of MongoDB database interactions:

```
                  ┌───────────────────────────────┐
                  │       MongoDB Database        │
                  │         (crudLabDB)           │
                  └──────────────┬────────────────┘
                                 │
         ┌───────────────┬───────┴───────┬───────────────┐
         ▼               ▼               ▼               ▼
     [ CREATE ]      [ READ ]        [ UPDATE ]      [ DELETE ]
     insertOne       find()          updateOne       deleteOne
     insertMany      $gt, $lt        updateMany      deleteMany
                     $gte, $lte      $set, $inc      collection.drop()
                     nested dot      $push, $addToSet
```

---

## Repository Structure

```
mongodb-crud-operations/
├── .gitignore
├── package.json                       # NPM script definitions for tests
├── README.md                          # Main project guide & documentation
├── CRUD Operations.docx               # Original laboratory curriculum document
├── LICENSE                            # MIT License
├── scripts/
│   ├── 01_create_seed.js              # Inserts 50 realistic products with full schema
│   ├── 02_read_operations.js          # Solves all 6 query challenges from lab doc
│   ├── 03_update_single.js            # updateOne with $set, $inc, $unset, $push, $addToSet
│   ├── 04_update_many.js              # updateMany for bulk category and brand updates
│   ├── 05_delete_operations.js        # deleteOne, deleteMany, and deleteMany vs drop
│   └── 06_crud_runner.js              # Complete end-to-end test suite with assertions
├── docs/
│   ├── crud_operations_guide.md       # Comprehensive guide to MongoDB CRUD
│   ├── update_operators_reference.md  # Complete cheat sheet of MongoDB update operators
│   └── deleteMany_vs_drop.md          # Architectural breakdown of deleteMany vs drop
└── test/
    └── run_crud_tests.bat             # One-click Windows batch runner for all scripts
```

---

## Prerequisites & Setup

1. **MongoDB Server (v6.0 - v8.x)**
   Ensure `mongod` is running on default port `27017`:
   ```bash
   mongosh --eval "db.version()"
   ```

2. **MongoDB Shell (`mongosh`)**

3. **Node.js (Optional, v18+)**
   Enables `npm run <script>` execution shortcuts.

---

## Quick Start

### 1. Seed the Database (CREATE)
```bash
mongosh crudLabDB scripts/01_create_seed.js
# Or with npm:
npm run seed
```

### 2. Run the Full Automated Test Suite
```bash
mongosh crudLabDB scripts/06_crud_runner.js
# Or with npm:
npm run test:all
```

### 3. Run Individual Modules
```bash
mongosh crudLabDB scripts/02_read_operations.js     # READ
mongosh crudLabDB scripts/03_update_single.js       # UPDATE (Single)
mongosh crudLabDB scripts/04_update_many.js         # UPDATE (Multiple)
mongosh crudLabDB scripts/05_delete_operations.js   # DELETE
```

---

## CRUD Operations Breakdown

### 1. CREATE Operations
- **File**: [`scripts/01_create_seed.js`](./scripts/01_create_seed.js)
- Populates 50 products using `insertOne()` with fields:
  - `productId`: 1 to 50
  - `productName`: `"Product " + i`
  - `category`: `Laptop`, `Mobile`, `Headphones`, `Keyboard`, `Mouse` (via `i % 5`)
  - `brand`: `Dell`, `Samsung`, `HP` (via `i % 3`)
  - `price`: `1000 + (i * 500)`
  - `stock`: `10 + i`
  - `rating`: `3 + ((i % 3) * 0.5)`
  - `inStock`: `i % 4 !== 0`
  - `tags`: `["electronics", i % 2 === 0 ? "featured" : "new"]`
  - `seller`: `{ sellerId: 1000 + i, sellerName: "Seller " + i }`
  - `createdAt`: `new Date()`

---

### 2. READ (Find) Operations & Questions Answered
- **File**: [`scripts/02_read_operations.js`](./scripts/02_read_operations.js)

| # | Question from Lab Document | MongoDB Query | Result |
| :--- | :--- | :--- | :--- |
| **Q1** | Find all products belonging to the Laptop category? | `db.products.find({ category: "Laptop" })` | 10 products |
| **Q2** | Find all products that are currently in stock? | `db.products.find({ inStock: true })` | 38 products |
| **Q3** | Find products whose price is greater than 20000? | `db.products.find({ price: { $gt: 20000 } })` | 12 products |
| **Q4** | Find products whose price is less than 10000? | `db.products.find({ price: { $lt: 10000 } })` | 17 products |
| **Q5** | Find products whose price is between 10000 and 30000? | `db.products.find({ price: { $gte: 10000, $lte: 30000 } })` | 33 products |
| **Q6** | Find products sold by Seller 10? | `db.products.find({ "seller.sellerName": "Seller 10" })` | 1 product |

---

### 3. UPDATE Operations & Operators
- **Files**: [`scripts/03_update_single.js`](./scripts/03_update_single.js) & [`scripts/04_update_many.js`](./scripts/04_update_many.js)

#### Operator Summary Table

| Operator | Purpose | Syntax Example |
| :--- | :--- | :--- |
| **`$set`** | Adds or updates scalar & nested fields | `db.products.updateOne({ productId: 1 }, { $set: { price: 10000 } })` |
| **`$inc`** | Increments or decrements numeric values | `db.products.updateOne({ productId: 6 }, { $inc: { stock: 20 } })` |
| **`$unset`** | Removes a field from a document | `db.products.updateOne({ productId: 7 }, { $unset: { rating: "" } })` |
| **`$push`** | Appends an element to an array | `db.products.updateOne({ productId: 4 }, { $push: { tags: "sale" } })` |
| **`$addToSet`** | Adds to array without creating duplicates | `db.products.updateOne({ productId: 5 }, { $addToSet: { tags: "electronics" } })` |

#### Single Document Updates (`updateOne`):
1. **Modify single field**: Change price of Product 1 to 10000.
2. **Modify multiple fields**: Update price (15000) and stock (100) of Product 2.
3. **Modify nested field**: Change seller name of Product 3 to `"Premium Seller"`.
4. **Append to array**: Push `"sale"` tag to Product 4.
5. **Prevent duplicate tag**: Use `$addToSet` to add `"electronics"` to Product 5 without duplication.
6. **Increment numeric field**: Increase stock of Product 6 by 20.
7. **Decrement numeric field**: Decrease stock of Product 6 by 5 (`$inc: { stock: -5 }`).
8. **Combined multi-operator update**: Apply `$set`, `$inc`, and `$push` simultaneously on Product 10:
   ```javascript
   db.products.updateOne(
     { productId: 10 },
     {
       $set: { price: 25000, inStock: true },
       $inc: { stock: 10 },
       $push: { tags: "sale" }
     }
   );
   ```

#### Multi-Document Updates (`updateMany`):
1. Set `inStock: true` for all products in `"Laptop"` category.
2. Increase price of all `"Samsung"` products by 1000 (`$inc: { price: 1000 }`).

---

### 4. DELETE Operations & deleteMany vs drop
- **File**: [`scripts/05_delete_operations.js`](./scripts/05_delete_operations.js)

1. **Delete single product**:
   ```javascript
   db.products.deleteOne({ productId: 10 });
   ```
2. **Delete by category**:
   ```javascript
   db.products.deleteMany({ category: "Laptop" });
   ```
3. **Delete by price threshold**:
   ```javascript
   db.products.deleteMany({ price: { $gt: 30000 } });
   ```
4. **Delete all documents without deleting collection**:
   ```javascript
   db.products.deleteMany({});
   ```

#### Critical Difference: `deleteMany({})` vs `drop()`

| Feature | `db.products.deleteMany({})` | `db.products.drop()` |
| :--- | :--- | :--- |
| **Documents** | Deleted | Deleted |
| **Collection Exists After?** | **YES** | **NO** |
| **Indexes Preserved?** | **YES** | **NO** |
| **Performance** | $O(N)$ row-by-row deletion | $O(1)$ catalog metadata drop |

---

## Test Suite Results

Output from running [`scripts/06_crud_runner.js`](./scripts/06_crud_runner.js):

```
=========================================================================================
                     MONGODB CRUD OPERATIONS COMPLETE TEST SUITE
=========================================================================================

>>> STAGE 1: CREATE (Insert 50 documents)
 [PASS] (1/1) Inserted exactly 50 products

>>> STAGE 2: READ (Find & Query Operators)
 [PASS] (2/2) Found 10 Laptops (i % 5 === 0)
 [PASS] (3/3) Found 38 products in stock (i % 4 !== 0)
 [PASS] (4/4) Found 12 products with price > 20000
 [PASS] (5/5) Found 17 products with price < 10000
 [PASS] (6/6) Found 33 products with price between 10000 and 30000
 [PASS] (7/7) Queried nested sellerName 'Seller 10'

>>> STAGE 3: UPDATE ($set, $inc, $push, $addToSet, updateOne, updateMany)
 [PASS] (8/8) updateOne ($set price to 10000 on Product 1)
 [PASS] (9/9) updateOne ($set multiple fields on Product 2)
 [PASS] (10/10) updateOne ($set nested seller.sellerName)
 [PASS] (11/11) updateOne ($push 'sale' to tags array)
 [PASS] (12/12) updateOne ($addToSet prevented duplicate 'electronics' tag)
 [PASS] (13/13) updateOne ($inc +20 stock)
 [PASS] (14/14) updateOne ($inc -5 stock)
 [PASS] (15/15) updateMany ($set inStock=true for all Laptops)
 [PASS] (16/16) updateMany ($inc price +1000 for all Samsung products)

>>> STAGE 4: DELETE (deleteOne, deleteMany, drop)
 [PASS] (17/17) deleteOne (Deleted Product 10)
 [PASS] (18/18) deleteMany (Deleted all Laptops)
 [PASS] (19/19) deleteMany (Deleted all products with price > 30000)
 [PASS] (20/20) deleteMany({}) emptied all documents
 [PASS] (21/21) deleteMany({}) preserved collection metadata
 [PASS] (22/22) drop() successfully removed collection from database

=========================================================================================
   ALL CRUD TESTS FINISHED: 22 / 22 ASSERTIONS PASSED! (100% SUCCESS)
=========================================================================================
```

---

## Deep Dive Documentation

- [Comprehensive CRUD Operations Guide](./docs/crud_operations_guide.md)
- [Update Operators Reference & Cheat Sheet](./docs/update_operators_reference.md)
- [Architectural Analysis: deleteMany vs drop](./docs/deleteMany_vs_drop.md)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
