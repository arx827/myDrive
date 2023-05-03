import java.util.Scanner;

public class Lab5_DesignPatterns {

  public static void main(String[] args) {
    new Game(new BinarySearchAI()).run();
  }

  public static class Player {
    Player() {}
    public int next(int low, int high) { return 0; }
  }

  public static class HumanPlayer extends Player {
    private Scanner input = new Scanner(System.in);
    HumanPlayer() { }

    @Override
    public int next(int low, int high) {
      return input.nextInt();
    }
  }

  public static class NaiveAI extends Player {
    @Override
    public int next(int low, int high) {
      return (int) (Math.random() * (high - low + 1) + low);
    }
  }

  // 二元拆分法
  public static class BinarySearchAI extends NaiveAI {
    @Override
    public int next(int low, int high) {
      return (high + low) / 2;
    }
  }

  // 猜邊界
  public static class SuperAI extends NaiveAI {
    @Override
    public int next(int low, int high) {
      return low;
    }
  }

  public static class Game {

    private int low = 0, high = 99, s;
    private Player player;

    Game(Player player) {
      s = (int)(Math.random() * 100);
      this.player = player;
    }

    public void run() {
      while(true){
        // 目前範圍在？
        System.out.printf("(%d, %d) ?", low, high);
        int userInput = player.next(low, high);
        System.out.printf(" %d\n", userInput);

        // 超出範圍，再來一次
        if(userInput < low || userInput > high) {
          System.out.println("Out of range. Try again?");
          continue;
        }

        // 正確答案
        if(userInput == s) {
          System.out.println("Bingo");
          break;
        }
        else if(userInput < s){
          low = userInput + 1;
        }else {
          high = userInput - 1;
        }

        // 只剩下一個整數，失敗
        if( low >= high) {
          System.out.println("GG, answer is " + s);
          break;
        }
      };
    }
  }
}
