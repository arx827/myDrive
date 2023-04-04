
public class Lab2Demo {

	public static void main(String[] args) {

		int N = 8;
		int[] A = new int[N];
		for (int i = 0; i < A.length; i++)
			A[i] = i;
		for (int i = 0; i < A.length; i++) {
			int j = (int) (Math.random() * (A.length - i)) + i;
			int tmp = A[i];
			A[i] = A[j];
			A[j] = tmp;
		}
		
		System.out.printf("%9s", "Id");
		for (int i = 0; i < N; i++) {
			System.out.printf("%3d", i);
		}
		System.out.println();
		System.out.printf("%9s", "Contactee");
		for (int i = 0; i < N; i++) {
			System.out.printf("%3d", A[i]);
		}
		System.out.println();
		
		int target = 0;
		System.out.println("Answer:");
		int curr = target;
		do {
			System.out.printf("%d ", curr);
			curr = A[curr]; // x = x + 1
		} while (curr != target);
		
	}

}