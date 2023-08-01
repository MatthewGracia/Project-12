const connection = require("./connection");

class DB {
  // Storing the connection for potential future use
  constructor(connection) {
    this.connection = connection;
  }

  // Retrieve all employees along with their roles, salaries, departments, and managers
  findAllEmployees() {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  }

  // Retrieve all employees excluding the one with the provided employee id
  findAllPossibleManagers(employeeId) {
    return this.connection.promise().query(
      "SELECT id, first_name, last_name FROM employee WHERE id != ?",
      employeeId
    );
  }

  // Add a new employee to the database
  createEmployee(employee) {
    return this.connection.promise().query("INSERT INTO employee SET ?", employee);
  }

  // Delete an employee using the provided id
  removeEmployee(employeeId) {
    return this.connection.promise().query(
      "DELETE FROM employee WHERE id = ?",
      employeeId
    );
  }

  // Update the role of the specified employee
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.promise().query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [roleId, employeeId]
    );
  }

  // Update the manager of the specified employee
  updateEmployeeManager(employeeId, managerId) {
    return this.connection.promise().query(
      "UPDATE employee SET manager_id = ? WHERE id = ?",
      [managerId, employeeId]
    );
  }

  // Retrieve all roles along with their respective departments
  findAllRoles() {
    return this.connection.promise().query(
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    );
  }

  // Add a new role to the database
  createRole(role) {
    return this.connection.promise().query("INSERT INTO role SET ?", role);
  }

  // Delete a role using the provided id
  removeRole(roleId) {
    return this.connection.promise().query("DELETE FROM role WHERE id = ?", roleId);
  }

  // Retrieve all departments
  findAllDepartments() {
    return this.connection.promise().query(
      "SELECT department.id, department.name FROM department;"
    );
  }

  // Retrieve all departments along with their utilized budgets
  viewDepartmentBudgets() {
    return this.connection.promise().query(
      "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
    );
  }

  // Add a new department to the database
  createDepartment(department) {
    return this.connection.promise().query("INSERT INTO department SET ?", department);
  }

  // Delete a department using the provided id
  removeDepartment(departmentId) {
    return this.connection.promise().query(
      "DELETE FROM department WHERE id = ?",
      departmentId
    );
  }

  // Retrieve all employees in a specified department along with their roles
  findAllEmployeesByDepartment(departmentId) {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
      departmentId
    );
  }

  // Retrieve all employees under a specified manager along with their departments and roles
  findAllEmployeesByManager(managerId) {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
      managerId
    );
  }
}

module.exports = new DB(connection);
