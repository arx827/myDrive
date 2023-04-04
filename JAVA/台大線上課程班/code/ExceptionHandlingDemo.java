import java.io.File;
import java.util.InputMismatchException;
import java.util.Scanner;

public class ExceptionHandlingDemo {
	
	public static boolean existsFile(String fullpath) {
		return false;
	}
	public static void readFile(String fullpath) throws Exception {
		if (!existsFile(fullpath))
			throw new Exception("File not found.");
	}

	public static void main(String[] args) {
		
		try {
			readFile("./ooo.txt");
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		Scanner input = new Scanner(System.in);
		System.out.println("Enter x?");
		try {
			int x = input.nextInt();
			System.out.println(x * 2);
		} catch (InputMismatchException e) {
			System.out.println("Not an integer.");
		} catch (ArrayIndexOutOfBoundsException e) {
			System.out.println("...");
		} catch (Exception e) {
			System.out.println("The rest of exceptions...");
		} finally {
			
		}
		
		System.out.println("End of program.");

	}

}