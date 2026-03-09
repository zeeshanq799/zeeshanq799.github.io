"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fmt, fmtN } from "../lib/format";

export default function YoutubeSponsorshipCalculator() {
    const [sponsorMode, setSponsorMode] = useState<"simple" | "advanced">("simple");

    // Inputs
    const [sponsorViews, setSponsorViews] = useState<number | "">(50000);
    const [sponsorViews2, setSponsorViews2] = useState<number | "">(50000);
    const [baseCPM, setBaseCPM] = useState<number | "">(20);
    const [nicheMulti, setNicheMulti] = useState<number>(1.0);
    const [nicheMulti2, setNicheMulti2] = useState<number>(1.0);
    const [tierMulti, setTierMulti] = useState<number>(1.5);
    const [tierMulti2, setTierMulti2] = useState<number>(1.5);
    const [engagementRate, setEngagementRate] = useState<number | "">(4);
    const [integrationType, setIntegrationType] = useState<number>(2.0);

    // Outputs
    const [sponsorRateOut, setSponsorRateOut] = useState("$0");
    const [lowRateOut, setLowRateOut] = useState("$0");
    const [highRateOut, setHighRateOut] = useState("$0");
    const [effectiveCPMOut, setEffectiveCPMOut] = useState("$0");
    const [per10VideosOut, setPer10VideosOut] = useState("$0");
    const [monthlyPotentialOut, setMonthlyPotentialOut] = useState("$0");
    const [yearlyPotentialOut, setYearlyPotentialOut] = useState("$0");
    const [afterAgencyOut, setAfterAgencyOut] = useState("$0");
    const [vsAdRevenueOut, setVsAdRevenueOut] = useState("0x");

    const [sponsorFormulaOut, setSponsorFormulaOut] = useState("Rate = (Views / 1000) × Brand CPM");

    const [insightMessage, setInsightMessage] = useState("");
    const [goalsHTML, setGoalsHTML] = useState<React.ReactNode>("");

    const [isCalculating, setIsCalculating] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [copied, setCopied] = useState(false);

    const calcSponsor = () => {
        let views = 0;
        let pBaseCPM = 20;
        let pNicheMulti = 1.0;
        let pTierMulti = 1.0;
        let engagementBonus = 1.0;

        if (sponsorMode === "simple") {
            views = Number(sponsorViews) || 0;
            pBaseCPM = 20;
            pNicheMulti = nicheMulti;
            pTierMulti = tierMulti;
            engagementBonus = 1.0;
        } else {
            views = Number(sponsorViews2) || 0;
            pBaseCPM = Number(baseCPM) || 0;
            pNicheMulti = nicheMulti2;
            pTierMulti = tierMulti2;
            const engagement = Number(engagementRate) || 0;
            engagementBonus = engagement > 6 ? 1.5 : engagement > 4 ? 1.3 : engagement > 3 ? 1.2 : 1.0;
        }

        const pIntegrationType = integrationType;

        // Calculate effective brand CPM
        const effectiveCPM = pBaseCPM * pNicheMulti * pTierMulti * engagementBonus;

        // Calculate sponsorship rate
        const baseRate = (views / 1000) * effectiveCPM;
        const finalRate = baseRate * pIntegrationType;

        // Calculate ranges (±25%)
        const lowRate = finalRate * 0.75;
        const highRate = finalRate * 1.25;

        // Calculate projections
        const per10Videos = finalRate * 10;
        const monthlyPotential = finalRate * 4; // 1 deal per week
        const yearlyPotential = finalRate * 48; // 4 per month
        const afterAgency = finalRate * 0.85; // 15% agency commission

        // Compare to ad revenue (assume $4 RPM)
        const adRevenue = (views / 1000) * 4;
        const vsAdRevenue = adRevenue > 0 ? (finalRate / adRevenue).toFixed(1) : "0.0";

        // Display results
        setSponsorRateOut(fmt(finalRate));
        setLowRateOut(fmt(lowRate));
        setHighRateOut(fmt(highRate));
        setEffectiveCPMOut("$" + effectiveCPM.toFixed(2));
        setPer10VideosOut(fmt(per10Videos));
        setMonthlyPotentialOut(fmt(monthlyPotential));
        setYearlyPotentialOut(fmt(yearlyPotential));
        setAfterAgencyOut(fmt(afterAgency));
        setVsAdRevenueOut(vsAdRevenue + "x");

        setSponsorFormulaOut(`Rate = (${fmtN(views)} / 1000) × $${effectiveCPM.toFixed(2)}`);

        // Insights
        let message = "";
        if (finalRate < 500) {
            message = "Your channel is in the micro-influencer range. Focus on building consistent 20K+ average views before actively pitching brands.";
        } else if (finalRate < 2000) {
            message = "You're in the entry-level sponsorship tier. Start with smaller brands and affiliate programs to build case studies.";
        } else if (finalRate < 5000) {
            message = "You're reaching mid-tier sponsorship rates. Professional brands will work with you at this level. Consider creating a media kit.";
        } else if (finalRate < 10000) {
            message = "You're commanding premium sponsorship rates. This is where working with an agent (10-20% commission) can secure 30-50% higher deals.";
        } else {
            message = "You're in the top-tier sponsorship bracket. At this level, brands come to you. Focus on selective partnerships that align with your audience.";
        }
        setInsightMessage(message);

        // Goals
        setGoalsHTML(
            <>
                <strong>1 deal/month:</strong> {fmt(finalRate)}<br />
                <strong>1 deal/week:</strong> {fmt(monthlyPotential)}/mo<br />
                <strong>Full-time income:</strong> {fmt(yearlyPotential)}/year (4 deals/mo)
            </>
        );
    };

    useEffect(() => {
        calcSponsor();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sponsorMode, sponsorViews, sponsorViews2, baseCPM, nicheMulti, nicheMulti2, tierMulti, tierMulti2, engagementRate, integrationType]);

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
        setSponsorViews(50000);
        setSponsorViews2(50000);
        setBaseCPM(20);
        setNicheMulti(1.0);
        setNicheMulti2(1.0);
        setTierMulti(1.5);
        setTierMulti2(1.5);
        setEngagementRate(4);
        setIntegrationType(2.0);
        handleCalculate();
        setTimeout(() => setIsResetting(false), 1200);
    };

    const handleCopy = () => {
        const textToCopy = `YouTube Sponsorship Rate Estimate\nRate: ${sponsorRateOut}\nRange: ${lowRateOut} - ${highRateOut}\nvs Ad Revenue: ${vsAdRevenueOut}\nCheck your rate at: https://incomefromviews.com/youtube-sponsorship-calculator/`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = () => {
        let csv = "Metric,Value\n";
        csv += `Estimated Brand Deal Rate,${sponsorRateOut.replace(/,/g, "")}\n`;
        csv += `Low Range,${lowRateOut.replace(/,/g, "")}\n`;
        csv += `High Range,${highRateOut.replace(/,/g, "")}\n`;
        csv += `Brand CPM,${effectiveCPMOut.replace(/,/g, "")}\n`;
        csv += `Monthly Potential,${monthlyPotentialOut.replace(/,/g, "")}\n`;
        csv += `Yearly Potential,${yearlyPotentialOut.replace(/,/g, "")}\n`;

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "YouTube_Sponsorship_Rate.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'YouTube Sponsorship Calculator',
            text: `My estimated YouTube Sponsorship Rate is ${sponsorRateOut} per video! Check yours.`,
            url: 'https://incomefromviews.com/youtube-sponsorship-calculator/',
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
                        <button className={`tab ${sponsorMode === 'simple' ? 'on' : ''}`} onClick={() => setSponsorMode('simple')}>Simple Mode</button>
                        <button className={`tab ${sponsorMode === 'advanced' ? 'on' : ''}`} onClick={() => setSponsorMode('advanced')}>Advanced Mode</button>
                    </div>

                    {sponsorMode === 'simple' && (
                        <div id="sponsor-simple">
                            <div className="form-group">
                                <label>Average Views Per Video <span className="tip-wrap"><span className="tip-icon">i</span><span className="tip-text">Your typical view count per video over the last 10-20 uploads.</span></span></label>
                                <input type="number" value={sponsorViews} onChange={(e) => setSponsorViews(e.target.value === "" ? "" : Number(e.target.value))} />
                            </div>
                            <div className="form-group">
                                <label>Content Niche</label>
                                <select value={nicheMulti} onChange={(e) => setNicheMulti(Number(e.target.value))}>
                                    <option value="2.5">Finance & Investing (×2.5)</option>
                                    <option value="2.0">SaaS & Tech (×2.0)</option>
                                    <option value="1.8">Marketing & Business (×1.8)</option>
                                    <option value="1.5">Education & Online Courses (×1.5)</option>
                                    <option value="1.3">Health & Fitness (×1.3)</option>
                                    <option value="1.0">Lifestyle & Vlogs (×1.0)</option>
                                    <option value="0.8">Gaming & Entertainment (×0.8)</option>
                                    <option value="0.7">Comedy & Pranks (×0.7)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Audience Tier</label>
                                <select value={tierMulti} onChange={(e) => setTierMulti(Number(e.target.value))}>
                                    <option value="1.5">Tier 1 (USA, UK, Canada, Australia) ×1.5</option>
                                    <option value="1.0">Tier 2 (Europe, Latin America) ×1.0</option>
                                    <option value="0.6">Tier 3 (Asia, Africa, Eastern Europe) ×0.6</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {sponsorMode === 'advanced' && (
                        <div id="sponsor-advanced">
                            <div className="form-group">
                                <label>Average Views Per Video</label>
                                <input type="number" value={sponsorViews2} onChange={(e) => setSponsorViews2(e.target.value === "" ? "" : Number(e.target.value))} />
                            </div>
                            <div className="input-row">
                                <div className="form-group">
                                    <label>Base Brand CPM ($)</label>
                                    <div className="prefix-wrap">
                                        <span className="prefix">$</span>
                                        <input type="number" value={baseCPM} step="1" onChange={(e) => setBaseCPM(e.target.value === "" ? "" : Number(e.target.value))} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Engagement Rate %</label>
                                    <input type="number" value={engagementRate} max="20" step="0.1" onChange={(e) => setEngagementRate(e.target.value === "" ? "" : Number(e.target.value))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Content Niche</label>
                                <select value={nicheMulti2} onChange={(e) => setNicheMulti2(Number(e.target.value))}>
                                    <option value="2.5">Finance & Investing (×2.5)</option>
                                    <option value="2.0">SaaS & Tech (×2.0)</option>
                                    <option value="1.8">Marketing & Business (×1.8)</option>
                                    <option value="1.5">Education & Online Courses (×1.5)</option>
                                    <option value="1.3">Health & Fitness (×1.3)</option>
                                    <option value="1.0">Lifestyle & Vlogs (×1.0)</option>
                                    <option value="0.8">Gaming & Entertainment (×0.8)</option>
                                    <option value="0.7">Comedy & Pranks (×0.7)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Audience Tier</label>
                                <select value={tierMulti2} onChange={(e) => setTierMulti2(Number(e.target.value))}>
                                    <option value="1.5">Tier 1 (USA, UK, Canada, Australia) ×1.5</option>
                                    <option value="1.0">Tier 2 (Europe, Latin America) ×1.0</option>
                                    <option value="0.6">Tier 3 (Asia, Africa, Eastern Europe) ×0.6</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Integration Type</label>
                        <select value={integrationType} onChange={(e) => setIntegrationType(Number(e.target.value))}>
                            <option value="1.0">Mention / Shoutout (×1.0)</option>
                            <option value="1.5">Product Integration (×1.5)</option>
                            <option value="2.0">Dedicated Video (×2.0)</option>
                            <option value="1.5">Series / Multiple Videos (×1.5)</option>
                        </select>
                    </div>

                    <p className="auto-note">
                        💡 Adjust values — results update automatically.
                    </p>

                    <button className={`btn-primary ${isCalculating ? "loading" : ""}`} onClick={handleCalculate}>
                        {isCalculating ? "⏳ Calculating..." : "⚡ Calculate Rate"}
                    </button>
                    <button className={isResetting ? "btn-ghost text-green-500" : "btn-ghost"} onClick={handleReset}>
                        {isResetting ? "✓ Reset" : "↺ Reset"}
                    </button>

                    <div className="insight-box" style={{ marginTop: 20 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>📊 Rate Positioning</div>
                        <div style={{ fontSize: "0.95rem", color: "var(--text-600)" }}>{insightMessage}</div>
                    </div>
                    <div className="goal-box" style={{ marginTop: 20 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>🎯 Revenue Scenarios</div>
                        <div style={{ fontSize: "0.9rem", color: "var(--text-600)" }}>{goalsHTML}</div>
                    </div>

                </div>

                <div className="card-right">
                    <div className="output-hero bg-gradient-yt-card">
                        <div className="output-label">Estimated Brand Deal Rate</div>
                        <div className="output-value">{sponsorRateOut}</div>
                        <div className="output-sub">per sponsored video</div>
                    </div>
                    <div className="breakdown">
                        <div className="bd-item">
                            <div className="bd-val">{lowRateOut}</div>
                            <div className="bd-label">Low Range</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val">{highRateOut}</div>
                            <div className="bd-label">High Range</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val">{effectiveCPMOut}</div>
                            <div className="bd-label">Brand CPM</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val">{per10VideosOut}</div>
                            <div className="bd-label">Per 10 Videos</div>
                        </div>
                    </div>
                    <div className="breakdown">
                        <div className="bd-item">
                            <div className="bd-val">{monthlyPotentialOut}</div>
                            <div className="bd-label">Monthly (4 deals)</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val">{yearlyPotentialOut}</div>
                            <div className="bd-label">Yearly (48 deals)</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val">{afterAgencyOut}</div>
                            <div className="bd-label">After Agency (15%)</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val">{vsAdRevenueOut}</div>
                            <div className="bd-label">vs Ad Revenue</div>
                        </div>
                    </div>

                    <div className="formula mt-20 text-center">{sponsorFormulaOut}</div>

                    <div className="action-row" style={{ marginTop: 16 }}>
                        <button className="act-btn" onClick={handleCopy}>{copied ? "✓ Copied" : "⎘ Copy"}</button>
                        <button className="act-btn" onClick={handleExport}>↓ Export</button>
                        <button className="act-btn" onClick={handleShare}>⤴ Share</button>
                    </div>

                    {/* Sponsorship vs Ad Revenue Comparison */}
                    <div style={{ marginTop: 20, padding: 16, background: "#f0fdf4", border: "2px solid #86efac", borderRadius: 8 }}>
                        <div style={{ fontWeight: 700, marginBottom: 12, color: "#166534" }}>📊 Revenue Comparison (100K Views)</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: "0.9rem" }}>
                            <div><strong>Ad Revenue:</strong></div>
                            <div style={{ textAlign: "right", color: "#dc2626" }}>$350</div>
                            <div><strong>Sponsorship:</strong></div>
                            <div style={{ textAlign: "right", color: "#16a34a", fontWeight: 700 }}>$3,000</div>
                        </div>
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #86efac", fontSize: "0.85rem", color: "#15803d" }}>
                            Sponsorships pay <strong>8-10× more</strong> per view than ad revenue.
                        </div>
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <Link href="/youtube-earnings-calculator/" className="cta-mini" style={{ textDecoration: "none" }}>
                            👉 Calculate your YouTube ad revenue &rarr;
                        </Link>
                    </div>
                    <div>
                        <Link href="/youtube-rpm-calculator/" className="cta-mini" style={{ textDecoration: "none" }}>
                            👉 Calculate your RPM (revenue per 1,000 views) &rarr;
                        </Link>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div style={{ padding: 12, background: "#f5f7fa", borderRadius: 8, fontSize: "0.9rem", textAlign: "center" }}>
                            📘 Want to land more sponsorships? <br />
                            <Link href="/blog/how-to-get-youtube-sponsorships/" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none", display: "inline-block", marginTop: 4 }}>Read our complete sponsorship guide &rarr;</Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
