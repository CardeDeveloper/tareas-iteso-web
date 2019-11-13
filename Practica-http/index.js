const baseUrl = 'http://users-dasw.herokuapp.com/api/'

fetch(baseUrl +'tokenDASW', {
    headers: {
        'Content-Type': 'application/json',
        'x-expediente': '713420' 
    }
})
  .then(response => response.json())
  .then(json => localStorage.setItem('dasw-x-auth', json.token))


let btnReg = document.getElementById("btnReg")

btnReg.onclick = register

function register(event){
  event.preventDefault()
  let name = document.getElementById("name")
  let lastname = document.getElementById("lastname")
  let email = document.getElementById("email")
  let psw2 = document.getElementById("pass2")
  let date = document.getElementById("date")
  let sexo = document.getElementsByName("sexo")
  let url = document.getElementById("url")

  data={
    nombre: name.value  ,
    apellido : lastname.value ,
    correo: email.value ,
    password : psw2.value ,
    fecha :  date.value,
    sexo: sexo[0].checked == true ? sexo[0].value : sexo[1].value,
    url: url.value
  }

console.log(localStorage.getItem('dasw-x-auth'))


xhr = new XMLHttpRequest();
    xhr.open('POST', `${baseUrl}users/`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-auth', localStorage.getItem("dasw-x-auth"));
    xhr.send(JSON.stringify(data));
    xhr.onload = function() {
        if(xhr.status != 201){
            //error
            alert(xhr.status + ': ' + xhr.statusText + ' ' + xhr.responseText);
            console.log(xhr.responseText);
        }else {
            alert("User registered succesfully"); //
        }
    }
}
/*fetch(`${baseUrl}users/`, {
  method: 'POST', // or 'PUT'
  body: JSON.stringify(data), // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json',
    'x-auth' : localStorage.getItem('dasw-x-auth'),
    'Access-Control-Allow-Origin': '*'

  }
}).then(console.log)
.catch(error => console.error('Error:', error))
  return false

}*/
let btnLogin = document.getElementById("btnLogin")
btnLogin.onclick = login

function login(event){
  event.preventDefault()
  let loginUser = {
    correo: document.getElementById("emailLogin").value,
    password: document.getElementById("passLogin").value
};

//HTTP request
xhr = new XMLHttpRequest();
xhr.open('POST', `${baseUrl}login/`);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.setRequestHeader('x-auth', localStorage.getItem("dasw-x-auth"));
xhr.send(JSON.stringify(loginUser));
xhr.onload = function() {
    if(xhr.status != 200){
        //error
        alert(xhr.status + ': ' + xhr.statusText + ' ' + xhr.responseText);
    }else {
        //go to consultas
        let onj = JSON.parse(xhr.responseText);
        window.localStorage.setItem("user-token", onj.token);       
        window.location = "consulta.html";
    }
}
}

function checkPasword(){
    let psw1 = document.getElementById("pass1")
    let psw2 = document.getElementById("pass2")
    if(psw1.value === psw2.value) return true
    return false
}

  window.addEventListener('load', function() {
      
      btnReg.setAttribute("disabled", "")
   
    var forms = document.getElementsByClassName('needs-validation');

    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('change', function(event) {
        //console.log(checkPasword())
        if (form.checkValidity() === false || !checkPasword()) {
          event.preventDefault();
          event.stopPropagation();
          btnReg.setAttribute("disabled", "")
        }else{
            btnReg.removeAttribute("disabled")
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
