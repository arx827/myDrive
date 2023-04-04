
public class LiskovDemo {

	public static void main(String[] args) {
		
		T t = new W();
		if (t instanceof U) {
			U u = (U) t;
			System.out.println("Successful.");
		} else {
			System.out.println("Cannot convert T to U.");
		}
		
		System.out.println(t.getClass());

	}

}

class T {}
class U extends T {}
class W extends T {}