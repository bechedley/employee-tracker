const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
require('dotenv').config();
const cTable = require('console.table');
const inquirer = require('inquirer');
const { json } = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Connect to database
const db = mysql.createConnection(

    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the tracker_db database.`)
);

function init() {
    console.log('WELCOME TO THE EMPLOYEE TRACKER!');
    menu();
}

// Initial user prompt question
const menuQuestion = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'menu',
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee", "Delete a department", "Delete a role", "Delete an employee", "Quit"],
    },
];

const addDepartmentQuestions = [
    {
        type: 'input',
        name: 'newDepartmentName',
        message: "What is the name of the new department?",
    },
];

const updateEmployeeQuestions = [
    {
        type: 'list',
        name: 'updateEmployeeOptions',
        message: "What do you want to update?",
        choices: ["Update an employee's role", "Update an employee's manager", "Back"],
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
                viewDepartments(answers);

            } else if (answers.menu === "View all roles") {
                viewRoles(answers);

            } else if (answers.menu === "View all employees") {
                viewEmployees(answers);

            } else if (answers.menu === "Add a department") {
                addDepartmentPrompts(answers);

            } else if (answers.menu === "Add a role") {
                addRole(answers);

            } else if (answers.menu === "Add an employee") {
                addEmployee(answers);

            } else if (answers.menu === "Update an employee") {
                updateEmployeePrompts(answers);

            } else if (answers.menu === "Delete a department") {
                deleteDepartment(answers);

            } else if (answers.menu === "Delete a role") {
                deleteRole(answers);

            } else if (answers.menu === "Delete an employee") {
                deleteEmployee(answers);

            } else {
                menuQuestion.complete(answers);
            }
        });
}


function viewDepartments() {

    db.promise().query('SELECT * FROM department')
        .then(([rows, fields]) => {
            console.table(
                rows);
        })
        .then(() => {
            menu();
        });
}

function viewRoles() {

    const sqlRole = "SELECT role.id, role.title, role.salary, dep.name AS department FROM role JOIN department AS dep ON role.department_id = dep.id";

    db.promise().query(sqlRole)
        .then(([rows, fields]) => {
            console.table(
                rows);
        })
        .then(() => {
            menu();
        });
}

function viewEmployees() {

    const sqlEmployee = "SELECT emp1.id, emp1.first_name, emp1.last_name, role.title, dep.name AS department, role.salary, emp2.first_name AS manager FROM employee AS emp1 JOIN role ON emp1.role_id = role.id JOIN department AS dep ON role.department_id = dep.id LEFT JOIN employee AS emp2 ON emp1.manager_id = emp2.id";

    db.promise().query(sqlEmployee)
        .then(([rows, fields]) => {
            console.table(
                rows);
        })
        .then(() => {
            menu();
        });
}

function addDepartmentPrompts() {
    inquirer
        .prompt(addDepartmentQuestions)

        // Gather input data and action menu selection
        .then((departmentAnswers) => {

            addDepartment(departmentAnswers);
        });
}


function addDepartment(departmentAnswers) {
    const sqlAddDep = `INSERT INTO department (name)
    VALUES (?)`;
    const params = departmentAnswers.newDepartmentName;

    db.promise().query(sqlAddDep, params, (err) => {
        if (err) {
            throw err;
        }
        console.log("Department added!");
        return viewDepartments();
    })
        .then(() => {
            menu();
        });

}

function addRole() {
    return inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the name of this role?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter a role name");
                    return false;
                };
            }
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?",
            validate: salaryInput => {
                if (isNaN(salaryInput)) {
                    console.log("Please enter a salary");
                    return false;
                } else {
                    return true;
                };
            }
        }
    ])
        .then(answer => {
            const params = [answer.title, answer.salary];
            const sql = `SELECT * FROM department`;
            db.query(sql, (err, rows) => {
                if (err) {
                    throw err;
                }
                const departments = rows.map(({ name, id }) => ({ name: name, value: id }));
                inquirer.prompt([
                    {
                        type: "list",
                        name: "department",
                        message: "What department does this role belong to?",
                        choices: departments
                    }
                ])
                    .then(departmentAnswer => {
                        const department = departmentAnswer.department;
                        params.push(department);
                        const sql = `INSERT INTO role (title, salary, department_id)
            VALUES (?, ?, ?)`;
                        db.query(sql, params, (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log("Role added!");
                            return viewRoles();
                        });
                    });
            });
        });
};

const addEmployee = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter a name");
                    return false;
                };
            }
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter a name");
                    return false;
                };
            }
        }
    ])
        .then(answer => {
            const params = [answer.firstName, answer.lastName];
            const sql = `SELECT * FROM role`;
            db.query(sql, (err, rows) => {
                if (err) {
                    throw err;
                }
                const roles = rows.map(({ title, id }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: "list",
                        name: "role",
                        message: "What is the role of this employee?",
                        choices: roles
                    }
                ])
                    .then(roleAnswer => {
                        const role = roleAnswer.role;
                        params.push(role);
                        const sql = `SELECT * FROM employee`;
                        db.query(sql, (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            const managers = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
                            managers.push({ name: "No manager", value: null });
                            inquirer.prompt([
                                {
                                    type: "list",
                                    name: "manager",
                                    message: "Who is this employee's manager?",
                                    choices: managers
                                }
                            ])
                                .then(managerAnswer => {
                                    const manager = managerAnswer.manager;
                                    params.push(manager);
                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;
                                    db.query(sql, params, (err) => {
                                        if (err) {
                                            throw err;
                                        }
                                        console.log("Employee added!");
                                        return viewEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};

function updateEmployeePrompts() {
    inquirer
        .prompt(updateEmployeeQuestions)

        // Gather input data and action menu selection
        .then((updateAnswers) => {

            if (updateAnswers.updateEmployeeOptions === "Update an employee's role") {
                updateEmployeeRole(updateAnswers);

            } else if (updateAnswers.updateEmployeeOptions === "Update an employee's manager") {
                updateEmployeeManager(updateAnswers);
            } else {
                menu();
            }
        });
}

const updateEmployeeRole = () => {
    const sql = `SELECT first_name, last_name, id FROM employee`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        const employees = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee's role would you like to update?",
                choices: employees
            }
        ])
            .then(employeeAnswer => {
                const employee = employeeAnswer.employee;
                const params = [employee];
                const sql = `SELECT title, id FROM role`;
                db.query(sql, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    const roles = rows.map(({ title, id }) => ({ name: title, value: id }));
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "role",
                            message: "What is the new role of this employee?",
                            choices: roles
                        }
                    ])
                        .then(rolesAnswer => {
                            const role = rolesAnswer.role;
                            params.unshift(role);
                            const sql = `UPDATE employee
                          SET role_id = ?
                          WHERE id = ?`
                            db.query(sql, params, (err) => {
                                if (err) {
                                    throw err;
                                }
                                console.log("Employee updated!");
                                return viewEmployees();
                            });
                        });
                });
            });
    });
};

const updateEmployeeManager = () => {
    const sql = `SELECT first_name, last_name, id FROM employee`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        const employees = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(employeeAnswer => {
                const employee = employeeAnswer.employee;
                const params = [employee];
                const sql = `SELECT first_name, last_name, id FROM employee`;
                db.query(sql, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    const managers = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
                    managers.push({ name: "No manager", value: null });
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "manager",
                            message: "Who is this employee's new manager?",
                            choices: managers
                        }
                    ])
                        .then(managerAnswer => {
                            const manager = managerAnswer.manager;
                            params.unshift(manager);
                            const sql = `UPDATE employee
                          SET manager_id = ?
                          WHERE id = ?`
                            db.query(sql, params, (err) => {
                                if (err) {
                                    throw err;
                                }
                                console.log("Employee updated!");
                                return viewEmployees();
                            });
                        });
                });
            });
    });
};

// Delete options

const deleteDepartment = () => {
    const sql = `SELECT * FROM department`
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const departments = rows.map(({name, id}) => ({name: name, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "department",
          message: "Which department would you like to delete?",
          choices: departments
        }
      ])
      .then(departmentAnswer => {
        const department = departmentAnswer.department
        const params = department;
        const sql = `DELETE FROM department
                      WHERE id = ?`
        db.query(sql, params, (err) => {
          if (err) {
            throw err;
          }
          console.log("Department deleted!");
          return viewDepartments();
        });
      });
    });
  };
  
  const deleteRole = () => {
    const sql = `SELECT id, title FROM role`
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const roles = rows.map(({title, id}) => ({name: title, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "role",
          message: "Which role would you like to delete?",
          choices: roles
        }
      ])
      .then(roleAnswer => {
        const role = roleAnswer.role
        const params = role;
        const sql = `DELETE FROM role
                      WHERE id = ?`
        db.query(sql, params, (err) => {
          if (err) {
            throw err;
          }
          console.log("Role deleted!");
          return viewRoles();
        });
      });
    });
  };
  
  const deleteEmployee = () => {
    const sql = `SELECT first_name, last_name, id FROM employee`
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to delete?",
          choices: employees
        }
      ])
      .then(employeeAnswer => {
        const employee = employeeAnswer.employee
        const params = employee;
        const sql = `DELETE FROM employee
                      WHERE id = ?`
        db.query(sql, params, (err) => {
          if (err) {
            throw err;
          }
          console.log("Employee deleted!");
          return viewEmployees();
        });
      });
    });
  };

init();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


