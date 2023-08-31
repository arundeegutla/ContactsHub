const urlBase = 'http://smallgroup21.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function createNewUser() {
    userId = -1;
    firstName = document.getElementById("fname").value;
    lastName = document.getElementById("lname").value;
    let username = document.getElementById("new-uname").value;
    let password = document.getElementById("new-pswd").value;

    let jsonPayload = JSON.stringify({
        FirstName: firstName,
        LastName: lastName,
        Username: username,
        Passwd: password
    });

    let url = urlBase + '/AddUser.' + extension;
    let returnValue = document.getElementById("signup-result");
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.ID;
                if (userId < 1) {
                    returnValue.innerHTML = "Cannot create user";
                    return;
                }
                saveCookie();
                returnValue.innerHTML = "Hi, " + firstName + " " + lastName + "!";
                // document.getElementById("signup-form").submit();
                // window.location.href = "https://arundeegutla.me/";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        returnValue.innerHTML = err.message;
    }
}


function doLogin() {
    userId = -1;
    firstName = "";
    lastName = "";

    let login = document.getElementById("username").value;
    let password = document.getElementById("cur-password").value;

    let tmp = {
        Username: login,
        Passwd: password
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.ID;
                if (userId < 1) {
                    document.getElementById("login-result").innerHTML = "User/Password combination incorrect";
                    return;
                }
                firstName = jsonObject.FirstName;
                lastName = jsonObject.LastName;
                saveCookie();
                document.getElementById("login-result").innerHTML = "Hi, " + firstName + " " + lastName + "!";
                // document.getElementById("login-form").submit();
                // window.location.href = "https://arundeegutla.me/";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("login-result").innerHTML = err.message;
    }
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }
    else {
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function addColor() {
    let newColor = document.getElementById("colorText").value;
    document.getElementById("colorAddResult").innerHTML = "";

    let tmp = { color: newColor, userId, userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddColor.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("colorAddResult").innerHTML = "Color has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("colorAddResult").innerHTML = err.message;
    }

}

function searchColor() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("colorSearchResult").innerHTML = "";

    let colorList = "";

    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchColors.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);

                for (let i = 0; i < jsonObject.results.length; i++) {
                    colorList += jsonObject.results[i];
                    if (i < jsonObject.results.length - 1) {
                        colorList += "<br />\r\n";
                    }
                }

                document.getElementsByTagName("p")[0].innerHTML = colorList;
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("colorSearchResult").innerHTML = err.message;
    }

}