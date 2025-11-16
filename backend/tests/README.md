# JobTrackr Test Suite

Comprehensive test suite for the JobTrackr application covering authentication, applications, profiles, documents, notifications, and admin functionality.

## Test Coverage

### Feature Tests (Integration Tests)

1. **AuthenticationTest.php** - User authentication and registration
   - User registration with valid/invalid data
   - User login with valid/invalid credentials
   - Logout functionality
   - Password reset requests
   - Protected route access

2. **ApplicationTest.php** - Job application management
   - Viewing applications
   - Creating applications
   - Updating applications
   - Deleting applications
   - Authorization checks
   - Status filtering
   - Validation tests

3. **ProfileTest.php** - User profile management
   - Viewing profile
   - Updating profile information
   - Password changes
   - Avatar uploads
   - Account deletion

4. **DocumentTest.php** - Document uploads and management
   - Uploading documents to applications
   - Listing documents
   - Deleting documents
   - File validation
   - Authorization checks

5. **AdminTest.php** - Admin dashboard and management
   - Dashboard statistics
   - User management
   - Application viewing
   - Role-based access control

6. **NotificationTest.php** - Notification system
   - Viewing notifications
   - Marking as read
   - Deleting notifications
   - Unread counts
   - Authorization checks

7. **StatisticsTest.php** - User statistics
   - Application statistics
   - Status breakdowns
   - User-specific data isolation

### Unit Tests (Model Tests)

1. **UserModelTest.php** - User model relationships and behavior
   - User-application relationships
   - User-notification relationships
   - Role checking
   - Password hashing
   - Cascade deletion

2. **ApplicationModelTest.php** - Application model
   - Application-user relationships
   - Application-document relationships
   - Date casting
   - Fillable attributes
   - Cascade deletion

## Running Tests

### Run All Tests
```bash
php artisan test
```

### Run Specific Test Suite
```bash
# Run all feature tests
php artisan test --testsuite=Feature

# Run all unit tests
php artisan test --testsuite=Unit
```

### Run Specific Test File
```bash
php artisan test tests/Feature/AuthenticationTest.php
```

### Run Specific Test Method
```bash
php artisan test --filter test_user_can_register_with_valid_data
```

### Run Tests with Coverage
```bash
php artisan test --coverage
```

### Run Tests in Parallel (faster)
```bash
php artisan test --parallel
```

## Test Database

Tests use SQLite in-memory database (`:memory:`) as configured in `phpunit.xml`. This ensures:
- Fast test execution
- Clean database for each test
- No impact on development database

## Best Practices

1. **Use Factories** - All tests use model factories for creating test data
2. **RefreshDatabase Trait** - Ensures clean state for each test
3. **Clear Test Names** - Test names clearly describe what is being tested
4. **Arrange-Act-Assert** - Tests follow AAA pattern
5. **Authorization Tests** - Verify users can only access their own data
6. **Validation Tests** - Ensure proper input validation

## Continuous Integration

These tests are designed to run in CI/CD pipelines. They:
- Run independently without external dependencies
- Use in-memory database
- Complete quickly
- Provide clear failure messages

## Adding New Tests

When adding new features:

1. Create feature tests for API endpoints
2. Create unit tests for complex business logic
3. Follow existing naming conventions
4. Use factories for test data
5. Test both success and failure cases
6. Verify authorization

## Test Statistics

- **Total Tests**: 60+
- **Feature Tests**: 50+
- **Unit Tests**: 10+
- **Coverage Areas**: Authentication, Authorization, CRUD operations, Validation, Relationships

## Running Tests in Docker

```bash
docker exec -it jobtrackr-backend php artisan test
```

## Troubleshooting

### Tests Failing?

1. Ensure database migrations are up to date
2. Check that factories are properly defined
3. Verify environment variables in phpunit.xml
4. Clear config cache: `php artisan config:clear`

### Slow Tests?

1. Use `--parallel` flag
2. Check for unnecessary database queries
3. Mock external services
4. Use in-memory cache driver
