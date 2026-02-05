const BASE_URL = "http://104.236.230.31/LAMPAPI";

document.getElementById("registerBtn").onclick = async function () {
  const body = {
    firstName: regFirst.value,
    lastName: regLast.value,
    login: regLogin.value,
    password: regPass.value
  };

  const response = await fetch(BASE_URL + "/Register.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  message.innerText = data.error === ""
    ? "Registration successful"
    : "Register error: " + data.error;
};

document.getElementById("loginBtn").onclick = async function () {
  const body = {
    login: loginUser.value,
    password: loginPass.value
  };

  const response = await fetch(BASE_URL + "/Login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  message.innerText = data.error === ""
    ? "Welcome " + data.firstName + " " + data.lastName
    : "Login error: " + data.error;
};
