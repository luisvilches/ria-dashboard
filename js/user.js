var url = 'https://ria-admin.herokuapp.com';

function itemUser(n,m,p,id){
    var tr = document.createElement('tr');
    tr.innerHTML = `<td data-label="Nombre">${n}</td>
    <td data-label="Email">${m}</td>
    <td data-label="Password">${p}</td>
    <td data-label="Acciones">
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-danger" onclick="remove('${id}')"><i class="fas fa-eraser"></i></button>
      </div>
    </td>`;

    return tr;
}

function getToken() {
    return window
        .localStorage
        .getItem('token');
}

function edit(id){
    alert(id);
}

function remove(id){

    fetch(url+'/auth/user/'+id,{
        headers:{
            Authorization:'Bearer ' + getToken()
        },
        method:'DELETE'
    }).then(res => res.json())
    .then(response => {
        if(response.status){
            loadUsers();
        }
    })
}

function loadUsers(){
    fetch(url+'/auth/users', {
        headers:{
            Authorization:'Bearer ' + getToken()
        },
        method:'GET'
    }).then(res => res.json())
    .then(response => {
        if(response.success){
            var usersContainer = document.querySelector('#users');
            usersContainer.innerHTML = '';
            response.data.forEach(e => {
                usersContainer.appendChild(itemUser(e.name,e.email,e.password,e._id));
            });
        } else {
            alert('Error de autenticación');
            window.location.href = '/login.html';
        }
    })
}

function incorrect(msg){
    var alert = document.querySelector('#alert');
    var p = alert.querySelector('p');
    p.innerText = msg;
    alert.style.display = 'block';
}

function correct(){
    var alert = document.querySelector('#alert');
    alert.style.display = 'none';
}

function create(){
    var name = document.getElementById('name');
    var mail = document.getElementById('mail');
    var pass = document.getElementById('pass');
    var confirm = document.getElementById('confirm');

    if(name == null || name.value.lenght == 0 || /^\s+$/.test(name.value)){
        incorrect('El campo nombre no puede estar vacio');
        return false;
    }

    if(!validateEmail(mail.value)){
        incorrect('El campo email debe tener un formato de correo valido');
        return false;
    }

    if(pass == null || pass.value.lenght == 0 || /^\s+$/.test(pass.value)){
        incorrect('El campo password no puede estar vacio');
        return false;
    }
    
    if(!pass.value === confirm.value){
        incorrect('El campo password no coincide con el campo confirmación');
        return false;
    }

    correct();

    var form  = new FormData();
    form.append('name', name.value);
    form.append('email', mail.value);
    form.append('password', pass.value);
    form.append('role', 'admin');

    fetch(url+'/auth/user/create',{
        method:'POST',
        headers:{
            Authorization:'Bearer ' + getToken()
        },
        body:form
    }).then(res => res.json())
    .then(response => {
        document.getElementById('close').click();
        if(response.success){
            loadUsers();
        } else {
            window.location.href = '/login.html';
        }
    })
}


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

document.addEventListener('DOMContentLoaded', function(){
    loadUsers();

    document.getElementById('save').addEventListener('click',create);
});
