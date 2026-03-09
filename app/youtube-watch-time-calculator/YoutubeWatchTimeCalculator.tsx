"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fmtN } from "../lib/format";

export default function YoutubeWatchTimeCalculator() {
    const [watchMode, setWatchMode] = useState<"progress" | "required">("progress");

    // Inputs (Progress Mode)
    const [totalViews, setTotalViews] = useState<number | "">(25000);
    const [avgDuration, setAvgDuration] = useState<number | "">(5);
    const [targetHours, setTargetHours] = useState<number | "">(4000);

    // Inputs (Required Mode)
    const [avgDuration2, setAvgDuration2] = useState<number | "">(5);
    const [targetHours2, setTargetHours2] = useState<number | "">(4000);
    const [currentHours, setCurrentHoursInp] = useState<number | "">(0);

    // Outputs
    const [currentWatchTimeOut, setCurrentWatchTimeOut] = useState("0 hours");
    const [remainingHoursOut, setRemainingHoursOut] = useState("4,000");
    const [viewsNeededOut, setViewsNeededOut] = useState("0");
    const [avgViewDurationOut, setAvgViewDurationOut] = useState("0 min");
    const [totalChannelViewsOut, setTotalChannelViewsOut] = useState("0");
    const [progressPercentOut, setProgressPercentOut] = useState("0%");
    const [progressPercentNum, setProgressPercentNum] = useState(0);

    // Retention comparison
    const [views3minOut, setViews3minOut] = useState("0");
    const [views5minOut, setViews5minOut] = useState("0");
    const [views8minOut, setViews8minOut] = useState("0");
    const [views12minOut, setViews12minOut] = useState("0");

    const [watchFormulaOut, setWatchFormulaOut] = useState("Watch Time = Views × Duration ÷ 60");

    const [insightMessage, setInsightMessage] = useState("");
    const [goalsHTML, setGoalsHTML] = useState<React.ReactNode>("");

    const [isCalculating, setIsCalculating] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [copied, setCopied] = useState(false);

    const calcWatchTime = () => {
        let currentHrs = 0;
        let pTargetHours = 4000;
        let pAvgDuration = 5;
        let pTotalViews = 0;
        let viewsNeeded = 0;

        if (watchMode === "progress") {
            pTotalViews = Number(totalViews) || 0;
            pAvgDuration = Number(avgDuration) || 0;
            pTargetHours = Number(targetHours) || 0;

            // Calculate current watch time
            currentHrs = pAvgDuration > 0 ? (pTotalViews * pAvgDuration) / 60 : 0;

            // Calculate views needed for remaining hours
            const remainingHours = Math.max(0, pTargetHours - currentHrs);
            viewsNeeded = pAvgDuration > 0 ? Math.ceil((remainingHours * 60) / pAvgDuration) : 0;

        } else {
            pAvgDuration = Number(avgDuration2) || 0;
            pTargetHours = Number(targetHours2) || 0;
            const existingHours = Number(currentHours) || 0;

            const hoursNeeded = Math.max(0, pTargetHours - existingHours);
            viewsNeeded = pAvgDuration > 0 ? Math.ceil((hoursNeeded * 60) / pAvgDuration) : 0;
            currentHrs = existingHours;
            pTotalViews = pAvgDuration > 0 ? Math.ceil((existingHours * 60) / pAvgDuration) : 0;
        }

        // Calculate progress percentage
        let progressPercent = 0;
        if (pTargetHours > 0) {
            progressPercent = Math.min(100, (currentHrs / pTargetHours) * 100);
        }

        // Calculate retention comparison
        const views3min = Math.ceil((pTargetHours * 60) / 3);
        const views5min = Math.ceil((pTargetHours * 60) / 5);
        const views8min = Math.ceil((pTargetHours * 60) / 8);
        const views12min = Math.ceil((pTargetHours * 60) / 12);

        // Display results
        setCurrentWatchTimeOut(currentHrs.toFixed(0) + " hours");
        setRemainingHoursOut(Math.max(0, pTargetHours - currentHrs).toFixed(0));
        setViewsNeededOut(fmtN(Math.max(0, viewsNeeded)));
        setAvgViewDurationOut(pAvgDuration.toFixed(1) + " min");
        setTotalChannelViewsOut(fmtN(pTotalViews));
        setProgressPercentOut(progressPercent.toFixed(1) + "%");
        setProgressPercentNum(progressPercent);

        // Update retention comparison
        setViews3minOut(fmtN(views3min));
        setViews5minOut(fmtN(views5min));
        setViews8minOut(fmtN(views8min));
        setViews12minOut(fmtN(views12min));

        setWatchFormulaOut(`Watch Time = ${fmtN(pTotalViews)} × ${pAvgDuration.toFixed(1)}min ÷ 60 = ${currentHrs.toFixed(0)}h`);

        // Insights
        let message = "";
        if (progressPercent >= 100) {
            message = "Congratulations! You've reached the 4,000-hour requirement. Make sure you also have 1,000 subscribers to apply for monetization.";
        } else if (progressPercent >= 75) {
            message = "You're in the final stretch. Focus on maintaining consistent uploads and improving retention to hit 4,000 hours soon.";
        } else if (progressPercent >= 50) {
            message = "You're halfway there! Your current pace is good. Consider creating longer videos (8-12 min) to accelerate progress.";
        } else if (progressPercent >= 25) {
            message = "You're making progress. Focus on videos with strong hooks to improve average view duration and reach 4,000 hours faster.";
        } else {
            message = "You're in the early stages. Create 8-12 minute videos with high retention rates to build watch time efficiently.";
        }
        setInsightMessage(message);

        // Goals
        const videosAt100Views = Math.ceil(viewsNeeded / 100);
        const videosAt500Views = Math.ceil(viewsNeeded / 500);
        const videosAt1000Views = Math.ceil(viewsNeeded / 1000);

        if (viewsNeeded > 0) {
            setGoalsHTML(
                <>
                    At 100 views/video: <strong>{videosAt100Views.toLocaleString()}</strong> videos needed<br />
                    At 500 views/video: <strong>{videosAt500Views.toLocaleString()}</strong> videos needed<br />
                    At 1,000 views/video: <strong>{videosAt1000Views.toLocaleString()}</strong> videos needed
                </>
            );
        } else {
            setGoalsHTML(
                <>
                    <strong style={{ color: "#10b981" }}>✓ Goal reached!</strong> Ready to apply for monetization.
                </>
            );
        }
    };

    useEffect(() => {
        calcWatchTime();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchMode, totalViews, avgDuration, targetHours, avgDuration2, targetHours2, currentHours]);

    const handleCalculate = () => {
        setIsCalculating(true);
        setTimeout(() => {
            setIsCalculating(false);
            if (window.innerWidth <= 768) {
                document.querySelector('.output-hero')?.scrollIntoView({ behavior: 'smooth' });
            }
        }, 400);
    };

    const handleReset = () => {
        setIsResetting(true);
        setTotalViews(25000);
        setAvgDuration(5);
        setTargetHours(4000);
        setAvgDuration2(5);
        setTargetHours2(4000);
        setCurrentHoursInp(0);
        handleCalculate();
        setTimeout(() => setIsResetting(false), 1200);
    };

    const handleCopy = () => {
        const textToCopy = `YouTube Watch Time Estimate\nCurrent Watch Time: ${currentWatchTimeOut}\nProgress: ${progressPercentOut}\nTarget: ${targetHours || targetHours2} hours\nViews Needed: ${viewsNeededOut}\nCheck your progress at: https://incomefromviews.com/youtube-watch-time-calculator/`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = () => {
        let csv = "Metric,Value\n";
        csv += `Current Watch Time,${currentWatchTimeOut}\n`;
        csv += `Progress,${progressPercentOut}\n`;
        csv += `Hours Remaining,${remainingHoursOut}\n`;
        csv += `Views Needed,${viewsNeededOut.replace(/,/g, "")}\n`;
        csv += `Avg View Duration,${avgViewDurationOut}\n`;
        csv += `Total Channel Views,${totalChannelViewsOut.replace(/,/g, "")}\n`;

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "YouTube_Watch_Time.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'YouTube Watch Time Estimator',
            text: `My YouTube watch time progress is ${progressPercentOut}! Calculate your 4,000 hour progress here.`,
            url: 'https://incomefromviews.com/youtube-watch-time-calculator/',
        };
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Share failed", err);
            }
        } else {
            handleCopy();
        }
    };

    // Calculate background based on progress correctly
    let barBg = "";
    if (progressPercentNum >= 100) {
        barBg = "linear-gradient(90deg, #10b981 0%, #059669 100%)";
    } else if (progressPercentNum >= 75) {
        barBg = "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)";
    } else if (progressPercentNum >= 50) {
        barBg = "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)";
    } else {
        barBg = "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)";
    }

    return (
        <div className="card">
            <div className="card-grid">
                <div className="card-left">
                    <div className="tabs">
                        <button className={`tab ${watchMode === 'progress' ? 'on' : ''}`} onClick={() => setWatchMode('progress')}>Watch Time Progress</button>
                        <button className={`tab ${watchMode === 'required' ? 'on' : ''}`} onClick={() => setWatchMode('required')}>Views Needed</button>
                    </div>

                    {watchMode === 'progress' && (
                        <div id="watch-progress">
                            <div className="form-group">
                                <label>Total Channel Views <span className="tip-wrap"><span className="tip-icon">i</span><span className="tip-text">Total views across all your videos in the last 12 months.</span></span></label>
                                <input type="number" value={totalViews} onChange={(e) => setTotalViews(e.target.value === "" ? "" : Number(e.target.value))} />
                            </div>
                            <div className="form-group">
                                <label>Average View Duration (minutes)</label>
                                <input type="number" value={avgDuration} step="0.1" onChange={(e) => setAvgDuration(e.target.value === "" ? "" : Number(e.target.value))} />
                                <div className="calc-input-helper">From YouTube Analytics &rarr; Engagement &rarr; Average view duration</div>
                            </div>
                            <div className="form-group">
                                <label>Target Watch Hours</label>
                                <input type="number" value={targetHours} onChange={(e) => setTargetHours(e.target.value === "" ? "" : Number(e.target.value))} />
                                <div className="calc-input-helper">Default: 4,000 (monetization requirement)</div>
                            </div>
                        </div>
                    )}

                    {watchMode === 'required' && (
                        <div id="watch-required">
                            <div className="form-group">
                                <label>Average View Duration (minutes)</label>
                                <input type="number" value={avgDuration2} step="0.1" onChange={(e) => setAvgDuration2(e.target.value === "" ? "" : Number(e.target.value))} />
                                <div className="calc-input-helper">Your typical viewer retention time per video</div>
                            </div>
                            <div className="form-group">
                                <label>Target Watch Hours</label>
                                <input type="number" value={targetHours2} onChange={(e) => setTargetHours2(e.target.value === "" ? "" : Number(e.target.value))} />
                            </div>
                            <div className="form-group">
                                <label>Current Watch Hours (optional)</label>
                                <input type="number" value={currentHours} onChange={(e) => setCurrentHoursInp(e.target.value === "" ? "" : Number(e.target.value))} />
                                <div className="calc-input-helper">Leave at 0 to see total views needed</div>
                            </div>
                        </div>
                    )}

                    <p className="auto-note">
                        💡 Tip: Higher retention means fewer views needed for monetization.
                    </p>

                    <button className={`btn-primary ${isCalculating ? "loading" : ""}`} onClick={handleCalculate}>
                        {isCalculating ? "⏳ Calculating..." : "⚡ Calculate Watch Time"}
                    </button>
                    <button className={isResetting ? "btn-ghost text-green-500" : "btn-ghost"} onClick={handleReset}>
                        {isResetting ? "✓ Reset" : "↺ Reset"}
                    </button>

                    <div className="insight-box" style={{ marginTop: 20 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>📊 Progress Analysis</div>
                        <div style={{ fontSize: "0.95rem", color: "var(--text-600)" }}>{insightMessage}</div>
                    </div>
                    <div className="goal-box" style={{ marginTop: 20 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>🎯 Monetization Timeline</div>
                        <div style={{ fontSize: "0.9rem", color: "var(--text-600)" }}>{goalsHTML}</div>
                    </div>

                </div>

                <div className="card-right">
                    <div className="output-hero bg-gradient-yt-card">
                        <div className="output-label">Current Watch Time</div>
                        <div className="output-value">{currentWatchTimeOut}</div>
                        <div className="output-sub">toward 4,000 hour requirement</div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ margin: "1.5rem 0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
                            <span>Monetization Progress</span>
                            <span>{progressPercentOut}</span>
                        </div>
                        <div style={{ width: "100%", height: "24px", background: "#e5e7eb", borderRadius: "12px", overflow: "hidden", margin: "1rem 0" }}>
                            <div style={{
                                width: `${progressPercentNum}%`,
                                height: "100%",
                                background: barBg,
                                transition: "width 0.3s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: 600,
                                fontSize: "0.875rem"
                            }}>
                                <span>{progressPercentNum > 15 ? `${progressPercentNum.toFixed(0)}%` : ""}</span>
                            </div>
                        </div>
                    </div>


                    <div className="breakdown">
                        <div className="bd-item">
                            <div className="bd-val">{remainingHoursOut}</div>
                            <div className="bd-label">Hours Remaining</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val">{viewsNeededOut}</div>
                            <div className="bd-label">Views Needed</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val">{avgViewDurationOut}</div>
                            <div className="bd-label">Avg Duration</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val">{totalChannelViewsOut}</div>
                            <div className="bd-label">Total Views</div>
                        </div>
                    </div>

                    <div className="formula mt-20 text-center">{watchFormulaOut}</div>

                    {/* Retention Comparison */}
                    <div style={{ marginTop: 20, padding: 16, background: "#eff6ff", border: "2px solid #3B82F6", borderRadius: 8 }}>
                        <div style={{ fontWeight: 700, marginBottom: 12, color: "#1e40af" }}>📊 Views Needed by Retention</div>
                        <div style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "#1e40af" }}>
                            <div>3 min avg: <strong>{views3minOut}</strong> views</div>
                            <div>5 min avg: <strong>{views5minOut}</strong> views</div>
                            <div>8 min avg: <strong>{views8minOut}</strong> views</div>
                            <div>12 min avg: <strong>{views12minOut}</strong> views</div>
                        </div>
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #3B82F6", fontSize: "0.85rem", color: "#1e40af" }}>
                            Better retention = fewer views needed
                        </div>
                    </div>

                    <div className="action-row" style={{ marginTop: 16 }}>
                        <button className="act-btn" onClick={handleCopy}>{copied ? "✓ Copied" : "⎘ Copy"}</button>
                        <button className="act-btn" onClick={handleExport}>↓ Export</button>
                        <button className="act-btn" onClick={handleShare}>⤴ Share</button>
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <Link href="/youtube-earnings-calculator/" className="cta-mini" style={{ textDecoration: "none" }}>
                            👉 Calculate your earnings after monetization &rarr;
                        </Link>
                    </div>
                    <div>
                        <Link href="/blog/how-to-earn-money-on-youtube/" className="cta-mini" style={{ textDecoration: "none" }}>
                            👉 Complete YouTube monetization guide &rarr;
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
