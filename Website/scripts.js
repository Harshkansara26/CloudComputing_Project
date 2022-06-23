"use strict";

const serverUrl = "http://127.0.0.1:8000";

async function uploadImage() {
    // encode input file as base64 string for upload
    let file = document.getElementById("file").files[0];
    let converter = new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result
            .toString().replace(/^data:(.*,)?/, ''));
        reader.onerror = (error) => reject(error);
    });
    let encodedString = await converter;

    // clear file upload input field
    document.getElementById("file").value = "";

    // make server call to upload image
    // and return the server upload promise
    return fetch(serverUrl + "/images", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: file.name, filebytes: encodedString })
    }).then(response => {
        if (response.ok) {

            return response.json();
        } else {
            throw new HttpError(response);
        }
    })
}

function updateImage(image) {
    document.getElementById("view").style.display = "block";
    document.getElementById("form_details").style.display = "block";
    document.getElementById("details_saved").style.display = "none";

    let imageElem = document.getElementById("image");
    imageElem.src = image["fileUrl"];
    imageElem.alt = image["fileId"];

    return image;
}

function extractInformation(image) {
    // make server call to extract information
    // and return the server upload promise
    return fetch(serverUrl + "/images/" + image["fileId"] + "/extract-info", {
        method: "POST"
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new HttpError(response);
        }
    })
}

function populateFields(extractions) {
    let fields = ["name", "email", "phone", "organization", "address"];
    fields.map(function (field) {
        if (field in extractions) {
            let element = document.getElementById(field);
            element.value = extractions[field].join(" ");
        }
        return field;
    });
    let saveBtn = document.getElementById("save");
    saveBtn.disabled = false;
}

function uploadAndExtract() {
    uploadImage()
        .then(image => updateImage(image))
        .then(image => extractInformation(image))
        .then(translations => populateFields(translations))
        .catch(error => {
            alert("Error: " + error);
        })
}

function saveContact() {
    let contactInfo = {};

    let fields = ["name", "email", "phone", "organization", "address"];
    fields.map(function (field) {
        let element = document.getElementById(field);
        if (element && element.value) {
            contactInfo[field] = element.value;
        }
        return field;
    });
    let imageElem = document.getElementById("image");
    contactInfo["image"] = imageElem.src;

    // make server call to save contact
    return fetch(serverUrl + "/contacts", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactInfo)
    }).then(response => {
        if (response.ok) {

            clearContact();

            return response.json();
        } else {
            throw new HttpError(response);
        }
    })
}

function clearContact() {
    let form = document.getElementById("form_details")
    form.style.display = "none";
    let success = document.getElementById("details_saved")
    success.style.display = "block";

    let imageElem = document.getElementById("image");
    imageElem.src = "";
    imageElem.alt = "";

    let saveBtn = document.getElementById("save");
    saveBtn.disabled = true;
}

function retrieveContacts() {
    // make server call to get all contacts
    return fetch(serverUrl + "/contacts", {
        method: "GET"
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new HttpError(response);
        }
    })
}

/*function displayContacts(contacts) {
    let contactsElem = document.getElementById("contacts")
    while (contactsElem.firstChild) {
        contactsElem.removeChild(contactsElem.firstChild);
    }

    for (let i = 0; i < contacts.length; i++) {
        let contactElem = document.createElement("div");
        contactElem.style = "float: left; width: 50%";
        contactElem.appendChild(document.createTextNode(contacts[i]["name"]));
        contactElem.appendChild(document.createElement("br"));
        contactElem.appendChild(document.createTextNode(contacts[i]["title"]));
        contactElem.appendChild(document.createElement("br"));
        contactElem.appendChild(document.createTextNode(contacts[i]["organization"]));
        contactElem.appendChild(document.createElement("br"));
        contactElem.appendChild(document.createTextNode(contacts[i]["address"]));
        contactElem.appendChild(document.createElement("br"));
        contactElem.appendChild(document.createTextNode(
             contacts[i]["city"] + ", " + contacts[i]["state"] + " " + contacts[i]["zip"]
        ));
        contactElem.appendChild(document.createElement("br"));
        contactElem.appendChild(document.createTextNode("phone: " + contacts[i]["phone"]));
        contactElem.appendChild(document.createElement("br"));
        contactElem.appendChild(document.createTextNode("email: " + contacts[i]["email"]));

        let cardElem = document.createElement("div");
        cardElem.style = "float: right; width: 50%";
        let imageElem = document.createElement("img");
        imageElem.src = contacts[i]["image"];
        imageElem.height = "150";
        cardElem.appendChild(imageElem);

        contactsElem.appendChild(document.createElement("hr"));
        contactsElem.appendChild(contactElem);
        contactsElem.appendChild(imageElem);
        contactsElem.appendChild(document.createElement("hr"));
    }
}*/
function displayContacts(contacts) {
    // helper function 

    document.getElementById("contacts_table").innerHTML = "";
    let table = document.getElementById("contacts_table");


    // helper function        
    function addCell(tr, text) {
        var td = tr.insertCell();
        td.textContent = text;
        return td;
    }

    // create header 
    var thead = table.createTHead();
    var headerRow = thead.insertRow();
    var hcol1 = addCell(headerRow, 'Name');
    hcol1.style.border = "1px solid black";
    hcol1.style.fontWeight = "bold";
    var hcol2 = addCell(headerRow, 'Telephone Number');
    hcol2.style.border = "1px solid black";
    hcol2.style.fontWeight = "bold";
    var hcol3 = addCell(headerRow, 'Email');
    hcol3.style.border = "1px solid black";
    hcol3.style.fontWeight = "bold";
    var hcol4 = addCell(headerRow, 'Organization');
    hcol4.style.border = "1px solid black";
    hcol4.style.fontWeight = "bold";
    var hcol5 = addCell(headerRow, 'Address');
    hcol5.style.border = "1px solid black";
    hcol5.style.fontWeight = "bold";
    var hcol6 = addCell(headerRow, 'Action');
    hcol6.style.border = "1px solid black";
    hcol6.style.fontWeight = "bold";
    headerRow.style.border = "1px solid black";

    // insert data
    contacts.forEach(function (item) {
        var row = table.insertRow();
        var col1 = addCell(row, item["name"]);
        col1.style.border = "1px solid black";
        var col2 = addCell(row, item["phone"]);
        col2.style.border = "1px solid black";
        var col3 = addCell(row, item["email"]);
        col3.style.border = "1px solid black";
        var col4 = addCell(row, item["organization"]);
        col4.style.border = "1px solid black";
        var col5 = addCell(row, item["address"]);
        col5.style.border = "1px solid black";
        var col6 = addCell(row, "Delete");
        col6.style.border = "1px solid black";
        row.style.border = "1px solid black";
    });


    table.style.width = "1000px"
    table.style.border = "solid";
}

function retrieveAndDisplayContacts() {
    retrieveContacts()
        .then(contacts => displayContacts(contacts))
        .catch(error => {
            alert("Error: " + error);
        })
}

function retrieveContactsByName() {
    console.log("Inside the method")
    // make server call to get all contacts
    let name = document.getElementById("search_name").value;
    console.log("name to search", name)
    return fetch(serverUrl + "/get_contact", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ con_name: name })
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new HttpError(response);
        }
    })
}

function retrieveAndDisplayContactsByName() {
    retrieveContactsByName()
        .then(contacts => displayContacts(contacts))
        .catch(error => {
            alert("Error: " + error);
        })
}

function deleteRow6() {
    document.getElementById("row6").remove();
}
function deleteRow5() {
    document.getElementById("row5").remove();
}
function deleteRow4() {
    document.getElementById("row4").remove();
}
function deleteRow3() {
    document.getElementById("row3").remove();
}
function deleteRow2() {
    document.getElementById("row2").remove();
}
function deleteRow1() {
    document.getElementById("row1").remove();
}

function editRow() {
    location.href = 'edit_card.html'
}


class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = "HttpError";
        this.response = response;
    }
}
