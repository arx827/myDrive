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

## 第 3 章 單行函數
  - ### 18. 打印出 "2009年10月14日 9:25:40" 格式的當前系統的日期和時間。
    ```sql
    SELECT to_char(sysdate, 'YYYY"年"MM"月"DD"日 HH:MI:SS')
    FROM dual
    ```
    - 注意：使用雙引號，向日期中，添加字符

  - ### 19. 格式化數字：1234567.89 為 1,234,567.89
    ```sql
    SELECT to_char(1234567.89, '999,999,999.99')
    FROM dual
    ```

  - ### 20. 字符串轉為數字時
    - #### 1. 若字符串中沒有特殊字符，可以進行隱式轉換：
      ```sql
      SELECT '1234567.89' + 100
      FROM dual
      ```

    - #### 2. 若字符串中有特殊字符，例如 '1,234,567.89'，則無法進行隱式轉換，需要使用 `to_number()` 來完成
      ```sql
      SELECT to_number('1,234,567.89', '999,999,999.99') + 100
      FROM dual
      ```

  - ### 21. 對於把日期作為查詢條件的查詢，一般都使用 `to_date()`，把一個字符串轉為日期，這樣可以不必關注日期格式
    ```sql
    SELECT last_name, hire_date
    FROM employees
    WHERE hire_date = to_date('1998-5-23', 'yyyy-mm-dd')
    -- WHERE to_char(hire_date, 'yyyy-mm-dd') = '1998-5-23'
    ```

  - ### 22. 轉換函數
    - #### to_char()
    - #### to_number()
    - #### to_date()

  - ### 23. 查詢每個倒數第 2 天入職的員工的信息
    ```sql
    SELECT last_name, hire_date
    FROM employees
    WHERE hire_date = last_day(hire_date) - 1
    ```

  - ### 24. 計算公司員工的年薪
    ```sql
    -- 錯誤寫法：因為空值計算的結果還是空值
    SELECT last_name, salary * 12 * (1 + commission_pct) year_sal
    FROM employees

    -- 正確寫法
    SELECT last_name, salary * 12 * (1 + nvl(commission_pct)) year_sal
    FROM employees
    ```

  - ### 25. 查詢部門號為 10, 20, 30 的員工信息，若部門號為 10，則打印其工資的 1.1 倍，20 號部門，則打印其工資的 1.2 倍，30 號部門，則打印其工資的 1.3 倍。
    ```sql
    -- 使用 case-when-than-else-end
    SELECT last_name, department_id, salary,
      CASE department_id WHEN 10 THEN salary * 1.1
                         WHEN 20 THEN salary * 1.2
                         WHEN 30 THEN salary * 1.3
      END new_sal
    FROM employees
    WHERE department_id in (10, 20, 30)

    -- 使用 decode
    SELECT last_name, department_id, salary, decode(department_id, 10, salary * 1.1,
                                                                   20, salary * 1.2,
                                                                   30, salary * 1.3
                                                    ) new_sal
    FROM eployees
    WHERE department_id in (10, 20, 30)
    ```

## 第 4 章 多表查詢
  - ### 26. 多表連接查詢時，若兩個表有同名的列，必須使用表的別名進行引用，否則出錯！

  - ### 27. 查詢出公司員工的 `last_name`、`department_name`、`city`
    ```sql
    SELECT last_name, department_name, city
    FROM departments d, employees e, locations l
    WHERE d.department_id = e.department_id and d.location_id = l.location_id
    ```
  
  - ### 28. 查詢出 last_name 為 'Chen' 的 manager 的信息。(員工的 manager_id 是某員工的 employee_id)
    - 0. 例如：老張的員工號為："1001"，我的員工號為 "1002"，我的 manager_id 為 "1001" --- 我的 manager 是 "老張"。
    - 1. 通過兩條 sql 查詢：
      ```sql
      SELECT manager_id
      FROM employees
      WHERE lower(last_name) = "chen"   -- 返回的結果為 108

      SELECT *
      FROM employees
      WHERE employee_id = 108
      ```
    - 2. 通過一條 SQL 查詢 (自連接)：
      ```sql
      SELECT m.*
      FROM employees e, employees m
      WHERE e.manager_id = m.employee_id and e.last_name = 'Chen'
      ```
    - 3. 通過一條 SQL 查詢 (子查詢)：
      ```sql
      SELECT *
      FROM employees
      WHERE employee_id = (
        SELECT manager_id
        FROM employees
        WHERE last_name = 'Chen'
      )
      ```
  
  - ### 29. 查詢每個員工的 last_name 和 GRADE_LEVEL(在 JOB_GRADES 表中)， ---- 非等值連接
    ```sql
    SELECT last_name, salary, grade_level, lowest_sal, highest_sal
    FROM employees e, job_grades j
    WHERE e.salary >= j.lowest_sal and e.salary <= j.highest_sal
    ```

  - ### 30. 左外連接和右外連接
    ```sql
    SELECT last_name, e.department_id, department_name
    FROM employees e, departments d
    WHERE e.department_id = d.depㄇ ㄍ 嗎跟artment_id(+)

    SELECT last_name, d.department_id, department_name
    FROM employees e, departments d
    WHERE e.department_id(+) = d.department_id
    ```
    - 理解 `(+)` 的位置：
      以左外連接為例，因為左表需要返回更多的紀錄，右表就需要 `加上` 更多的紀錄，所以在右表的鏈接條件上加上 `(+)`

    - 注意：
      - 1. 兩邊都加上 `(+)` 符號，會發生語法錯誤！
      - 2. 這種語法為 `Oracle` 所獨有，不能在其他數據庫中使用。

  - ### 31. SQL 99 連接 Employees 表和 Departments 表
    - 1. 
      ```sql
      SELECT *
      FROM employees join departments
      using(department_id)
      ```
      缺點：要求兩個表中，必須有一樣的列名。

    - 2.
      ```sql
      SELECT *
      FROM employees e join departmeents d
      on e.department_id = d.department_id
      ```

    - 3. 多表連接
      ```sql
      SELECT e.last_name, d.department_name, l.city
      FROM employees e join departments d
      on e.department_id = d.department_id
      join locations l
      on d.location_id = l.location_id
      ```

  - ### 32. SQL 99 的 左外連接、右外連接、滿外連接
    - 1. 左外連接
      ```sql
      SELECT last_name, department_name
      from employees e left outer join departments d
      on e.department_id = d.department_id
      ```
    - 2. 右外連接
      ```sql
      SELECT last_name, department_name
      FROM employees e right join departments d
      on e.department_id = d.department_id;
      ```

    - 3. 滿外連接
      ```sql
      SELECT last_name, department_name
      FROM employees e full join departments d
      on e.department_id = d.dartment_id;
      ```

## 第 5 章 分組函數
  - ### 33. 查詢 employees 表中有多少個部門
    ```sql
    SELECT COUNT(DISTINCT department_id)
    FROM employees
    ```

  - ### 34. 查詢全公司獎金基數的平均值 (沒有獎金的人按 0 計算)
    ```sql
    SELECT AVG(NVL(commission_pct, 0))
    FROM employees
    ```

  - ### 35. 查詢各個部門的平均工資
    ```sql
    -- 錯誤：AVG(salarfg) 返回公司平均工資，只有一個值；而 department_id 有多個值，無法匹配返回

    select department_id, AVG(salary)
    FROM employees

    ** 在 SELECT 列表中所有未包含在組函數中的列都應該包含在 `GROUP BY` 子句中

    -- 正確：按 department_id 進行分組
    SELECT department_id, AVG(salary)
    FROM employees
    GROUP BY department_id
    ```

  - ### 36. Toronto 這個城市的員工的平均工資
    ```sql
    SELECT AVG(salary)
    FROM employees e JOIN departments d
    ON e.department_id = d.department_id
    JOIN locations l
    ON d.location_id = l.location_id
    WHERE city = 'Toronto'
    ```

  - ### 37.(有員工的城市)各個城市的平均工資
    ```sql
    SELECT city, avg(salary)
    FROM employees e JOIN departments d
    ON e.department_id = d.department_id
    JOIN location_id = l.location_id
    GROUP BY city
    ```

  - ### 38. 查詢平均工資高於 8000 的 部門 id 和 它的平均工資
    ```sql
    SELECT department_id, AVG(salary)
    FROM employees e
    GROUP BY department_id
    HAVING AVG(salary) > 8000
    ```

  - ### 39. 查詢平均工資高於 6000 的 job_title 有哪些
    ```sql
    SELECT job_title, AVG(salary)
    FROM employees e join jobs j
    ON e.job_id = j.job_id
    GROUP BY job_title
    HAVING AVG(salary) > 6000
    ```

## 第 6 章 子查詢
  - ### 40. 誰的工資比 Abel 高？
    - 1. 寫兩條 SQL 語句
      ```SQL
      SELECT salary
      FROM employees
      WHERE last_name = 'Abel'

      -- 返回值為 11000

      SELECT last_name, salary
      FROM employees
      WHERE salary > 11000
      ```
    - 2. 使用子查詢 -- 一條SQL語句
      ```SQL
      SELECT last_name, salary
      FROM employees
      WHERE salary > (
        SELECT salary
        FROM employees
        WHERE last_name = 'Abel'
      )
      ```
    - 子查詢注意：
      - 1. 子查詢要包含在括號內
      - 2. 將子查詢放在比較條件的內側

  - ### 41. 查詢工資最低的員工信息：last_name、salary
    ```SQL
    SELECT last_name, salary
    FROM employees
    WHERE salary = (SELECT min(salary)
                    FROM employees)
    ```

  - ### 42. 查詢平均工資最低的部門信息
    - #### 拆解
      - 1. 查詢公司中各部門的平均工資是多少
      - 2. 查詢公司中各部門的平均工資中最少
      - 3. 哪個部門的平均工資 = 2. 的結果
      - 4. 查詢此部門的部門信息
        ```SQL
        SELECT *
        FROM departments
        WHERE department_id = (
              SELECT department_id
              FROM employees
              HAVING AVG(salary) = (SELECT MIN(AVG(salary))
                                  FROM employees
                                  GROUP BY department_id)
              GROUP BY department_id
        )
        ```

  - ### 43. 查詢平均工資最低的部門信息和該部門的平均工資
    ```SQL
    SELECT *, (SELECT AVG(salary) FROM employees WHERE department_id = d.department_id) 
    FROM departments d
    WHERE department_id = (
          SELECT department_id
          FROM employees
          HAVING AVG(salary) = (SELECT MIN(AVG(salary))
                              FROM employees
                              GROUP BY department_id)
          GROUP BY department_id
    )
    ```

  - ### 44. 查詢平均工資最高的 job 信息
    - #### 拆解
      - 1. 按 job 來分組，查詢最高的平均工資是多少
      - 2. 查詢得到哪個 job_id 的平均工資等於 1. 得到的值
      - 3. 從 jobs 表中返回 job_id 的對應項的信息
      ```SQL
      SELECT *
      FROM jobs
      WHERE job_id in (
        SELECT job_id
        FROM employees
        HAVING AVG(salary) = (
          SELECT MAX(AVG(salary))
          FROM employees
          GROUP BY job_id
        )
        GROUP BY job_id
      )
      ```

  - ### 45. 查詢平均工資高於公司平均工資的部門有哪些？
    ```SQL
    SELECT department_id, AVG(salary)
    FROM employees
    GROUP BY department_id
    HAVING AVG(salary) > (
      SELECT AVG(salary)
      FROM employees
    )
    ```

  - ### 46. 查詢出公司中所有 manager 的詳細信息
    ```SQL
    SELECT *
    FROM employees
    WHERE employee_id in (
      SELECT manager_id
      FROM employees
    )
    ```

  - ### 47. 各個部門中，最高工資中最低的那個部門的 最低工資是多少
    ```SQL
    SELECT MIN(salary)
    FROM employees
    WHERE department_id = (
      SELECT department_id
      FROM employees
      HAVING MAX(salary) = (
        SELECT MIN(MAX(salary))
        FROM employees
        GROUP BY department_id
      )
      GROUP BY department_id
    )
    ```

  - ### 48. 查詢平均工資最高的部門的 manager 的詳細信息：last_name、department_id、email、salary
    ```SQL
    SELECT last_name, department_id, email, salary
    FROM employees
    WHERE employee_id in (
      SELECT distinct manager_id
      FROM employees
      WHERE department_id = (
        SELECT department_id
        FROM employees
        GROUP BY department_id
        HAVING AVG(salary) = (
          SELECT MAX(AVG(salary))
          FROM employees
          GROUP BY department_id
        )
      )
    )
    ```

  - ### 49. 查詢 1999 年來公司的員工中的最高工資的那個員工的信息
    ```SQL
    SELECT *
    FROM employees
    WHERE salary = (
      SELECT MAX(salary)
      FROM employees
      WHERE to_char(hire_date, 'yyyy') = '1999'
    )
    AND to_char(hire_date, 'yyyy') = '1999'
    ```

  - ### 50. 多行子查詢 any 和 all
    ```SQL
    SELECT department_id
    FROM employees
    GROUP BY department_id
    HAVing AVG(salary) >= any(
      -- 所有部門的平均工資
      SELECT AVG(salary)
      FROM employees
      GROUP BY department_id
    )
    ```
    > `ANY` 和 任意一個值比較，所以其條件最為寬鬆，所以實際上只需和平均工資最低的比較，返回所有值，而 `ALL` 是和全部的值比較，條件最為苛刻，所以實際上返回的只需和平均工資最高的比較，所以返回平均工資最高的 `department_id`。

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

## 第 8 章 數據處理
  - ### 55. 更改 108 員工的信息：使其工資變為所在部門中的最高工資，job 變為公司中平均工資最低的 job
    - 1. 搭建骨架
      ```SQL
      UPDATE employees
      set salary = (), job_id = ()
      WHERE employee_id = 108;
      ```

    - 2. 所在部門中的最高工資
      ```SQL
      SELECT MAX(salary)
      FROM employees
      WHERE department_id = (SELECT department_id
                             FROM employees
                             WHERE employee_id = 108)
      ```

    - 3. 公司中平均工資最低的 job
      ```SQL
      SELECT job_id
      FROM employees
      GROUP BY job_id
      HAVING AVG(salary) = (SELECT AVG(salary)
                            FROM empoloyees
                            GROUP BY job_id )
      ```

    - 4. 填充
      ```SQL
      UPDATE employees e
      set salary = (
        SELECT MAX(salary)
        FROM employees
        WHERE department_id = e.department_id
      ), job_id = (
        SELECT job_id
        FROM employees
        GROUP BY job_id
        HAVING AVG(salary) = (SELECT AVG(salary)
                              FROM empoloyees
                              GROUP BY job_id )
      )
      WHERE employee_id = 108;
      ```

  - ### 56. 刪除 108 號員工所在部門中，工資最低的那個員工。
    - 1. 查詢 108 員工所在的部門 id
      ```SQL
      SELECT department_id
      FROM employees
      WHERE employee_id = 108;
      ```

    - 2. 查詢 1. 部門中的最低工資：
      ```SQL
      SELECT MIN(salary)
      FROM employees
      WHERE department_id = (SELECT department_id
                             FROM employees
                             WHERE employee_id = 108)
      ```

    - 3. 刪除 1. 部門中工資為 2. 的員工信息：
      ```SQL
      DELETE FROM employees e
      WHERE department_id = (SELECT department_id
                             FROM employees e
                             WHERE employee_id = 108)
            AND salary = (SELECT MIN(salary)
                          FROM employees
                          WHERE department_id = e.department_id)
      ```

## 第 9 章 約束
  - ### 57. 定義非空約束
    - 1. 非空約束只能定義在列級。
    - 2. 不指定約束名
      ```SQL
      CREATE TABLE emp2 (
        name VARCHAR2(30) NOT NULL,
        age NUMBER(3)
      );
      ```
    - 3. 指定約束名
      ```SQL
      CREATE TABLE emp3 (
        name VARCHAR2(30) CONSTRAINT name_not_null NOT NULL,
        age NUMBER(3)
      );
      ```
  
  - ### 58. 唯一約束
    - 1. 列級定義
      - 1. 不指定約束名
        ```SQL
        CREATE TABLE emp2 (
          name VARCHAR2(30) UNIQUE,
          age NUMBER(3)
        );
        ```
      - 2. 指定約束名
        ```SQL
        CREATE TABLE emp3 (
          name VARCHAR2(30) CONSTRAINT name_up UNIQUE,
          age NUMBER(3)
        );
        ```

    - 2. 表級定義：必須指定約束名
      - 1. 指定約束名
        ```SQL
        CREATE TABLE emp3 (
          name VARCHAR2(30),
          age NUMBER(3),
          CONSTRAINT name_uq UNIQUE(name)
        );
        ```

  - ### 58.1 主鍵約束：唯一確定一行紀錄。表明此屬性：非空，唯一

  - ### 59. 外鍵約束
    - 1. 列級定義
      - 1. 不指定約束名
        ```SQL
        CREATE TABLE emp2 (
          emp_id NUMBER(6),
          name VARCHAR2(25),
          dept_id NUMBER(4) REFERENCES dept2(dept_id);
        )
        ```

      - 2. 指定約束名
        ```SQL
        CREATE TABLE emp3 (
          emp_id NUMBER(6),
          name VARCHAR2(25),
          dept_id NUMBER(4) CONSTRAINT dept_fk3 REFERENCES dept2(dept_id);
        )
        ```
      
    - 2. 表級定義：必須指定約束名
      - 1. 指定約束名
        ```SQL
        CREATE TABLE emp4 (
          emp_id NUMBER(6),
          name VARCHAR2(25),
          dept_id NUMBER(4),
          CONSTRAINT dept_fk2 FOREIGN KEY(dept_id) REFERENCES dept2(dept_id)
        )
        ```

  - ### 60. 約束需要注意的地方
    - 1. ** 非空約束 (`NOT NULL`) 只能定義在列級。
    - 2. ** 唯一約束 (`UNIQUE`) 的列值可以為空。
    - 3. ** 外鍵 (`FOREIGN KEY`) 引用的列，起碼要有一個唯一約束。

  - ### 61. 建立外鍵約束時的級聯刪除問題
    - 1. 級聯刪除
      ```SQL
      CREATE TABLE emp2 (
        id NUMBER(3) PRIMARY KEY,
        name VARCHAR2(25) UNIQUE,
        dept_id NUMBER(3) REFERENCES dept2(dept_id) ON DELETE CASCADE
      )
      ```
    
    - 2. 級聯置空
      ```SQL
      CREATE TABLE emp3 (
        id NUMBER(3) PRIMARY KEY,
        name VARCHAR2(25) UNIQUE,
        dept_id NUMBER(3) REFERENCES dept2(dept_id) ON DELETE SET NULL
      )
      ```

## 第 10 章 視圖
  - ### 62. 查詢員工表中 salary 前 10 的員工信息。
    ```SQL
    SELECT last_name, salary
    FROM (
      SELECT last_name, salary
      FROM employees
      ORDER BY salary DESC
    )
    WHERE ROWNUM <= 10;
    ```

    說明：`ROWNUM 偽列`，數據表本身並沒有這樣的列，是 `Oracle` 數據庫為每個數據表 `加上的` 列，可以標識行號，默認情況下 `ROWNUM` 按主索引來排序，若沒有主索引則自然排序。

    注意：對 `ROWNUM` 只能使用 `<` 或 `<=`，而用 `=`、`>`， `>=` 都將不能返回任何數據。

  - ### 63. 查詢員工表中 salary 10-20 的員工信息
    ```SQL
    SELECT *
    FROM (
      SELECT ROWNUM rn, temp.*
      FROM (
        SELECT last_name, salary
        FROM employees e
        ORDER BY salary DESC
      ) temp
    )
    WHERE rn > 10 AND rn < 21;
    ```

  - ### 64. 對 oracle 數據庫中紀錄，進行分頁：每頁顯示 10 條紀錄，查詢第 5 頁的數據
    ```SQL
    SELECT employee_id, last_name, salary
    FROM (
      SELECT ROWNUM rn, employee_id, last_name, salary
      FROM employees
    ) e
    WHERE e.rn <= 50 AND e.rn > 40;
    ```
    注意：對 `Oracle` 分頁必須使用 `ROWNUM 偽列`。

    ```SQL
    SELECT employee_id, last_name, salary
    FROM (
      SELECT ROWNUM rn, employee_id, last_name, salary
      FROM employees
    ) e
    WHERE e.rn <= pageNo * pageSize AND e.rn > (pageNo - 1) * pageSize
    ```

## 第 11 章 其他數據庫對象
  - ### 65. 創建序列：
    - 1. 
      ```SQL
      CREATE SEQUENCE hs
      INCREMENT BY 10
      START WITH 10
      ```
    - 2. `NEXTVAL` 應在 `CURRVAL` 之前指定，二者應同時有效

  - ### 66. 序列通常用來生成主鍵
    ```SQL
    INSERT INTO emp2 VALUES (emp2_seq.nextval, 'xx', ...)
    ```

  - ### 總結
    |                | WHAT | WHY | HOW |
    |----------------|------|-----|-----|
    | 表 Table        |      |     |     |
    | 視圖 View       |      |     |     |
    | 序列 Sequence   |      |     |     |
    | 索引 Index      |      |     |     |
    | 同義詞 Synonym  |      |     |     |
