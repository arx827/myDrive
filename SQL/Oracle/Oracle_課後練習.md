# Oracle 課後練習

## 第 1 章 基本的 SQL SELECT語句
  - ### 1. 對於日期型數據，做 `*`、`/` 運算不合法。

  - ### 2. 包含空值的數學表達式的值都為空值。

  - ### 3. 別名使用雙引號。

  - ### 4. Oracle 中，連接字符串使用 `||`，而不是 java 中的 `+`。

  - ### 5. 日期和字符只能在單引號中出現，輸出 last_name`s email is email
    ```SQL
    SELECT last_name || ' `s email is ' || email EMAIL
    FROM employees;
    ```

  - ### 6. DISTINCT 關鍵字，以下語法錯誤
    ```SQL
    SELECT last_name, DISTINCT department_id
    FROM employees
    ```

---

## 第 2 章 過濾 和 排序數據
  - ### 7. WHERE 子句緊隨 FROM 子句

  - ### 8. 查詢 last_name 為 'King' 的員工信息
    - #### 錯誤1：King 沒有加上 單引號
      ```SQL
      SELECT first_name, last_name
      FROM employees
      WHERE last_name = King;
      ```
    - #### 錯誤2：在單引號中的值區分大小寫
      ```SQL
      SELECT first_name, last_name
      FROM employees
      WHERE last_name = 'king';
      ```
    - #### 正確：
      ```SQL
      SELECT first_name, last_name
      FROM employees
      WHERE last_name = 'King';
      ```

  - ### 9. 查詢 1998-4-24 來公司的員工有哪些？
    注意：日期必須要放在單引號中，且必須是指定的格式
    ```SQL
    SELECT last_name, hire_date
    FROM employees
    WHERE hire_date = '24-4月-1998';

    -- 也可使用 WHERE to_char(hire_date, 'yyyy-mm-dd') = '1998-04-24'
    ```

  - ### 10. 查詢工資在 5000 ~ 10000 之間的員工訊息。
    - #### 1. 使用 AND
      ```SQL
      SELECT *
      FROM employees
      WHERE salary >= 5000 AND salary <= 10000;
      ```

    - #### 2. 使用 BETWEEN ... AND ...，注意：包含邊界！！
      ```SQL
      SELECT *
      FROM employees
      WHERE salary BETWEEN 5000 AND 10000;
      ```

  - ### 11. 查詢工資等於 6000, 7000, 8000, 9000, 10000 的員工信息
    - #### 1. 使用 OR
      ```SQL
      SELECT *
      FROM employees
      WHERE salary = 6000 OR salary = 7000 OR salary = 8000 OR salary = 9000 OR salary = 10000;
      ```

    - #### 2. 使用 IN
      ```SQL
      SELECT *
      FROM employees
      WHERE salary in (6000, 7000, 8000, 9000, 10000);
      ```

  - ### 12. 查詢 last_name 中有 'o' 字符的所有員工信息。
    ```SQL
    SELECT *
    FROM employees
    WHERE last_name LIKE '%o%';
    ```

  - ### 13. 查詢 last_name 中第二個字是 'o' 的所有員工信息。
    ```SQL
    SELECT *
    FROM employees
    WHERE last_name LIKE '_o%';
    ```

  - ### 14. 查詢 last_name 中含有 '_' 字符的所有員工信息。
    - #### 1. 準備工作
      ```SQL
      UPDATE employees
      SET last_name = 'Jones_Tom'
      WHERE employee_id = 195;
      ```
    - #### 2. 使用 escape 說明轉譯字符
      ```SQL
      SELECT *
      FROM employees
      WHERE last_name LIKE '%\_%' ESCAPE '\';
      ```

  - ### 15. 查詢 commission_pct 字段為空的所有員工信息
    ```SQL
    SELECT last_name, commission_pct
    FROM employees
    WHERE commission_pct IS NULL;
    ```

  - ### 16. 查詢 commission_pct 字段不為空的所有員工信息
    ```SQL
    SELECT last_name, commission_pct
    FROM employees
    WHERE commission_pct IS NOT NULL;
    ```

  - ### 17. ORDER BY：
    - #### 1. 若查詢中有表達式運算，一般使用別名排序
    - #### 2. 若多個列排序：
      先按第一列排序，若第一列中有相同的，再按第二列排序。
      - 格式：
        `ORDER BY 一級排序列 ASC/DESC, 二級排序列 ASC/DESC;`

## 第 7 章 創建和管理表
  - ### 51. 利用子查詢創建表 myemp，該表中包含 employees 表的 employee_id(id), last_name(name), email 字段
    - 1. 創建表的同時複製 `employees` 對應的紀錄
      ```SQL
      CREATE TABLE myemp
      AS
        SELECT employee_id id, last_name name, email
        FROM employees;
      ```

    - 2. 創建表的同時，不包含 `employees` 中的紀錄，即創建一個空表
      ```SQL
      CREATE TABLE myemp
      AS
        SELECT employee_id id, last_name name, email
        FROM employees
      WHERE 1 = 2;
      ```

  - ### 52. 對現有的表進行修改操作
    - 1. 添加一個新欄位
      ```SQL
      ALTER TABLE myemp
      ADD( age number(3) );
      ```

    - 2. 修改現有欄位的類型
      ```SQL
      ALTER TABLE myemp
      MODIFY(name varchar2(30));
      ```

    - 3. 修改現有欄位的名字
      ```SQL
      ALTER TABLE myemp
      RENAME COLUMN sal TO salary;
      ```

    - 4. 刪除現有的欄位
      ```SQL
      ALTER TABLE myemp
      DROP COLUMN age;
      ```

  - ### 53. 清空表(截斷：TRUNCATE)，不能回滾！！
    ```SQL
    TRUNCATE TABLE myemp;
    ```

  - ### 54.
    - 1. 創建一個表，該表和 employees 有相同的表結構，但為空表：
      ```SQL
      CREATE TABLE emp2
      AS
        SELECT *
        FROM employees
      WHERE 1 = 2;
      ```
    
    - 2. 把 employees 表中 80 號部門的所有數據複製到 emp2 表中：
      ```SQL
      INSERT INTO emp2
      SELECT *
      FROM employees
      WHERE department_id = 80;
      ```