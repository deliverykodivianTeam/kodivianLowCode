import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Form from "./pages/Form";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import Help from "./pages/Help";


function App() {
  return (
    <Router>
       <div className="app-container"> {/* Add this div */}
      <Sidebar/>
      <div className="content-area"> {/* Add this div */}
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/form" element={<Form/>}/>
        <Route path="/templates" element={<Templates />}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/help" element={<Help/>}/>
      </Routes>
      </div>
      </div>
    </Router>
  );
};

export default App;