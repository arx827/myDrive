import java.util.Scanner;

public class Lab1Demo {

	public static void main(String[] args) {
		
		int s = (int) (Math.random() * 100);
		int low = 0, high = 99; // inclusive
		Scanner input = new Scanner(System.in);
		
		while (true) {
			
			System.out.printf("(%d, %d)? ", low, high);
			int g = input.nextInt();
			
			if (g > high || g < low) {
				System.out.println("Out of range. Try again?");
				continue;
			}
			
			if (s == g) {
				System.out.println("Bingo.");
				break;
			} else if (g > s) {
				System.out.println("Too large.");
				high = g - 1;
			} else {
				System.out.println("Too small.");
				low = g + 1;
			}
			
			if (low == high) {
				System.out.println("Game over.");
				break;
			}
			
		}

	}

}