# spring-boot-starter-fbl-with-spring-day2

- IntelliJ 在未宣告的 Function 上，使用快捷鍵 `option + Enter`，即可 implements methods

- 程式的上一頁、下一頁，`command` + `option` + `←` 或 `→`

- 整理程式
  ```java
  List<AuthorDto> listAuthors() {
    List<AuthorDto> retVal = new ArrayList<>();
    List<Author> entities = authorService.list();

    for( Author e: entities) {
        AuthorDto dto = modelMapper.map(e, AuthorDto.class);
        retVal.add(dto);
    }
    return retVal;
  }
  ```
  可改寫成
  ```java
  List<AuthorDto> listAuthors() {
    return authorService.list()
      .stream()
      .map(e -> modelMapper.map(e, AuthorDto.class) )
      .collect(Collectors.toList());
  }
  ```

- Spring Data jpa 方法命名規則
  [SpringBoot-Query-creation]https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.query-methods.query-creation

- 使用 `@Query()`，可使用 `JPQL` 來告訴 `spring`，不用再依方法命名規則來產生 `SQL`，我要自己寫
  ```java
  @Query("select a from Author a where (:name is null or a.name like concat('%', :name, '%'))")
  ```

- 以上如果條件太多 `where` 會太長 所以不宜使用，可使用 `public interface AuthorRepository extends JpaRepository<Author, String>, JpaSpecificationExecutor<Author>`,
，讓外界決定使用啥條件(動態給條件)

- 重構時，可針對變數名、參數名 一併變更
  - 在參數上方按右鍵 找到 `Refactor`，選擇 `Change Signature`，即可一起變更型態及參數名稱，Method calls 選擇 `Modify` (當外面有其他地方呼叫時，會一併連動變更)

  - Service層 需相應調整為 `Page<Author>paginate(int page, int size, Specification<Author>)`; 相當於一坨條件，可從外面決定。 
  - json 格式如下：
    ```json
    {"filters":[{"property":"name","operator":"EQ","operand":["A123"]},{"property":"gender","operator":"EQ","operand":["F"]}]}
    ```
  - `Specification filter`長相，以上等於找出 `name="A123"; gender="F"`
  - 傳送後端時，記得先轉成文字

  - `JpaRepository<Author, String>` 基本增刪查改，`JpaSpecificationExecutor<Author> jpaspec 查詢器`, `QuerydsIPredicateExecutor<Author>Querydsl查詢器`
  