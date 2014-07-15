var EditTaskItem = function(id)
{
	view().setTaskDetails(taskContext().getTaskById(id));
};

var DeleteTaskItem = function(id)
{
	alert("Do you wish to delete the task???");
}

function view() {
	var grid = {
		header : "<tr><th>Task Description</th><th>Due Date</th><th>Focus Area</th><th>Action</th></tr>",
		row : function(task) {
			var row = "<tr><td>" + task.description + "</td>";
			row += "<td>" + task.dueDate + "</td>";
			row += "<td>" + task.area + "</td>";
			row += "<td><a href='#' onclick=EditTaskItem(" + task.id + ")>Edit</a>";
			row += "  <a href='#' onclick=DeleteTaskItem(" + task.id + ")>Delete</a></td>"
			row += "</tr>";

			return row;
		}
	};
	var clear = function() {
		document.getElementById('Id').innerHTML = "";
		document.getElementById('desc').value = "";
		document.getElementById('area').value = "";
		document.getElementById('dueDate').value = "";
	};
	var readTaskDetails = function() {
		var taskId = document.getElementById('Id');
		var taskDescription = document.getElementById('desc');
		var	area = document.getElementById('area');
		var	dueDate = document.getElementById('dueDate');

		var task = new TaskModel(taskDescription.value, area.value, dueDate.value);
		if (taskId.innerHTML !== null || taskId.innerHTML !== undefined) {
			task.id = taskId.innerHTML;
		}

		return task;
	};
	var setTaskDetails = function(task) {
		var taskId = document.getElementById('Id');
		var taskDescription = document.getElementById('desc');
		var	area = document.getElementById('area');
		var	dueDate = document.getElementById('dueDate');

		taskId.innerHTML = Number(task.id);
		taskDescription.value = task.description;
		area.value = task.area;
		dueDate.value = task.dueDate;
	};
	var displayTaskGrid = function(tasks)
	{
		var taskTbl = document.getElementById('taskGrid');
		taskTbl.innerHTML = grid.header;

		for(var task in tasks) {
			var row = grid.row(tasks[task]);
			taskTbl.innerHTML += row;
		}
	};
	displaySuccessOrFailure = function(msg)
	{
		document.getElementById('msgArea').innerHTML = msg;
	};
	
	return {
		clear : clear,
		displayTaskGrid : displayTaskGrid,
		readTaskDetails : readTaskDetails,
		setTaskDetails : setTaskDetails,
		displaySuccessOrFailure : displaySuccessOrFailure
	};	
}

function TaskModel (description, area, dt)
{
	this.description = description;
	this.area = area;
	this.dueDate = dt;
}

TaskModel.prototype.generateId = function()
{
	this.id = taskContext().getNextId();
}

TaskModel.prototype.save = function()
{
	//Save the task to a local storage
	var task = {
		id : this.id,
		description : this.description,
		area : this.area,
		dueDate : this.dueDate
	};

	if (task.id === null || task.id === "") {
		taskContext().insert(task);
	}
	else
	{
		taskContext().update(task);
	}
}

var taskController= function() {
	return {
		processTask : function() {
			var task = view().readTaskDetails();
			task.save();
			view().displaySuccessOrFailure("Task created/updated successfully");
			view().clear();
		},
		displayTaskGrid : function() {
			view().displayTaskGrid(taskContext().getAllTasks());
		}
	};
}

window.onload = init;

function init() 
{
	var save = document.getElementById('save');
	taskContext().identityInitializer('maxId');
	taskController().displayTaskGrid();
	save.onclick = saveTask;
}

function saveTask()
{
	taskController().processTask();
	taskController().displayTaskGrid();
}

function taskContext()
{
	var tasks = [];
		
	var getNextId = function()
	{
		var id = getItem('maxId');
		if(id === undefined || id === null)
		{
			return 1;
		}
		else
		{
			return Number(id) + 1;
		}
	};
	var getItem = function(key)
	{
		return localStorage.getItem(key);	
	};
	var setItem = function(key, value)
	{
		localStorage.setItem(key, value);
	};
	var ifTasksExist = function() {
		tasks = getAllTasks();
		if( tasks === null || tasks === undefined)
		{
			tasks = [];
		}	

		return tasks;
	};	
	var insertToLocalStorage = function(task)
	{
		tasks = ifTasksExist();
		task.id = getNextId();
		tasks.push(task);
		setItem('task', JSON.stringify(tasks));
		setItem('maxId', task.id);
	};
	var updateToLocalStorage = function(task)
	{
		tasks = ifTasksExist();
		task.id = Number(task.id);
		tasks[task.id-1] = task;
		setItem('task', JSON.stringify(tasks));
	};
	var deleteFromLocalStorage = function(task)
	{
		alert("Delete called....")
	};
	var getAllTasks = function()
	{
		tasks = JSON.parse(getItem('task'));
		return tasks;
	};
	var getTaskById = function(id)
	{
		tasks = ifTasksExist();
		for(var task in tasks)
		{
			if(tasks[task].id === id)
			{
				return tasks[task];
			}
		}

		return [];	
	};
	var identityInitializer = function(key)
	{
		var id = getItem(key);
		if(id === null || id === undefined )
		{
			setItem(key,0);
		}
	};

	return {
		insert : insertToLocalStorage,
		update : updateToLocalStorage,
		delete : deleteFromLocalStorage,
		identityInitializer : identityInitializer,
		getAllTasks : getAllTasks,
		getTaskById : getTaskById
	};
}

