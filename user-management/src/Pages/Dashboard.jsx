import "../Styles/dashboard.css";
import React from "react";
import Pagination from '../Components/Pagination'
import { useEffect, useState } from "react"
import axios from "axios";
import { URL } from "../configs/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(5);
  const [editableUser, setEditableUser] = useState(null);
  const [loading,setLoading] = useState(false);
  const [popUp,setpopUp]= useState(false);
  const [exAdd,setExAdd]= useState([]);



  const [addData, setAddData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });



  //add function post request 
  const handleAdd = async (event) => {
    event.preventDefault();
    try {
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
      setUsers([...users, response.data]); // Add new user to the current list
      setAddData({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        department: ''
      }); 
      
      setpopUp(false);
      toast.success("Data Added Successfully 🎉!")
    }
    catch (error) {
      console.log(error);
      setpopUp(false);
      toast.error("Something went wrong!")
    }
  };  



   // read data 

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users?_page=${currentPage}&_limit=${tasksPerPage}`);
      setUsers(response.data);
      setTotalUsers(response.headers['x-total-count']);
    } catch (error) {
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


  /// update user
  const handleUpdate = async (updatedUser) => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${updatedUser.id}`, updatedUser);
      const updatedUsers = users.map(user =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      );

      setUsers(updatedUsers);
      setEditableUser(null);
      (() => toast("User data update  Succuesfully ✅ ")
      )();

    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  /// delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      (() => toast("User data delete   Succuesfully ✅ ")
    )();
    }
    catch (error) {
      console.error('Error deleting user:', error);
    }
  };


  return (
    <div>
      <h2>User List</h2>
      <ToastContainer/>
        
        <div style={{width :'150px' , float :"right" , marginRight :"50px"}}>
          <button  onClick={() => setpopUp(true)} style={{ padding :'7px' ,borderRadius :"3px", backgroundColor :'brown' , color:"whitesmoke" , fontSize :'17px' }}>
            Add new user ➕
          </button>
        </div>



      <div style={{display :"flex" , justifyContent:'center' , width:"450px" ,margin:'auto'}}>
      <div style={{display :'flex', margin: "auto" ,width :'220px' , marginTop :'20px' , justifyContent : "space-around" , border :'5px solid green' ,padding :'17px' , borderRadius :'10px'}}>
        Limit per page : 
       <select value={tasksPerPage} onChange={ (event) => {setTasksPerPage(event.target.value)} }>
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
        setTasksPerPage={tasksPerPage}
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
                  <button onClick={() => handleUpdate(editableUser)}> Update</button> :
                  <button onClick={() => handleEdit(user)} style={{marginLeft :'4px', color :'green'}}> Edit   <img src='https://cdn3.iconfinder.com/data/icons/feather-5/24/edit-512.png' style={{ width: "20px" }} /></button>}
                <button onClick={() => handleDelete(user.id)} style={{marginLeft :'4px', color :'crimson'}}>Delete <img src='https://cdn-icons-png.flaticon.com/512/3687/3687412.png' style={{ width: "20px" }} /></button>
              </td>
            </tr>
          ))
          }

       
        </tbody>


      </table>

      : 
      <img src="https://cdnl.iconscout.com/lottie/premium/thumb/spinner-loading-5600921-4672284.gif" width="26%"/>
        }





      {popUp && (
          <React.Fragment>

            <div className="show">
           
              <form onSubmit={handleAdd}>
            
                <h2>Add User  </h2>
                 
                <input type="number" name='id' placeholder='Enter Id' required
                  value={addData.id}
                  onChange={(e) => setAddData({ ...addData, id: e.target.value })} />

                <input type="text" name="firstName" placeholder='Enter firstName' required
                  value={addData.firstName}
                  onChange={(e) => setAddData({ ...addData, firstName: e.target.value })} />

                <input type="text" name="lastName" placeholder='Enter lastName' required
                  value={addData.lastName}
                  onChange={(e) => setAddData({ ...addData, lastName: e.target.value })} />

                <input type="email" name="email" placeholder='Enter Email'  required
                  value={addData.email}
                  onChange={(e) => setAddData({ ...addData, email: e.target.value })} />

                <input type="text" name="department" placeholder='Enter department'  required
                  value={addData.department}
                  onChange={(e) => setAddData({ ...addData, department: e.target.value })} />

                <button style={{ backgroundColor: "rgb(76,182,57)", border: "none", color: "white", fontWeight: "bold", cursor: "pointer" , padding :'5px', width :'75px' , borderRadius:'3px'}} type="submit">Add</button>

                <div>
                <button style={{cursor: "pointer" , color: 'crimson' }} onClick={() => setpopUp(false)}>Cancel</button>
              </div>
              </form>
            </div>

          </React.Fragment>
        )}

    </div>
  );
};

export default Dashboard;
