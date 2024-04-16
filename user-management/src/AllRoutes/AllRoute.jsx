import React from 'react'
import { Routes , Route} from 'react-router-dom';

const AllRoute = ()=>{
  return (
    <div>
      <Routes>
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </div>
  )
}
export default AllRoute;
