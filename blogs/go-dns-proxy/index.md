---
id: go-dns-proxy
previewImageUrl: https://cdn.ruse.tech/imgs/preview/dnsproxy.png
datePosted: 05-05-2021
description: Messing around with DNS using go
tags: dev
title: Go DNS Proxy
---

# DNS Proxy

I've been writing a bunch of small things in go just to get better at using it.

I was reading a blog regarding DNS and I decided to create my own implementation using the go standard library.

The packages that we will need are the net package and golang.org/x/net/dns/dnsmessage. At the core we are going to accept UDP DNS packets, save the client address then forward the request to a DNS server. We can log the request to the console and even modify it before sending it back to allow us to perform a MITM attack.

![proxy](https://cdn.ruse.tech/imgs/go-dns-proxy/working.png)

Code will be accessible on gist and it commented on each section.

https://gist.github.com/sebastian-mora/7fbcc16f7e903abede951049e1691b54

```go
package main

import (
	"fmt"
	"net"
	"os"

	"golang.org/x/net/dns/dnsmessage"
)

func main() {
	conn, _ := net.ListenUDP("udp", &net.UDPAddr{Port: 5554})
	defer conn.Close()

	var clientIp *net.UDPAddr

	for {

		// Create a buffer to store UDP packet
		buf := make([]byte, 512)
		_, addr, err := conn.ReadFromUDP(buf)

		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to read UDP message")
		}

		var m dnsmessage.Message

		// use dnsmessage to unpack the packet
		err = m.Unpack(buf)

		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to unpack DNS packet")
		}

		// Check if packet is coming back from the DNS server
		if m.Header.Response {

			// HERE YOU COULD MODIFY RES BEFORE SENDING TO CLIENT\
			// replaceIp(m)

			// Log the request to the client
			printDNSRequest(clientIp.IP.String(), m)

			// Pack and send to client
			packed, err := m.Pack()

			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to pack DNS packet")
			}

			_, err = conn.WriteToUDP(packed, clientIp)

			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to send DNS packet")
			}

		} else { // Request is coming from client

			// Save the client IP to know where to respond
			clientIp = addr

			// Forward DNS packet to 1.1.1.1
			packed, err := m.Pack()
			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to pack DNS packet")
			}

			// create net.UDPAddr for request
			resolver := net.UDPAddr{IP: net.IP{1, 1, 1, 1}, Port: 53}
			// send packet to DNS server at 1.1.1.1
			_, err = conn.WriteToUDP(packed, &resolver)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to send DNS packet")
			}
		}
	}

}

func printDNSRequest(clientIp string, m dnsmessage.Message) {
	fmt.Println(";; ANSWER SECTION:")
	for _, ans := range m.Answers {
		// If anyone knows how to get the IP from ans.Body hmu
		fmt.Printf("%s: %s ---> %s\n", clientIp, ans.Header.Name.String(), ans.Body.GoString())
	}
}


```
