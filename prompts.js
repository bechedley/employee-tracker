// Include packages and files required for this application
const inquirer = require('inquirer');


// Objects to contain database table values
const departments = [];
const roles = [];
const employees = [];

const departmentData = [];
const roleData = [];
const employeeData = [];

// Initial user prompt question
const menuQuestion = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'menu',
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"],
    },
  ];

  const addDepartmentQuestions = [
    {
        type: 'input',
        name: 'newDepartmentName',
        message: "What is the name of the new department?",
    },
  ];

  const addRoleQuestions = [
    {
        type: 'input',
        name: 'newRoleTitle',
        message: "What is the title of the new role?",
    },
    {
        type: 'number',
        name: 'newRoleSalary',
        message: "What is the salary of the new role?",
    },
    {
        type: 'list',
        name: 'newRoleDepartment',
        message: "Which department does the new role belong to?",
        choices: [departments],
    },
  ];

  const addEmployeeQuestions = [
    {
        type: 'input',
        name: 'newEmployeeFirstName',
        message: "What is the first name of the new employee?",
    },
    {
        type: 'input',
        name: 'newEmployeeLastName',
        message: "What is the last name of the new employee?",
    },
    {
        type: 'list',
        name: 'newEmployeeRole',
        message: "What is the new employee's role?",
        choices: [roles],
    },
    {
        type: 'list',
        name: 'newEmployeeManager',
        message: "Who is the new employee's manager?",
        choices: [employees],
    },
  ];

  const updateEmployeeQuestions = [
    {
        type: 'list',
        name: 'updateEmployeeName',
        message: "Which employee do you want to update?",
        choices: [employees],
    },
    {
        type: 'list',
        name: 'updateEmployeeRole',
        message: "What is the employee's new role?",
        choices: [roles],
    },
  ];

  // Create a function to initialize app and call menu question
function menu() {

    // Use inquirer to initiate question prompts
    inquirer
      .prompt(menuQuestion)
  
      // Gather input data and action menu selection
      .then((answers) => {
  
        if (answers.menu === "View all departments") {
            viewDepartments();
        
        } else if (answers.menu === "View all roles") {
            viewRoles();
        
        } else if (answers.menu === "View all employees") {
            viewEmployees();

        } else if (answers.menu === "Add a department") {
            addDepartmentPrompts();
        
        } else if (answers.menu === "Add a role") {
            addRolePrompts();
        
        } else if (answers.menu === "Add an employee") {
            addEmployeePrompts();
        
        } else if (answers.menu === "Update an employee role") {
            updateEmployeePrompts();

        } else {
            menuQuestion.complete();
        }
    });
  }

  function viewDepartments() {
    
    db.query('SELECT * FROM department', function (err, results) {
      console.log(results);
    });

    menu();
  }

  function viewRoles() {
    
    db.query('SELECT * FROM role', function (err, results) {
      console.log(results);
    });

    menu();
  }

  function viewEmployees() {
    
    db.query('SELECT * FROM employee', function (err, results) {
      console.log(results);
    });

    menu();
  }

  function addDepartmentPrompts() {
    inquirer
      .prompt(addDepartmentQuestions)
  
      // Gather input data and action menu selection
      .then((departmentAnswers) => {
        
        addDepartment(departmentAnswers);
    });
  }

  function addRolePrompts() {
    inquirer
    .prompt(addRoleQuestions)

    // Gather input data and action menu selection
    .then((roleAnswers) => {

      addRole(roleAnswers);
  });
  }

  function addEmployeePrompts() {
    inquirer
    .prompt(addEmployeeQuestions)

    // Gather input data and action menu selection
    .then((employeeAnswers) => {

      addEmployee(employeeAnswers);
  });
  }

  function updateEmployeePrompts() {
    inquirer
      .prompt(updateEmployeeQuestions)
  
      // Gather input data and action menu selection
      .then((updateAnswers) => {

        updateEmployee(updateAnswers);
    });
  }

  function addDepartment(departmentAnswers) {
    console.log(`INSERT ${departmentAnswers.newDepartmentName} INTO department`)
    menu();
  }

  function addRole(roleAnswers) {
    console.log(`INSERT ${roleAnswers.newRoleTitle}, ${roleAnswers.newRoleSalary}, ${roleAnswers.newRoleDepartment} INTO role`)
    menu();
  }

  function addEmployee(employeeAnswers) {
    console.log(`INSERT ${employeeAnswers.newEmployeeFirstName}, ${employeeAnswers.newEmployeeLastName}, ${employeeAnswers.newEmployeeRole}, ${employeeAnswers.newEmployeeManager} INTO employee`)
    menu();
  }

  function updateEmployee(updateAnswers) {
    console.log(`UPDATE ${updateAnswers.updateEmployeeName} (by id value) with role_id ${updateAnswers.updateEmployeeRole} (by role_id value) INTO employee`)
    menu();
  }


  module.exports = prompts;

  