const express = require('express');
const cors = require('cors');
const path = require('path');
const newsService = require('./newsService');
const indicatorService = require('./indicatorService');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务 - 支持本地和Railway部署
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// API路由

// 获取所有新闻
app.get('/api/news', async (req, res) => {
  try {
    const news = await newsService.getAllNews();
    res.json({
      success: true,
      data: news,
      count: news.length,
      lastUpdate: newsService.lastUpdate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取高影响新闻
app.get('/api/news/high-impact', async (req, res) => {
  try {
    const news = await newsService.getHighImpactNews();
    res.json({
      success: true,
      data: news,
      count: news.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 搜索新闻
app.get('/api/news/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: '请提供搜索关键词'
      });
    }

    const news = await newsService.searchNews(keyword);
    res.json({
      success: true,
      data: news,
      count: news.length,
      keyword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取所有经济指标
app.get('/api/indicators', async (req, res) => {
  try {
    const indicators = await indicatorService.getAllIndicators();
    res.json({
      success: true,
      data: indicators,
      lastUpdate: indicatorService.lastUpdate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取中国经济指标
app.get('/api/indicators/china', async (req, res) => {
  try {
    const indicators = await indicatorService.getChinaIndicators();
    res.json({
      success: true,
      data: indicators,
      lastUpdate: indicatorService.lastUpdate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取美国经济指标
app.get('/api/indicators/us', async (req, res) => {
  try {
    const indicators = await indicatorService.getUSIndicators();
    res.json({
      success: true,
      data: indicators,
      lastUpdate: indicatorService.lastUpdate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取指标详情
app.get('/api/indicators/:country/:type', async (req, res) => {
  try {
    const { country, type } = req.params;
    const indicator = await indicatorService.getIndicatorDetail(country, type);
    
    if (!indicator) {
      return res.status(404).json({
        success: false,
        error: '指标不存在'
      });
    }
    
    res.json({
      success: true,
      data: indicator
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`财经新闻服务器运行在 http://localhost:${PORT}`);
  console.log(`API文档:`);
  console.log(`  GET /api/news - 获取所有新闻`);
  console.log(`  GET /api/news/high-impact - 获取高影响新闻`);
  console.log(`  GET /api/news/search?keyword=关键词 - 搜索新闻`);
  console.log(`  GET /api/health - 健康检查`);
});

module.exports = app;