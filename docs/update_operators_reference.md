# MongoDB Update Operators Reference & Cheat Sheet

This reference details the core update operators available in MongoDB, their syntax, behavioral differences, and examples.

---

## Field Operators

### 1. `$set`
- **Purpose**: Sets the value of a field. If the field does not exist, MongoDB creates it.
- **Syntax**: `{ $set: { <field1>: <value1>, ... } }`
- **Example**:
  ```javascript
  db.products.updateOne(
    { productId: 1 },
    { $set: { price: 10000, inStock: true } }
  );
  ```

### 2. `$inc`
- **Purpose**: Increments a numeric field by a specified value. To decrement, use a negative number.
- **Syntax**: `{ $inc: { <field1>: <amount1>, ... } }`
- **Example**:
  ```javascript
  // Increase stock by 20
  db.products.updateOne({ productId: 6 }, { $inc: { stock: 20 } });

  // Decrease stock by 5
  db.products.updateOne({ productId: 6 }, { $inc: { stock: -5 } });
  ```

### 3. `$unset`
- **Purpose**: Deletes the specified field from a document. The value specified (e.g. `""` or `1`) does not affect the operation.
- **Syntax**: `{ $unset: { <field1>: "", ... } }`
- **Example**:
  ```javascript
  db.products.updateOne({ productId: 7 }, { $unset: { rating: "" } });
  ```

### 4. `$min` and `$max`
- **Purpose**: Only updates the field if the specified value is less than (`$min`) or greater than (`$max`) the current value.
- **Syntax**: `{ $min: { <field>: <value> } }`, `{ $max: { <field>: <value> } }`

### 5. `$rename`
- **Purpose**: Renames a field.
- **Syntax**: `{ $rename: { <oldField>: <newField> } }`

---

## Array Operators

### 1. `$push` vs `$addToSet`

| Feature | `$push` | `$addToSet` |
| :--- | :--- | :--- |
| **Duplicates Allowed?** | Yes | No |
| **Behavior if Value Exists** | Appends duplicate item | Silently skips (no change) |
| **Ideal For** | Logs, histories, transaction feeds | Unique tags, categories, user roles |

#### `$push` Example:
```javascript
// Adds "sale" tag even if "sale" already exists in the array
db.products.updateOne(
  { productId: 4 },
  { $push: { tags: "sale" } }
);
```

#### `$addToSet` Example:
```javascript
// Adds "electronics" ONLY if it does not already exist
db.products.updateOne(
  { productId: 5 },
  { $addToSet: { tags: "electronics" } }
);
```

### 2. `$pull` and `$pullAll`
- **Purpose**: Removes elements from an array matching a value or condition.
- **Example**:
  ```javascript
  db.products.updateOne(
    { productId: 4 },
    { $pull: { tags: "sale" } }
  );
  ```

---

## Multi-Operator Update Example

MongoDB allows combining multiple different update operators within a single `updateOne()` or `updateMany()` statement:

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
> [!IMPORTANT]
> You cannot specify the same field in multiple operator clauses (e.g., cannot `$set` and `$inc` the same field in one call).
