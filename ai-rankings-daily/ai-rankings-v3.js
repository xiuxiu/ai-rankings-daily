/**
 * AI 榜单日报 v3 - 增强版
 * 增加分析统计功能
 */

const { generateReport, AA_DATA, OPENROUTER_TOP } = require('./ai-rankings-v2.js');

function analyzeTrends() {
  // 分析 1: 智能 vs 性价比
  const intelligenceModels = AA_DATA.intelligence.slice(0, 3).map(m => m.model);
  const cheapModels = AA_DATA.price.slice(0, 2).map(m => m.model);
  
  // 分析 2: 速度 vs 智能
  const fastModels = AA_DATA.speed.slice(0, 2).map(m => m.model);
  
  // 分析 3: 综合推荐
  const recommendations = {
    '最强智能': AA_DATA.intelligence[0].model,
    '性价比之王': AA_DATA.price[0].model,
    '速度最快': AA_DATA.speed[0].model,
    '最大上下文': AA_DATA.context[0].model,
    '最可靠知识': AA_DATA.omniscience[0].model,
  };
  
  return { intelligenceModels, cheapModels, fastModels, recommendations };
}

function generateEnhancedReport() {
  const baseReport = generateReport();
  const analysis = analyzeTrends();
  
  const date = new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // 插入分析统计
  let analysisSection = `\n---\n\n`;
  analysisSection += `## 📊 本期分析\n\n`;
  
  analysisSection += `### 🏆 本期亮点\n\n`;
  Object.entries(analysis.recommendations).forEach(([category, model]) => {
    analysisSection += `- **${category}**: ${model}\n`;
  });
  
  analysisSection += `\n### 💡 使用建议\n\n`;
  analysisSection += `- **追求最高智能**: ${analysis.intelligenceModels[0]}\n`;
  analysisSection += `- **预算有限**: ${analysis.cheapModels[0]} (仅 $0.03/M)\n`;
  analysisSection += `- **需要长上下文**: ${analysis.context[0].model} (10M tokens)\n`;
  analysisSection += `- **需要快速响应**: ${analysis.fastModels[0]} (513 t/s)\n`;
  
  analysisSection += `\n---\n\n`;
  
  // 在数据来源前插入分析
  const insertPoint = baseReport.indexOf('## 📡 数据来源');
  const enhancedReport = baseReport.slice(0, insertPoint) + analysisSection + baseReport.slice(insertPoint);
  
  return enhancedReport;
}

if (require.main === module) {
  console.log(generateEnhancedReport());
  console.log('\n__JSON_OUTPUT__');
  console.log(JSON.stringify({ content: generateEnhancedReport() }));
}

module.exports = { generateEnhancedReport, analyzeTrends };
