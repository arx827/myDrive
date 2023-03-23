## Lab 1 Number-Guessing Game (猜數字)
  (Lecture_4)
  - 編寫一個猜數遊戲程序（沒玩過的可以參考[猜數字](https://www.funbrain.com/games/guess-the-number)）。
  - 該程序首先生成一個介於 0 和 99（含）之間的秘密數字。
  - 然後程序要求玩家猜一個數字。如果輸入值等於秘密數字，則玩家獲勝。如果不是，則根據輸入相應地更新範圍。
  - （例如，假設密碼是 42。如果玩家第一次輸入 50，則程序會在屏幕上顯示 (0, 49)。）當只剩下一個整數時，玩家輸掉遊戲。另外，確保玩家輸入的數字在可行範圍內；否則，要求用戶重做輸入。
  ![image_programming_lab1_1](./image/image_programming_lab1_1.png)

  - #### 練習
  ```java
    import java.util.Scanner;
    public class Lab1_Number_Guessing {
      public static void main(String[] args) {
        int l = 0, r = 99;
        // 秘密數字
        int secret = (int)(Math.random() * 100);
        Scanner input = new Scanner(System.in);
        int userInput = 0;
        
        while(true){
          // 目前範圍在？
          System.out.println("(" + l + "," + r + ") ?");
          // System.out.println("秘密為" + secret);
          
          // 使用者輸入
          userInput = input.nextInt();
          
          // 超出範圍，再來一次
          if(userInput < l || userInput > r) {
            System.out.println("Out of range. Try again?");
            continue;
          }
          
          // 正確答案
          if(userInput == secret) {
            System.out.println("Bingo");
            break;
          }
          
          else if(userInput < secret){
            l = userInput + 1;
          }else {
            r = userInput - 1;
          }
          
          // 只剩下一個整數，失敗
          if( l >= r) {
            System.out.println("GG, answer is " + secret);
            break;
          }
        };
      }

    }

  ```

  - #### 實驗 1-1（可選）
  添加一些策略（AI？）來玩這個遊戲，並通過使用這些策略 1e5 次來計算每個勝率。例如，樸素的策略是隨機猜測一個數字，其結果在 66% 左右。令人驚訝的是，二分查找的勝率約為 63%，並沒有像預期的那樣擊敗 naive。為什麼？

  - #### 實驗 1-2（可選）
  找到擊敗前兩者的最佳策略。結果如下所示。如您所見，我的最優策略的勝率達到了 99%！
  ![image_programming_lab1_2](./image/image_programming_lab1_2.png)

  - #### 實驗 1-3（可選）
  修改允許玩家最多猜測 7 次的遊戲循環（為什麼？）。還報告他們的表現如下：
  ![image_programming_lab1_3](./image/image_programming_lab1_3.png)
  二分查找的性能保持在 63% 左右，而其他兩個則嚴重下降！