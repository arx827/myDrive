public class Lab4_FastPower {

  public static void main(String[] args) {
    double x = 2;
    for (int i = -10; i <= 10; i++) {
      // System.out.println(pow1(x, i) == pow2(x, i));
      System.out.printf("%.1f ^ %d = %f\n", x, i, pow2(x, i));
    }
  }

  // loop O(n) time
  public static double pow1(double x, int n) {
    double result = 1;
    for (int i = 1; i <= n; i++) {
      result *= x;
    }
    return result;
  }

  // 遞迴 O(log n) time
  public static double pow2(double x, int n) {
    if(n == 0) return 1;
    int m = n >= 0 ? n : -n;

    double y = pow2(x, m / 2);
    y = y * y;
    if(m % 2 == 1) {
      y *= x;
    }
    return n > 0 ? y : 1 / y;
  }
}
