
public class Point {
	
	private double x, y; // fields; data members
	
	// function members
	
	public Point() { } // default constructor
	
	public Point(double x, double y) {
		this.x = x;
		this.y = y;
	}
	
	public double getX() {
		return x;
	}
	
	public double getY() {
		return y;
	}
	
	public void setX(double a) {
		x = a;
	}
	
	public void setY(double b) {
		y = b;
	}
	
	public double getDistanceFrom(Point that) {
		
		return Math.sqrt(Math.pow(this.x - that.x, 2) + 
				         Math.pow(this.y - that.y, 2));
		
	}
	
	public static double measure(Point first, Point second) {
		
		return Math.sqrt(Math.pow(first.x - second.x, 2) + 
		                 Math.pow(first.y - second.y, 2));
		
	}
	
	@Override
	public String toString() {
		return "(" + x + ", " + y + ")";
	}

}