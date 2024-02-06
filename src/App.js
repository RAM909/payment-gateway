// import './App.css'
import PaymentForm from "./frontpage";
// import { postReq } from "./ccavRequestHandler";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/about" element={<PaymentForm/>}/>
          {/* <Route path="/ccavRequestHandler" element={<postReq/>}/> */}


          

        </Routes>
      </Router>
    </div>
  );
}

export default App;