# Oracle 約束 Constraint

## 目標
  通過本章學習，您將可以
  - 描述約束
  - 創建和維護約束

## 什麼是約束
  - 約束是表級的強制規定
  - 有以下五種約束：
    - `NOT NULL` 非空約束，規定某個字段不能為空。
    - `UNIQUE` 唯一約束，規定某個字段在整個表中是唯一的。
    - `PRIMARY KEY` 主鍵(非空且唯一)約束。
    - `FOREIGN KEY` 外鍵約束
    - `CHECK` 檢查約束
    - `DEFAULT` 默認值約束

## 注意事項
  - 如果不指定約束名，`Oracle server` 自動按照 `SYS_Cn` 的格式指定約束名。
  - `創建` 和 `修改` 約束
    - 創建： `建表的同時`
    - 修改： `建表之後`
  - 可以在 `表級` 或 `列級` 定義約束。
  - 可以通過數據字典視圖查看約束。

## 表級約束 和 列級約束
  - ### 作用範圍：
    - 1. `列級約束` 只能作用在一個列上。
    - 2. `表級約束` 可以作用在多個列上 (當然表級約束也可以作用在一個列上)
  - ### 定義方式：
    - 列約束，必須跟在列的定義後面。
    - 表約束，不與列一起，而是單獨定義。
  - `非空 (not null) 約束` 只能定義在列上。

## 定義約束
  ```SQL
  CREATE TABLE [schema.] table
              (column datatype [DEFAULT expr]
               [column_constraint],
               ...
               [table_constraint][,...]);
  ```

  ```SQL
  CREATE TABLE employees(
    employee_id NUMBER(6)
    first_name VARCHAR2(20),
    ...
    job_id VARCHAR2(10) NOT NULL,
    CONSTRAINT emp_emp_id_pk PRIMARY KEY (EMPLOYEE_ID)
  );
  ```

  - 列級
    ```SQL
    column [CONSTRAINT constraint_name] constraint_type,
    ```
  - 表級
    ```SQL
    column,...
      [CONSTRAINT constraint_name] constraint_type
      (column, ...),
    ```

## 查看某個表已有的約束
  ```SQL
  -- information_schema 數據庫名（系統庫）
  -- table_constraints 表名稱（專門存儲各個表的約束）
  SELECT * FROM information_schema.table_constraints 
  WHERE table_name = '表名稱';
  ```

## NOT NULL 非空約束
  - 限定某個字段 / 某列的值不允許為空
  - 只能定義在列級
  - 特點：
    - 默認，所有的類型的值都可以是NULL，包括INT、FLOAT等數據類型
    - 非空約束只能出現在表對象的列上，只能某個列單獨限定非空，不能組合非空
    - 一個表可以有很多列都分別限定了非空
    - 空字符串''不等於NULL，0也不等於NULL

  - ### 添加非空約束
    - 1. 建表時
      ```SQL
      CREATE TABLE 表名稱(
        字段名  數據類型,
        字段名  數據類型 NOT NULL,  
        字段名  數據類型 NOT NULL
      );
      ```
      - 舉例：
        ```SQL
        CREATE TABLE emp(
          id INT(10) NOT NULL,
          NAME VARCHAR(20) NOT NULL,
          sex CHAR NULL
        );
        ```
        ```SQL
        CREATE TABLE student(
          sid int,
          sname varchar(20) not null,
          tel char(11) ,
          cardid char(18) not null
        );
        ```
        ```SQL
        insert into student values(1,'張三','13710011002','110222198912032545');  -- 成功

        insert into student values(2,'李四','13710011002',null); -- 身份證號為空
        ERROR 1048 (23000): Column 'cardid' cannot be null

        insert into student values(2,'李四',null,'110222198912032546'); -- 成功，tel允許為空

        insert into student values(3,null,null,'110222198912032547'); -- 失敗
        ERROR 1048 (23000): Column 'sname' cannot be null
        ```

    - 2. 建表後
      ```SQL
      alter table 表名稱 modify 字段名 數據類型 not null;
      ```
      - 舉例：
        ```SQL
        ALTER TABLE emp
        MODIFY sex VARCHAR(30) NOT NULL;
        ```
        ```SQL
        alter table student modify sname varchar(20) not null;
        ```
  
  - ### 刪除非空約束
    ```SQL
    alter table 表名稱 modify 字段名 數據類型 NULL; -- 去掉not null，相當於修改某個非註解字段，該字段允許為空

    -- 或 

    alter table 表名稱 modify 字段名 數據類型; -- 去掉not null，相當於修改某個非註解字段，該字段允許為空
    ```

    - 舉例：
      ```SQL
      ALTER TABLE emp
      MODIFY sex VARCHAR(30) NULL;
      ```
      ```SQL
      ALTER TABLE emp
      MODIFY NAME VARCHAR(15) DEFAULT 'abc' NULL;
      ```

    可以再 `PL/SQLDEV` 的 `My objects-Tables-employees-Check constraints` 中查看。

## UNIQUE 唯一性約束
  - 用來限制某個字段 / 某列的值不能重複。
  - 特點
    - 同一個表可以有多個唯一約束。
    - 唯一約束可以是某一個列的值唯一，也可以多個列組合的值唯一。
    - 唯一性約束允許列值為空。
    - 在創建唯一約束的時候，如果不給唯一約束命名，就默認和列名相同。
    - MySQL 會給唯一約束的列上默認創建一個唯一索引。

  - ### 添加唯一約束
    - 1. 建表時
      ```SQL
      create table 表名稱(
        字段名  數據類型,
        字段名  數據類型  unique,  
        字段名  數據類型  unique key,
        字段名  數據類型
      );
      create table 表名稱(
        字段名  數據類型,
        字段名  數據類型,  
        字段名  數據類型,
        [constraint 約束名] unique key(字段名)
      );
      ```
      - 舉例：
        ```SQL
        create table student(
          sid int,
          sname varchar(20),
          tel char(11) unique,
          cardid char(18) unique key
        );
        ```
        ```SQL
        CREATE TABLE t_course(
          cid INT UNIQUE,
          cname VARCHAR(100) UNIQUE,
          description VARCHAR(200)
        );
        ```
        ```SQL
        CREATE TABLE USER(
          id INT NOT NULL,
          NAME VARCHAR(25),
          PASSWORD VARCHAR(16),
          -- 使用表級約束語法
          CONSTRAINT uk_name_pwd UNIQUE(NAME,PASSWORD)
        );

        -- 表示用戶名和密碼組合不能重複
        ```
        ```SQL
        insert into student values(1,'張三','13710011002','101223199012015623');
        insert into student values(2,'李四','13710011003','101223199012015624');
        ```
        ```SQL
        mysql> select * from student;
        +-----+-------+-------------+--------------------+
        | sid | sname | tel         | cardid             |
        +-----+-------+-------------+--------------------+
        |   1 | 張三  | 13710011002 | 101223199012015623 |
        |   2 | 李四  | 13710011003 | 101223199012015624 |
        +-----+-------+-------------+--------------------+
        2 rows in set (0.00 sec)
        ```
        ```SQL
        insert into student values(3,'王五','13710011004','101223199012015624'); -- 身份證號重複
        ERROR 1062 (23000): Duplicate entry '101223199012015624' for key 'cardid'

        insert into student values(3,'王五','13710011003','101223199012015625'); 
        ERROR 1062 (23000): Duplicate entry '13710011003' for key 'tel'
        ```
    - 2. 建表後指定唯一鍵約束
      ```SQL
      -- 字段列表中如果是一個字段，表示該列的值唯一。如果是兩個或更多個字段，那麼複合唯一，即多個字段的組合是唯一的

      -- 方式1：
      alter table 表名稱 add unique key(字段列表);

      -- 方式2：
      alter table 表名稱 modify 字段名 字段類型 unique;
      ```
      - 舉例：
        ```SQL
        ALTER TABLE USER 
        ADD UNIQUE(NAME,PASSWORD);
        ```
        ```SQL
        ALTER TABLE USER 
        ADD CONSTRAINT uk_name_pwd UNIQUE(NAME,PASSWORD);
        ```
        ```SQL
        ALTER TABLE USER 
        MODIFY NAME VARCHAR(20) UNIQUE;
        ```
        ```SQL
        create table student(
          sid int primary key,
          sname varchar(20),
          tel char(11) ,
          cardid char(18) 
        );
        ```
        ```SQL
        alter table student add unique key(tel);
        alter table student add unique key(cardid);
        ```

  - ### 關於復合唯一約束
    ```SQL
    create table 表名稱(
      字段名  數據類型,
      字段名  數據類型,  
      字段名  數據類型,
      unique key(字段列表) #字段列表中寫的是多個字段名，多個字段名用逗號分隔，表示那麼是複合唯一，即多個字段的組合是唯一的
    );
    ```
    ```SQL
    -- 學生表
    create table student(
      sid int,	-- 學號
      sname varchar(20),			-- 姓名
      tel char(11) unique key,  -- 電話
      cardid char(18) unique key -- 身份證號
    );

    -- 課程表
    create table course(
      cid int,  -- 課程編號
      cname varchar(20)     -- 課程名稱
    );

    -- 選課表
    create table student_course(
      id int,
      sid int,
      cid int,
      score int,
      unique key(sid,cid)  -- 複合唯一
    );
    ```
    ```SQL
    insert into student values(1,'張三','13710011002','101223199012015623');  -- 成功
    insert into student values(2,'李四','13710011003','101223199012015624');  -- 成功
    insert into course values(1001,'Java'),(1002,'MySQL');  -- 成功
    ```
    ```SQL
    mysql> select * from student;
    +-----+-------+-------------+--------------------+
    | sid | sname | tel         | cardid             |
    +-----+-------+-------------+--------------------+
    |   1 | 張三  | 13710011002 | 101223199012015623 |
    |   2 | 李四  | 13710011003 | 101223199012015624 |
    +-----+-------+-------------+--------------------+
    2 rows in set (0.00 sec)

    mysql> select * from course;
    +------+-------+
    | cid  | cname |
    +------+-------+
    | 1001 | Java  |
    | 1002 | MySQL |
    +------+-------+
    2 rows in set (0.00 sec)
    ```
    ```SQL
    insert into student_course values
    (1, 1, 1001, 89),
    (2, 1, 1002, 90),
    (3, 2, 1001, 88),
    (4, 2, 1002, 56); -- 成功
    ```
    ```SQL
    mysql> select * from student_course;
    +----+------+------+-------+
    | id | sid  | cid  | score |
    +----+------+------+-------+
    |  1 |    1 | 1001 |    89 |
    |  2 |    1 | 1002 |    90 |
    |  3 |    2 | 1001 |    88 |
    |  4 |    2 | 1002 |    56 |
    +----+------+------+-------+
    4 rows in set (0.00 sec)
    ```
    ```SQL
    insert into student_course values (5, 1, 1001, 88); -- 失敗

    -- ERROR 1062 (23000): Duplicate entry '1-1001' for key 'sid'   違反sid-cid的複合唯一
    ```

  - ### 刪除唯一約束
    - 添加唯一性約束的列上也會自動創建唯一索引。
    - 刪除唯一約束只能通過刪除唯一索引的方式刪除。
    - 刪除時需要指定唯一索引名，唯一索引名就和唯一約束名一樣。
    - 如果創建唯一約束時未指定名稱，如果是單列，就默認和列名相同；如果是組合列，那麼默認和()中排在第一個的列名相同。也可以自定義唯一性約束名。

    ```SQL
    SELECT * FROM information_schema.table_constraints WHERE table_name = '表名'; -- 查看都有哪些約束
    ```
    ```SQL
    ALTER TABLE USER 
    DROP INDEX uk_name_pwd;
    ```
    > 注意：可以通過show index from 表名稱; 查看表的索引

## PRIMARY KEY 約束
  - ### 作用
    用來唯一標識表中的一行記錄。
  - ### 特點
    - 主鍵約束相當於 `唯一約束` + `非空約束` 的組合，主鍵約束列不允許重複，也不允許出現空值。
    - 一個表最多只能有 `一個` 主鍵約束，建立主鍵約束可以在 `列級別` 創建，也可以在 `表級別` 上創建。
    - 主鍵約束對應著表中的一列或者多列（複合主鍵）。
    - 如果是多列組合的複合主鍵約束，那麼這些列都不允許為空值，並且組合的值不允許重複。
    - MySQL的主鍵名總是PRIMARY，就算自己命名了主鍵約束名也沒用。
    - 當創建主鍵約束時，系統默認會在所在的列或列組合上建立對應的主鍵索引（能夠根據主鍵查詢的，就根據主鍵查詢，效率更高）。如果刪除主鍵約束了，主鍵約束對應的索引就自動刪除了。
    - 需要注意的一點是，不要修改主鍵字段的值。因為主鍵是數據記錄的唯一標識，如果修改了主鍵的值，就有可能會破壞數據的完整性。

  - ### 添加主鍵約束
    - #### 建表時指定主鍵約束
      ```SQL
      create table 表名稱(
        字段名  數據類型  primary key, #列級模式
        字段名  數據類型,  
        字段名  數據類型  
      );
      create table 表名稱(
        字段名  數據類型,
        字段名  數據類型,  
        字段名  數據類型,
        [constraint 約束名] primary key(字段名) #表級模式
      );
      ```
      - 舉例：
        ```SQL
        create table temp(
          id int primary key,
          name varchar(20)
        );
        ```
        ```SQL
        mysql> desc temp;
        +-------+-------------+------+-----+---------+-------+
        | Field | Type        | Null | Key | Default | Extra |
        +-------+-------------+------+-----+---------+-------+
        | id    | int(11)     | NO   | PRI | NULL    |       |
        | name  | varchar(20) | YES  |     | NULL    |       |
        +-------+-------------+------+-----+---------+-------+
        2 rows in set (0.00 sec)
        ```
        ```SQL
        insert into temp values(1,'張三'); -- 成功
        insert into temp values(2,'李四'); -- 成功
        ```
        ```SQL
        mysql> select * from temp;
        +----+------+
        | id | name |
        +----+------+
        |  1 | 張三 |
        |  2 | 李四 |
        +----+------+
        2 rows in set (0.00 sec)
        ```
        ```SQL
        insert into temp values(1,'張三'); -- 失敗
        ERROR 1062 (23000): Duplicate（重複） entry（鍵入，輸入） '1' for key 'PRIMARY'

        insert into temp values(1,'王五'); -- 失敗
        ERROR 1062 (23000): Duplicate entry '1' for key 'PRIMARY'

        insert into temp values(3,'張三'); -- 成功
        ```
        ```SQL
        mysql> select * from temp;
        +----+------+
        | id | name |
        +----+------+
        |  1 | 張三 |
        |  2 | 李四 |
        |  3 | 張三 |
        +----+------+
        3 rows in set (0.00 sec)
        ```
        ```SQL
        insert into temp values(4,null); -- 成功

        insert into temp values(null,'李琦'); -- 失敗
        ERROR 1048 (23000): Column 'id' cannot be null
        ```
        ```SQL
        mysql> select * from temp;
        +----+------+
        | id | name |
        +----+------+
        |  1 | 張三 |
        |  2 | 李四 |
        |  3 | 張三 |
        |  4 | NULL |
        +----+------+
        4 rows in set (0.00 sec)
        ```
        ```SQL
        -- 演示一個表建立兩個主鍵約束
        create table temp(
          id int primary key,
            name varchar(20) primary key
        );
        ERROR 1068 (42000): Multiple（多重的） primary key defined（定義）
        ```

        - 列級約束
          ```SQL
          CREATE TABLE emp4(
            id INT PRIMARY KEY AUTO_INCREMENT ,
            NAME VARCHAR(20)
          );
          ```
        - 表級約束
          ```SQL
          CREATE TABLE emp5(
            id INT NOT NULL AUTO_INCREMENT,
            NAME VARCHAR(20),
            pwd VARCHAR(15),
            CONSTRAINT emp5_id_pk PRIMARY KEY(id)
          );
          ```
    - #### 建表後增加主鍵約束
      ```SQL
      ALTER TABLE 表名稱 ADD PRIMARY KEY(字段列表); -- 字段列表可以是一個字段，也可以是多個字段，如果是多個字段的話，是複合主鍵
      ```
      ```SQL
      ALTER TABLE student ADD PRIMARY KEY (sid);
      ```
      ```SQL
      ALTER TABLE emp5 ADD PRIMARY KEY(NAME,pwd);
      ```
  - ### 關於復合主鍵
    ```SQL
    create table 表名稱(
      字段名  數據類型,
      字段名  數據類型,  
      字段名  數據類型,
      primary key(字段名1,字段名2)  -- 表示字段1和字段2的組合是唯一的，也可以有更多個字段
    );
    ```
    - 舉例：
      ```SQL
      -- 學生表
      create table student(
        sid int primary key,  -- 學號
        sname varchar(20)     -- 學生姓名
      );

      -- 課程表
      create table course(
        cid int primary key,  -- 課程編號
        cname varchar(20)     -- 課程名稱
      );

      -- 選課表
      create table student_course(
        sid int,
        cid int,
        score int,
        primary key(sid,cid)  -- 複合主鍵
      );
      ```
      ```SQL
      insert into student values(1,'張三'),(2,'李四');
      insert into course values(1001,'Java'),(1002,'MySQL');
      ```
      ```SQL
      mysql> select * from student;
      +-----+-------+
      | sid | sname |
      +-----+-------+
      |   1 | 張三  |
      |   2 | 李四  |
      +-----+-------+
      2 rows in set (0.00 sec)

      mysql> select * from course;
      +------+-------+
      | cid  | cname |
      +------+-------+
      | 1001 | Java  |
      | 1002 | MySQL |
      +------+-------+
      2 rows in set (0.00 sec)
      ```
      ```SQL
      insert into student_course values(1, 1001, 89),(1,1002,90),(2,1001,88),(2,1002,56);
      ```
      ```SQL
      mysql> select * from student_course;
      +-----+------+-------+
      | sid | cid  | score |
      +-----+------+-------+
      |   1 | 1001 |    89 |
      |   1 | 1002 |    90 |
      |   2 | 1001 |    88 |
      |   2 | 1002 |    56 |
      +-----+------+-------+
      4 rows in set (0.00 sec)
      ```
      ```SQL
      insert into student_course values(1, 1001, 100);
      ERROR 1062 (23000): Duplicate entry '1-1001' for key 'PRIMARY'
      ```
      ```SQL
      mysql> desc student_course;
      +-------+---------+------+-----+---------+-------+
      | Field | Type    | Null | Key | Default | Extra |
      +-------+---------+------+-----+---------+-------+
      | sid   | int(11) | NO   | PRI | NULL    |       |
      | cid   | int(11) | NO   | PRI | NULL    |       |
      | score | int(11) | YES  |     | NULL    |       |
      +-------+---------+------+-----+---------+-------+
      3 rows in set (0.00 sec)
      ```

    - 再舉例：
      ```SQL
      CREATE TABLE emp6(
        id INT NOT NULL,
        NAME VARCHAR(20),
        pwd VARCHAR(15),
        CONSTRAINT emp7_pk PRIMARY KEY(NAME,pwd)
      );
      ```
  - ### 刪除主鍵約束
    ```SQL
    alter table 表名稱 drop primary key;
    ```
    - 舉例：
      ```SQL
      ALTER TABLE student DROP PRIMARY KEY;
      ```
      ```SQL
      ALTER TABLE emp5 DROP PRIMARY KEY;
      ```

## 自增列 AUTO_INCREMENT
  - ### 作用
    某個字段的值自增

  - ### 特點和要求
    - 1. 一個表最多只能有一個自增長列。
    - 2. 當需要產生唯一標識符或順序值時，可設置自增長。
    - 3. 自增長列約束的列必須是鍵列（主鍵列，唯一鍵列）。
    - 4. 自增約束的列的數據類型必須是整數類型。
    - 5. 如果自增列指定了 `0` 和 `null`，會在當前最大值的基礎上自增；如果自增列手動指定了具體值，直接賦值為具體值。

    - 錯誤演示：
      ```SQL
      create table employee(
        eid int auto_increment,
        ename varchar(20)
      );
      -- ERROR 1075 (42000): Incorrect table definition; there can be only one auto column and it must be defined as a key   
      ```
      ```SQL
      create table employee(
        eid int primary key,
        ename varchar(20) unique key auto_increment
      );
      -- ERROR 1063 (42000): Incorrect column specifier for column 'ename'  因為ename不是整數類型
      ```

  - ### 如何指定自增約束
    - 1. 建表時
      ```SQL
      create table 表名稱(
        字段名  數據類型  primary key auto_increment,
        字段名  數據類型  unique key not null,  
        字段名  數據類型  unique key,
        字段名  數據類型  not null default 默認值, 
      );
      create table 表名稱(
        字段名  數據類型 default 默認值 ,
        字段名  數據類型 unique key auto_increment,  
        字段名  數據類型 not null default 默認值,
        primary key(字段名)
      );
      ```
      - 舉例：
        ```SQL
        create table employee(
          eid int primary key auto_increment,
          ename varchar(20)
        );
        ```
        ```SQL
        mysql> desc employee;
        +-------+-------------+------+-----+---------+----------------+
        | Field | Type        | Null | Key | Default | Extra          |
        +-------+-------------+------+-----+---------+----------------+
        | eid   | int(11)     | NO   | PRI | NULL    | auto_increment |
        | ename | varchar(20) | YES  |     | NULL    |                |
        +-------+-------------+------+-----+---------+----------------+
        2 rows in set (0.00 sec)
        ```

    - 2. 建表後
      ```SQL
      alter table 表名稱 modify 字段名 數據類型 auto_increment;
      ```
      - 舉例：
        ```SQL
        create table employee(
          eid int primary key ,
          ename varchar(20)
        );
        ```
        ```SQL
        alter table employee modify eid int auto_increment;
        ```
        ```SQL
        mysql> desc employee;
        +-------+-------------+------+-----+---------+----------------+
        | Field | Type        | Null | Key | Default | Extra          |
        +-------+-------------+------+-----+---------+----------------+
        | eid   | int(11)     | NO   | PRI | NULL    | auto_increment |
        | ename | varchar(20) | YES  |     | NULL    |                |
        +-------+-------------+------+-----+---------+----------------+
        2 rows in set (0.00 sec)
        ```

  - ### 如何刪除自增約束
    ```SQL
    -- alter table 表名稱 modify 字段名 數據類型 auto_increment; -- 給這個字段增加自增約束

    alter table 表名稱 modify 字段名 數據類型; -- 去掉auto_increment相當於刪除
    ```
    - 舉例：
      ```SQL
      alter table employee modify eid int;
      ```
      ```SQL
      mysql> desc employee;
      +-------+-------------+------+-----+---------+-------+
      | Field | Type        | Null | Key | Default | Extra |
      +-------+-------------+------+-----+---------+-------+
      | eid   | int(11)     | NO   | PRI | NULL    |       |
      | ename | varchar(20) | YES  |     | NULL    |       |
      +-------+-------------+------+-----+---------+-------+
      2 rows in set (0.00 sec)
      ```

  - ### MySQL 8.0新特性—自增變量的持久化
    在 `MySQL 8.0` 之前，自增主鍵 `AUTO_INCREMENT` 的值如果大於 `max(primary key)+1`，在`MySQL` 重啟後，會重置 `AUTO_INCREMENT = max(primary key)+1`，這種現像在某些情況下會導致業務主鍵衝突或者其他難以發現的問題。
    下面通過案例來對比不同的版本中自增變量是否持久化。
    - #### 在MySQL 5.7版本中，測試步驟如下：
      - 創建的數據表中包含自增主鍵的id字段，語句如下：
        ```SQL
        CREATE TABLE test1(
          id INT PRIMARY KEY AUTO_INCREMENT
        );
        ```

      - 插入4個空值，執行如下：
        ```SQL
        INSERT INTO test1
        VALUES(0),(0),(0),(0);
        ```

      - 查詢數據表test1中的數據，結果如下：
        ```SQL
        mysql> SELECT * FROM test1;
        +----+
        | id |
        +----+
        |  1 |
        |  2 |
        |  3 |
        |  4 |
        +----+
        4 rows in set (0.00 sec)
        ```

      - 刪除id為4的記錄，語句如下：
        ```SQL
        DELETE FROM test1 WHERE id = 4;
        ```

      - 再次插入一個空值，語句如下：
        ```SQL
        INSERT INTO test1 VALUES(0);
        ```

      - 查詢此時數據表test1中的數據，結果如下：
        ```SQL
        mysql> SELECT * FROM test1;
        +----+
        | id |
        +----+
        |  1 |
        |  2 |
        |  3 |
        |  5 |
        +----+
        4 rows in set (0.00 sec)
        ```

      - 從結果可以看出，雖然刪除了id為4的記錄，但是再次插入空值時，並沒有重用被刪除的4，而是分配了5。
      刪除id為5的記錄，結果如下：
        ```SQL
        DELETE FROM test1 where id=5;
        ```

      - `重啟數據庫`，重新插入一個空值。
        ```SQL
        INSERT INTO test1 values(0);
        ```
        ```SQL
        mysql> SELECT * FROM test1;
        +----+
        | id |
        +----+
        |  1 |
        |  2 |
        |  3 |
        |  4 |
        +----+
        4 rows in set (0.00 sec)
        ```

      > 從結果可以看出，新插入的 `0` 值分配的是 `4`，按照重啟前的操作邏輯，此處應該分配 `6`。出現上述結果的主要原因是 `自增主鍵沒有持久化`。
      > 在 `MySQL 5.7` 系統中，對於自增主鍵的分配規則，是由 `InnoDB` 數據字典內部一個來 `計數器` 決定的，而該計數器只在 `記憶體中維護`，並不會持久化到磁盤中。當數據庫重啟時，該計數器會被初始化。

    - #### 在MySQL 8.0版本中，上述測試步驟最後一步的結果如下：
      ```SQL
      mysql> SELECT * FROM test1;
      +----+
      | id |
      +----+
      |  1 |
      |  2 |
      |  3 |
      |  6 |
      +----+
      4 rows in set (0.00 sec)
      ```
      > 從結果可以看出，自增變量已經持久化了。
      > `MySQL 8.0` 將自增主鍵的計數器持久化到中 `重做日誌`。每次計數器發生改變，都會將其寫入 `重做日誌` 中。如果數據庫重啟，`InnoDB` 會根據重做日誌中的信息來初始化計數器的內存值。

## FOREIGN KEY 約束
  - ### 作用
    限定某個表的某個字段的引用完整性。
    比如：員工表的員工所在部門的選擇，必須在部門表能找到對應的部分。

  - ### 主表和從表/父表和子表
    - 主表（父表）：被引用的表，被參考的表
    - 從表（子表）：引用別人的表，參考別人的表
      > 例如：員工表的員工所在部門這個字段的值要參考部門表：部門表是主表，員工表是從表。
      
      > 例如：學生表、課程表、選課表：選課表的學生和課程要分別參考學生表和課程表，學生表和課程表是主表，選課表是從表。

  - ### 特點
    - 1. 從表的外鍵列，必須引用/參考主表的主鍵或唯一約束的列。
      - 為什麼？因為被依賴/被參考的值必須是唯一的
    - 2. 在創建外鍵約束時，如果不給外鍵約束命名，默認名不是列名，而是自動產生一個外鍵名（例如`student_ibfk_1`），也可以指定外鍵約束名。
    - 3. 創建(CREATE)表時就指定外鍵約束的話，先創建主表，再創建從表。
    - 4. 刪表時，先刪從表（或先刪除外鍵約束），再刪除主表。
    - 5. 當主表的記錄被從表參照時，主表的記錄將不允許刪除，如果要刪除數據，需要先刪除從表中依賴該記錄的數據，然後才可以刪除主表的數據。
    - 6. 在 `從表` 中指定外鍵約束，並且一個表可以建立多個外鍵約束。
    - 7. 從表的外鍵列與主表被參照的列名字可以不相同，但是數據類型必須一樣，邏輯意義一致。如果類型不一樣，創建子表時，就會出現錯誤 `ERROR 1005 (HY000): Can't create table'database.tablename'(errno: 150)`。 
      - 例如：都是表示 `部門編號`，都是 `int類型`。
    - 8. 當創建外鍵約束時，系統默認會在所在的列上建立對應的普通索引。但是索引名是外鍵的約束名。（根據外鍵查詢效率很高）
    - 9. 刪除外鍵約束後，必須手动刪除對應的索引。

  - ### 添加外鍵約束
    - 1. 建表時
      ```SQL
      create table 主表名稱(
        字段1  數據類型  primary key,
        字段2  數據類型
      );

      create table 從表名稱(
        字段1  數據類型  primary key,
        字段2  數據類型,
        [CONSTRAINT <外鍵約束名稱>] FOREIGN KEY (從表的某個字段) references 主表名(被參考字段)
      );
        -- (從表的某個字段)的數據類型必須與主表名(被參考字段)的數據類型一致，邏輯意義也一樣
        -- (從表的某個字段)的字段名可以與主表名(被參考字段)的字段名一樣，也可以不一樣

      -- FOREIGN KEY: 在表級指定子表中的列
      -- REFERENCES: 標示在父表中的列
      ```
      ```SQL
      create table dept(        -- 主表
        did int primary key,		-- 部門編號
        dname varchar(50)			  -- 部門名稱
      );

      create table emp(         -- 從表
        eid int primary key,    -- 員工編號
        ename varchar(5),       -- 員工姓名
        deptid int,				      -- 員工所在的部門
        foreign key (deptid) references dept(did)   -- 在從表中指定外鍵約束
        -- emp表的deptid和和dept表的did的數據類型一致，意義都是表示部門的編號
      );

      -- 說明：
      --（1）主表dept必須先創建成功，然後才能創建emp表，指定外鍵成功。
      --（2）刪除表時，先刪除從表emp，再刪除主表dept
      ```

    - 2. 建表後
      一般情況下，表與表的關聯都是提前設計好了的，因此，會在創建表的時候就把外鍵約束定義好。不過，如果需要修改表的設計（比如添加新的字段，增加新的關聯關係），但沒有預先定義外鍵約束，那麼，就要用修改表的方式來補充定義。
      ```SQL
      ALTER TABLE 從表名 ADD [CONSTRAINT 約束名] FOREIGN KEY (從表的字段) REFERENCES 主表名(被引用字段) [on update xx][on delete xx];
      ```
      - 舉例：
        ```SQL
        ALTER TABLE emp1
        ADD [CONSTRAINT emp_dept_id_fk] FOREIGN KEY(dept_id) REFERENCES dept(dept_id);
        ```
      - 舉例：
        ```SQL
        create table dept(
          did int primary key,		-- 部門編號
          dname varchar(50)			-- 部門名稱
        );

        create table emp(
          eid int primary key,  -- 員工編號
          ename varchar(5),     -- 員工姓名
          deptid int				    -- 員工所在的部門
        );
        -- 這兩個表創建時，沒有指定外鍵的話，那麼創建順序是隨意
        ```
        ```SQL
        alter table emp add foreign key (deptid) references dept(did);
        ```

  - ### 演示問題
    - 1. 失敗：不是鍵列
      ```SQL
      create table dept(
        did int ,		          -- 部門編號
        dname varchar(50)			-- 部門名稱
      );

      create table emp(
        eid int primary key,  -- 員工編號
        ename varchar(5),     -- 員工姓名
        deptid int,				    -- 員工所在的部門
        foreign key (deptid) references dept(did)
      );
      -- ERROR 1215 (HY000): Cannot add foreign key constraint  原因是dept的did不是鍵列
      ```

    - 2. 失敗：數據類型不一致
      ```SQL
      create table dept(
        did int primary key,		-- 部門編號
        dname varchar(50)			  -- 部門名稱
      );

      create table emp(
        eid int primary key,  -- 員工編號
        ename varchar(5),     -- 員工姓名
        deptid char,				  -- 員工所在的部門
        foreign key (deptid) references dept(did)
      );
      -- ERROR 1215 (HY000): Cannot add foreign key constraint  原因是從表的deptid字段和主表的did字段的數據類型不一致，並且要它倆的邏輯意義一致
      ```

    - 3. 成功，兩個表字段名一樣
      ```SQL
      create table dept(
        did int primary key,		-- 部門編號
        dname varchar(50)			  -- 部門名稱
      );

      create table emp(
        eid int primary key,  -- 員工編號
        ename varchar(5),     -- 員工姓名
        did int,				      -- 員工所在的部門
        foreign key (did) references dept(did)  
        -- emp表的deptid和和dept表的did的數據類型一致，意義都是表示部門的編號
        -- 是否重名沒問題，因為兩個did在不同的表中
      );
      ```

    - 4. 添加、刪除、修改問題
      ```SQL
      create table dept(
        did int primary key,		-- 部門編號
        dname varchar(50)			  -- 部門名稱
      );

      create table emp(
        eid int primary key,  -- 員工編號
        ename varchar(5),     -- 員工姓名
        deptid int,				    -- 員工所在的部門
        foreign key (deptid) references dept(did)  
        -- emp表的deptid和和dept表的did的數據類型一致，意義都是表示部門的編號
      );
      ```
      ```SQL
      insert into dept values(1001,'教學部');
      insert into dept values(1003, '財務部');

      insert into emp values(1,'張三',1001);  -- 添加從表記錄成功，在添加這條記錄時，要求部門表有1001部門

      insert into emp values(2,'李四',1005);  -- 添加從表記錄失敗
      -- ERROR 1452 (23000): Cannot add（添加） or update（修改） a child row: a foreign key constraint fails (`atguigudb`.`emp`, CONSTRAINT `emp_ibfk_1` FOREIGN KEY (`deptid`) REFERENCES `dept` ( `did`)) 從表emp添加記錄失敗，因為主表dept沒有1005部門
      ```
      ```SQL
      mysql> select * from dept;
      +------+--------+
      | did  | dname  |
      +------+--------+
      | 1001 | 教学部  |
      | 1003 | 财务部  |
      +------+--------+
      2 rows in set (0.00 sec)

      mysql> select * from emp;
      +-----+-------+--------+
      | eid | ename | deptid |
      +-----+-------+--------+
      |   1 | 张三   |   1001 |
      +-----+-------+--------+
      1 row in set (0.00 sec)
      ```
      ```SQL
      update emp set deptid = 1002 where eid = 1; -- 修改從表失敗 
      -- ERROR 1452 (23000): Cannot add（添加） or update（修改） a child row（子表的記錄）: a foreign key constraint fails（外鍵約束失敗） (`atguigudb`.`emp`, CONSTRAINT `emp_ibfk_1` FOREIGN KEY (`deptid`) REFERENCES `dept` (`did`))   -- 部門表did字段現在沒有1002的值，所以員工表中不能修改員工所在部門deptid為1002

      update dept set did = 1002 where did = 1001; -- 修改主表失敗
      -- ERROR 1451 (23000): Cannot delete（刪除） or update（修改） a parent row（父表的記錄）: a foreign key constraint fails (`atguigudb`.`emp`, CONSTRAINT `emp_ibfk_1` FOREIGN KEY (`deptid` ) REFERENCES `dept` (`did`))  -- 部門表did的1001字段已經被emp引用了，所以部門表的1001字段就不能修改了。

      update dept set did = 1002 where did = 1003; -- 修改主表成功
      -- 因為部門表的1003部門沒有被emp表引用，所以可以修改
      ```
      ```SQL
      delete from dept where did=1001; -- 刪除主表失敗
      -- ERROR 1451 (23000): Cannot delete（刪除） or update（修改） a parent row（父表記錄）: a foreign key constraint fails (`atguigudb`.`emp`, CONSTRAINT `emp_ibfk_1` FOREIGN KEY (`deptid`) REFERENCES `dept` (`did`))
      -- 因為部門表did的1001字段已經被emp引用了，所以部門表的1001字段對應的記錄就不能被刪除
      ```
    - #### 總結：約束關係是針對雙方的
      - 添加了外鍵約束後，主表的修改和刪除數據受約束。
      - 添加了外鍵約束後，從表的添加和修改數據受約束。
      - 在從表上建立外鍵，要求主表必須存在。
      - 刪除主表時，要求從表從表先刪除，或將從表中外鍵引用該主表的關係先刪除。

  - ### 約束等級
    - `Cascade方式`：在父表上 `update/delete` 記錄時，同步 `update/delete` 掉子表的匹配記錄。
    - `Set null方式`：在父表上 `update/delete` 記錄時，將子表上匹配記錄的列設為 `null`，但是要注意子表的外鍵列不能為 `not null`。
    - `No action方式`：如果子表中有匹配的記錄，則不允許對父表對應候選鍵進行 `update/delete` 操作。
    - `Restrict方式`：同 `no action`， 都是立即檢查外鍵約束。
    - `Set default方式`（在可視化工具 `SQLyog` 中可能顯示空白）：父表有變更時，子表將外鍵列設置成一個默認的值，但 `Innodb` 不能識別。

    如果沒有指定等級，就相當於 `Restrict` 方式。
    對於外鍵約束，最好是採用: `ON UPDATE CASCADE ON DELETE RESTRICT` 的方式。

    - #### 1. 演示1：on update cascade on delete set null
      ```SQL
      create table dept(
        did int primary key,		-- 部門編號
        dname varchar(50)			  -- 部門名稱
      );

      create table emp(
        eid int primary key,  -- 員工編號
        ename varchar(5),     -- 員工姓名
        deptid int,				    -- 員工所在的部門
        foreign key (deptid) references dept(did)  on update cascade on delete set null
        -- 把修改操作設置為級聯修改等級，把刪除操作設置為set null等級
      );
      ```
      ```SQL
      insert into dept values(1001,'教學部');
      insert into dept values(1002, '財務部');
      insert into dept values(1003, '諮詢部');

      insert into emp values(1,'張三',1001); -- 在添加這條記錄時，要求部門表有1001部門
      insert into emp values(2,'李四',1001);
      insert into emp values(3,'王五',1002);
      ```
      ```SQL
      mysql> select * from dept;
      mysql> select * from emp;
      ```
      ```SQL
      -- 修改主表成功，從表也跟著修改，修改了主表被引用的字段1002為1004，從表的引用字段就跟著修改為1004了
      mysql> update dept set did = 1004 where did = 1002;
      -- Query OK, 1 row affected (0.00 sec)
      -- Rows matched: 1  Changed: 1  Warnings: 0

      mysql> select * from dept;
      +------+--------+
      | did  | dname  |
      +------+--------+
      | 1001 | 教學部 |
      | 1003 | 諮詢部 |
      | 1004 | 財務部 | -- 原來是1002，修改為1004
      +------+--------+
      3 rows in set (0.00 sec)

      mysql> select * from emp;
      +-----+-------+--------+
      | eid | ename | deptid |
      +-----+-------+--------+
      |   1 | 張三  |   1001 |
      |   2 | 李四  |   1001 |
      |   3 | 王五  |   1004 | -- 原來是1002，跟著修改為1004
      +-----+-------+--------+
      3 rows in set (0.00 sec)
      ```
      ```SQL
      -- 刪除主表的記錄成功，從表對應的字段的值被修改為null
      mysql> delete from dept where did = 1001;
      -- Query OK, 1 row affected (0.01 sec)

      mysql> select * from dept;
      +------+--------+
      | did  | dname  | -- 記錄1001部門被刪除了
      +------+--------+
      | 1003 | 諮詢部  |
      | 1004 | 財務部  |
      +------+--------+
      2 rows in set (0.00 sec)

      mysql> select * from emp;
      +-----+-------+--------+
      | eid | ename | deptid |
      +-----+-------+--------+
      |   1 | 張三  |   NULL | -- 原來引用1001部門的員工，deptid字段變為null
      |   2 | 李四  |   NULL |
      |   3 | 王五  |   1004 |
      +-----+-------+--------+
      3 rows in set (0.00 sec)
      ```

    - #### 2. 演示2：on update set null on delete cascade
      ```SQL
      create table dept(
        did int primary key,		-- 部門編號
        dname varchar(50)			  -- 部門名稱
      );

      create table emp(
        eid int primary key,  -- 員工編號
        ename varchar(5),     -- 員工姓名
        deptid int,				    -- 員工所在的部門
        foreign key (deptid) references dept(did)  on update set null on delete cascade
        -- 把修改操作設置為set null等級，把刪除操作設置為級聯刪除等級
      );
      ```
      ```SQL
      insert into dept values(1001,'教學部');
      insert into dept values(1002, '財務部');
      insert into dept values(1003, '諮詢部');

      insert into emp values(1,'張三',1001); -- 在添加這條記錄時，要求部門表有1001部門
      insert into emp values(2,'李四',1001);
      insert into emp values(3,'王五',1002);
      ```
      ```SQL
      mysql> select * from dept;
      +------+--------+
      | did  | dname  |
      +------+--------+
      | 1001 | 教學部 |
      | 1002 | 財務部 |
      | 1003 | 諮詢部 |
      +------+--------+
      3 rows in set (0.00 sec)

      mysql> select * from emp;
      +-----+-------+--------+
      | eid | ename | deptid |
      +-----+-------+--------+
      |   1 | 張三  |   1001 |
      |   2 | 李四  |   1001 |
      |   3 | 王五  |   1002 |
      +-----+-------+--------+
      3 rows in set (0.00 sec)
      ```
      ```SQL
      -- 修改主表，從表對應的字段設置為null
      mysql> update dept set did = 1004 where did = 1002;
      -- Query OK, 1 row affected (0.00 sec)
      -- Rows matched: 1  Changed: 1  Warnings: 0

      mysql> select * from dept;
      +------+--------+
      | did  | dname  |
      +------+--------+
      | 1001 | 教學部 |
      | 1003 | 諮詢部 |
      | 1004 | 財務部 | -- 原來did是1002
      +------+--------+
      3 rows in set (0.00 sec)

      mysql> select * from emp;
      +-----+-------+--------+
      | eid | ename | deptid |
      +-----+-------+--------+
      |   1 | 張三  |   1001 |
      |   2 | 李四  |   1001 |
      |   3 | 王五  |   NULL | -- 原來deptid是1002，因為部門表1002被修改了，1002沒有對應的了，就設置為null
      +-----+-------+--------+
      3 rows in set (0.00 sec)
      ```
      ```SQL
      -- 刪除主表的記錄成功，主表的1001行被刪除了，從表相應的記錄也被刪除了
      mysql> delete from dept where did=1001;
      -- Query OK, 1 row affected (0.00 sec)

      mysql> select * from dept;
      +------+--------+
      | did  | dname  | -- 部門表中1001部門被刪除
      +------+--------+
      | 1003 | 諮詢部 |
      | 1004 | 財務部 |
      +------+--------+
      2 rows in set (0.00 sec)

      mysql> select * from emp;
      +-----+-------+--------+
      | eid | ename | deptid |-- 原來1001部門的員工也被刪除了
      +-----+-------+--------+
      |   3 | 王五  |   NULL |
      +-----+-------+--------+
      1 row in set (0.00 sec)
      ```

    - #### 3. 演示3：on update cascade on delete cascade
      ```SQL
      create table dept(
        did int primary key,		-- 部門編號
        dname varchar(50)			-- 部門名稱
      );

      create table emp(
        eid int primary key,  -- 員工編號
        ename varchar(5),     -- 員工姓名
        deptid int,				-- 員工所在的部門
        foreign key (deptid) references dept(did)  on update cascade on delete cascade
        -- 把修改操作設置為級聯修改等級，把刪除操作也設置為級聯刪除等級
      );
      ```
      ```SQL
      insert into dept values(1001,'教學部');
      insert into dept values(1002, '財務部');
      insert into dept values(1003, '諮詢部');

      insert into emp values(1,'張三',1001); -- 在添加這條記錄時，要求部門表有1001部門
      insert into emp values(2,'李四',1001);
      insert into emp values(3,'王五',1002);
      ```
      ```SQL
      mysql> select * from dept;
      +------+--------+
      | did  | dname  |
      +------+--------+
      | 1001 | 教學部 |
      | 1002 | 財務部 |
      | 1003 | 諮詢部 |
      +------+--------+
      3 rows in set (0.00 sec)

      mysql> select * from emp;
      +-----+-------+--------+
      | eid | ename | deptid |
      +-----+-------+--------+
      |   1 | 張三  |   1001 |
      |   2 | 李四  |   1001 |
      |   3 | 王五  |   1002 |
      +-----+-------+--------+
      3 rows in set (0.00 sec)
      ```
      ```SQL
      -- 修改主表，從表對應的字段自動修改
      mysql> update dept set did = 1004 where did = 1002;
      -- Query OK, 1 row affected (0.00 sec)
      -- Rows matched: 1  Changed: 1  Warnings: 0

      mysql> select * from dept;
      +------+--------+
      | did  | dname  |
      +------+--------+
      | 1001 | 教學部 |
      | 1003 | 諮詢部 |
      | 1004 | 財務部 | -- 部門1002修改為1004
      +------+--------+
      3 rows in set (0.00 sec)

      mysql> select * from emp;
      +-----+-------+--------+
      | eid | ename | deptid |
      +-----+-------+--------+
      |   1 | 張三  |   1001 |
      |   2 | 李四  |   1001 |
      |   3 | 王五  |   1004 | -- 級聯修改
      +-----+-------+--------+
      3 rows in set (0.00 sec)
      ```
      ```SQL
      -- 刪除主表的記錄成功，主表的1001行被刪除了，從表相應的記錄也被刪除了
      mysql> delete from dept where did=1001;
      -- Query OK, 1 row affected (0.00 sec)

      mysql> select * from dept;
      +------+--------+
      | did  | dname  | -- 1001部門被刪除了
      +------+--------+
      | 1003 | 諮詢部 |
      | 1004 | 財務部 | 
      +------+--------+
      2 rows in set (0.00 sec)

      mysql> select * from emp;
      +-----+-------+--------+
      | eid | ename | deptid |  -- 1001部門的員工也被刪除了
      +-----+-------+--------+
      |   3 | 王五  |   1004 |
      +-----+-------+--------+
      1 row in set (0.00 sec)
      ```

  - ### 刪除外鍵約束
    - #### 流程如下：
      - 1. 第一步先查看約束名和刪除外鍵約束
        ```SQL
        SELECT * FROM information_schema.table_constraints WHERE table_name = '表名稱'; -- 查看某個表的約束名
        ALTER TABLE 從表名 DROP FOREIGN KEY 外鍵約束名;
        ```
      

      - 2. 第二步查看索引名和刪除索引。 （注意，只能手動刪除）
        ```SQL
        SHOW INDEX FROM 表名稱;  -- 查看某個表的索引名
        ALTER TABLE 從表名 DROP INDEX 索引名;
        ```

      - 舉例：
        ```SQL
        mysql> SELECT * FROM information_schema.table_constraints WHERE table_name = 'emp';

        mysql> alter table emp drop foreign key emp_ibfk_1;
        -- Query OK, 0 rows affected (0.02 sec)
        -- Records: 0  Duplicates: 0  Warnings: 0
        ```
        ```SQL
        mysql> show index from emp;

        mysql> alter table emp drop index deptid;
        -- Query OK, 0 rows affected (0.01 sec)
        -- Records: 0  Duplicates: 0  Warnings: 0

        mysql>  show index from emp;
        ```

  - ### 開發場景
    - 問題1：如果兩個表之間有關係（一對一、一對多），比如：員工表和部門表（一對多），它們之間是否一定要建外鍵約束？
      > 答：不是的

    - 問題2：建和不建外鍵約束有什麼區別？
      > 答：

      > 建外鍵約束，你的操作（創建表、刪除表、添加、修改、刪除）會受到限制，從語法層面受到限制。例如：在員工表中不可能添加一個員工信息，它的部門的值在部門表中找不到。

      > 不建外鍵約束，你的操作（創建表、刪除表、添加、修改、刪除）不受限制，要保證數據的，只能依，`引用完整性` 或者 `靠程序員的自覺` 是 `在Java程序中進行限定`。例如：在員工表中，可以添加一個員工的信息，它的部門指定為一個完全不存在的部門。

    - 問題3：那麼建和不建外鍵約束和查詢有沒有關係？
      > 答：沒有

      > 在MySQL 裡，外鍵約束是有成本的，需要消耗系統資源。對於大並發的SQL 操作，有可能會不適合。比如大型網站的中央數據庫，可能會 `因為外鍵約束的系統開銷而變得非常慢`。所以， MySQL 允許你不使用系統自帶的外鍵約束，在 `應用層面` 完成檢查數據一致性的邏輯。也就是說，即使你不用外鍵約束，也要想辦法通過應用層面的附加邏輯，來實現外鍵約束的功能，確保數據的一致性。

  - ### 阿里開發規範
    - 【強制】不得使用外鍵與級聯，一切外鍵概念必須在應用層解決。

      說明：（概念解釋）學生表中的 student_id 是主鍵，那麼成績表中的 student_id 則為外鍵。如果更新學生表中的 student_id，同時觸發成績表中的 student_id 更新，即為級聯更新。外鍵與級聯更新適用於 `單機低並發`，不適合 `分佈式`、`高並發集群`；級聯更新是強阻塞，存在數據庫 `更新風暴` 的風險；外鍵影響數據庫的 `插入速度`。
    
## CHECK 約束
  - ### 作用
    檢查某個字段的值是否符合 xx 要求，一般指的是值的範圍。

  - ### 說明
    - MySQL 5.7 不支持
      MySQL5.7 可以使用 check約束，但 check約束 對數據驗證沒有任何作用。添加數據時，沒有任何錯誤或警告。
    - 但是 `MySQL 8.0` 中可以使用check約束了。

    - 舉例：
      ```SQL
      create table employee(
        eid int primary key,
        ename varchar(5),
        gender char check ('男' or '女')
      );
      ```
      ```SQL
      insert into employee values(1,'張三','妖');
      ```
      ```SQL
      mysql> select * from employee;
      +-----+-------+--------+
      | eid | ename | gender |
      +-----+-------+--------+
      |   1 | 张三   | 妖     |
      +-----+-------+--------+
      1 row in set (0.00 sec)
      ```

    - 舉例：
      ```SQL
      CREATE TABLE temp(
        id INT AUTO_INCREMENT,
        NAME VARCHAR(20),
        age INT CHECK(age > 20),
        PRIMARY KEY(id)
      );
      ```

    - 舉例：
      ```SQL
      age tinyint check(age >20) 或 sex char(2) check(sex in('男','女'))
      ```

    - 舉例：
      ```SQL
      CHECK(height>=0 AND height<3)
      ```

## DEFAULT約束
  - ### 作用
    給某個字段/某列指定默認值，一旦設置默認值，在插入數據時，如果此字段沒有顯式賦值，則賦值為默認值。

  - ### 如何給字段加默認值
    - 1. 建表時
      ```SQL
      create table 表名稱(
        字段名  數據類型  primary key,
        字段名  數據類型  unique key not null,  
        字段名  數據類型  unique key,
        字段名  數據類型  not null default 默認值, 
      );
      create table 表名稱(
        字段名  數據類型 default 默認值 ,
        字段名  數據類型 not null default 默認值,  
        字段名  數據類型 not null default 默認值,
        primary key(字段名),
        unique key(字段名)
      );

      -- 說明：默認值約束一般不在唯一鍵和主鍵列上加
      ```
      ```SQL
      create table employee(
        eid int primary key,
        ename varchar(20) not null,
        gender char default '男',
        tel char(11) not null default '' -- 默認是空字符串
      );
      ```
      ```SQL
      mysql> desc employee;
      +--------+-------------+------+-----+---------+-------+
      | Field  | Type        | Null | Key | Default | Extra |
      +--------+-------------+------+-----+---------+-------+
      | eid    | int(11)     | NO   | PRI | NULL    |       |
      | ename  | varchar(20) | NO   |     | NULL    |       |
      | gender | char(1)     | YES  |     | 男      |       |
      | tel    | char(11)    | NO   |     |         |       |
      +--------+-------------+------+-----+---------+-------+
      4 rows in set (0.00 sec)
      ```
      ```SQL
      insert into employee values(1,'汪飛','男','13700102535'); -- 成功
      ```
      ```SQL
      mysql> select * from employee;
      +-----+-------+--------+-------------+
      | eid | ename | gender | tel         |
      +-----+-------+--------+-------------+
      |   1 | 汪飛  | 男     | 13700102535 |
      +-----+-------+--------+-------------+
      1 row in set (0.00 sec)
      ``` 
      ```SQL
      insert into employee(eid,ename) values(2,'天琪'); -- 成功
      ```
      ```SQL
      mysql> select * from employee;
      +-----+-------+--------+-------------+
      | eid | ename | gender | tel         |
      +-----+-------+--------+-------------+
      |   1 | 汪飛  | 男     | 13700102535 |
      |   2 | 天琪  | 男     |             |
      +-----+-------+--------+-------------+
      2 rows in set (0.00 sec)
      ```
      ```SQL
      insert into employee(eid,ename) values(3,'二虎');
      -- ERROR 1062 (23000): Duplicate entry '' for key 'tel'  
      -- 如果tel有唯一性約束的話會報錯，如果tel沒有唯一性約束，可以添加成功
      ```
      - 再舉例：
        ```SQL
        CREATE TABLE myemp(
          id INT AUTO_INCREMENT PRIMARY KEY,
          NAME VARCHAR(15),
          salary DOUBLE(10,2) DEFAULT 2000
        );
        ```

    - ### 2. 建表後
      ```SQL
      alter table 表名稱 modify 字段名 數據類型 default 默認值;

      -- 如果這個字段原來有非空約束，你還保留非空約束，那麼在加默認值約束時，還得保留非空約束，否則非空約束就被刪除了
      -- 同理，在給某個字段加非空約束也一樣，如果這個字段原來有默認值約束，你想保留，也要在modify語句中保留默認值約束，否則就刪除了
      alter table 表名稱 modify 字段名 數據類型 default 默認值 not null;
      ```
      ```SQL
      create table employee(
        eid int primary key,
        ename varchar(20),
        gender char,
        tel char(11) not null
      );
      ```
      ```SQL
      mysql> desc employee;
      +--------+-------------+------+-----+---------+-------+
      | Field  | Type        | Null | Key | Default | Extra |
      +--------+-------------+------+-----+---------+-------+
      | eid    | int(11)     | NO   | PRI | NULL    |       |
      | ename  | varchar(20) | YES  |     | NULL    |       |
      | gender | char(1)     | YES  |     | NULL    |       |
      | tel    | char(11)    | NO   |     | NULL    |       |
      +--------+-------------+------+-----+---------+-------+
      4 rows in set (0.00 sec)
      ```
      ```SQL
      alter table employee modify gender char default '男';  -- 給gender字段增加默認值約束
      alter table employee modify tel char(11) default ''; -- 給tel字段增加默認值約束
      ```
      ```SQL
      mysql> desc employee;
      +--------+-------------+------+-----+---------+--- ----+
      | Field  | Type        | Null | Key | Default | Extra |
      +--------+-------------+------+-----+---------+--- ----+
      | eid    | int(11)     | NO   | PRI | NULL    |       |
      | ename  | varchar(20) | YES  |     | NULL    |       |
      | gender | char(1)     | YES  |     | 男      |       |
      | tel    | char(11)    | YES  |     |         |       |
      +--------+-------------+------+-----+---------+--- ----+
      4 rows in set (0.00 sec)
      ```
      ```SQL
      alter table employee modify tel char(11) default ''  not null; -- 給tel字段增加默認值約束，並保留非空約束
      ```
      ```SQL
      mysql> desc employee;
      +--------+-------------+------+-----+---------+--- ----+
      | Field  | Type        | Null | Key | Default | Extra |
      +--------+-------------+------+-----+---------+--- ----+
      | eid    | int(11)     | NO   | PRI | NULL    |       |
      | ename  | varchar(20) | YES  |     | NULL    |       |
      | gender | char(1)     | YES  |     | 男      |       |
      | tel    | char(11)    | NO   |     |         |       |
      +--------+-------------+------+-----+---------+--- ----+
      4 rows in set (0.00 sec)
      ```

  - ### 如何刪除默認值約束
    ```SQL
    alter table 表名稱 modify 字段名 數據類型 ; -- 刪除默認值約束，也不保留非空約束

    alter table 表名稱 modify 字段名 數據類型  not null; -- 刪除默認值約束，保留非空約束
    ```
    ```SQL
    alter table employee modify gender char; -- 刪除gender字段默認值約束，如果有非空約束，也一併刪除
    alter table employee modify tel char(11)  not null; --刪除tel字段默認值約束，保留非空約束
    ```
    ```SQL
    mysql> desc employee;
    +--------+-------------+------+-----+---------+--- ----+
    | Field  | Type        | Null | Key | Default | Extra |
    +--------+-------------+------+-----+---------+--- ----+
    | eid    | int(11)     | NO   | PRI | NULL    |       |
    | ename  | varchar(20) | YES  |     | NULL    |       |
    | gender | char(1)     | YES  |     | NULL    |       |
    | tel    | char(11)    | NO   |     | NULL    |       |
    +--------+-------------+------+-----+---------+--- ----+
    4 rows in set (0.00 sec)
    ```

## 面試
  - ### 面試1、為什麼建表時，加 not null default '' 或 default 0
    > 答：不想讓表中出現 null 值。

  - ### 面試2、為什麼不想要null 的值
    > 答:（1）不好比較。null是一種特殊值，比較時只能用專門的 `is null` 和 `is not null` 來比較。碰到運算符，通常返回null。
    >（2）效率不高。影響提高索引效果。因此，我們往往在建表時 `not null default ''` 或 `default 0`

  - ### 面試3、帶AUTO_INCREMENT約束的字段值是從1開始的嗎？
    > 在 MySQL 中，默認 `AUTO_INCREMENT` 的初始值是 1，每新增一條記錄，字段值自動加1。設置自增屬性（AUTO_INCREMENT）的時候，還可以指定第一條插入記錄的自增字段的值，這樣新插入的記錄的自增字段值從初始值開始遞增，如在表中插入第一條記錄，同時指定id值為5，則以後插入的記錄的id值就會從6開始往上增加。添加主鍵約束時，往往需要設置字段自動增加屬性。

  - ### 面試4、並不是每個表都可以任意選擇存儲引擎？
    > 外鍵約束（FOREIGN KEY）不能跨引擎使用。

    > MySQL支持多種存儲引擎，每一個表都可以指定一個不同的存儲引擎，需要注意的是：外鍵約束是用來保證數據的參照完整性的，如果表之間需要關聯外鍵，卻指定了不同的存儲引擎，那麼這些表之間是不能創建外鍵約束的。所以說，存儲引擎的選擇也不完全是隨意的。

## 添加約束的語法
  使用 `ALTER TABLE 語句`：
  - 添加或刪除約束，`但是不能修改約束`。
  - 有效化或無效化約束。
  - 添加 `NOT NULL` 約束要使用 `MODIFY 語句`。
    ```SQL
    ALTER TABLE table
    ADD [CONSTRAINT constraint] type (column);
    ```
  > 以 `CREATE TABLE emp AS SELECT * FROM employees` 為例，添加和刪除約束。
    ```SQL
    ALTER TABLE emp MODIFY(empname VARCHAR2(50) NOT NULL)
    ```

## 刪除約束
  - 從表 `EMPLOYEES` 中刪除約束
    ```SQL
    ALTER TABLE employees
    DROP CONSTRAINT emp_manager_fk;
    -- Table altered.
    ```

## 無效化約束
  - 在 `ALTER TABLE 語句` 中，使用 `DISABLE 子句` 將約束無效化。
    ```SQL
    ALTER TABLE employees
    DISABLE CONSTRAINT emp_emp_id_pk;
    -- Table altered.
    ```

## 激活約束
  - `ENABLE 子句` 可將當前無效的約束激活。
    ```SQL
    ALTER TABLE employees
    ENABLE CONSTRAINT emp_emp_id_pk;
    -- Table altered.
    ```
    > 當定義或激活 `UNIQUE` 或 `PRIMARY KEY` 約束時，系統會自動創建 `UNIQUE` 或 `PRIMARY KEY` 索引。
    > 重啟激活約束時，必須將不符合約束的資料，刪除或修改。

## 查詢約束
  查詢數據字典視圖 `USER_CONSTRAINTS`
  ```SQL
  SELECT constraint_name, constraint_type, search_condition
  FROM user_constraints
  WHERE table_name = 'EMPLOYEES';
  ```

## 查詢定義約束的列 (查詢欄位對應的約束名)
  查詢數據字典視圖 `USER_CONS_COLUMNS`
  ```SQL
  SELECT constraint_name, column_name
  FROM user_cons_columns
  WHERE table_name = 'EMPLOYEES';
  ```

## 總結
  通過本章學習，您已經學會如何創建約束
  - 描述約束的類型：
    - `NOT NULL`
    - `UNIQUE`
    - `PRIMARY KEY`
    - `FOREIGN KEY`
    - `CHECK`

## 測試
  ### 1. 向表 emp2 的 id 列中添加 `PRIMARY KEY` 約束 (my_emp_id_pk)
    ```SQL
    ALTER TABLE emp2
    ADD CONSTRAINT my_emp_id_pk PRIMARY KEY(id);
    ```

  ### 2. 向表 dept2 的 id 列中添加 `PRIMARY KEY` 約束 (my_dept_id_pk)
    ```SQL
    ALTER TABLE dept2
    ADD CONSTRAINT my_dept_id_pk PRIMARY KEY(id);
    ```

  ### 3. 向表 emp2 中添加列 dep_id，並在其中定義 `FOREIGN KEY` 約束，與之相關的列是 dept2 表中的 id 列。
    ```SQL
    ALTER TABLE emp2
    ADD (dept_id NUMBER(10) CONSTRAINT emp2_dept2_id_fk REFERENCES dept2(id))
    ```
  - 準備工作
    ```SQL
    CREATE TABLE emp2 as SELECT employee_id id, last_name name, salary
    FROM employees;
    ```
    ```SQL
    CREATE TABLE dept2 as SELECT department_id id, department_name dept_name
    FROM departments;
    ```