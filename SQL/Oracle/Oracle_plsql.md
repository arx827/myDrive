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
        v_sal employees.salary#type,
        v_emp_id employees.employee_id#type,
        v_email employees.email#type,
        v_hiredate employees.hire_date#type
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

  ### 3. 整列資料
    ```SQL
    DECLARE
      -- 聲明自定義紀錄類型的變量
      v_emp_record employees#rowtype;
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
## 游標的使用
  在 PL/SQL 程序中，對於 `處理多行紀錄` 的事務，經常使用游標來實現。

  游標是一個指向上下文的句柄 (handle) 或指針。

  - ### 顯式游標處理
    顯式游標處理需四個 PL/SQL 步驟：
    - #### 定義游標：
      定義游標名，以及與其相對應的 `SELECT 語句`。
      - 格式：
        `CURSOR cursor_name[(parameter[, parameter]...)] IS select_statement;`
      - 在指定數據類型時，不能使用長度約束。如： `NUMBER(4)、CHAR(10)` 等都是錯誤的。

    - #### 打開游標：
      就是執行游標所對應的 SELECT 語句，將其查詢結果放入工作區，並且指針指向工作區的首部，標識游標結果集合。
      - 格式：
        `OPEN cursor_name[([parameter =>] value[, [parameter =>] value]...)];`
      - PL/SQL 程序，不能用 OPEN 語句，重複打開一個游標。

    - #### 提取游標數據
      就是檢索結果集合中的數據行，放入指定的輸出變量中。
      - 格式：
        `FETCH cursor_name INTO {variable_list | record_variable};`

    - #### 關閉游標
      當提取和處理完游標結果集合數據後，應即時關閉游標，以釋放該游標所佔用的系統資源。
      - 格式：
        `CLOSE cursor_name`;
      - 定義的游標不能有 `INTO` 子句。



    要求：打印出 80 部門的所有的員工的工資：salary:xxx
    ```SQL
    DECLARE
      -- 1. 定義游標
      cursor salary_cursor is
        SELECT
        FROM employees
        WHERE department_id = 80;

      v_salary employees.salary%type;
    BEGIN
      -- 2. 打開游標
      open salary_cursor;

      -- 3. 提取游標
      FETCH salary_cursor into v_salary;

      -- 4. 對游標進行循環操作：判斷游標中是否有下一條紀錄
      WHILE salary_cursor%found LOOP
        dbms_output.put_line('salary: ' || v_salary);
        FETCH salary_cursor into v_salary;
      END LOOP;

      -- 5. 關閉游標
      CLOSE salary_cursor;
    END
    ```


    ```SQL
    DECLARE
      -- 聲明一個紀錄類型
      type emp_record is record(
        v_sal employees.salary%type,
        v_empid employees.employee_id%type
      )

      -- 聲明一個紀錄類型的變量
      v_emp_record emp_record;

      -- 定義游標
      cursor emp_sal_cursor is
        SELECT salary, employee_id
        FROM employees
        WHERE department_id = 80;
    BEGIN
      -- 打開游標
      open emp_sal_cursor;

      -- 提取游標
      FETCH emp_sal_cursor into v_emp_record;

      WHILE emp_sal_cursor%found LOOP
        dbms_output.put_line('empid:' || v_emp_record.v_empid || ' salary:' || v_emp_record.v_sal);
        FETCH emp_sal_cursor into v_emp_record;
      END LOOP;

      -- 關閉游標
      CLOSE emp_sal_cursour;

    END;
    ```

  - #### 游標屬性
    | %FOUND    | 布爾型屬性，當最近一次讀紀錄時成功返回，則值為 TRUE |
    |-----------|---------------------------------------------|
    | %NOTFOUND | 布爾型屬性，與%FOUND相反                       |
    | %ISOPEN   | 布爾型屬性，當游標已打開時返回 TRUE              |
    | %ROWCOUNT | 數字型屬性，返回已從游標中讀取的紀錄數             |

  - #### 游標的 FOR 循環
    PL/SQL 語言提供了游標 FOR 循環語句，自動執行游標的 `OPEN`、`FETCH`、`CLOSE` 語句和 `循環` 語句的功能；
    當進入循環時，游標 FOR 循環語句 `自動` 打開游標，並提取第一行游標數據，當程序處理完當前所提取的數據而進入下一次循環時，游標 FOR 循環語句自動提取下一行數據供程序處理，當提取完結果集合中的所有數據行後結束循環，並自動關閉游標。

    - 格式：
      ```SQL
      FOR index_variable IN cursor_name[value[, value]...] LOOP
        -- 游標數據處理代碼
      END LOOP;
      ```
    
    - 範例：
      ```SQL
      DECLARE|
        -- 1. 定義游標
        cursor emp_sal_cursor is
          SELECT salary, employee_id, hire_date
          FROM employees
          WHERE department_id = 80;

      BEGIN
        FOR c in emp_sal_cursor LOOP
          dbms_output.put_line('empid:' || c.salary || ' salary:' || c.employee_id || ' hire_date:' ||c.hire_date);
        END LOOP;
      END;
      ```

## 異常處理機制
  異常情況處理(EXCEPTION) 是用來處理正常執行過程中，未預料的事件，程序塊的異常處理 預定義的錯誤 和 自定義錯誤，由於 PL/SQL 程序塊一但產生異常而沒有指出如何處理時，程序就會自動終止整個程序運行。

  有三種類型的異常錯誤：
  - 1. 預定義 (Predefined) 錯誤： 
    Oracle 預定義襶異常情況大約有 24 個。對這種異常情況的處理，無需在程序中定義，`由 Oracle 自動將其引發`。
  - 2. 非預定義 (Predefined) 錯誤： 
    即其他標準的 Oracle 錯誤。對這種異常情況的處理，需要用戶在程序中定義，然後由 Oracle 自動將其引發。
  - 3. 用戶定義 (User_define) 錯誤： 
    程序執行過程中，出現編程人員認為的非正常情況。對這種異常情況的處理，`需要用戶在程序中定義，然後顯式地在程序中將其引發`。

  異常處理部分一般放在 PL/SQL 程序體的後半部，結構為：
  ```SQL
  EXCEPTION
    WHEN first_exception THEN <code to handle first exception>
    WHEN second_exception THEN <code to handle second exception>
    WHEN OTHERS THEN <code to handle others exception>
  END;

  異常處理可以按任意次序排列，但 OTHERS 必須放在最後。
  ```

  - ### 預定義的異常處理
    | 錯誤號    | 異常錯誤信息名稱           | 說明                                                                         |
    |----------|-------------------------|------------------------------------------------------------------------------|
    | ORA-0001 | Dup_val_on_index        | 試圖破壞一個唯一性限制                                                           |
    | ORA-0051 | Timeout-on-resource     | 在等待資源時發生超時                                                            |
    | ORA-0061 | Transaction-backed-out  | 由於發生死鎖事務被撤銷                                                          |
    | ORA-1001 | Invalid-CURSOR          | 試圖使用一個無效的游標                                                          |
    | ORA-1012 | Not-logged-on           | 沒有連接到 Oracle                                                             |
    | ORA-1017 | Login-denied            | 無效的用戶名/口令                                                              |
    | ORA-1403 | No_data_found           | SELECT INTO 沒有找到數據                                                      |
    | ORA-1422 | Too_many_rows           | SELECT INTO 返回多行                                                          |
    | ORA-1476 | Zero-divide             | 試圖被零除                                                                    |
    | ORA-1722 | Invalid-NUMBER          | 轉換一個數字失敗                                                               |
    | ORA-6500 | Storage-error           | 內存不夠引發的內部錯誤                                                          |
    | ORA-6501 | Program-error           | 內存錯誤                                                                      |
    | ORA-6502 | Value-error             | 轉換或截斷錯誤                                                                 |
    | ORA-6504 | Rowtype-mismatch        | 宿主游標變量與PL/SQL變量有不兼容行類型                                            |
    | ORA-6511 | CURSOR-already-OPEN     | 試圖打開一個已存在的游標                                                        |
    | ORA-6530 | Access-INTO-null        | 試圖為null對象的屬性賦值                                                        |
    | ORA-6531 | Collection-is-null      | 試圖將 Exists 以外的集合(collection)方法應用於一個null pl/sql 表上或 varray 上     |
    | ORA-6532 | Subscript-outside-limit | 對嵌套或 varray 索引得引用超出聲明範圍以外                                        |
    | ORA-6533 | Subscript-beyond-count  | 對嵌套或 varray 索引得引用大於集合中元素的個數                                     |


    

## 存儲函數 & 存儲過程
  Oracle 提供可以把 PL/SQL 程序存儲在數據庫中，並可以在任何地方來運行它。這樣就叫存儲過程或函數。
  過程和函數統稱為 PL/SQL 子程序，他們是被命名的 PL/SQL 塊，均存儲在數據庫中，並通過輸入、輸出參數或輸入/輸出參數與其調用者交換信息。
  過程和函數的唯一區別是函數總向調用者返回數據，而過程則不返回數據。

  - ### 創建函數
    - 1. 建立內嵌函數
      語法如下：
        ```SQL
        CREATE [OR REPLACE] FUNCTION function_name
          [(argment[{IN | IN OUT}] Type,
            argment[{IN | OUT | IN OUT}] Type)]
          [AUTHID DEFINER | CURRENT_USER]
          RETURN return_type

        {IS | AS}
          <類型.變量的說明>
        BEGIN
          FUNCTION_body
        EXCEPTION
        
        END;
        ```

        ```SQL
        CREATE OR REPLACE FUNCTION function_name(dept_id number, salary number)
          RETURN number
        IS
          -- 函數使用過程中，需要聲明的變量、紀錄類型、cursor
        BEGIN
          -- 函數的執行體
        EXCEPTION
          -- 處理函數執行過程中的異常
        END;
        ```

## 觸發器



## 測驗

## 游標的使用
  - ### 13. 使用游標的練習：
    打印出 manager_id 為 100 的員工的 last_name, email, salary 信息 (使用游標，紀錄類型)

    - 方法一：
      ```SQL
      DECLARE
        -- 聲明游標
        cursor emp_cursor is
          SELECT last_name, email, salary
          FROM employees
          WHERE manager_id = 100;

        -- 聲明紀錄類型
        type emp_record is record(
          name employees.last_name%type,
          email employees.email%type,
          salary employees.salary%type
        );

        -- 聲明紀錄類型的變量
        v_emp_record emp_record;

      BEGIN
        -- 打開游標
        open emp_cursor;

        -- 提取游標
        FETCH emp_cursor into v_emp_record;

        -- 對游標進行循環操作
        WHILE emp_cursor%found LOOP
          dbms_output.put_line(v_emp_record.name || ', ' || v_emp_record.email || ', ' || v_emp_record.salary)
          FETCH emp_cursor into v_emp_record;
        END LOOP;

        -- 關閉游標
        CLOSE emp_cursor;
      END;
      ```

    - 方法二：使用 FOR 循環
      ```SQL
      DECLARE
        cursor emp_cursor is
          SELECT last_name, email, salary
          FROM employees
          WHERE manager_id = 100;
      BEGIN
        FOR v_emp_record in emp_cursor LOOP
          dbms_output.put_line(v_emp_record.last_name || ', ' || v_emp_record.email || ', ' || v_emp_record.salary);
        END LOOP;
      END;
      ```

  - ### 14. 利用游標，調整公司中員工的工資：
    | 工資範圍        | 調整基數  |
    |---------------|---------:|
    | 0 - 5000      |       5% |
    | 5000 - 10000  |       3% |
    | 10000 - 15000 |       2% |
    | 15000 -       |       1% |

    ```SQL
    DECLARE
      -- 定義游標
      cursor emp_sal_cursor is
        SELECT salary, employee_id
        FROM employees;

      -- 定義基數變量
      v_temp number(4, 2);

      v_empid employees.employee_id%type;
      v_sal employees.salary%type;
    BEGIN
      open emp_sal_cursor;
      FETCH emp_sal_cursor into v_empid, v_sal;

      WHILE emp_sal_cursor%found LOOP
        IF v_dal < 5000 THEN v_temp := 0.05;
        ELSIF v_sal < 10000 THEN v_temp := 0.03;
        ELSIF v_sal < 15000 THEN v_temp := 0.02;
        ELSE v_temp := 0.01;
        END IF;

        dbms_output.put_line(v_sal);

        UPDATE employees
        SET salary = salary * (1 + v_temp)
        WHERE employee_id = v_empid;

        FETCH emp_sal_cursor into v_empid, v_sal;
      END LOOP;

      -- 關閉游標
      close emp_sal_cursor;
    END
    ```

    使用 SQL 中的 decode 函數
    ```SQL
    UPDATE employees
    SET salary = salary * (1 + (decode(trunc(salary / 5000), 0, 0.05,
                                                                1, 0.03,
                                                                2, 0.02,
                                                                0.01)))
    ```

  - #### 15. 利用游標 FOR 循環完成 14.
    ```SQL
    DECLARE
      -- 定義游標
      cursor emp_sal_cursor is
        SELECT salary, employee_id id
        FROM EMPLOYEES;

      -- 定義基數變量
      temp number(4, 2);
    BEGIN
      -- 處理游標的循環操作
      FOR c in emp_sal_cursor LOOP
        -- 判斷員工的工資，執行 UPDATE 操作
        IF c.salary <= 5000 THEN
          temp := 0.05;
        ELSIF c.salary <= 10000 THEN
          temp := 0.03;
        ELSIF c.salary <= 15000 THEN
          temp := 0.02;
        ELSE
          temp := 0.01;
        END IF;

        -- dbms_output.put_line(v_id || ': ' || v_sal || ', ' || temp);
        UPDATE employees
        SET salary = salary * (1 + temp)
        WHERE employee_id = c.id;
      END LOOP;
    END
    ```

  - #### 16. 帶參數的游標
    ```SQL
    DECLARE
      -- 定義游標
      cursor emp_sal_cursor(dept_id number, sal number) is
        SELECT salary + 1000 sal, employee_id id
        FROM employees
        WHERE department_id = dept_id AND salary > sal;

      -- 定義基數變量
      temp number(4, 2);
    BEGIN
      -- 處理游標的循環操作
      FOR c in emp_dal_cursor(sal => 4000, dept_id => 80) LOOP
        -- 判斷員工的工資，執行 UPDATE 操作
        -- dbms_output.put_line(c_id || ': ' || s_sal);

        IF c.sal <= 5000 THEN
          temp := 0.05;
        ELSIF c.sal <= 10000 THEN
          temp := 0.03;
        ELSIF c.sal <= 15000 THEN
          temp := 0.02;
        ELSE
          temp := 0.01;
        END IF;

        dbms_output.put_line(c.sal || '： ' || c.id || ', ' || temp);
        -- UPDATE employees SET salary = salary * (1 + temp) WHERE employee_id = c.id;
      END LOOP;
    END;
    ```
    
  - #### 17. 隱式游標：更新指定員工 salary(漲工資 10)，如果該員工沒有找到，則打印 “查無此人” 信息
    ```SQL
    BEGIN
      UPDATE employees
      SET salary = salary + 10;
      WHERE employee_id = 1001;

      IF sql%notfound THEN
        dbms_output.put_line('查無此人');
      END IF;
    END;
    ```

## 異常處理
  - ### 預定義異常
    ```SQL
    DECLARE
      v_sal employees.salary%type;
    BEGIN
      SELECT salary into v_sal
      FROM employees
      WHERE employee_id > 100;

      dbms_output.put_line(v_sal);

    EXCEPTION
      WHEN Too_many_rows THEN dbms_output.put_line('輸出底行數太多了');
    END;
    ```

  - ### 非預定義異常
    ```SQL
    DECLARE
      v_sal employees.salary%type;
      -- 聲明一個異常
      delete_mgr_excep exception;
      -- 把自定義的異常和oracle的錯誤關聯起來
      PRAGMA EXCEPTION_INIT(delete_mgr_excep, -2292);
    BEGIN
      DELETE
      FROM employees
      WHERE employee_id = 100;

      SELECT salary into v_sal
      FROM employees
      WHERE employee_id > 100;

      dbms_output.put_line(v_sal);

    EXCEPTION
      WHEN Too_many_rows THEN dbms_output.put_line('輸出底行數太多了');
      WHEN delete_mgr_excep THEN dbms_output.put_line('Manager不能直接被刪除');
    END;
    ```

  - ### 用戶自定義異常
    ```SQL
    DECLARE
      v_sal employees.salary%type;
      -- 聲明一個異常
      delete_mgr_excep exception;
      -- 把字定義的異常和 oracle 的錯誤關聯起來
      PRAGMA EXCEPTION_INIT(delete_mgr_excep, -2292);

      -- 聲明一個異常
      too_high_sal exception;
    BEGIN
      SELECT salary into v_sal
      FROM employees
      WHERE employee_id = 100;

      IF v_sal > 1000 THEN
        raise too_high_sal;
      END IF;

      DELETE
      FROM employees
      WHERE employee_id = 100;

      dbms_output.put_line(v_sal);
    EXCEPTION
      WHEN Too_many_rows THEN dbms_output.put_line('輸出底行數太多了');
      WHEN delete_mgr_excep THEN dbms_output.put_line('Manager不能直接被刪除');
      -- 處理異常
      WHEN too_high_sal THEN dbms_output.put_line('工資過高了');
    END;
    ```

  - ### 18. 異常的基本程序：
    通過 SELECT ... into ... 查詢某人的工資，若沒有查詢到，則輸出 "未找到數據"

    ```SQL
    DECLARE
      -- 定義一個變量
      v_sal employees.salary%type;
    BEGIN
      -- 使用 SELECT ... into ... 為 v_sal 賦值
      SELECT salary into v_sal
      FROM employees
      WHERE employee_id = 1000;

      dbms_output.put_line('salary: ' || v_sal);

    EXCEPTION
      WHEN No_data_found THEN
        dbms_output.put_line('未找到數據');
      WHEN Too_many_rows THEN
        dbms_output.put_line('數據過多！');
    END
    ```

  - ### 19. 更新指定員工工資，如工資小於 300，則加 100；對 NO_DATA_FOUND 異常， TOO_MANY_ROWS 進行處理。
    ```SQL
    DECLARE
      v_sal employees.salary%type;
    BEGIN
      SELECT salary into v_sal
      FROM employees
      WHERE employee_id = 100;

      IF(v_sal < 300) THEN
        UPDATE employees
        SET salary = salary + 100
        WHERE employee_id = 100;
      ELSE dbms_output.put_line('工資大於 300');
      END IF;
    EXCEPTION
      WHEN No_data_found THEN
        dbms_output.put_line('未找到數據');
      WHEN Too_many_rows THEN
        dbms_output.put_line('輸出的行數太多了！');
    END
    ```

  - ### 20. 處理非預定義襶異常處理："違反完整約束條件"
    ```SQL
    DECLARE
      -- 1. 定義異常
      temp_exception exception;

      -- 2. 將其定義好的異常情況，與標準的 Oracle 錯誤聯繫起來，使用 EXCEPTION_INIT 語句
      PRAGMA EXCEPTION_INIT(temp_exception, -2292);
    BEGIN
      delete FROM employees WHERE employee_id = 100;
    EXCEPTION
      -- 3. 處理異常
      WHEN temp_exception THEN
        dbms_output.put_line('違反完整性約束！');
    END;
    ```

  - ### 21. 自定義異常：更新指定員工工資，增加 100；若該員工不存在，則拋出用戶自定義異常：no_result
    ```SQL
    DECLARE
      -- 自定義異常
      no_result exception;
    BEGIN
      UPDATE employees
      SET salary = salary + 100
      WHERE employee_id = 1001;

      -- 使用隱式游標，拋出自定義異常
      IF sql%notfound THEN
        raise no_result;
      END IF;
    EXCEPTION
      -- 處理程序拋出的異常
      WHEN no_result THEN
        dbms_output.put_line('更新失敗');
    END;
    ```

## 存儲函數和過程
[存儲函數：有返回值，創建完成後，通過 select function() from dual; 執行]
[存儲過程：由於沒有返回值，創建完成後，不能使用 select 語句，只能使用 pl/sql 塊執行]
[格式]
  ```SQL
  -- 函數的聲明(有參數的寫在小括號裡)
  CREATE OR REPLACE function func_name(v_param varchar2)
    -- 返回值類型
    return varchar2
  IS
    -- PL/SQL 塊變量，紀錄類型、游標的聲明(類似於前面的 declare 的部分)
  BEGIN
    -- 函數體 (可以實現增刪改查等操作，返回值需要 return)
    return 'helloworld' || v_logo;
  END;
  ```

  - ### 22.1 函數的 helloworld：返回一個 "helloworld" 的字符串
    ```SQL
    CREATE OR REPLACE FUNCTION hello_func
      return varchar2
    IS
    BEGIN
      return 'helloworld';
    END;
    ```

    執行函數
    ```SQL
    BEGIN
      dbms_output.put_line(hello_func());
    END;
    ```

    或者：
    ```SQL
    SELECT hello_func()
    FROM dual;
    ```

  - ### 22.2 返回一個 "helloworld: atguigu" 的字符串，其他 atguigu 由執行函數時輸入。
    ```SQL
    -- 函數的聲明 (有參數的寫在小括號裡)
    CREATE OR REPLACE FUNCTION hello_func(v_logo varchar2)

    -- 返回值類型
    return varchar2

    is
    -- PL/SQL 塊變量的聲明

    BEGIN
    -- 函數體
      return 'helloworld' || v_logo;

    END;
    ```

  - ### 22.3 創建一個存儲函數，返回當前的系統時間
    ```SQL
    CREATE OR REPLACE FUNCTION func1
      return date

    is
      -- 定義變量
      v_date date;
    
    BEGIN
      -- 函數體
      -- v_date := sysdate;
      SELECT sysdate into v_date
      FROM dual;
      dbms_output.put_line('我是函數喔');

      return v_date;

    END;
    ```

    - 執行法1
      ```SQL
      SELECT func1 FROM dual;
      ```
    - 執行法2
      ```SQL
      DECLARE
        v_date date;
      BEGIN
        v_date := func1;
        dbms_output.put_line(v_date);
      END;
      ```

  - ### 23. 定義帶參數的函數：兩個數相加
    ```SQL
    CREATE OR REPLACE FUNCTION add_func(a number, b number)
      return number
    IS
    BEGIN
      return (a + b);
    END;
    ```
    執行函數：
    ```SQL
    BEGIN
      dbms_output.put_line(add_func(12, 13));
    END;
    ```
    或者：
    ```SQL
    SELECT add_func(12, 13) FROM dual;
    ```

  - ### 24. 定義一個函數：獲取給定部門的工資總和，要求：部門號定義為參數，工資總額定義為返回值。
    ```SQL
    CREATE OR REPLACE FUNCTION sum_sal(dept_id number)
      return number

      is

      cursor sal_cursor is
        SELECT salary
        FROM employees
        WHERE department_id = dept_id;
      
      v_sum_sal number(8) := 0;

    BEGIN
      FOR c in sal_cursor LOOP
        v_sum_sal := v_sum_sal + c.salary;
      END LOOP;

      -- dbms_output.put_line('sum salary: ' || v_sum_sal);
      return v_sum_sal;
    
    END;
    ```

    執行函數：
    ```SQL
    BEGIN
      dbms_output.put_line(sum_sal(80));
    END;
    ```

  - ### 25. 關於 OUT 型的參數：因為函數只能有一個返回值，PL/SQL 程序可以通過 OUT 型的參數實現有多個返回值
    要求

    24:40





