# Oracle 其他數據庫對象

<!-- ## 目標
  通過本章學習，您將可以
  - 描述視圖
  - 創建和修改視圖的定義，刪除視圖
  - 從視圖中查詢數據
  - 通過視圖插入，修改和刪除數據
  - 使用 `Top-N` 分析 -->

## 常見的數據庫對象
  | 對象   | 描述                            |
  |-------|---------------------------------|
  | 表     | 基本的數據存儲集合，由行和列組成。   |
  | 視圖   | 從表中抽出的邏輯上相關的數據集合。    |
  | 序列   | 提供有規律的數值。                 |
  | 索引   | 提高查詢的效率。                   |
  | 同義詞 | 給對象起別名。                     |

## 什麼是序列？
  序列：可供多個用戶用來產生唯一數值的數據庫對象
  - 自動提供唯一的數值
  - 共享對象
  - 主要用於提供主鍵值
  - 將序列值裝入內存可以提高訪問效率

## CREATE SEQUENCE 語句
  定義序列：
  ```SQL
  CREATE SEQUENCE sequence
    [INCREMENT BY n]  -- 每次增長的數值
    [START WITH n]  -- 從哪個值開始
    [{MAXVALUE n | NOMAXVALUE}]  -- 提供的最大值
    [{MINVALUE n | NOMINVALUE}]  -- 提供的最小值
    [{CYCLE | NOCYCLE}]  -- 是否需要循環
    [{CACHE n | NOCACHE}];  -- 是否緩存登錄
  ```

6
## 創建序列
  - 創建序列 `DEPT_DEPTID_SEQ` 為表 `DEPARTMENTS` 提供主鍵。
  - 不使用 `CYCLE` 選項
  ```SQL
  CREATE SEQUENCE dept_deptid_seq
                  INCREMENT BY 10
                  START WITH 120
                  MAXVALUE 9999
                  NOCACHE
                  NOCYCLE
  ```

8
## 查詢序列
  - 查詢數據字典視圖 `USER_SEQUENCES` 獲取序列定義信息
    ```SQL
    SELECT sequence_name, min_value, max_value, increment_by, last_number
    FROM user_sequences;
    ```
  - 如果指定 `NOCACHE` 選項，則列 `LAST_NUMBER` 顯示序列中 `下一個有效` 的值。

11
## 使用序列
  - 將序列值裝入內存可提高訪問效率
  - 序列在下列情況下出現 `裂縫`：
    - 回滾
    - 系統異常
    - 多個表同時使用同一序列
  - 如果不將序列的值裝入內存 (NOCACHE)，可使用表 `USER_SEQUENCES` 查看序列當前的有效值。

## 修改序列
  修改序列的 增量、最大值、最小值、循環選項，或是否裝入內存。
  ```SQL
  ALTER SEQUENCE dept_deptid_seq
                 INCREMENT BY 20
                 MAXVALUE 999999
                 NOCYCLE
                 NOCACHE;
  ```

## 修改序列的注意事項
  - 必須是序列的擁有者 或 對序列有 `ALTER` 權限。
  - 只有將來的序列值會被改變。
  - 改變序列的 `初始值` 只能通過刪除序列之後，重建序列的方法實現。

## 刪除序列
  - 使用 `DROP SEQUENCE` 語句刪除序列
  - 刪除之後，序列不能再次被引用
    ```SQL
    DROP SEQUENCE dept_deptid_seq;
    ```

## 索引
  - 一種獨立於表的模式對象，可以存儲在與表不同的磁盤或表空間中。
  - 索引被刪除或損壞，不會對表產生影響，其影響的只是 `查詢` 的速度。
  - 索引一但建立，Oracle 管理系統會對其進行自動維護，而且由 Oracle 管理系統決定何時使用索引。用戶不用在查詢語句中指定使用哪個索引。
  - 在刪除一個表時，所有基於該表的索引會自動被刪除。
  - 通過指針 `加速` Oracle 服務器的查詢速度。
  - 通過快速定位數據的方法，減少磁盤 I/O


## 創建索引
  - 自動創建： 在定義 `PRIMARY KEY` 或 `UNIQUE` 約束後，系統自動在相應的列上創建 `唯一性` 索引。
  - 手動創建： 用戶可以在其他列上創建非唯一的索引，以加速查詢。

## 創建索引
  - 在一個或多個列上創建索引。
    ```SQL
    CREATE INDEX index
    ON table (column [, column]...);
    ```
  - 在表 `EMPLOYEES` 的列 `LAST_NAME` 上創建索引。
    ```SQL
    CREATE INDEX emp_last_name_idx
    ON employees(last_name)
    ```

## 什麼時候創建索引
  以下情況可以創建索引：
  - 列中數據值分佈範圍很廣
  - 列經常在 `WHERE 子句` 或 連接條件中出現
  - 表經常被訪問，而且數據量很大，訪問的數據大概占數據總量的 2% 到 4%

## 什麼時候不要創建索引
  下列情況不要創建索引：
  - 表很小
  - 列不經常作為連接條件或出現在 `WHERE 子句` 中
  - 查詢的數據大於 2% 到 4%
  - 表經常更新

  1. DESC emp;
  2. CREATE index name_index on emp(name);

  - 索引不需要用，只是說我們在用 `name` 進行查詢的時候，速度會更快。當然查的速度快了，插入速度就會慢。因為插入數據的同時，還需要維護一個索引。

## 查詢索引
  - 可以使用數據字典視圖 `USER_INDEXES` 和 `USER_IND_COLUM` 查看索引的信息。
    ```SQL
    SELECT ic.index_name, ic.column_name, ic.column_position col_pos,ix.uniqueness
    FROM user_indexes ix, user_ind_columns ic
    WHERE ic.index_name = ix.index_name
      AND ic.table_name = 'EMPLOYEES';
    ```

## 刪除索引
  - 使用 `DROP INDEX` 命令刪除索引
    ```SQL
    DROP INDEX index;
    ```

  - 刪除索引 `UPPER_LAST_NAME_IDX`
    ```SQL
    DROP INDEX upper_last_name_idx;
    ```

  - 只有索引的擁有者或擁有 `DROP ANY INDEX` 權限的用戶才可以刪除索引。
  - 刪除操作是不可回滾的。

## 同義詞 - synonym
  使用同義詞訪問相同的對象：
  - 方便訪問其他用戶的對象。
  - 縮短對象名字的長度
    ```SQL
    CREATE [PUBLIC] SYNONYM synonym
    FROM object;
    ```

  1. `CREATE SYNONYM e FROM employees;`
  2. `SELECT * FROM e;`

## 創建和刪除同義詞
  - 為視圖 `DEPT_SUM_VU` 創建同義詞
    ```SQL
    CREATE SYNONYM d_sum
    FROM dept_sum_vu
    ```
  - 刪除同義詞
    ```SQL
    DROP SYNONYM d_sum;
    ```

## 總結
  通過本章學習，您已經可以：
  - 使用序列
  - 使用索引提高查詢效率
  - 為數據對象定義同義詞

## 測試
  ### 1. 創建序列 dept_id_deq，開始值為 200，每次增長 10，最大值為 10000
  ```SQL
  CREATE SEQUENCE dept_id_seq
  START WITH 200
  INCREMENT BY 10
  MAXVALUE 10000;
  ```

  ### 2. 使用序列向表 dept 中插入數據
  ```SQL
  CREATE TABLE dept
  AS
  SELECT department_id id, department_name name
  FROM departments
  WHERE 1 = 2;
  ```
  
  ```SQL
  DESC dept;
  ```

  ```SQL
  INSERT INTO dept VALUES(dept_id_seq.NEXTVAL, 'Account')
  INSERT INTO dept VALUES(dept_id_seq.NEXTVAL, 'Sale')
  INSERT INTO dept VALUES(dept_id_seq.NEXTVAL, 'HR')
  ```

  ```SQL
  SELECT *
  FROM dept;
  ```