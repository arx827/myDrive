# 04、 配置文件
  `SpringBoot` 的配置文件可以在 `properites`，也可寫在 `yaml`。
  - ## 1、 文件類型
    - ### 1.1、 properites
      同 以前的 properties。
    - ### 1.2、 yaml
      - #### 1.2.1、 簡介
        `YAML` 是 "YAML Ain't Markup Language" (YAML 不是一種標記語言) 的遞歸縮寫。
        在開發這種語言時，YAML 的意思其實是： "Yet Another Markup Language" (仍是一種標記語言)。

        非常適合用來做以數據為中心的配置文件。

      - #### 1.2.2、 基本語法
        - key: value; k v之間有空格。
        - 大小寫敏感。
        - 使用 `縮進`表 示層級關係。
        - 縮進不允許使用 `tab`，只允許 `空格`。
        - 縮進的空格數不重要，只要相同層級的元素向左對齊即可。
        - `#` 表示註釋。
        - 字符串無需加引號，如果要加，`"` 與 `'` 表示字符串內容 會被 轉譯/不轉譯。
      
      - #### 1.2.3、 數據類型
        - 字面量：單個的、不可再分的值。 `data`、`boolean`、`string`、`number`、`null`
          ```YAML
          k: v
          ```
        
        - 物件：鍵值對的集合。 `map`、`hash`、`set`、`object`
          ```YAML
          <!-- 行內寫法 -->
          k: {k1:v1,k2:v2,k3:v3}
          
          <!-- 或 -->
          k:
            k1: v1
            k2: v2
            k3: v3
          ```

        - 陣列：一組按次序排列的值。 `array``list``queue`
          ```YAML
          <!-- 行內寫法 -->
          k: [v1,v2,v3]
          
          <!-- 或 -->
          k:
           - v1
           - v2
           - v3
          ```

      - #### 1.2.4、 範例
        ```java
        /* --- /bean/Person --- */
        @ConfigurationProperties(prefix = "person")
        @Component
        @ToString
        @Data
        public class Person {
          private String userName;
          private Boolean boss;
          private Date birth;
          private Integer age;
          private Pet pet;
          private String[] interests;
          private List<String> animal;
          private Map<String, Object> score;
          private Set<Double> salarys;
          private Map<String, List<Pet>> allPets;
        }

        /* --- /bean/Pet --- */
        @Component
        @ToString
        @Data
        public class Pet {
          private String name;
          private Double weight;
        }
        ```

        ```YAML
        # 檔案位置： /resources/application.yml
        # yaml 表示以上對象
        person:
          userName: zhangsan
          boss: false
          birth: 2019/12/12 20:12:33
          age: 18
          pet: 
            name: tomcat
            weight: 23.4
          interests: [籃球,游泳]
          animal: 
            - jerry
            - mario
          score:
            english: 
              first: 30
              second: 40
              third: 50
            math: [131,140,148]
            chinese: {first: 128,second: 136}
          salarys: [3999,4999.98,5999.99]
          allPets:
            sick:
              - {name: tom}
              - {name: jerry,weight: 47}
            health: [{name: mario,weight: 47}]
        ```

  - ## 2、 配置提示
    自定義的類和配置文件綁定一般沒有提示。

    增加 `spring-boot-configuration-processor` dependency 到 `pom.xml`

    並添加到 build 的 exclude 將 此套件排除在打包之外。
    ```xml
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-configuration-processor</artifactId>
      <optional>true</optional>
    </dependency>

    <build>
      <plugins>
        <plugin>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-maven-plugin</artifactId>
          <configuration>
            <excludes>
              <exclude>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-configuration-processor</artifactId>
              </exclude>
            </excludes>
          </configuration>
        </plugin>
      </plugins>
    </build>
    ```

