package com.example.demo;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpSession;
import ai.peoplecode.OpenAIConversation;

@RestController
public class BookController {
  private final BookRepository bookRepository;
  private static String context;
  private static OpenAIConversation conversation = new OpenAIConversation("demo", "gpt-4o-mini");

  
  @GetMapping("/getQuestion")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public String getQuestion(@RequestParam String title) {

     String mathQuestion = conversation.askQuestion("Respond in json format with the following keys: problem, solutionDescription, answerChoices as an object with keys {A, B, C, D}, answer ", "Give me a math word problem involving " + title);

    return mathQuestion;
  }

  @GetMapping("/nextQuestion")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public String nextQuestion() {

     String mathQuestion = conversation.askQuestion("Respond in json format with the following keys: problem, solutionDescription, answerChoices, answer ", "Next question.");

    return mathQuestion;
  }

  public BookController(BookRepository bookRepository) {
    this.bookRepository = bookRepository;
  }

  @PostMapping("/saveBook")
  @CrossOrigin(origins = "*")
  public String saveBook(@RequestBody Book book) {
    if (book == null) {
      return "The book is invalid";
    }
    this.bookRepository.save(book);
    return "success";
  }
  
  @GetMapping("/findByAuthor")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public List<Book> findByAuthor(@RequestParam String author) {
  	Iterable<Book> books = this.bookRepository.findByAuthor(author);
    List<Book> bookList = new ArrayList<>();
    books.forEach(bookList::add);
    return bookList;
  }  

  @GetMapping("/findAllBooks")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public List<Book> findAllBooks() {
  	Iterable<Book> books = this.bookRepository.findAll();
    List<Book> bookList = new ArrayList<>();
    books.forEach(bookList::add);
    return bookList;
  }
  /*public String findAllBooks() {
    Iterable<Book> books = this.bookRepository.findAll();
    List<Book> bookList = new ArrayList<>();
    books.forEach(bookList::add);
    return books.toString();
    
  } */

 @GetMapping("/findByYear")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public List<Book> findByYear(@RequestParam String year) {
  	Iterable<Book> books = this.bookRepository.findByYear(Integer.parseInt(year));
    List<Book> bookList = new ArrayList<>();
    books.forEach(bookList::add);
    return bookList;
  }
}