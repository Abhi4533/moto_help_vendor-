function test() {
  var b = 20; // function-scoped
  console.log(b);
}
console.log(b); // ❌ Error
