import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { CSPTool } from "./components/CSPTool";
import Header from "./components/Header";
import { policyParser } from "./utils/csp-parser";

const App: React.FC = () => {

    const [valid, setValid] = useState<boolean>(false);
    const [directives, setDirectives] = useState({});

    useEffect(() => {
        if (window.location.search) {
            const searchParams = new URLSearchParams(location.search.substring(location.search.indexOf('?')));
            const key = window.atob(searchParams.get("key"));

            if (!key) {
                setValid(false);
            }

            try {
                setDirectives(policyParser(key));
                setValid(true)
            } catch (e) {
                console.log(e);
                
                setValid(false);
            }

            return;
        }
        setValid(true);
    }, []);

    return <div className="app">
        {
            valid && <>
                <Header />
                <CSPTool directives={directives}/>
            </>

        }
    </div>
};

const root: HTMLElement = document.getElementById("root")!;
ReactDOM.createRoot(root).render(<App />)