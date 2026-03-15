package me.seyrek.library_management_system.concurrency;

import me.seyrek.library_management_system.author.model.Author;
import me.seyrek.library_management_system.author.repository.AuthorRepository;
import me.seyrek.library_management_system.book.model.Book;
import me.seyrek.library_management_system.book.repository.BookRepository;
import me.seyrek.library_management_system.category.model.Category;
import me.seyrek.library_management_system.category.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.transaction.support.TransactionTemplate;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
public class OptimisticLockingTest {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Test
    public void testOptimisticLockingOnBook() {
        // 1. Setup: Create a Book with required dependencies
        Long bookId = transactionTemplate.execute(status -> {
            Category category = new Category();
            category.setName("Concurrency Test Category");
            categoryRepository.save(category);

            Author author = new Author();
            author.setName("Test Author");
            authorRepository.save(author);

            Book book = new Book();
            book.setTitle("Original Title");
            book.setIsbn("978-3-16-148410-0");
            book.setPrice(BigDecimal.TEN);
            book.setCategory(category);
            
            Set<Author> authors = new HashSet<>();
            authors.add(author);
            book.setAuthors(authors);
            
            return bookRepository.save(book).getId();
        });

        // 2. Simulate User A reading the book
        Book bookVersionA = bookRepository.findById(bookId).orElseThrow();
        
        // 3. Simulate User B reading the SAME book (same version)
        Book bookVersionB = bookRepository.findById(bookId).orElseThrow();

        // Verify they start with the same version
        assertEquals(bookVersionA.getVersion(), bookVersionB.getVersion());

        // 4. User A updates and saves first
        transactionTemplate.execute(status -> {
            Book bookToUpdate = bookRepository.findById(bookId).orElseThrow();
            bookToUpdate.setTitle("Updated by User A");
            return bookRepository.save(bookToUpdate);
        });

        // 5. User B tries to update their STALE version
        // Note: We use bookVersionB which we loaded BEFORE User A's update.
        // Its version is now old (e.g., 0), but the DB is at 1.
        bookVersionB.setTitle("Updated by User B");

        // 6. Assert that saving the stale entity throws OptimisticLockingFailureException
        assertThrows(ObjectOptimisticLockingFailureException.class, () -> bookRepository.save(bookVersionB));
    }
}
