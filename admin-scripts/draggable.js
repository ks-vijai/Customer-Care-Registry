function draggableCards() {
  let taskCards = document.getElementsByClassName("task-cards");
  for (let i = 0; i < taskCards.length; i++) {
    let c = 0;
    let cardItem = taskCards[i];

    cardItem.addEventListener("dragend", () => {
      setTimeout(() => {
        cardItem.classList.remove("hide-cards");
      }, 0);
    });
  }
}

function dragStarted(e, id) {
  e.dataTransfer.setData("text/plain", id);
  setTimeout(() => {
    document.getElementById(id).classList.add("hide-cards");
  }, 0);
}

function placeable() {
  let todoCards = document.getElementsByClassName("todo-cards");
  for (let j = 0; j < todoCards.length; j++) {
    let bucketItem = todoCards[j];

    bucketItem.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    bucketItem.addEventListener("dragenter", (e) => {
      e.preventDefault();
    });

    bucketItem.addEventListener("drop", async (e) => {
      e.preventDefault();
      let id = e.dataTransfer.getData("text/plain");
      let draggable = document.getElementById(id);
      let idOfCard = id.replace(/\D/g, "");
      idOfCard = document.getElementById(`taskname${idOfCard}`).innerHTML;
      let taskDetails = await getAllUserTasks();
      let validateTaskName;
      Object.values(taskDetails).forEach((tasks) => {
        Object.values(tasks).forEach((task) => {
          Object.entries(task).forEach((taskData, taskDetail) => {
            if (taskData[0] === idOfCard) {
              validateTaskName = taskData[1];
            }
          });
        });
        console.log(idOfCard);
      });
      let getTaskDetail = await getSingleTask(validateTaskName.user, idOfCard);
      getTaskDetail.taskDetails.taskName = idOfCard;
      getTaskDetail.taskDetails.useremail = validateTaskName.user;
      switch (bucketItem.id.split("-")[0]) {
        case "completed":
          getTaskDetail.taskDetails.taskProgress = "Completed";
          checkAndUpdateTask(getTaskDetail.taskDetails, "Completed");
          break;
        case "todo":
          getTaskDetail.taskDetails.taskProgress = "New";
          checkAndUpdateTask(getTaskDetail.taskDetails, "New");
          break;
        case "inprogress":
          getTaskDetail.taskDetails.taskProgress = "Inprogress";
          checkAndUpdateTask(getTaskDetail.taskDetails, "Inprogress");
          break;
      }

      editAndUpdateTaskDetails({
        oldTaskName: idOfCard,
        loginEmail: validateTaskName.user,
        taskDetails: getTaskDetail.taskDetails,
      });
      draggable.remove();
    });
  }
}
