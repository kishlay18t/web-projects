const fs = require('fs');

const content = fs.readFileSync('story.txt', 'utf8')
console.log(content);

const lines = content.split('\n');
let count = 0;
for (let i of lines){
    const words = i.split(' ');
    count += words.length;
}
console.log(`Number of words: ${count}`);

// let count = 0, inline = 0;
// for (let i of content)
// {
//     if (i == ' ' || i == '\n'){
//         inline = 0;
//     }
//     else{
//         inline++;
//     }

//     if (inline == 1){
//         count++;
//     }
// }
// console.log(count);