---
id: brainfuck-interpreter
previewImageUrl: https://cdn.ruse.tech/assets/ruse-200x200.png
datePosted: 12-23-2022
pinned: "true"
description:
tags: code
title: GoLang Brainfuck Interpreter
---

Let me open by saying I have near no idea what I am doing other than learning and experimenting.

Lets start with what is Brainfuck. Brainfuck is, here is a blurb I stole from the wiki

```
Brainfuck is an esoteric programming language created in 1993 by Urban Müller.

Notable for its extreme minimalism, the language consists of only eight simple commands, a data pointer and an instruction pointer. While it is fully Turing complete, it is not intended for practical use, but to challenge and amuse programmers. Brainfuck requires one to break commands into microscopic steps.
```

To me brainfuck feel is a simple way to interface with a turning machine like system. From the descruotion there is all the items that we will need to implement in order to create a program in Go that can execute these type of instruction.

- 8 Instruction
- Data pointer
- Instruction Pointer
- Memory

To create an interpreter I followed some items I learned about when reading about compilers. First a lexer which will validate the syntax and convert the characters to tokenized values. Next, I will create a parser that will interpreter the tokens into an AST (abstract syntax tree). Honestly not sure if AST is the correct term for this, the "tree" is a linear set of instructions because the language does not have conditionals or assignments. Finally the "AST" will be used by the interpreter to execute the instruction set.

## Lexer

The lexer was the easiest part to implement. A lexers job is take the raw string input and turn it into a flat list of operator types. For brainfuck I implemented a `Token` Type based on the language specifications. A token has an Enum and literal that represents the input.

```go
package lexer

type TokenType int

const (
	INCREMENT TokenType = iota
	DECREMENT
	SHIFT_LEFT
	SHIFT_RIGHT
	OUTPUT
	INPUT
	OPEN_LOOP
	CLOSE_LOOP
	NEW_LINE
	EOF
)

type Token struct {
	TokenType TokenType
	Literal   string
}
```

NEW_LINE allows for new lines to be included in the input and EOF represents the end of the input.

The lexer then uses a large case statement to map the character inputs to the correct types. Using the default as the error catch allows us to surface invalid syntax to the users.

```go
		switch char {
		case '+':
			tokens[i] = Token{TokenType: INCREMENT, Literal: string(char)}
		case '-':
			tokens[i] = Token{TokenType: DECREMENT, Literal: string(char)}
		case '>':
			tokens[i] = Token{TokenType: SHIFT_RIGHT, Literal: string(char)}
        .
        .
        .
		default:
			err := fmt.Sprintf("Error at %d: Invalid character \"%s\" ", i, string(char))
			return nil, errors.New(err)
		}
```

## Parse

Brainfuck is so simple that the parser looks pretty similar to the Lexer but with some extra twists. The parser creates a flat list of `Operations` that will be given to the interpreter.

```go
type Operation struct {
	Token lexer.Token
	Count int // used for instruction optimation
	Jump  int // set only if loop
}
```

Operations have a `lexer.Token` and Jump. Jump is only set when loop tokens are used. The jump variable is uses to indicate to the interpreter where the loop operations show move the instructions pointer (IP). I left out the `Count` parameter because I have not implemented it but I represents the number of identical operations that can be compressed by the parser. For example ">++++" reads as "Shift Data Pointer Right and Increment 4 times". Rather than generating 4 individual increment operations we could optimized this by setting count to 4 on the first operation and discard the duplicates.

Here are the instruction sets for the parser, notice the only operations that need extra consideration are the loops and EOF. For the loops I used a stack to make sure all the loops have matching parenthesis and store their jump points in the AST. When when reach the EOF then the stack should be empty, indicating there are no extra parenthesis.

```go
		switch token.TokenType {
		case lexer.DECREMENT,
			lexer.INCREMENT,
			lexer.SHIFT_LEFT,
			lexer.SHIFT_RIGHT,
			lexer.INPUT,
			lexer.OUTPUT:
			operations[i] = createOperation(i, tokens)

		case lexer.OPEN_LOOP:
			stack.Push(i)
			operations[i] = createLoop(-1, lexer.OPEN_LOOP) // jump position is unknown for now

		case lexer.CLOSE_LOOP:
			if stack.IsEmpty() {
				return nil, errors.New("closing bracket does not match any opening bracket")
			}
			open_loop, _ := stack.Pop()
			operations[i] = createLoop(open_loop, lexer.CLOSE_LOOP) // send end loop jump
			operations[open_loop].Jump = i                          // set the open loop jmp to end

		case lexer.EOF:
			if !stack.IsEmpty() {
				return nil, errors.New("unmatched opening bracket")
			}
			continue
```

## Interpreter

LETS GO now we have all the instructions lexed and parsed, now it is just to similar the execution. From the description we will similar the environment by adding the pointer and memory. The memory is set ot 30000 bytes as described in the wiki.

```go
type Brainfuck struct {
	Instructions []parser.Operation
	Memory       [30000]int
	dp           int
	ip           int
}
```

Similar to all the examples above we use a switch statements to execute the behavior for each operations

```go
		switch op.Token.TokenType {

		case lexer.INCREMENT:
			bf.Memory[bf.dp]++

		case lexer.DECREMENT:
			bf.Memory[bf.dp]--

		case lexer.SHIFT_LEFT:
			bf.dp--

		case lexer.SHIFT_RIGHT:
			bf.dp++

		case lexer.OUTPUT:
			fmt.Print(bf.Memory[bf.dp])

		case lexer.INPUT:
			var input int
			_, _ = fmt.Scan(&input)
			bf.Memory[bf.dp] = input

		case lexer.OPEN_LOOP:
			if bf.Memory[bf.dp] <= 0 {
				bf.ip = op.Jump + 1
			}
		case lexer.CLOSE_LOOP:
			bf.ip = op.Jump
		}
```

## Testing

We can test the interpreter by running the following BrainFuck Program. Please take a guess of what a first program might be.

```brainfuck
++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.
```

```go
func main() {
	bf, err := interpreter.NewBrainfuck("++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.")
	if err != nil {
		fmt.Println(err)
		os.Exit(2)
	}
	bf.Interpret()
}

// Returns: 7210110810811144328711111410810033 (wtf)
```

Convert the output from decimal to ascii and you get `Hello, World!`.

There is more testing to be done but, I am pretty happy with the results!
