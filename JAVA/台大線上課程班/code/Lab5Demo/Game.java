
public class Game {
	
	// data members
	private int s = (int) (Math.random() * 100);
	private int low = 0;
	private int high = 99;
	private Player player;
	
	public Game(Player player) {
		this.player = player; 
	}
	
	public void run() {
		
		while (true) {
			
			System.out.printf("(%d, %d)? ", low, high);
			int g = player.next(low, high);
			System.out.println(g);
			
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
