import java.util.ArrayList;
import java.util.Scanner;

public class Lab2_ContagionControl {
  public static void main(String[] args) {
    Scanner input = new Scanner(System.in);
    System.out.println("Enter number of citizens:");

    int N = input.nextInt();

    // 生成 citizens
    ArrayList<Integer> idArr = new ArrayList<>();
    ArrayList<Integer> selfIsolated = new ArrayList<>();
    for(int i = 0; i < N; i++) {
      idArr.add(i);
    }

    // 隨機序列
    for(int i = idArr.size() - 1; i > 0; i--){
      int j = (int) (Math.random() * (i + 1));
      int z = idArr.get(i);
      idArr.set(i, idArr.get(j));
      idArr.set(j, z);
    }

    // 生成 Id index
    System.out.printf("%10s", "Id");
    for(int i = 0; i < N; i++) {
      System.out.printf("%4d", i);
    }

    // 生成 Contactee
    System.out.println();
    System.out.printf("%10s", "Contactee");
    for(int item : idArr) {
      System.out.printf("%4d", item);
    }
    System.out.println();

    System.out.println("----------------");
    System.out.println("Enter id of infected citizen: ");

    // 從哪一個公民開始查詢接觸過的人
    int from = input.nextInt();
    selfIsolated.add(from);
    int contact = from;
    while(true) {
      contact = idArr.get(contact);
      if(contact == from) break;
      selfIsolated.add(contact);
    }

    System.out.println("These citizens are to be self-isolated in the following 14 days");
    for(int item: selfIsolated) {
      System.out.printf("%3d", item);
    }
    input.close();
  }
}
