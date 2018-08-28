# Assignment 1

> See [the assignment details](https://github.com/visualizedata/data-structures/blob/master/assignments/weekly_assignment_01.md)

## Problem to solve

Retrieve the HTML content of 10 (given) pages and save the content to text files.

## The way I solved it

I saved all the page IDs into a constant. This allows me to loop over that array and fetch all pages dynamically. Each page itself gets fetched using [`axios`](https://github.com/axios/axios/blob/master/README.md).

In this assigment, I decided to dive into async/await in order to prevent "callback/promise hell". Where I normally would've had to do something like

```js
function getPage(url) {
  axios(url)
    .then(result => {
      fs.writeFile("filename.txt", result, function (err, res) {
        // etc
      })
    })
    .catch(console.error);
}
```

now I'm able to "flatten" it:

```js
async function getPage(url) {
  const html = await axios(url).data;
  await fs.writeFile("filename.txt", html);
}
```

However, this eliminates the `.catch()` part of the equation, eliminating my ability to handle errors in the fetching or saving of the HTML.

Luckily, an `async` function returns a Promise itself, so I'm able to `.catch` the whole function call:

```js
getPage(url).catch(console.error);
```

I'm writing any errors to a special `logs` directory. Seeing that this full error still loosely describes what caused the error, I'm not too worried about handling the individual errors (`fs` vs `axios`).
