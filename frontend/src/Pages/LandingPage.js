import React from "react";
import { Info } from 'lucide-react';
import "../styles/landingPage.css"

const Home = () => {
    return (
        <div>
            <section className="text-center py-24 bg-gray-200">
                <div className="hero-image-13">
                    <div className="text-content-title-14">
                        <p className="text-15"><span className="text-rgb-12-12-13">Silent Signal</span></p>
                        <p className="text-16"><span className="text-rgb-12-12-13">A friendly voice monitoring system</span></p>
                    </div>
                    <div className="button-group-17">
                        <div className="button-18">
                            <p className="text-19"><a href='/dashboard' className="text-rgb-245-245-245">Dashboard</a></p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="p-8 bg-gray-100">
                <div className="card-grid-icon-23">

                    <div className="text-content-heading-21 text-center mb-10">
                        <p className="text-22"><span className="text-rgb-30-30-30">Designed for Focused Remote Work</span></p>
                        <p className="text-23">
                            <span className="text-rgb-117-117-117">
                                Whether you're in a busy cafe, a shared apartment, or a late-night Zoom call — Silent Signal helps you stay professional and heard clearly.<br /> We built this tool for real-world distractions, not perfect conditions.
                            </span>
                        </p>
                    </div>
                    <div className="cards-24">
                        <div className="card-25">
                            <div className="body-27">
                                <div className="text-28">
                                    <p className="text-29"><span className="text-rgb-30-30-30">Built for Remote Teams</span></p>
                                    <p className="text-30">
                                        <span className="text-rgb-117-117-117">
                                            From daily stand-ups to all-hands meetings, Silent Signal helps remote workers stay accountable for their audio environments without needing to constantly mute/unmute. It's respectful and automatic.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="card-24">
                            <div className="card-25">
                                <div className="body-27">
                                    <p className="text-29"><span className="text-rgb-30-30-30">Open Source & Privacy-First</span></p>
                                    <p className="text-30">
                                        <span className="text-rgb-117-117-117">
                                            Silent Signal is fully open source — anyone can inspect, contribute to, or deploy their own version of the project. No audio is ever stored or transmitted without your control. Everything runs locally or through transparent endpoints, because your conversations aren’t ours to hear.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>


                        <div className="card-34">
                            <div className="body-36">
                                <div className="text-37">
                                    <p className="text-38"><span className="text-rgb-30-30-30">Friendly, Not Frustrating</span></p>
                                    <p className="text-39">
                                        <span className="text-rgb-117-117-117">
                                            Instead of nagging or harsh alerts, Silent Signal gives you subtle cues when things get loud — like a digital nudge from a teammate. It's there when you need it, invisible when you don’t.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card-43">
                            <div className="body-45">
                                <div className="text-46">
                                    <p className="text-47"><span className="text-rgb-30-30-30">Works in the Background</span></p>
                                    <p className="text-48">
                                        <span className="text-rgb-117-117-117">
                                            Once it’s running, you don’t need to think about it. Silent Signal monitors your mic passively, so you can focus on what matters — your work, your conversation, your team.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>


            <section className="p-8 bg-white">
                <div className="card-grid-icon-23">
                    <div className="text-content-heading-21">
                        <p className="text-22"><span className="text-rgb-30-30-30">Why Silent Signal?</span></p>
                        <p className="text-23"><span className="text-rgb-117-117-117">
                            Silent Signal is more than just an app — it's a thoughtful response to the chaos of remote communication. Here's how it works and who made it possible.
                        </span></p>
                    </div>
                    <div className="cards-24">
                        <div className="card-25">
                            <div className="body-27">
                                <div className="text-28">
                                    <p className="text-29"><span className="text-rgb-30-30-30">How It Works</span></p>
                                    <p className="text-30">
                                        <span className="text-rgb-117-117-117">
                                            Silent Signal uses real-time mic input to monitor background noise levels and frequency patterns. Our backend processes the data and alerts users if ambient noise exceeds acceptable limits, all while respecting privacy and minimizing false positives. It works quietly in the background, helping teams focus better without interruptions.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card-34">
                            <div className="body-36">
                                <div className="text-37">
                                    <p className="text-38"><span className="text-rgb-30-30-30">Why It Matters</span></p>
                                    <p className="text-39">
                                        <span className="text-rgb-117-117-117">
                                            In remote team environments, small distractions can lead to major losses in focus. Our app helps maintain a respectful and professional audio space — perfect for open offices, shared homes, or global team meetings. It’s a subtle way to reduce friction and boost productivity.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card-43">
                            <div className="body-45">
                                <div className="text-46">
                                    <p className="text-47"><span className="text-rgb-30-30-30">Built by Remote Workers</span></p>
                                    <p className="text-48">
                                        <span className="text-rgb-117-117-117">
                                            We’re students, developers, and designers who experienced the struggle of noisy calls firsthand. Silent Signal is our answer — a tool made for the community, by the community. Every feature reflects real pain points we’ve lived through and solved together. It's built with care, not just code.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
