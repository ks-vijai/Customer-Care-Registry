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
var address = document.getElementById("address");
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
let viewAddress = document.getElementById("view-adddress");

let updateAddress = document.getElementById("edit-address");
let updateTaskName = document.getElementById("edit-task-name");
let updateStartDate = document.getElementById("edit-start-date");
let updateDueDate = document.getElementById("edit-end-date");
let updatePriority = document.getElementById("edit-priority");
let updateTaskProgress = document.getElementById("edit-progress");
let updateDescription = document.getElementById("edit-description");

var todayDate = new Date().toISOString().split("T")[0];
var progressOfTask = "Not Assigned";
var deleteTaskCard;

let count = 0;

function toggleModal(taskProgress) {
  progressOfTask = taskProgress;
  todoPriority.value = "";
  modal.classList.toggle("show-modal");
}

function checkForStartDate() {
  if (startDate.value === "") {
    endDate.disabled = true;
    startDate.setCustomValidity("Please Select Start Date");
    startDate.reportValidity();
  } else {
    endDate.disabled = false;
  }
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
    emptyAddTask();
  }
}

async function validateNewTask() {
  if (taskName.value.length === 0) {
    taskName.setCustomValidity("Enter valid Query Name");
    taskName.reportValidity();
  } else {
    if (todoPriority.value.length === 0) {
      todoPriority.setCustomValidity("Select Type");
      todoPriority.reportValidity();
    } else {
      if (taskDescription.value.length === 0) {
        taskDescription.setCustomValidity("Enter valid Description");
        taskDescription.reportValidity();
      } else {
        let validateTaskName = await validateTask({
          taskName: taskName.value,
          useremail: loginUseremail.value.toLowerCase(),
        });
        if (validateTaskName.valid) {
          taskSnackbar.innerHTML = `Query ${taskName.value} already exists`;
          taskSnackbar.classList.add("show-snackbar-error");
          setTimeout(function () {
            taskSnackbar.classList.remove("show-snackbar-error");
          }, 5000);
        } else {
          let taskDetails = {
            taskName: taskName.value,
            priority: todoPriority.value,
            address: address.value,
            description: taskDescription.value,
            useremail: loginUseremail.value.toLowerCase(),
            taskProgress: progressOfTask,
          };
          seperateAndCreateTaskCard(taskDetails);
          closeButton.click();
          emptyAddTask();
        }
      }
    }
  }
}

function writeUserTask(userTasks) {
  let taskNames = Object.keys(userTasks.taskDetails);
  taskNames.forEach((taskName) => {
    userTasks.taskDetails[taskName].taskName = taskName;
    checkAndUpdateTask(
      userTasks.taskDetails[taskName],
      userTasks.taskDetails[taskName].taskProgress
    );
  });
}

function emptyAddTask() {
  taskName.value = "";
  address.value = "";
  todoPriority.value = "";
  taskDescription.value = "";
}

function seperateAndCreateTaskCard(taskDetails) {
  writeNewTask(taskDetails);
  checkAndUpdateTask(taskDetails, progressOfTask);
}

function checkAndUpdateTask(taskDetails, taskProgress, filterView) {
  let i = 0;
  let message = "";
  let taskCard, color;
  message = "- Days to Start";
  if (taskProgress === "New") {
    message = "Not Assigned";
    color = "#f9e79f";
  } else if (taskProgress === "Inprogress") {
    message = `Assigned to Agent : ${taskDetails.agentName}`;
    color = "#fadbd8";
  } else {
    message = "Query Solved";
    color = "#addfad";
  }
  taskCard = createAndUpdateTaskCard(taskDetails, message, color);
  todoBucket.innerHTML += taskCard;
  todoBucket.scrollTop -= todoBucket.scrollHeight;
}

function createAndUpdateTaskCard(taskDetails, message, color) {
  let taskCard = `<div class="task-cards" id="task-cards-${count}" onclick="viewTaskCard(event,taskname${count},${count})">
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
           <p id="change-todo-task" onclick="changeTaskProgress('New',taskname${count},'task-cards-${count}','dropdown-content-${count}')">Reset to Start</p>
           <p id="change-completed-task" onclick="changeTaskProgress('Completed',taskname${count},'task-cards-${count}','dropdown-content-${count}')">Mark as Completed</p>
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
        <i class="bi bi-trash delete-icon" id="delete-tasks-1"></i>
      </div>
    </div>
    <div class="task-counter">
    <div class="task-progress ${taskDetails.priority.toLowerCase()}-priority" title="Issue Type">${
    taskDetails.priority
  }</div>
      <div class="task-deadlines">
        <div class="due-date" title="Query Description">Description : ${
          taskDetails.description
        }</div>
        <div class="seperator"></div>
        <div class="start-date" title="Query Address">Address : ${
          taskDetails.address
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
    event.target.id !== "change-completed-task" &&
    event.target.id !== "delete-tasks" &&
    event.target.id !== "delete-tasks-1"
  ) {
    document
      .getElementById(`dropdown-content-${count}`)
      .classList.remove("display-profile");
    let validateTaskName = await validateTask({
      taskName: taskName.innerHTML,
      useremail: loginUseremail.value.toLowerCase(),
    });

    viewTaskName.innerHTML = taskName.innerHTML;
    viewTaskDescription.innerHTML = validateTaskName.taskDetails.description;
    viewPriority.innerHTML = validateTaskName.taskDetails.priority;
    viewAddress.innerHTML = validateTaskName.taskDetails.address;
    viewTaskProgress.innerHTML = validateTaskName.taskDetails.taskProgress;

    switch (validateTaskName.taskDetails.priority) {
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
  deleteTaskCard = taskName;
  deleteTaskName.innerHTML = `You won't be able to revert this Query <br><br><span class="delete-task-name">Query Name: ${deleteTaskCard.innerHTML}<span><br>`;
  exitWindow.classList.toggle("show-modal");
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
  let getTaskDetail = await getSingleTask(
    loginUseremail.value.toLowerCase(),
    taskNameId.innerHTML
  );
  getTaskDetail.taskDetails.taskName = taskNameId.innerHTML;
  getTaskDetail.taskDetails.useremail = loginUseremail.value.toLowerCase();
  switch (newProgress) {
    case "Completed":
      if (getTaskDetail.taskDetails.taskProgress != "Completed") {
        getTaskDetail.taskDetails.taskProgress = "Completed";
        checkAndUpdateTask(getTaskDetail.taskDetails, "Completed");
        editAndUpdateTaskDetails({
          oldTaskName: taskNameId.innerHTML,
          loginEmail: loginUseremail.value.toLowerCase(),
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
          loginEmail: loginUseremail.value.toLowerCase(),
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
          loginEmail: loginUseremail.value.toLowerCase(),
          taskDetails: getTaskDetail.taskDetails,
        });
        document.getElementById(taskCardId).remove();
      }
      break;
  }
}

function confirmDeleteTask() {
  let deletedConfirmation = document.getElementById("deleted-message");
  deleteAndRemoveTaskName(
    deleteTaskCard.innerHTML,
    loginUseremail.value.toLowerCase()
  );
  deleteTaskCard.parentNode.parentNode.parentNode.remove();
  deletedConfirmation.innerHTML = ` Query ${deleteTaskCard.innerHTML} Deleted Succesfully`;
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
  updateAddress.value = viewAddress.innerHTML;
  updateTaskProgress.value = viewTaskProgress.innerHTML;
  updateDescription.value = viewTaskDescription.innerHTML;
}

async function confirmUpdateTask() {
  if (updateTaskName.value.length === 0) {
    updateTaskName.setCustomValidity("Enter valid Query Name");
    updateTaskName.reportValidity();
  } else {
    let taskDetails = {
      taskName: updateTaskName.value,
      priority: updatePriority.value,
      description: updateDescription.value,
      address: updateAddress.value,
      useremail: loginUseremail.value.toLowerCase(),
      taskProgress: updateTaskProgress.value,
    };
    todoBucket.replaceChildren();
    let newTaskDetails = await editAndUpdateTaskDetails({
      oldTaskName: viewTaskName.innerHTML,
      loginEmail: loginUseremail.value.toLowerCase(),
      taskDetails: taskDetails,
    });
    writeUserTask(newTaskDetails);
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

addTask.addEventListener("click", validateNewTask);
todoAdd.addEventListener("click", () => toggleModal("New"));
closeButton.addEventListener("click", () => toggleModal("Empty"));
window.addEventListener("click", windowOnClick);
cancelButton.addEventListener("click", () => toggleModal("Empty"));
deletedSnackBar.addEventListener("click", closeDeletedSnackbar);
closeViewModal.addEventListener("click", closeViewTaskModal);
closeViewButton.addEventListener("click", closeViewTaskModal);
editViewModal.addEventListener("click", editViewTaskModal);
closeUpdateButton.addEventListener("click", closeUpdateTaskModal);
cancelUpdateButton.addEventListener("click", closeUpdateTaskModal);
confirmUpdate.addEventListener("click", confirmUpdateTask);
updatedSnackbarClose.addEventListener("click", updatedCloseSnackBar);
closeDeleteModal.addEventListener("click", closeDeleteConfirmation);
