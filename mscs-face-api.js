"use strict";

/**
 * @module mscs-face-api
 * @author itsdanielmatos
 * @description This module helps you to comunicate with the Microsoft Cognitive Services Face API.
 * Be aware that not all functionalities from the API are implemented since they were not necessary to the project that was being developed.
 * @requires axios
 */

var axios = require("axios");

/**
 * Creates an instance os MSCSFaceApi
 * @memberof module:mscs-face-api
 * @constructor module:mscs-face-api.MSCSFaceApi
 * @param {String} key - Subscription key which provides access to this API. Found in your Cognitive Services accounts.
 * @param {String} server - Server short name to use this API. Options: WUS (westus), EUS2 (eastus2), WCUS (westcentralus), WE (westeurope) and SA (southeastasia).
 */
function MSCSFaceApi(key, server) {
    const API_KEY = key;
    const API_VERSION = "/face/v1.0";
    const HEADERS = {
        "Ocp-Apim-Subscription-Key": API_KEY,
        "Content-Type": "application/json"
    };

    if (getServer(server) === undefined) {
        throw new Error("The server specified doesn't exists")
    }

    const MSSERVER = `https://${getServer(server)}.api.cognitive.microsoft.com`;
    const API = `${MSSERVER}${API_VERSION}`;

    const PERSON_GROUP = `${API}/persongroups`;
    const DETECT = `${API}/detect`;
    const IDENTIFY = `${API}/identify`;

    /**
     * Create a new person group with specified personGroupId, name and user-provided userData. 
     * @method module:mscs-face-api.MSCSFaceApi#createPersonGroup
     * @param {String} personGroupId - User-provided personGroupId as a String. The valid characters include numbers, English letters in lower case, '-' and '_'. The maximum length of the personGroupId is 64.
     * @param {String} name - Person group display name. The maximum length is 128.
     * @param {String} userData - User-provided data attached to the person group. The size limit is 16KB. (optional)
     * @returns {Promise} A successful call returns an empty response body. A unsuccessful call returns the error.
     */
    function createPersonGroup(personGroupId, name, userData) {
        return new Promise((resolve, reject) => {
            axios({
                method: "put",
                url: `${PERSON_GROUP}/${personGroupId}`,
                headers: HEADERS,
                data: {
                    "name": name,
                    "userData": userData
                }
            }).then(function (res) {
                resolve(res.data);
            }).catch(function (err) {
                reject(err.response.data.error);
            })
        });
    }

    /**
     * Delete an existing person group.
     * Persisted face images of all people in the person group will also be deleted.
     * @method module:mscs-face-api.MSCSFaceApi#deletePersonGroup
     * @param {String} personGroupId - The personGroupId of the person group to be deleted.
     * @returns {Promise} A successful call returns an empty response body. A unsuccessful call returns the error.
     */
    function deletePersonGroup(personGroupId) {
        return new Promise((resolve, reject) => {
            axios({
                method: "delete",
                url: `${PERSON_GROUP}/${personGroupId}`,
                headers: HEADERS,
            }).then(function (res) {
                resolve(res.data);
            }).catch(function (err) {
                reject(err.response.data.error);
            });
        });
    }

    /**
     * Retrieve the information of a person group, including its name and userData.
     * This API returns person group information only, use Person - List Persons in a Person Group instead to retrieve person information under the person group.
     * @method module:mscs-face-api.MSCSFaceApi#getPersonGroup
     * @param {String} personGroupId - personGroupId of the target person group.
     * @returns {Promise} A successful call returns the person group's information. A unsuccessful call returns the error.
     */
    function getPersonGroup(personGroupId) {
        return new Promise((resolve, reject) => {
            axios({
                method: "get",
                url: `${PERSON_GROUP}/${personGroupId}`,
                headers: HEADERS,
            }).then(function (res) {
                resolve(res.data);
            }).catch(function (err) {
                reject(err.response.data.error);
            });
        })
    }

    /**
     * Retrieve the training status of a person group (completed or ongoing).
     * Training can be triggered by the Person Group - Train Person Group API. The training will process for a while on the server side.
     * @method module:mscs-face-api.MSCSFaceApi#getPersonGroupTrainingStatus
     * @param {String} personGroupId - personGroupId of target person group.
     * @returns {Promise} A successful call returns the person group's training status. A unsuccessful call returns the error.
     */
    function getPersonGroupTrainingStatus(personGroupId) {
        return new Promise((resolve, reject) => {
            axios({
                method: "get",
                url: `${PERSON_GROUP}/${personGroupId}/training`,
                headers: HEADERS,
            }).then(function (res) {
                resolve(res.data);
            }).catch(function (err) {
                reject(err.response.data.error);
            });
        })
    }

    /**
     * List person groups and their information.
     * @method module:mscs-face-api.MSCSFaceApi#listPersonGroups
     * @param {String} start - List person groups from the least personGroupId greater than the "start". It contains no more than 64 characters. Default is empty. (optional)
     * @param {int} top - The number of person groups to list, ranging in [1, 1000]. Default is 1000. (optional)
     * @returns {Promise} A successful call returns an array of person groups and their information (personGroupId, name and userData). A unsuccessful call returns the error. 
     */
    function listPersonGroups(start, top) {
        return new Promise((resolve, reject) => {
            axios({
                method: "get",
                url: `${PERSON_GROUP}?start=${start === undefined ? "" : start}&top=${top === undefined ? 1000 : top}`,
                headers: HEADERS,
            }).then(function (res) {
                resolve(res.data);
            }).catch(function (err) {
                reject(err.response.data.error);
            });
        })
    }

    /**
     * Queue a person group training task, the training task may not be started immediately. 
     * @method module:mscs-face-api.MSCSFaceApi#trainPersonGroup
     * @param {String} personGroupId - Target person group to be trained.
     * @returns {Promise} A successful call returns an empty JSON body. A unsuccessful call returns the error. 
     */
    function trainPersonGroup(personGroupId) {
        return new Promise((resolve, reject) => {
            axios({
                method: "post",
                url: `${PERSON_GROUP}/${personGroupId}/train`,
                headers: HEADERS,
            }).then(function (res) {
                resolve(res.data);
            }).catch(function (err) {
                reject(err.response.data.error);
            });
        })
    }

    /**
     * Update an existing person group's display name and userData. The properties which does not appear in request body will not be updated.
     * @method module:mscs-face-api.MSCSFaceApi#updatePersonGroup
     * @param {String} personGroupId - personGroupId of the person group to be updated.
     * @param {String} name - Person group display name. The maximum length is 128.
     * @param {String} userData - User-provided data attached to the person group. The size limit is 16KB.
     * @returns {Promise} A successful call returns an empty JSON body. A unsuccessful call returns the error.
     */
    function updatePersonGroup(personGroupId, name, userData) {
        return new Promise((resolve, reject) => {
            axios({
                method: "patch",
                url: `${PERSON_GROUP}/${personGroupId}`,
                headers: HEADERS,
                data: {
                    "name": name === undefined ? "" : name,
                    "userData": userData === undefined ? "" : userData
                }
            }).then(function (res) {
                resolve(res.data);
            }).catch(function (err) {
                reject(err.response.data.error);
            });
        })
    }

    /**
     * Add a representative face to a person for identification. The input face is specified as an image with a targetFace rectangle. It returns a persistedFaceId representing the added face and this persistedFaceId will not expire.
     * Note persistedFaceId is different from faceId which represents the detected face by Face - Detect.
     * @method module:mscs-face-api.MSCSFaceApi#addPersonFace
     * @param {String} personGroupId - Specifying the person group containing the target person.
     * @param {String} personId - Target person that the face is added to.
     * @param {String} userData - User-specified data about the target face to add for any purpose. The maximum length is 1KB. (optional)
     * @param {String} image - Face image URL. Valid image size is from 1KB to 4MB. Only one face is allowed per image.
     * @returns {Promise} A successful call returns the new persistedFaceId. A unsuccessful call returns the error. 
     */
    function addPersonFace(personGroupId, personId, userData, image) {
        return new Promise((resolve, reject) => {
            axios({
                method: "post",
                url: `${PERSON_GROUP}/${personGroupId}/persons/${personId}/persistedFaces${userData ? "?userData="+userData:""}`,
                headers: HEADERS,
                data: {
                    "url": image
                }
            }).then(function (res) {
                resolve(res.data.persistedFaceId);
            }).catch(function (err) {
                reject(err.response.data.error);
            })
        });
    }

    /**
     * Create a new person in a specified person group. A newly created person have no registered face, you can call Person - Add a Person Face API to add faces to the person. 
     * @method module:mscs-face-api.MSCSFaceApi#createPerson
     * @param {String} personGroupId - Specifying the target person group to create the person.
     * @param {String} name - Display name of the target person. The maximum length is 128.
     * @param {String} userData -Optional fields for user-provided data attached to a person. Size limit is 16KB. (optional)
     * @returns {Promise} A successful call returns a new personId created. A unsuccessful call returns the error. 
     */
    function createPerson(personGroupId, name, userData) {
        return new Promise((resolve, reject) => {
            axios({
                method: "post",
                url: `${PERSON_GROUP}/${personGroupId}/persons`,
                headers: HEADERS,
                data: {
                    "name": name,
                    "userData": userData
                }
            }).then(function (res) {
                resolve(res.data.personId);
            }).catch(function (err) {
                reject(err.response.data.error);
            })
        });
    }

    /**
     * List all persons in a person group, and retrieve person information (including personId, name, userData and persistedFaceIds of registered faces of the person).
     * @method module:mscs-face-api.MSCSFaceApi#listPersonsInPersonGroup
     * @param {String} personGroupId - personGroupId of the target person group. 
     * @param {String} start - List persons from the least personId greater than the "start". It contains no more than 64 characters. Default is empty. (optional)
     * @param {int} top - The number of persons to list, ranging in [1, 1000]. Default is 1000. (optional)
     * @returns {Promise} A successful call returns an array of person information that belong to the person group. A unsuccessful call returns the error. 
     */
    function listPersonsInPersonGroup(personGroupId, start, top) {
        return new Promise((resolve, reject) => {
            axios({
                method: "get",
                url: `${PERSON_GROUP}/${personGroupId}/persons?start=${start === undefined ? "" : start}&top=${top === undefined ? 1000 : top}`,
                headers: HEADERS,
            }).then(function (res) {
                resolve(res.data);
            }).catch(function (err) {
                reject(err.response.data.error);
            })
        });
    }

    /**
     * Detect human faces in an image and returns face locations and faceIds of the detected faces.
     * @method module:mscs-face-api.MSCSFaceApi#detectFace
     * @param {String} image - URL of input image.
     * @returns {Promise} A successful call returns an array of face entries ranked by face rectangle size in descending order and faceIds. An empty response indicates no faces detected. A unsuccessful call returns the error. 
     */
    function detectFace(image) {
        return new Promise((resolve, reject) => {
            axios({
                method: "post",
                url: `${DETECT}?returnFaceId=true`,
                headers: HEADERS,
                data: {
                    "url": image
                }
            }).then(function (res) {
                resolve(res.data);
            }).catch(function (err) {
                reject(err.response.data.error);
            })
        })
    }

    /**
     * Identify unknown faces from a person group.
     * @method module:mscs-face-api.MSCSFaceApi#identifyFace
     * @param {String} personGroupId - personGroupId of the target person group, created by Person Group - Create a Person Group.
     * @param {Array} faceIds - Array of query faces faceIds, created by the Face - Detect. Each of the faces are identified independently. The valid number of faceIds is between.
     * @param {Number} confidenceThreshold - Confidence threshold of identification, used to judge whether one face belong to one person. The range of confidenceThreshold is [0, 1] (default specified by algorithm). (optional)
     * @returns {Promise} A successful call returns the identified candidate person(s) for each query face. An empty response indicates no faces detected. A unsuccessful call returns the error. 
     */
    function identifyFace(personGroupId, faceIds, confidenceThreshold) {
        function splitFaceIds(faceIds) {
            let splits = [];
            while (faceIds.length > 0) {
                let arr = faceIds.splice(0, 10);
                splits.push(arr);
            }
            return splits;
        }
        let splits = splitFaceIds(faceIds);
        let all = splits.map(function (faceIds) {
            return new Promise((resolve, reject) => {
                axios({
                    method: "post",
                    url: `${IDENTIFY}`,
                    headers: HEADERS,
                    data: {
                        "personGroupId": personGroupId,
                        "faceIds": faceIds,
                        "confidenceThreshold": confidenceThreshold
                    }
                }).then(function (res) {
                    resolve(res.data);
                }).catch(function (err) {
                    reject(err.response.data.error);
                })
            })
        })
        return new Promise((resolve, reject) => {
            Promise.all(all)
                .then((res) => {
                    let identify = [];
                    res.map(function(arr){
                        identify = identify.concat(arr);
                    })
                    resolve(identify);
                })
                .catch((err) => reject(err));
        })
    }

    return {
        createPersonGroup,
        deletePersonGroup,
        getPersonGroup,
        getPersonGroupTrainingStatus,
        listPersonGroups,
        trainPersonGroup,
        updatePersonGroup,
        addPersonFace,
        createPerson,
        listPersonsInPersonGroup,
        detectFace,
        identifyFace
    };

}

/**
 * Retrieves the full name of the server correspondent to the short name received.
 * @memberof module:mscs-face-api
 * @param {String} server - Server short name to use this API. Options: WUS (westus), EUS2 (eastus2), WCUS (westcentralus), WE (westeurope) and SA (southeastasia).
 * @returns {String} If the short name for the server exists it will return the full name. If it doesn't returns undefined.
 */
function getServer(server) {
    switch (server) {
        case "WUS":
            return "westus";
        case "EUS2":
            return "eastus2"
        case "WCUS":
            return "westcentralus";
        case "WE":
            return "westeurope";
        case "SA":
            return "southeastasia";
        default:
            return undefined;
    }
}

module.exports = MSCSFaceApi;