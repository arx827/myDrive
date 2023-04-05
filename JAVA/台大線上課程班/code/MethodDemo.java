
public class MethodDemo {
	
	public static int x = 100; // global, class level

	// 找最大值
	public static int max(int[] A) {
		int output = A[0];
		for (int i = 1; i < A.length; i++) {
			if (A[i] > output) {
				output = A[i];
			}
		}
		return output;
	}

	// 找最大值的位置
	public static int max_location(int[] A) {
		int loc = 0;
		for (int i = 1; i < A.length; i++) {
			if (A[i] > A[loc]) {
				loc = i;
			}
		}
		return loc;
	}

	// 加總
	public static int sum(int[] A) {
		int result = 0;
		for (int item : A) {
			result += item;
		}
		return result;
	}

	// 將資料全部印出
	public static void display(int[] A) {
		for (int i = 0; i < A.length; i++) {
			System.out.printf("%d ", A[i]);
		}
		System.out.println();
	}

	// 創造 Array 並挖洞
	public static int[] createIntegerArray(int size) {
		int[] A = new int[size];
		return A;
	}

	// 在 Array 中填值
	public static void fillRandomIntegers(int[] A) {
		for (int i = 0; i < A.length; i++) {
			A[i] = (int) (Math.random() * 100);
		}
	}

	public static void main(String[] args) {
		int[] A = createIntegerArray(15);
		fillRandomIntegers(A);
		display(A);
		System.out.println("MAX = " + max(A));
		System.out.println("Location of MAX = " + max_location(A));
		System.out.println("SUM = " + sum(A));

		System.out.println(x);
		
		int x = 0;
		System.out.println(x);
		
	}
}