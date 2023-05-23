# Oracle 過濾和排序數據
## 目標
  通過本章學習，您將可以
  - 在查詢中過濾行
  - 在查詢中對行進行排序

## 過濾
  - 使用 `WHERE 子句`，將不滿足條件的行過濾掉。
    ```SQL
    SELECT * | {[DISTINCT] column|expression [alias], ...}
    FROM table
    [WHERE condition(s)];
    ```
  
  - `WHERE 子句` 緊隨 `FROM 子句`。
  
## 字符和日期
  - 字符和日期要包含在單引號中。
  - 字符大小寫敏感，日期格式敏感。
  - 默認的日期格式是 DD-MON月-RR。

  ```SQL
  SELECT last_name, job_id, department_id
  FROM employees
  WHERE last_name = 'Whalen';
  ```

  ```SQL
  SELECT last_name, hire_date, department_id
  FROM employees
  WHERE hire_date = '7-6月-1994';
  ```

## 比較運算
  | 操作符  | 含義               |
  |:------:|-------------------|
  |   =    | 等於(不是==)        |
  |   >    | 大於               |
  |   >=   | 大於、等於          |
  |   <    | 小於               |
  |   <=   | 小於、等於          |
  |   <>   | 不等於(也可以是!=)   |

## 比較運算
  ```SQL
  SELECT last_name, salary
  FROM employees
  WHERE salary <= 3000;
  ```

## 其他比較運算
  | 操作符               | 含義                   |
  |---------------------|-----------------------|
  | `BETWEEN ...AND...` | 在兩個值之間 (包含邊界)  |
  | `IN(set)`           | 等於值列表中的一個       |
  | `LIKE`              | 模糊查詢               |
  | `IS NULL`           | 空值                   |

## BETWEEN
  使用 `BETWEEN` 運算來顯示在一個區間內的值。
  ```SQL
  SELECT last_name, salary
  FROM employees
  WHERE salary BETWEEN 2500 AND 3500;
  ```

## IN
  使用 `IN` 運算顯示列表中的值。
  ```SQL
  SELECT employee_id, last_name, salary, manager_id
  FROM employees
  WHERE manager_id IN (100, 101, 201);
  ```

## LIKE
  - 使用 `LIKE` 運算選擇類似的值。
  - 選擇條件可以包含字符或數字：
    - `%` 代表零個或多個字符(任意個字符)
    - `_` 代表一個字符。

  ```SQL
  SELECT first_name
  FROM employees
  WHERE first_name LIKE 'S%';
  ```

  - `%` 和 `_` 可以同時使用。
    ```SQL
    SELECT last_name
    FROM employees
    WHERE last_name LIKE '_o%';
    ```

  - 可以使用 `ESCAPE` 標識符 選擇 `%` 和 `_` 符號。

## ESCAPE
  - 迴避特殊符號的：使用轉義符。例如：將 `%` 轉為 `\%` 、`_` 轉為`\_`，然後再加上 `ESCAPE '\'` 即可。
    ```SQL
    SELECT job_id
    FROM jobs
    WHERE job_id LIKE 'IT\_%' ESCAPE '\';
    ```

## 邏輯運算
  | 操作符  | 含義    |
  |--------|--------|
  | `AND`  | 邏輯 並 |
  | `OR`   | 邏輯 或 |
  | `NOT`  | 邏輯 否 |

## AND
  `AND` 要求 `並` 的關係為真(TRUE)。
  ```SQL
  SELECT employee_id, last_name, job_id, salary
  FROM employees
  WHERE salary >= 10000
        AND job_id LIKE '%MAN%';
  ```

## OR
  `OR` 要求 `或` 關係為真(TRUE)。
  ```SQL
  SELECT employee_id, last_name, job_id, salary
  FROM employees
  WHERE salary >= 10000
        OR job_id LIKE '%MAN%';
  ```

## NOT
  ```SQL
  SELECT last_name, job_id
  FROM employees
  WHERE job_id
        NOT IN ('IT_PROG', 'ST_CLERK', 'SA_REP');
  ```

## 優先級
  | 優先級  |                               |
  |:------:|-------------------------------|
  |   1    | 算術運算符                      |
  |   2    | 連接符                         |
  |   3    | 比較符                         |
  |   4    | IS [NOT] NULL, LIKE, [NOT] IN |
  |   5    | [NOT] BETWEEN                 |
  |   6    | NOT                           |
  |   7    | AND                           |
  |   8    | OR                            |
  - 可以使用括號改變優先級順序

## ORDER BY 子句
  - 使用 `ORDER BY 子句` 排序
    - `ASC` (ascend)：升序
    - `DESC` (descend)：降序
  - `ORDER BY 子句` 在 `SELECT 語句` 的結尾。
  ```SQL
  SELECT last_name, job_id, department_id, hire_date
  FROM employees
  ORDER BY hire_date;
  ```

## 降序排序
  ```SQL
  SELECT last_name, job_id, department_id, hire_date
  FROM employees
  ORDER BY hire_date DESC;
  ```

## 按別名排序
  ```SQL
  SELECT employee_id, last_name, salary*12 AS annsal
  FROM employees
  ORDER BY annsal;
  ```

## 多個列排序
  - 按照 `ORDER BY` 列表的順序排序
    ```SQL
    SELECT last_name, department_id, salary
    FROM employees
    ORDER BY department_id, salary DESC;
    ```
  - 可以使用不在 `SELECT` 列表中的列排序。(前提是有在表中的欄位)

## 總結
  通過本課，您應該可以完成：
  - 使用 `WHERE 子句` 過濾數據
    - 使用比較運算
    - 使用 BETWEEN `AND`, `IN`, `LIKE` 和 `NULL` 運算
    - 使用邏輯運算符 `AND`, `OR` 和 `NOT`
  - 使用 `ORDER BY 子句` 進行排序
    ```SQL
    SELECT    *|{[DISTINCT] column|expression [alias], ...}
    FROM      table
    [WHERE    condition(s)]
    [ORDER BY {column, expr, alias} [ASC | DESC]];
    ```

## 測試
  - ### 1. 查詢工資大於 12000 的員工姓名和工資
    - 練習
      ```SQL
      SELECT last_name, salary
      FROM employees
      WHERE salary > 12000;
      ```

  - ### 2. 查詢員工號為 176 的員工的姓名和部門號
    - 練習
      ```SQL
      SELECT last_name, department_id
      FROM employees
      WHERE department_id = 176;
      ```

  - ### 3. 選擇工資不在 5000 到 12000 的員工的姓名和工資
    - 練習
      ```SQL
      SELECT last_name, salary
      FROM employees
      -- WHERE salary < 5000 OR salary > 12000;
      WHERE salary NOT BETWEEN 5000 AND 12000;
      ```

  - ### 4. 選擇雇用時間在 1998-02-01 到 1998-05-01 之間的員工姓名、job_id 和 雇用時間。
    - 練習
      ```SQL
      SELECT last_name, job_id, hire_date
      FROM employees
      -- WHERE hire_date BETWEEN '1-2月-1998' AND '1-5月-1998';
      WHERE to_char(hire_date, 'yyyy-mm-dd') BETWEEN '1998-02-01' AND '1998-05-01';
      ```

  - ### 5. 選擇在 20 或 50 號部門工作的 員工姓名 和 部門號
    - 練習
      ```SQL
      SELECT last_name, department_id
      FROM employees
      -- WHERE department_id = 20 or department_id = 50;
      WHERE department_id in (20, 50);
      ```

  - ### 6. 選擇在 1994 年雇用的員工的 姓名 和 雇用時間
    - 練習
      ```SQL
      SELECT last_name, hire_date
      FROM employees
      -- WHERE hire_date like '%94';
      WHERE to_char(hire_date, 'yyyy') = '1994';
      ```

  - ### 7. 選擇公司中沒有管理者的 員工姓名 及 job_id
    - 練習
      ```SQL
      SELECT last_name, job_id
      FROM employees
      WHERE manager_id IS NULL;
      ```

  - ### 8. 選擇公司中有獎金的員工 姓名、工資 和 獎金級別
    - 練習
      ```SQL
      SELECT last_name, salary, commission_pct
      FROM employees
      WHERE manager_id IS NOT NULL;
      ```

  - ### 9. 選擇員工姓名的第三個字母是 a 的員工姓名
    - 練習
      ```SQL
      SELECT last_name
      FROM employees
      WHERE last_name LIKE '__a%';
      ```

  - ### 10. 選擇性名中有字母a和e的 員工姓名
    - 練習
      ```SQL
      SELECT last_name
      FROM employees
      WHERE last_name LIKE '%a%e%' or '%e%a%';
      ```