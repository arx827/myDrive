
public class InhertianceDemo {
	
	public static void goDinner(Animal a) {
		a.eat();
	}
	
	public static void main(String[] args) {
						
		Animal arthur = new Human();
		arthur.eat();
		arthur.exercise();
//		arthur.writeCode();
		
		Animal lucky = new Dog();
		lucky.eat();
		lucky.exercise();
//		lucky.wagTails();
		
		goDinner(arthur);
		goDinner(lucky);
		
	}

}

abstract class Animal {
	
	public abstract void eat();
	public void exercise() {}
	
}

class Human extends Animal {
	
	public void writeCode() {}
	
	@Override
	public void eat() {
		System.out.println("拿筷子吃。");
	}
	
}

class Dog extends Animal {
	
	public void wagTails() {}
	
	public void eat() {
		System.out.println("趴著吃。");
	}
	
}




