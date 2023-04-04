
public class ArrayDemo {

	public static void main(String[] args) {
		
		int[] A = new int[5];
		
		for (int i = 0; i < A.length; i++) {
			A[i] = (int) (Math.random() * 100);
		}
		
		for (int i = 0; i < A.length; i++) {
			System.out.printf("%d ", A[i]);
		}
		System.out.println();

		int max = A[0];
		for (int i = 1; i < A.length; i++) {
			if (A[i] > max) {
				max = A[i];
			}
		}
		System.out.println("MAX = " + max);
		
		int sum = 0;
		/*
		for (int i = 0; i < A.length; i++) {
			sum += A[i]; // equivalent to sum = sum + A[i].
		}
		*/
		for (int item : A) {
			sum += item;
		}
		System.out.println("SUM = " + sum);
		
		String[] B = { "A", "B", "C", "D", "E" };
		for (int i = 0; i < A.length; i++) {
			
			int j = (int) (Math.random() * A.length);
			
			String tmp = B[i];
			B[i] = B[j];
			B[j] = tmp;	
			
		}
		for (String item : B) {
			System.out.printf("%s ", item);
		}
		System.out.println();
		
	}

}