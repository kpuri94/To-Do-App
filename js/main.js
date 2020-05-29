var tasks = [];
let mode = null;

$(document).ready(() => {
  var previousTasks = localStorage.getItem("tasks");
  if (previousTasks) {
    tasks = JSON.parse(previousTasks);
  }
  bindTasks();
});

$('#taskModal').on('hidden.bs.modal', () => {
  $("#taskForm").trigger("reset");
});

const openModel = title => {
  $("#taskModalTitle").text(title);
  $("#taskModalUpdateBtn").text(title);

  $("#taskModal").modal("show");
  setTimeout(() => $("#taskTitle").focus(), 500);
};

const openAddTask = () => {
  mode = { name: "add", id: null };
  openModel("Add New");
};

const updateTasksInLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const updateTask = event => {
  event.preventDefault();

  const title = $("#taskTitle").val();
  const deadline = $("#taskDeadline").val();
  const priority = $("#taskPriority").val();

  $("#taskModal").modal("hide");

  if (mode.name === "add") {
    const task = { id: Date.now(), title, deadline, priority };
    tasks.unshift(task);
    $("#listOfTasks").prepend(generateTaskElementRow(task));
  } else if (mode.name === "edit") {
    const task = tasks.find(x => x.id === mode.id);
    task.title = title;
    task.deadline = deadline;
    task.priority = priority;
    $(`#${mode.id}`).html(generateTaskElementData(task));
  }

  updateTasksInLocalStorage();
};

const generateTaskElementData = task => {
  return `
    <td>${task.title}</td>
    <td>${task.deadline}</td>
    <td>${task.priority}</td>
    <td>
      <button class="btn btn-warning" onclick="editTask(${task.id})">Edit</button>
      <button class="btn btn-danger" onclick="deleteTask(${task.id})">Delete</button>
    </td>
  `;
};

const generateTaskElementRow = task => {
  return `
    <tr id="${task.id}">
      ${generateTaskElementData(task)}
    </tr>
  `;
};

const bindTasks = () => {
  tasks.forEach(task => {
    $("#listOfTasks").append(generateTaskElementRow(task));
  });
};

const editTask = id => {
  const task = tasks.find(x => x.id === id);
  $("#taskTitle").val(task.title);
  $("#taskDeadline").val(task.deadline);
  $("#taskPriority").val(task.priority);
  openModel("Edit");
  mode = { name: "edit", id };
};

const deleteTask = id => {
  $(`#${id}`).remove();
  const taskIndex = tasks.findIndex(x => x.id === id);
  tasks.splice(taskIndex, 1);
  updateTasksInLocalStorage();
};
