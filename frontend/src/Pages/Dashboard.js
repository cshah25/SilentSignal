import React, { useState } from "react";
import "../styles/dashboard.css";
import MicMonitor from "../components/MicMonitor";
import ReadingHistory from "../components/ReadingHistory";
import AudioRecorder from "../components/AudioRecorder";
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
            const res = await fetch(`${API}/readings?userId=${encodeURIComponent(trimmed)}`);

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
                    <AudioRecorder/>
                </div>
                <ReadingHistory userId={userId} />
            </div>
            <div class="card-grid-icon-20">


                <div class="text-content-heading-21">

                    <p class="text-22"><span class="text-rgb-30-30-30">Leaderboard</span></p>

                    <p class="text-23"><span class="text-rgb-117-117-117">Create a leader board of the users</span></p>

                </div>

                <div class="cards-24">

                    <div class="card-25">

                        <div class="body-28">

                            <div class="text-36">

                                <p class="text-37"><span class="text-rgb-30-30-30">The loudest person overall</span></p>

                                <p class="text-31"><span class="text-rgb-117-117-117">Body text for whatever you’d like to say. Add main
                                    takeaway points, quotes, anecdotes, or even a very very short story. </span></p>
                            </div>
                        </div>
                    </div>
                    <div class="card-25">
                        <div class="body-28">
                            <div class="text-36">
                                <p class="text-37"><span class="text-rgb-30-30-30">The Quietest person</span></p>
                                <p class="text-31"><span class="text-rgb-117-117-117">Body text for whatever you’d like to say. Add main
                                    takeaway points, quotes, anecdotes, or even a very very short story. </span></p>
                            </div>
                        </div>
                    </div>
                    <div class="card-25">
                        <div class="body-28">
                            <div class="text-36">
                                <p class="text-37"><span class="text-rgb-30-30-30">The one with most abstract noises</span></p>
                                <p class="text-31"><span class="text-rgb-117-117-117">Body text for whatever you’d like to say. Add main
                                    takeaway points, quotes, anecdotes, or even a very very short story. </span></p>
                            </div>
                        </div>
                    </div>
                    <div class="card-25">
                        <div class="body-28">
                            <div class="text-36">
                                <p class="text-37"><span class="text-rgb-30-30-30">The lowest volume ever recorded</span></p>
                                <p class="text-31"><span class="text-rgb-117-117-117">Body text for whatever you’d like to say. Add main
                                    takeaway points, quotes, anecdotes, or even a very very short story. </span></p>
                            </div>
                        </div>
                    </div>
                    <div class="card-25">
                        <div class="body-28">
                            <div class="text-36">
                                <p class="text-37"><span class="text-rgb-30-30-30">The highest volume ever recorded</span></p>
                                <p class="text-31"><span class="text-rgb-117-117-117">Body text for whatever you’d like to say. Add main
                                    takeaway points, quotes, anecdotes, or even a very very short story. </span></p>Add commentMore actions
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-grid-icon-20">
                </div>
            </div>
        </div>
    );
}
