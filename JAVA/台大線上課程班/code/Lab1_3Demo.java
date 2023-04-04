
public class Lab1_3Demo {

	public static void main(String[] args) {
		
		int N = 100000;
		int M = 0;
		for (int i = 1; i <= N; i++) {
			
			int s = (int) (Math.random() * 100);
			int low = 0, high = 99; // inclusive
			
//			while (true) {
			for (int j = 0; j < 7; j++) {
				
				int g = (int) (Math.random() * (high - low + 1)) + low;
//				int g = (low + high) / 2;
//				int g = low;
				
				if (s == g) {
					M++;
					break;
				} else if (g > s) {
					high = g - 1;
				} else {
					low = g + 1;
				}
				
				if (low == high) {
					break;
				}
				
			}
		}
		
		System.out.println(100.0 * M / N + " %");

	}

}