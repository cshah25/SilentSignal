import React, { useState } from "react";
import "../styles/dashboard.css";
import MicMonitor from "../components/MicMonitor";
import ReadingHistory from "../components/ReadingHistory";
import LoginCard from "../components/LoginCard";

export default function Dashboard() {
    const [userId, setUserId] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [checking, setChecking] = useState(false);

    const API = process.env.REACT_APP_API_URL;

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        const trimmed = inputValue.trim();
        if (!trimmed) {
            setError("Please enter a user ID");
            return;
        }

        setChecking(true);
        try {
            const res = await fetch(`${API}?userId=${encodeURIComponent(trimmed)}`);

            // Treat 404 as “no readings yet” → new user
            if (res.status === 404) {
                setUserId(trimmed);
                return;
            }

            if (!res.ok) {
                throw new Error(`Status ${res.status}`);
            }

            const { readings } = await res.json();

            // empty array also means “new user”
            if (!Array.isArray(readings) || readings.length === 0) {
                setUserId(trimmed);
            } else {
                setUserId(trimmed);
            }

        } catch (err) {
            console.error("User check failed:", err);
            setError("Could not verify user. Please try again.");
        } finally {
            setChecking(false);
        }
    };

    if (!userId) {
        return (
            <LoginCard
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSubmit={handleSubmit}
                checking={checking}
                error={error}
            />
            // <div className="max-w-md mx-auto p-6">
            //     <h2 className="text-2xl font-semibold mb-4">Enter Your User ID</h2>
            //     <form onSubmit={handleSubmit} className="space-y-4">
            //         <input
            //             type="text"
            //             value={inputValue}
            //             onChange={e => setInputValue(e.target.value)}
            //             placeholder="User ID"
            //             className="w-full px-4 py-2 border rounded"
            //             disabled={checking}
            //         />
            //         <button
            //             type="submit"
            //             disabled={checking}
            //             className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            //         >
            //             {checking ? "Checking…" : "Go"}
            //         </button>
            //         {error && <p className="text-red-600">{error}</p>}
            //     </form>
            // </div>
        );
    }

    return (
        <div>
            {/* …your existing dashboard UI, now with dynamic userId… */}
            <div className="hero-image-13">
                <div className="text-content-title-14">
                    <p className="text-15">
                        <span className="text-rgb-12-12-13">Your Last meeting</span>
                    </p>
                    <p className="text-16">
                        <span className="text-rgb-12-12-13">
                            # mins in total and # of violations
                        </span>
                    </p>
                </div>
            </div>

            <div className="live-view-and-graphs-17">
                <div>
                    <strong>Live Mic</strong>
                    <MicMonitor userId={userId} />
                </div>
                <ReadingHistory userId={userId} />
            </div>

            <div className="card-grid-icon-20">
                {/* …rest of your leaderboard cards… */}
            </div>
        </div>
    );
}
