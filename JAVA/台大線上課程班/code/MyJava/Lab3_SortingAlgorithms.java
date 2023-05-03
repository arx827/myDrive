import java.util.Arrays;

public class Lab3_SortingAlgorithms {

  public static int numOfRepetitions = 10; // repeat N times for each size
  public static String[] algorithmTitles = { "Bubble sort", "Selection sort", "Insertion sort", "Arrays.sort" };
  public static int[] sizes = { 1000, 2000, 4000, 8000, 16000, 32000, 64000 };
  public static double[][] records = new double[algorithmTitles.length][sizes.length];

  public static void main(String[] args) {
    //  debug();
    for (int i = algorithmTitles.length - 1; i >=0; i--) {
      simulate(i);
    }
    showStat();
  }

  public static void debug() {
    int[] A = arrayGen(10);
    display(A);

    double t0 = System.nanoTime() / 1e6;
    // bubbleSort(A);

    // selectionSort(A);

    insertionSort(A);
    double t1 = System.nanoTime() / 1e6;

    display(A);
    System.out.println(t1 - t0);
  }

  // 產生亂數
  public static int[] arrayGen(int N) {
    int[] A = new int[N];
    for (int i = 0; i < A.length; i++)
      A[i] = (int) (Math.random() * N * 10);
    return A;
  }

  // 印出陣列
  public static void display(int[] A) {
    for (int item: A) {
      System.out.printf("%d ", item);
    }
    System.out.println();
  }

  public static void simulate(int algoNo) {
    System.out.printf("Simulating %s: ", algorithmTitles[algoNo]);
    for (int i = 0; i < sizes.length; i++) {
      for (int j = 1; j <= numOfRepetitions; j++) {
        int[] A = arrayGen(sizes[i]);
        double t0 = System.nanoTime() / 1e6;

        switch (algoNo) {
          case 0:
            bubbleSort(A);
            break;
          case 1:
            selectionSort(A);
            break;
          case 2:
            insertionSort(A);
            break;
          case 3:
            Arrays.sort(A);
            break;
        }
        double t1 = System.nanoTime() / 1e6;
        records[algoNo][i] += t1 - t0;
      }
      System.out.printf(".");                 // 進度
      records[algoNo][i] /= numOfRepetitions; // 換算時間
    }
    System.out.println("done");
  }

  // 顯示統計結果
  public static void showStat() {
    System.out.println("Benchmark (time unit: ms)");
    System.out.printf("%7s", "Size");
    for (String title: algorithmTitles) {
      System.out.printf("%17s", title);
    }
    System.out.println();

    for (int i = 0; i < sizes.length; i++) {
      System.out.printf("%7d", sizes[i]);
      for (int j = 0; j < records.length; j++)
        System.out.printf("%17.3f", records[j][i]);
      System.out.println();
    }
  }


  // -------------------- 排序 函數 -------------------- //
  // 冒泡排序
  public static void bubbleSort(int[] A) {
    for(int j = 0; j < A.length - 1; j++) {
      for (int i = 0; i < A.length - 1 - j; i++) {
        if(A[i] > A[i + 1]) {
          int tmp = A[i];
          A[i] = A[i + 1];
          A[i + 1] = tmp;
        }
      }
    }
  }

  // 選擇排序
  public static void selectionSort(int[] A) {
    for (int j = 0; j < A.length; j++) {
      int idx = j;
      for (int i = j; i < A.length; i++) {
        if(A[i] < A[idx]) {
          idx = i;
        }
      }
      int tmp = A[j];
      A[j] = A[idx];
      A[idx] = tmp;
    }
  }

  // 插入排序
  public static void insertionSort(int[] A) {
    for (int i = 1; i < A.length; i++) {
      int tmp = A[i];
      int j = i - 1;
      for (; j >= 0; j--) {
        if(A[j] > tmp) {
          A[j + 1] = A[j];
        } else {
          break;
        }
      }
      A[j + 1] = tmp;
    }
  }
}