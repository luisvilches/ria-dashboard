var url = 'https://ria-admin.herokuapp.com';


document.addEventListener('DOMContentLoaded',function(){
    var enter = document.querySelector("#enter");
    enter.addEventListener('click', login);
})

function login(){
    var inputEmail = document.querySelector('#inputEmail');
    var inputPassword = document.querySelector('#inputPassword');

    if(!validateEmail(inputEmail.value)){
        inputEmail.style.border = '1px solid #ec0000';
        return false;
    }

    if(inputPassword == null || inputPassword.value.lenght == 0 || /^\s+$/.test(inputPassword.value)){
        inputPassword.style.border = '1px solid #ec0000';
        return false;
    }

    inputEmail.style.border = '1px solid #009688';
    inputPassword.style.border = '1px solid #009688';
    sendLogin();

}



function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


function sendLogin(){
    var form  = new FormData();
    form.append('email', inputEmail.value);
    form.append('password', inputPassword.value);
    fetch(url+'/login', {
        method:'POST',
        body: form
    }).then(res => res.json())
    .then(response => {
        console.log('send',response)
        if(response.success){
            document.querySelector('#alert').style.display = 'none';
            setToken(response.token)
            window.location.href = '/index.html';
        } else {
            document.querySelector('#alert').style.display = 'block';
        }
    })
}


function getToken() {
    return window
        .localStorage
        .getItem('token');
}

function setToken(token) {
    window
        .localStorage
        .setItem('token', token);
}