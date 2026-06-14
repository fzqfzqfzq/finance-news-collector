# 实时财经新闻收集系统

一个实时收集全球财经新闻并标注对中国股市影响的Web应用。

## 功能特性

- 📊 **实时新闻收集**：从多个财经新闻源收集最新资讯
- 🔥 **智能标注**：自动识别对中国股市有重大影响的新闻并重点标注
- 🔍 **搜索功能**：支持关键词搜索新闻
- 📱 **响应式设计**：支持桌面和移动设备访问
- ⏰ **自动刷新**：每5分钟自动更新新闻数据

## 技术栈

### 后端
- Node.js + Express
- Axios（HTTP请求）
- Cheerio（HTML解析）

### 前端
- 原生HTML + CSS + JavaScript
- 响应式设计
- 无需额外框架依赖

## 项目结构

```
finance-news-collector/
├── backend/
│   ├── server.js           # Express服务器
│   ├── newsService.js      # 新闻服务模块
│   └── package.json        # 后端依赖配置
├── frontend/
│   ├── index.html          # 主页面
│   ├── styles.css          # 样式文件
│   └── app.js              # 前端逻辑
└── README.md
```

## 安装和运行

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 启动服务器

```bash
npm start
```

服务器将在 `http://localhost:3000` 运行。

### 3. 访问应用

在浏览器中打开 `http://localhost:3000`

## API接口

### 获取所有新闻
```
GET /api/news
```

### 获取高影响新闻
```
GET /api/news/high-impact
```

### 搜索新闻
```
GET /api/news/search?keyword=关键词
```

### 健康检查
```
GET /api/health
```

## 新闻影响评分机制

系统根据以下关键词对新闻进行影响评分：

### 中国股市关键词（每个+10分）
- A股、上证、深证、创业板、科创板、北交所
- 央行、证监会、银保监会、发改委、财政部
- 降准、降息、利率、货币政策、财政政策
- IPO、上市、退市、停牌、复牌
- 涨停、跌停、熔断、大宗交易
- 外资、北向资金、南向资金、QFII、RQFII
- 人民币、汇率、外汇储备
- GDP、CPI、PPI、PMI、社融、M2

### 全球影响关键词（每个+5分）
- 美联储、FED、加息、降息、QE、缩表
- 贸易战、关税、制裁
- 原油、黄金、美元指数
- 美股、港股、欧股、日股
- 地缘政治、战争、冲突
- 疫情、疫苗、经济衰退

**影响度≥20分的新闻将被标记为"重点新闻"**

## 自定义配置

### 添加新闻源
在 `backend/newsService.js` 中的 `NEWS_SOURCES` 对象添加新的新闻源配置：

```javascript
const NEWS_SOURCES = {
  yourSource: {
    name: '新闻源名称',
    url: 'https://example.com',
    selector: '.news-item a',
    baseUrl: 'https://example.com'
  }
};
```

### 调整关键词权重
在 `newsService.js` 中修改 `CHINA_STOCK_KEYWORDS` 和 `GLOBAL_IMPACT_KEYWORDS` 数组。

## 注意事项

⚠️ **重要提示**：
1. 当前版本使用模拟数据，实际部署时需要：
   - 接入真实的新闻API（如新浪财经API、东方财富API等）
   - 或使用爬虫技术抓取新闻网站（需遵守网站robots.txt和相关法律法规）

2. 跨域问题：
   - 浏览器直接访问新闻网站会遇到CORS限制
   - 建议使用后端代理或接入官方API

3. 数据更新频率：
   - 当前设置为5分钟更新一次
   - 可在 `newsService.js` 中修改 `updateInterval` 参数

## 未来改进方向

- [ ] 接入真实新闻API
- [ ] 添加用户订阅功能
- [ ] 实现新闻分类（宏观经济、行业动态、公司新闻等）
- [ ] 添加情感分析功能
- [ ] 支持新闻收藏和分享
- [ ] 添加推送通知功能
- [ ] 实现更智能的影响度评分算法

## 许可证

MIT License