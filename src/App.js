import './App.css';
import ColabIDE from './Components/ColabIDE';
import TopPage from './Components/TopPage';
import Explanation from './Components/Explanation';
import Message from './Components/Message';
import Getstarted from './Components/Getstarted';
import Footer from './Components/Footer';
import Lobby from './Components/Lobby';
import About from './Components/About';
import React from 'react';
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


function Landingpage(){
  return(
    <div>
      <TopPage></TopPage>
      <Explanation></Explanation>
      <Message></Message>
      <Getstarted></Getstarted>
      <Footer></Footer>
    </div>
  )
}

function Landing(){
  return(
    <div>
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
  const [username, setusername] = React.useState('');
  const [roomcreater, setroomcreater] = React.useState('');
  const [theme, setTheme] = React.useState('light');
  const [userinformation, setuserinformation] = React.useState({});
  return (
    <div className={`app ${theme}`}>
      <UserContext.Provider value={{username, setusername, roomcreater, setroomcreater, theme, setTheme, userinformation, setuserinformation}}>
        <Routes>
          <Route path="/archive" element={<Landingpage />} />
          <Route path='/archivelobby' element={<Lobby/>}></Route>
          <Route path='/archiveroom/:roomid' element={<ColabIDE/>}></Route>
          <Route path='/about' element={<About></About>}></Route>
          <Route path='/' element={<Landing></Landing>}></Route>
          <Route path='/lobby' element={<Lobbypage></Lobbypage>}></Route>
          <Route path='/login' element={<Loginpage></Loginpage>}></Route>
          <Route path='/signup' element={<Signuppage></Signuppage>}></Route>
          <Route path='/room/:id' element={<Rooompage></Rooompage>}></Route>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
