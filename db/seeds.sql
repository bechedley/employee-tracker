INSERT INTO department (name)
VALUES ("Marketing"),
       ("Finance"),
       ("Sales"),
       ("Customer Service"),
       ("Operations");

INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Manager", 95000.00, 1),
       ("Marketing Coordinator", 75000.00, 1),
       ("Sales Manager", 90000.00, 3),
       ("Finance Director", 120000.00, 2),
       ("Receptionist", 70000.00, 4),
       ("Operations Manager", 93000.00, 5),
       ("Sales Representative", 85000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Vanessa", "Condemi", 1, NULL),
       ("Monali", "Sarmah", 2, 1),
       ("Aaron", "Thompson", 3, NULL),
       ("Ben", "Smith", 4, NULL),
       ("Sean", "Harris", 6, NULL),
       ("Damian", "Sadler", 5, 6),
       ("Mark", "Rizzo", 7, 3),
       ("Adrian", "Goss", 7, 3);