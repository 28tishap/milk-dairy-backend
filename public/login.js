document
.getElementById('loginForm')
.addEventListener('submit', function(e) {

    e.preventDefault();

    const username =
        document.getElementById('username').value;

    const password =
        document.getElementById('password').value;

    fetch('http://localhost:5000/login', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({

            username: username,
            password: password

        })

    })

    .then(response => response.json())

    .then(data => {

        console.log(data);

        if (data.success) {

            // STORE LOGIN SESSION

            localStorage.setItem(
                'loggedIn',
                'true'
            );

            localStorage.setItem(
                'username',
                data.user.username
            );

            localStorage.setItem(
                'role',
                data.user.role
            );

            // OPEN DASHBOARD

            window.location.href = 'dashboard.html';

        } else {

            alert('Invalid Username or Password');

        }

    })

    .catch(error => {

        console.log('Login Error:', error);

        alert('Server Connection Failed');

    });

});