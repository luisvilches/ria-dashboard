document.addEventListener('DOMContentLoaded',function(){
    verifyLogin();
    document.getElementById('logout').addEventListener('click',function(){
        window.localStorage.removeItem('token');
        window.location.href = '/login.html';
    })
});

function verifyLogin() {
    if (!getToken()) {
        window.location.href = '/login.html'
    }
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