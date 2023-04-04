import java.util.Scanner;

public class ComputeAreaDemo {

	public static void main(String[] args) {
		
		// Input
		System.out.println("Enter r?");
		Scanner input = new Scanner(System.in);
		int r = input.nextInt();
		
		if (r > 0) {
			// Algorithm
			double A = r * r * 3.14;
			// Output
			System.out.println(A);
		} else {
			System.out.println("Not a circle.");
		}
		
		input.close();

	}

}