import java.util.Scanner;
public class Lab1_NumberGuessingGame {
  public static void main(String[] args) {
    int low = 0, high = 99;
    // 秘密數字
    int secret = (int)(Math.random() * 100);
    Scanner input = new Scanner(System.in);
    int userInput = 0;

    while(true){
      // 目前範圍在？
      System.out.println("(" + low + "," + high + ") ?");
      // System.out.println("秘密為" + secret);

      // 使用者輸入
      userInput = input.nextInt();

      // 超出範圍，再來一次
      if(userInput < low || userInput > high) {
        System.out.println("Out of range. Try again?");
        continue;
      }

      // 正確答案
      if(userInput == secret) {
        System.out.println("Bingo");
        break;
      }

      else if(userInput < secret){
        low = userInput + 1;
      }else {
        high = userInput - 1;
      }

      // 只剩下一個整數，失敗
      if( low >= high) {
        System.out.println("GG, answer is " + secret);
        break;
      }
    };
  }
}
