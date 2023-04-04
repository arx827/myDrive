import java.util.Scanner;

public class CashierDemo {

	public static void main(String[] args) {
		
		int price = 0, total = 0;
		Scanner input = new Scanner(System.in);
		
		/*
		System.out.println("Enter price?");
		price = input.nextInt();
		
		while (price > 0) {
			total += price;
			System.out.println("Enter price?");
			price = input.nextInt();
		}
		*/
		
		do {
			total += price;
			System.out.println("Enter price?");
			price = input.nextInt();
		} while (price > 0);

		System.out.println("TOTAL = " + total);
		input.close();

	}

}