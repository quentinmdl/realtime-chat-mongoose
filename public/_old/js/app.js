let socket = io();

let form = document.querySelector('#form-chat');
let input = document.querySelector('#input-msg');

console.log(form);
console.log(input);

form.addEventListener('submit', function(e) {
e.preventDefault();
if (input.value) {
    socket.emit('msg', input.value);
    input.value = '';
}
});

socket.on('msg', function(msg) {
let liElement = document.createElement('li');
liElement.textContent = msg;
messages.appendChild(liElement);
});
