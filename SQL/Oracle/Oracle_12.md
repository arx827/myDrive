# Oracle 控制用戶權限

## 目標
  通過本章學習，您將可以：
  - 創建用戶
  - 創建角色
  - 使用 `GRANT` 和 `REVOKE` 語句，賦予和回收權限
  - 創建數據庫聯接

## 權限
  - 數據庫安全性：
    - 系統安全性
    - 數據安全性
  - 系統權限：對於數據庫的權限
  - 對象權限：操作數據庫對象的權限

## 系統權限
  - 超過一百多種有效的權限
  - 數據庫管理員，具有高級權限以完成管理任務，
    - 創建新用戶
    - 刪除用戶
    - 刪除表
    - 備份表

## 創建用戶
  DBA 使用 `CREATE USER` 語句創建用戶
  ```SQL
  CREATE USER user
  IDENTIFIED BY password;
  ```
  ```SQL
  CREATE USER scott
  IDENTIFIED BY tiger;
  ```

## 用戶的系統權限
  - 用戶創建之後，DBA 會賦予用戶一些系統權限
    ```SQL
    GRANT privilege [, privilege...]
    TO user [, user| role, PUBLIC...]; 
    ```
    > gran：授予

  - 以應用程序開發者為例，一般具有下列系統權限：
    - `CREATE SESSION (創建會話)`
    - `CREATE TABLE (創建表)`
    - `CREATE SEQUENCE (創建序列)`
    - `CREATE VIEW (創建視圖)`
    - `CREATE PROCEDURE (創建過程)`

## 賦予系統權限
  DBA 可以賦予用戶特定的權限
  ```SQL
  GRANT create session,
        create table,
        create sequence,
        create view
  TO scott;
  ```

## 創建用戶表空間
  用戶擁有 `CREATE TABLE` 權限之外，還需要分配相對應的表空間才可開闢存儲空間用於創建的表
  ```SQL
  ALTER USER atguigu01 QUOTA UNLIMITED
  ON users
  ```

## 創建角色並賦予權限
  - 創建角色
    ```SQL
    CREATE ROLE manager;
    ```
  - 為角色賦予權限
    ```SQL
    GRANT create table, create view
    TO manager;
    ```
  - 將角色賦予用戶
    ```SQL
    GRANT manager TO DEHAAN, KOCHHAR;
    ```

## 修改密碼
  - DBA 可以創建用戶和修改密碼
  - 用戶本人可以使用 `ALTER USER` 語句修改密碼。
    ```SQL
    ALTER USER scott
    IDENTIFIED BY lion;
    ```

## 對象權限
  | 對象權限 | 表  | 視圖  | 序列  | 過程 |
  |-------- |:--:|:----:|:----:|:----:|
  | 修改     | ✓  |      |  ✓   |      |
  | 刪除     | ✓  |  ✓   |      |      |
  | 執行     |    |      |      |  ✓   |
  | 索引     | ✓  |      |      |      |
  | 插入     | ✓  |  ✓   |      |      |
  | 關聯     | ✓  |  ✓   |      |      |
  | 選擇     | ✓  |  ✓   |  ✓   |      |
  | 更新     | ✓  |  ✓   |      |      |

## 對象權限
  - 不同的對象具有不同的對象權限
  - 對象的擁有者擁有所有權限
  - 對象的擁有者可以向外分配權限
    ```SQL
    GRANT object_priv[(columns)]
    ON object
    TO (user | role | PUBLIC)
    [WITH GRANT OPTION];
    ```

## 分配對象權限
  - 分配表 EMPLOYEES 的查詢權限
    ```SQL
    GRANT select
    ON employees
    TO sue, rich;
    ```
  
  - 分配表中各個列的更新權限
    ```SQL
    GRANT update
    ON scott.departments
    TO atguigu
    ```

## WITH GRANT OPTION 和 PUBLIC 關鍵字
  - WITH GRANT OPTION (使用戶同樣具有分配權限的權利)
    ```SQL
    GRANT select, insert
    ON departments
    TO scott
    WITH GRANT OPTION;
    ```
  
  - 向數據庫中所有用戶分配權限
    ```SQL
    GRANT select
    ON alice.departments
    TO PUBLIC;
    ```

## 查詢權限分配情況
  | 數據字典視圖          | 描述                     |
  |---------------------|--------------------------|
  | ROLE_SYS_PRIVS      | 角色擁有的系統權限         |
  | ROLE_TAB_PRIVS      | 角色擁有的對象權限         |
  | USER_ROLE_PRIVS     | 用戶擁有的角色             |
  | USER_TAB_PRIVS_MADE | 用戶分配的關於表對象權限   |
  | USER_TAB_PRIVS_RECD | 用戶擁有的關於表對象權限   |
  | USER_COL_PRIVS_MADE | 用戶分配的關於列的對象權限 |
  | USER_COL_PRIVS_RECD | 用戶擁有的關於列的對象權限 |
  | USER_SYS_PRIVS      | 用戶擁有的系統權限         |


## 收回對象權限
  - 使用 REVOKE 語句收回權限
  - 使用 WITH GRANT OPTION 子句，所分配的權限同樣被收回
  ```SQL
  REVOKE (privilege [, privilege...] | ALL)
  OR object
  FROM (user [, user...] | role | PUBLIC
  [CASCADE CONSTRAINTS];
  )
  ```

## 收回對象權限 舉例
  ```SQl
  REVOKE select, insert
  ON departments
  FROM scott;
  ```

## 總結
  通過本章學習，您已經可以使用 DCL 控制數據庫權限，創建數據庫連接：
  | 語言        | 功能                      |
  |-------------|-------------------------|
  | CREATE USER | 創建用戶(通常由 DBA 完成) |
  | GRANT       | 分配權限                  |
  | CREATE ROLE | 創建角色(通常由 DBA 完成) |
  | ALTER USER  | 修改用戶密碼              |
  | REVOKE      | 收回權限                  |

## 測試
  ### 1. 如果用戶能夠登陸到數據庫，至少需要哪種權限？是系統權限還是對象權限。
    ```SQL
    CREATE SESSION 系統權限
    ```

  ### 2. 創建表需要哪種權限？
    ```SQL
    CREATE TABLE
    ```

  ### 3. 將表 departments 的查詢權限分配給用戶 system
    ```SQL
    GRANT select
    ON departments
    FROM system;
    ```

  ### 4. 從 system 處，收回剛才賦予的權限
    ```SQL
    REVOKE select
    ON departments
    FROM system;
    ```

  ### 5. 創建角色 dep, 並將如下權限賦予該角色
    - CREATE PROCEDURE
    - CREATE SESSION
    - CREATE TABLE
    - CREATE SEQUENCE
    - CREATE VIEW

    ```SQL
    CREATE ROLE dep;
    ```

    ```SQL
    GRANT CREATE PROCEDURE, CREATE SESSION, CREATE TABLE, CREATE SEQUENCE, CREATE VIEW
    To dep;
    ```