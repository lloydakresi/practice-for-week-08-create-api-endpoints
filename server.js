const http = require('http');

const dogs = [
  {
    dogId: 1,
    name: "Fluffy",
    age: 2
  }
];

let nextDogId = 2;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // assemble the request body
  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  req.on("end", () => { // request is finished assembly the entire request body
    // Parsing the body of the request depending on the Content-Type header
    if (reqBody) {
      switch (req.headers['content-type']) {
        case "application/json":
          req.body = JSON.parse(reqBody);
          break;
        case "application/x-www-form-urlencoded":
          req.body = reqBody
            .split("&")
            .map((keyValuePair) => keyValuePair.split("="))
            .map(([key, value]) => [key, value.replace(/\+/g, " ")])
            .map(([key, value]) => [key, decodeURIComponent(value)])
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});
          break;
        default:
          break;
      }
      console.log(req.body);
    }

    /* ======================== ROUTE HANDLERS ======================== */

    // GET /dogs
    if (req.method === 'GET' && req.url === '/dogs') {
      // Your code here
      res.statusCode = 200;
      res.headers("Content-Type", "application/code");
      let parsed = res.end(JSON.stringify(dogs));
      return parsed;
    }

    // GET /dogs/:dogId
    if (req.method === 'GET' && req.url.startsWith('/dogs/')) {
      const urlParts = req.url.split('/'); // ['', 'dogs', '1']
      if (urlParts.length === 3) {
        const dogId = urlParts[2];
        // Your code here
        let selectedDog = dogs.find(dogId =>  dogs.dogId === dogId);
        res.statusCode = 200;
        res.headers("Content-Type", "application/json");
        return res.end(JSON.stringify(selectedDog));
      }
    }

    // POST /dogs
    if (req.method === 'POST' && req.url === '/dogs') {
      const { name, age } = req.body;
      // Your code here
      let newID = newDogId();
      let newDog = {
        dogId: newID,
        name: name,
        age: age
      }
      dogs.push(newDog)

      res.statusCode = 200;
      res.headers("Content-Type", "application/json");
      return res.end(JSON.stringify(newDog));

    }

    // PUT or PATCH /dogs/:dogId
    if ((req.method === 'PUT' || req.method === 'PATCH')  && req.url.startsWith('/dogs/')) {
      const urlParts = req.url.split('/');
      if (urlParts.length === 3) {
        const dogId = urlParts[2];
        // Your code here
        let chosenDog = dogs.find(dog=> dog.dogId === dogId);
        let {name, age} = chosenDog;
        chosenDog.name = name;
        chosenDog.age = age;

        res.statusCode = 200;
        res.headers("Content-Type", "application/json");
        return res.end(JSON.stringify(chosenDog));
      }
    }

    // DELETE /dogs/:dogId
    if (req.method === 'DELETE' && req.url.startsWith('/dogs/')) {
      const urlParts = req.url.split('/');
      if (urlParts.length === 3) {
        const dogId = urlParts[2];
        // Your code here
        let dogIdx = dogs.findIndex(dog => dog.dogId === dogId)
        dogs.splice(dogIdx, 1);
        res.statusCode =200;
        res.headers("Content-Type", "application/json");
        return res.end("Successfully Deleted");
      }
    }

    // No matching endpoint
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    return res.end('Endpoint not found');
  });

});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
