---
id: golang-api-design-pattern
previewImageUrl: 
datePosted: 11-09-2023
pinned: 'true'
description: An experiment into Golang api design patterns and dependeic injection.
tags: code
title: Golang API Design and Depencty Injectiopjn
---

I started working on an API service in Go that would handle JITA access for multi-cloud environments. The goal of this project was to try to build something that could maybe make me money rather than some esoteric idea, but after doing plenty of coding and not enough planning. I started to look at the market to see what other solutions exist. Maybe it’s my ego but there are a few solutions and some are better than others but I think they all  miss the mark. Regardless, I abandoned the project as I didn't feel I had much to add to the space nor did I think I could do it better than any exising company solo. 

What I did take away from this project is design patterns and dependency injection in Go. I'm not a software engineer nor do I claim to be one. Tbg I'm not even sure if these patterns are good but it's still interesting and I think at least partially correct.


When building this API I wanted to create something scalable, that could support multiple integrations and allowed for easy testing. After doing some research I decided on this pattern to implement.

The pattern abstracts the API into three layers. A handler, service, and repo.  Each layer is implemented using an interface and can be substituted via dependency injection to allow for easy testing or alternate implementations.

We expect the flow to go like this 

Handler -> Service -> Repo


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

In the domain and models dirtouries we define in a global scope what our interfaces look like for each layer, as well as the data structures. Here in domain/user.go we define an interface for the repository and service. In modules, we define a userStruct and RawUserStruct. It is important to think ahead in this part as going back and chaning or appending an interface will have propagteing refacotring in each layer that can be annoying. As the project progress I also struglged to keep interfaces minial wihtouth creating a ton of subservices. THere is a balence here or maybe its an indicatior I was not doing my desing very well. 

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

Starting at the bottom at the Data Layer, we will handel all the logic that stores and fetches our users from a backend database. To create a repository for Users we need to implement the interface defined in the domain. As long as we implement the interface functions the backend integration or behavior of the functions can change, this allows us to create amny repos if we want to have one for Postgres, Redis, etc. In this case we will create on that users Gorm + Postgress and another implementaioon to Mock. 

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

We also want to create a MockUserRepo to allow us to mock the database layer to make testing other layers much easier. 

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


Notice the mock still implements the same function signature from our UserRepo interfaces, making them both valid to be consumed by other layers that expect Type `domain.UserRepository`! 


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

The struct USConfig is very important to enable dependency injection, we can see it has an attribute of `domain.UserRepository` interface. This allows us to pass in any implementation of `domain.UserRepository` to our service. We could sub it out for a mock, in-memory data store, or Postgres. 

The implementation of the functions here are mostly is a proxy to the data layer but you could do more complex logic and validation here. 

Let's take a look at how we can leverage dep injection to test our service layer, in user_test.go

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

We see we can create a UserRepositoryMock we defined earlier to handle the behavior of our repository layer. This allows us to focus on testing the service layer behavior without worrying about the implementation of the behavior of the repo layer. 


## Handler

I said this was an API so let's look at how we take requests and pass them to the Service layer. In handler.go we collect all the handlers and register them to routers.

Note how we pass in the interface of domain.UserService to be consumed by the handler.

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

Finally, we can bring all the layers together in `inject.go` which gets executed on run. The use of this file is to set up all the proper injections/configs for each layer. You could do fancy things at runtime such as using variables or feature flags to inject diffrent implemnation to each layer. Maybe you wanted to migrate from Postgres to Redis you would add a new repository implementation that implements the interface `domain.UserRepository` and inject it inot `UserServiceConfig`. Here is an example of how that might look.

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


