  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCb9ISEETXVEML8Df98hISTRmQ2tU-SAo4",
    authDomain: "form-251e7.firebaseapp.com",
    databaseURL: "https://form-251e7.firebaseio.com",
    projectId: "form-251e7",
    storageBucket: "form-251e7.appspot.com",
    messagingSenderId: "158115953812",
    appId: "1:158115953812:web:45438ee982b1d9e69d8881"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const functions = firebase.functions();
  
  function signUp() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));

    alert("Signed Up")
  }

  function signIn() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));
  }

  function signOut() {
    auth.signOut();
  }

  // add admin cloud function
  if(document.querySelector('.admin-actions')) {
    const adminForm = document.querySelector('.admin-actions');
    adminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const adminEmail = document.querySelector("#admin-email").value;
      const addAdminRole = functions.httpsCallable("addAdminRole");
      addAdminRole({ email: adminEmail }).then(result => {
        if(result.data.message) {
          alert(result.data.message);
        }
        else {
          alert(result.data.errorInfo.message);
        }
      });
    });
  }

  auth.onAuthStateChanged(function(user) {
    if(user) {
      user.getIdTokenResult().then(idTokenResult => {
        user.admin = idTokenResult.claims.admin;
        if (user.admin) {
          var adminTrue = document.getElementsByClassName("admin");
          for (var i = 0; i < adminTrue.length; i++) {
            adminTrue[i].style.display = "";
          }
        }
      })
      var email = user.email;
      if ( window.location.pathname.split("/").pop() == "index.html") {
        alert("Signed In as " + email);
        window.location.href = './home.html';
      }
      document.getElementById("user").innerHTML = "Signed in as " + email;
    }
    else {
      if ( window.location.pathname.split("/").pop() != "index.html") {
        alert("No account is Signed In at the moment");
        window.location.href = './index.html';
      }
    }
  })