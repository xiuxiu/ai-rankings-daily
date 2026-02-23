/**
 * AI 榜单每日采集脚本
 * 用途：每日抓取 AI 模型榜单，生成摘要并存入飞书文档
 * 运行：node ai-rankings-daily.js
 */

const https = require('https');
const { exit } = require('process');

// ============ 配置 ============
const CONFIG = {
  feishuDocTitle: 'AI 模型榜单日报',
  feishuFolderToken: null, // 可选：指定文件夹
};

// ============ 榜单来源 ============
const SOURCES = [
  {
    name: 'OpenRouter 热门模型',
    url: 'https://openrouter.ai/rankings',
    type: 'html',
  },
  {
    name: 'LMSYS Chatbot Arena',
    url: 'https://chat.lmsys.org/?leaderboard',
    type: 'html',
  },
  {
    name: 'Artificial Analysis',
    url: 'https://artificialanalysis.ai/models',
    type: 'html',
  },
];

// ============ 工具函数 ============
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractModelsFromHTML(html, sourceName) {
  // 更精确的模型名称提取
  const patterns = [
    /^gpt-4[\w.-]+/gim,
    /^claude-\d[\w.-]*/gim,
    /^gemini-\d[\w.-]*/gim,
    /^llama-\d[\w.-]*/gim,
    /^mistral-\d[\w.-]*/gim,
    /^qwen-\d[\w.-]*/gim,
    /^deepseek-\d[\w.-]*/gim,
    /^o\d+/gim,
  ];
  
  const models = new Set();
  
  // 清理 HTML 标签
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"');
  
  patterns.forEach(p => {
    const matches = text.match(p);
    if (matches) {
      matches.forEach(m => {
        // 清理特殊字符
        const cleaned = m.replace(/[":].*$/, '').trim();
        if (cleaned.length > 2 && cleaned.length < 30) {
          models.add(cleaned);
        }
      });
    }
  });
  
  return {
    source: sourceName,
    models: Array.from(models).slice(0, 10),
    count: models.size,
  };
}

function generateReport(results) {
  const date = new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  let content = `# 🤖 AI 模型榜单日报\n`;
  content += `**日期：** ${date}\n\n`;
  content += `---\n\n`;
  
  // 统计概览
  const allModels = new Map();
  results.forEach(r => {
    r.models.forEach((m, i) => {
      if (!allModels.has(m)) allModels.set(m, []);
      allModels.get(m).push({ source: r.source, rank: i + 1 });
    });
  });
  
  // 按出现频次排序
  const sortedModels = [...allModels.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 15);
  
  content += `## 📊 热门模型排行（跨平台）\n\n`;
  sortedModels.forEach(([model, appearances], i) => {
    content += `${i + 1}. **${model}** (${appearances.length}个平台)\n`;
  });
  content += `\n---\n\n`;
  
  // 各榜单详情
  content += `## 📋 各平台榜单\n\n`;
  results.forEach(r => {
    content += `### ${r.source}\n`;
    content += `发现 ${r.count} 个相关模型\n\n`;
    r.models.slice(0, 5).forEach((m, i) => {
      content += `${i + 1}. ${m}\n`;
    });
    content += `\n`;
  });
  
  // 数据来源
  content += `---\n\n`;
  content += `**数据来源：**\n`;
  SOURCES.forEach(s => content += `- ${s.name}\n`);
  
  return content;
}

// ============ 主流程 ============
async function main() {
  console.log('🤖 开始采集 AI 榜单...');
  
  const results = [];
  
  for (const source of SOURCES) {
    try {
      console.log(`📥 获取 ${source.name}...`);
      const html = await fetchUrl(source.url);
      const extracted = extractModelsFromHTML(html, source.name);
      results.push(extracted);
      console.log(`   ✓ 找到 ${extracted.count} 个模型`);
    } catch (err) {
      console.error(`   ✗ 失败: ${err.message}`);
      results.push({ source: source.name, models: [], count: 0, error: err.message });
    }
  }
  
  const content = generateReport(results);
  
  // 输出内容（供飞书文档使用）
  console.log('\n✅ 报告生成完成');
  console.log('---');
  console.log(content);
  
  return content;
}

module.exports = { main, generateReport, SOURCES };

// 直接运行时执行
if (require.main === module) {
  main().then(content => {
    // 输出 JSON 供外部调用
    console.log('\n__JSON_OUTPUT__');
    console.log(JSON.stringify({ content }));
  }).catch(err => {
    console.error('❌ 错误:', err);
    process.exit(1);
  });
}
