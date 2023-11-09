---
id: gosimplehttp
previewImageUrl: https://cdn.ruse.tech/assets/ruse-200x200.png
datePosted: 03-02-2021
description: Reworked Python's SimpleHttpServer in goland.
tags: dev
      golang
title: GoSimpleHttp
---
# An exercise in Golang

I have been wanting to learn Golang for a while now so about two weeks ago I finally bought a book. After looking around on Amazon I decided on the book [Go Programming Language, The (Addison-Wesley Professional Computing Series)](https://www.amazon.com/Programming-Language-Addison-Wesley-Professional-Computing/dp/0134190440/ref=sr_1_3?dchild=1&keywords=golang&qid=1614821054&s=books&sr=1-3). I am most of the way through the book and it has been great. The book has well-written practical code examples but one of the best features of the book is its depth/insight into the design choices and implementation of the language. I would not recommend this book for a beginner looking to learn how to code.

Enough about books. To get some Go practice while traveling I decided to rewrite the famous Python SimpleHTTPServer. If you are unfamiliar with Python's SimpleHTTPServer, it is a built-in HTTP server that allows you to quickly create a web server to log requests or serve directories. It is a super useful tool and from a pentest perspective is an easy way to transfer files on a network. 

Porting this to Go was super simple. Golang has a ton of great standard packages, the one used in this case was [net/http](https://golang.org/pkg/net/http/). If you take a look at the documentation you will find there is a function called [func FileServer(root FileSystem) Handler](https://golang.org/pkg/net/http/#FileServer). This function takes a FileSystem object and returns a Handler. In pseudo-code, it would look something like this 

```Go
handler := http.FileServer(http.Dir(path))
http.ListenAndServe(address, handler)
```

Here we create a handler using http.FileServer(http.Dir(path)) and in its parameters we create a FileSystem object. Next http.ListenAndServe() is called. ListenAndServe takes a `Server` struct configured with an address and the handler.

To take it a step further I wanted to add TLS support. This should be useful to transfer sensitive files. To add TLS change `ListenAndServe` to `ListenAndServeTLS`. `ListenAndServeTLS` requires the following params `address, tlsCrt, tlsKey, handler`

To make the program more useful we import the `flags` library which allows the user to configure some of the program parameters.

The last feature I wanted to add was logging. This feature is useful if I want to debug a connection or use the HTTP server as some type of callback for XSS or SSRF. This part was a bit confusing and I had to take a look a StackOverflow. The core of the function `logRequest(handler http.Handler) http.Handler` wraps the original http.Handler and acts as a middleware.

As you can see the total program is about 50 lines. Most of them are for logging and setting up the cli flags. 




![server.png](https://cdn.ruse.tech/imgs/GoSimpleHttp/server.png)



Side Note: I also started a quick IRC client in Go which I will prob post here that showcases some of the more advanced Go features like Structs, Function Receivers, Anonymous Functions, Goroutiunes, and Channels.


## Examples 

```bash
Usage of gosimplehttp:
  -address string
        Server address (default "0.0.0.0")
  -path string
        Set dir (default "/home/seb/go/src/github.com/seb1055/gosimplehttp")
  -port int
        Server port (default 8000)
  -tlsCrt string
        Set TLS Cert
  -tlsKey string
        Set TLS Key
```
```
./gosimplehttp This will serve you CWD to 0.0.0.0 on port 8000

./gosimplehttp -address 127.0.01 -path /home/ruse/keys -port 4444

./gosimplehttp -tlsCrt myCert.crt -tlsKey myKey.key -port 8443
```
You can generate your own TLS certificate using the following commands 

```bash 
openssl req -new -x509 -sha256 -key server.key -out server.crt -days 3650
```


## Code 

https://gist.github.com/seb1055/5552a2697ca2e4d45c9aae6ee4ddbab8


```go
package main

import (
    "flag"
    "io/ioutil"
    "log"
    "net/http"
    "os"
    "strconv"
)

var (
    address string
    port    int
    path    string
    tlsCrt  string
    tlsKey  string
)

// Setup cli flags
func init() {
    cwd, _ := os.Getwd()
    flag.StringVar(&address, "address", "0.0.0.0", "Server address")
    flag.IntVar(&port, "port", 8000, "Server port")
    flag.StringVar(&path, "path", cwd, "Set dir")
    flag.StringVar(&tlsCrt, "tlsCrt", "", "Set TLS Cert")
    flag.StringVar(&tlsKey, "tlsKey", "", "Set TLS Key")

}

// Log middleware
func logRequest(handler http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        body, _ := ioutil.ReadAll(r.Body)
        log.Printf("%s %s %s %s\n", r.RemoteAddr, r.Method, r.URL, string(body))
        handler.ServeHTTP(w, r)
    })
}

func main() {

    flag.Parse()

    address = address + ":" + strconv.Itoa(port)

    // Check if dir exists
    if _, err := os.Stat(path); os.IsNotExist(err) {
        log.Printf("Path \"%s\" does not exist. \n", path)
        return
    }

    // Create file server at given path
    fs := http.FileServer(http.Dir(path))

    //Check if TLS enabled and start server
    if len(tlsCrt) > 0 && len(tlsKey) > 0 {
        log.Printf("Listening https://%s\n", address)
        http.ListenAndServeTLS(address, tlsCrt, tlsKey, logRequest(fs))
    } else {
        log.Printf("Listening http://%s\n", address)
        http.ListenAndServe(address, logRequest(fs))
    }
}
```

-Ruse