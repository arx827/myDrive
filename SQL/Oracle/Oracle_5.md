# Oracle 分組函數 (聚合函數、多行函數)

## 目標
  通過本章學習，您將可以
  - 了解 組函數。
  - 描述 組函數 的用途。
  - 使用 `GROUP BY 子句` 對數據分組。
  - 使用 `HAVING 子句` 過濾分組結果集。

## 什麼是 分組函數
  分組函數作用於一組數據，並對一組數據返回一個值。
  ![image_Oracle_5-1](./image_Oracle_5-1.png)

## 組函數類型
  - ### AVG
  - ### COUNT
  - ### MAX
  - ### MIN
  - ### STDDEV
  - ### SUM

## AVG (平均值) 和 SUM (合計) 函數
  可以對 `數值型數據` 使用 AVG 和 SUM 函數。

  ```sql
  SELECT AVG(salary), MAX(salary),
        MIN(salary), SUM(salary)
  FROM employees
  WHERE job_id LIKE '%REP%';
  ```

  | AVG(salary) | MAX(salary) | MIN(salary) | SUM(salary) |
  |------------:|------------:|------------:|------------:|
  |        8150 |       11000 |        6000 |       32600 |

## MIN (最小值) 和 MAX (最大值) 函數
  可以對 `任意數據類型` 的數據使用 `MIN` 和 `MAX` 函數
  
  ```sql
  SELECT MIN(hire_date), MAX(hire_date)
  FROM employees;
  ```

  |MIN(hire_date)|MAX(hire_date)|
  |---:|---:|
  |||

## COUNT (計數) 函数
  `COUNT(*)` 返回表中記錄總數，適用於 `任意數據類型`。

  ```sql
  SELECT COUNT(*)
  FROM employees
  WHERE department_id = 50;
  ```

  | COUNT(*) |
  |---------:|
  |        5 |

  - `COUNT(expr)` 返回 `expr` 不為空的紀錄總數。
    ```sql
    SELECT COUNT(commission_pct)
    FROM employees
    WHERE department_id = 50;   -- 忽略了 Null 值
    ```


## 組函數與空值
  組函數 `忽略空值`

  ```sql
  SELECT AVG(commission_pct)
  FROM employees
  ```

  |AVG(commission_pct)|
  |---:|
  ||

  例如：
  ```sql
  SELECT AVG(commission_pct), SUM(commission_pct) / 107, SUM(commission_pct) / COUNT(commission_pct)
  FROM employees;
  ```
  查看結果的不同。

## 在組函數中使用 `NVL` 函數
  `NVL 函數 使分組函數無法忽略空值`。

  ```sql
  SELECT AVG(NVL(commission_pct, 0))    -- 將 NULL 的值，替換成 0
  FROM employees;
  ```

  |AVG(NVL(commission_pct, 0)) |
  |---:|
  ||

## DISTINCT 關鍵字
  - COUNT(DISTINCT expr) 返回 `expr 非空，且不重複` 的紀錄總數

  ```sql
  SELECT COUNT(DISTINCT department_id)
  FROM employees;
  ```

  | COUNT(DISTINCT department_id) |
  |------------------------------:|
  |                             7 |

## 分組數據
  ![image_Oracle_5-2](./image_Oracle_5-2.png)

## GROUP BY 子句
  包含在 `GROUP BY 子句` 中的列，不必包含在 `SELECT` 列表中。

  ```SQL
  SELECT AVG(salary)
  FROM employees
  GROUP BY department_id;
  ```

  ![image_Oracle_5-4](./image_Oracle_5-4.png)

  在 `SELECT` 列表中所有未包含在組函數中的列，都應該包含在 `GROUP BY 子句` 中。
  
  ```sql
  SELECT department_id, AVG(salary)
  FROM employees
  GROUP BY department_id;
  ```

  ![image_Oracle_5-3](./image_Oracle_5-3.png)

## 在 GROUP BY 子句 中包含多個列
  ```sql
  SELECT department_id dept_id, job_id, SUM(salary)
  FROM employees
  GROUP BY department_id, job_id
  ```

## 非法使用組函數
  所有包含於 `SELECT` 列表中，而未包含於組函數中的列，都必須包含於 `GROUP BY` 子句中。

  ```sql
  SELECT department_id, COUNT(last_name)
  FROM employees;
  ```

  ```sql
  SELECT department_id, COUNT(last_name)
  *
  ERROR at line 1:
  ORA-00937: not a aingle-group group function
  ```

  `GROUP BY` 子句中缺少列