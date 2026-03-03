import { useState } from "react";
import AskAIChat from "./AskAIChat";
import { FaRobot } from "react-icons/fa";
import "./AskAI.css";

export default function AskAIButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {open && <AskAIChat onClose={() => setOpen(false)} />}
            <div className="ask-ai-btn" onClick={() => setOpen(true)}>
                <FaRobot size={22} />
                Ask AI
            </div>
        </>
    );
}
