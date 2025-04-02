import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Line, Bar } from 'react-chartjs-2';

const AnalyticsContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
`;

const AdAnalytics = () => {
  const [stats, setStats] = useState({
    impressions: 0,
    clicks: 0,
    ctr: 0,
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ads/analytics');
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
          setChartData({
            labels: data.chartData.labels,
            datasets: [
              {
                label: 'Impressions',
                data: data.chartData.impressions,
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
              },
              {
                label: 'Clicks',
                data: data.chartData.clicks,
                borderColor: '#ff00aa',
                backgroundColor: 'rgba(255, 0, 170, 0.1)',
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <AnalyticsContainer>
      <h3>Advertisement Analytics</h3>
      <StatsGrid>
        <StatCard>
          <h4>Impressions</h4>
          <p>{stats.impressions.toLocaleString()}</p>
        </StatCard>
        <StatCard>
          <h4>Clicks</h4>
          <p>{stats.clicks.toLocaleString()}</p>
        </StatCard>
        <StatCard>
          <h4>CTR</h4>
          <p>{stats.ctr}%</p>
        </StatCard>
      </StatsGrid>
      <div style={{ height: '300px' }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </AnalyticsContainer>
  );
};

export default AdAnalytics;