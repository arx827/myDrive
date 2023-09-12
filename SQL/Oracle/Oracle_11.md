# Oracle 其他數據庫對象

## 目標
  通過本章學習，您將可以
  - 描述視圖
  - 創建和修改視圖的定義，刪除視圖
  - 從視圖中查詢數據
  - 通過視圖插入，修改和刪除數據
  - 使用 `Top-N` 分析

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

14
## 刪除序列
  - 使用 `DROP SEQUENCE` 語句刪除序列
  - 刪除之後，序列不能再次被引用
    ```SQL
    DROP SEQUENCE dept_deptid_seq;
    ```

15:14

