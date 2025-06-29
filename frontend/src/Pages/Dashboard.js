import React from "react";
import "../styles/dashboard.css";
import MicMonitor from "../components/MicMonitor";
import ReadingHistory from "../components/ReadingHistory";
import AudioRecorder from "../components/AudioRecorder"; // ✅ Import added

const userId = "rayu";

const Dashboard = () => {
    return (
        <div>
            <div className="hero-image-13">
                <div className="text-content-title-14">
                    <p className="text-15"><span className="text-rgb-12-12-13">Your Last meeting</span></p>
                    <p className="text-16"><span className="text-rgb-12-12-13"># mins in total and # of violations</span></p>
                </div>
            </div>

            <div className="live-view-and-graphs-17">
                <div>
                    <strong>Live Mic</strong>
                    <MicMonitor userId={userId} />
                </div>

                {/* ✅ Classifier button added here */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Sound Type Classifier</h3>
                    <AudioRecorder />
                </div>

                <ReadingHistory userId={userId} />
            </div>

            <div className="card-grid-icon-20">
                <div className="text-content-heading-21">
                    <p className="text-22"><span className="text-rgb-30-30-30">Leaderboard</span></p>
                    <p className="text-23"><span className="text-rgb-117-117-117">Create a leader board of the users</span></p>
                </div>

                <div className="cards-24">
                    {[...Array(5)].map((_, i) => (
                        <div className="card-25" key={i}>
                            <div className="body-28">
                                <div className="text-36">
                                    <p className="text-37"><span className="text-rgb-30-30-30">Card Title #{i + 1}</span></p>
                                    <p className="text-31">
                                        <span className="text-rgb-117-117-117">
                                            Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
