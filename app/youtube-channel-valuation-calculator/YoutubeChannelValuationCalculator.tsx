"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fmt, fmtN } from "../lib/format";

export default function YoutubeChannelValuationCalculator() {
    const [valMode, setValMode] = useState<"simple" | "detailed">("simple");

    // Form inputs
    const [monthlyProfit, setMonthlyProfit] = useState<number | "">(5000);
    const [monthlyProfit2, setMonthlyProfit2] = useState<number | "">(5000);
    const [growthTrend, setGrowthTrend] = useState<number>(1.1); // 0.8, 1.0, 1.1, 1.2, 1.35
    const [growthPercent, setGrowthPercent] = useState<number | "">(15);
    const [monthlyExpenses, setMonthlyExpenses] = useState<number | "">(500);
    const [nicheCategory, setNicheCategory] = useState<number>(1.3); // 0.9, 1.0, 1.15, 1.2, 1.3, 1.35
    const [nicheCategory2, setNicheCategory2] = useState<number>(1.3);
    const [revenueDiversification, setRevenueDiversification] = useState<number>(1.1); // 0.9, 1.05, 1.1, 1.25
    const [countryTier, setCountryTier] = useState<number>(1.25); // 0.85, 1.0, 1.25
    const [riskLevel, setRiskLevel] = useState<number>(1.0); // 0.8, 1.0, 1.2

    // Derived logic state
    const [isCalculating, setIsCalculating] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [copied, setCopied] = useState(false);

    // Outputs
    const [standardValueOut, setStandardValueOut] = useState("$0");
    const [conservativeValueOut, setConservativeValueOut] = useState("$0");
    const [premiumValueOut, setPremiumValueOut] = useState("$0");
    const [adjustedMultipleOut, setAdjustedMultipleOut] = useState("0x");
    const [marketplaceRangeOut, setMarketplaceRangeOut] = useState("$0 - $0");

    // Metrics
    const [riskScoreOut, setRiskScoreOut] = useState("0%");
    const [attractScoreOut, setAttractScoreOut] = useState("0/10");
    const [roiMonthsOut, setRoiMonthsOut] = useState("0 months");
    const [monthlyProfitOut, setMonthlyProfitOut] = useState("$0");

    // Breakdown Multipliers
    const [growthMult, setGrowthMult] = useState("×1.10");
    const [nicheMult, setNicheMult] = useState("×1.30");
    const [revMult, setRevMult] = useState("×1.10");
    const [countryMult, setCountryMult] = useState("×1.25");
    const [riskMult, setRiskMult] = useState("×1.0");

    // Insights & Goals
    const [valInsightMessage, setValInsightMessage] = useState("");
    const [valGoalsHTML, setValGoalsHTML] = useState<React.ReactNode>("");
    const [valFormula, setValFormula] = useState("Value = Profit × Adjusted Multiple");

    const calculateValuation = () => {
        let currentMonthlyProfit = 0;
        let growthMulti = 1.0;
        let nicheMulti = 1.0;

        const BASE_MULTIPLE = 30;

        if (valMode === "simple") {
            currentMonthlyProfit = Number(monthlyProfit) || 0;
            growthMulti = growthTrend;
            nicheMulti = nicheCategory;
        } else {
            currentMonthlyProfit = Number(monthlyProfit2) || 0;
            const gp = Number(growthPercent) || 0;
            if (gp < 0) growthMulti = 0.8;
            else if (gp <= 5) growthMulti = 1.0;
            else if (gp <= 15) growthMulti = 1.1;
            else if (gp <= 30) growthMulti = 1.2;
            else growthMulti = 1.35;
            nicheMulti = nicheCategory2;
        }

        const revenueMulti = revenueDiversification;
        const countryMulti = countryTier;
        const riskMulti = riskLevel;

        const adjustedMultiple = BASE_MULTIPLE * growthMulti * nicheMulti * revenueMulti * countryMulti * riskMulti;

        const standardValue = currentMonthlyProfit * adjustedMultiple;
        const conservativeValue = currentMonthlyProfit * 24;
        const premiumValue = standardValue * 1.2;
        const listingLow = standardValue * 0.85;
        const listingHigh = standardValue * 1.15;

        const riskScore = (1 / riskMulti) * (1 / countryMulti) * 100;
        const attractScore = Math.min(10, (adjustedMultiple / 30) * 5);
        const roiMonths = Math.round(adjustedMultiple);

        // Update states
        setStandardValueOut(fmt(standardValue));
        setConservativeValueOut(fmt(conservativeValue));
        setPremiumValueOut(fmt(premiumValue));
        setAdjustedMultipleOut(adjustedMultiple.toFixed(1) + "x");
        setMarketplaceRangeOut(fmt(listingLow) + " - " + fmt(listingHigh));
        setRiskScoreOut(Math.round(riskScore) + "%");
        setAttractScoreOut(attractScore.toFixed(1) + "/10");
        setRoiMonthsOut(roiMonths + " months");
        setMonthlyProfitOut(fmt(currentMonthlyProfit));

        setGrowthMult(`×${growthMulti.toFixed(2)}`);
        setNicheMult(`×${nicheMulti.toFixed(2)}`);
        setRevMult(`×${revenueMulti.toFixed(2)}`);
        setCountryMult(`×${countryMulti.toFixed(2)}`);
        setRiskMult(`×${riskMulti.toFixed(1)}`);

        setValFormula(`Value = ${fmt(currentMonthlyProfit)} × ${adjustedMultiple.toFixed(1)}x = ${fmt(standardValue)}`);

        // Generate Insights
        let message = "";
        if (standardValue < 50000) {
            message = "Your channel is in the micro-acquisition range. Focus on increasing monthly profit to $2,000+ before considering marketplace listing.";
        } else if (standardValue < 150000) {
            message = "Your channel qualifies for marketplaces like Motion Invest. At this level, improving growth rate and diversifying revenue can add 20-40% to valuation.";
        } else if (standardValue < 500000) {
            message = "You're in the mid-tier valuation range. Suitable for Empire Flippers and Motion Invest. Professional presentation and documentation can maximize sale price.";
        } else if (standardValue < 1000000) {
            message = "You're commanding premium valuations. At this level, consider engaging a business broker to negotiate optimal terms and find strategic buyers.";
        } else {
            message = "Your channel is a high-value media asset. FE International or private sales may secure better terms than standard marketplaces. Strategic buyers may pay 10-20% premiums.";
        }
        setValInsightMessage(message);

        // Generate Goals
        let marketability = "";
        if (attractScore >= 8) marketability = "Excellent - High buyer demand";
        else if (attractScore >= 6) marketability = "Good - Moderate buyer interest";
        else if (attractScore >= 4) marketability = "Fair - Selective buyers";
        else marketability = "Low - Limited buyer pool";

        let riskLevelText = "";
        if (riskScore < 60) riskLevelText = "Low risk - Premium asset";
        else if (riskScore < 80) riskLevelText = "Moderate risk - Standard";
        else riskLevelText = "Higher risk - Needs improvement";

        setValGoalsHTML(
            <>
                <strong>Buyer Appeal:</strong> {marketability}<br />
                <strong>Risk Assessment:</strong> {riskLevelText}
            </>
        );
    };

    useEffect(() => {
        calculateValuation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valMode, monthlyProfit, monthlyProfit2, growthTrend, growthPercent, monthlyExpenses, nicheCategory, nicheCategory2, revenueDiversification, countryTier, riskLevel]);

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
        setMonthlyProfit(5000);
        setMonthlyProfit2(5000);
        setGrowthPercent(15);
        setMonthlyExpenses(500);
        setGrowthTrend(1.1);
        setNicheCategory(1.3);
        setNicheCategory2(1.3);
        setRevenueDiversification(1.1);
        setCountryTier(1.25);
        setRiskLevel(1.0);
        handleCalculate();
        setTimeout(() => setIsResetting(false), 1200);
    };

    const handleCopy = () => {
        const textToCopy = `YouTube Channel Valuation Estimate\nEstimated Value: ${standardValueOut}\nMonthly Profit: ${monthlyProfitOut}\nAdjusted Multiple: ${adjustedMultipleOut}\nMarketplace Range: ${marketplaceRangeOut}\nCheck your value at: https://incomefromviews.com/youtube-channel-valuation-calculator/`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = () => {
        let csv = "Metric,Value\n";
        csv += `Estimated Value,${standardValueOut.replace(/,/g, "")}\n`;
        csv += `Conservative Value,${conservativeValueOut.replace(/,/g, "")}\n`;
        csv += `Premium Value,${premiumValueOut.replace(/,/g, "")}\n`;
        csv += `Adjusted Multiple,${adjustedMultipleOut}\n`;
        csv += `Marketplace Range,"${marketplaceRangeOut}"\n`;
        csv += `Monthly Profit,${monthlyProfitOut.replace(/,/g, "")}\n`;
        csv += `Risk Score,${riskScoreOut}\n`;
        csv += `Buyer Appeal,${attractScoreOut}\n`;
        csv += `Buyer ROI,${roiMonthsOut}\n`;

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "YouTube_Channel_Valuation.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'YouTube Channel Valuation',
            text: `My YouTube Channel is estimated at ${standardValueOut}! Check yours.`,
            url: 'https://incomefromviews.com/youtube-channel-valuation-calculator/',
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
                        <button className={`tab ${valMode === 'simple' ? 'on' : ''}`} onClick={() => setValMode('simple')}>Quick Valuation</button>
                        <button className={`tab ${valMode === 'detailed' ? 'on' : ''}`} onClick={() => setValMode('detailed')}>Detailed Analysis</button>
                    </div>

                    {valMode === 'simple' && (
                        <div id="val-simple">
                            <div className="form-group">
                                <label>Average Monthly Net Profit ($) <span className="tip-wrap"><span className="tip-icon">i</span><span className="tip-text">Total monthly revenue minus all expenses. Not gross revenue — actual profit after costs.</span></span></label>
                                <div className="prefix-wrap">
                                    <span className="prefix">$</span>
                                    <input type="number" value={monthlyProfit} onChange={(e) => setMonthlyProfit(e.target.value === "" ? "" : Number(e.target.value))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>6-Month Growth Trend</label>
                                <select value={growthTrend} onChange={(e) => setGrowthTrend(Number(e.target.value))}>
                                    <option value="0.8">Declining (×0.8)</option>
                                    <option value="1.0">Flat 0-5% (×1.0)</option>
                                    <option value="1.1">Moderate 5-15% (×1.1)</option>
                                    <option value="1.2">Strong 15-30% (×1.2)</option>
                                    <option value="1.35">Explosive 30%+ (×1.35)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Content Niche</label>
                                <select value={nicheCategory} onChange={(e) => setNicheCategory(Number(e.target.value))}>
                                    <option value="0.9">Gaming (×0.9)</option>
                                    <option value="1.0">Entertainment (×1.0)</option>
                                    <option value="1.15">Tech & Gadgets (×1.15)</option>
                                    <option value="1.2">Education (×1.2)</option>
                                    <option value="1.3">Finance & Investing (×1.3)</option>
                                    <option value="1.35">SaaS / B2B (×1.35)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {valMode === 'detailed' && (
                        <div id="val-detailed">
                            <div className="form-group">
                                <label>Average Monthly Net Profit ($)</label>
                                <div className="prefix-wrap">
                                    <span className="prefix">$</span>
                                    <input type="number" value={monthlyProfit2} onChange={(e) => setMonthlyProfit2(e.target.value === "" ? "" : Number(e.target.value))} />
                                </div>
                            </div>
                            <div className="input-row">
                                <div className="form-group">
                                    <label>6-Month Growth %</label>
                                    <input type="number" value={growthPercent} step="1" onChange={(e) => setGrowthPercent(e.target.value === "" ? "" : Number(e.target.value))} />
                                </div>
                                <div className="form-group">
                                    <label>Monthly Expenses ($)</label>
                                    <div className="prefix-wrap">
                                        <span className="prefix">$</span>
                                        <input type="number" value={monthlyExpenses} step="100" onChange={(e) => setMonthlyExpenses(e.target.value === "" ? "" : Number(e.target.value))} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Content Niche</label>
                                <select value={nicheCategory2} onChange={(e) => setNicheCategory2(Number(e.target.value))}>
                                    <option value="0.9">Gaming (×0.9)</option>
                                    <option value="1.0">Entertainment (×1.0)</option>
                                    <option value="1.15">Tech & Gadgets (×1.15)</option>
                                    <option value="1.2">Education (×1.2)</option>
                                    <option value="1.3">Finance & Investing (×1.3)</option>
                                    <option value="1.35">SaaS / B2B (×1.35)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Revenue Diversification</label>
                        <select value={revenueDiversification} onChange={(e) => setRevenueDiversification(Number(e.target.value))}>
                            <option value="0.9">Ads Only (×0.9)</option>
                            <option value="1.05">Ads + Affiliate (×1.05)</option>
                            <option value="1.1">Ads + Sponsorship (×1.1)</option>
                            <option value="1.25">Fully Diversified (×1.25)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Audience Country Tier</label>
                        <select value={countryTier} onChange={(e) => setCountryTier(Number(e.target.value))}>
                            <option value="0.85">Tier 3 (Asia, Africa) ×0.85</option>
                            <option value="1.0">Tier 2 (Europe, Latin America) ×1.0</option>
                            <option value="1.25">Tier 1 (USA, UK, Canada, Australia) ×1.25</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Content Stability Risk</label>
                        <select value={riskLevel} onChange={(e) => setRiskLevel(Number(e.target.value))}>
                            <option value="0.8">High Risk (1 viral video dependency) ×0.8</option>
                            <option value="1.0">Moderate Stability ×1.0</option>
                            <option value="1.2">Evergreen Stable Content ×1.2</option>
                        </select>
                    </div>

                    <p className="auto-note">
                        💡 Adjust values — valuation updates automatically.
                    </p>

                    <button className={`btn-primary ${isCalculating ? "loading" : ""}`} onClick={handleCalculate}>
                        {isCalculating ? "⏳ Calculating..." : "⚡ Calculate Valuation"}
                    </button>
                    <button className={isResetting ? "btn-ghost text-green-500" : "btn-ghost"} onClick={handleReset}>
                        {isResetting ? "✓ Reset" : "↺ Reset"}
                    </button>

                    <div className="insight-box" id="valInsightBox" style={{ marginTop: 20 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>📊 Valuation Analysis</div>
                        <div id="valInsightText" style={{ fontSize: "0.95rem", color: "var(--text-600)" }}>{valInsightMessage}</div>
                    </div>
                    <div className="goal-box" style={{ marginTop: 20 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>🎯 Marketability Score</div>
                        <div id="valGoals" style={{ fontSize: "0.9rem", color: "var(--text-600)" }}>{valGoalsHTML}</div>
                    </div>
                </div>

                <div className="card-right">
                    <div className="output-hero bg-gradient-yt-card" style={{ background: "linear-gradient(135deg, #FF0000 0%, #aa0000 100%)" }}>
                        <div className="out-label">Estimated Channel Value</div>
                        <div className="out-val" id="standardValue">{standardValueOut}</div>
                        <div className="out-sub">standard valuation (adjusted multiple)</div>
                    </div>
                    <div className="breakdown">
                        <div className="bd-item">
                            <div className="bd-val" id="conservativeValue">{conservativeValueOut}</div>
                            <div className="bd-label">Conservative (24x)</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val" id="premiumValue">{premiumValueOut}</div>
                            <div className="bd-label">Premium (×1.2)</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val" id="adjustedMultiple">{adjustedMultipleOut}</div>
                            <div className="bd-label">Your Multiple</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val" id="marketplaceRange">{marketplaceRangeOut}</div>
                            <div className="bd-label">Listing Range</div>
                        </div>
                    </div>
                    <div className="breakdown">
                        <div className="bd-item">
                            <div className="bd-val" id="riskScore">{riskScoreOut}</div>
                            <div className="bd-label">Risk Score</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val" id="attractScore">{attractScoreOut}</div>
                            <div className="bd-label">Buyer Appeal</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val" id="roiMonths">{roiMonthsOut}</div>
                            <div className="bd-label">Buyer ROI</div>
                        </div>
                        <div className="bd-item">
                            <div className="bd-val" id="monthlyProfit">{monthlyProfitOut}</div>
                            <div className="bd-label">Monthly Profit</div>
                        </div>
                    </div>

                    <div className="formula-box mt-20 text-center" style={{ marginTop: "20px" }} id="valFormula">{valFormula}</div>

                    <div className="action-row" style={{ marginTop: "16px" }}>
                        <button className="act-btn" onClick={handleCopy}>{copied ? "✓ Copied" : "⎘ Copy"}</button>
                        <button className="act-btn" onClick={handleExport}>↓ Export</button>
                        <button className="act-btn" onClick={handleShare}>⤴ Share</button>
                    </div>

                    {/* Multiplier Breakdown */}
                    <div style={{ marginTop: 20, padding: 16, background: "#eff6ff", border: "2px solid #3B82F6", borderRadius: 8 }}>
                        <div style={{ fontWeight: 700, marginBottom: 12, color: "#1e40af" }}>📊 Multiple Breakdown</div>
                        <div id="multiplierBreakdown" style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "#1e40af" }}>
                            <div>Base: <strong>30x</strong></div>
                            <div>Growth: <span id="growthMult"><strong>{growthMult}</strong></span></div>
                            <div>Niche: <span id="nicheMult"><strong>{nicheMult}</strong></span></div>
                            <div>Revenue: <span id="revMult"><strong>{revMult}</strong></span></div>
                            <div>Country: <span id="countryMult"><strong>{countryMult}</strong></span></div>
                            <div>Risk: <span id="riskMult"><strong>{riskMult}</strong></span></div>
                        </div>
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <Link href="/youtube-earnings-calculator/" className="btn-outline" style={{ textDecoration: "none", width: "100%", justifyContent: "center" }}>
                            👉 Calculate your YouTube monthly earnings →
                        </Link>
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <Link href="/youtube-rpm-calculator/" className="btn-outline" style={{ textDecoration: "none", width: "100%", justifyContent: "center" }}>
                            👉 Calculate your revenue per 1,000 views →
                        </Link>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div style={{ padding: 12, background: "#f5f7fa", borderRadius: 8, fontSize: "0.9rem", textAlign: "center", border: "1px solid var(--border)" }}>
                            📘 Ready to sell your channel? <br />
                            <a href="https://empireflippers.com" target="_blank" rel="noopener" style={{ color: "var(--blue)", fontWeight: "600", textDecoration: "none", display: "inline-block", marginTop: "4px" }}>List on Empire Flippers →</a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
