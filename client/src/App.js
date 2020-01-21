import React, { useEffect } from 'react';
import './App.css';
import axios from 'axios'

const App = () => {
  const [initialEmployees, setInitEmployees] = React.useState([]);
  const [employeeList, setEmployeeList] = React.useState([]);
  
  //init employee table
  useEffect(() => {
    axios.post(`http://localhost:3001/v1/employees?{'employee_id': 1, 'employee_name': 'JohnBob Jones' }`);
  }, []);
  
  


  //retrieve employees from the database
  useEffect(() => {
    axios.get(`http://localhost:3001/v1/employees`).then((response) => {
      setEmployeeList(response.data);
    });
  }, []);


  return (
    <div>
    {employeeList && employeeList.length
      ? employeeList.map((employee, id) => {
          return (
            <div key={id}>
              {`${employee.name}`}
              <br />
            </div>
          );
        })
      : 'No employees present'}
    </div>
  );
}
/*  function App() {
  const [employeeList, updateEmployeeList] = React.useState([]);
  React.useEffect(() => {
    const getEmployeeList = async () => {
      const response = await fetch(
        `${process.env.REACT_EMPLOYEES_API}/employees`
      );
    const employees = await response.json();
      if (employees && Array.isArray(employees) && employees.length) {
        // @ts-ignore
        updateEmployeeList(employees);
      }
    };
    // getToDoItems();
  }, []);
return (
    <div>
    {employeeList && employeeList.length
      ? employeeList.map((employee, id) => {
          return (
            <div key={id}>
              {`${employee.name}`}
              <br />
            </div>
          );
        })
      : 'No employees present'}
    </div>
  );
}  */
export default App;