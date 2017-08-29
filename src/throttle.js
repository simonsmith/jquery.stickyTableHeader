module.exports = throttle;

// https://git.io/v5ZxQ
function throttle(callback, wait, context = this) {
  let timeout = null;
  let callbackArgs = null;

  const later = () => {
    callback.apply(context, callbackArgs);
    timeout = null;
  };

  return (...args) => {
    if (!timeout) {
      callbackArgs = args;
      timeout = setTimeout(later, wait);
    }
  };
}
