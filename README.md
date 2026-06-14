# 实时财经新闻收集系统

一个实时收集全球财经新闻并标注对中国股市影响的Web应用，同时展示关键经济指标数据。

## 功能特性

- 📊 **实时新闻收集**：从东方财富、华尔街见闻等多个财经新闻源收集最新资讯
- 🔥 **智能影响标注**：自动识别对中国股市有重大影响的新闻并重点标注
- 💰 **经济指标展示**：CPI、PPI、PMI等关键经济指标的实时数据和历史走势
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
- Chart.js（图表展示）
- 响应式设计，无需额外框架依赖

## 项目结构

```
finance-news-collector/
├── .gitignore              # Git忽略配置
├── package.json            # 项目依赖配置
├── backend/
│   ├── server.js           # Express服务器
│   ├── newsService.js      # 新闻服务模块
│   ├── indicatorService.js # 经济指标服务模块
│   ├── config/
│   │   └── api.config.js   # API配置
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
cd finance-news-collector
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

### 获取经济指标概览
```
GET /api/indicators
```

### 获取单个指标详情
```
GET /api/indicators/{country}/{type}
```
支持的指标类型：`cpi`, `ppi`, `pmi`, `m2`, `gdp`, `unemployment`, `trade`

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

## 数据来源

### 新闻数据
- 东方财富API
- 华尔街见闻API
- 新浪财经API

### 经济指标数据
- **CPI/PPI/PMI**：东方财富数据中心（真实API数据）
- **其他指标**：模拟数据（待接入真实API）

## 注意事项

⚠️ **重要提示**：
1. 数据更新频率：当前设置为5分钟更新一次，可在 `newsService.js` 中修改 `updateInterval` 参数

2. 部分经济指标（M2、GDP、失业率等）暂使用模拟数据，如需真实数据需接入专业数据API

## 许可证

MIT License
