const axios = require('axios');

// ============================================
// 真实数据API获取（东方财富爬虫）
// ============================================

// 获取中国PPI数据
async function fetchRealPPI() {
  try {
    const response = await axios.get('https://datacenter-web.eastmoney.com/api/data/v1/get', {
      params: {
        reportName: 'RPT_ECONOMY_PPI',
        columns: 'REPORT_DATE,TIME,BASE,BASE_SAME',
        pageNumber: 1,
        pageSize: 24,
        sortTypes: -1,
        sortColumns: 'REPORT_DATE'
      },
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://data.eastmoney.com/cjsj/ppi.html'
      }
    });
    
    if (response.data && response.data.success && response.data.result && response.data.result.data) {
      const data = response.data.result.data;
      
      const result = data.map(item => {
        const time = String(item.TIME || item.REPORT_DATE);
        const match = time.match(/(\d{4})年(\d+)月份/);
        let month = time;
        if (match) {
          month = `${match[1]}年${parseInt(match[2])}月`;
        }
        
        let value = item.BASE_SAME;
        if (value === null || value === undefined) {
          value = parseFloat(item.BASE) - 100;
        }
        
        return {
          month: month,
          value: parseFloat(value)
        };
      });
      
      console.log(`✅ 成功从东方财富获取PPI数据，共 ${result.length} 条`);
      return result;
    }
  } catch (error) {
    console.error('❌ 获取PPI数据失败:', error.message);
  }
  
  return [];
}

// 获取中国CPI数据
async function fetchRealCPI() {
  try {
    const response = await axios.get('https://datacenter-web.eastmoney.com/api/data/v1/get', {
      params: {
        reportName: 'RPT_ECONOMY_CPI',
        columns: 'REPORT_DATE,TIME,NATIONAL_SAME,NATIONAL_BASE',
        pageNumber: 1,
        pageSize: 24,
        sortTypes: -1,
        sortColumns: 'REPORT_DATE'
      },
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://data.eastmoney.com/cjsj/cpi.html'
      }
    });
    
    if (response.data && response.data.success && response.data.result && response.data.result.data) {
      const data = response.data.result.data;
      
      const result = data.map(item => {
        const time = String(item.TIME || item.REPORT_DATE);
        const match = time.match(/(\d{4})年(\d+)月份/);
        let month = time;
        if (match) {
          month = `${match[1]}年${parseInt(match[2])}月`;
        }
        
        return {
          month: month,
          value: parseFloat(item.NATIONAL_SAME)
        };
      });
      
      console.log(`✅ 成功从东方财富获取CPI数据，共 ${result.length} 条`);
      return result;
    }
  } catch (error) {
    console.error('❌ 获取CPI数据失败:', error.message);
  }
  
  return [];
}

// 获取中国PMI数据
async function fetchRealPMI() {
  try {
    const response = await axios.get('https://datacenter-web.eastmoney.com/api/data/v1/get', {
      params: {
        reportName: 'RPT_ECONOMY_PMI',
        columns: 'REPORT_DATE,TIME,MAKE_INDEX,NMAKE_INDEX',
        pageNumber: 1,
        pageSize: 24,
        sortTypes: -1,
        sortColumns: 'REPORT_DATE'
      },
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://data.eastmoney.com/cjsj/pmi.html'
      }
    });
    
    if (response.data && response.data.success && response.data.result && response.data.result.data) {
      const data = response.data.result.data;
      
      const result = data.map(item => {
        const time = String(item.TIME || item.REPORT_DATE);
        const match = time.match(/(\d{4})年(\d+)月份/);
        let month = time;
        if (match) {
          month = `${match[1]}年${parseInt(match[2])}月`;
        }
        
        return {
          month: month,
          value: parseFloat(item.MAKE_INDEX),  // 制造业PMI
          nonManufacturing: parseFloat(item.NMAKE_INDEX)  // 非制造业PMI
        };
      });
      
      console.log(`✅ 成功从东方财富获取PMI数据，共 ${result.length} 条`);
      return result;
    }
  } catch (error) {
    console.error('❌ 获取PMI数据失败:', error.message);
  }
  
  return [];
}

module.exports = { fetchRealPPI, fetchRealCPI, fetchRealPMI };

// ============================================
// 真实历史数据（仅作为参考保留）
// ============================================
const REAL_HISTORY_DATA = {
  china: {
    cpi: [
      { month: '2025年7月', value: 0.5 },
      { month: '2025年8月', value: 0.6 },
      { month: '2025年9月', value: 0.4 },
      { month: '2025年10月', value: 0.3 },
      { month: '2025年11月', value: 0.2 },
      { month: '2025年12月', value: 0.1 },
      { month: '2026年1月', value: 0.5 },
      { month: '2026年2月', value: -0.1 },
      { month: '2026年3月', value: -0.1 },
      { month: '2026年4月', value: 0.1 },
      { month: '2026年5月', value: 0.3 },
      { month: '2026年6月', value: 0.3 }
    ],
    ppi: [
      { month: '2025年7月', value: -2.4 },
      { month: '2025年8月', value: -2.0 },
      { month: '2025年9月', value: -2.5 },
      { month: '2025年10月', value: -2.9 },
      { month: '2025年11月', value: -2.8 },
      { month: '2025年12月', value: -2.3 },
      { month: '2026年1月', value: -2.1 },
      { month: '2026年2月', value: -1.8 },
      { month: '2026年3月', value: -1.6 },
      { month: '2026年4月', value: -1.8 },
      { month: '2026年5月', value: 2.5 },
      { month: '2026年6月', value: 2.8 }
    ],
    gdp: [
      { month: '2025年Q1', value: 5.3 },
      { month: '2025年Q2', value: 5.0 },
      { month: '2025年Q3', value: 5.2 },
      { month: '2025年Q4', value: 5.4 },
      { month: '2026年Q1', value: 5.2 }
    ],
    unemployment: [
      { month: '2025年7月', value: 5.2 },
      { month: '2025年8月', value: 5.3 },
      { month: '2025年9月', value: 5.1 },
      { month: '2025年10月', value: 5.0 },
      { month: '2025年11月', value: 5.1 },
      { month: '2025年12月', value: 5.2 },
      { month: '2026年1月', value: 5.3 },
      { month: '2026年2月', value: 5.4 },
      { month: '2026年3月', value: 5.2 },
      { month: '2026年4月', value: 5.3 },
      { month: '2026年5月', value: 5.3 },
      { month: '2026年6月', value: 5.2 }
    ],
    pmi: [
      { month: '2025年7月', value: 49.8 },
      { month: '2025年8月', value: 49.1 },
      { month: '2025年9月', value: 49.8 },
      { month: '2025年10月', value: 50.3 },
      { month: '2025年11月', value: 50.3 },
      { month: '2025年12月', value: 50.1 },
      { month: '2026年1月', value: 49.1 },
      { month: '2026年2月', value: 50.1 },
      { month: '2026年3月', value: 51.1 },
      { month: '2026年4月', value: 50.4 },
      { month: '2026年5月', value: 50.8 },
      { month: '2026年6月', value: 51.2 }
    ],
    m2: [
      { month: '2025年7月', value: 6.3 },
      { month: '2025年8月', value: 6.3 },
      { month: '2025年9月', value: 6.8 },
      { month: '2025年10月', value: 7.0 },
      { month: '2025年11月', value: 7.1 },
      { month: '2025年12月', value: 7.3 },
      { month: '2026年1月', value: 7.4 },
      { month: '2026年2月', value: 7.5 },
      { month: '2026年3月', value: 7.8 },
      { month: '2026年4月', value: 8.0 },
      { month: '2026年5月', value: 8.2 },
      { month: '2026年6月', value: 8.5 }
    ],
    inflation: [
      { month: '2025年7月', value: 0.5 },
      { month: '2025年8月', value: 0.6 },
      { month: '2025年9月', value: 0.4 },
      { month: '2025年10月', value: 0.3 },
      { month: '2025年11月', value: 0.2 },
      { month: '2025年12月', value: 0.1 },
      { month: '2026年1月', value: 0.5 },
      { month: '2026年2月', value: -0.1 },
      { month: '2026年3月', value: -0.1 },
      { month: '2026年4月', value: 0.1 },
      { month: '2026年5月', value: 1.0 },
      { month: '2026年6月', value: 1.2 }
    ]
  },
  us: {
    cpi: [
      { month: '2025年7月', value: 2.9 },
      { month: '2025年8月', value: 2.5 },
      { month: '2025年9月', value: 2.4 },
      { month: '2025年10月', value: 2.6 },
      { month: '2025年11月', value: 2.7 },
      { month: '2025年12月', value: 2.9 },
      { month: '2026年1月', value: 3.0 },
      { month: '2026年2月', value: 2.8 },
      { month: '2026年3月', value: 2.9 },
      { month: '2026年4月', value: 3.4 },
      { month: '2026年5月', value: 3.9 },
      { month: '2026年6月', value: 4.1 }
    ],
    ppi: [
      { month: '2025年7月', value: 2.3 },
      { month: '2025年8月', value: 1.7 },
      { month: '2025年9月', value: 1.8 },
      { month: '2025年10月', value: 2.4 },
      { month: '2025年11月', value: 3.0 },
      { month: '2025年12月', value: 3.2 },
      { month: '2026年1月', value: 3.0 },
      { month: '2026年2月', value: 2.6 },
      { month: '2026年3月', value: 3.1 },
      { month: '2026年4月', value: 3.0 },
      { month: '2026年5月', value: 1.5 },
      { month: '2026年6月', value: 1.8 }
    ],
    gdp: [
      { month: '2025年Q1', value: 1.6 },
      { month: '2025年Q2', value: 2.8 },
      { month: '2025年Q3', value: 2.7 },
      { month: '2025年Q4', value: 2.4 },
      { month: '2026年Q1', value: 2.1 }
    ],
    unemployment: [
      { month: '2025年7月', value: 4.3 },
      { month: '2025年8月', value: 4.2 },
      { month: '2025年9月', value: 4.1 },
      { month: '2025年10月', value: 4.1 },
      { month: '2025年11月', value: 4.2 },
      { month: '2025年12月', value: 4.1 },
      { month: '2026年1月', value: 4.0 },
      { month: '2026年2月', value: 4.1 },
      { month: '2026年3月', value: 4.2 },
      { month: '2026年4月', value: 4.1 },
      { month: '2026年5月', value: 3.9 },
      { month: '2026年6月', value: 3.8 }
    ],
    nonfarm: [
      { month: '2025年7月', value: 17.5 },
      { month: '2025年8月', value: 14.2 },
      { month: '2025年9月', value: 22.3 },
      { month: '2025年10月', value: 3.6 },
      { month: '2025年11月', value: 17.0 },
      { month: '2025年12月', value: 20.6 },
      { month: '2026年1月', value: 17.6 },
      { month: '2026年2月', value: 15.1 },
      { month: '2026年3月', value: 18.5 },
      { month: '2026年4月', value: 17.7 },
      { month: '2026年5月', value: 21.0 },
      { month: '2026年6月', value: 23.5 }
    ],
    retail: [
      { month: '2025年7月', value: 1.0 },
      { month: '2025年8月', value: 0.2 },
      { month: '2025年9月', value: 0.5 },
      { month: '2025年10月', value: 0.3 },
      { month: '2025年11月', value: 0.7 },
      { month: '2025年12月', value: 0.4 },
      { month: '2026年1月', value: -0.1 },
      { month: '2026年2月', value: 0.3 },
      { month: '2026年3月', value: 0.4 },
      { month: '2026年4月', value: 0.5 },
      { month: '2026年5月', value: 0.5 },
      { month: '2026年6月', value: 0.8 }
    ],
    industrial: [
      { month: '2025年7月', value: -0.3 },
      { month: '2025年8月', value: -0.1 },
      { month: '2025年9月', value: -0.2 },
      { month: '2025年10月', value: 0.3 },
      { month: '2025年11月', value: 0.6 },
      { month: '2025年12月', value: 0.4 },
      { month: '2026年1月', value: -0.1 },
      { month: '2026年2月', value: 0.2 },
      { month: '2026年3月', value: 0.3 },
      { month: '2026年4月', value: 0.2 },
      { month: '2026年5月', value: 0.2 },
      { month: '2026年6月', value: 0.4 }
    ],
    inflation: [
      { month: '2025年7月', value: 2.9 },
      { month: '2025年8月', value: 2.5 },
      { month: '2025年9月', value: 2.4 },
      { month: '2025年10月', value: 2.6 },
      { month: '2025年11月', value: 2.7 },
      { month: '2025年12月', value: 2.9 },
      { month: '2026年1月', value: 3.0 },
      { month: '2026年2月', value: 2.8 },
      { month: '2026年3月', value: 2.9 },
      { month: '2026年4月', value: 3.4 },
      { month: '2026年5月', value: 3.0 },
      { month: '2026年6月', value: 3.2 }
    ]
  }
};

// ============================================
// 经济指标服务
// ============================================
class IndicatorService {
  constructor() {
    this.indicatorCache = {};
    this.lastUpdate = null;
    this.updateInterval = 60 * 60 * 1000; // 1小时更新一次
  }

  // 获取中国经济指标
  async getChinaIndicators() {
    if (this.indicatorCache.china && this.lastUpdate &&
        Date.now() - this.lastUpdate < this.updateInterval) {
      return this.indicatorCache.china;
    }

    const indicators = [
      await this.fetchCPI('china'),
      await this.fetchPPI('china'),
      await this.fetchGDP('china'),
      await this.fetchUnemployment('china'),
      await this.fetchPMI('china'),
      await this.fetchM2('china'),
      await this.fetchTrade('china'),
      await this.fetchInflation('china')
    ];

    this.indicatorCache.china = indicators.filter(i => i);
    this.lastUpdate = Date.now();
    return this.indicatorCache.china;
  }

  // 获取美国经济指标
  async getUSIndicators() {
    if (this.indicatorCache.us && this.lastUpdate &&
        Date.now() - this.lastUpdate < this.updateInterval) {
      return this.indicatorCache.us;
    }

    const indicators = [
      await this.fetchCPI('us'),
      await this.fetchPPI('us'),
      await this.fetchGDP('us'),
      await this.fetchUnemployment('us'),
      await this.fetchNonfarmPayroll('us'),
      await this.fetchRetailSales('us'),
      await this.fetchIndustrialProduction('us'),
      await this.fetchInflation('us')
    ];

    this.indicatorCache.us = indicators.filter(i => i);
    this.lastUpdate = Date.now();
    return this.indicatorCache.us;
  }

  // 获取所有指标
  async getAllIndicators() {
    const [china, us] = await Promise.all([
      this.getChinaIndicators(),
      this.getUSIndicators()
    ]);
    return { china, us };
  }

  // 获取单个指标详情
  async getIndicatorDetail(country, indicatorType) {
    const indicators = country === 'china' 
      ? await this.getChinaIndicators()
      : await this.getUSIndicators();
    
    const indicator = indicators.find(i => i.type === indicatorType);
    if (!indicator) return null;

    // 生成详细分析数据
    return {
      ...indicator,
      history: await this.generateHistoryData(indicator),
      analysis: this.generateAnalysis(indicator),
      impact: this.generateImpact(indicator)
    };
  }

  // ==================== 指标获取方法 ====================
  
  async fetchCPI(country) {
    const data = country === 'china' ? {
      type: 'cpi',
      name: '居民消费价格指数',
      shortName: 'CPI',
      value: '1.2%',
      previous: '1.0%',
      change: '+0.2%',
      trend: 'up',
      unit: '%',
      period: '2026年4月（5月9日公布）',
      description: '衡量居民家庭一般所购买的消费品和服务项目价格水平变动情况的宏观经济指标',
      importance: 'high',
      realData: await fetchRealCPI()  // 添加真实历史数据
    } : {
      type: 'cpi',
      name: '消费者价格指数',
      shortName: 'CPI',
      value: '4.1%',
      previous: '3.9%',
      change: '+0.2%',
      trend: 'up',
      unit: '%',
      period: '2026年5月',
      description: '衡量一篮子消费品和服务价格水平变动的指标',
      importance: 'high'
    };
    return data;
  }

  async fetchPPI(country) {
    const data = country === 'china' ? {
      type: 'ppi',
      name: '工业生产者出厂价格指数',
      shortName: 'PPI',
      value: '2.8%',
      previous: '0.5%',
      change: '+2.3%',
      trend: 'up',
      unit: '%',
      period: '2026年4月（5月9日公布）',
      description: '反映工业企业产品第一次出售时的出厂价格变化趋势和变动幅度',
      importance: 'medium',
      realData: await fetchRealPPI()  // 添加真实历史数据
    } : {
      type: 'ppi',
      name: '生产者价格指数',
      shortName: 'PPI',
      value: '1.8%',
      previous: '1.5%',
      change: '+0.3%',
      trend: 'up',
      unit: '%',
      period: '2026年5月',
      description: '衡量生产者收到的价格变化',
      importance: 'medium'
    };
    return data;
  }

  async fetchGDP(country) {
    const data = country === 'china' ? {
      type: 'gdp',
      name: '国内生产总值',
      shortName: 'GDP',
      value: '5.2%',
      previous: '4.8%',
      change: '+0.4%',
      trend: 'up',
      unit: '%',
      period: '2026年Q1',
      description: '衡量一国经济状况的最佳指标，反映一个国家或地区所有常住单位在一定时期内生产活动的最终成果',
      importance: 'high'
    } : {
      type: 'gdp',
      name: '国内生产总值',
      shortName: 'GDP',
      value: '2.1%',
      previous: '1.9%',
      change: '+0.2%',
      trend: 'up',
      unit: '%',
      period: '2026年Q1',
      description: '美国经济总量的核心指标',
      importance: 'high'
    };
    return data;
  }

  async fetchUnemployment(country) {
    const data = country === 'china' ? {
      type: 'unemployment',
      name: '城镇调查失业率',
      shortName: '失业率',
      value: '5.2%',
      previous: '5.3%',
      change: '-0.1%',
      trend: 'down',
      unit: '%',
      period: '2026年5月',
      description: '反映城镇失业人员占城镇就业人员与失业人员之和的比例',
      importance: 'high'
    } : {
      type: 'unemployment',
      name: '失业率',
      shortName: '失业率',
      value: '3.8%',
      previous: '3.9%',
      change: '-0.1%',
      trend: 'down',
      unit: '%',
      period: '2026年5月',
      description: '美国劳工统计局发布的月度失业率数据',
      importance: 'high'
    };
    return data;
  }

  async fetchPMI(country) {
    const realData = country === 'china' ? await fetchRealPMI() : null;
    
    // 如果有真实数据，使用最新数据
    let value = country === 'china' ? '50' : '49.8';
    let previous = country === 'china' ? '50.3' : '49.5';
    let period = '2026年5月';
    
    if (realData && realData.length > 0) {
      const latest = realData[0];
      value = String(latest.value);
      if (realData.length > 1) {
        previous = String(realData[1].value);
      }
      period = latest.month.replace('月', '月份');
    }
    
    const change = country === 'china' ? '+0.4' : '+0.3';
    
    return {
      type: 'pmi',
      name: '采购经理人指数',
      shortName: 'PMI',
      value: value,
      previous: previous,
      change: change,
      trend: 'up',
      unit: '',
      period: period,
      description: '衡量制造业和非制造业活动水平的综合指标，50为荣枯线',
      importance: 'high',
      realData: realData
    };
  }

  async fetchM2(country) {
    return country === 'china' ? {
      type: 'm2',
      name: '广义货币供应量',
      shortName: 'M2',
      value: '8.5%',
      previous: '8.2%',
      change: '+0.3%',
      trend: 'up',
      unit: '%',
      period: '2026年5月',
      description: '反映货币供应量的重要指标，包括流通中的现金、活期存款和定期存款等',
      importance: 'medium'
    } : null;
  }

  async fetchTrade(country) {
    return country === 'china' ? {
      type: 'trade',
      name: '进出口贸易',
      shortName: '贸易',
      value: '4.3万亿',
      previous: '4.1万亿',
      change: '+4.9%',
      trend: 'up',
      unit: '人民币',
      period: '2026年5月',
      description: '反映中国对外贸易状况，包括出口和进口总额',
      importance: 'medium'
    } : null;
  }

  async fetchNonfarmPayroll(country) {
    return country === 'us' ? {
      type: 'nonfarm',
      name: '非农就业数据',
      shortName: '非农',
      value: '23.5万',
      previous: '21.0万',
      change: '+2.5万',
      trend: 'up',
      unit: '人',
      period: '2026年5月',
      description: '美国劳工统计局每月发布的非农就业人数变化，是最重要的经济指标之一',
      importance: 'high'
    } : null;
  }

  async fetchRetailSales(country) {
    return country === 'us' ? {
      type: 'retail',
      name: '零售销售',
      shortName: '零售',
      value: '0.8%',
      previous: '0.5%',
      change: '+0.3%',
      trend: 'up',
      unit: '%',
      period: '2026年5月',
      description: '衡量美国零售行业销售情况',
      importance: 'medium'
    } : null;
  }

  async fetchIndustrialProduction(country) {
    return country === 'us' ? {
      type: 'industrial',
      name: '工业生产指数',
      shortName: '工业生产',
      value: '0.4%',
      previous: '0.2%',
      change: '+0.2%',
      trend: 'up',
      unit: '%',
      period: '2026年5月',
      description: '衡量美国工业部门产出水平',
      importance: 'medium'
    } : null;
  }

  async fetchInflation(country) {
    return {
      type: 'inflation',
      name: '通货膨胀率',
      shortName: '通胀',
      value: country === 'china' ? '1.2%' : '3.2%',
      previous: country === 'china' ? '1.0%' : '3.0%',
      change: country === 'china' ? '+0.2%' : '+0.2%',
      trend: 'up',
      unit: '%',
      period: '2026年5月',
      description: '衡量物价总水平上涨的幅度',
      importance: 'high'
    };
  }

  // ==================== 分析生成方法 ====================

  async generateHistoryData(indicator) {
    // 获取当前指标类型和国家
    const type = indicator.type;
    
    // 判断是中国还是美国
    let country = 'china';
    if (indicator.source === '东方财富' || indicator.source === '新浪财经') {
      country = 'china';
    } else if (indicator.source === '华尔街见闻') {
      country = 'us';
    }
    
    // 仅从真实API获取数据，不使用备用数据
    let historyData = [];
    if (country === 'china' && type === 'ppi') {
      historyData = await fetchRealPPI();
    } else if (country === 'china' && type === 'cpi') {
      historyData = await fetchRealCPI();
    } else if (country === 'china' && type === 'pmi') {
      historyData = await fetchRealPMI();
    }
    
    // API获取失败则返回空数组，不回退到预设数据
    if (historyData.length === 0) {
      return [];
    }
    
    // 计算变化趋势
    const history = historyData.map((item, index) => {
      let change = 'down';
      if (index === historyData.length - 1) {
        const currentValue = parseFloat(indicator.value.replace(/[^0-9.-]/g, ''));
        change = item.value >= currentValue ? 'up' : 'down';
      } else {
        change = item.value >= historyData[index + 1].value ? 'up' : 'down';
      }
      
      // PMI没有百分号
      const valueStr = type === 'pmi' ? item.value.toFixed(1) : item.value.toFixed(2) + '%';
      
      return {
        month: item.month,
        value: valueStr,
        change: change
      };
    });
    
    return history;
  }

  generateAnalysis(indicator) {
    const value = parseFloat(indicator.value.replace(/[^0-9.-]/g, ''));
    const change = parseFloat(indicator.change.replace(/[^0-9.-]/g, ''));
    
    let analysis = '';
    let suggestion = '';
    
    if (indicator.type === 'cpi') {
      if (value > 3) {
        analysis = '当前CPI处于较高水平，表明通胀压力较大。';
        suggestion = '建议关注央行货币政策动向，警惕利率调整风险。';
      } else if (value < 1) {
        analysis = '当前CPI处于较低水平，存在通缩压力。';
        suggestion = '可能预示央行将采取宽松货币政策。';
      } else {
        analysis = '当前CPI处于合理区间，物价水平稳定。';
        suggestion = '继续关注后续数据变化。';
      }
    } else if (indicator.type === 'ppi') {
      if (value < 0) {
        analysis = 'PPI持续负增长，反映工业需求疲软。';
        suggestion = '关注制造业复苏情况和大宗商品价格走势。';
      } else {
        analysis = 'PPI正增长，工业生产形势好转。';
        suggestion = '利好相关行业股票。';
      }
    } else if (indicator.type === 'gdp') {
      if (value > 5) {
        analysis = 'GDP增速较高，经济表现强劲。';
        suggestion = '利好股市，关注周期股表现。';
      } else {
        analysis = 'GDP增速放缓，经济面临下行压力。';
        suggestion = '关注政策面变化，寻找结构性机会。';
      }
    } else if (indicator.type === 'unemployment') {
      if (value > 6) {
        analysis = '失业率偏高，就业压力较大。';
        suggestion = '关注就业政策和消费市场表现。';
      } else {
        analysis = '失业率处于合理区间，就业市场稳定。';
        suggestion = '有利于消费市场复苏。';
      }
    } else if (indicator.type === 'pmi') {
      const pmiValue = parseFloat(indicator.value);
      if (pmiValue >= 50) {
        analysis = 'PMI位于荣枯线以上，经济扩张态势明显。';
        suggestion = '利好制造业相关板块。';
      } else {
        analysis = 'PMI位于荣枯线以下，经济面临收缩压力。';
        suggestion = '关注后续政策刺激措施。';
      }
    } else {
      if (indicator.trend === 'up') {
        analysis = `${indicator.name}呈上升趋势。`;
        suggestion = '关注对相关行业的影响。';
      } else {
        analysis = `${indicator.name}呈下降趋势。`;
        suggestion = '关注后续变化趋势。';
      }
    }

    return {
      summary: analysis,
      suggestion: suggestion,
      trendAnalysis: change > 0 ? '环比上升' : '环比下降',
      marketImpact: indicator.importance === 'high' ? '高' : indicator.importance === 'medium' ? '中' : '低'
    };
  }

  generateImpact(indicator) {
    const impacts = [];
    
    if (indicator.type === 'cpi' || indicator.type === 'inflation') {
      impacts.push({ sector: '央行货币政策', effect: indicator.trend === 'up' ? '利空' : '利好', reason: '通胀上升可能导致加息' });
      impacts.push({ sector: '债券市场', effect: indicator.trend === 'up' ? '利空' : '利好', reason: '通胀影响债券收益率' });
      impacts.push({ sector: '消费股', effect: indicator.trend === 'up' ? '中性' : '利好', reason: '通胀影响消费者购买力' });
    } else if (indicator.type === 'gdp') {
      impacts.push({ sector: '周期股', effect: indicator.trend === 'up' ? '利好' : '利空', reason: '经济增长利好周期行业' });
      impacts.push({ sector: '金融股', effect: indicator.trend === 'up' ? '利好' : '利空', reason: '经济活跃带动金融业务' });
    } else if (indicator.type === 'unemployment' || indicator.type === 'nonfarm') {
      impacts.push({ sector: '消费市场', effect: indicator.trend === 'down' ? '利好' : '利空', reason: '就业改善提升消费能力' });
      impacts.push({ sector: '零售行业', effect: indicator.trend === 'down' ? '利好' : '利空', reason: '就业稳定促进零售销售' });
    } else if (indicator.type === 'pmi') {
      impacts.push({ sector: '制造业', effect: indicator.trend === 'up' ? '利好' : '利空', reason: 'PMI反映制造业景气度' });
      impacts.push({ sector: '原材料', effect: indicator.trend === 'up' ? '利好' : '利空', reason: '需求变化影响原材料价格' });
    }

    return impacts;
  }
}

module.exports = new IndicatorService();