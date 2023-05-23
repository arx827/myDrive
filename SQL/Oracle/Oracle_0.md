# Oracle 資料庫的安裝與配置
  - mac 安裝方式
    - [官網下載網址](https://www.oracle.com/tw/database/technologies/oracle-database-software-downloads.html)
    - [mac 需要先安裝 docker](https://www.docker.com/products/docker-desktop)

  - ## Oracle 簡介
    - `Oracle` 是 殷墟出土的 `甲骨文 (oracle bone inscriptions)` 的英文翻譯的第一個單詞。
    - `Oracle 公司` 是全球最大的信息管理軟件及服務供應商，成立於 1977 年，總部位於美國加州 Redwood shore 。
    - `Oracle 公司` 因其複雜的關聯式資料庫產品而聞名。`Oracle` 的關聯式資料庫是世界第一個支持 `SQL` 語言的資料庫。

    > 相關認證：OCA、OCP、OCM 認證

  - ## 概述
    - Oracle 資料庫是一種網絡上的資料庫，它在網絡上支持多用戶，支持 `服務器/客戶機` 等部屬 (或配置)。
    - 服務器 與 客戶機是 `軟件概念`，它們與計算機硬件不存在一一對應的關係，即：同一台計算機既可以充當服務器，又可充當客戶機，或者，一台計算機指充當服務器或只充當客戶機。

  - ## Oracle 資料庫體系結構簡介
    - 平常所說的 Oracle 或 Oracle 資料庫 指的是 `Oracle 資料庫管理系統`。Oracle 資料庫管理系統 是 `管理資料庫訪問的計算機軟件 (Oracle database manager system)`。它由 `Oracle 資料庫` 和 `Oracle 實例 (instance)` 構成。
      > `RDBMS`：關聯式資料庫管理系統。
    - `Oracle 資料庫`：一個相關的操作系統文件 (即存儲在計算機硬碟上的文件)集合，這些文件組織在一起，成為一個邏輯整體，即為 Oracle 資料庫。
      - Oracle 用它來存儲和管理相關的信息，Oracle 資料庫必須要與內存裡實例合作，才能對外提供數據管理服務。
    - `Oracle 實例`：位於物理內存裡的數據結構，它由操作系統的多個後台進程和一個共享的內存池所組成，共享的內存池可以被所有進程訪問。
      - `Oracle 用它們來管理資料庫訪問`，用戶如果要存取資料庫 (也就是硬碟上的文件)裡的數據，必須通過 Oracle 實例才能實現，不能直接讀取硬碟上的文件。
      - 實際上，`Oracle 實例就是平常所說的資料庫服務 (serviec)`。
    - `區別`：實例可以操作資料庫；在任何時刻一個實例只能與一個資料庫關聯，訪問一個資料庫；而同一個資料庫可由多個實例訪問 (RAC)。
  

# 補充 - SQL 初步
## SQL 語句分為以下三種類型：
- `DML`： Data Manipulation Language 數據操縱語言
- `DDL`： Data Definition Language 數據定義語言
- `DCL`： Data Control Language 數據控制語言

## DML 數據操縱語言
  `DML` 用於查詢與修改數據紀錄，包括如下 SQL 語句：
  - `INSERT`：添加數據到資料庫中
  - `UPDATE`：修改資料庫中的數據
  - `DELETE`：刪除數據庫中的數據
  - `SELECT`：選擇(查詢)數據
    - SELECT 是 SQL 語言 的基礎，最為重要

## DDL 數據定義語言
  `DDL` 用於定義數據庫的結構，比如創建、修改或刪除數據庫對象，包括如下 SQL 語句：
  - `CREATE TABLE`：創建數據庫表
  - `ALTER TABLE`：更改表結構、添加、刪除、修改列長度
  - `DROP TABLE`：刪除表
  - `CREATE INDEX`：在表上建立索引
  - `DROP INDEX`：刪除索引

## DCL 數據控制語言
  `DCL` 用於控制數據庫的訪問，包括如下 SQL 語句：
  - `GRANT`：授予訪問權限
  - `REVOKE`：撤銷訪問權限
  - `COMMIT`：提交事務處理
  - `ROLLBACK`：事務處理回退
  - `SAVEPOINT`：設置保存點
  - `LOCK`：對數據庫的特定部分進行鎖定



| oracle       | mysql        | 對映java型別  | 備註                         |
|--------------|--------------|--------------|-----------------------------|
| CHAR         | CHAR         | String       | 定長字串                      |
| VARCHAR2     | VARCHAR      | String       | 變長字串                      |
| INTEGER      | INT          | Integer      | 整形                         |
| BLOB         | LONGBLOB     | String       | 二進位制字串型別               |
| CLOB         | LONGTEXT     | String       | 文字字串型別                  |
| NUMBER(P,S)  | DECIMAL(M,D) | BigDecimal   | 定點數型別                    |
| DECIMAL(P,S) | DECIMAL(M,D) | BigDecimal   | ORACLE中DECIMAL內部就是NUMBER |
