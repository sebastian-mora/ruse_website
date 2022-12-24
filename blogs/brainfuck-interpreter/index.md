---
id: brainfuck-interpreter
previewImageUrl: https://cdn.ruse.tech/imgs/brainfuck-interpreter/post-icon.jpg
datePosted: 12-23-2022
pinned: "true"
description: A Brainfuck interpreter
tags: code
title: GoLang Brainfuck Interpreter
---

Let me open by saying I have no idea what I am doing other than learning and experimenting.

With that disclaimer lets start with what is Brainfuck? Let this blurb I stole from [wiki](https://en.wikipedia.org/wiki/Brainfuck) do the work for me...

```text
Brainfuck is an esoteric programming language created in 1993 by Urban Müller.

Notable for its extreme minimalism, the language consists of only eight simple commands, a data pointer and an instruction pointer. While it is fully Turing complete, it is not intended for practical use, but to challenge and amuse programmers. Brainfuck requires one to break commands into microscopic steps.
```

I want to create a program in Go that can take a Brainfuck program as input and execute it.

From the description we can pull out most of the requirements.

- 8 Instructions
- Data pointer
- Instruction Pointer
- Memory

To create an interpreter I implemented some concepts I learned about in College. First, a lexer which will validate the syntax and convert the characters to tokenized list. Next, a parser that will interpreter the tokens into an AST (abstract syntax tree). Honestly not sure if AST is the correct term for this, the "tree" is a linear set of instructions because the language does not have conditionals or assignments. Lets just consider it an list of "enhanced" operations to be interpreted by the parser. Finally the "AST" will be used by the interpreter to execute the instruction set.

## Lexer

The lexer was the easiest part to implement. A lexers job is take the raw string input and turn it into a flat list of Token types. For Brainfuck I implemented a `Token` Type based on the language specifications. A token has an Enum and literal that represents the raw input.

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

`NEW_LINE` allows for new lines to be included in the input and `EOF` represents the end of the input.

The lexer then uses a large case statement to map the character inputs to the correct types. Using the default as the error catch surfaces the unknown characters to the user.

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

The parser creates a flat list of `Operations` that will be given to the interpreter to run. The parser looks similar to the Lexer but with some extra features to handel loops.

```go
type Operation struct {
	Token lexer.Token
	Count int // used for instruction optimization
	Jump  int // set only if loop
}
```

Operations have a `lexer.Token` and `Jump` attributes. The `Jump` attribute is only set when loop tokens are parsed. The jump attribute tells the interpreter where to move the instructions pointer (IP). I left out the `Count` parameter because I have not implemented it but, it represents the number of identical operations that can be compressed by the parser. For example ">++++" reads as "Shift Data Pointer Right and Increment 4 times". Rather than generating 4 individual increment operations we could optimized this by setting count to 4 on the first operation and discard the duplicates.

In the code notice the only operations that need extra consideration are the loops and EOF. For the loops I used a stack to make sure all the loops parenthesis match and store their jump points in the AST node. When the parser reaches the EOF then the stack should be empty, indicating that all parenthesis have matching sets. If you had to do any leetcode code questions on stacks this might be familiar lmao.

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

LETS GO now I have all the instructions lexed and parsed, I can implement the execution flow. From the description, I can simulate the environment by adding the pointers and memory. The memory is set ot 30000 bytes as described in the wiki.

```go
type Brainfuck struct {
	Instructions []parser.Operation
	Memory       [30000]int
	dp           int    // Data Pointer
	ip           int    // Instruction Pointer
}
```

Similar to all the examples above I used a switch statements to execute the behavior for each operation

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

Now I can test the interpreter by running the following BrainFuck Program; take a guess of what a first program might be.

```go
func main() {
    program := "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
	bf, err := interpreter.NewBrainfuck(program)
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

### References

- https://en.wikipedia.org/wiki/Brainfuck
- https://esolangs.org/wiki/Brainfuck
- https://thorstenball.com/blog/2017/01/04/a-virtual-brainfuck-machine-in-go/
