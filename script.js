const dayEl = document.querySelector(".day");
const dateEl = document.querySelector(".date");
const taskInputFormEl = document.querySelector(".task-input-container");
const taskInput = document.querySelector(".task-input-container input");
const tasksListContainer = document.querySelector(".tasks-list");

// Setting the date

const date = new Date();
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});
const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });

dateEl.innerHTML = dateFormatter.format(date);
dayEl.innerHTML = dayFormatter.format(date);

let tasksArr = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTaskElements(tasks) {
  tasks.forEach((task) => {
    const taskEl = `
        <li class="task-container">
          <div class="task-status ${
            task.completed ? "completed" : ""
          }" data-id="${task.id}">
          ${
            task.completed
              ? `<img src="./icons/tick.svg" alt="completed" />`
              : ""
          }
          </div>
          <div class="task">
            <p class="task-title">${task.title}</p>
            <button class="delete-btn" data-id= "${task.id}">
              <img src="./icons/cross.svg" alt="delete button" />
            </button>
          </div>
        </li>
        `;
    tasksListContainer.insertAdjacentHTML("afterbegin", taskEl);
  });

  document.querySelectorAll(".delete-btn").forEach((btnEl) => {
    btnEl.addEventListener("click", function (e) {
      const id = this.getAttribute("data-id");
      tasksArr = tasksArr.filter((task) => task.id !== id);
      localStorage.setItem("tasks", JSON.stringify(tasksArr));
      tasksListContainer.innerHTML = "";
      renderTaskElements(tasksArr);
    });
  });

  document.querySelectorAll(".task-status").forEach((checkmark) => {
    checkmark.addEventListener("click", function (event) {
      const completedTask = tasksArr.find(
        (el) => el.id === this.getAttribute("data-id")
      );
      completedTask.completed = !completedTask.completed;
      localStorage.setItem("tasks", JSON.stringify(tasksArr));
      tasksListContainer.innerHTML = "";
      renderTaskElements(tasksArr);
    });
  });
}

renderTaskElements(tasksArr);

taskInputFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = taskInput.value;
  taskInput.value = "";
  if (task.trim().length === 0) {
    return;
  }
  tasksArr.push({
    id: new Date().toISOString(),
    title: task,
    completed: false,
  });
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
  tasksListContainer.innerHTML = "";
  renderTaskElements(tasksArr);
});
