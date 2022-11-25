// Dom elements

let snackbarClose = document.getElementById("snackbar-close");
let snackbar = document.getElementById("snackbar");
let loginSnackbar = document.getElementById("login-snackbar");
let loginSnackbarClose = document.getElementById("login-snackbar-close");
let loginSnackbarFailed = document.getElementById(
  "login-snackbar-failed-close"
);
let loginSnackbarNotFound = document.getElementById(
  "login-snackbar-failed-notfound"
);
let loginSnackbarWrong = document.getElementById("login-snackbar-failed");
let loginSnackbarNoUser = document.getElementById("login-snackbar-notfound");
let dashboardSnackbar = document.getElementById("dashboard-snackbar");
let dashboardSnackbarClose = document.getElementById(
  "dashboard-snackbar-close"
);

async function newUserLog(userdetails) {
  try {
    let signUpValidation = await fetch(`http://localhost:3000/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userdetails),
    });
    if (signUpValidation.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error");
  }
}

async function existingUserLog(loginUserDetails) {
  try {
    let loginValidation = await fetch(`http://localhost:3000/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginUserDetails),
    });
    if (loginValidation.status === 200) {
      return "valid";
    } else if (loginValidation.status === 205) {
      return "wrongpassword";
    } else {
      return "notfound";
    }
  } catch (error) {
    console.log("Error");
  }
}

async function updateTaskDetails(taskDetails) {
  try {
    await fetch(`http://localhost:3000/updateTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskDetails),
    });
  } catch (error) {
    console.log("Error");
  }
}

async function validateForDuplicateTask(taskName) {
  try {
    let validTask = await fetch(`http://localhost:3000/getOneTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskName),
    });
    return validTask.json();
  } catch (error) {
    console.log("Error");
  }
}

async function getAllTasks(useremail) {
  try {
    let taskDetails = await fetch(`http://localhost:3000/getAlltask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginEmail: useremail }),
    });
    return taskDetails.json();
  } catch (error) {
    console.log("Error");
  }
}

async function deleteSelectedTask(taskName, user) {
  try {
    let taskDetails = await fetch(`http://localhost:3000/deleteTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskName: taskName, useremail: user }),
    });
    return taskDetails.json();
  } catch (error) {
    console.log("Error");
  }
}

async function getLoggedUserData(useremail) {
  try {
    let userDetails = await fetch(`http://localhost:3000/getUserData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginEmail: useremail }),
    });
    return userDetails.json();
  } catch (error) {
    console.log("Error");
  }
}

async function deleteUserAccount(useremail) {
  try {
    await fetch(`http://localhost:3000/deleteUserData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginEmail: useremail }),
    });
  } catch (error) {
    console.log("Error");
  }
}

async function editAndUpdateTaskDetails(taskData) {
  try {
    let taskDetails = await fetch(`http://localhost:3000/editAndUpdateTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    return taskDetails.json();
  } catch (error) {
    console.log("Error");
  }
}

async function getSingleTask(useremail, taskName) {
  try {
    let taskDetails = await fetch(`http://localhost:3000/getSpecificTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginEmail: useremail, taskName: taskName }),
    });
    return taskDetails.json();
  } catch (error) {
    console.log("Error");
  }
}

async function getAllUserTasks() {
  try {
    let taskDetails = await fetch(`http://localhost:3000/getAllUsertask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    });
    return taskDetails.json();
  } catch (error) {
    console.log("Error");
  }
}

async function getAndValidateUserData(userdetails) {
  let validUser = await newUserLog(userdetails);
  if (validUser) {
    loginPage.style.display = "block";
    todoDashboard.style.display = "none";
    signupPage.style.display = "none";
    loginSnackbar.classList.add("signup-success");
    setTimeout(function () {
      loginSnackbar.classList.remove("signup-success");
    }, 7000);
  } else {
    snackbar.classList.add("show-snackbar");
    setTimeout(function () {
      snackbar.classList.remove("show-snackbar");
    }, 7000);
  }
}

async function validateTask(taskName) {
  let validTask = await validateForDuplicateTask(taskName);
  return validTask;
}

async function getAndValidateLoginUserData(loginUserDetails) {
  let validLoginUser = "notfound";
  if (loginUserDetails.useremail === "admin@gmail.com") {
    if (loginUserDetails.userPassword === "Admin@123") {
      validLoginUser = "valid";
    } else {
      if (loginUserDetails.useremail === "admin@gmail.com") {
        validLoginUser = "wrongpassword";
      } else {
        validLoginUser = "notfound";
      }
    }
  }
  console.log(validLoginUser);
  switch (validLoginUser) {
    case "valid":
      closeSnackbar();
      loginPage.style.display = "none";
      logoSection.style.display = "none";
      todoDashboard.style.display = "block";
      seperateAndCreateTaskCard();
      todoDashboard.classList.add("active");
      dashboardSnackbar.classList.add("login-snackbar");
      draggableCards();
      placeable();
      setTimeout(function () {
        dashboardSnackbar.classList.remove("login-snackbar");
      }, 4000);
      break;
    case "wrongpassword":
      closeSnackbar();
      loginSnackbarWrong.classList.add("show-snackbar");
      setTimeout(function () {
        loginSnackbarWrong.classList.remove("show-snackbar");
      }, 7000);
      break;
    case "notfound":
      closeSnackbar();
      loginSnackbarNoUser.classList.add("login-failed-snackbar");
      setTimeout(function () {
        loginSnackbarNoUser.classList.remove("login-failed-snackbar");
      }, 7000);
      break;
  }
}

function closeSnackbar() {
  loginSnackbar.classList.remove("login-snackbar");
  loginSnackbarWrong.classList.remove("show-snackbar");
  loginSnackbarNoUser.classList.remove("login-failed-snackbar");
  dashboardSnackbar.classList.remove("login-snackbar");
}

function writeNewTask(taskDetails) {
  updateTaskDetails(taskDetails);
}

async function deleteAndRemoveTaskName(taskName, user) {
  let confirmDelete = await deleteSelectedTask(taskName, user);
  return confirmDelete;
}

// Event Listeners

loginSnackbarClose.addEventListener("click", closeSnackbar);
loginSnackbarFailed.addEventListener("click", closeSnackbar);
loginSnackbarNotFound.addEventListener("click", closeSnackbar);
dashboardSnackbarClose.addEventListener("click", closeSnackbar);
