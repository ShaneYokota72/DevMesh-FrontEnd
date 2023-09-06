/* basic imports */
import './App.css';
import React,{ useState } from 'react';
import { Routes, Route } from 'react-router-dom';

/* For Landing page */
import Land from './Pages/Land';
import Navbar from './Pages/Navbar';
import Aboutus from './Pages/Aboutus';
import Faq from './Pages/Faq';
import Contact from './Pages/Contact';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Ide from './Pages/Ide';

/* For Lobby */
import Lobbynav from './Pages/Lobbynav';
import Lobbybody from './Pages/Lobbybody';

/* For vercel analytics */
import { Analytics } from '@vercel/analytics/react'; 

/* For Alert/X svg */
// import alertimg from './Images/alertimg.svg';
// import Xmark from './Images/Xmark.svg';

function Landing(){
  // const [showalert, setshowalert] = useState(true);
  // const hidealert = () => {
  //   setshowalert(false);
  // }
  return(
    <div className='landingall'>
      {/* <div className="backenddownmsg" style={{display:  showalert ? 'flex' : 'none'}}>
        <img alt="alert icon" className='backenddownicon' src={alertimg}></img>
        <p style={{maxWidth: "20vw"}}>Backend is service is down due to AWS cost. Contact shaneyok@usc.edu to try out the website. Thank you for understanding.</p>
        <img alt="X icon" src={Xmark} onClick={hidealert} style={{marginRight: "2.2vw"}}></img>
      </div> */}
      <Navbar></Navbar>
      <Land></Land>
      <Aboutus></Aboutus>
      <Faq></Faq>
      <Contact></Contact>
    </div>
  )
}

function Lobbypage(){
  return(
    <div>
      <Lobbynav></Lobbynav>
      <Lobbybody></Lobbybody>
    </div>
  )
}

function Signuppage(){
  return(
    <Signup></Signup>
  )
}

function Loginpage(){
  return(
    <Login></Login>
  )
}

function Rooompage(){
  return(
    <Ide></Ide>
  )
}

export const UserContext = React.createContext({});

function App() {
  const [theme, setTheme] = React.useState('light');
  const [userinformation, setuserinformation] = React.useState({});
  return (
    <div className={`app ${theme}`}>
      <UserContext.Provider value={{ theme, setTheme, userinformation, setuserinformation}}>
        <Routes>
          <Route path='/' element={<Landing><Analytics /></Landing>}></Route>
          <Route path='/lobby' element={<Lobbypage><Analytics /></Lobbypage>}></Route>
          <Route path='/login' element={<Loginpage><Analytics /></Loginpage>}></Route>
          <Route path='/signup' element={<Signuppage><Analytics /></Signuppage>}></Route>
          <Route path='/room/:id' element={<Rooompage><Analytics /></Rooompage>}></Route>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;