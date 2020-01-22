import React, { useEffect } from 'react';
import './App.css';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import { Grid, OutlinedInput, Button, GridList } from '@material-ui/core'

const myStyles = makeStyles(() => ({
  root: {
    position: 'center'
  },
  div: {
    textAlign: 'center'
  },
  grid: {
    display: 'flex',
  }
}));

const App = () => {
  //Initialize state variables and functions
  const classes = myStyles();
  const [employeeList, setEmployeeList] = React.useState([]);
  const [desiredEmployee, setDesiredEmployee] = React.useState('');
  const [employeeToAdd, setEmployeeToAdd] = React.useState('');
  const [employeeCounter, setEmployeeCounter] = React.useState(7);
  const [searchResults, setSearchResults] = React.useState([]);
   
  //retrieve employees from the database
  useEffect(() => {
    axios.get(`http://localhost:3001/v1/employees`).then((response) => {
      setEmployeeList(response.data);
    });
  }, []);

  //Does an exact search for the full employee name
  const handleSearch = (desiredEmployee) => {
    setSearchResults(employeeList.filter( employee => employee.employee_name === desiredEmployee));
  };


  //Adds an employee to the database and then retreives the new table
  const AddEmployee = (employeeToAdd) => {
    let employeeId = employeeCounter;
    axios.post(`http://localhost:3001/v1/employees`,{'employee_id': employeeId ,'employee_name': employeeToAdd}).then( res =>
      {axios.get(`http://localhost:3001/v1/employees`).then((response) => {
      setEmployeeList(response.data);
      });})
      setEmployeeCounter(employeeId++);
      setEmployeeToAdd('');
  };

  //Renders the employeeList as it changes
  const renderEmployeeList = () => employeeList.map((employee, id) => {
    return (
      <div key={id}>
        {`${employee.employee_name}`}
        <br />
      </div>
    );
  });
  
  //Renders the search Results
  const renderSearchResults = () => searchResults.map((employee, index) => {
    return (
      <div key={index}>
        {`${employee.employee_name}`}
        <br />
      </div>
    );
  });


  return (
    <Grid container className={classes.grid}>
    <Grid item sm={3} className={classes.div}>
    <h3>Current Employees</h3>
    {renderEmployeeList()}
    </Grid>
    <Grid item sm={6} className={classes.div}>
      <h1>Welcome to the Employee Directory</h1>
      <Grid style={{display: 'inline-flex'}}>
      <OutlinedInput
        id="searchBar"
        variant="filled"
        value={desiredEmployee}
        onChange={(e) => setDesiredEmployee(e.target.value)}
      />
      <Button
        id="searchButton"
        onClick={() => handleSearch(desiredEmployee)}
        variant="outlined"
        >Search</Button>
      <OutlinedInput
        id="addEmployee"
        variant="filled"
        style={{marginLeft:'3px'}}
        value={employeeToAdd}
        onChange={(e) => setEmployeeToAdd(e.target.value)}
      />
      <Button
        id="addEmployeeButton"
        onClick={() => AddEmployee(employeeToAdd)}
        variant="outlined"
        >Add Employee</Button>
        </Grid>
    </Grid>
    <Grid item sm={3} className={classes.div}>
    <h3>Search Results</h3>
    {renderSearchResults()}
    </Grid>
    </Grid>
  );
}

export default App;