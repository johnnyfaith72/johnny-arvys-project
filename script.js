
// ============================================
// STUDENTPRO MANAGEMENT SYSTEM
// MAIN JAVASCRIPT FILE
// ============================================


// 1. SELECT HTML ELEMENTS

const studentForm = document.getElementById("studentForm");

const studentTable = document.getElementById("studentTable");

const searchInput = document.getElementById("searchInput");

const genderFilter = document.getElementById("genderFilter");

const levelFilter = document.getElementById("levelFilter");

const statusFilter = document.getElementById("statusFilter");

const submitBtn = document.getElementById("submitBtn");

const cancelEditBtn = document.getElementById("cancelEditBtn");


// 2. APPLICATION DATA

let students = [];

let editingId = null;

let activities = [];


// 3. LOAD SAVED STUDENT RECORDS

try {
    const savedStudents = JSON.parse(
        localStorage.getItem("studentProRecords") || "[]"
    );

    students = Array.isArray(savedStudents) ? savedStudents : [];

} catch (error) {

    console.error("Unable to load student records:", error);

    students = [];
}


// 4. LIVE CLOCK AND DATE

function updateClock() {

    const now = new Date();

    document.getElementById("liveClock").textContent =
        now.toLocaleTimeString("en-GB", {
            hour12: false
        });

    document.getElementById("currentDate").textContent =
        now.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

updateClock();

setInterval(updateClock, 1000);


// 5. SAVE DATA TO LOCAL STORAGE

function saveData() {

    localStorage.setItem(
        "studentProRecords",
        JSON.stringify(students)
    );
}


// 6. GET FORM INFORMATION

function getStudentData() {

    return {

        id: document.getElementById("studentId").value.trim(),

        name: document.getElementById("studentName").value.trim(),

        gender: document.getElementById("gender").value,

        dob: document.getElementById("dateOfBirth").value,

        phone: document.getElementById("phone").value.trim(),

        email: document.getElementById("email").value.trim(),

        state: document.getElementById("state").value.trim(),

        address: document.getElementById("address").value.trim(),

        department: document.getElementById("department").value.trim(),

        course: document.getElementById("course").value.trim(),

        level: document.getElementById("level").value,

        semester: document.getElementById("semester").value,

        admissionDate: document.getElementById("admissionDate").value,

        status: document.getElementById("studentStatus").value,

        guardian: document.getElementById("guardianName").value.trim(),

        guardianPhone: document.getElementById("guardianPhone").value.trim(),

        guardianEmail: document.getElementById("guardianEmail").value.trim(),

        relationship: document.getElementById("relationship").value,

        createdAt: new Date().toISOString()

    };

}


// 7. REGISTER OR UPDATE STUDENT

studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const student = getStudentData();


    // CHECK DUPLICATE REGISTRATION ID

    const duplicate = students.some(item =>
        item.id.toLowerCase() === student.id.toLowerCase() &&
        item.id !== editingId
    );

    if (duplicate) {

        alert("This student registration number already exists.");

        return;
    }


    // UPDATE EXISTING STUDENT

    if (editingId !== null) {

        const index = students.findIndex(
            item => item.id === editingId
        );

        if (index === -1) {

            alert("Student record could not be found.");

            cancelEdit();

            return;
        }

        student.createdAt = students[index].createdAt;

        students[index] = student;

        addActivity(
            "Student Information Updated",
            student.name + " record was successfully updated."
        );

        alert("Student information updated successfully!");

    }

    // REGISTER NEW STUDENT

    else {

        students.push(student);

        addActivity(
            "New Student Registered",
            student.name + " was added to the database."
        );

        alert("Student registered successfully!");

    }


    // SAVE AND REFRESH

    saveData();

    resetForm();

    refreshDashboard();

});


// 8. DISPLAY STUDENT RECORDS

function displayStudents(list = students) {

    studentTable.innerHTML = "";


    if (list.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 8;

        cell.className = "empty-message";

        cell.textContent = "No student records found.";

        row.appendChild(cell);

        studentTable.appendChild(row);

    }


    list.forEach(student => {

        const row = document.createElement("tr");


        const values = [
            student.id,
            student.name,
            student.gender,
            student.department,
            student.course,
            student.level
        ];


        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value || "N/A";

            row.appendChild(cell);

        });


        // STATUS CELL

        const statusCell = document.createElement("td");

        const statusBadge = document.createElement("span");

        statusBadge.className =
            "status-label status-" +
            student.status.toLowerCase();

        statusBadge.textContent = student.status;

        statusCell.appendChild(statusBadge);

        row.appendChild(statusCell);


        // ACTION BUTTONS

        const actionCell = document.createElement("td");


        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.className = "edit-btn";

        editButton.addEventListener("click", function() {

            editStudent(student.id);

        });


        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {

            deleteStudent(student.id);

        });


        actionCell.append(editButton, deleteButton);

        row.appendChild(actionCell);

        studentTable.appendChild(row);

    });


    document.getElementById("recordCount").textContent =
        "Showing " + list.length + " of " +
        students.length + " student records";

}


// 9. SEARCH AND FILTER STUDENTS

function filterStudents() {

    const search = searchInput.value.toLowerCase().trim();

    const gender = genderFilter.value;

    const level = levelFilter.value;

    const status = statusFilter.value;


    const filteredStudents = students.filter(student => {

        const matchesSearch = Object.values(student).some(value =>

            String(value || "").toLowerCase().includes(search)

        );

        const matchesGender =
            !gender || student.gender === gender;

        const matchesLevel =
            !level || student.level === level;

        const matchesStatus =
            !status || student.status === status;


        return (
            matchesSearch &&
            matchesGender &&
            matchesLevel &&
            matchesStatus
        );

    });


    displayStudents(filteredStudents);

}


searchInput.addEventListener("input", filterStudents);

genderFilter.addEventListener("change", filterStudents);

levelFilter.addEventListener("change", filterStudents);

statusFilter.addEventListener("change", filterStudents);


// 10. EDIT STUDENT INFORMATION

function editStudent(id) {

    const student = students.find(item => item.id === id);

    if (!student) return;


    editingId = id;


    document.getElementById("studentId").value = student.id;

    document.getElementById("studentName").value = student.name;

    document.getElementById("gender").value = student.gender;

    document.getElementById("dateOfBirth").value = student.dob;

    document.getElementById("phone").value = student.phone;

    document.getElementById("email").value = student.email;

    document.getElementById("state").value = student.state;

    document.getElementById("address").value = student.address;

    document.getElementById("department").value = student.department;

    document.getElementById("course").value = student.course;

    document.getElementById("level").value = student.level;

    document.getElementById("semester").value = student.semester;

    document.getElementById("admissionDate").value = student.admissionDate;

    document.getElementById("studentStatus").value = student.status;

    document.getElementById("guardianName").value = student.guardian;

    document.getElementById("guardianPhone").value = student.guardianPhone;

    document.getElementById("guardianEmail").value = student.guardianEmail;

    document.getElementById("relationship").value = student.relationship;


    document.getElementById("formHeading").textContent =
        "Update Student Information";

    submitBtn.textContent = "Save Changes";

    cancelEditBtn.hidden = false;

    document.getElementById("registration").scrollIntoView({
        behavior: "smooth"
    });

}


// 11. CANCEL EDITING

function cancelEdit() {

    editingId = null;

    resetForm();

}

cancelEditBtn.addEventListener("click", cancelEdit);


// 12. RESET FORM

function resetForm() {

    studentForm.reset();

    editingId = null;

    document.getElementById("formHeading").textContent =
        "Student Registration";

    submitBtn.textContent = "Register Student";

    cancelEditBtn.hidden = true;

}


// CLEAR BUTTON

document.getElementById("clearBtn").addEventListener("click", function() {

    editingId = null;

    resetForm();

});


// 13. DELETE STUDENT

function deleteStudent(id) {

    const student = students.find(item => item.id === id);

    if (!student) return;


    const confirmDelete = confirm(
        "Are you sure you want to delete " +
        student.name + "?"
    );


    if (!confirmDelete) return;


    students = students.filter(item => item.id !== id);


    if (editingId === id) {

        resetForm();

    }


    saveData();

    addActivity(
        "Student Record Deleted",
        student.name + " was removed from the database."
    );

    refreshDashboard();

    alert("Student record deleted successfully.");

}


// 14. UPDATE DASHBOARD STATISTICS

function updateStatistics() {

    const total = students.length;

    const male = students.filter(
        student => student.gender === "Male"
    ).length;

    const female = students.filter(
        student => student.gender === "Female"
    ).length;

    const active = students.filter(
        student => student.status === "Active"
    ).length;


    document.getElementById("totalStudents").textContent = total;

    document.getElementById("maleStudents").textContent = male;

    document.getElementById("femaleStudents").textContent = female;

    document.getElementById("activeStudents").textContent = active;


    // ANALYTICS PERCENTAGES

    const malePercent = total ? (male / total) * 100 : 0;

    const femalePercent = total ? (female / total) * 100 : 0;

    const activePercent = total ? (active / total) * 100 : 0;


    document.getElementById("maleProgress").style.width =
        malePercent + "%";

    document.getElementById("femaleProgress").style.width =
        femalePercent + "%";

    document.getElementById("activeProgress").style.width =
        activePercent + "%";


    document.getElementById("malePercentage").textContent =
        malePercent.toFixed(1) + "%";

    document.getElementById("femalePercentage").textContent =
        femalePercent.toFixed(1) + "%";

    document.getElementById("activePercentage").textContent =
        activePercent.toFixed(1) + "%";

}


// 15. ACTIVITY TRACKING

function addActivity(title, description) {

    const activity = {

        title: title,

        description: description,

        time: new Date().toLocaleTimeString()

    };


    activities.unshift(activity);

    activities = activities.slice(0, 8);


    displayActivities();

}


function displayActivities() {

    const activityList = document.getElementById("activityList");

    activityList.innerHTML = "";


    activities.forEach(activity => {

        const item = document.createElement("div");

        item.className = "activity-item";


        const dot = document.createElement("span");

        dot.className = "activity-dot";


        const content = document.createElement("div");

        const title = document.createElement("h4");

        const description = document.createElement("p");

        const time = document.createElement("p");


        title.textContent = activity.title;

        description.textContent = activity.description;

        time.textContent = "Time: " + activity.time;


        content.append(title, description, time);

        item.append(dot, content);

        activityList.appendChild(item);

    });

}


// 16. EXPORT STUDENT RECORDS TO CSV

document.getElementById("exportBtn").addEventListener("click", function() {

    if (students.length === 0) {

        alert("There are no student records to export.");

        return;

    }


    const headers = Object.keys(students[0]);


    const csvRows = students.map(student => {

        return headers.map(header => {

            const value = String(student[header] ?? "");

            return '"' + value.replace(/"/g, '""') + '"';

        }).join(",");

    });


    const csvContent = [
        headers.join(","),
        ...csvRows
    ].join("\r\n");


    const blob = new Blob(
        ["\uFEFF" + csvContent],
        { type: "text/csv;charset=utf-8;" }
    );


    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "Student_Records.csv";

    link.click();

    URL.revokeObjectURL(url);


    addActivity(
        "Student Data Exported",
        "Student records were exported to CSV."
    );

});


// 17. REFRESH ALL DASHBOARD COMPONENTS

function refreshDashboard() {

    displayStudents();

    updateStatistics();

    filterStudents();

}


// 18. NAVIGATION ACTIVE STATE

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {

    link.addEventListener("click", function() {

        navLinks.forEach(item => item.classList.remove("active"));

        this.classList.add("active");

    });

});


// 19. INITIALIZE APPLICATION

refreshDashboard();

