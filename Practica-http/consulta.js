const baseUrl = 'http://users-dasw.herokuapp.com/api/'
let users = []
let userObj = {}
let current_page = 0
let records_per_page = 2;
var btn_next = document.getElementById("btn_next");
var btn_prev = document.getElementById("btn_prev");

btn_next.onclick = nextPage
btn_prev.onclick = prevPage
let btn_search = document.getElementById("searchBtn")
btn_search.onclick = search

function search(event){
    let val = document.getElementById("searchInput").value
    xhr = new XMLHttpRequest();
    xhr.open("GET", `${baseUrl}users?nombre=${val}`);
    xhr.setRequestHeader('x-auth', localStorage.getItem("dasw-x-auth"));
    xhr.setRequestHeader('x-user-token', localStorage.getItem("user-token"));
    xhr.send();
    xhr.onload = function() {
        if(xhr.status != 200){
            alert(xhr.status + ': ' + xhr.statusText + ' ' + xhr.responseText);
        }else {
            users = JSON.parse(xhr.responseText);
            
            loadPagination()
            changePage(1)
        }
    }
}

function prevPage(){ 
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage(){
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}
function changePageCustom(page){
    current_page = page;
    changePage(current_page)
}

function changePage(page){
    
    let btn_next = document.getElementById("btn_next");
    let btn_prev = document.getElementById("btn_prev");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    let users_page= []

    for (var i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
        if(users[i] != undefined){
            users_page.push(users[i]);
           
        }
    }
    loadHtml(users_page)
    
    if (page == 1) {
       // btn_prev.setAttribute("disabled","")
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
        //btn_prev.removeAttribute("disabled")
    }

    if (page == numPages()) {
        
        btn_next.style.visibility = "hidden";
        //btn_next.setAttribute("disabled","")
    } else {
        btn_next.style.visibility = "visible";
        //btn_next.removeAttribute("disabled")
    }
}

function numPages()
{
    return Math.ceil(users.length / records_per_page);
}

window.addEventListener('load',(event)=>{
    loadUsers()
})

function loadUsers(){
    xhr = new XMLHttpRequest();
    xhr.open("GET", `${baseUrl}users/`);
    xhr.setRequestHeader('x-auth', localStorage.getItem("dasw-x-auth"));
    xhr.setRequestHeader('x-user-token', localStorage.getItem("user-token"));
    xhr.send();
    xhr.onload = function() {
        if(xhr.status != 200){
            alert(xhr.status + ': ' + xhr.statusText + ' ' + xhr.responseText);
        }else {
            users = JSON.parse(xhr.responseText);
            
            loadPagination()
            changePage(1)
        }
    }
}

function loadPagination(){
    let pagination = document.getElementById("pagination")
    let pags= ""
    for(i = 0 ; i<numPages() ; i++){
        pags+=`<li class="page-item"><a onclick="changePageCustom(${i+1})" class="page-link" href="#">${i+1}</a></li>`
    }
    let str = `<li class="page-item"><button onclick="prevPage()" id="btn_prev" class="page-link" href="#">Previous</button></li>
        ${pags}
        <li class="page-item"><button onclick="nextPage()" id="btn_next" class="page-link" href="#">Next</button></li>
    `
  
    pagination.innerHTML = str
}

function loadHtml(users){
    let string= ""
    let lista = document.getElementById("lista")
    users.forEach(element => {
        string+= userToHtml(element)
    });
    
    lista.innerHTML = string


}

function userToHtml(user){
    return `
    <div class="media col-8 mt-2">
    <div class="media-left align-self-center mr-3">
        <img class="rounded-circle" src="${user.url}">
    </div>
    <div class="media-body">
            <h4> ${user.nombre + " " + user.apellido}</h4>
            <p>Correo: ${user.correo}</p>
        </div>
        <div class="media-right align-self-center">
                <div class="row">
                    <a href="detalle.html?correo=${user.correo}" class="btn btn-primary edit"><i class="fas fa-search edit  "></i></a>
                </div>
                <div class="row">
                    <a href="#" data-toggle="modal" data-target="#edit" onclick="editUser('${user.correo}')" class="btn btn-primary mt-2"><i class="fas fa-pencil-alt edit  "></i></a>
                </div>
                <div class="row">
                    <a href="#" data-toggle="modal" data-target="#deleteConfirmation" onclick="removeUser('${user.correo}')" class="btn btn-primary mt-2"><i class="fas fa-trash-alt  remove "></i></a>
                </div>
            </div>
</div>
    `
}

//edit Users / onclick handler
function editUser(correo) {
    let userXhr = new XMLHttpRequest();
    userXhr.open("GET", `${baseUrl}users/${correo}/`);
    userXhr.setRequestHeader('x-auth', localStorage.getItem("dasw-x-auth"));
    userXhr.setRequestHeader('x-user-token', localStorage.getItem("user-token"));
    userXhr.send();
    userXhr.onload = function() {
        if(userXhr.status != 200) {
            alert(userXhr.status + ': ' + userXhr.statusText + ' ' + userXhr.responseText);
        } else {
            userObj = JSON.parse(userXhr.responseText);
            document.getElementById("editForm").addEventListener("submit", updateUser);
            updateEditModal();
          
            
        }

    }
}


//remove user / onclick handler
function removeUser(correo) {
    let userXhr = new XMLHttpRequest();
    userXhr.open("GET", `${baseUrl}users/${correo}/`);
    userXhr.setRequestHeader('x-auth', localStorage.getItem("dasw-x-auth"));
    userXhr.setRequestHeader('x-user-token', localStorage.getItem("user-token"));
    userXhr.send();
    userXhr.onload = function() {
        if(userXhr.status != 200) {
            alert(userXhr.status + ': ' + userXhr.statusText + ' ' + userXhr.responseText);
        } else {
            userObj = JSON.parse(userXhr.responseText);
            updateDeleteModal();
            document.getElementById("deleteButton").addEventListener("click", deleteUser);
        }

    }

}

function updateEditModal() {

    document.getElementById("editSexH").setAttribute("disabled", true);
    document.getElementById("editSexM").setAttribute("disabled", true);
    document.getElementById("editCorreo").setAttribute("disabled", true);

    document.getElementById("editName").value = userObj.nombre;
    document.getElementById("editLast").value = userObj.apellido;
    document.getElementById("editCorreo").value = userObj.correo;
    document.getElementById("editDate").value = userObj.fecha;
    document.getElementById("editUrl").value = userObj.url;
    document.getElementById("editPassword1").value = userObj.password;

    if(userObj.sexo == "H"){
        document.getElementById("editSexH").setAttribute("CHECKED", true);
        document.getElementById("editSexM").setAttribute("checked", false);

    } else {
        document.getElementById("editSexH").setAttribute("checked", false);
        document.getElementById("editSexM").setAttribute("checked", true);
    }
}

function updateDeleteModal() {

    document.getElementById("deleteUrl").setAttribute("src", userObj.url);
    document.getElementById("deleteNombre").innerText = `${userObj.nombre} ${userObj.apellido}`;
    document.getElementById("deleteCorreo").innerText = `Correo. ${userObj.correo}`;
    document.getElementById("deleteFecha").innerText = `Fecha de nacimiento: ${userObj.fecha}`;
    document.getElementById("deleteSexo").innerText = `Sexo: ${userObj.sexo == 'H' ? 'Hombre' : 'Mujer'}`;

}

function deleteUser() {
    console.log("delete on click")
    let userXhr = new XMLHttpRequest();
    userXhr.open("DELETE", `${baseUrl}users/${userObj.correo}/`);
    userXhr.setRequestHeader('x-auth', localStorage.getItem("dasw-x-auth"));
    userXhr.setRequestHeader('x-user-token', localStorage.getItem("user-token"));
    userXhr.send();
    userXhr.onload = function() {
        if(userXhr.status != 200) {
            alert(userXhr.status + ': ' + userXhr.statusText + ' ' + userXhr.responseText);
        } else {
            alert(userXhr.status + ': ' + userXhr.statusText + ' ' + userXhr.responseText);
            location.reload();
        }
    }
}

function updateUser(event) {
    event.preventDefault(); 
    console.log("update user");
    let formInputs = document.querySelectorAll("#edit input:valid");
    let formInputsArray =  Array.from(formInputs);
    let string = "{";
    formInputsArray.forEach((item) => string += `"${item.name}":"${item.value}",`);
    string = string.slice(0, -1) + "}";
    console.log("update: " + string);

    let userXhr = new XMLHttpRequest();
    userXhr.open("PUT", `${baseUrl}users/${userObj.correo}/`);
    userXhr.setRequestHeader('Content-Type', 'application/json');
    userXhr.setRequestHeader('x-auth', localStorage.getItem("dasw-x-auth"));
    userXhr.setRequestHeader('x-user-token', localStorage.getItem("user-token"));
    userXhr.send(string);
    userXhr.onload = function () {
        if(userXhr.status != 200) {
            alert(userXhr.status + ': ' + userXhr.statusText + ' ' + userXhr.responseText);
        } else {
            alert(userXhr.status + ': ' + userXhr.statusText + ' ' + userXhr.responseText);
            location.reload();
        }
    }
}