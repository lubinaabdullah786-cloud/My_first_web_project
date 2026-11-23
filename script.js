/* ==============================
   LIFESYNC - JAVASCRIPT
================================ */

// Get HTML elements

const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("taskDate");

const taskList = document.getElementById("taskList");

const goalForm = document.getElementById("goalForm");
const goalName = document.getElementById("goalName");
const goalList = document.getElementById("goalList");

const habitList = document.getElementById("habitList");

const examForm = document.getElementById("examForm");
const examName = document.getElementById("examName");
const examDate = document.getElementById("examDate");
const examDisplay = document.getElementById("examDisplay");

const balanceChecks = document.querySelectorAll(".balance-check");


// ==============================
// DATA STORAGE
// ==============================

function loadData(key, defaultValue) {

    const savedData = localStorage.getItem(key);

    if (savedData) {
        return JSON.parse(savedData);
    }

    return defaultValue;
}


let tasks = loadData("lifeSyncTasks", []);

let goals = loadData("lifeSyncGoals", []);

let exam = loadData("lifeSyncExam", null);


// Habits

const defaultHabits = [
    "Drink enough water",
    "Study for 30 minutes",
    "Exercise or walk",
    "Read something"
];

let habits = loadData("lifeSyncHabits", defaultHabits);

let completedHabits = loadData("lifeSyncCompletedHabits", []);


// Life balance

let balanceData = loadData("lifeSyncBalance", [false, false, false, false]);


// ==============================
// SAVE DATA
// ==============================

function saveTasks() {
    localStorage.setItem(
        "lifeSyncTasks",
        JSON.stringify(tasks)
    );
}

function saveGoals() {
    localStorage.setItem(
        "lifeSyncGoals",
        JSON.stringify(goals)
    );
}

function saveHabits() {
    localStorage.setItem(
        "lifeSyncHabits",
        JSON.stringify(habits)
    );

    localStorage.setItem(
        "lifeSyncCompletedHabits",
        JSON.stringify(completedHabits)
    );
}

function saveExam() {
    localStorage.setItem(
        "lifeSyncExam",
        JSON.stringify(exam)
    );
}

function saveBalance() {
    localStorage.setItem(
        "lifeSyncBalance",
        JSON.stringify(balanceData)
    );
}


// ==============================
// DATE AND GREETING
// ==============================

const today = new Date();

document.getElementById("currentDate").textContent =
    today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });


const hour = today.getHours();

let greeting = "Welcome!";

if (hour < 12) {
    greeting = "Good morning! ☀️";
} else if (hour < 17) {
    greeting = "Good afternoon! 🌤️";
} else {
    greeting = "Good evening! 🌙";
}

document.getElementById("greeting").textContent = greeting;


// ==============================
// TASK MANAGEMENT
// ==============================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const task = {
        id: Date.now(),
        name: taskName.value.trim(),
        category: taskCategory.value,
        priority: taskPriority.value,
        date: taskDate.value,
        completed: false
    };

    if (task.name === "") {
        return;
    }

    tasks.push(task);

    saveTasks();

    taskForm.reset();

    renderTasks();

    updateStats();

});


function renderTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        taskList.innerHTML =
            "<p>No tasks yet. Add your first task!</p>";

        return;
    }


    tasks.forEach(function(task) {

        const taskItem = document.createElement("div");

        taskItem.className = "task-item";


        const left = document.createElement("div");

        left.className = "task-left";


        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = task.completed;


        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();

            renderTasks();

            updateStats();

        });


        const details = document.createElement("div");


        const name = document.createElement("div");

        name.className = "task-name";

        if (task.completed) {
            name.classList.add("completed");
        }

        name.textContent = task.name;


        const info = document.createElement("div");

        info.className = "task-info";

        info.textContent =
            task.category +
            " | " +
            (task.date || "No deadline");


        details.appendChild(name);

        details.appendChild(info);


        left.appendChild(checkbox);

        left.appendChild(details);


        const right = document.createElement("div");


        const priority = document.createElement("span");

        priority.className = "priority " + task.priority;

        priority.textContent = task.priority;


        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-button";

        deleteButton.textContent = "Delete";


        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();

            renderTasks();

            updateStats();

        });


        right.appendChild(priority);

        right.appendChild(deleteButton);


        taskItem.appendChild(left);

        taskItem.appendChild(right);


        taskList.appendChild(taskItem);

    });

}


// ==============================
// HABIT TRACKER
// ==============================

function renderHabits() {

    habitList.innerHTML = "";

    habits.forEach(function(habit, index) {

        const item = document.createElement("label");

        item.className = "habit-item";


        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = completedHabits.includes(index);


        const text = document.createElement("span");

        text.textContent = habit;


        if (checkbox.checked) {
            item.classList.add("habit-done");
        }


        checkbox.addEventListener("change", function() {

            if (checkbox.checked) {

                if (!completedHabits.includes(index)) {
                    completedHabits.push(index);
                }

            } else {

                completedHabits = completedHabits.filter(
                    function(item) {
                        return item !== index;
                    }
                );

            }

            saveHabits();

            renderHabits();

            updateStats();

        });


        item.appendChild(checkbox);

        item.appendChild(text);

        habitList.appendChild(item);

    });

}


// ==============================
// GOAL MANAGEMENT
// ==============================

goalForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const goal = {
        id: Date.now(),
        name: goalName.value.trim(),
        completed: false
    };

    if (goal.name === "") {
        return;
    }

    goals.push(goal);

    saveGoals();

    goalForm.reset();

    renderGoals();

    updateStats();

});


function renderGoals() {

    goalList.innerHTML = "";

    if (goals.length === 0) {

        goalList.innerHTML =
            "<p>No goals added yet. Create your first goal!</p>";

        return;
    }


    goals.forEach(function(goal) {

        const item = document.createElement("div");

        item.className = "goal-item";


        const left = document.createElement("div");


        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = goal.completed;


        const name = document.createElement("span");

        name.textContent = goal.name;

        if (goal.completed) {
            name.classList.add("goal-completed");
        }


        checkbox.addEventListener("change", function() {

            goal.completed = checkbox.checked;

            saveGoals();

            renderGoals();

            updateStats();

        });


        left.appendChild(checkbox);

        left.appendChild(name);


        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-button";

        deleteButton.textContent = "Delete";


        deleteButton.addEventListener("click", function() {

            goals = goals.filter(function(item) {
                return item.id !== goal.id;
            });

            saveGoals();

            renderGoals();

            updateStats();

        });


        item.appendChild(left);

        item.appendChild(deleteButton);

        goalList.appendChild(item);

    });

}


// ==============================
// EXAM COUNTDOWN
// ==============================

examForm.addEventListener("submit", function(event) {

    event.preventDefault();

    exam = {
        name: examName.value.trim(),
        date: examDate.value
    };

    saveExam();

    renderExam();

    examForm.reset();

});


function renderExam() {

    examDisplay.innerHTML = "";

    if (!exam) {

        examDisplay.innerHTML =
            "<p>No exam added yet. Add your exam date!</p>";

        return;
    }


    const examDay = new Date(exam.date + "T00:00:00");

    const currentDay = new Date();

    currentDay.setHours(0, 0, 0, 0);


    const difference =
        examDay.getTime() - currentDay.getTime();


    const daysRemaining =
        Math.ceil(difference / (1000 * 60 * 60 * 24));


    const display = document.createElement("div");

    display.className = "exam-display";


    const heading = document.createElement("h3");

    heading.textContent = exam.name;


    const days = document.createElement("div");

    days.className = "exam-days";


    const message = document.createElement("p");


    if (daysRemaining > 0) {

        days.textContent = daysRemaining + " Days";

        message.textContent = "Time to prepare! You can do this.";

    } else if (daysRemaining === 0) {

        days.textContent = "Today!";

        message.textContent = "Your exam is today. Best of luck!";

    } else {

        days.textContent = "Completed";

        message.textContent = "Your exam date has passed.";

    }


    const deleteButton = document.createElement("button");

    deleteButton.className = "delete-button";

    deleteButton.textContent = "Remove Exam";


    deleteButton.addEventListener("click", function() {

        exam = null;

        saveExam();

        renderExam();

    });


    display.appendChild(heading);

    display.appendChild(days);

    display.appendChild(message);

    display.appendChild(deleteButton);


    examDisplay.appendChild(display);

}


// ==============================
// LIFE BALANCE SCORE
// ==============================

balanceChecks.forEach(function(check, index) {

    check.checked = balanceData[index];


    check.addEventListener("change", function() {

        balanceData[index] = check.checked;

        saveBalance();

        updateBalanceScore();

    });

});


function updateBalanceScore() {

    const completed = balanceData.filter(Boolean).length;

    const score = Math.round(
        (completed / balanceData.length) * 100
    );


    document.getElementById("balanceScore").textContent =
        score + "%";


    const message = document.getElementById("balanceMessage");


    if (score === 0) {

        message.textContent =
            "Start your day by completing activities.";

    } else if (score === 25) {

        message.textContent =
            "Great start! Try making time for another area.";

    } else if (score === 50) {

        message.textContent =
            "You're building a balanced day!";

    } else if (score === 75) {

        message.textContent =
            "Wonderful! You're taking care of different areas.";

    } else {

        message.textContent =
            "Amazing! You've covered all four life areas today.";

    }

}


// ==============================
// STATISTICS
// ==============================

function updateStats() {

    document.getElementById("totalTasks").textContent =
        tasks.length;


    document.getElementById("completedTasks").textContent =
        tasks.filter(function(task) {
            return task.completed;
        }).length;


    document.getElementById("totalGoals").textContent =
        goals.length;


    document.getElementById("completedHabits").textContent =
        completedHabits.length;

}


// ==============================
// INITIAL RENDER
// ==============================

renderTasks();

renderGoals();

renderHabits();

renderExam();

updateStats();

updateBalanceScore();
