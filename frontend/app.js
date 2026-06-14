// API基础URL - 自动检测环境
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

// 当前显示的新闻数据
let currentNews = [];
let currentFilter = 'all';
let currentCountry = 'china';

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    loadAllNews();
    loadIndicators('china');
    setupAutoRefresh();
    setupSearchListener();
});

// 设置自动刷新（每5分钟）
function setupAutoRefresh() {
    setInterval(() => {
        // 刷新新闻
        if (currentFilter === 'all') {
            loadAllNews();
        } else if (currentFilter === 'high-impact') {
            loadHighImpactNews();
        }
        // 刷新指标（每小时刷新一次，这里简化为5分钟）
        loadIndicators(currentCountry);
    }, 5 * 60 * 1000);
}

// 设置搜索监听器
function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchNews();
        }
    });
}

// ==================== 标签页切换 ====================

function switchTab(tab) {
    const panels = document.querySelectorAll('.tab-panel');
    const buttons = document.querySelectorAll('.tab-btn');
    
    panels.forEach(p => p.classList.remove('active'));
    buttons.forEach(b => b.classList.remove('active'));
    
    document.getElementById(`${tab}Panel`).classList.add('active');
    document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
    
    // 如果切换到指标页面且数据未加载，加载数据
    if (tab === 'indicators') {
        loadIndicators(currentCountry);
    }
}

// ==================== 新闻相关功能 ====================

// 加载所有新闻
async function loadAllNews() {
    currentFilter = 'all';
    updateFilterButtons();
    await fetchNews('/news');
}

// 加载高影响新闻
async function loadHighImpactNews() {
    currentFilter = 'high-impact';
    updateFilterButtons();
    await fetchNews('/news/high-impact');
}

// 搜索新闻
async function searchNews() {
    const keyword = document.getElementById('searchInput').value.trim();
    if (!keyword) {
        loadAllNews();
        return;
    }

    currentFilter = 'search';
    updateFilterButtons();
    await fetchNews(`/news/search?keyword=${encodeURIComponent(keyword)}`);
}

// 获取新闻数据
async function fetchNews(endpoint) {
    const container = document.getElementById('newsContainer');
    const errorMessage = document.getElementById('errorMessage');

    container.innerHTML = '<div class="loading">加载中...</div>';
    errorMessage.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        const result = await response.json();

        if (result.success) {
            currentNews = result.data;
            displayNews(currentNews);
            updateStats(result.count, currentNews.filter(n => n.isHighImpact).length);

            // 更新最后更新时间
            if (result.lastUpdate) {
                document.getElementById('lastUpdate').textContent =
                    `最后更新: ${formatTime(result.lastUpdate)}`;
            }
        } else {
            throw new Error(result.error || '获取新闻失败');
        }
    } catch (error) {
        console.error('获取新闻失败:', error);
        container.innerHTML = '';
        errorMessage.textContent = `错误: ${error.message}`;
        errorMessage.style.display = 'block';
    }
}

// 显示新闻列表
function displayNews(news) {
    const container = document.getElementById('newsContainer');

    if (news.length === 0) {
        container.innerHTML = '<div class="loading">暂无新闻数据</div>';
        return;
    }

    container.innerHTML = news.map(item => createNewsCard(item)).join('');
}

// 创建新闻卡片
function createNewsCard(item) {
    const timeAgo = getTimeAgo(item.timestamp);
    const impactWidth = Math.min(item.impactScore, 100);
    const publishDate = item.publishDate || formatTime(item.timestamp);

    return `
        <div class="news-item ${item.isHighImpact ? 'high-impact' : ''}">
            <div class="news-title">
                <a href="${item.url}" target="_blank" rel="noopener noreferrer">
                    ${escapeHtml(item.title)}
                </a>
            </div>
            <div class="news-meta">
                <div>
                    <span class="news-source">${escapeHtml(item.source)}</span>
                    <span class="news-time">📅 ${publishDate}</span>
                    <span class="news-time-ago">(${timeAgo})</span>
                </div>
                <div class="impact-score">
                    <span>影响度:</span>
                    <div class="impact-bar">
                        <div class="impact-fill" style="width: ${impactWidth}%"></div>
                    </div>
                    <span>${item.impactScore}</span>
                </div>
            </div>
        </div>
    `;
}

// ==================== 经济指标相关功能 ====================

// 加载经济指标
async function loadIndicators(country) {
    currentCountry = country;
    
    // 更新按钮状态
    document.querySelectorAll('.country-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`country${country === 'china' ? 'China' : 'US'}`).classList.add('active');

    const container = document.getElementById('indicatorsGrid');
    container.innerHTML = '<div class="loading">加载中...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/indicators/${country}`);
        const result = await response.json();

        if (result.success) {
            displayIndicators(result.data);
            document.getElementById('indicatorCount').textContent = result.data.length;
            document.getElementById('indicatorUpdate').textContent = 
                result.lastUpdate ? formatTime(result.lastUpdate) : '-';
        } else {
            throw new Error(result.error || '获取指标失败');
        }
    } catch (error) {
        console.error('获取指标失败:', error);
        container.innerHTML = `<div class="loading">获取指标失败: ${error.message}</div>`;
    }
}

// 显示指标卡片
function displayIndicators(indicators) {
    const container = document.getElementById('indicatorsGrid');

    if (indicators.length === 0) {
        container.innerHTML = '<div class="loading">暂无指标数据</div>';
        return;
    }

    container.innerHTML = indicators.map(item => createIndicatorCard(item)).join('');
}

// 创建指标卡片
function createIndicatorCard(item) {
    const importanceClass = item.importance === 'high' ? 'high-importance' : 
                           (item.importance === 'medium' ? 'medium-importance' : '');
    
    return `
        <div class="indicator-card ${importanceClass}" onclick="showIndicatorDetail('${currentCountry}', '${item.type}')">
            <div class="indicator-name">${escapeHtml(item.name)}</div>
            <div class="indicator-short-name">${escapeHtml(item.shortName)}</div>
            <div class="indicator-value ${item.trend}">${escapeHtml(item.value)}</div>
            <div class="indicator-change ${item.trend}">${escapeHtml(item.change)}</div>
            <div class="indicator-period">${escapeHtml(item.period)}</div>
        </div>
    `;
}

// 显示指标详情
async function showIndicatorDetail(country, type) {
    const modal = document.getElementById('indicatorModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = '<div class="loading">加载中...</div>';
    modal.style.display = 'flex';

    try {
        const response = await fetch(`${API_BASE_URL}/indicators/${country}/${type}`);
        const result = await response.json();

        if (result.success) {
            modalBody.innerHTML = createIndicatorDetail(result.data);
            document.getElementById('modalTitle').textContent = 
                `${result.data.name} - ${result.data.shortName}`;
            
            // HTML已插入DOM，现在绘制图表
            setTimeout(() => {
                drawHistoryChart(result.data.history);
            }, 100);
        } else {
            throw new Error(result.error || '获取详情失败');
        }
    } catch (error) {
        console.error('获取指标详情失败:', error);
        modalBody.innerHTML = `<div class="loading">获取详情失败: ${error.message}</div>`;
    }
}

// 创建指标详情HTML
function createIndicatorDetail(data) {
    const historyHtml = data.history?.map((item) => `
        <tr>
            <td>${escapeHtml(item.month)}</td>
            <td>${escapeHtml(item.value)} 
                <span class="history-arrow ${item.change}">
                    ${item.change === 'up' ? '↑' : '↓'}
                </span>
            </td>
        </tr>
    `).join('') || '';

    const impactHtml = data.impact?.map(item => `
        <div class="impact-item">
            <div class="impact-sector">${escapeHtml(item.sector)}</div>
            <div class="impact-effect ${escapeHtml(item.effect)}">${escapeHtml(item.effect)}</div>
            <div class="impact-reason">${escapeHtml(item.reason)}</div>
        </div>
    `).join('') || '';

    return `
        <div class="detail-main">
            <div class="detail-value">
                <div class="number ${data.trend}">${escapeHtml(data.value)}</div>
                <div class="label">当前值</div>
            </div>
            <div class="detail-change ${data.trend}">
                <div class="arrow">${data.trend === 'up' ? '↑' : '↓'}</div>
                <div class="value">${escapeHtml(data.change)}</div>
                <div class="label">环比变化</div>
            </div>
            <div class="detail-value">
                <div class="number">${escapeHtml(data.previous)}</div>
                <div class="label">上期值</div>
            </div>
        </div>

        <div class="detail-section">
            <h3>📖 指标说明</h3>
            <div class="detail-description">${escapeHtml(data.description)}</div>
        </div>

        <div class="detail-section">
            <h3>📊 数据分析</h3>
            <div class="analysis-card">
                <h4>📝 分析摘要</h4>
                <p>${escapeHtml(data.analysis?.summary || '')}</p>
            </div>
            <div class="analysis-card">
                <h4>💡 投资建议</h4>
                <p>${escapeHtml(data.analysis?.suggestion || '')}</p>
            </div>
            <div style="display: flex; gap: 20px; margin-top: 15px;">
                <div style="flex: 1; text-align: center; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-weight: 600; color: #6c757d;">环比趋势</div>
                    <div style="font-size: 1.2em; font-weight: 700; margin-top: 5px; color: ${data.trend === 'up' ? '#28a745' : '#dc3545'};">
                        ${data.analysis?.trendAnalysis || '持平'}
                    </div>
                </div>
                <div style="flex: 1; text-align: center; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-weight: 600; color: #6c757d;">市场影响</div>
                    <div style="font-size: 1.2em; font-weight: 700; margin-top: 5px; color: #667eea;">
                        ${data.analysis?.marketImpact || '低'}
                    </div>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h3>📈 历史走势</h3>
            <div class="chart-container">
                <canvas id="historyChart"></canvas>
            </div>
            <div class="chart-legend">
                <div class="legend-item">
                    <span class="legend-color up"></span>
                    <span>上升趋势</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color down"></span>
                    <span>下降趋势</span>
                </div>
            </div>
            <table class="history-table" style="margin-top: 20px;">
                <thead>
                    <tr>
                        <th>时间</th>
                        <th>数值</th>
                    </tr>
                </thead>
                <tbody>
                    ${historyHtml}
                </tbody>
            </table>
        </div>

        <div class="detail-section">
            <h3>🎯 市场影响</h3>
            <div class="impact-list">
                ${impactHtml}
            </div>
        </div>
    `;
    
    return html;
}

// 绘制历史折线图
function drawHistoryChart(history) {
    const ctx = document.getElementById('historyChart');
    if (!ctx) return;
    
    // 销毁已存在的图表
    if (window.historyChartInstance) {
        window.historyChartInstance.destroy();
    }
    
    // API返回的数据是从新到旧排列的，需要反转使其从旧到新（横坐标从左到右递增）
    const reversedHistory = [...history].reverse();
    
    // 提取标签和数值
    const labels = reversedHistory.map(item => item.month);
    const values = reversedHistory.map(item => parseFloat(item.value));
    
    // 颜色判断：与下一点比较
    const colors = reversedHistory.map((item, index) => {
        if (index === reversedHistory.length - 1) {
            // 最后一个点（最新数据），使用绿色表示
            return 'rgba(40, 167, 69, 0.8)';
        }
        // 与下一点比较（因为已反转，下一点是更新的数据）
        return parseFloat(item.value) <= parseFloat(reversedHistory[index + 1].value) ? 
            'rgba(40, 167, 69, 0.8)' : 'rgba(220, 53, 69, 0.8)';
    });
    
    window.historyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '数值',
                data: values,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: colors,
                pointBorderColor: colors,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            const item = history[context.dataIndex];
                            const trend = item.change === 'up' ? '↑' : '↓';
                            return `数值: ${value.toFixed(2)}% ${trend}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}


// 关闭弹窗
function closeModal() {
    document.getElementById('indicatorModal').style.display = 'none';
}

// 点击弹窗外部关闭
document.getElementById('indicatorModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('indicatorModal')) {
        closeModal();
    }
});

// ==================== 工具函数 ====================

// 更新统计信息
function updateStats(total, highImpact) {
    document.getElementById('totalCount').textContent = total;
    document.getElementById('highImpactCount').textContent = highImpact;
}

// 更新筛选按钮状态
function updateFilterButtons() {
    const buttons = document.querySelectorAll('.btn-filter');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (currentFilter === 'all') {
        document.getElementById('btnAll').classList.add('active');
    } else if (currentFilter === 'high-impact') {
        document.getElementById('btnHighImpact').classList.add('active');
    }
}

// 格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 获取相对时间
function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    return formatTime(timestamp);
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}