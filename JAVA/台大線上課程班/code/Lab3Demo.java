import java.util.Arrays;

public class Lab3Demo {

	public static int repl = 10; // repeat N times for each size
	public static String[] titles = { "Bubble sort", "Selection sort", "Insertion sort", "Arrays.sort" };
	public static int[] sizes = { 1000, 2000, 4000, 8000, 16000, 32000, 64000 };
	public static double[][] records = new double[titles.length][sizes.length];

	public static void main(String[] args) {
		
		// debug();
		for (int i = titles.length - 1; i >= 0; i--) {
			run(i);
		}
		showStat();

	}
	
	/**
	 * You could use this method to check if the sorting algorithm is doing right by simply replacing the sorting method in Line 29.
	 */
	public static void debug() {
		
		int[] A = arrayFactory(10);
		display(A);
		
		double t0 = System.nanoTime() / 1e6;
		bubbleSort2(A);
		double t1 = System.nanoTime() / 1e6;
		
		display(A);
		System.out.println(t1 - t0);

	}


	/**
	 *  This method benchmarks four sorting algorithms with random integer arrays in various sizes.
	 *  Because the running time of comparison-based sorting algorithms is sensitive to the order of data sequence, I suggest that you could calculate the average running time aftering running each sorting algorithm for couples of times.
	 */
	public static void run(int id) {
		
		System.out.printf("Running %s: ", titles[id]);
		
		for (int i = 0; i < sizes.length; i++) {
			
			for (int j = 1; j <= repl; j++) {
				
				int[] A = arrayFactory(sizes[i]);
				double t0 = System.nanoTime() / 1e6;
				
				switch (id) {
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
				records[id][i] += t1 - t0;
			}
			
			System.out.printf("."); // progress bar
			records[id][i] /= repl; // average the time cost
		}
		System.out.println("done");
		
	}

	/**
	 * Use the method showStat() to display the benchmark table.
	 */
	public static void showStat() {
		
		System.out.println("Benchmark (time unit: ms)");
		System.out.printf("%7s", "Size");
		for (String title: titles)
			System.out.printf("%17s", title);
		System.out.println();
		
		for (int i = 0; i < sizes.length; i++) {
			System.out.printf("%7d", sizes[i]);
			for (int j = 0; j < records.length; j++)
				System.out.printf("%17.3f", records[j][i]);
			System.out.println();
		}

	}
	
	/**
	 * This method produces a random integer array with size N.
	 */
	public static int[] arrayFactory(int N) {
		
		int[] A = new int[N];
		for (int i = 0; i < A.length; i++)
			A[i] = (int) (Math.random() * N * 10);
		return A;
		
	}
	
	/**
	 * This method shows all elements of A.
	 */	
	public static void display(int[] A) {
		
		for (int item: A)
			System.out.printf("%d ", item);
		System.out.println();
		
	}

	/**
	 * Implement the bubble sort.
	 */
	public static void bubbleSort(int[] A) {
		
		for (int j = 0; j < A.length - 1; j++) {
			for (int i = 0; i < A.length - 1 - j; i++) {
				if (A[i] > A[i + 1]) {
					int tmp = A[i];
					A[i] = A[i + 1];
					A[i + 1] = tmp;
				}
			}
		}
		
	}
	
	public static void bubbleSort2(int[] A) {
		
		boolean swapped;
		int N = A.length - 1;
		
		do {
			
			swapped = false;
			for (int i = 0; i < N; i++) {
				if (A[i] > A[i + 1]) {
					int tmp = A[i];
					A[i] = A[i + 1];
					A[i + 1] = tmp;
					swapped = true;
				}
			}
			N--;
			
		} while (swapped);
		
	}
	
	/**
	 * Implement the selection sort.
	 */
	public static void selectionSort(int[] A) {
		
		for (int j = 0; j < A.length - 1; j++) {
			int pos = j;
			for (int i = pos + 1; i < A.length; i++)
				if (A[i] < A[pos]) pos = i;
			int tmp = A[j];
			A[j] = A[pos];
			A[pos] = tmp;
		}
		
	}
	
	/**
	 * Implement the insertion sort.
	 */
	public static void insertionSort(int[] A) {
		
		for (int j = 1; j < A.length; j++) {
			int tmp = A[j];
			int i = j - 1;
			for (; i >= 0 && A[i] > tmp; --i)
				A[i + 1] = A[i];
			A[i + 1] = tmp;
		}
	}

}