@echo off
REM ========================================================
REM   MongoDB CRUD Lab Test Suite Runner
REM ========================================================

echo ========================================================
echo   Running MongoDB CRUD Operations Test Suite
echo ========================================================

echo.
echo [1/6] Running CREATE: Seeding 50 products...
mongosh crudLabDB scripts/01_create_seed.js

echo.
echo [2/6] Running READ: Testing find queries and operators...
mongosh crudLabDB scripts/02_read_operations.js

echo.
echo [3/6] Running UPDATE (Single): Testing updateOne and operators...
mongosh crudLabDB scripts/03_update_single.js

echo.
echo [4/6] Running UPDATE (Multiple): Testing updateMany...
mongosh crudLabDB scripts/04_update_many.js

echo.
echo [5/6] Running DELETE: Testing deleteOne, deleteMany, and drop...
mongosh crudLabDB scripts/05_delete_operations.js

echo.
echo [6/6] Running Complete Automated Test Suite with Assertions...
mongosh crudLabDB scripts/06_crud_runner.js

echo.
echo ========================================================
echo   All MongoDB CRUD Tests Completed Successfully!
echo ========================================================
pause
