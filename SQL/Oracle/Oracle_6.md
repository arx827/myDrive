# Oracle 子查詢

## 目標
  通過本章學習，您將可以
  - 描述子查詢可以解決的問題。
  - 定義子查詢。
  - 列出子查詢的類型
  - 書寫單行子查詢和多行子查詢。

## 使用子查詢解決問題
  誰的工資比 `Abel` 高？
  ```SQL
  SELECT last_name, salary
  FROM employees
  WHERE salary > (SELECT salary
                  FROM employees
                  WHERE last_name = 'Abel')
  ```

## 子查詢語法
  ```SQL
  SELECT select_list
  FROM table
  WHERE expr operator (SELECT select_list
                       FROM table);
  ```
  - 子查詢(內查詢) 在主查詢之前一次執行完成。
  - 子查詢的結果 被 主查詢(外查詢) 使用。

## 子查詢
  ```SQL
  SELECT last_name
  FROM employees
  WHERE salary > (SELECT salary
                  FROM employees
                  WHERE last_name = 'Abel');
  ```

  | last_name |
  |-----------|
  | King      |
  | Kochhar   |
  | De Haan   |
  | Hartstein |
  | Higgins   |

## 注意事項
  - `子查詢` 要包含在括號內。
  - 將 `子查詢` 放在比較條件的右側。
  - 單行操作符 對應 單行子查詢，多行操作符 對應 多行子查詢。

## 子查詢類型
  - 單行子查詢
    ![image_Oracle_6-1](./image_Oracle_6-1.png)
  - 多行子查詢
    ![image_Oracle_6-2](./image_Oracle_6-2.png)

## 單行子查詢
  - 只返回一行。
  - 使用單行比較操作符。

    | 操作符  | 含義                     |
    |:------:|--------------------------|
    |   =    | equal to                 |
    |   >    | greater than             |
    |   >=   | greater than or equal to |
    |   <    | less than                |
    |   <=   | less than or equal to    |
    |   <>   | not equal to             |

## 執行單行子查詢
  - 題目：返回 `job_id` 與 `141號員工` 相同， `salary` 比 `143號員工` 多的員工姓名、job_id 和 工資

    ```SQL
    SELECT last_name, job_id, salary
    FROM   employees
    WHERE  job_id = (SELECT job_id
                    FROM   employees
                    WHERE  employee_id = 141)
    AND    salary > (SELECT salary
                    FROM   employees
                    WHERE  employee_id = 143);
    ```

    | last_name | job_id   | salary |
    |-----------|----------|-------:|
    | Rajs      | ST_CLERK |   3500 |
    | Davies    | ST_CLERK |   3100 |

## 在子查詢中使用組函數
  - 題目：返回公司工資最少的員工的 `last_name`、`job_id` 和 `salary`
    ```SQL
    SELECT last_name, job_id, salary
    FROM employees
    WHERE salary = (SELECT MIN(salary)
                    FROM employees)
    ```

    | last_name | job_id   | salary |
    |-----------|----------|-------:|
    | Vargas    | ST_CLERK |   2500 |

## 子查詢中的 HAVING 子句
  - 首先執行子查詢。
  - 向主查詢中的 `HAVING 子句` 返回結果。
  - 題目：查詢最低工資 大於 50號部門最低工資 的 部門id 和 其最低工資
    ```SQL
    SELECT   department_id, MIN(salary)
    FROM     employees
    GROUP BY department_id
    HAVING   MIN(salary) > (SELECT MIN(salary)
                            FROM   employees
                            WHERE  department_id = 50);
    ```

## 非法使用子查詢
  ```SQL
  SELECT employee_id, last_name
  FROM   employees
  WHERE  salary = (SELECT   MIN(salary)
                   FROM     employees
                   GROUP BY department_id);
  ```

  ```sh
  錯誤代碼：1242
  Subquery returns more than 1 row
  ```
  多行子查詢 使用單行比較符

## 子查詢中的空值問題
  ```SQL
  SELECT last_name, job_id
  FROM   employees
  WHERE  job_id = (SELECT job_id
                   FROM   employees
                   WHERE  last_name = 'Haas');
  ```
  ```sh
  no rows selected
  ```
  子查詢不返回任何行

## 多行子查詢
  - 也稱為 集合比較子查詢
  - 內查詢返回多行
  - 使用多行比較操作符

    | 操作符 | 含義                                                  |
    |--------|-----------------------------------------------------|
    | IN     | 等於列表中的 `任意一個`                                |
    | ANY    | 需要和單行比較操作符一起使用，和子查詢返回的 `某一個` 值比較 |
    | ALL    | 需要和單行比較操作符一起使用，和子查詢返回的 `所有` 值比較   |
    | SOME   | 實際上是ANY的別名，作用相同，一般常使用ANY                |

## 在多行子查詢中，使用 `ANY` 操作符
  - 題目：返回其它部門中，比 job_id 為 `IT_PROG` 部門 `任一` 工資低的員工的員工號、姓名、job_id 以及salary
    ```SQL
    SELECT employee_id, last_name, job_id, salary
    FROM employees
    WHERE salary < ANY(SELECT salary
                       FROM employees
                       WHERE job_id = 'IT_PROG')
    AND job_id <> 'IT_PROG';
    ```

    | employee_id | last_name | job_id   | salary |
    |------------:|-----------|----------|-------:|
    |         124 | Mourgos   | ST_MAN   |   5800 |
    |         141 | Rajs      | ST_CLERK |   3500 |
    |         142 | Davies    | ST_CLERK |   3100 |
    |         143 | Matos     | ST_CLERK |   2600 |
    |         144 | Vargas    | ST_CLERK |   2500 |

## 在多行子查詢中，使用 `ALL` 操作符
  - 題目：返回其它部門中，比 job_id 為 `IT_PROG` 部門 `所有` 工資低的員工的員工號、姓名、job_id 以及salary
    ```SQL
    SELECT employee_id, last_name, job_id, salary
    FROM employees
    WHERE salary < ALL(SELECT salary
                       FROM employees
                       WHERE job_id = 'IT_PROG')
    AND job_id <> 'IT_PROG';
    ```

    | employee_id | last_name | job_id   | salary |
    |------------:|-----------|----------|-------:|
    |         141 | Rajs      | ST_CLERK |   3500 |
    |         142 | Davies    | ST_CLERK |   3100 |
    |         143 | Matos     | ST_CLERK |   2600 |
    |         144 | Vargas    | ST_CLERK |   2500 |

## 子查詢中的空值問題
  ```SQL
  SELECT last_name
  FROM employees
  WHERE employee_id NOT IN ( SELECT manager_id
                             FROM employees);

  -- no rows selected
  ```

## 總結
  通過本章學習，您已經學會：
  - 如何使用子查詢。
  - 在查詢時，基於未知的值時，應使用子查詢
    ```SQL
    SELECT select_list
    FROM table
    WHERE expr operator (SELECT select_list
                         FROM table);
    ```

## 測試
  - ### 1. 查詢和 Zlotkey 相同部門的員工姓名和雇用日期
    - 練習
      ```SQL
      SELECT last_name, hire_date
      FROM employees
      WHERE department_id = (
        SELECT department_id
        FROM employees
        WHERE last_name = 'Zlotkey'
      )
      AND last_name <> 'Zlotkey'
      ```

  - ### 2. 查詢工資比公司平均工資高的員工的員工號、姓名、工資
    - 練習
      ```SQL
      SELECT last_name, employee_id, salary
      FROM salary > (
        SELECT AVG(salary)
        FROM employees
      )
      ```
    
  - ### 3. 查詢各部門中工資比本部門平均工資高的員工的員工號、姓名和工資
    - 練習
      ```SQL
      SELECT employee_id, last_name, salary
      FROM employees e1
      WHERE salary > (
        SELECT AVG(salary)
        FROM employees e2
        WHERE e1.department_id = e2.department_id
        GROUP BY department_id
      )
      ```
    
  - ### 4. 查詢和姓名中包含 字母u 的員工在相同部門的員工的員工號和姓名
    - 練習
      ```SQL
      SELECT employee_id, last_name
      FROM employees
      WHERE department_id in (
        SELECT department_id
        FROM employees
        WHERE last_name like '%u%'
      )
      AND last_name not like '%u%'
      ```

  - ### 5. 查詢在部門的 location_id 為 1700 的部門工作的員工的員工號
    - 練習
      ```SQL
      SELECT employee_id
      FROM employees
      WHERE department_id in (
        SELECT employee_id
        FROM employees
        WHERE location_id = 1700
      )
      ```

  - ### 6. 查詢管理者是 King 的員工姓名和工資
    - 練習
      ```SQL
      SELECT last_name, salary
      FROM employees
      WHERE manager_id in (
        SELECT employee_id
        FROM employees
        WHERE last_name = 'King'
      )
      ```