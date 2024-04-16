import React, { useState } from "react";
import "../Styles/nav.css";
import { Link, NavLink } from "react-router-dom";

 const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return ( 
     
    <nav>

      

      <div className="menu" onClick={() => setMenuOpen(!menuOpen) }>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={menuOpen ? "open" : ""} id="atag">
        <li>

          <NavLink to="/" style={{display :"flex" , justifyContent:'center' , alignContent :"center" , gap :'2px'}}> 
<img src="https://www.svgrepo.com/show/459911/dashboard.svg" width="30px" /> Dashboard </NavLink>
        </li>
        <li >
          <NavLink to="/create" style={{display :"flex" , justifyContent:'center' , alignContent :"center" , gap :'2px'}}> <img src="https://uxwing.com/wp-content/themes/uxwing/download/business-professional-services/pie-chart-icon.png" width="30px"/>  Chart </NavLink>
        </li>
        <li>
          <NavLink to="/about" style={{display :"flex" , justifyContent:'center' , alignContent :"center" , gap :'2px'}} > <img src="https://visualpharm.com/assets/917/Settings-595b40b75ba036ed117d71cb.svg" width="30px" />About</NavLink>
        </li>
         
        </ul> 

       
          
      <Link to="/" className="title">
      <img src="https://cdn-icons-png.freepik.com/256/1144/1144760.png?ga=GA1.1.1059520315.1704613684&semt=ais_hybrid" alt='logo ' style={{height: "60px", marginLeft :'12px' , border : "1px solid crimson", borderRadius :"50px", backgroundColor :"silver" }}/>
      </Link> 

       
      
    </nav>                   
  );                          
};
 export default Navbar;