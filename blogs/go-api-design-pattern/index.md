---
id: golang-api-design-pattern
previewImageUrl: 
datePosted: 11-09-2023
pinned: 'true'
description: An experiment into Golang API design patterns and dependency injection.
tags: code
title: Golang API With Dependency Injection
---

I started working on a Go API service that would handle JITA access for multi-cloud environments. The goal of this project was to potentially create a revenue-generating solution, rather than pursuing an esoteric idea. However, after extensive coding and insufficient planning, I began to examine the existing solutions in the market. I abandoned the project because I didn't feel I had much to add to the space, and I doubted that I could outperform existing companies on my own.

Despite discontinuing the project, I did gain valuable insights into design patterns and dependency injection in Go. I'm not a software engineer, nor do I claim to be one. To be honest, I'm not entirely sure if these patterns are ideal, but I still find them interesting and, to some extent, correct.

In building this API, my aim was to create a scalable solution that could support multiple integrations and facilitate easy testing. After conducting some research, I decided to implement the following pattern:

The pattern abstracts the API into three layers: a handler, a service, and a repository. Each layer is implemented using an interface and can be substituted through dependency injection to enable straightforward testing or alternative implementations. We anticipate the flow to proceed as follows:

Handler -> Service -> Repository


Here is the directory tree of my project setup I've removed everything but the references to the user's service an an example.

```bash
├── domain
│   └── user.go
├── handler
│   └── user
│       ├── user_handler.go
│       └── user_test.go
├── inject.go
├── main.go
├── models
│   └── users.go
├── repository
│   ├── mock
│   │   └── user_repo_mock.go
│   └── user_repository.go
└── service
    └── user
        ├── mock
        │   └── user_service_mock.go
        ├── user_service.go
        └── user_service_test.go
```

## Interface 

In the "domain" and "models" directories, we define the structure of our interfaces for each layer and the data structures in a global scope. In the `domain/user.go` file, we define interfaces for the repository and service. In the "modules," we specify the `UserService` and `UserRepository` interfaces. 

Interfaces provide an abstraction for the actual implementations of services or repositories. This abstraction allows us to use the same interface in various parts of the codebase without needing to be aware of the specific implementation details. This approach promotes decoupling, making it easier to change the underlying implementations without impacting the rest of the code.It's essential to plan ahead in this phase because revising an interface later can lead to a cascading refactoring process across multiple layers, which can be quite cumbersome.

```go
// domain/user.go
type UserService interface {
    Get(id int) (*models.User, error)
    List() ([]models.User, error)
    FindByOktaSub(sub string) (*models.User, error)
}

type UserRepository interface {
    FindByID(id int) (*models.User, error)
    FindByOktaSub(sub string) (*models.User, error)
    Create(u *models.User) error
    Update(u *models.User) error
    List() ([]models.User, error)
}

```


```go
// model/user.go
type User struct {
    gorm.Model
    ID       int      `json:"id" gorm:"primaryKey"`
    Sub      string   `json:"sub"`
    Username string   `json:"username"`
    Email    string   `json:"email"`
    Role     UserRole `json:"role"`
}
```

## Data Layer

Starting at the bottom of the Data Layer, we manage all the logic responsible for storing and retrieving our users from a backend database. To create a repository for Users, we need to implement the interface defined in the domain. As long as we implement the interface functions, the backend integration or behavior of these functions can vary. This flexibility allows us to create multiple repositories if we want to have separate ones for Postgres, Redis, and so on. In this case, we will create one that uses Gorm + Postgres and another implementation for mocking purposes.

```go
type userRepository struct {
    DB *gorm.DB
}

// NewUserRepository is a factory for initializing User Repositories
func NewUserRepository(db *gorm.DB) domain.UserRepository {
    return &userRepository{
        DB: db,
    }
}

func (r *userRepository) FindByID(id int) (*models.User, error) {

    var user *models.User
    result := r.DB.Where("id = ?", id).First(&user)

    if result.Error != nil {
        return nil, result.Error
    }

```

We create a MockUserRepo to allow us to mock the database layer to make testing other layers much easier. 

```go
type UserRepositoryMock struct {
    mock.Mock
}

// FindByID provides a mock function with given fields: id
func (_m *UserRepositoryMock) FindByID(id int) (*models.User, error) {
    ret := _m.Called(id)

    var r0 *models.User
    if rf, ok := ret.Get(0).(func(int) *models.User); ok {
        r0 = rf(id)
    } else {
        if ret.Get(0) != nil {
            r0 = ret.Get(0).(*models.User)
        }
    }

    var r1 error
    if rf, ok := ret.Get(1).(func(int) error); ok {
        r1 = rf(id)
    } else {
        r1 = ret.Error(1)
    }

    return r0, r1
}
```


Notice that the mock still implements the same function signature as our UserRepository interface, making it valid for consumption by other layers that expect a type of `domain.UserRepository`! Additionally, this implementation holds a key advantage by allowing seamless interchangeability between the actual database-backed repository and a mock implementation. This means that during testing or when working on various parts of the application, you can effortlessly switch between the real database repository and the mock repository, ensuring that your testing remains isolated and your codebase remains flexible and resilient. This flexibility simplifies the testing process and allows for robust, maintainable code that can adapt to changing requirements without extensive refactoring.


## Service

On to the business logic layer of our app that we call the “services”. Referring back to the interfaces we see it has a few functions we will need to satisfy to properly implement it. 

```go
// user service acts as a struct for injecting an implementation of UserRepository
// for use in service methods
type userService struct {
    UserRepository domain.UserRepository
}

// USConfig will hold repositories that will eventually be injected into this
// this service layer
type USConfig struct {
    UserRepository domain.UserRepository
}

// NewUserService is a factory function for
// initializing a UserService with its repository layer dependencies
func NewUserService(c *USConfig) domain.UserService {

    return &userService{UserRepository: c.UserRepository}
}

// Get retrieves a user based on their id
func (s *userService) Get(id int) (*models.User, error) {
    u, err := s.UserRepository.FindByID(id)

    return u, err
}
```

The USConfig struct plays a crucial role in enabling dependency injection. It contains an attribute of the `domain.UserRepository` interface, which provides flexibility to pass in various implementations of `domain.UserRepository` to our service. Whether it's a mock, in-memory data store, or Postgres, this flexibility allows us to easily switch out the underlying data source.

Now, let's explore how we can harness dependency injection to test our service layer in the user_test.go file.

```go
func TestGet(t *testing.T) {

    t.Run("Success", func(t *testing.T) {

        mockUserResp := &models.User{
            ID:    1,
            Email: "test@test.com",
        }

        mockUserRepository := new(repoMock.UserRepositoryMock)

        userService := user.NewUserService(&user.USConfig{
            UserRepository: mockUserRepository,
        })

        mockUserRepository.On("FindByID", 1).Return(mockUserResp, nil)

        u, err := userService.Get(1)

        assert.NoError(t, err)
        assert.NotNil(t, u)
        assert.Equal(t, mockUserResp, u)
        mockUserRepository.AssertExpectations(t)

    })
```

As we can observe, we have the capability to create a `UserRepositoryMock`, which we defined earlier to manage the behavior of our repository layer. This approach enables us to concentrate on testing the behavior of the service layer without being concerned about the specifics of the repository layer's implementation.


## Handler

As previously mentioned, this is an API, so let's see into how we receive requests and forward them to the Service layer. In `handler.go`, we aggregate all the handlers and associate them with routers.

Notice how we provide the `domain.UserService` interface for use by the handler.

```go
// handler.go

type Config struct {
    R                     *gin.Engine
    UserService           domain.UserService
}

baseRouter := c.R.Group("/")

func NewHandler(c *Config) *gin.Engine {
    userHandler := user.NewUserHandler(user.UserHandlerConfig{
        UserService: c.UserService,
        AuthService: authService,
    })

userHandler.Routes(baseRouter)
}


In `user_handler.go` we define the routes and services we need to create a handler 

type UserHandler struct {
    userService domain.UserService
}

type UserHandlerConfig struct {
    UserService domain.UserService
}

// NewUserHandler returns a new UserHandler
func NewUserHandler(c UserHandlerConfig) *UserHandler {
    return &UserHandler{
        userService: c.UserService,
    }
}
```

Very similar to a Service we create a config that allows us to inject the sublayer UserService. For brevity, I am going to omit the test case examples but it would involve using a UserSerivce mock passing into the Handler config. 



## Inject

Finally, all the layers are brought together in `inject.go`, which gets executed when the application runs. This file's purpose is to configure all the necessary injections and configurations for each layer. It offers the flexibility to perform dynamic configurations at runtime, such as using variables or feature flags to inject different implementations into each layer. For instance, if there's a need to migrate from a Postgres database to Redis, you can create a new repository implementation that adheres to the `domain.UserRepository` interface and inject it into the `UserServiceConfig`. Here's an example of how that might look.

```go
func inject(d *dataSources, useRedis bool) (*gin.Engine, error) {
    log.Println("Injecting data sources")

    var userRepository repository.UserRepository

    if useRedis {
        userRepository = repository.NewUserRedisRepository(d.RedisClient)
    } else {
        userRepository = repository.NewUserPostGresRepository(d.GormDb)
    }

    /*
     * service layer
     */
    userService := user.NewUserService(&user.USConfig{
        UserRepository: userRepository,
    })

    // initialize gin.Engine
    router := gin.Default()

    handler.NewHandler(&handler.Config{
        R:           router,
        UserService: userService,
    })

    return router, nil
}


```


