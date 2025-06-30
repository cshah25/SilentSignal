import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import MicMonitor from "../components/MicMonitor";
import ReadingHistory from "../components/ReadingHistory";
import LoginCard from "../components/LoginCard";

export default function Dashboard() {
    const [userId, setUserId] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [checking, setChecking] = useState(false);
    const [totalViolations, setTotalViolations] = useState(0);
    const [totalReadings, setTotalReadings] = useState("");

    const [leaderboard, setLeaderboard] = useState({
        loudest: null,
        quietest: null,
        highestVolume: null,
        lowestVolume: null
    });

    const API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`${API}/readings/all`);
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const { readings } = await res.json();

                const users = {};
                readings.forEach(r => {
                    const user = r.userId;
                    const decibel = parseFloat(r.decibel);
                    if (!user || isNaN(decibel)) return;

                    if (!users[user]) {
                        users[user] = { total: 0, sum: 0, max: -Infinity, min: Infinity };
                    }
                    users[user].total++;
                    users[user].sum += decibel;
                    users[user].max = Math.max(users[user].max, decibel);
                    users[user].min = Math.min(users[user].min, decibel);
                });

                const userStats = Object.entries(users).map(([userId, stats]) => ({
                    userId,
                    avg: stats.sum / stats.total,
                    total: stats.total,
                    max: stats.max,
                    min: stats.min,
                }));

                // defaults
                let loudest = null;
                let quietest = null;
                let highestVolume = null;
                let lowestVolume = null;

                if (userStats.length > 0) {
                    loudest = userStats.reduce((a, b) => a.avg > b.avg ? a : b);
                    quietest = userStats.reduce((a, b) => a.avg < b.avg ? a : b);
                    highestVolume = userStats.reduce((a, b) => a.max > b.max ? a : b);
                    lowestVolume = userStats.reduce((a, b) => a.min < b.min ? a : b);
                }

                setLeaderboard({ loudest, quietest, highestVolume, lowestVolume });
            } catch (err) {
                console.error("Error loading leaderboard:", err);
            }
        };

        fetchLeaderboard();
    }, [API]);


    useEffect(() => {
        const fetchViolations = async () => {
            if (!userId) return;
            try {
                const res = await fetch(`${API}/readings?userId=${encodeURIComponent(userId)}`);
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const responseJson = await res.json();
                let rawList;
                if (Array.isArray(responseJson.readings)) {
                    rawList = responseJson.readings;
                } else {
                    const parsedBody = JSON.parse(responseJson.body || "{}");
                    rawList = parsedBody.readings?.L || [];
                }
                if (!Array.isArray(rawList)) {
                    setTotalViolations(0);
                    return;
                }
                const violations = rawList.filter((item, idx) => {
                    const rawDecibel =
                        typeof item.decibel === "number"
                            ? item.decibel
                            : item?.M?.decibel?.N ?? item.decibel;
                    const parsed = parseFloat(rawDecibel);
                    return !isNaN(parsed) && parsed > 50;
                });
                setTotalReadings(rawList.length);
                setTotalViolations(violations.length);
            } catch (err) {
                console.error("Error fetching or processing violations:", err);
                setTotalViolations(0);
            }
        };
        fetchViolations();
    }, [userId, API]);

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
        );
    }

    return (
        <div>
            <div className="hero-image-13">
                <div className="text-content-title-14">
                    <p className="text-15">
                        <span className="text-rgb-12-12-13">{totalReadings} total readings</span>
                    </p>
                    <p className="text-16">
                        <span className="text-rgb-12-12-13">
                            {totalViolations} total violations
                        </span>
                    </p>
                </div>
            </div>

            <div className="live-view-and-graphs-17">
                <MicMonitor userId={userId} />
                <ReadingHistory userId={userId} />
            </div>
            <div class="card-grid-icon-20">


                <div class="text-content-heading-21">

                    <p class="text-22"><span class="text-rgb-30-30-30">Leaderboard</span></p>

                    <p class="text-23"><span class="text-rgb-117-117-117">A small leader board of the users</span></p>

                </div>

                <div class="cards-24">
                    <div class="leaderboard-cards">
                        <div class="body-28">
                            <div class="text-36">
                                <p className="text-37"><span className="text-rgb-30-30-30">The loudest person overall</span></p>
                                <p className="text-31"><span className="text-rgb-117-117-117">
                                    {leaderboard.loudest ? `${leaderboard.loudest.userId} with avg ${leaderboard.loudest.avg.toFixed(2)} dB` : "Loading..."}
                                </span></p>
                            </div>
                        </div>
                    </div>
                    <div class="leaderboard-cards">
                        <div class="body-28">
                            <div class="text-36">
                                <p className="text-37">The Quietest person</p>
                                <p className="text-31">{leaderboard.quietest ? `${leaderboard.quietest.userId} with avg ${leaderboard.quietest.avg.toFixed(2)} dB` : "Loading..."}</p>
                            </div>
                        </div>
                    </div>
                    <div class="leaderboard-cards">
                        <div class="body-28">
                            <div class="text-36">
                                <p className="text-37">The highest volume ever recorded</p>
                                <p className="text-31">{leaderboard.highestVolume ? `${leaderboard.highestVolume.userId} hit ${leaderboard.highestVolume.max.toFixed(2)} dB` : "Loading..."}</p>
                            </div>
                        </div>
                    </div>
                    <div class="leaderboard-cards">
                        <div class="body-28">
                            <div class="text-36">
                                <p className="text-37">The lowest volume ever recorded</p>
                                <p className="text-31">{leaderboard.lowestVolume ? `${leaderboard.lowestVolume.userId} hit ${leaderboard.lowestVolume.min.toFixed(2)} dB` : "Loading..."}</p>
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
