# mscs-face-api
Microsoft Cognitive Services Face API

### Getting Started

In order to use this you need to have Node.js installed on your machine and Microsoft Cognitive Services Face API Key.

### Installing

In order to install this module you need to do the following:
```js
npm install mscs-face-api --save
```

### Usage

First you need to require the module:
```js
const MSCSFACEAPI = require("./mscs-face-api");
```
After you have to create an instance of the module. You will have to specify the key and the server that you want to use.
The options for the server are the following:
  - WUS (westus)
  - EUS2 (eastus2)
  - WCUS (westcentralus)
  - WE (westeurope)
  - SA (southeastasia).
  
```js
var mscsfa = new MSCSFACEAPI(key,server);
```

### Methods

In order to have a better understanding of the methods I advise you to see the documentation.

- createPersonGroup(personGroupId, name, userData) → {Promise}
- deletePersonGroup(personGroupId) → {Promise}
- getPersonGroup(personGroupId) → {Promise}
- getPersonGroupTrainingStatus(personGroupId) → {Promise}
- listPersonGroups(start, top) → {Promise}
- trainPersonGroup(personGroupId) → {Promise}
- updatePersonGroup(personGroupId, name, userData) → {Promise}
- addPersonFace(personGroupId, personId, userData, image) → {Promise}
- createPerson(personGroupId, name, userData) → {Promise}
- listPersonsInPersonGroup(personGroupId, start, top) → {Promise}
- detectFace(image) → {Promise}
- identifyFace(faceIds, personGroupId, confidenceThreshold) → {Promise}


## Built With

* [Node.js](https://nodejs.org/) - Open source server framework.
* [axios](https://www.npmjs.com/package/axios) - Promise based HTTP client for the browser and node.js.

## Versioning

I used [GitHub](https://github.com/) for versioning. For the versions available, see the [tags on this repository](https://github.com/itsdanielmatos/mscs-face-api/tags). 

## Authors

* **Daniel Matos**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
