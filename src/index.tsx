import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { CSPTool } from "./components/CSPTool";
import Header from "./components/Header";
import { policyParser } from "./utils/csp-utils";
import { ErrorPage } from "./components/ErrorPage";

const App: React.FC = () => {

    const [valid, setValid] = useState<boolean>(false);
    const [directives, setDirectives] = useState({});

    useEffect(() => {
        if (window.location.search) {
            const searchParams = new URLSearchParams(location.search.substring(location.search.indexOf('?')));
            let key = searchParams.get("config");
            console.log(key);

            if (key === "") {
                setValid(true);
                return;
            }
            
            if (!key) {
                setValid(false);
                return;
            }
            key = window.atob(key);
            try {
                setDirectives(policyParser(key));
                setValid(true)
            } catch (e) {
                console.error(e);
                
                setValid(false);
            }

            return;
        }
        setValid(true);
    }, []);

    return <div className="app">
        {
            valid ? <>
                <Header />
                <CSPTool directives={directives}/>
            </> : <ErrorPage />

        }
    </div>
};

const root: HTMLElement = document.getElementById("root")!;
ReactDOM.createRoot(root).render(<App />)