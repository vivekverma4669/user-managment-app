import logo from './logo.svg';
import './App.css';
import AllRoute from './AllRoutes/AllRoute';
import Navbar from './Components/Nav';
import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
    <div className="App">
    <Navbar/>
    <AllRoute/>
    </div>
    </BrowserRouter>
  );
}
export default App;
