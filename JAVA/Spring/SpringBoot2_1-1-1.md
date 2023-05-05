# 第一章 SpringBoot2 核心技術

# 第一節 SpringBoot2 基礎入門 
  - ## 學習要求
    - 熟悉 Spring 基礎
    - 熟悉 Maven 使用
  - ## 環境要求
    - Java8 及以上
    - [Maven 3.3 及以上](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started.html#getting-started-system-requirements)
  - ## 學習資料
    - [文檔地址](https://www.yuque.com/atguigu/springboot)
    - [影片地址](http://www.gulixueyuan.com/)、[影片地址2](https://www.bilibili.com/video/BV19K4y1L7MT?p=1)
    - [源碼地址](https://gitee.com/leifengyang/springboot2)
  
# 01、 Spring 與 SpringBoot
  - ## 1、 Spring 能做什麼
    - ### 1.1、 Spring 的能力
      ![image1](./spring_image_1.png)

      - 微服開發 - Microservices
      - 響應式編程 - Reactive
      - 分布式雲開發 - Cloud
      - web應用程式開發 - Web apps
      - 無伺服器開發 - Serverless 
      - 事件驅動 - Event Driven 
      - 批次處理- Batch 
    
    - ##### 1.2、 Spring 的生態
      [生態圈](https://spring.io/projects/spring-boot)
      `Spring 廣義`，指的是 `整個 Spring 生態圈`。
      `Spring 狹義`，指的是 `Spring Framework` (只是生態圈的其中一個項目)。

      SpringBoot 包含以下項目...等等
      - `Spring Framework`：含 Spring MVC
      - `Spring Data`：用來解決資料庫存取
      - `Spring Cloud`：用來解決分布式下的所有問題
      - `Spring Security`：提供整個應用的安全控制管理
      - `Spring Session`：提供分布式下的 session 管理

    - ##### 1.3、 Spring5 重大升級
      - ###### 1.3.1、 響應式編程
        ![image2](./spring_image_2.png)
        SpringBoot2 包含兩套方案：
        - `Reactive Stack`：`響應式 容器`，非同步數據流，Spring WebFlux。
        - `Servlet Stack`：`Servlet 容器`，同步數據流，Spring MVC。
      - ###### 1.3.2、 內部源碼設計
        基於 Java8 的一些新特性，如：介面預設實現。重新設計源碼架構。

  - ## 2、 為什麼用 SpringBoot
    能快速創建出 生產級的 Spring 應用。
    - ### 2.1、 SpringBoot 優點
      - 創建獨立 Spring 應用
      - 內嵌 web 服務器
      - 自動 starter(啟動器) 依賴，簡化構建配置
      - 自動配置 Spring 以及第三方功能
      - 提供生產級別的監控、健康檢查及外部化配置
      - 無代碼生成、無需編寫 XML

      `SpringBoot` 是整合 Spring 技術線的 一站式框架
      `SpringBoot` 是簡化 Spring 技術線的 快速開發腳手架

    - ### 2.2、 SpringBoot 缺點
      - 更新快，需要時刻關注變化
      - 封裝太深，內部原理複雜，不容易精通
      
  - ## 3、 時代背景
    - ### 3.1、 微服務
      James Lewis and Martin Fowler (2014)  提出微服务完整概念。https://martinfowler.com/microservices/
      - 微服務是一種架構風格
      - 一個應用拆分為一組小型服務
      - 每個服務運行在自己的進程內，也就是可獨立部署和升級
      - 服務之間使用輕量級 HTTP 交互
      - 服務圍繞業務功能拆分
      - 可以由全自動部署機制獨立部署
      - 去中心化，服務自治。服務可以使用不同的語言、不同的儲存技術

    - ### 3.2、 分布式
      ![image3](./spring_image_3.png)
      - #### 分布式的困難
        - 遠程調用 (各機器間的功能調用)
        - 服務發現 (找到可運行的機器)
        - 負載均衡 (分配負載)
        - 服務容錯 (遇到問題時，默認機制啟動)
        - 配置管理 (修改配置中心檔案，其他機器同步更新)
        - 服務監控 (監控機器健康狀況)
        - 鏈路追蹤 (出現問題時，可以追蹤整條鏈路)
        - 日誌管理
        - 任務調度
        - ...

      - #### 分布式的解決
        `SpringBoot` + `SpringCloud`
        ![image4](./spring_image_4.png)
        - Spring Boot 快速構建應用
        - Spring Cloud 將所有應用網狀包覆起來
        - Spring Cloud Data Flow 網狀結構數據流，成為響應式數據流

    - ### 3.3、 雲原生
      原生應用如何上雲。Cloud Native
      - ###### 上雲的困難
        - 服務自癒 (掛點了，自動起一抬起來)
        - 彈性伸縮 (流量爆點時，自動起多台)
        - 服務隔離 (掛點了，要能自動隔離)
        - 自動化部屬
        - 局部發布 (更版時，先針對單一係統發布，等穩定後再全部發布) 
        - 流量治理 (控制每一台流量控制)
        - ...
      - ###### 上雲的解決
        ![image5](./spring_image_5.png)

  - ## 4、 如何學習 SpringBoot
    - ### 4.1、 查找官網文件
      1. 官方網址 (https://spring.io/)
      2. Projects/Spring Boot (https://spring.io/projects/spring-boot)
      3. [LEARN](https://spring.io/projects/spring-boot#learn)
        - `CURRENT`：當前穩定發布版。
        - `SNAPSHOT`：快照版本，可以不用關注。
    - ### 4.2、 官方文檔架構
      - [官網教學 Spring-Boot 2.7.9](https://docs.spring.io/spring-boot/docs/2.7.9/reference/html/)
      ![image6](./spring_image_6.png)

      - [文檔](https://docs.spring.io/spring-boot/docs/2.7.9/reference/html/)
      - [官方PDF文檔](https://docs.spring.io/spring-boot/docs/2.7.9/reference/pdf/spring-boot-reference.pdf)

      - [更版資訊](https://github.com/spring-projects/spring-boot/wiki#release-notes)
