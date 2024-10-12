const min = document.getElementById('min');
const max = document.getElementById('max');
const time = document.getElementById('time');
const output = document.getElementById('output');
const count = document.getElementById('count');
let counter = 1;

function run(){
    let range = parseInt(max.value) - parseInt(min.value) + 1;
    count.textContent = `Count: ${counter}`;
    counter++;
    output.textContent = Math.floor(Math.random() * range) + parseInt(min.value);
    setTimeout(run, parseInt(time.value));
}

document.addEventListener('DOMContentLoaded', function(){
    run();
})
