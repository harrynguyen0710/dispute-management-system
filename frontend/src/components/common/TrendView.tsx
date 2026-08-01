import React from 'react';
import { useTrends } from '../../hooks/useTrends';

export function TrendView() {
  const { trends, loading, error } = useTrends();

  if (loading) {
    return <div className="alert">Loading trend analysis data...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!trends) {
    return <div className="alert">No trend data available.</div>;
  }

  const regions = Object.keys(trends.by_region);
  const months = Object.keys(trends.by_month).sort(); // Sort chronological

  // Calculate maximum total count for month charts scaling
  let maxMonthCount = 1;
  months.forEach((m) => {
    const counts = trends.by_month[m]!;
    const maxVal = Math.max(counts.won, counts.lost, counts.fraud_confirmed);
    if (maxVal > maxMonthCount) {
      maxMonthCount = maxVal;
    }
  });

  return (
    <div className="trends-container">
      {/* 1. Month-over-Month Chart */}
      <section className="trend-section">
        <h2>Outcome Trend over Time</h2>
        
        {months.length === 0 ? (
          <div className="no-records">No resolution history over time found.</div>
        ) : (
          <div className="chart-wrapper">
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot won-dot"></span>
                <span>Won</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot lost-dot"></span>
                <span>Lost</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot fraud-dot"></span>
                <span>Fraud Confirmed</span>
              </div>
            </div>

            <div className="chart-bar-area">
              {months.map((m) => {
                const counts = trends.by_month[m]!;
                const wonPct = (counts.won / maxMonthCount) * 100;
                const lostPct = (counts.lost / maxMonthCount) * 100;
                const fraudPct = (counts.fraud_confirmed / maxMonthCount) * 100;

                return (
                  <div key={m} className="chart-column-group">
                    <div className="bars-container">
                      <div
                        className="bar bar-won"
                        style={{ height: `${Math.max(wonPct, 4)}%` }}
                        title={`Won: ${counts.won}`}
                      >
                        <span className="bar-tooltip">{counts.won} Won</span>
                      </div>
                      <div
                        className="bar bar-lost"
                        style={{ height: `${Math.max(lostPct, 4)}%` }}
                        title={`Lost: ${counts.lost}`}
                      >
                        <span className="bar-tooltip">{counts.lost} Lost</span>
                      </div>
                      <div
                        className="bar bar-fraud"
                        style={{ height: `${Math.max(fraudPct, 4)}%` }}
                        title={`Fraud Confirmed: ${counts.fraud_confirmed}`}
                      >
                        <span className="bar-tooltip">{counts.fraud_confirmed} Fraud</span>
                      </div>
                    </div>
                    <div className="column-label">{m}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 2. Region Breakdown Table */}
      <section className="trend-section">
        <h2>Outcome Breakdown by Region</h2>
        
        {regions.length === 0 ? (
          <div className="no-records">No regional dispute case history found.</div>
        ) : (
          <div className="table-card">
            <div className="table-responsive">
              <table className="cases-table">
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Total Cases</th>
                    <th>Won</th>
                    <th>Lost</th>
                    <th>Fraud Confirmed</th>
                    <th>Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {regions.map((r) => {
                    const counts = trends.by_region[r]!;
                    const winRate = counts.total > 0 ? (counts.won / counts.total) * 100 : 0;
                    return (
                      <tr key={r}>
                        <td><strong>{r}</strong></td>
                        <td>{counts.total}</td>
                        <td>
                          <span className="badge outcome-won">{counts.won}</span>
                        </td>
                        <td>
                          <span className="badge outcome-lost">{counts.lost}</span>
                        </td>
                        <td>
                          <span className="badge outcome-fraud">{counts.fraud_confirmed}</span>
                        </td>
                        <td>
                          <div className="win-rate-wrapper">
                            <span className="win-rate-text">{winRate.toFixed(1)}%</span>
                            <div className="win-rate-bar-bg">
                              <div className="win-rate-bar-fill" style={{ width: `${winRate}%` }}></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
