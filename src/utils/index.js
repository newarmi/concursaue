export const setTimoutAsync = (cb, timer) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(cb());
    }, timer);
  });
