var url = 'https://ria-admin.herokuapp.com';

function item(n,m,p,id){
    var tr = document.createElement('tr');
    tr.innerHTML = `<td data-label="Nombre">${n}</td>
    <td data-label="Valor 1">${m}</td>
    <td data-label="Valor2">${p}</td>
    <td data-label="Acciones">
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-primary" onclick="update('${id.name}','${id.valor1}','${id.valor2}','${id._id}')" title="Editar" data-toggle="modal" data-target="#updateModal"><i class="fas fa-edit"></i></button>
        <button type="button" class="btn btn-danger" onclick="remove('${id._id}')" title="Eliminar"><i class="fas fa-eraser"></i></button>
      </div>
    </td>`;

    return tr;
}

function getToken() {
    return window
        .localStorage
        .getItem('token');
}

var idUpdate;

function update(name,valor1,valor2,id){
    var nameUpdate = document.getElementById('nameUpdate');
    var valor1Update = document.getElementById('valor1Update');
    var valor2Update = document.getElementById('valor2Update');
    nameUpdate.value = name;
    valor1Update.value = valor1;
    valor2Update.value = valor2;
    idUpdate = id;
}


function sendUpdate(name,valor1,valor2){
    var id = idUpdate;
    if(name.lenght == 0 || /^\s+$/.test(name)){
        incorrect('El campo nombre no puede estar vacio');
        return false;
    }

    if(valor1.lenght == 0 || /^\s+$/.test(valor1)){
        incorrect('El campo valor1 no puede estar vacio');
        return false;
    }
    
    if(valor2.lenght == 0 || /^\s+$/.test(valor2)){
        incorrect('El campo valor2 no puede estar vacio');
        return false;
    }

    correct();

    var form  = new FormData();
    form.append('name', name);
    form.append('valor1', valor1);
    form.append('valor2', valor2);

    fetch(url+'/auth/divisas/'+id,{
        method:'PUT',
        headers:{
            Authorization:'Bearer ' + getToken()
        },
        body:form
    }).then(res => res.json())
    .then(response => {
        document.getElementById('close').click();
        if(response.status){
            loadValores();
        } else {
            window.location.href = '/login.html';
        }
    })
}

function remove(id){

    fetch(url+'/auth/divisas/'+id,{
        headers:{
            Authorization:'Bearer ' + getToken()
        },
        method:'DELETE'
    }).then(res => res.json())
    .then(response => {
        if(response.status){
            loadValores();
        }
    })
}

function loadValores(){
    fetch(url+'/auth/divisas', {
        headers:{
            Authorization:'Bearer ' + getToken()
        },
        method:'GET'
    }).then(res => res.json())
    .then(response => {
        if(response.status){
            var usersContainer = document.querySelector('#valores');
            usersContainer.innerHTML = '';
            response.data.forEach(e => {
                usersContainer.appendChild(item(e.name,e.valor1,e.valor2,e));
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
    var valor1 = document.getElementById('valor1');
    var valor2 = document.getElementById('valor2');

    if(name == null || name.value.lenght == 0 || /^\s+$/.test(name.value)){
        incorrect('El campo nombre no puede estar vacio');
        return false;
    }

    if(valor1 == null || valor1.value.lenght == 0 || /^\s+$/.test(valor1.value)){
        incorrect('El campo valor1 no puede estar vacio');
        return false;
    }
    
    if(valor2 == null || valor2.value.lenght == 0 || /^\s+$/.test(valor2.value)){
        incorrect('El campo valor2 no puede estar vacio');
        return false;
    }

    correct();

    var form  = new FormData();
    form.append('name', name.value);
    form.append('valor1', valor1.value);
    form.append('valor2', valor2.value);

    fetch(url+'/auth/divisas',{
        method:'POST',
        headers:{
            Authorization:'Bearer ' + getToken()
        },
        body:form
    }).then(res => res.json())
    .then(response => {
        document.getElementById('close').click();
        if(response.status){
            loadValores();
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
    loadValores();

    document.getElementById('save').addEventListener('click',create);
    document.getElementById('update').addEventListener('click',function(){
        var nameUpdate = document.getElementById('nameUpdate').value;
        var valor1Update = document.getElementById('valor1Update').value;
        var valor2Update = document.getElementById('valor2Update').value;
        sendUpdate(nameUpdate,valor1Update,valor2Update);
    })
});
