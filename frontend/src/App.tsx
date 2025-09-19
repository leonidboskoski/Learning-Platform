import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TutorsPage from "./pages/TutorsPage";
import TeachPage from "./pages/TeachPage";
import ApplyTutorPage from "./pages/ApplyTutorPage";

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tutors" element={<TutorsPage />} />
            <Route path="/teach" element={<TeachPage />} />
            <Route path="/apply" element={<ApplyTutorPage />} />
            {/* optional fallback */}
            <Route path="*" element={<Home />} />
        </Routes>
    );
};

export default App;
