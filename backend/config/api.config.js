// API配置文件
// 使用真实数据API需要配置以下接口

module.exports = {
  // 数据源配置
  dataSources: {
    // 聚合数据API（推荐，免费申请：https://www.juhe.cn/docs/api/id/79）
    juhe: {
      enabled: true,  // 设置为true启用
      apiKey: 'YOUR_JUHE_API_KEY', // 请替换为你的API Key
      baseUrl: 'https://apis.juhe.cn'
    },
    
    // Tushare Pro API（需要注册：https://tushare.pro/register）
    tushare: {
      enabled: false,
      token: 'YOUR_TUSHARE_TOKEN' // 请替换为你的Token
    },
    
    // 东方财富（备用，不需要key但可能有访问限制）
    eastmoney: {
      enabled: true,
      baseUrl: 'https://datacenter-web.eastmoney.com/api/data/v1'
    }
  },
  
  // 数据更新间隔（毫秒）
  refreshInterval: 3600000, // 1小时
  
  // 是否启用真实数据
  useRealData: true
};
