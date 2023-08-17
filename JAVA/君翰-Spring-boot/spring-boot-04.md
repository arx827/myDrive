# spring-boot-starter-fbl-with-spring-day4

- `alt` + `meta` + `O`
  清除所有未使用的 import語句。

- 為了能顯示一個作者有多本書，`@OneToMany`
  ```java
  // AuthorDto.java
  public class AuthorDto {
    ...
    private Set<BookDto> books;
  }
  ```
  ```java
  // Author.java
  @OneToMany(mappedBy = "author")
  private Set<Book> books = new HashSet<>();    // 實體化，是防止為實體化前使用，造成報錯
  ```

- 一本書有多個作者(主編一個，一本書一個作者)
  ```java
  // Book.java
  public class Book {
    ...
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AUTHOR_ID", insertable = false, updatable = false)
    private Author author;
  }
  ```

- 登入帳號需加 `Bearer` 加一格空白
`jwt:secret: "5c5a1817b6caa4d5247571f8d120c7c89a8358de54c4039541ff9d8a88b80362"`

- AUTH JWT登入帳號需加bearer加一格空白
- sql裡寫的 Day4-4 0814
- 

| ID   | IS_LEAF      | TITLE     | ROUTE                | URI     | ENABLED   | SEQUENCE     | PARENT_MENU_ID       |
|------|--------------|-----------|----------------------|---------|-----------|--------------|----------------------|
| 亂寫 | 是否為終端節 點 | 上面寫的 字 | 前端vue頁面網址 (站內) | 是連站外 | 按鈕能不能按 | 方便排序的數字 | 記錄自己樹狀 PARENT的ID |

- 2個參數，一個是要變哪本書 以及想變怎樣
  ```java
  @PutMapping("/{id}")
  @ApiOperation("以ID編輯單一書籍")
  BookDto createBook(@PathVariable String id, @RequestBody BookUpdate update) {
    return modelMapper.map(bookService.modify(id, update), BookDto.class);
  }
  ```

- crowdToken 登入資訊
  `shop-common/src/main/resourcess/config/application-local.yml` 中
  ```yml
  crowd:
    hostname: ssouat.dtw.intranet
    port: 8095
    scheme: http
    appname: ssodemo
    password: Password1
    is-mock: true
    cookie-sso-enabled: false
  ```
  - [sso 富邦人壽wiki 教學](https://km.fubonlife.com.tw/confluence/pages/viewpage.action?pageId=866982217)
  - `ssouat.dtw.intranet` 需要開通防火牆
  - `is-mock`: 設為 `true` 可略過驗證 (測試期可用)。
  - `scheme` 為 專案代號 (需申請)
  - `appname`、`password` 為 專案帳號密碼 (需申請)

  - [測試 ssoToken 網址](http://portaluat.dtw.intranet/eai/rest/applicationusers/ssodemo/users)
    - 使用 postman 打API
    - 帳密 使用 ssodemo/Password1

- 設定某些API，需要通過 `token` 驗證
  - 增加 `@PreAuthorize("hasAnyRole('ROOT')")`
    ```java
    @GetMapping
    @ApiOperation("分頁查詢書籍")
    @PreAuthorize("hasAnyRole('ROOT')")
    Page<BookDto> paginateAuthors(@RequestParam @ApiParam(value = "分頁索引", required = true) int page,
                                  @RequestParam @ApiParam(value = "分頁大小", required = true) int size,
                                  @RequestParam(required = false) @ApiParam(value = "篩選條件") Specification<Book> filter) {
      return bookService.paginate(page, size, filter)
        .map(e -> modelMapper.map(e, BookDto.class));
    }
    ```

- 選單功能
  ```SQL
  -- 建立功能選單 (Leaf Node)
  INSERT INTO SHOP_MENU (ID, IS_LEAF, TITLE, ROUTE, URI, ENABLED, SEQUENCE, PARENT_MENU_ID) VALUES ('001001', 1, '產品 (Master Detail)', '/product', NULL, 1, 1, '001');
  INSERT INTO SHOP_MENU (ID, IS_LEAF, TITLE, ROUTE, URI, ENABLED, SEQUENCE, PARENT_MENU_ID) VALUES ('001002', 1, '產品規格 (Master Only)', '/product-spec', NULL, 1, 2, '001');
  INSERT INTO SHOP_MENU (ID, IS_LEAF, TITLE, ROUTE, URI, ENABLED, SEQUENCE, PARENT_MENU_ID) VALUES ('002001', 1, '角色', '/role', NULL, 1, 1, '002');
  INSERT INTO SHOP_MENU (ID, IS_LEAF, TITLE, ROUTE, URI, ENABLED, SEQUENCE, PARENT_MENU_ID) VALUES ('003001', 1, '金控 EIP', NULL, 'http://eip2.fubon.com/', 1, 1, '003');
  ```
  - `IS_LEAF`：是不是根節點，沒有其它子層
  - `TITLE`：選單標題
  - `ROUTE`：與前端對應的 route
  - `URI`：外連網址
  - `ENABLED`：是否顯示
  - `SEQUENCE`：做排序用的編號
  - `PARENT_MENU_ID`：父層menu id

- 角色權限設定
  ```SQL
  -- 建立角色/功能選單關聯
  INSERT INTO SHOP_ROLE_MENU (ID, ROLE_ID, MENU_ID) VALUES ('1', 'ROLE_ROOT', '001001');
  INSERT INTO SHOP_ROLE_MENU (ID, ROLE_ID, MENU_ID) VALUES ('2', 'ROLE_ROOT', '001002');
  INSERT INTO SHOP_ROLE_MENU (ID, ROLE_ID, MENU_ID) VALUES ('3', 'ROLE_ROOT', '002001');
  INSERT INTO SHOP_ROLE_MENU (ID, ROLE_ID, MENU_ID) VALUES ('4', 'ROLE_ROOT', '003001');

  INSERT INTO SHOP_ROLE_MENU (ID, ROLE_ID, MENU_ID) VALUES ('5', 'ROLE_NORMAL', '001001');
  INSERT INTO SHOP_ROLE_MENU (ID, ROLE_ID, MENU_ID) VALUES ('6', 'ROLE_NORMAL', '001002');
  INSERT INTO SHOP_ROLE_MENU (ID, ROLE_ID, MENU_ID) VALUES ('7', 'ROLE_NORMAL', '003001');
  ```

- 發布後端 SDK
  ```sh
  mvn clean -Drevision=1.0.0-BETA deploy
  ```

  - 設定發布後的 資料夾位置及名稱
    - 最外層的 `pom.xml`
      ```xml
      <properties>
        ...
        <codegen.java.repo>central::default::http://10.42.70.218/artifactory/libs-VL901-release</codegen.java.repo>
        ...
      </properties>
      ```

- book 的 新增刪除修改
  - `controller`

    ```java
    @RestController
    @RequestMapping(value = "/api/book")
    @Api(tags = "Book", description = "書籍")
    public class BookController {

      @Autowired
      private BookService bookService;

      @Autowired
      private ModelMapper modelMapper;

      @GetMapping
      @ApiOperation("分頁查詢書籍")
      @PreAuthorize("hasAnyRole('ROOT', 'NORMAL')")
      Page<BookDto> paginateAuthors(@RequestParam @ApiParam(value = "分頁索引", required = true) int page,
                                    @RequestParam @ApiParam(value = "分頁大小", required = true) int size,
                                    @RequestParam(required = false) @ApiParam(value = "篩選條件") Specification<Book> filter) {
        return bookService.paginate(page, size, filter)
            .map(e -> modelMapper.map(e, BookDto.class));
      }

      @GetMapping("/{id}")
      @ApiOperation("以 ID 查詢單一書籍")
      @PreAuthorize("hasAnyRole('ROOT', 'NORMAL')")
      BookDto describeBook(@PathVariable @ApiParam(value = "書籍 ID") String id) {
        return modelMapper.map(bookService.describe(id), BookDto.class);
      }

      @PostMapping
      @ApiOperation("建立書籍")
      @PreAuthorize("hasAnyRole('ROOT', 'NORMAL')")
      BookDto createAuthor(@RequestBody BookCreation creation){
        return modelMapper.map(bookService.create(creation), BookDto.class);
      }

      @PutMapping("/{id}")
      @ApiOperation("以 ID 編輯單一書籍")
      @PreAuthorize("hasAnyRole('ROOT', 'NORMAL')")
      BookDto updateBook(@PathVariable String id, @RequestBody BookUpdated updates){
        return modelMapper.map(bookService.modify(id ,updates), BookDto.class);
      }

      @DeleteMapping("/{id}")
      @ApiOperation("以 ID 刪除單一作者")
      @PreAuthorize("hasAnyRole('ROOT', 'NORMAL')")
      void deleteBook(@PathVariable @ApiParam(value = "書籍 ID") String id) {
        bookService.delete(id);
      }
    }
    ```

  - `BookService`
    ```java
    public interface BookService {
      Book create(BookCreation creation);
      Book modify(String id, BookUpdated updates);
      Book describe(String id);
      Page<Book> paginate(int page, int size, Specification<Book> filter);
      void delete(String id);
    }
    ```

  - `BookServiceImpl`
    ```java
    @Service
    public class BookServiceImpl implements BookService {
      @Autowired
      private BookRepository bookRepository;

      @Autowired
      private ModelMapper modelMapper;

      @Override
      public Page<Book> paginate(int page, int size, Specification<Book> filter) {
        if(filter == null) {
          return bookRepository.findAll(PageRequest.of(page, size));
        }
        return bookRepository.findAll(filter, PageRequest.of(page, size));
      }

      @Override
      @Transactional
      public Book create(BookCreation creation) {
        Book retVal = new Book();
        retVal.setName(creation.getName());
        retVal.setIsbn(creation.getIsbn());
        retVal.setAuthorId(creation.getAuthorId());
        return bookRepository.save(retVal);
      }

      @Override
      @Transactional
      public Book modify(String id, BookUpdated updates) {
        Book retVal = describe(id);
        retVal.setName(updates.getName());
        retVal.setIsbn(updates.getIsbn());
        retVal.setAuthorId(updates.getAuthorId());
        return bookRepository.save(retVal);
      }

      @Override
      public Book describe(String id) {
        return bookRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(ApiErrorCode.BOOK_NOT_FOUND));
      }

      @Override
      @Transactional
      public void delete(String id) {
        Book entity = describe(id);
        bookRepository.delete(entity);
      }
    }
    ```

    - `model`
      - `BookCreation`
        ```java
        @Data
        public class BookCreation {
          @ApiModelProperty("書名")
          private String name;
          @ApiModelProperty("ISBN")
          private String isbn;
          @ApiModelProperty("作者 ID")
          private String authorId;
        }
        ```

      - `BookDto`
        ```java
        @Data
        public class BookDto {
          @ApiModelProperty("書籍ID")
          private String id;
          @ApiModelProperty("書名")
          private String name;
          @ApiModelProperty("ISBN")
          private String isbn;
          @ApiModelProperty("作者 ID")
          private String authorId;
          @ApiModelProperty("作者")
          private AuthorDto author;
        }
        ```

      - `BookUpdated`
        ```java
        @Data
        public class BookUpdated {
          @ApiModelProperty("書名")
          private String name;
          @ApiModelProperty("ISBN")
          private String isbn;
          @ApiModelProperty("作者 ID")
          private String authorId;
        }
        ```

      - `BriefBook`
        ```java
        @Data
        public class BriefBook {
          @ApiModelProperty("書籍ID")
          private String id;
          @ApiModelProperty("書名")
          private String name;
          @ApiModelProperty("ISBN")
          private String isbn;
          @ApiModelProperty("作者 ID")
          private String authorId;
        }
        ```