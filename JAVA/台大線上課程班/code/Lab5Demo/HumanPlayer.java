import java.util.Scanner;

public class HumanPlayer extends Player {
	
	Scanner input = new Scanner(System.in);
	
	@Override
	public int next(int low, int high) {
		return input.nextInt();
	}

}
