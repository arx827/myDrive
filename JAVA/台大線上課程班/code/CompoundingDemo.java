
public class CompoundingDemo {

	public static void main(String[] args) {
		
		int balance = 100, goal = 200;
		double r = 18; // percentage
		
		/*
		int holding_years = 0;
		while (balance < goal) {
			balance *= (1 + r / 100);
			holding_years++;
		}
		*/
		
		int holding_years = 0;
		for (; balance < goal; holding_years++) {
			balance *= (1 + r / 100);
		}
		
		System.out.println("BALANCE = " + balance);
		System.out.println("HOLDING YEARS = " + holding_years);

	}

}