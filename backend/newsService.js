const axios = require('axios');
const cheerio = require('cheerio');

// ============================================
// 中国股市关键词（用于判断重要性）
// ============================================
const CHINA_STOCK_KEYWORDS = [
  'A股', '上证', '深证', '创业板', '科创板', '北交所',
  '央行', '证监会', '银保监会', '发改委', '财政部',
  '降准', '降息', '利率', '货币政策', '财政政策',
  'IPO', '上市', '退市', '停牌', '复牌',
  '涨停', '跌停', '熔断', '大宗交易',
  '外资', '北向资金', '南向资金', 'QFII', 'RQFII',
  '人民币', '汇率', '外汇储备',
  'GDP', 'CPI', 'PPI', 'PMI', '社融', 'M2'
];

const GLOBAL_IMPACT_KEYWORDS = [
  '美联储', 'FED', '加息', '降息', 'QE', '缩表',
  '贸易战', '关税', '制裁',
  '原油', '黄金', '美元指数',
  '美股', '港股', '欧股', '日股',
  '地缘政治', '战争', '冲突',
  '疫情', '疫苗', '经济衰退'
];

// ============================================
// 数据源抽象基类
// ============================================
class NewsDataSource {
  constructor(name) {
    this.name = name;
  }

  async fetch() {
    throw new Error('子类必须实现fetch方法');
  }

  // 标准化新闻数据格式
  normalize(item) {
    const parsedTime = this.parseTime(item.time);
    return {
      title: item.title || '',
      url: item.url || '',
      time: parsedTime.toISOString(),
      source: item.source || this.name,
      publishDate: item.publishDate || this.formatDate(parsedTime),
      originalData: item
    };
  }

  // 解析时间（支持ISO字符串、毫秒时间戳、秒时间戳）
  parseTime(time) {
    if (!time) return new Date();
    
    // 如果是字符串且不是纯数字，尝试直接解析
    if (typeof time === 'string' && isNaN(Number(time))) {
      return new Date(time);
    }
    
    // 如果是数字或数字字符串
    const timestamp = Number(time);
    
    // 判断是秒还是毫秒：如果数字小于1e10，认为是秒级时间戳
    if (timestamp < 1e10) {
      return new Date(timestamp * 1000);
    }
    
    return new Date(timestamp);
  }

  formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }
}

// ============================================
// 1. 新浪财经API数据源
// ============================================
class SinaFinanceAPI extends NewsDataSource {
  constructor() {
    super('新浪财经');
    this.baseUrl = 'https://r.inews.sina.com.cn/api/news/roll';
  }

  async fetch() {
    try {
      // 获取新浪实时财经新闻
      const response = await axios.get(this.baseUrl, {
        params: {
          col: 43,      // 财经分类
          page: 1,
          ch: '01',
          num: 20       // 获取20条
        },
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.data && response.data.result && response.data.result.data) {
        return response.data.result.data.map(item => this.normalize({
          title: item.title,
          url: item.url || `https://finance.sina.com.cn${item.docurl || ''}`,
          time: item.time || new Date().toISOString(),
          source: '新浪财经'
        }));
      }
      return [];
    } catch (error) {
      console.error(`[${this.name}] API获取失败:`, error.message);
      return [];
    }
  }
}

// ============================================
// 2. 东方财富API数据源
// ============================================
class EastMoneyAPI extends NewsDataSource {
  constructor() {
    super('东方财富');
    this.baseUrl = 'https://newsapi.eastmoney.com/kuaixun/v1/getlist_102_ajaxResult_50_1_.html';
  }

  async fetch() {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { r: Math.random() },
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.eastmoney.com/'
        }
      });

      // 东方财富返回的是JSONP格式，需要解析
      let data = response.data;
      if (typeof data === 'string') {
        // 去除JSONP包裹
        const match = data.match(/\((.*)\)/);
        if (match) {
          data = JSON.parse(match[1]);
        }
      }

      if (data && data.result && data.result.data) {
        return data.result.data.map(item => this.normalize({
          title: item.title || item.digest,
          url: item.url || `https://finance.eastmoney.com/a/${item.code}.html`,
          time: item.showtime || new Date().toISOString(),
          source: '东方财富'
        }));
      }
      return [];
    } catch (error) {
      console.error(`[${this.name}] API获取失败:`, error.message);
      return [];
    }
  }
}

// ============================================
// 3. 华尔街见闻API数据源
// ============================================
class WallStreetCNAPI extends NewsDataSource {
  constructor() {
    super('华尔街见闻');
    this.baseUrl = 'https://api-one.wallstcn.com/apiv1/content/articles';
  }

  async fetch() {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          category: 'global',
          limit: 20,
          platform: 'wscn-platform'
        },
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.data && response.data.data && response.data.data.items) {
        return response.data.data.items.map(item => this.normalize({
          title: item.title,
          url: item.uri || `https://wallstreetcn.com/articles/${item.id}`,
          time: item.display_time || new Date().toISOString(),
          source: '华尔街见闻'
        }));
      }
      return [];
    } catch (error) {
      console.error(`[${this.name}] API获取失败:`, error.message);
      return [];
    }
  }
}

// ============================================
// 新闻服务主类
// ============================================
class NewsService {
  constructor() {
    this.newsCache = [];
    this.lastUpdate = null;
    this.updateInterval = 5 * 60 * 1000; // 5分钟更新一次
    
    // 初始化数据源
    this.dataSources = [
      new SinaFinanceAPI(),
      new EastMoneyAPI(),
      new WallStreetCNAPI()
    ];
  }

  // 判断新闻对中国股市的影响程度
  calculateImpactScore(title, content = '') {
    const text = (title + ' ' + content).toLowerCase();
    let score = 0;
    let isHighImpact = false;

    CHINA_STOCK_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        score += 10;
        isHighImpact = true;
      }
    });

    GLOBAL_IMPACT_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        score += 5;
      }
    });

    return {
      score: Math.min(score, 100),
      isHighImpact: isHighImpact || score >= 20
    };
  }

  // 获取所有新闻 - 多数据源聚合
  async getAllNews() {
    // 检查缓存
    if (this.newsCache.length > 0 && this.lastUpdate &&
        Date.now() - this.lastUpdate < this.updateInterval) {
      return this.newsCache;
    }

    console.log('[NewsService] 开始获取新闻数据...');
    let allNews = [];

    // 1. 尝试从API获取数据
    for (const source of this.dataSources) {
      try {
        const news = await source.fetch();
        if (news && news.length > 0) {
          console.log(`[NewsService] ${source.name} 获取到 ${news.length} 条新闻`);
          allNews.push(...news);
        }
      } catch (error) {
        console.error(`[NewsService] ${source.name} 获取失败:`, error.message);
      }
    }

    // 2. 如果API没有获取到数据，使用模拟数据（降级方案）
    if (allNews.length === 0) {
      console.log('[NewsService] 使用模拟数据...');
      allNews = this.getMockNews();
    }

    // 4. 去重（基于URL）
    const seen = new Set();
    allNews = allNews.filter(news => {
      if (seen.has(news.url)) return false;
      seen.add(news.url);
      return true;
    });

    // 5. 处理数据（影响度评分 + 排序）
    this.newsCache = allNews.map(news => {
      const impact = this.calculateImpactScore(news.title);
      return {
        ...news,
        impactScore: impact.score,
        isHighImpact: impact.isHighImpact,
        timestamp: new Date(news.time).getTime()
      };
    }).sort((a, b) => b.timestamp - a.timestamp);

    this.lastUpdate = Date.now();
    console.log(`[NewsService] 数据获取完成，共 ${this.newsCache.length} 条新闻`);
    
    return this.newsCache;
  }

  // 获取高影响新闻
  async getHighImpactNews() {
    const allNews = await this.getAllNews();
    return allNews.filter(news => news.isHighImpact);
  }

  // 搜索新闻
  async searchNews(keyword) {
    const allNews = await this.getAllNews();
    const lowerKeyword = keyword.toLowerCase();
    return allNews.filter(news =>
      news.title.toLowerCase().includes(lowerKeyword)
    );
  }

  // 模拟数据（降级方案）
  getMockNews() {
    const now = new Date();
    return [
      {
        title: '央行宣布降准0.25个百分点 释放长期资金约5000亿元',
        url: 'https://finance.sina.com.cn/stock/',
        time: now.toISOString(),
        source: '新浪财经',
        publishDate: this.formatDate(now)
      },
      {
        title: '美联储维持利率不变 鲍威尔讲话释放重要信号',
        url: 'https://www.eastmoney.com/',
        time: new Date(now.getTime() - 3600000).toISOString(),
        source: '东方财富',
        publishDate: this.formatDate(new Date(now.getTime() - 3600000))
      },
      {
        title: 'A股三大指数集体收涨 创业板指涨超2%',
        url: 'https://quote.eastmoney.com/',
        time: new Date(now.getTime() - 7200000).toISOString(),
        source: '东方财富',
        publishDate: this.formatDate(new Date(now.getTime() - 7200000))
      }
    ];
  }

  formatDate(date) {
    return date.toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  // 关闭资源
  async close() {
    await this.crawler.close();
  }
}

module.exports = new NewsService();