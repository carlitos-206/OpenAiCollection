const readline = require('readline');

// create an empty array to store our todo list
const todoList = [];

// create a readline interface to read input from the user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// main function to start the app
function main() {
  console.log('Welcome to your todo list!');
  console.log('Enter a command (add, list, quit)');

  // listen for input from the user
  rl.on('line', (input) => {
    // split the input into an array of words
    const words = input.split(' ');

    // get the first word (the command)
    const command = words[0];

    // determine which command to execute based on the first word
    switch(command) {
      case 'add':
        addTodo(words.slice(1));
        break;
      case 'list':
        listTodos();
        break;
      case 'quit':
        quit();
        break;
      default:
        console.log('Invalid command');
    }
  });
}

// function to add a todo
function addTodo(todo) {
  // join the todo array back into a single string
  const todoText = todo.join(' ');

  // add the todo to the list
  todoList.push(todoText);
  console.log(`Added "${todoText}" to the list`);
}

// function to list all todos
function listTodos() {
  console.log('Here is your todo list:');
  todoList.forEach((todo, index) => {
    console.log(`${index + 1}: ${todo}`);
  });
}

// function to quit the app
function quit() {
  console.log('Goodbye!');
  rl.close();
}

// start the app
main();