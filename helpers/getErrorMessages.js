module.exports = function(err) {
  var messages = {};
  if (err.errors) {
    for (key in err.errors) {
      messages[key] = err.errors[key].message;
    }
  }
  return messages;
}
