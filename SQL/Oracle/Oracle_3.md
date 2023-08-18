# Oracle 單行函數
## 目標
  通過本章學習，您將可以
  - SQL中 不同類型的函數
  - 在 `SELECT` 語句中，使用字符、數字、日期和 `轉換函數`
  - 使用 `條件表達式`

## 單行函數
  - 換作數據對象
  - 接受參數返回一個結果
  - `只對一行進行變換`
  - `每行返回一個結果`
  - 可以轉換數據類型
  - 可以嵌套
  - 參數可以是一列或一個值

    ```java
    function name [(arg1, arg2, ...)]
    ```

  - 五種類型
    - 字符
    - 數值
    - 日期
    - 轉換
    - 通用

## 字符函數
  - ### 大小寫控制函數
    - `LOWER`：轉換為小寫。
    - `UPPER`：轉換為大寫。
    - `INITCAP`：首字字母大寫，其餘轉成小寫。
  - ### 字符控制函數
    - `CONCAT`：`(a, b)` 連接字符串。
    - `SUBSTR`：`(a, 1, 5)` 從第一個字符位置開始，取 5 位的字符串。
    - `LENGTH`：`(a)` 計算字符串的長度
    - `INSTER`：`(a, W)` 計算 W 出現的位數
    - `LPAD(a, 10, '*')`、`RPAD(a, 10, '*')` 左邊/右邊 使用 `*` 填滿字元 至 10 碼
    - `TRIM(a FROM b)`：把 b 的首尾部去掉字符 a
    - `REPLACE(a, b, c)`：把 a 字符串的所有的 b 換成 c

## 數字函數
  - ### ROUND：四捨五入
    `ROUND(45.926, 2)` --> `45.93`
  - ### TRUNC：截斷
    `TRUNC(45.926, 2)`  --> `45.92`
  - ### MOD：求餘
    `MOD(1600, 300)` --> `100`

## 日期
  - `Oracle` 中的日期型數據，實際含有兩個值：`日期` 和 `時間`。
  - 函數 `SYSDATE` 返回：
    - `日期`
    - `時間`

  - ### 日期的數學運算
    - 在日期上 加上或減去 一個 `數字` 結果仍為日期。
    - 兩個日期相減返回`日期之間相差`的 `天數`
      - 日期不允許做加法運算，無意義
    - 可以用數字除 24 來向日期中加上或減去天數。

  - ### 日期函數
    |函數|簡述|
    |---|---|
    |`MONTHS_BETWEEN(f, s)`|兩個日期相差的月數|
    |`ADD_MONTHS(d, n)`|向指定日期中加上若干月數|
    |`NEXT_DAT(d, day_of_week)`|指定日期的下一個星期 對應的日期|
    |`LAST_DAT(S)`|本月的最後一天|
    |`ROUND(d, c)`|日期四捨五入|
    |`TRUNC(d, c)`|日期截斷|

## 轉換函數
  - ### 隱式數據類型轉換
    Oracle 自動完成下列轉換：
    |源數據類型|目標數據類型|
    |---|---|
    |`VARCHAR2 or CHAR`|`NUMBER`|
    |`VARCHAR2 or CHAR`|`DATE`|
    |`NUMBER`|`VARCHAR2`|
    |`DATE`|`VARCHAR2`|

  - ### 顯式數據類型轉換
    ![image_Oracle_3-1](./image_Oracle_3-1.png)

  - ### TO_CHAR 函數對日期的轉換
    ```sql
    TO_CHAR(date, "fromat_model")
    ```
    - #### 格式
      - 必須包含在單引號中，而且大小寫敏感
      - 可以包涵熱議的有效的日期格式。
      - 日期之間用逗號隔開
    
    ```SQL
    SELECT TO_CHAR(sysdate, 'yyyy-mm-dd hh:mm:ss') FROM dual;
    ```

  - ###  日期格式的元素
    | YYYY  | 2004                  |
    |-------|-----------------------|
    | YEAR  | TWO THOUSAND AND FOUR |
    | MM    | 02                    |
    | MONTH | JULY                  |
    | MON   | JUL                   |
    | DY    | MON                   |
    | DAY   | MONDAY                |
    | DD    | 02                    |

  - ### 日期格式的元素
    - 時間格式
      |HH24:MI:SS AM| 15:45:32 PM|
      |---|---|

    - 使用雙引號向日期中添加字符
      |DD "of" MONTH|12 or OCTOBER|
      |---|---|

  - ### TO_CHAR 函數對日期的轉換
    ```sql
    SELECT Last_name,
           TO_CHAR(hire_date, 'DD Month YYYY')
           AS HIREDATE
    FROM employees;
    ```

  - ### TO_DATE 函數對 字符的轉換
    - 使用 `TO_DATE`：
      ```sql
      TO_DATE(char[, 'format_model'])
      ```
    - 使用 `TO_DATE` 函數，將字符轉換成數字：
      ```sql
      TO_DATE('2012年10月29日 08:10:21', 'yyyy "年" mm "月" dd "日" hh:mi:ss')
      ```

  - ### TO_CHAR 函數對 數字 的轉換
    ```sql
    TO_CHAR(namber, "format_model")
    ```
    下面是在 `TO_CHAR` 函數中經常使用的幾種格式：
    | `9` | 數字         |
    |:---:|-------------|
    | `0` | 零           |
    | `$` | 美元符       |
    | `L` | 本地貨幣符號  |
    | `.` | 小樹點       |
    | `,` | 千位符       |

## 通用函數
  這些函數 `適用於任何數據類型，同時也適用於空值`
  - `NVL (expr1, expr2)`
  - `NVL2 (expr1, expr2, expr3)`
  - `NULLIF (expr1, expr2)`
  - `COALESCE (expr1, expr2, ..., exprn)`

  - ### NVL 函數
    將空值轉換成一個已知的值：
    - 可以使用的數據類型有日期、字符、數字。
    - 函數的一般型式：
      - `NVL(commission_pct, 0)`
      - `NVL(hire_date, '01-JAN-97')`
      - `NVL(job_id, 'No Job Yet')`

    > 練習1：求公司員工的年薪(含commission_pct)
      - 原始
        ```sql
        SELECT employee_id, last_name, salary*12*(1 + commission_pct)
        from employees
        ```

      - 將 commission_pct 為 null 的值，改為 0
        ```sql
        SELECT employee_id, last_name, salary*12*(1 + NVL(commission_pct, 0)) "annual sal"
        from employees
        ```

    > 練習2：輸出 last_name, department，當 department_id 為 null 時，顯示 `沒有部門`。
      - 原始
        ```sql
        SELECT last_name, department_id
        from employees
        ```

      - 將 department_id 為 null 的值，先轉成文字，再改為 `沒有部門`
        ```sql
        SELECT last_name, NVL(to_char(department_id, '999999'), '沒有部門')
        from employees
        ```

  - ### 使用 NVL2 函數
    `NVL2 (expr1, expr2, expr3)`：`expr1` 不為 `NULL`，返回 `expr2`，為 `NULL`，返回 `expr3`。

    ```sql
    SELECT last_name, salary, commission_pct, NVL2(commission_pct, 'SAL+COMM', 'SAL') income
    FROM employees
    WHERE department_id IN (50, 80);
    ```

    > 練習：查詢員工的獎金率，若為空，返回 `0.01`，若不為空，返回實際獎金率 + 0.015
      ```sql
      SELECT last_name, commission_pct, NVL2(commission_pct, commission_pct + 0.015, 0.01)
      FROM employees
      ```

  - ### 使用 NULLIF 函數
    NULLIF (expr1, expr2)：相等返回 `NULL`，不等返回expr1
    ```sql
    SELECT first_name, LENGTH(first_name) "expr1",
           last_name, LENGTH(last_name) "expr2",
           NULLIF(LENGTH(first_name), LENGTH(last_name)) result
    FROM employees
    ```

  - ### 使用 COALESCE 函數
    - `COALESCE` 與 `NVL` 相比的優點在於，`COALESCE` 可以同時處理交替的多個值。
    - 如果第一個表達式為空，則返回下一個表達式，依此類推，對其他的參數進行 `COALESCE`。

    ```sql
    SELECT last_name, COALESCE(commission_pct, salary, 10) comm
    FROM employees
    ORDER BY commission_pct;
    ```

## 條件表達式
  - 在 SQL 語句中使用 `IF-THEN-ELSE` 邏輯
  - 使用兩種方法：
    - `CASE` 表達式
    - `DECODE` 函數

  - ### CASE 表達式
    在需要使用 `IF-THEN-ELSE` 邏輯時：
    ```sql
    CASE expr WHEN comparison_expr1 THEN return_expr1
            [WHEN comparison_expr2 THEN return_expr2
            WHEN comparison_exprn THEN return exprn
            ELSE else_expr]
    END
    ```

    > 練習：查詢部門號 為 10、20、30 的員工信息，若部門號為 10，則打印其工資的 1.1倍，20 號部門，則打印其工資的 1.2 倍，30號部門打印其工資的 1.3 倍數。
      ```sql
      SELECT employee_id, last_name, department_id,
        CASE department_id
          WHEN 10 THEN salary * 1.1
          WHEN 20 THEN salary * 1.2
          ELSE salary * 1.3
        END new_sal
      FROM employees
      WHERE department_id in (10, 20, 30)
      ```

  - ### DECODE 函數
    在需要使用 `IF-THEN-ELSE` 邏輯時：
    ```sql
    DECODE(collexprssion, search1, result1,
      [, search2, result2,...,]
      [, default])
    ```
    ```sql
    SELECT last_name, job_id, salary,
      DECODE(job_id, 'IT_PROG', 1.10*salary,
                     'ST_CLERK', 1.15*salary,
                     'SA_REP') REVISED_SALARY
    FROM employees;
    ```

    ```sql
    SELECT employee_id, last_name, department_id,
          DECODE(department_id, 10, salary * 1.1,
                                20, salary * 1.2,
                                salary) new_sal
    FROM employees
    WHERE department_id in (10, 20, 30)
    ```

## 嵌套函數
  - 單行函數可以嵌套。
  - 嵌套函數的執行順序是由內到外
    ```java
    F3(F2(F1(col, arg1), arg2), arg3)
    ```

## 總結
  通過本章學習，應該學會：
  - 使用函數對數據進行計算
  - 使用函數修改數據
  - 使用函數控制一組數據的輸出格式
  - 使用函數改變日期的顯示格式
  - 使用 `轉換函數` 改變數據類型
  - 使用 `NVL函數`
  - 使用 `IF-THEN-ELSE`