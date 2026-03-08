"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fmtN } from "../lib/format";

export default function YoutubeMonetizationChecker() {
    const [monMode, setMonMode] = useState<"standard" | "shorts">("standard");

    const [subscribers, setSubscribers] = useState<number | "">(450);
    const [watchHours, setWatchHours] = useState<number | "">(1200);
    const [avgViews, setAvgViews] = useState<number | "">(500);
    const [avgDuration, setAvgDuration] = useState<number | "">(8);

    const [subscribersShorts, setSubscribersShorts] = useState<number | "">(450);
    const [shortsViews, setShortsViews] = useState<number | "">(500000);
    const [avgShortsViews, setAvgShortsViews] = useState<number | "">(5000);

    const [videosPerWeek, setVideosPerWeek] = useState("0");
    const [videosPerMonth, setVideosPerMonth] = useState("0");
    const [timeToGoal, setTimeToGoal] = useState("0");
    const [estimatedMonths, setEstimatedMonths] = useState("0");

    const [subsProgressText, setSubsProgressText] = useState("0 / 1,000");
    const [req2ProgressText, setReq2ProgressText] = useState("0 / 4,000");
    const [subsRemaining, setSubsRemaining] = useState("0");
    const [req2Remaining, setReq2Remaining] = useState("0");
    const [overallProgressText, setOverallProgressText] = useState("0%");

    const [subsPercent, setSubsPercent] = useState(0);
    const [req2Percent, setReq2Percent] = useState(0);

    const [isEligible, setIsEligible] = useState(false);
    const [insightMessage, setInsightMessage] = useState("");
    const [goalsHTML, setGoalsHTML] = useState<React.ReactNode>("");

    const [isChecking, setIsChecking] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const getProgressBarColor = (percent: number) => {
        if (percent >= 100) return "linear-gradient(90deg, #10b981 0%, #059669 100%)";
        if (percent >= 75) return "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)";
        if (percent >= 50) return "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)";
        return "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)";
    };

    const calculateMonetization = () => {
        let subsVal = 0;
        let req2Current = 0;
        let req2Target = 0;

        if (monMode === "standard") {
            subsVal = Number(subscribers) || 0;
            req2Current = Number(watchHours) || 0;
            req2Target = 4000;
            const avgV = Number(avgViews) || 0;
            const avgD = Number(avgDuration) || 0;

            const watchHoursPerVideo = (avgV * avgD) / 60;
            const remainingHours = Math.max(0, req2Target - req2Current);
            const videosNeeded = watchHoursPerVideo > 0 ? Math.ceil(remainingHours / watchHoursPerVideo) : 0;

            const vPerWeek = videosNeeded > 52 ? 2 : videosNeeded > 26 ? 3 : 4;
            const weeksToGoal = Math.ceil(videosNeeded / vPerWeek);
            const monthsToGoal = Math.ceil(weeksToGoal / 4);

            setVideosPerWeek(vPerWeek.toFixed(0));
            setVideosPerMonth((vPerWeek * 4).toFixed(0));
            setTimeToGoal(monthsToGoal.toString());
            setEstimatedMonths(monthsToGoal.toString());
        } else {
            subsVal = Number(subscribersShorts) || 0;
            req2Current = Number(shortsViews) || 0;
            req2Target = 10000000;
            const avgS = Number(avgShortsViews) || 0;

            const remainingViews = Math.max(0, req2Target - req2Current);
            const shortsNeeded = avgS > 0 ? Math.ceil(remainingViews / avgS) : 0;

            const sPerWeek = shortsNeeded > 90 ? 10 : shortsNeeded > 45 ? 15 : 20;
            const weeksToGoal = Math.ceil(shortsNeeded / sPerWeek);
            const monthsToGoal = Math.ceil(weeksToGoal / 4);

            setVideosPerWeek(sPerWeek.toFixed(0));
            setVideosPerMonth((sPerWeek * 4).toFixed(0));
            setTimeToGoal(monthsToGoal.toString());
            setEstimatedMonths(monthsToGoal.toString());
        }

        const subsTarget = 1000;
        const sPercent = Math.min(100, (subsVal / subsTarget) * 100);
        const r2Percent = Math.min(100, (req2Current / req2Target) * 100);
        const oPercent = (sPercent + r2Percent) / 2;

        const eligible = subsVal >= subsTarget && req2Current >= req2Target;

        setSubsPercent(sPercent);
        setReq2Percent(r2Percent);
        setIsEligible(eligible);

        setSubsProgressText(`${fmtN(subsVal)} / 1,000`);
        setReq2ProgressText(
            monMode === "standard"
                ? `${fmtN(req2Current)} / 4,000`
                : `${fmtN(req2Current)} / 10M`
        );
        setSubsRemaining(Math.max(0, subsTarget - subsVal).toLocaleString());
        setReq2Remaining(Math.max(0, req2Target - req2Current).toLocaleString());
        setOverallProgressText(oPercent.toFixed(0) + "%");

        let msg = "";
        if (eligible) {
            msg = "Congratulations! You meet both requirements. Apply for YouTube Partner Program in YouTube Studio → Monetization.";
        } else if (sPercent >= 100) {
            msg = "You have enough subscribers. Focus on increasing watch time through longer videos and better retention.";
        } else if (r2Percent >= 100) {
            msg = "You have enough watch hours/views. Focus on gaining subscribers through compelling content and CTAs.";
        } else if (sPercent > r2Percent) {
            msg = "Subscribers are ahead of watch time. Create longer videos (8-12 min) to accelerate watch hour accumulation.";
        } else {
            msg = "Watch time is ahead of subscribers. Focus on converting viewers to subscribers with consistent uploads and channel branding.";
        }
        setInsightMessage(msg);

        const subsNeededHtml = Math.max(0, subsTarget - subsVal);
        const req2NeededHtml = Math.max(0, req2Target - req2Current);

        if (subsNeededHtml === 0 && req2NeededHtml === 0) {
            setGoalsHTML(<strong style={{ color: "#10b981" }}>✓ All requirements met!</strong>);
        } else {
            setGoalsHTML(
                <>
                    {subsNeededHtml > 0 && (
                        <>
                            <strong>{subsNeededHtml.toLocaleString()}</strong> more subscribers<br />
                        </>
                    )}
                    {req2NeededHtml > 0 && (
                        <>
                            <strong>{req2NeededHtml.toLocaleString()}</strong> more {monMode === "standard" ? "watch hours" : "Shorts views"}
                        </>
                    )}
                </>
            );
        }
    };

    useEffect(() => {
        calculateMonetization();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monMode, subscribers, watchHours, avgViews, avgDuration, subscribersShorts, shortsViews, avgShortsViews]);

    const handleCheck = () => {
        setIsChecking(true);
        setTimeout(() => {
            setIsChecking(false);
            if (window.innerWidth <= 768) {
                document.querySelector('.card-right')?.scrollIntoView({ behavior: 'smooth' });
            }
        }, 400);
    };

    const handleReset = () => {
        setIsResetting(true);
        setSubscribers(450);
        setWatchHours(1200);
        setAvgViews(500);
        setAvgDuration(8);
        setSubscribersShorts(450);
        setShortsViews(500000);
        setAvgShortsViews(5000);
        handleCheck();
        setTimeout(() => setIsResetting(false), 1200);
    };

    const handleCopy = () => {
        const textToCopy = `YouTube Monetization Status: ${isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE YET'}\nRequirements Progress:\nSubs: ${fmtN(Number(monMode === 'standard' ? subscribers : subscribersShorts))} / 1,000\n${monMode === 'standard' ? 'Hours' : 'Shorts Views'}: ${fmtN(Number(monMode === 'standard' ? watchHours : shortsViews))} / ${monMode === 'standard' ? '4,000' : '10M'}\nCheck yours at: https://incomefromviews.com/youtube-monetization-checker/`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = () => {
        let csv = "Metric,Value\n";
        csv += `Eligibility Status,${isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE YET'}\n`;
        csv += `Subscribers,${monMode === 'standard' ? subscribers : subscribersShorts}\n`;
        csv += `Target Subscribers,1000\n`;
        if (monMode === "standard") {
            csv += `Watch Hours,${watchHours}\n`;
            csv += `Target Watch Hours,4000\n`;
            csv += `Est. Months to Goal,${estimatedMonths}\n`;
        } else {
            csv += `Shorts Views,${shortsViews}\n`;
            csv += `Target Shorts Views,10000000\n`;
            csv += `Est. Months to Goal,${estimatedMonths}\n`;
        }

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "YouTube_Monetization_Status.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'YouTube Monetization Checker',
            text: `My YouTube Monetization Status: ${isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE YET'}`,
            url: 'https://incomefromviews.com/youtube-monetization-checker/',
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

    return (
        <div className="card">
            <div className="card-grid">
                <div className="card-left">
                    <div className="tabs">
                        <button className={`tab ${monMode === 'standard' ? 'on' : ''}`} onClick={() => setMonMode('standard')}>Long-Form Path</button>
                        <button className={`tab ${monMode === 'shorts' ? 'on' : ''}`} onClick={() => setMonMode('shorts')}>Shorts Path</button>
                    </div>

                    {monMode === 'standard' && (
                        <div id="mon-standard">
                            <div className="form-group">
                                <label>Total Subscribers <span className="tip-wrap"><span className="tip-icon">i</span><span className="tip-text">Current subscriber count from YouTube Studio.</span></span></label>
                                <input type="number" value={subscribers} onChange={(e) => setSubscribers(e.target.value === "" ? "" : Number(e.target.value))} />
                            </div>
                            <div className="form-group">
                                <label>Watch Hours (Last 12 Months)</label>
                                <input type="number" value={watchHours} step="1" onChange={(e) => setWatchHours(e.target.value === "" ? "" : Number(e.target.value))} />
                                <div className="calc-input-helper">From YouTube Studio &rarr; Analytics &rarr; Monetization</div>
                            </div>
                            <div className="form-group">
                                <label>Average Views Per Video</label>
                                <input type="number" value={avgViews} onChange={(e) => setAvgViews(e.target.value === "" ? "" : Number(e.target.value))} />
                            </div>
                            <div className="form-group">
                                <label>Average Video Duration (minutes)</label>
                                <input type="number" value={avgDuration} step="0.5" onChange={(e) => setAvgDuration(e.target.value === "" ? "" : Number(e.target.value))} />
                            </div>
                        </div>
                    )}

                    {monMode === 'shorts' && (
                        <div id="mon-shorts">
                            <div className="form-group">
                                <label>Total Subscribers</label>
                                <input type="number" value={subscribersShorts} onChange={(e) => setSubscribersShorts(e.target.value === "" ? "" : Number(e.target.value))} />
                            </div>
                            <div className="form-group">
                                <label>Shorts Views (Last 90 Days)</label>
                                <input type="number" value={shortsViews} step="10000" onChange={(e) => setShortsViews(e.target.value === "" ? "" : Number(e.target.value))} />
                                <div className="calc-input-helper">From YouTube Studio &rarr; Analytics (Shorts only)</div>
                            </div>
                            <div className="form-group">
                                <label>Average Shorts Views Per Upload</label>
                                <input type="number" value={avgShortsViews} onChange={(e) => setAvgShortsViews(e.target.value === "" ? "" : Number(e.target.value))} />
                            </div>
                        </div>
                    )}

                    <p className="auto-note">
                        💡 All values should come from YouTube Studio Analytics.
                    </p>

                    <div className="calc-action-row">
                        <button className={`btn-primary ${isChecking ? 'loading' : ''}`} onClick={handleCheck}>
                            {isChecking ? '⏳ Checking...' : '⚡ Check Eligibility'}
                        </button>
                        <button className={isResetting ? "btn-ghost text-green-500" : "btn-ghost"} onClick={handleReset}>
                            {isResetting ? '✓ Reset' : '↺ Reset'}
                        </button>
                    </div>

                    <div className="insight-box" style={{ marginTop: 20 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>📊 Progress Analysis</div>
                        <div style={{ fontSize: "0.95rem", color: "var(--text-600)" }}>{insightMessage}</div>
                    </div>

                    <div className="goal-box" style={{ marginTop: 20 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>🎯 What You Need</div>
                        <div style={{ fontSize: "0.9rem", color: "var(--text-600)" }}>{goalsHTML}</div>
                    </div>
                </div>

                <div className="card-right">
                    <div
                        className={`status-badge ${isEligible ? 'status-eligible' : 'status-not-eligible'}`}
                        style={{
                            width: "100%",
                            marginBottom: "1.5rem",
                            padding: "14px",
                            borderRadius: "8px",
                            fontWeight: "700",
                            fontSize: "1.05rem",
                            textAlign: "center",
                            backgroundColor: isEligible ? "var(--green-l)" : "var(--red-l)",
                            color: isEligible ? "var(--green)" : "var(--red)",
                            border: `2px solid ${isEligible ? 'var(--green)' : 'var(--red)'}`
                        }}
                    >
                        {isEligible ? "✓ ELIGIBLE FOR MONETIZATION" : "✗ NOT ELIGIBLE YET"}
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <div style={{ marginBottom: "1rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                                <span style={{ fontWeight: 600 }}>Subscribers</span>
                                <span>{subsProgressText}</span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${subsPercent}%`, background: getProgressBarColor(subsPercent), transition: "width 0.3s ease" }}></div>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                                <span style={{ fontWeight: 600 }}>{monMode === 'standard' ? 'Watch Hours' : 'Shorts Views'}</span>
                                <span>{req2ProgressText}</span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${req2Percent}%`, background: getProgressBarColor(req2Percent), transition: "width 0.3s ease" }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="breakdown">
                        <div className="bd-item">
                            <div className="bd-val">{subsRemaining}</div>
                            <div className="bd-label">Subs Remaining</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val">{req2Remaining}</div>
                            <div className="bd-label">{monMode === 'standard' ? 'Hours' : 'Views'} Remaining</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val">{estimatedMonths}</div>
                            <div className="bd-label">Est. Months</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val">{overallProgressText}</div>
                            <div className="bd-label">Overall Progress</div>
                        </div>
                    </div>

                    <div className="formula mt-20 text-center">
                        {monMode === 'standard' ? 'Requirements: 1,000 subs + 4,000 hours' : 'Requirements: 1,000 subs + 10M Shorts views'}
                    </div>

                    <div style={{ marginTop: 20, padding: 16, background: "#eff6ff", border: "2px solid #3B82F6", borderRadius: 8 }}>
                        <div style={{ fontWeight: 700, marginBottom: 12, color: "#1e40af" }}>📅 Upload Frequency Needed</div>
                        <div style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "#1e40af" }}>
                            <div>Weekly: <strong>{videosPerWeek}</strong> videos</div>
                            <div>Monthly: <strong>{videosPerMonth}</strong> videos</div>
                            <div>To reach goal in: <strong>{timeToGoal}</strong> months</div>
                        </div>
                    </div>

                    <div className="action-row mt-16">
                        <button className="act-btn" onClick={handleCopy}>{copied ? "✓ Copied" : "⎘ Copy"}</button>
                        <button className="act-btn" onClick={handleExport}>&darr; Export</button>
                        <button className="act-btn" onClick={handleShare}>&uarr; Share</button>
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <Link href="/youtube-watch-time-calculator/" className="cta-mini" style={{ textDecoration: "none" }}>
                            👉 Calculate watch time progress in detail &rarr;
                        </Link>
                    </div>
                    <div>
                        <Link href="/youtube-earnings-calculator/" className="cta-mini" style={{ textDecoration: "none" }}>
                            👉 Estimate your earnings after monetization &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
