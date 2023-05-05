# 07. JUnit5 單元測試
  - ## 1、JUnit 5 的變化
    `Spring Boot 2.2.0 版本開始引入 JUnit 5 作為單元測試默認庫。`
    作為最新版本的 JUnit 框架，JUnit5 與之前版本的 Junit 框架有很大的不同。
    
    由三個不同子項目的幾個不同模塊組成。
    `JUnit 5` = `JUnit Platform` + `JUnit Jupiter` + `JUnit Vintage`

    - `JUnit Platform`：Junit Platform 是在 JVM 上啟動測試框架的基礎，不僅支持Junit 自製的測試引擎，其他測試引擎也都可以接入。
    - `JUnit Jupiter`：JUnit Jupiter 提供了 JUnit5 的新的編程模型，是 JUnit5 新特性的核心。內部 包含了一個 `測試引擎`，用於在 Junit Platform 上運行。
    - `JUnit Vintage`：由於 JUint 已經發展多年，為了照顧老的項目，JUnit Vintage提供了兼容 JUnit4.x, Junit3.x 的測試引擎。

    ![spring_image_1-2-7-1-1](./spring_image_1-2-7-1-1.png)

    - ### 注意：
      - SpringBoot 2.4 以上版本移除了默認對 `Vintage` 的依賴。如果需要兼容junit4需要自行引入（不能使用 junit4 的功能 `@Test`）
      - JUnit 5’s Vintage Engine Removed from spring-boot-starter-test，如果需要繼續兼容 junit4 需要自行引入 `vintage`

      引入 vintage 方式：
      ```xml
      <dependency>
        <groupId>org.junit.vintage</groupId>
        <artifactId>junit-vintage-engine</artifactId>
        <scope>test</scope>
        <exclusions>
          <exclusion>
            <groupId>org.hamcrest</groupId>
            <artifactId>hamcrest-core</artifactId>
          </exclusion>
        </exclusions>
      </dependency>
      ```

    ![spring_image_1-2-7-1-2](./spring_image_1-2-7-1-2.png)

    引入依賴：
    ```xml
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    ```

    現在版本：
    ```java
    @SpringBootTest
    class Boot05WebAdminApplicationTests {
      ...
      @Test
      void contextLoads() {
        ...
      }
    }
    ```

    以前：
    `@SpringBootTest` + `@RunWith(SpringTest.class)`

    SpringBoot 整合 Juni t以後：
      - 編寫測試方法：`@Test` 標註（注意需要使用 `junit5` 版本的註解）
      - Junit類，具有 Spring 的功能，`@Autowired`、比如 `@Transactional` 標註測試方法，測試完成後自動回滾

  - ## 2、JUnit5常用註解
    `JUnit5` 的註解與 `JUnit4` 的註解有所變化 ([連結](https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations))
    - `@Test`：表示方法是 測試方法。但是與 JUnit4 的 @Test 不同，他的職責非常單一不能聲明任何屬性，拓展的測試將會由 `Jupiter` 提供額外測試。
    - `@ParameterizedTest`：表示方法是 參數化測試，下方會有詳細介紹
    - `@RepeatedTest`：表示方法 可重複執行，下方會有詳細介紹
    - `@DisplayName`：為 測試類 或 測試方法 設置展示名稱
    - `@BeforeEach`：表示在 每個單元測試 之 前 執行
    - `@AfterEach`：表示在 每個單元測試 之 後 執行
    - `@BeforeAll`：表示在 所有單元測試 之 前 執行
    - `@AfterAll`：表示在 所有單元測試 之 後 執行
    - `@Tag`：表示單元測試類別，類似於 JUnit4 中的 @Categories
    - `@Disabled`：表示測試類 或 測試方法不執行，類似於 JUnit4 中的 @Ignore
    - `@Timeout`：表示測試方法運行如果超過了指定時間將會返回錯誤
    - `@ExtendWith`：為 測試類 或 測試方法 提供擴展類引用

    ```java
    import org.junit.jupiter.api.Test; //注意這裡使用的是 jupiter 的 Test 註解！！

    public class TestDemo {
      @Test
      @DisplayName("第一次測試")
      public void firstTest() {
        System.out.println("hello world");
      }
    }
    ```

  - ## 3、斷言（assertions）
    `斷言 (assertions)` 是測試方法中的核心部分，用來對測試需要滿足的條件進行驗證。這些斷言方法都是 `org.junit.jupiter.api.Assertions` 的靜態方法。 
    檢查業務邏輯返回的數據是否合理。
    所有的測試運行結束以後，會有一個詳細的測試報告；

    JUnit5 內置的斷言可以分成如下幾個類別：
    - ### 1、簡單斷言
      用來對單個值進行簡單的驗證。如：
      | 方法             | 說明                             |
      |-----------------|----------------------------------|
      | assertEquals    | 判斷兩個對像或兩個原始類型是否相等     |
      | assertNotEquals | 判斷兩個對像或兩個原始類型是否不相等   |
      | assertSame      | 判斷兩個對象引用是否指向同一個對象     |
      | assertNotSame   | 判斷兩個對象引用是否指向不同的對象     |
      | assertTrue      | 判斷給定的布爾值是否為 true          |
      | assertFalse     | 判斷給定的布爾值是否為 false         |
      | assertNull      | 判斷給定的對象引用是否為 null        |
      | assertNotNull   | 判斷給定的對象引用是否不為 null       |

      ```java
      @Test
      @DisplayName("simple assertion")
      public void simple() {
        assertEquals(3, 1 + 2, "simple math");
        assertNotEquals(3, 1 + 1);

        assertNotSame(new Object(), new Object());
        Object obj = new Object();
        assertSame(obj, obj);

        assertFalse(1 > 2);
        assertTrue(1 < 2);

        assertNull(null);
        assertNotNull(new Object());
      }
      ```

    - ### 2、數組斷言
      通過 `assertArrayEquals` 方法來判斷兩個對像或原始類型的數組是否相等
      ```java
      @Test
      @DisplayName("array assertion")
      public void array() {
      assertArrayEquals(new int[]{1, 2}, new int[] {1, 2});
      }
      ```

    - ### 3、組合斷言
      `assertAll` 方法接受多個 `org.junit.jupiter.api.Executable` 函數式接口的實例作為要驗證的斷言，可以通過 `lambda` 表達式很容易的提供這些斷言

      ```java
      @Test
      @DisplayName("assert all")
      public void all() {
        assertAll("Math",
          () -> assertEquals(2, 1 + 1),
          () -> assertTrue(1 > 0)
        );
      }
      ```

    - ### 4、異常斷言
      在 `JUnit4` 時期，想要測試方法的異常情況時，需要用 `@Rule` 註解的ExpectedException 變量還是比較麻煩的。而 `JUnit5` 提供了一種新的斷言方式 `Assertions.assertThrows() `，配合函數式編程就可以進行使用。

      ```java
      @Test
      @DisplayName("異常測試")
      public void exceptionTest() {
        ArithmeticException exception = Assertions.assertThrows(
          // 扔出斷言異常
          ArithmeticException.class, () -> System.out.println(1 % 0)
        );
      }
      ```

    - ### 5、超時斷言
      `Junit5` 還提供了 `Assertions.assertTimeout()` 為測試方法設置了超時時間

      ```java
      @Test
      @DisplayName("超時測試")
      public void timeoutTest() {
        // 如果測試方法時間超過 1s 將會異常
        Assertions.assertTimeout(Duration.ofMillis(1000), () -> Thread.sleep(500));
      }
      ```

    - ### 6、快速失敗
      通過 fail 方法直接使得測試失敗

      ```java
      @Test
      @DisplayName("fail")
      public void shouldFail() {
        fail("This should fail");
      }
      ```

  - ## 4、前置條件（assumptions）
    JUnit 5 中的前置條件（assumptions【假設】）類似於斷言，不同之處在於 `不滿足的斷言` 會使得 `測試方法失敗`，而不滿足的前置條件只會使得測試方法的執行終止。前置條件可以看成是測試方法執行的前提，當該前提不滿足時，就沒有繼續執行的必要。

    ```java
    @DisplayName("前置條件")
    public class AssumptionsTest {
      private final String environment = "DEV";
      
      @Test
      @DisplayName("simple")
      public void simpleAssume() {
        assumeTrue(Objects.equals(this.environment, "DEV"));
        assumeFalse(() -> Objects.equals(this.environment, "PROD"));
      }
      
      @Test
      @DisplayName("assume then do")
      public void assumeThenDo() {
        assumingThat(
          Objects.equals(this.environment, "DEV"),
          () -> System.out.println("In DEV")
        );
      }
    }
    ```

    assumeTrue 和 assumFalse 確保給定的條件為 true 或 false，不滿足條件會使得測試執行終止。 assumingThat 的參數是表示條件的布爾值和對應的 Executable 接口的實現對象。只有條件滿足時，Executable 對象才會被執行；當條件不滿足時，測試執行並不會終止。

  - ## 5、嵌套測試
    `JUnit 5` 可以通過 Java 中的內部類和 `@Nested` 註解實現嵌套測試，從而可以更好的把相關的測試方法組合起來。在內部類中可以使用 `@BeforeEach` 和`@AfterEach` 註解，並附套的層次沒有限制。

    ```java
    @DisplayName("A stack")
    class TestingAStackDemo {
      Stack<Object> stack;

      @Test
      @DisplayName("is instantiated with new Stack()")
      void isInstantiatedWithNew() {
        new Stack<>();
      }

      @Nested
      @DisplayName("when new")
      class WhenNew {
        @BeforeEach
        void createNewStack() {
          stack = new Stack<>();
        }

        @Test
        @DisplayName("is empty")
        void isEmpty() {
          assertTrue(stack.isEmpty());
        }

        @Test
        @DisplayName("throws EmptyStackException when popped")
        void throwsExceptionWhenPopped() {
          assertThrows(EmptyStackException.class, stack::pop);
        }

        @Test
        @DisplayName("throws EmptyStackException when peeked")
        void throwsExceptionWhenPeeked() {
          assertThrows(EmptyStackException.class, stack::peek);
        }

        @Nested
        @DisplayName("after pushing an element")
        class AfterPushing {
          String anElement = "an element";

          @BeforeEach
          void pushAnElement() {
            stack.push(anElement);
          }

          @Test
          @DisplayName("it is no longer empty")
          void isNotEmpty() {
            assertFalse(stack.isEmpty());
          }

          @Test
          @DisplayName("returns the element when popped and is empty")
          void returnElementWhenPopped() {
            assertEquals(anElement, stack.pop());
            assertTrue(stack.isEmpty());
          }

          @Test
          @DisplayName("returns the element when peeked but remains not empty")
          void returnElementWhenPeeked() {
            assertEquals(anElement, stack.peek());
            assertFalse(stack.isEmpty());
          }
        }
      }
    }
    ```

  - ## 6、參數化測試
    `參數化測試` 是 `JUnit5` 很重要的一個新特性，它使得用不同的參數多次運行測試成為了可能，也為我們的單元測試帶來許多便利。

    利用 `@ValueSource` 等註解，指定入參，我們將可以 `使用不同的參數進行多次單元測試`，而不需要每新增一個參數就新增一個單元測試，省去了很多冗餘代碼。

    `@ValueSource`：為參數化測試指定入參來源，支持八大基礎類 以及 String類型、Class類型
    `@NullSource`：表示為參數化測試提供一個 `null` 的入參
    `@EnumSource`：表示為參數化測試提供一個 `列舉` 入參
    `@CsvFileSource`：表示讀取指定 `CSV文件` 內容作為參數化測試入參
    `@MethodSource`：表示讀取指定 `方法的返回值` 作為參數化測試入參(注意方法返回需要是一個流)

    > 當然如果參數化測試僅僅只能做到指定普通的入參還達不到讓我覺得驚豔的地步。讓我真正感到他的強大之處的地方在於他可以支持 `外部` 的各類入參。如：`CSV`、`YML`、`JSON文件` 甚至 `方法的返回值` 也可以作為入參。只需要去實現 `ArgumentsProvider接口`，任何外部文件都可以作為它的入參。

    ```java
    @ParameterizedTest
    @ValueSource(strings = {"one", "two", "three"})
    @DisplayName("參數化測試1")
    public void parameterizedTest1(String string) {
      System.out.println(string);
      Assertions.assertTrue(StringUtils.isNotBlank(string));
    }

    @ParameterizedTest
    @MethodSource("method")    // 指定方法名
    @DisplayName("方法來源參數")
    public void testWithExplicitLocalMethodSource(String name) {
      System.out.println(name);
      Assertions.assertNotNull(name);
    }

    static Stream<String> method() {
      return Stream.of("apple", "banana");
    }
    ```

  - ## 7、迁移指南
    在進行遷移的時候需要注意如下的變化：
    - 註解在 `org.junit.jupiter.api` 包中，斷言在 `org.junit.jupiter.api.Assertions` 類中，前置條件在 `org.junit.jupiter.api.Assumptions` 類中。
    - 把 `@Before` 和 `@After` 替換成 `@BeforeEach` 和 `@AfterEach`。
    - 把 `@BeforeClass` 和 `@AfterClass` 替換成 `@BeforeAll` 和 `@AfterAll`。
    - 把 `@Ignore` 替換成 `@Disabled`。
    - 把 `@Category` 替換成 `@Tag`。
    - 把 `@RunWith`、`@Rule` 和 `@ClassRule` 替換成 `@ExtendWith`。

