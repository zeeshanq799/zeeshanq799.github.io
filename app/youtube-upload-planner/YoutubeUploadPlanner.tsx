'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Share2, Download, Copy, Info } from 'lucide-react';

export default function YoutubeUploadPlanner() {
    const [videosPerWeek, setVideosPerWeek] = useState(3);
    const [avgViews, setAvgViews] = useState(1000);
    const [conversionRateInput, setConversionRateInput] = useState(2);
    const [avgWatchTime, setAvgWatchTime] = useState(5);
    const [currentSubs, setCurrentSubs] = useState(0);
    const [currentHours, setCurrentHours] = useState(0);

    const [isCalculating, setIsCalculating] = useState(false);
    const [results, setResults] = useState({
        monthlySubs: 0,
        monthlyVideos: 0,
        monthlyViews: 0,
        monthlyWatchHours: 0,
        subsPerVideo: 0,
        monthsTo1000: 0,
        monthsTo4000: 0,
        totalMonetization: 0,
        totalVideosNeeded: 0,
        growthLevel: 'Beginner',
        growthBadgeClass: 'growth-beginner',
        insights: [] as string[]
    });

    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        calculateGrowth();
    }, [videosPerWeek, avgViews, conversionRateInput, avgWatchTime, currentSubs, currentHours]);

    const calculateGrowth = () => {
        const conversionRate = conversionRateInput / 100;

        // Monthly calculations
        const monthlyVideos = videosPerWeek * 4.33;
        const monthlyViews = monthlyVideos * avgViews;
        const monthlySubs = monthlyViews * conversionRate;
        const monthlyWatchHours = (monthlyViews * avgWatchTime) / 60;
        const subsPerVideo = monthlyVideos > 0 ? monthlySubs / monthlyVideos : 0;

        // Time to goals
        const subsRemaining = Math.max(0, 1000 - currentSubs);
        const hoursRemaining = Math.max(0, 4000 - currentHours);

        const monthsTo1000 = monthlySubs > 0 ? Math.ceil(subsRemaining / monthlySubs) : 999;
        const monthsTo4000 = monthlyWatchHours > 0 ? Math.ceil(hoursRemaining / monthlyWatchHours) : 999;
        const totalMonetization = Math.max(monthsTo1000, monthsTo4000);

        const totalVideosNeeded = Math.ceil(totalMonetization * monthlyVideos);

        // Growth level badge
        let growthLevel = 'Beginner';
        let growthBadgeClass = 'growth-beginner';
        if (videosPerWeek >= 1 && videosPerWeek < 3) {
            growthLevel = 'Consistent';
            growthBadgeClass = 'growth-consistent';
        } else if (videosPerWeek >= 3 && videosPerWeek < 5) {
            growthLevel = 'Scaling';
            growthBadgeClass = 'growth-scaling';
        } else if (videosPerWeek >= 5) {
            growthLevel = 'Aggressive';
            growthBadgeClass = 'growth-aggressive';
        }

        // Insights
        let messages: string[] = [];

        // Upload frequency insight
        if (videosPerWeek < 1) {
            messages.push('⚠️ Growth will be very slow. Consider at least 2 uploads weekly.');
        } else if (videosPerWeek >= 1 && videosPerWeek < 2) {
            messages.push('📈 Sustainable pace. Focus on quality and consistency.');
        } else if (videosPerWeek >= 2 && videosPerWeek < 4) {
            messages.push('✅ Moderate growth strategy. Good balance of volume and quality.');
        } else if (videosPerWeek >= 4) {
            messages.push('🚀 Aggressive growth strategy. Ensure you can maintain this pace long-term.');
        }

        // Views insight
        if (avgViews < 200) {
            messages.push('🔍 Low views per video. Focus on SEO optimization and thumbnail testing.');
        } else if (avgViews >= 200 && avgViews < 1000) {
            messages.push('📊 Building traction. Keep improving thumbnails and titles.');
        } else if (avgViews >= 1000) {
            messages.push('💪 Strong view performance. You have product-market fit.');
        }

        // Conversion insight
        if (conversionRateInput < 1) {
            messages.push('📢 Low conversion rate. Add clear CTAs and improve content value proposition.');
        } else if (conversionRateInput >= 1 && conversionRateInput < 2) {
            messages.push('👍 Average conversion. Consider stronger CTAs at 30-second mark.');
        } else if (conversionRateInput >= 2 && conversionRateInput < 3) {
            messages.push('✨ Good conversion rate. Your content resonates with viewers.');
        } else {
            messages.push('🌟 Excellent conversion rate. Maintain current content strategy.');
        }

        // Timeline insight
        if (monthsTo1000 < 3) {
            messages.push("⚡ Fast path to monetization. You're on track for rapid growth.");
        } else if (monthsTo1000 >= 3 && monthsTo1000 < 6) {
            messages.push('🎯 Solid growth trajectory. Maintain consistency to hit monetization.');
        } else if (monthsTo1000 >= 6 && monthsTo1000 < 12) {
            messages.push('⏳ Standard growth pace. Most creators take 6-12 months.');
        } else if (monthsTo1000 < 999) {
            messages.push('🐢 Slow growth pace. Consider increasing frequency or improving SEO.');
        }

        setResults({
            monthlySubs,
            monthlyVideos,
            monthlyViews,
            monthlyWatchHours,
            subsPerVideo,
            monthsTo1000,
            monthsTo4000,
            totalMonetization,
            totalVideosNeeded,
            growthLevel,
            growthBadgeClass,
            insights: messages
        });
    };

    const handleCalculate = () => {
        setIsCalculating(true);
        setTimeout(() => {
            calculateGrowth();
            setIsCalculating(false);

            // Trigger Google Analytics event if available
            if (typeof window !== 'undefined' && 'gtag' in window) {
                (window as any).gtag('event', 'calculator_interaction', {
                    event_category: 'engagement',
                    event_label: 'upload_planner_used'
                });
            }
        }, 400);
    };

    const handleReset = () => {
        setVideosPerWeek(3);
        setAvgViews(1000);
        setConversionRateInput(2);
        setAvgWatchTime(5);
        setCurrentSubs(0);
        setCurrentHours(0);
    };

    const copyResults = async () => {
        const textToCopy = `YouTube Growth Projections (Monthly):
- Subscribers: ${Math.round(results.monthlySubs).toLocaleString()}
- Videos: ${Math.round(results.monthlyVideos).toLocaleString()}
- Views: ${Math.round(results.monthlyViews).toLocaleString()}
- Watch Hours: ${Math.round(results.monthlyWatchHours).toLocaleString()}
- Subs/Video: ${Math.round(results.subsPerVideo).toLocaleString()}

Path to Monetization:
- Time to 1K Subs: ${results.monthsTo1000 < 999 ? results.monthsTo1000 + ' months' : 'Not achievable'}
- Time to 4K Hours: ${results.monthsTo4000 < 999 ? results.monthsTo4000 + ' months' : 'Not achievable'}
- Monetization ETA: ${results.totalMonetization < 999 ? results.totalMonetization + ' months' : 'Not achievable'}`;

        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const downloadResults = () => {
        const textToDownload = `YouTube Upload Planner Results\n\nInputs:\n- Videos Per Week: ${videosPerWeek}\n- Average Views/Video: ${avgViews}\n- Subs Conversion Rate: ${conversionRateInput}%\n- Avg Watch Time: ${avgWatchTime} min\n- Current Subs: ${currentSubs}\n- Current Watch Hours: ${currentHours}\n\nProjected Monthly Growth:\n- Subscribers: ${Math.round(results.monthlySubs).toLocaleString()}\n- Videos: ${Math.round(results.monthlyVideos).toLocaleString()}\n- Views: ${Math.round(results.monthlyViews).toLocaleString()}\n- Watch Hours: ${Math.round(results.monthlyWatchHours).toLocaleString()}\n- Subs/Video: ${Math.round(results.subsPerVideo).toLocaleString()}\n\nPath to Monetization:\n- Months to 1K Subs: ${results.monthsTo1000 < 999 ? results.monthsTo1000 : 'Not achievable'}\n- Months to 4K Hours: ${results.monthsTo4000 < 999 ? results.monthsTo4000 : 'Not achievable'}\n- Monetization ETA: ${results.totalMonetization < 999 ? results.totalMonetization + ' months' : 'Not achievable'}\n- Total Videos Needed: ${results.totalVideosNeeded < 5000 ? results.totalVideosNeeded.toLocaleString() : '∞'}\n\nInsights:\n${results.insights.join('\n')}\n\nGenerated by IncomeFromViews.com`;

        const blob = new Blob([textToDownload], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'YouTube-Growth-Plan.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const shareResults = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My YouTube Growth Plan',
                    text: `Based on my plan of ${videosPerWeek} videos/week, I project I can reach monetization in ${results.totalMonetization < 999 ? results.totalMonetization + ' months' : 'an unachievable timeframe'}. Calculate yours!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            copyResults();
            alert("Results copied to clipboard! You can now share them.");
        }
    };

    return (
        <div className="calc-section" id="youtube">
            <style dangerouslySetInnerHTML={{
                __html: `
                .growth-badge {
                    display: inline-block;
                    padding: 0.5rem 1.25rem;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 1rem;
                    text-align: center;
                    margin: 1rem 0;
                }

                .growth-beginner {
                    background: #fee2e2;
                    color: #991b1b;
                    border: 2px solid #ef4444;
                }

                .growth-consistent {
                    background: #fef3c7;
                    color: #92400e;
                    border: 2px solid #f59e0b;
                }

                .growth-scaling {
                    background: #dbeafe;
                    color: #1e40af;
                    border: 2px solid #3b82f6;
                }

                .growth-aggressive {
                    background: #d1fae5;
                    color: #065f46;
                    border: 2px solid #10b981;
                }
            `}} />
            <div className="card">
                <div className="card-grid">
                    <div className="card-left">
                        <div className="form-group">
                            <label>Videos Per Week <span className="tip-wrap"><span className="tip-icon">i</span><span className="tip-text">How many videos you plan to upload weekly. Consistency matters more than volume.</span></span></label>
                            <input
                                type="number"
                                value={videosPerWeek}
                                min="0.5"
                                step="0.5"
                                onChange={(e) => setVideosPerWeek(parseFloat(e.target.value) || 0)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Average Views Per Video</label>
                            <input
                                type="number"
                                value={avgViews}
                                step="100"
                                onChange={(e) => setAvgViews(parseFloat(e.target.value) || 0)}
                            />
                            <div className="calc-input-helper">Expected views based on your recent video performance</div>
                        </div>

                        <div className="form-group">
                            <label>Subscriber Conversion Rate (%)</label>
                            <input
                                type="number"
                                value={conversionRateInput}
                                min="0.1"
                                max="100"
                                step="0.1"
                                onChange={(e) => setConversionRateInput(parseFloat(e.target.value) || 0)}
                            />
                            <div className="calc-input-helper">Typical range: 1-3%. Check YouTube Analytics &rarr; Audience</div>
                        </div>

                        <div className="form-group">
                            <label>Average Watch Time (minutes)</label>
                            <input
                                type="number"
                                value={avgWatchTime}
                                min="0.5"
                                step="0.5"
                                onChange={(e) => setAvgWatchTime(parseFloat(e.target.value) || 0)}
                            />
                            <div className="calc-input-helper">Average view duration per video from Analytics</div>
                        </div>

                        <div className="form-group">
                            <label>Current Subscribers (optional)</label>
                            <input
                                type="number"
                                value={currentSubs === 0 ? '' : currentSubs}
                                placeholder="0"
                                onChange={(e) => setCurrentSubs(parseInt(e.target.value) || 0)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Current Watch Hours (optional)</label>
                            <input
                                type="number"
                                value={currentHours === 0 ? '' : currentHours}
                                placeholder="0"
                                onChange={(e) => setCurrentHours(parseInt(e.target.value) || 0)}
                            />
                        </div>

                        <p className="auto-note">
                            💡 Be realistic with estimates for accurate projections.
                        </p>

                        <button className={`btn-primary ${isCalculating ? 'loading' : ''}`} onClick={handleCalculate} disabled={isCalculating}>
                            {isCalculating ? '⏳ Calculating...' : '⚡ Calculate Growth Plan'}
                        </button>
                        <button className="btn-ghost" onClick={handleReset}>
                            ↺ Reset
                        </button>
                    </div>

                    <div className="card-right">
                        <div className="output-hero bg-gradient-yt-card">
                            <div className="output-label">Projected Monthly Growth</div>
                            <div className="output-value text-red-600">{Math.round(results.monthlySubs).toLocaleString()} subscribers</div>
                            <div className="output-sub text-gray-600">at current upload pace</div>
                        </div>

                        {/* Growth Level Badge */}
                        <div className={`growth-badge ${results.growthBadgeClass}`} style={{ width: '100%', marginTop: '1rem' }}>
                            Growth Level: {results.growthLevel}
                        </div>

                        <div className="breakdown">
                            <div className="bd-item">
                                <div className="bd-val">{Math.round(results.monthlyVideos).toLocaleString()}</div>
                                <div className="bd-label">Videos/Month</div>
                            </div>
                            <div className="bd-item">
                                <div className="bd-val">{Math.round(results.monthlyViews).toLocaleString()}</div>
                                <div className="bd-label">Views/Month</div>
                            </div>
                            <div className="bd-item">
                                <div className="bd-val">{Math.round(results.monthlyWatchHours).toLocaleString()}</div>
                                <div className="bd-label">Watch Hours/Mo</div>
                            </div>
                            <div className="bd-item">
                                <div className="bd-val">{Math.round(results.subsPerVideo).toLocaleString()}</div>
                                <div className="bd-label">Subs/Video</div>
                            </div>
                        </div>

                        <div className="breakdown mt-4">
                            <div className="bd-item">
                                <div className="bd-val">{results.monthsTo1000 < 999 ? results.monthsTo1000 : '∞'}</div>
                                <div className="bd-label">Months to 1K Subs</div>
                            </div>
                            <div className="bd-item">
                                <div className="bd-val">{results.monthsTo4000 < 999 ? results.monthsTo4000 : '∞'}</div>
                                <div className="bd-label">Months to 4K Hours</div>
                            </div>
                            <div className="bd-item">
                                <div className="bd-val" style={{ color: results.totalMonetization < 999 ? '#059669' : '#dc2626' }}>
                                    {results.totalMonetization < 999 ? results.totalMonetization : 'Not achievable'}
                                </div>
                                <div className="bd-label">Monetization ETA (Months)</div>
                            </div>
                            <div className="bd-item">
                                <div className="bd-val">{results.totalVideosNeeded < 5000 ? results.totalVideosNeeded.toLocaleString() : '∞'}</div>
                                <div className="bd-label">Total Videos Needed</div>
                            </div>
                        </div>

                        <div className="formula mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-center text-sm text-gray-600">
                            {Math.round(results.monthlyVideos)} videos &times; {avgViews.toLocaleString()} views &times; {conversionRateInput.toFixed(1)}% = {Math.round(results.monthlySubs)} subs/mo
                        </div>

                        {/* Growth Insights */}
                        <div style={{ marginTop: '20px', padding: '16px', background: '#eff6ff', border: '2px solid #3B82F6', borderRadius: '8px' }}>
                            <div style={{ fontWeight: 700, marginBottom: '12px', color: '#1e40af' }}>📊 Upload Strategy Analysis</div>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.8, color: '#1e40af' }}>
                                {results.insights.map((msg, index) => (
                                    <React.Fragment key={index}>
                                        {msg}<br />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="action-row mt-6 flex gap-2">
                            <button className="act-btn flex-1 flex items-center justify-center gap-2" onClick={copyResults}>
                                <Copy size={16} /> {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                            <button className="act-btn flex-1 flex items-center justify-center gap-2" onClick={downloadResults}>
                                <Download size={16} /> Export
                            </button>
                            <button className="act-btn flex-1 flex items-center justify-center gap-2" onClick={shareResults}>
                                <Share2 size={16} /> Share
                            </button>
                        </div>

                        <div style={{ marginTop: '16px' }}>
                            <Link href="/youtube-monetization-checker/" className="cta-mini text-blue-600 hover:underline block mb-2">
                                👉 Check your current monetization eligibility &rarr;
                            </Link>
                            <Link href="/youtube-watch-time-calculator/" className="cta-mini text-blue-600 hover:underline block">
                                👉 Calculate watch time progress in detail &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
