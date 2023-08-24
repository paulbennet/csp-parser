import React from "react";
import ReactDOM from "react-dom/client";
import { CSPTool } from "./components/CSPTool";
import Header from "./components/Header";

const App: React.FC = () => {
    return <div className="app">
        <Header />
        <CSPTool />
    </div>
};

const root: HTMLElement = document.getElementById("root")!;
ReactDOM.createRoot(root).render(<App />)