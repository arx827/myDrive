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