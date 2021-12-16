# Rest Service Integration

Allows to Integrate your server hitpoints to another server very easily.


## Installation
```
npm install rest-service-integration
```

## Usage

### Server1

This is the main server. It will use `Server2`'s API to send the data back to client

```js
...
const RestIntegration = require("../");

const server2 = new RestIntegration.Service({
    host: SERVER2_HOST
})

app.get("/", async (req, res) => {
    res.send((await server2.hello()).data)
})


app.listen(SERVER1_PORT, async () => {
    await server2.load()
    console.log("Server1 Started...")
})
```

- Here when express app is ready it will load the API model from `Server2` using `POST /rest-service-integration-mode` hitpoint.

- When it loads the data, `hello` Function will be avilable to `server2` Instance.


### Server2

This server is the one which will be loaded by `Server1`.

```js
...

app.get("/hello", (req, res) => {
    res.send("Hello!");
})


app.post("/rest-service-integration-model", (req, res) => {
    const model = {
        "hello": {
            name: "hello",
            path: "/hello",
            method: ["GET"]
        }
    }

    res.json(model)
})

app.listen(SERVER2_PORT, () => {
    console.log("Server2 Started...")
})

```

- Here `/rest-service-integration-model` will be requested when you use `await server2.load()` in `Server1`.

- Service Instance will try to make a tree structure of the API model and attach those functions and Objects to the instance it self.


### After using `await server2.load()`

- When you call it; instance will reach to `POST /rest-service-integration-mode` hitpoint and will try to load the API model.

- When it gets the model it will try to struct that model and attach the functino to instance.

- If model element has a key named `"hello"`, it will name that function to `"hello"`.

- If that model element has more then one `method` it will attach that function like this

```js
server2.hello.get();
server2.hello.post();
```


<br>

`THIS PACKAGE IS NOT FULLY TESTED YET. IT MIGHT HAVE SOME BUGS, IF YOU FIND ANY BUGS PLEASE REPORT IT IN ISSUES SECTION OF THIS REPOSITORY. I DONT RECOMMAND USING IT FOR BIG PROJECTS AS IT IS NOT FULLY TESTED AS A WELL MADE PACKAGE. SO USE IT AT YOUR OWN RISK.`

<br>

------

# Coded by [Henil Malaviya](https://github.com/henil0604) with :heart: