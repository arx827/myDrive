
public class BisectionDemo {

	public static void main(String[] args) {
		
		double a = 1, b = 2, c = 0, eps = 1e-9;
		
		while (b - a > eps) {
			
			c = (a + b) / 2;
			
			double fa = a * a * a - a - 2;
			double fc = c * c * c - c - 2;
			
			if (fa * fc < 0) {
				b = c;
			} else {
				a = c;
			}
			
		}
		
		double error = c * c * c - c - 2;
		System.out.println("Root ~ " + c);
		System.out.println("Error = " + error);

	}

}