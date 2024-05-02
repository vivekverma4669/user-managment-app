import "../Styles/dashboard.css";
import React, { useState, useEffect } from "react";
import Pagination from '../Components/Pagination'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(5);
  const [editableUser, setEditableUser] = useState(null)
  const [loading, setLoading] = useState(false);
  const [popUp, setPopUp] = useState(false);

  const [addData, setAddData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users?_page=${currentPage}&_limit=${tasksPerPage}`);
      setUsers(response.data);
      setTotalUsers(response.headers['x-total-count']);
    }
    catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchUsers();
  }, [currentPage, tasksPerPage]);


  const handleEdit = (user) => {
    setEditableUser(user);
  };

  const handleUpdate = async (updatedUser) => {
    try {
      // Add validation to prevent editing with invalid email
      if (!validateEmail(updatedUser.email)) {
        toast.error("Please enter a valid email address!");
        return;
      }

      await axios.put(`https://jsonplaceholder.typicode.com/users/${updatedUser.id}`, updatedUser);
      const updatedUsers = users.map(user =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      );

      setUsers(updatedUsers);
      setEditableUser(null);
      toast.success("User data updated successfully! ✅");
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (confirmDelete) {
        await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
        setUsers(users.filter(user => user.id !== id));
        toast.success("User data deleted successfully! ✅");
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const validateEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    try {
      // Prevent adding users with negative IDs
      if (addData.id < 0) {
        toast.error("ID cannot be negative!");
        return;
      }

      // Add validation for email
      if (!validateEmail(addData.email)) {
        toast.error("Please enter a valid email address!");
        return;
      }

      const combinedName = `${addData.firstName} ${addData.lastName}`;
      const postData = {
        id: addData.id,
        name: combinedName,
        email: addData.email,
        company: {
          name: addData.department
        }
      };
      const response = await axios.post("https://jsonplaceholder.typicode.com/users/", postData);
      setUsers([...users, response.data]);
      setAddData({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        department: ''
      });
      setPopUp(false);
      toast.success("User data added successfully! 🎉");
    }
    catch (error) {
      console.log(error);
      setPopUp(false);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div>
      <h2>User List</h2>
      <ToastContainer />

      <div style={{ width: '150px', float: "right", marginRight: "50px" }}>
        <button onClick={() => setPopUp(true)} style={{ padding: '7px', borderRadius: "3px", backgroundColor: 'brown', color: "whitesmoke", fontSize: '17px' }}>
          Add new user ➕
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: 'center', width: "450px", margin: 'auto' }}>
        <div style={{ display: 'flex', margin: "auto", width: '220px', marginTop: '20px', justifyContent: "space-around", border: '5px solid green', padding: '17px', borderRadius: '10px' }}>
          Limit per page :
          <select value={tasksPerPage} onChange={(event) => { setTasksPerPage(event.target.value) }}>
            <option>5</option>
            <option>10</option>
            <option>15</option>
          </select>
        </div>
        <Pagination
          currentPage={currentPage}
          tasksPerPage={tasksPerPage}
          totalTasks={totalUsers}
          setCurrentPage={setCurrentPage}
          setTasksPerPage={setTasksPerPage}
        />
      </div>

      {!loading ?
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>

                <td>{user.id}</td>
                <td>{editableUser && editableUser.id === user.id ? <input type="text" value={editableUser.name} onChange={e => setEditableUser({ ...editableUser, name: e.target.value })} /> : user.name}</td>
                <td>{editableUser && editableUser.id === user.id ? <input type="text" value={editableUser.email} onChange={e => setEditableUser({ ...editableUser, email: e.target.value })} /> : user.email}</td>
                <td>{editableUser && editableUser.id === user.id ? <input type="text" value={editableUser.company.name} onChange={e => setEditableUser({ ...editableUser, company: { name: e.target.value } })} /> : user.company.name}</td>

                <td>
                  {editableUser && editableUser.id === user.id ?
                    <button onClick={() => handleUpdate(editableUser)}>Update</button> :
                    <button onClick={() => handleEdit(user)} style={{ marginLeft: '4px', color: 'green' }}>Edit <img src='https://cdn3.iconfinder.com/data/icons/feather-5/24/edit-512.png' style={{ width: "20px" }} alt="Edit Icon" /></button>}
                    <button onClick={() => handleDelete(user.id)} style={{ marginLeft: '4px', color: 'crimson' }}>Delete <img src='https://cdn-icons-png.flaticon.com/512/3687/3687412.png' style={{ width: "20px" }} alt="Delete Icon" /></button>
                </td>

              </tr>
            ))}
          </tbody>
        </table> :
        <img src="https://cdnl.iconscout.com/lottie/premium/thumb/spinner-loading-5600921-4672284.gif" alt="Loading Spinner" width="26%" />
      }

      {popUp && (
        <div className="show">
          <form onSubmit={handleAdd}>
            <h2>Add User</h2>
            
            <input type="number" name='id' placeholder='Enter Id' required
              value={addData.id}
              onChange={(e) => setAddData({ ...addData, id: e.target.value })} />

            <input type="text" name="firstName" placeholder='Enter firstName' required
              value={addData.firstName}
              onChange={(e) => setAddData({ ...addData, firstName: e.target.value })} />

            <input type="text" name="lastName" placeholder='Enter lastName' required
              value={addData.lastName}
              onChange={(e) => setAddData({ ...addData, lastName: e.target.value })} />

            <input type="email" name="email" placeholder='Enter Email' required
              value={addData.email}
              onChange={(e) => setAddData({ ...addData, email: e.target.value })} />

            <input type="text" name="department" placeholder='Enter department' required
              value={addData.department}
              onChange={(e) => setAddData({ ...addData, department: e.target.value })} />

            <button style={{ backgroundColor: "rgb(76,182,57)", border: "none", color: "white", fontWeight: "bold", cursor: "pointer", padding: '5px', width: '75px', borderRadius: '3px' }} type="submit">Add</button>

            <div>
              <button style={{ cursor: "pointer", color: 'crimson' }} onClick={() => setPopUp(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
