import React from 'react';
import Header from './components/Header';
import MicMonitor from './components/MicMonitor';
import ReadingHistory from './components/ReadingHistory';
import PaddingContainer from './components/PaddingContainer';

function App() {
  const userId = "rayu";

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <PaddingContainer>
        <Header userID={userId} />
        <MicMonitor userId={userId} />
        <ReadingHistory userId={userId} />
      </PaddingContainer>

      <h3>Metrics to add:</h3>

      <h2>1. Basic Sound-Level Metrics</h2>
      <ul>
        <li>
          <strong>Decibel History</strong><br />
          Record and plot every reading (e.g. every 2 s) so you can compute:
          <ul>
            <li><strong>Average dB</strong> per meeting</li>
            <li><strong>Maximum dB</strong> spike</li>
            <li><strong>Median / 90th Percentile dB</strong></li>
          </ul>
        </li>
        <li>
          <strong>Time Above Threshold</strong><br />
          Percentage of meeting time that each user’s mic was over your “quiet” threshold.
        </li>
      </ul>
      <hr />

      <h2>2. Event-Based Metrics</h2>
      <ul>
        <li>
          <strong>Noise Event Count</strong><br />
          Number of separate “violations” (i.e. times noise crossed threshold).
        </li>
        <li>
          <strong>Noise Duration</strong><br />
          Total cumulative seconds of noise-per-violation (how long each violation lasts).
        </li>
        <li>
          <strong>Time to Mute</strong><br />
          How long between our nudge (“please mute”) and the user actually mutes.
        </li>
      </ul>
      <hr />

      <h2>3. Focus &amp; Disruption Metrics</h2>
      <ul>
        <li>
          <strong>Noise-Free Streaks</strong><br />
          Longest continuous interval without a violation—good proxy for user focus.
        </li>
        <li>
          <strong>Focus Score</strong><br />
          <pre>Focus Score = 100 × (Total Quiet Time) / (Meeting Length)</pre>
        </li>
        <li>
          <strong>Distraction Index</strong><br />
          Weighted sum of event count and average event duration (higher = more distracting).
        </li>
      </ul>
      <hr />

      <h2>4. Audio-Quality Metrics</h2>
      <ul>
        <li>
          <strong>Signal-to-Noise Ratio (SNR)</strong><br />
          Estimate of user’s voice level vs. background noise level when they speak.
        </li>
        <li>
          <strong>Speech Clarity</strong><br />
          If you integrate a simple ML model, track % of time the speech band (300–3400 Hz) dominates.
        </li>
      </ul>
      <hr />

      <h2>5. Noise-Type &amp; Frequency Metrics</h2>
      <ul>
        <li>
          <strong>Type Breakdown</strong><br />
          Count/classify events into “dog,” “traffic,” “construction,” etc. (with Amazon Bedrock).
        </li>
        <li>
          <strong>Frequency Band Analysis</strong><br />
          Track energy in low (&lt; 500 Hz), mid (500–2000 Hz), high (&gt; 2000 Hz) bands to spot different noise sources.
        </li>
      </ul>
      <hr />

      <h2>6. Cumulative &amp; Health Metrics</h2>
      <ul>
        <li>
          <strong>dB-Hours</strong><br />
          <pre>∑ (dB level × duration)</pre>
          as an exposure metric—higher values risk fatigue.
        </li>
        <li>
          <strong>Weekly Noise Budget</strong><br />
          Let users set a max “quiet budget” (e.g. 10 dB-hours/week); warn when they’re close.
        </li>
      </ul>
      <hr />

      <h2>7. Compliance &amp; Improvement Metrics</h2>
      <ul>
        <li>
          <strong>Nudge Compliance Rate</strong><br />
          % of nudges that resulted in a user muting or reducing noise.
        </li>
        <li>
          <strong>Quiet Streak Leaderboard</strong><br />
          Number of consecutive meetings with zero violations.
        </li>
      </ul>
      <hr />

      <h2>8. Team &amp; Location Insights</h2>
      <ul>
        <li>
          <strong>Team Noise Score</strong><br />
          Aggregate (average or sum) of all team members’ Focus Scores per meeting or week.
        </li>
        <li>
          <strong>Geographic Heatmap</strong><br />
          Show average dB or event counts by city / time zone.
        </li>
      </ul>
      <hr />

      <h2>9. Temporal &amp; Behavioral Metrics</h2>
      <ul>
        <li>
          <strong>Peak Noise Times</strong><br />
          Hour-of-day or day-of-week when noise violations spike.
        </li>
        <li>
          <strong>User Reaction Time</strong><br />
          How quickly each user responds to a nudge across meetings.
        </li>
      </ul>

    </div>
  );
}

export default App;
