# spring-boot-starter-fbl-with-spring-day3

- `predicate` 像是一坨條件，可以加上 `and` 條件組出另一種條件，`and()` 裡還能再放一個條件，名字如果不是空的，再去查包含上面傳下來的名字，`contains` 裡是放上面傳進來的 `name` 參數

    ```java
    @Override
    public Page<Author> paginate(int page, int size, String name, Gender gender) {
        QAuthor a = QAuthor.author;

        BooleanBuilder pred = new BooleanBuilder();

        if(name != null) {
            pred = pred.and(a.name.contains(name)); // 包含
        }
        if(gender != null) {
            pred = pred.and(a.gender.eq(gender));   // 等於
        }

        return authorRepository.findAll(pred, PageRequest.of(page, size));
    }
    ```

- 系統對系統，推薦api明確參數寫法

- 系統對前端的話，推薦 `specification` 比較容易整合(前端有專門整合specificationfilter 的工具)

- `@GetMapping("/{id}")`，id外面包大括號代表網址是變數
  ```java
  @GetMapping("/{id}")
  @ApiOperation("以 ID 查詢單一作者")
  AuthorDto describeAuthor(@PathVariable @ApiParam(value = "作者 ID") String id) {
    return modelMapper.map(authorService.describe(id), AuthorDto.class);
  }
  ```
  `@PathVariable` 寫上去後，後面的id就會變成網址

- `Optional` 會回 Optional class 不會回 `entity` (day3-2 8:51)，`Optional` 類是一個可以為 `null` 的容器對象。如果值存在，則 `isPresent()` 方法會返回 true，調用 `get()` 方法會返回該對象。

- `ResourceNotFoundException()` 找不到東西就丟這個 `exception`。

- `modelMapper.map(Object source, Object destination)`

- 因 `service` 給我們是 `entity`，所以需要 `modelmapper` 幫我轉成`dto`，`modelmapper.map(來源, 轉成想要的class(物件))`。 當二個物件均有實體時 `modelmapper.map`，把誰寫去哪個東西(多欄位方便使用)。

- 除了讀取資料以外，對於資料庫的所有操作，都要加 `@Transactional`。
  ```java
  @Override
  @Transactional
  public Author modify(String id, AuthorUpdates updates) {
    Author entity = describe(id);

    //  entity.setName(updates.getName());

    modelMapper.map(updates, entity);

    return authorRepository.save(entity);
    }
  ```

- 在 `DTO` 上面可以加 `swagger 註解`，找到 `xxx-common` 資料夾底下的 `model/.../xxxDto`
- `@ApiModelProperty('<註解>')` 
  ```java
  public class AuthorCreation {
    @ApiModelProperty("姓名")
    private String name;
    @ApiModelProperty("性別")
    private Gender gender;
  }
  ```

- `@ApiEnum('<註解>')`
  ```java
  public enum Gender {
    @ApiEnum("女")
    F,
    @ApiEnum("男")
    M
  }
  ```

- `orElse` 
  - 如果找到需要查的值，就返回那個值。如果沒有的話，就再回另一個我指定的東西給我
  - `orElse()` : 
    - 當值為 `null` 時，返回的是該方法的參數。但值不為 null 時，返回值本身。[來自](https://blog.csdn.net/weixin_44389218/article/details/114164437)
- `orElseThrow()`
  - 當值為 `null` 時，返回的是實現了 `Supplier` 接口的對象的 `get()` 值 。但值 不為 `null` 時, 返回值本身。[來自](https://blog.csdn.net/weixin_44389218/article/details/114164437)


- `orElseThrow(要用lambda給)` 如果找到需要查的值，就返回那個值。如果沒有的話，就丟出指定 `Exception`

- 剛在 `AuthorService` 新建 一個方法後，也需要到 `AuthorServiceImpl` 新增對應實例，可在新建方法處，按下 `Alt` + `Enter`，會跳出一個介面，選擇 `Implement method '方法名'`，即可新增對實例。

- 查詢，若無資料則回傳錯誤
  ```java
  @Override
    public Author describe(String id) {
        /// 以下是舊的寫法

      //        Optional<Author> result = authorRepository.findById(id);
      //        if(result.isPresent()) {
      //            Author retVal = result.get();
      //            return retVal;
      //        }
      //        throw new ResourceNotFoundException(ApiErrorCode.AUTHOR_NOT_FOUND);

        /// 以下是新的寫法

      return authorRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(ApiErrorCode.AUTHOR_NOT_FOUND));
    }

  @Override
  public Book describe(String id) {
    return bookRepository
      .findById(id)
      .orElseThrow(() -> new ResourceNotFoundException(ApiErrorCode.BOOK_NOT_FOUND));
  }
  ```


