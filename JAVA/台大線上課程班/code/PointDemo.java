
public class PointDemo {

	public static void main(String[] args) {
		
		Point p1 = new Point(10, 20);
//		p1.setX(10);
//		p1.setY(20);
		
		Point p2 = new Point();
		p2.setX(3);
		p2.setY(4);
		
//		System.out.printf("(%.2f, %.2f)\n", p1.getX(), p1.getY());
//		System.out.printf("(%.2f, %.2f)\n", p2.getX(), p2.getY());
		System.out.println(p1);
		System.out.println(p2);
		double distance;
//		distance= p1.getDistanceFrom(p2);
		distance= Point.measure(p1, p2);
		System.out.println("Distance = " + distance);

	}

}