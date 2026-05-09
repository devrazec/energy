'use client';

import React, { useState, useContext, useMemo, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import Layout from '../../components/Layout';
import ReactECharts from 'echarts-for-react';
import { useLoading } from '../../hooks/useLoading';

const INTERVALS = ['15min', '1h', '3h'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function GroupedMonthPage() {
    const {
        darkMode,
        setDarkMode,
        mobileDevice,
        setMobileDevice,

        dbGroupedMonth,
        setDbGroupedMonth,

    } = useContext(GlobalContext);

    const { showLoading, hideLoading } = useLoading();

    const [interval, setInterval] = useState('15min');

    // Show loading on page mount
    useEffect(() => {
        showLoading();
        const timer = setTimeout(() => hideLoading(), 800);
        return () => clearTimeout(timer);
    }, []);

    // Show loading when interval changes
    useEffect(() => {
        showLoading();
        const timer = setTimeout(() => hideLoading(), 500);
        return () => clearTimeout(timer);
    }, [interval]);

    const chartOption = useMemo(() => {
        const measurements = dbGroupedMonth?.measurements ?? {};
        const forecastData = dbGroupedMonth?.forecast ?? {};
        const isMobile = !!mobileDevice;

        const timestamps = Object.keys(measurements).sort();

        const ProductionSeries = timestamps.map(dt => [dt, measurements[dt]?.Production?.['active_power (kW)'] ?? null]);
        const ConsumptionSeries = timestamps.map(dt => [dt, measurements[dt]?.Consumption?.['active_power (kW)'] ?? null]);
        const forecastSeries = timestamps.map(dt => [dt, forecastData[dt]?.Total?.['active_power (kW)'] ?? null]);

        // Month-break vertical lines at the first timestamp of each new month after the first
        const uniqueMonths = [...new Set(timestamps.map(dt => dt.substring(0, 7)))];
        const monthBreakMarkLines = uniqueMonths.slice(1).map(month => {
            const ts = timestamps.find(dt => dt.startsWith(month));
            if (!ts) return null;
            const [year, mon] = month.split('-');
            return {
                name: `${MONTH_NAMES[parseInt(mon, 10) - 1]} ${year}`,
                xAxis: ts,
                lineStyle: { color: darkMode ? '#4b5563' : '#cbd5e1', width: 1, type: 'solid' },
                label: { show: true, formatter: '{b}', position: 'insideEndTop', color: darkMode ? '#9ca3af' : '#94a3b8', fontSize: 10, fontWeight: 600 },
            };
        }).filter(Boolean);

        return {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                position: (pt) => [pt[0], '10%'],
                valueFormatter: (value) => value != null ? value.toFixed(2) + ' kW' : '—',
                backgroundColor: darkMode ? '#1f2937' : '#fff',
                borderColor: darkMode ? '#374151' : '#ccc',
                textStyle: { color: darkMode ? '#d1d5db' : '#333' },
            },
            legend: { data: ['Production', 'Consumption', 'Forecast'], orient: 'vertical', top: 'middle', right: 0, textStyle: { color: darkMode ? '#d1d5db' : '#333' } },
            grid: isMobile
                ? { left: 10, right: 10, bottom: 100, top: 40, containLabel: true }
                : { left: 50, right: 90, bottom: 80, top: 40, containLabel: false },
            toolbox: {
                top: -13,
                feature: {
                    dataZoom: { yAxisIndex: 'none' },
                    magicType: { type: ['line', 'bar', 'stack', 'tiled'] },
                    saveAsImage: {}
                },
            },
            xAxis: {
                type: 'time',
                boundaryGap: false,
                axisLabel: { color: darkMode ? '#9ca3af' : '#666' },
                axisLine: { lineStyle: { color: darkMode ? '#374151' : '#ccc' } },
                splitLine: { lineStyle: { color: darkMode ? '#374151' : '#f0f0f0' } },
            },
            yAxis: {
                type: 'value',
                //name: '⚡ kW',
                //nameTextStyle: { fontSize: 16, align: 'left', padding: [0, 0, 0, 10], fontWeight: 'bold' },
                boundaryGap: [0, '20%'],
                axisLabel: { formatter: (val) => val.toFixed(2), color: darkMode ? '#9ca3af' : '#666' },
                splitLine: { lineStyle: { color: darkMode ? '#374151' : '#f0f0f0' } },
            },
            dataZoom: [
                { type: 'inside', start: 0, end: 100 },
                { type: 'slider', start: 0, end: 100, textStyle: { color: darkMode ? '#9ca3af' : '#666' }, borderColor: darkMode ? '#374151' : '#ccc', fillerColor: darkMode ? 'rgba(55,65,81,0.5)' : 'rgba(0,139,193,0.1)', backgroundColor: darkMode ? '#1f2937' : '#f8f8f8' },
            ],
            series: [
                {
                    name: 'Production',
                    type: 'line',
                    data: ProductionSeries,
                    smooth: true,
                    showSymbol: false,
                    color: '#0ea5e9',
                    areaStyle: {
                        color: {
                            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(14, 165, 233, 0.5)' },
                                { offset: 1, color: 'rgba(14, 165, 233, 0.02)' },
                            ],
                        },
                    },
                    markPoint: {
                        data: [
                            { type: 'max', name: 'Max', label: { formatter: (p) => p.value.toFixed(2) } },
                            { type: 'min', name: 'Min', label: { formatter: (p) => p.value.toFixed(2) } },
                        ],
                        symbol: 'pin',
                        symbolSize: 50,
                        label: { fontSize: 8 },
                    },
                    markLine: {
                        silent: true,
                        symbol: 'none',
                        data: monthBreakMarkLines,
                    },
                },
                {
                    name: 'Consumption',
                    type: 'line',
                    data: ConsumptionSeries,
                    smooth: true,
                    showSymbol: false,
                    color: '#10b981',
                    areaStyle: {
                        color: {
                            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(16, 185, 129, 0.5)' },
                                { offset: 1, color: 'rgba(16, 185, 129, 0.02)' },
                            ],
                        },
                    },
                    markPoint: {
                        data: [
                            { type: 'max', name: 'Max', label: { formatter: (p) => p.value.toFixed(2) } },
                            { type: 'min', name: 'Min', label: { formatter: (p) => p.value.toFixed(2) } },
                        ],
                        symbol: 'pin',
                        symbolSize: 50,
                        label: { fontSize: 8 },
                    },
                },
                {
                    name: 'Forecast',
                    type: 'line',
                    data: forecastSeries,
                    smooth: true,
                    showSymbol: false,
                    color: '#f59e0b',
                    lineStyle: { type: 'dashed', color: '#f59e0b' },
                    areaStyle: {
                        color: {
                            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(245, 158, 11, 0.3)' },
                                { offset: 1, color: 'rgba(245, 158, 11, 0.02)' },
                            ],
                        },
                    },
                    markPoint: {
                        data: [
                            { type: 'max', name: 'Max', label: { formatter: (p) => p.value.toFixed(2) } },
                            { type: 'min', name: 'Min', label: { formatter: (p) => p.value.toFixed(2) } },
                        ],
                        symbol: 'pin',
                        symbolSize: 50,
                        label: { fontSize: 8 },
                    },
                },
            ],
        };
    }, [dbGroupedMonth, interval, mobileDevice, darkMode]);

    const summary = dbGroupedMonth?.summary?.[interval] ?? {};

    const timestamps = Object.keys(dbGroupedMonth?.measurements ?? {}).sort();
    const firstTs = timestamps[0];
    const lastTs = timestamps[timestamps.length - 1];
    const dateRange = firstTs && lastTs
        ? `${firstTs.substring(0, 10)} – ${lastTs.substring(0, 10)}`
        : null;

    const cardBg = darkMode ? '#1f2937' : '#fff';
    const cardBorder = darkMode ? '#374151' : '#e5e7eb';
    const textPrimary = darkMode ? '#f9fafb' : '#111';
    const textMuted = darkMode ? '#6b7280' : '#888';

    const summaryCards = [
        { label: 'Total', data: summary.Total, icon: '🔋', color: '#008bc1', bg: '#e0f4fb', darkBg: '#0c2d3d' },
        { label: 'Production',   data: summary.Production,   icon: '⚡', color: '#0ea5e9', bg: '#e0f2fe', darkBg: '#0c2233' },
        { label: 'Consumption',   data: summary.Consumption,   icon: '⚡', color: '#10b981', bg: '#d1fae5', darkBg: '#052e22' },
    ];

    return (
        <Layout>
            <div style={{ padding: '24px 24px 48px 24px', overflowY: 'auto', height: '100%', background: darkMode ? '#111827' : undefined }}>

                {/* {dateRange && (
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#008bc1', marginBottom: 16 }}>
                        {dateRange}
                    </div>
                )} */}

                {/* Summary Cards */}
                <div style={{ display: 'flex', flexDirection: mobileDevice ? 'column' : 'row', gap: 16, marginBottom: 24 }}>
                    {summaryCards.map(({ label, data, icon, color, bg, darkBg }) => {
                        const activeBg = darkMode ? darkBg : bg;
                        return (
                        <div key={label} style={{
                            flex: 1,
                            background: cardBg,
                            border: `1px solid ${color}40`,
                            borderRadius: 12,
                            padding: '16px 20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ background: activeBg, borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                                        {icon}
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: 15, color }}>{label}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 11, fontWeight: 500, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Total Energy</div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: textPrimary, lineHeight: 1 }}>
                                        {data?.total_active_energy?.toFixed(2) ?? '—'}
                                        <span style={{ fontSize: 12, fontWeight: 500, color: textMuted, marginLeft: 4 }}>kWh</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {[
                                    { label: 'Avg', value: data?.avg_active_power },
                                    { label: 'Min', value: data?.min_active_power },
                                    { label: 'Max', value: data?.max_active_power },
                                ].map(({ label: stat, value }) => (
                                    <div key={stat} style={{ flex: 1, minWidth: 60, background: activeBg, borderRadius: 8, padding: '6px 10px', textAlign: 'center' }}>
                                        <div style={{ fontSize: 10, color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat}</div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>{value?.toFixed(2) ?? '—'}<span style={{ fontSize: 10, color: textMuted }}> kW</span></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        );
                    })}
                </div>

                {/* Chart Card */}
                <div style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: 10,
                    padding: '16px 20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                    <div style={{ touchAction: 'none' }}>
                        <ReactECharts option={chartOption} style={{ height: 500, width: '100%' }} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}