# 創建和管理表

## 目標
  - 描述主要的數據庫對象
  - 創建表
  - 描述各種數據類型
  - 修改表的定義
  - 刪除、重命名和清空表

## 常見的數據庫對象
  | 對象   | 描述                            |
  |-------|---------------------------------|
  | 表     | 基本的數據存儲集合，由行和列組成。   |
  | 視圖   | 從表中抽出的邏輯上相關的數據集合。    |
  | 序列   | 提供有規律的數值。                 |
  | 索引   | 提高查詢的效率                    |
  | 同義詞  | 給對象起別名                     |

## 數據庫中的表
  - 用戶定義的表：
    - 用戶自己創建並維護的一組表
    - 包含了用戶所需的信息
      如： `SELECT * FROM user_tables;`，查看用戶創建的表

  - 數據字典：
    - 由 Oracle Server 自動創建的一組表
    - 包含數據庫信息

## 查詢數據字典
  - 查看用戶定義的表
    ```SQL
    SELECT table_name
    FROM user_tables;
    ```
  
  - 查看用戶定義的各種數據庫對象
    ```SQL
    SELECT DISTINCT object_type
    FROM user_tables;
    ```

  - 查看用戶定義的表、視圖、同義詞和序列
    ```SQL
    SELECT *
    FROM user_tables;
    ```

## 命名規則
  ### 表名 和 列名
  - 必須以 `字母開頭`
  - 必須在 1-30 個字符之間
  - 必須只能包含 A-Z、a-z、0-9、_、$ 和 #
  - 必須不能和用戶定義的其他對象重名
  - 必須不能是 Oracle 的保留字

## CREATE TABLE 語句
  - 必須具備：
    - `CREATE TABLE` 權限
    - 存儲空間

    ```SQL
    CREATE TABLE [schema.]table
                 (column datatype [DEFAULT expr][, ...]);
    ```

  - 必須指定：
    - 表名
    - 列名，數據類型，尺寸

## 創建表
  - 語法
    ```SQL
    CREATE TABLE dept
    (
      deptno NUMBER(2),
      dname VARCHAR2(14),
      loc VARCHAR2(13)
    )
    ```
  - 確認是否已創建
    ```SQL
    DESCRIBE dept;
    ```

  - 創建表的第一種方式(白手起家)
    ```SQL
    CREATE TABLE emp1
    (
      id NUMBER(10),
      name VARCHAR2(20),
      salary NUMBER(10, 2),
      hire_date DATE
    )
    ```

  - 創建表的第二種方式(從現有的表 複製)
    ```SQL
    CREATE TABLE emp2
    AS
    SELECT employee_id id, last_name name, hire_date, salary
    FROM employees
    WHERE department_id = 80;
    ```

## 數據類型
  | 數據類型        | 描述                                  |
  |----------------|--------------------------------------|
  | VARCHAR2(size) | 可變長字符數據                         |
  | CHAR(size)     | 定長                                 |
  | NUMBER(p,s)    | 可變長數值數據                         |
  | DATE           | 日期型數據                            |
  | LONG           | 可變長字符數據，最大可達到 2G            |
  | CLOB           | 字符數據，最大可達到 4G                 |
  | RAW(LONG RAW)  | 原始的二進制數據                       |
  | BLOB           | 二進制數據，最大可達到 4G               |
  | BFILE          | 存儲外部文件的二進制數據，最大可達到 4G    |
  | ROWID          | 行地址                                |

## 使用子查詢創建表
  - 使用 AS subquery 選項，將創建表和插入數據結合起來
    ```SQL
    CREATE TABLE <table>
          [(column, column ...)]
    AS subquery;
    ```
  - 指定的列和子查詢中的列，要一一對應
  - 通過 列名 和 默認值 定義列

## 使用子查詢創建表
  複製現有的表
  ```SQL
  -- 複製整張表
  CREATE TABLE emp1 AS SELECT * FROM employees;

  -- 複製欄位，但不複製儲存格，將條件設定為 永遠為false
  CREATE TABLE emp2 AS SELECT * FROM employees where 1=2;
  ```

## 使用子查詢創建表舉例
  ```SQL
  CREATE TABLE dept80
  AS
    SELECT employee_id id, last_name name, hire_date, salary
    FROM employees
    WHERE department_id = 80;
  ```

## ALTER TABLE 語句
  ### 使用 `ALTER TABLE` 語句可以：
  - 追加新的列
  - 修改現有的列
  - 為新追加的列定義默認值
  - 刪除一個列
  - 重命名表的一個列名

  ### 使用 ALTER TABLE 語句追加、修改 或 刪除欄位的語法
  當儲存格中有資料時，修改與刪除會失敗。
    
  - #### 使用 ADD 子句，追加一個新欄位
    ```SQL
    ALTER TABLE <table>
    ADD
    (
      COLUMN DATATYPE [DEFAULT expr]
      [, COLUMN DATATYPE]
      ...
    )
    ```
    範例：
    ```SQL
    ALTER TABLE emp1
    ADD
    (
      email varchar2(20)
    )
    ```

  - #### 修改一個欄位
    可以修改列的數據類型、尺寸和默認值。
    對默認值的修改，`只影響後面` 的新增
    ```SQL
    ALTER TABLE <table>
    MODIFY
    (
      COLUMN DATATYPE [DEFAULT expr]
      [, COLUMN DATATYPE]
      ...
    )
    ```
    範例：
    ```SQL
    ALTER TABLE emp1
    MODIFY
    (
      id varchar2(15)
    )
    ```

  - #### 刪除欄位
    使用 `DROP COLUMN` 子句刪除不再需要的欄位。
    ```SQL
    ALTER TABLE <table>
    DROP COLUMN column_name;
    ```
    範例：
    ```SQL
    ALTER TABLE emp1
    DROP COLUMN salary;
    ```

  - #### 重新命名欄位
    使用 `RENAME COLUMN [table_name] TO`
    ```SQL
    ALTER TABLE <table> RENAME COLUMN old_column_name
    TO new_column_name;
    ```

    範例：
    ```SQL
    ALTER TABLE emp1
    RENAME COLUMN salary to sal;
    ```

## 刪除表
  - 數據和結構都被刪除
  - 所有正在運行的相關事務被提交
  - 所有相關索引被刪除
  - DROP TABLE 語句不能 ROLLBACK (回滾)
    ```SQL
    DROP TABLE dept80;
    ```

## 清空表
  - `TRUNCATE TABLE` 語句：
    - 刪除表中所有的數據
    - 釋放表的存儲空間
      ```SQL
      TRUNCATE TABLE detail_dept;
      ```
  - TRUNCATE 語句 `不能回滾`。

  - 可以使用 DELETE 語句刪除數據，可以回滾。
  - 對比：
    ```SQL
    -- 刪除 emp2
    delete FROM emp2;
    SELECT * FROM emp2;
    
    -- rollback emp2
    ROLLBACK;
    SELECT * FROM emp2;
    ```

## 改變對象的名稱
  - 執行 RENAME 語句改變表、視圖、序列 或 同義詞的名稱
    ```SQL
    RENAME dept TO detail_dept;
    ```

## 總結
  通過本章學習，您已經學會如何使用 DDL 語句創建、修改、刪除 和 重命名表。
  | 語句              | 描述                            |
  |------------------|---------------------------------|
  | `CREATE TABLE`   | 創建表                           |
  | `ALTER TABLE`    | 修改表結構                        |
  | `DROP TABLE`     | 刪除表                           |
  | `RENAME TO`      | 重命名表                          |
  | `TRUNCATE TABLE` | 刪除表中的所有數據，並釋放存儲空間    |
  > 以上這些 DDL 命令，操作完，皆不可回滾！

## 測試
  ### 1. 創建表 dept
  | name | Null? | type         |
  |------|-------|--------------|
  | id   |       | NUMBER(7)    |
  | name |       | VARCHAR2(25) |

  - 練習
    ```SQL
    CREATE TABLE dept
    (
      id NUMBER(7),
      name VARCHAR2(25)
    );
    ```

  ### 2. 將表 departments 中的數據插入新表 dept1 中
  - 練習
    ```SQL
    CREATE TABLE dept1
    AS
      SELECT *
      FROM departments;
    ```

  ### 3. 創建表 emp
  | name       | Null? | type         |
  |------------|-------|--------------|
  | id         |       | NUMBER(7)    |
  | First_name |       | VARCHAR2(25) |
  | Last_name  |       | VARCHAR2(25) |
  | Dept_id    |       | NUMBER(7)    |

  - 練習
    ```SQL
    CREATE TABLE emp
    (
      id NUMBER(7),
      First_name VARCHAR2(25),
      Last_name VARCHAR2(25),
      Dept_id NUMBER(7)
    );
    ```

  ### 4. 將列 Last_name 的長度增加到 50
  - 練習
    ```SQL
    ALTER TABLE
    MODIFY (last_name VARCHAR2(50))
    ```

  ### 5. 根據表 employees 創建 employees2
  - 練習
    ```SQL
    CREATE employees2
    AS
    SELECT *
    FROM employees;
    ```

  ### 6. 刪除 emp
  - 練習
    ```SQL
    DROP TABLE emp;
    ```

  ### 7. 將表 employees2 重命名為 emp
  - 練習
    ```SQL
    RENAME employees2 TO emp;
    ```

  ### 8. 在表 dept 和 emp 中，添加新列 test_column，並檢查所做的操作
  - 練習
    ```SQL
    ALTER TABLE dept
    ADD(
      test_column NUMBER(10)
    );
    ```

  ### 9. 在表 dept 和 emp 中，將列 test_column 設置成不可用，之後刪除。
  - 練習
    ```SQL
    ALTER TABLE dept
    SET UNUSED COLUMN test_column;

    ALTER TABLE dept
    DROP UNUSED COLUMNS;
    ```

  ### 10. 直接刪除表 emp 中的列 dept_id
  - 練習
    ```SQL
    ALTER TABLE emp
    DROP COLUMN dept_id
    ```