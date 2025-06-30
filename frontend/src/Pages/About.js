import React from "react";
import "../styles/aboutus.css";

const About = () => {
    return (
        <div>
            <div className="hero-basic-13">
                <div className="text-content-title-14">
                    <p className="text-15"><span className="text-rgb-30-30-30">About Us</span></p>
                    <p className="text-16"><span className="text-rgb-117-117-117">Silent Signal Devs</span></p>
                </div>
            </div>
            <div className="node-20">
                <div className="text-content-heading-21">
                    <p className="text-22"><span className="text-rgb-30-30-30">Our Development Journey</span></p>
                    <p className="text-23"><span className="text-rgb-117-117-117">Building tools to make remote work more focused</span></p>
                </div>
                <div className="cards-24">
                    <div className="card-25">
                        <img src="images/image-26.png" className="image-26" alt="Design Process" />
                        <div className="body-27">
                            <div className="text-28">
                                <p className="text-29"><span className="text-rgb-30-30-30">Ideation & Research</span></p>
                                <p className="text-30">
                                    <span className="text-rgb-117-117-117">
                                        We started by identifying a common pain point: distracting background noise in remote meetings. We interviewed remote workers and explored existing tools to validate the problem.
                                        Our research showed a clear gap — no real-time, non-intrusive solution existed. That insight became the foundation of Silent Signal. We focused on creating a solution that’s helpful, not disruptive.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="card-34">
                        <img src="images/image-35.png" className="image-35" alt="Development" />
                        <div className="body-36">
                            <div className="text-37">
                                <p className="text-38"><span className="text-rgb-30-30-30">Building the Engine</span></p>
                                <p className="text-39">
                                    <span className="text-rgb-117-117-117">
                                        Using React, Python, and AWS, we engineered a system to analyze mic input in real-time and detect noise violations. We iterated quickly and relied on user feedback to shape the core functionality.
                                        Behind the scenes, we optimized the ML model for speed and accuracy, ensuring minimal latency. We also implemented thresholds to reduce false positives and alert fatigue.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="card-43">
                        <img src="images/image-44.png" className="image-44" alt="Testing" />
                        <div className="body-45">
                            <div className="text-46">
                                <p className="text-47"><span className="text-rgb-30-30-30">Launch & Lessons</span></p>
                                <p className="text-48">
                                    <span className="text-rgb-117-117-117">
                                        After launching our MVP, we focused on usability and performance. One of our key takeaways: balancing privacy with functionality is crucial when working with real-time audio data.
                                        We also learned the importance of edge-case testing and ensuring compatibility across browsers and devices. The feedback loop from users played a critical role in stabilizing and refining the platform.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="team-section">
                <h2 className="team-title">Meet the Team</h2>
                <div className="team-grid">
                    <div className="team-member">
                        <img src="/images/rayu_pfp.png" alt="Chirayu Shah" className="team-img" />
                        <h3 className="member-name">Chirayu Shah</h3>
                        <p className="member-bio">
                            Krish and I collaborated equally on both the frontend and backend of Silent Signal. From designing intuitive UI components to implementing real-time audio monitoring and configuring serverless functions, we built each part of the system together. I especially enjoyed the challenge of making the app responsive and privacy-focused while working side-by-side on core logic and deployment tasks.
                        </p>

                    </div>
                    <div className="team-member">
                        <img src="/images/krish_pfp.png" alt="Krish Rajani" className="team-img" />
                        <h3 className="member-name">Krish Rajani</h3>
                        <p className="member-bio">
                            Chirayu and I worked hand-in-hand on every layer of Silent Signal, equally dividing frontend and backend responsibilities. We built real-time features, set up cloud infrastructure, and refined the UI together. I really valued our collaborative workflow, especially how we tackled tough problems in tandem and kept the user experience and performance at the center of our development process.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
