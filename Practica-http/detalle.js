
const baseUrl = 'http://users-dasw.herokuapp.com/api/'
function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
  }
  return params;
}

var params = getSearchParameters();

xhr = new XMLHttpRequest();
xhr.open("GET", `${baseUrl}users/${params.correo}`);
xhr.setRequestHeader('x-auth', localStorage.getItem("dasw-x-auth"));
xhr.setRequestHeader('x-user-token', localStorage.getItem("user-token"));
xhr.send();
xhr.onload = function() {
    if(xhr.status != 200){
        alert(xhr.status + ': ' + xhr.statusText + ' ' + xhr.responseText);
    }else {
        let user = JSON.parse(xhr.responseText);
        console.log(user)
        document.body.innerHTML= `
        <a class="btn btn-info" href="consulta.html">Volver</a>
        <div class="media col-8 mt-2">
        <div class="media-left align-self-center mr-3">
            <img class="rounded-circle" src="${user.url}">
        </div>
        <div class="media-body">
                <h4> ${user.nombre + " " + user.apellido}</h4>
                <p>Correo: ${user.correo}</p>
                <p>fecha de nacimiento: ${user.fecha}</p>
                <p>Sexo: ${user.sexo == "H" ? "Hombre" : "Mujer"}</p>
                

            </div>
            
    </div>
        `
    }
}