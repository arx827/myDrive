import java.util.Scanner;

public class RandomIntegerDemo {

	public static void main(String[] args) {
		
		// (1) Generate two random integers.
		int x = (int) (Math.random() * 10);
		int y = (int) (Math.random() * 10);
		
		// (2) Show math question.
		System.out.println(x + " + " + y + " = ?");
		
		// (3) Take user input.
		Scanner input = new Scanner(System.in);
		int g = input.nextInt();
		
		// (4) Judge the input.
		/*
		if (g == x + y) {
			System.out.println("Correct.");
		} else {
			System.out.println("Wrong.");
			System.out.println("The answer is " + (x + y) + ".");
		}
		*/
		while (g != x + y) {
			System.out.println("Try again?");
			g = input.nextInt();
		}
		System.out.println("Correct.");
			
		input.close();

	}

}