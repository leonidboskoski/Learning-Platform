import React from "react";
import HeroBar from "../components/HeroBar";
import HowItWorks from "../components/HowItWorks";
import CoursesSection from "../components/CoursesSection";

const Home: React.FC = () => {
    return (
        <>
            <HeroBar />
            <HowItWorks />
            <CoursesSection />
        </>
    );
};

export default Home;
