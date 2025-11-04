### Backend Structure for Smart Management (Spring Boot)

Based on the provided frontend codebase, which includes authentication, user/company management, stock control, and sales features, here's a high-level structure for a Java Spring Boot backend. This assumes a RESTful API design with JWT-based authentication, using Spring Security, Spring Data JPA, and H2/PostgreSQL for the database. The backend will support CRUD operations for entities like users, companies, products, sales, and tokens.

#### 1. Project Setup
- **Technology Stack**:
  - Java 17+
  - Spring Boot 3.x
  - Spring Web (for REST APIs)
  - Spring Data JPA (for ORM)
  - Spring Security (for authentication/authorization)
  - H2 Database (for development) or PostgreSQL (for production)
  - JWT (for token-based auth)
  - Maven (for dependency management)

- **Dependencies** (in `pom.xml`):
  ```xml
  <dependencies>
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-web</artifactId>
      </dependency>
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-data-jpa</artifactId>
      </dependency>
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-security</artifactId>
      </dependency>
      <dependency>
          <groupId>com.h2database</groupId>
          <artifactId>h2</artifactId>
          <scope>runtime</scope>
      </dependency>
      <dependency>
          <groupId>io.jsonwebtoken</groupId>
          <artifactId>jjwt-api</artifactId>
          <version>0.11.5</version>
      </dependency>
      <dependency>
          <groupId>io.jsonwebtoken</groupId>
          <artifactId>jjwt-impl</artifactId>
          <version>0.11.5</version>
          <scope>runtime</scope>
      </dependency>
      <dependency>
          <groupId>io.jsonwebtoken</groupId>
          <artifactId>jjwt-jackson</artifactId>
          <version>0.11.5</version>
          <scope>runtime</scope>
      </dependency>
      <!-- Add validation, email (for forgot password), etc., as needed -->
  </dependencies>
  ```

- **Application Properties** (`src/main/resources/application.properties`):
  ```properties
  spring.datasource.url=jdbc:h2:mem:testdb
  spring.datasource.driverClassName=org.h2.Driver
  spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
  spring.h2.console.enabled=true
  jwt.secret=your-secret-key
  jwt.expiration=86400000
  ```

#### 2. Package Structure
```
src/main/java/com/smartmanagement/
├── SmartManagementApplication.java  # Main class
├── config/
│   ├── SecurityConfig.java          # Spring Security configuration
│   └── WebConfig.java               # CORS, etc.
├── controller/
│   ├── AuthController.java          # Login, register, password reset
│   ├── UserController.java          # User CRUD
│   ├── CompanyController.java       # Company CRUD
│   ├── ProductController.java       # Product CRUD
│   ├── SaleController.java          # Sales CRUD
│   └── TokenController.java         # Token management
├── entity/
│   ├── User.java                    # User entity
│   ├── Company.java                 # Company entity
│   ├── Product.java                 # Product entity
│   ├── Category.java                # Product category
│   ├── Sale.java                    # Sale entity
│   ├── SaleItem.java                # Sale item (many-to-one with Sale)
│   └── Token.java                   # Registration token
├── repository/
│   ├── UserRepository.java          # JPA repository for User
│   ├── CompanyRepository.java       # For Company
│   ├── ProductRepository.java       # For Product
│   ├── SaleRepository.java          # For Sale
│   └── TokenRepository.java         # For Token
├── service/
│   ├── AuthService.java             # Auth logic (login, register)
│   ├── UserService.java             # User business logic
│   ├── CompanyService.java          # Company business logic
│   ├── ProductService.java          # Product/stock logic
│   ├── SaleService.java             # Sales/cart logic
│   └── EmailService.java            # For forgot password emails
├── dto/
│   ├── request/                     # DTOs for requests (e.g., LoginRequest, UserCreateRequest)
│   └── response/                    # DTOs for responses (e.g., UserResponse, SaleResponse)
├── exception/
│   ├── GlobalExceptionHandler.java  # Handle exceptions globally
│   └── CustomException.java         # Custom exceptions
└── security/
    ├── JwtAuthenticationFilter.java # JWT filter
    ├── JwtUtils.java                # JWT token generation/validation
    └── UserDetailsServiceImpl.java  # User details for Spring Security
```

#### 3. Key Entities
- **User** (maps to frontend user management):
  ```java
  @Entity
  public class User {
      @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      private String name;
      private String email;
      private String password; // Encrypted
      private String phone;
      @ManyToOne
      private Company company;
      private String role; // e.g., "ADMIN", "USER"
      private LocalDateTime createdAt;
      // Getters, setters, constructors
  }
  ```

- **Company** (for company CRUD):
  ```java
  @Entity
  public class Company {
      @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      private String name;
      private String email;
      private String cnpj;
      private String phone;
      private String address;
      // Other fields from frontend (logoUrl, etc.)
  }
  ```

- **Product** (for stock management):
  ```java
  @Entity
  public class Product {
      @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      private String name;
      private String description;
      @ManyToOne
      private Category category;
      private Integer stockAmount;
      private BigDecimal saleValue;
      // Other fields
  }
  ```

- **Sale** (for sales/cart):
  ```java
  @Entity
  public class Sale {
      @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      private String customerName;
      private LocalDate saleDate;
      private String paymentMethod; // e.g., "pix", "credit"
      private String status; // e.g., "completed"
      private String notes;
      private BigDecimal total;
      @OneToMany(mappedBy = "sale")
      private List<SaleItem> items;
  }
  ```

- **Token** (for registration tokens):
  ```java
  @Entity
  public class Token {
      @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      private String token; // UUID
      private Long companyId;
      private LocalDateTime createdAt;
  }
  ```

#### 4. Controllers (Sample)
- **AuthController** (handles login/register):
  ```java
  @RestController
  @RequestMapping("/api/auth")
  public class AuthController {
      @Autowired private AuthService authService;

      @PostMapping("/login")
      public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
          return authService.authenticate(request);
      }

      @PostMapping("/register")
      public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
          return authService.register(request);
      }

      // Add forgot-password, recover-password endpoints
  }
  ```

- **UserController** (CRUD for users):
  ```java
  @RestController
  @RequestMapping("/api/users")
  public class UserController {
      @Autowired private UserService userService;

      @GetMapping
      public List<UserResponse> getAllUsers() { return userService.getAll(); }

      @PostMapping
      public UserResponse createUser(@RequestBody UserCreateRequest request) {
          return userService.create(request);
      }

      // PUT, DELETE for edit/delete
  }
  ```

- Similar controllers for Company, Product, Sale, Token.

#### 5. Security Configuration
- Use JWT for stateless auth. Configure `SecurityConfig` to secure endpoints (e.g., `/api/admin/**` requires ADMIN role).
- Implement `JwtAuthenticationFilter` to validate tokens on requests.

#### 6. Services
- **AuthService**: Handle login (generate JWT), register (hash password with BCrypt), password reset (send email).
- **SaleService**: Manage cart logic (add/remove items, calculate totals).
- Use repositories for data access.

#### 7. DTOs
- Use request/response DTOs to avoid exposing entities directly (e.g., `UserCreateRequest` with fields like name, email, password).

#### 8. Running the Application
- Run with `mvn spring-boot:run`.
- Access H2 console at `http://localhost:8080/h2-console`.
- Frontend can call APIs like `http://localhost:8080/api/auth/login`.

This structure aligns with the frontend's features. For full implementation, refer to Spring Boot documentation. If you need code for specific parts, provide more details.