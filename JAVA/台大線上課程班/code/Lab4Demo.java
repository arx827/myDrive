
public class Lab4Demo {

	public static void main(String[] args) {
		
		System.out.println(pow(2, 10));

	}
	
	public static double pow(double x, int n) {
		
		if (n == 0) {
			return 1;
		}
		
		double y = pow(x, n / 2);
		y = y * y;
		if (n % 2 == 1) {
			y = y * x;
		}
		return y;
		
	}

}