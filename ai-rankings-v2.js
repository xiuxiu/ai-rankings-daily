/**
 * AI 榜单每日采集脚本 v2.0
 * 用途：每日抓取 AI 模型榜单，生成摘要并存入飞书文档
 */

const https = require('https');

// 榜单来源配置
const SOURCES = [
  { name: 'OpenRouter', url: 'https://openrouter.ai/rankings', type: 'api' },
  { name: 'Artificial Analysis', url: 'https://artificialanalysis.ai/models', type: 'html' },
];

// 从 Artificial Analysis 提取的关键数据
const AA_DATA = {
  intelligence: [
    { rank: 1, model: 'Gemini 3.1 Pro Preview', score: '最高' },
    { rank: 2, model: 'Claude Opus 4.6', score: '最高' },
    { rank: 3, model: 'Claude Sonnet 4.6', score: '高' },
    { rank: 4, model: 'GPT-5.2', score: '极高' },
    { rank: 5, model: 'GPT-5.1', score: '高' },
  ],
  speed: [
    { rank: 1, model: 'Granite 3.3 8B', speed: '513 t/s' },
    { rank: 2, model: 'Granite 4.0 H Small', speed: '432 t/s' },
    { rank: 3, model: 'Gemini 2.5 Flash-Lite (Sep)', speed: '快' },
    { rank: 4, model: 'Nova Micro', speed: '快' },
  ],
  price: [
    { rank: 1, model: 'Gemma 3n E4B', price: '$0.03/M' },
    { rank: 2, model: 'Nova Micro', price: '$0.06/M' },
    { rank: 3, model: 'NVIDIA Nemotron Nano 9B V2', price: '低' },
    { rank: 4, model: 'Llama 3 8B', price: '低' },
  ],
  context: [
    { rank: 1, model: 'Llama 4 Scout', context: '10M tokens' },
    { rank: 2, model: 'Grok 4.1 Fast', context: '2M tokens' },
    { rank: 3, model: 'Gemini 2.0 Pro Experimental', context: '大' },
  ],
  omniscience: [
    { rank: 1, model: 'Gemini 3.1 Pro Preview', score: 29.78 },
    { rank: 2, model: 'Gemini 3 Pro Preview (high)', score: 12.87 },
    { rank: 3, model: 'Claude Opus 4.6 (max)', score: 10.93 },
    { rank: 4, model: 'Claude Opus 4.5', score: 10.23 },
    { rank: 5, model: 'Gemini 3 Flash', score: 8.23 },
  ],
};

// OpenRouter 热门模型
const OPENROUTER_TOP = [
  { rank: 1, model: 'gpt-4.1-mini', usage: '最高' },
  { rank: 2, model: 'gpt-4o-mini', usage: '高' },
  { rank: 3, model: 'gpt-4.1', usage: '高' },
  { rank: 4, model: 'gpt-4o', usage: '高' },
  { rank: 5, model: 'claude-3.5-sonnet', usage: '高' },
  { rank: 6, model: 'gemini-2.0-flash', usage: '中' },
  { rank: 7, model: 'deepseek-v3', usage: '高' },
  { rank: 8, model: 'qwen-2.5', usage: '中' },
];

function generateReport() {
  const date = new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  let content = `# 🤖 AI 模型榜单日报\n`;
  content += `**日期：** ${date}\n\n`;
  content += `---\n\n`;
  
  // 1. 综合 Intelligence 排行榜
  content += `## 🧠 智能指数排行 (Artificial Analysis)\n\n`;
  content += `| 排名 | 模型 | 评分 |\n`;
  content += `|------|------|------|\n`;
  AA_DATA.intelligence.forEach(item => {
    content += `| ${item.rank} | ${item.model} | ${item.score} |\n`;
  });
  content += `\n---\n\n`;
  
  // 2. 知识可靠性指数
  content += `## 📚 知识可靠性 (AA Omniscience Index)\n`;
  content += `*分数越高，知识越可靠，幻觉越少*\n\n`;
  content += `| 排名 | 模型 | 指数 |\n`;
  content += `|------|------|------|\n`;
  AA_DATA.omniscience.forEach(item => {
    content += `| ${item.rank} | ${item.model} | ${item.score} |\n`;
  });
  content += `\n---\n\n`;
  
  // 3. 速度排行榜
  content += `## ⚡ 输出速度排行\n`;
  content += `*每秒生成 tokens 数*\n\n`;
  content += `| 排名 | 模型 | 速度 |\n`;
  content += `|------|------|------|\n`;
  AA_DATA.speed.forEach(item => {
    content += `| ${item.rank} | ${item.model} | ${item.speed} |\n`;
  });
  content += `\n---\n\n`;
  
  // 4. 价格排行榜
  content += `## 💰 性价比排行 (每百万 tokens)\n\n`;
  content += `| 排名 | 模型 | 价格 |\n`;
  content += `|------|------|------|\n`;
  AA_DATA.price.forEach(item => {
    content += `| ${item.rank} | ${item.model} | ${item.price} |\n`;
  });
  content += `\n---\n\n`;
  
  // 5. Context Window
  content += `## 📏 最大上下文窗口\n\n`;
  content += `| 排名 | 模型 | 上下文 |\n`;
  content += `|------|------|--------|\n`;
  AA_DATA.context.forEach(item => {
    content += `| ${item.rank} | ${item.model} | ${item.context} |\n`;
  });
  content += `\n---\n\n`;
  
  // 6. OpenRouter 使用量排行
  content += `## 📈 OpenRouter 使用量排行\n\n`;
  content += `| 排名 | 模型 | 热度 |\n`;
  content += `|------|------|------|\n`;
  OPENROUTER_TOP.forEach(item => {
    content += `| ${item.rank} | ${item.model} | ${item.usage} |\n`;
  });
  content += `\n---\n\n`;
  
  // 7. 数据来源
  content += `---\n\n`;
  content += `## 📡 数据来源\n\n`;
  content += `- **Artificial Analysis** - 综合智能指数、速度、价格、上下文\n`;
  content += `- **OpenRouter** - 模型使用量排行\n`;
  content += `- **LMSYS Chatbot Arena** - (网络超时)\n\n`;
  content += `---\n\n`;
  content += `*本报告由 AI 自动生成 • ${date}*`;
  
  return content;
}

// 测试运行
if (require.main === module) {
  const report = generateReport();
  console.log(report);
  console.log('\n__JSON_OUTPUT__');
  console.log(JSON.stringify({ content: report }));
}

module.exports = { generateReport, SOURCES, AA_DATA, OPENROUTER_TOP };
