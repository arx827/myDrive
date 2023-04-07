
public class NaiveAI extends Player {

	@Override
	public int next(int low, int high) {
		return (int) (Math.random() * (high - low + 1) + low);
	}

}
