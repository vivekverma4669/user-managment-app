import React from 'react'
import { Routes , Route} from 'react-router-dom';
import Dashboard from '../Pages/Dashboard';
import Chart from '../Pages/Chart';

const AllRoute = ()=>{
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="chart" element={<Chart/>} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </div>
  )
}
export default AllRoute;
