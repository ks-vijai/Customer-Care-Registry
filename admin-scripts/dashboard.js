// DOM Elements

var modal = document.querySelector(".modal");
var todoAdd = document.getElementById("todo-add-task");
var inprogressAdd = document.getElementById("inprogress-add-task");
var completedAdd = document.getElementById("completed-add-task");
var closeButton = document.querySelector(".close-button");
var cancelButton = document.getElementById("task-cancel-button");
var addTask = document.getElementById("add-task");
var startDate = document.getElementById("start-date");
var endDate = document.getElementById("end-date");
var taskName = document.getElementById("task-name");
var todoPriority = document.getElementById("todo-priority");
var taskDescription = document.getElementById("description");
var todoBucket = document.getElementById("todo-cards");
var inProgressBucket = document.getElementById("inprogress-cards");
var completedTask = document.getElementById("completed-cards");
var taskSnackbar = document.getElementById("task-snackbar");
var exitWindow = document.getElementById("exit-window");
var deleteTaskName = document.getElementById("delete-task");
var deleteButton = document.getElementById("conform-delete");
var confirmCancelButton = document.getElementById("conform-cancel");
var deletedSnackBar = document.getElementById("dashboard-snackbar-close");
var viewModal = document.querySelector(".view-task-modal");
var closeViewModal = document.getElementById("close-view-task");
var closeViewButton = document.getElementById("close-view-task-modal");
var editViewModal = document.getElementById("edit-view-task-modal");
var updateTaskModal = document.getElementById("update-task-modal");
var closeUpdateButton = document.getElementById("close-edit-task");
var cancelUpdateButton = document.getElementById("close-edit-task-modal");
var confirmUpdate = document.getElementById("update-view-task-modal");
var updatedSnackbar = document.getElementById("updated-snackbar");
var updatedSnackbarClose = document.getElementById("updated-snackbar-close");
var navbar = document.getElementById("navbar");
var closeDeleteModal = document.getElementById("close-delete-task");
let viewTaskName = document.getElementById("view-task-name");
let viewStartDate = document.getElementById("view-start-date");
let viewEndDate = document.getElementById("view-due-date");
let viewTaskDescription = document.getElementById("view-description");
let viewPriority = document.getElementById("view-priority");
let viewTaskProgress = document.getElementById("view-progress");
let viewUsername = document.getElementById("view-username");
let viewUserAddress = document.getElementById("view-address");
let updateAddress = document.getElementById("edit-address");
let updateTaskName = document.getElementById("edit-task-name");
let updateStartDate = document.getElementById("edit-start-date");
let updateDueDate = document.getElementById("edit-end-date");
let updatePriority = document.getElementById("edit-priority");
let updateTaskProgress = document.getElementById("edit-progress");
let updateDescription = document.getElementById("edit-description");

var todayDate = new Date().toISOString().split("T")[0];
var progressOfTask = "New";
var deleteTaskCard;

let count = 0;

function toggleModal(taskProgress) {
  progressOfTask = taskProgress;
  todoPriority.value = "";
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
    emptyAddTask();
  }
}

function writeUserTask(taskDetails) {
  let taskNames = Object.values(taskDetails.taskDetails);
  taskNames.forEach((taskName) => {
    for (task in taskName) {
      taskName[task].taskName = task;
      checkAndUpdateTask(taskName[task], taskName[task].taskProgress);
    }
  });
}

function emptyAddTask() {
  endDate.value = "";
  todoPriority.value = "";
  taskDescription.value = "";
  endDate.disabled = false;
}

async function seperateAndCreateTaskCard() {
  let taskDetails = await getAllUserTasks();
  writeUserTask(taskDetails);
}

seperateAndCreateTaskCard();

function checkAndUpdateTask(taskDetails, taskProgress, filterView) {
  let i = 0;
  let message = "";
  let taskCard;
  switch (taskProgress) {
    case "New":
      message = "New Query";
      taskCard = createAndUpdateTaskCard(taskDetails, message, "#f9e79f");
      todoBucket.innerHTML += taskCard;
      todoBucket.scrollTop -= todoBucket.scrollHeight;
      break;
    case "Completed":
      message = "Completed";
      taskCard = createAndUpdateTaskCard(taskDetails, message, "#addfad");
      completedTask.innerHTML += taskCard;
      completedTask.scrollTop -= completedTask.scrollHeight;
      break;
    case "Inprogress":
      message = "Assigned";
      taskCard = createAndUpdateTaskCard(taskDetails, message, "#fadbd8");
      inProgressBucket.innerHTML += taskCard;
      inProgressBucket.scrollTop -= inProgressBucket.scrollHeight;
      break;
  }
}

function createAndUpdateTaskCard(taskDetails, message, color) {
  let taskCard = `<div class="task-cards" id="task-cards-${count}" draggable="true" onclick="viewTaskCard(event,taskname${count},${count})" ondragstart="dragStarted(event,'task-cards-${count}')">
    <div class="task-heading">
      <div class="task-name">
        <button
          aria-label="Change Progress"
          data-cooltipz-dir="top"
          class="tick-button"
          onclick="showTaskProgress(event,'dropdown-content-${count}')"
        >
          <i class="bi bi-check-circle tick-icon" id="change-task-progress"></i>
        </button>
        <div class="dropdown-content" id="dropdown-content-${count}">
           <p id="change-inprogress-task" onclick="changeTaskProgress('Inprogress',taskname${count},'task-cards-${count}','dropdown-content-${count}')">Assigned</p>
           <p id="change-completed-task" onclick="changeTaskProgress('Completed',taskname${count},'task-cards-${count}','dropdown-content-${count}')">Completed</p>
        </div>
       <span id="taskname${count}">${taskDetails.taskName}</span>
      </div>
      <div
        class="delete-container"
        aria-label="Delete Task"
        data-cooltipz-dir="top"
        id="delete-tasks"
        onclick="deleteTask(event,taskname${count})"
      >
        <i class="bi bi-trash delete-icon"></i>
      </div>
    </div>
    <div class="task-counter">
    <div class="task-progress ${taskDetails.priority.toLowerCase()}-priority" title="Query type">${
    taskDetails.priority
  }</div>
      <div class="task-deadlines">
        <div class="start-date" title="Raised User">${
          taskDetails.user.split("@")[0]
        }</div>
        <div class="seperator">-</div>
        <div class="due-date" title="Query Description">${
          taskDetails.description
        }</div>
      </div>
      <div class="days-count" title="Task Progress" style="background:${color}">
        <div class="progress-message">&nbsp;${message}</div>
      </div>
    </div>
  </div>`;
  count++;
  return taskCard;
}

async function viewTaskCard(event, taskName, count) {
  if (
    event.target.id !== "change-task-progress" &&
    event.target.id !== "change-todo-task" &&
    event.target.id !== "change-inprogress-task" &&
    event.target.id !== "change-completed-task"
  ) {
    let validateTaskName, taskProgress;
    document
      .getElementById(`dropdown-content-${count}`)
      .classList.remove("display-profile");
    let taskDetails = await getAllUserTasks();
    Object.values(taskDetails).forEach((tasks) => {
      Object.values(tasks).forEach((task) => {
        Object.entries(task).forEach((taskData, taskDetail) => {
          if (taskData[0] === taskName.innerHTML) {
            validateTaskName = taskData[1];
          }
        });
      });
    });
    viewUsername.innerHTML = validateTaskName.user.split("@")[0];
    viewUserAddress.innerHTML = validateTaskName.address;
    viewTaskName.innerHTML = taskName.innerHTML;
    viewTaskDescription.innerHTML = validateTaskName.description;
    viewPriority.innerHTML = validateTaskName.priority;
    if (validateTaskName.taskProgress === "New") {
      taskProgress = "Not Assigned";
    } else if (validateTaskName.taskProgress === "Inprogress") {
      taskProgress = "Assigned";
    } else {
      taskProgress = "Completed";
    }
    viewTaskProgress.innerHTML = taskProgress;
    console.log(validateTaskName.priority);
    switch (validateTaskName.priority) {
      case "Hardware":
        viewPriority.style.color = "black";
        viewPriority.style.backgroundColor = "#faa0a0";
        break;
      case "Software":
        viewPriority.style.backgroundColor = "#fffec8";
        break;
      case "Other":
        viewPriority.style.backgroundColor = "#90ee90";
        break;
    }
    closeViewTaskModal();
  }
}

function deleteTask(event, taskName) {
  if (event.target.id != "delete-tasks") {
    viewModal.classList.toggle("show-modal");
    deleteTaskCard = taskName;
    deleteTaskName.innerHTML = `You won't be able to revert this Query <br><br><span class="delete-task-name">Query : ${deleteTaskCard.innerHTML}<span><br>`;
    exitWindow.classList.toggle("show-modal");
  }
}

function showTaskProgress(event, dropdownId) {
  if (event.target.id === "change-task-progress") {
    document.getElementById(dropdownId).classList.toggle("display-profile");
  }
}

async function changeTaskProgress(
  newProgress,
  taskNameId,
  taskCardId,
  dropdownId
) {
  document.getElementById(dropdownId).classList.remove("display-profile");
  let taskDetails = await getAllUserTasks();
  let validateTaskName;
  Object.values(taskDetails).forEach((tasks) => {
    Object.values(tasks).forEach((task) => {
      Object.entries(task).forEach((taskData, taskDetail) => {
        if (taskData[0] === taskName.innerHTML) {
          validateTaskName = taskData[1];
        }
      });
    });
  });
  console.log(validateTaskName.user);
  let getTaskDetail = await getSingleTask(
    validateTaskName.user,
    taskNameId.innerHTML
  );
  getTaskDetail.taskDetails.taskName = taskNameId.innerHTML;
  getTaskDetail.taskDetails.useremail = validateTaskName.user;
  switch (newProgress) {
    case "Completed":
      if (getTaskDetail.taskDetails.taskProgress != "Completed") {
        getTaskDetail.taskDetails.taskProgress = "Completed";
        checkAndUpdateTask(getTaskDetail.taskDetails, "Completed");
        editAndUpdateTaskDetails({
          oldTaskName: taskNameId.innerHTML,
          loginEmail: validateTaskName.user,
          taskDetails: getTaskDetail.taskDetails,
        });
        document.getElementById(taskCardId).remove();
      }
      break;
    case "New":
      if (getTaskDetail.taskDetails.taskProgress != "New") {
        getTaskDetail.taskDetails.taskProgress = "New";
        checkAndUpdateTask(getTaskDetail.taskDetails, "New");
        editAndUpdateTaskDetails({
          oldTaskName: taskNameId.innerHTML,
          loginEmail: validateTaskName.user,
          taskDetails: getTaskDetail.taskDetails,
        });
        document.getElementById(taskCardId).remove();
      }
      break;
    case "Inprogress":
      if (getTaskDetail.taskDetails.taskProgress != "Inprogress") {
        getTaskDetail.taskDetails.taskProgress = "Inprogress";
        checkAndUpdateTask(getTaskDetail.taskDetails, "Inprogress");
        editAndUpdateTaskDetails({
          oldTaskName: taskNameId.innerHTML,
          loginEmail: validateTaskName.user,
          taskDetails: getTaskDetail.taskDetails,
        });
        document.getElementById(taskCardId).remove();
      }
      break;
  }
}

async function confirmDeleteTask() {
  let taskDetails = await getAllUserTasks();
  let validateTaskName;
  Object.values(taskDetails).forEach((tasks) => {
    Object.values(tasks).forEach((task) => {
      Object.entries(task).forEach((taskData, taskDetail) => {
        if (taskData[0] === deleteTaskCard.innerHTML) {
          validateTaskName = taskData[1];
        }
      });
    });
  });
  let deletedConfirmation = document.getElementById("deleted-message");
  deleteAndRemoveTaskName(deleteTaskCard.innerHTML, validateTaskName.user);
  deleteTaskCard.parentNode.parentNode.parentNode.remove();
  deletedConfirmation.innerHTML = ` Task ${deleteTaskCard.innerHTML} Deleted Succesfully`;
  dashboardSnackbar.classList.add("login-snackbar");
  setTimeout(function () {
    dashboardSnackbar.classList.remove("login-snackbar");
  }, 4000);
  confirmCancelButton.click();
}

function editViewTaskModal() {
  closeViewTaskModal();
  updateTaskCard();
}

function updateTaskCard() {
  updateTaskModal.classList.add("show-modal");

  updateTaskName.value = viewTaskName.innerHTML;
  updatePriority.value = viewPriority.innerHTML;
  updateTaskProgress.value = viewTaskProgress.innerHTML;
  updateAddress.value = viewUserAddress.innerHTML;
  updateDescription.value = viewTaskDescription.innerHTML;
}

async function confirmUpdateTask() {
  if (updateTaskProgress.value.length === 0) {
    updateTaskProgress.setCustomValidity("Select Task Progress");
    updateTaskProgress.reportValidity();
  } else {
    let taskDetails = {
      taskName: updateTaskName.value,
      priority: updatePriority.value,
      description: updateDescription.value,
      address: updateAddress.value,
      useremail: viewUsername.innerHTML + "@gmail.com",
      taskProgress: updateTaskProgress.value,
    };
    todoBucket.replaceChildren();
    completedTask.replaceChildren();
    inProgressBucket.replaceChildren();
    await editAndUpdateTaskDetails({
      oldTaskName: viewTaskName.innerHTML,
      loginEmail: viewUsername.innerHTML + "@gmail.com",
      taskDetails: taskDetails,
    });
    seperateAndCreateTaskCard();
    cancelUpdateButton.click();
    updatedSnackbar.classList.add("login-snackbar");
    setTimeout(function () {
      updatedSnackbar.classList.remove("login-snackbar");
    }, 7000);
  }
}

function closeDeleteConfirmation() {
  exitWindow.classList.toggle("show-modal");
}

function closeDeletedSnackbar() {
  dashboardSnackbar.classList.remove("login-snackbar");
}

function closeViewTaskModal() {
  viewModal.classList.toggle("show-modal");
}

function closeUpdateTaskModal() {
  updateTaskModal.classList.toggle("show-modal");
}

function updatedCloseSnackBar() {
  updatedSnackbar.classList.remove("login-snackbar");
}

// Event Listeners

closeButton.addEventListener("click", () => toggleModal("Empty"));
window.addEventListener("click", windowOnClick);
deletedSnackBar.addEventListener("click", closeDeletedSnackbar);
closeViewModal.addEventListener("click", closeViewTaskModal);
closeViewButton.addEventListener("click", closeViewTaskModal);
editViewModal.addEventListener("click", editViewTaskModal);
closeUpdateButton.addEventListener("click", closeUpdateTaskModal);
cancelUpdateButton.addEventListener("click", closeUpdateTaskModal);
confirmUpdate.addEventListener("click", confirmUpdateTask);
updatedSnackbarClose.addEventListener("click", updatedCloseSnackBar);
closeDeleteModal.addEventListener("click", closeDeleteConfirmation);
