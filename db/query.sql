SELECT *
FROM role
JOIN department ON role.department_id = department.id;

SELECT *
FROM employee
JOIN role ON employee.role_id = role.id;

SELECT *
FROM employee
JOIN employee ON employee.manager_id = employee.id;