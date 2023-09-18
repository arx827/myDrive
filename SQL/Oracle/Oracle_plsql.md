# Oracle PL/SQL輕量版

## PL/SQL 程序設計簡介
  PL/SQL 是一種高級數據庫程序設計語言，該語言`專門用於在各種環境下對 Oracle 數據庫進行訪問`。由於該語言集成於數據庫服務器中，所以 PL/SQL 代碼可以對數據進行快速高效的處理。除此之外，可以在 Oracle 數據庫的某些客戶端工具中，使用 PL/SQL 語言也是該語言的一個特點。本章的主要內容是討論引入 PL/SQL 語言的必要性和該語言的主要特點，以及了解 PL/SQL 語言的重要性和數據庫版本問題。還要介紹一些貫穿全輸得更詳細的高級概念，並在本章的最後就我們在本書案例中使用的數據庫表的若干約定做一說明。

## 0. 準備工作
  ```SQL
  set serveroutput on
  ```
  hellowrold 程式
  ```SQL
  begin
  dbms_output.put_line('hello world');
  end;
  ```

  ### PL/SQL 塊
  PL/SQL 程序由三個塊組成：
  - 聲明部分 DECLARE
  - 執行部分 BEGIN
  - 異常處理部分 EXCEPTION

  ### 語法格式
    ```SQL
    DECLARE
      -- 聲明的變量、類型、游標
    BEGIN
      -- 程序的執行部分 (類似於 java 裡的 main()方法)
      -- 打印變量得值
      dbms_output.put_line('hello world');
    EXCEPTION
      -- 針對 begin塊 中出現的異常，提供處理的機制
      -- when ... then...
      -- when ... then...
    END
    ```

  ### 變量命名
  變量命名 在 PL/SQL 中有特別的講究，建議在系統的設計階段就要求所有編程人員共同遵守一定的要求，使得整個系統的文檔在規範上，達到要求。下面是 建議的命名方法：

  | 標識符            | 命名規則         | 例子            |
  |------------------|-----------------|-----------------|
  | 程序變量          | V_name          | V_name          |
  | 程序常量          | C_name          | C_company_name  |
  | 游標變量          | Name_cursor     | Emp_cursor      |
  | 異常標識          | E_name          | E_too_many      |
  | 表類型            | Name_table_type | Emp_record_type |
  | 表               | Name_table      | Emp             |
  | 紀錄類型          | Name_record     | Emp_record      |
  | SQL*Plus 替代變量 | P_name          | P_sal           |
  | 綁定變量          | G_name          | G_year_sal      |

## 基本語法
  - ### 1. 使用一個變量
    ```SQL
    DECLARE
      -- 聲明一個變量
      v_name varchar2(25);
    BEGIN
      -- 通過 select ... into ... 語句為變量賦值
      select last_name into v_name
      from employees
      where employee_id = 186;
      -- 打印變量得值
      dbms_output.put_line(v_name);
    END
    ```

  - ### 2. 使用多個變量
    ```SQL
    DECLARE
      -- 聲明變量
      v_name varchar2(25);
      v_email varchar2(25);
      v_salary number(8, 2);
      v_job_id varchar2(10);
    BEGIN
      -- 通過 select ... into ... 語句為變量賦值
      -- 被賦值的變量與 SELECT 中的列名要一一對應
      select last_name, email, salary, job_id into v_name, v_email, v_salary, v_job_id
      from employees
      where employee_id = 186;
      -- 打印變量的值
      dbms_output.put_line(v_name || ',' || v_mail || ',' || v_salary || ',' || v_job_id);
    END
    ```

## 紀錄類型
  - ### 1. 自定義紀錄類型
    紀錄類型是把 `邏輯相關` 的數據作為一個單元存儲起來，稱作 PL/SQL RECORD 的域(FIELD)，其作用是存放互不相同，但邏輯相關的信息。

    語法如下：
    ```SQL
    TYPE record_type IS RECORD(
      Field1 type1 [NOT NULL] [:=exp1],
      Field2 type2 [NOT NULL] [:=exp2],
      ...
      Fieldn typen [NOT NULL] [:=expn]
    );
    ```

    範例：
    ```SQL
    DECLARE
      -- 定義一個紀錄類型
      type customer_type is record(
        v_cust_name varchar2(20),
        v_cust_id number(10)
      );

      -- 聲明自定義紀錄類型的變量
      v_customer_type customer_type;
    BEGIN
      v_customer_type.v_cust_name := '劉德華';   -- := (等於)
      v_customer_type.v_cust_id := 1001;
      dbms_output.put_line(v_customer_type.v_cust_name || ',' || v_customer_type.v_cust_id);
    END
    ```

  - ### 2. 自定義紀錄類型
    ```SQL
    DECLARE
      -- 定義一個紀錄類型
      type emp_record is record(
        v_name varchar2(25),
        v_email varchar2(25),
        v_salary number(8, 2),
        v_job_id varchar2(10)
      );

      -- 聲明自定義紀錄類型的變量
      v_emp_record emp_record;
    BEGIN
      -- 通過 select ... into ... 語句為變量賦值
      select salary, employee_id, email, hire_date into v_emp_record
      from employees
      where employee_id = 123;

      dbms_output.put_line('employid:' || v_emp_record.v_emp_id || ' salary:' || v_emp_record.v_sal || ' email:' || v_emp_record.v_email || ' hire date:' || v_emp_record.v_hiredate)
    END
    ```

















    ```SQL
    DECLARE
      -- 定義一個紀錄類型
      type emp_record is record(
        v_sal employees.salary%type,
        v_emp_id employees.employee_id%type,
        v_email employees.email%type,
        v_hiredate employees.hire_date%type
      );

      -- 聲明自定義紀錄類型的變量
      v_emp_record emp_record;
    BEGIN
      -- 程序的執行部分
      select salary, employee_id, email, hire_date into v_emp_record
      from employees
      where employee_id = 123;

      dbms_output.put_line('employid:' || v_emp_record.v_emp_id || ' salary:' || v_emp_record.v_sal || ' email:' || v_emp_record.v_email || ' hire date:' || v_emp_record.v_hiredate)
    END
    ```

  - ### 3. 整列資料
    ```SQL
    DECLARE
      -- 聲明自定義紀錄類型的變量
      v_emp_record employees%rowtype;
    BEGIN
      -- 程序的執行部分
      select * into v_emp_record
      from employees
      where employee_id = 123;

      dbms_output.put_line('employid:' || v_emp_record.employee_id || ' salary:' || v_emp_record.salary || ' email:' || v_emp_record.email || 'department_id:' || v_emp_record.department_id)
    END
    ```


<!-- 1. pl/sql 基本的語法格式
2. 紀錄類型 type ... is record( , , ,);
3. 流程控制：
  1. 條件判斷
    方式一：if... then elsif then ... else ... end if;
    方式二：case ... when ... then ... end;
  2. 循環結構 (3 種)
    方式一：loop ... exit when ... end loop;
    方式二：while ... loop ... end loop;
    方式三：for i in ... loop ... end loop;
  3. goto、exit
4. 游標的使用 (類似於 java 中的 Iterator )
5. 異常的處理 (三種方式)

6. 會寫一個存儲函數(有返回值)、存儲過程(沒有返回值)
7. 會寫一個觸發器 -->

  <!-- ```SQL
  declare
    -- 聲明一個紀錄類型
    type emp_record is record(
      v_sal employees.salary%type,
      v_email employees.email%type,
      v_hire_date employees.date%type
    );
    -- 定義一個紀錄類型的成員變量
    v_emp_record emp_rocord;
  begin
    -- sql 語句的操作：select ... into ... from ... where ...
    select salary, email, hire_date into v_emp_record
    from employees
    where employee_id = 100;
    -- 打印
    dbms_output.put_line(v_emp_record.v_sal || ',' || v_emp_record.v_mail || ',' || v_emp_record.v_hire_date);
  end
  ``` -->

## 複習 - 紀錄類型2
## 流程控制

## 游標的使用1
  對於 `處理多行紀錄` 的事務，經常使用 `游標` 來實現。

## 游標的使用2

## 異常處理機制

## 存儲函數 & 存儲過程

## 觸發器
