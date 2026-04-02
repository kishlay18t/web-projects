// Exporting add function 
function add(a,b)
{
    return a+b;
};

function product(a,b) {
    return a*b;
}

module.exports = { add, product };

// // Modern export - ES Module
// export function substract(a,b)
// {
//     return a-b;
// }