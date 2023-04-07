
public class BinarySearchAI extends NaiveAI {
	
	@Override 
	public int next(int low, int high) {
		return (low + high) / 2;
	}

}
