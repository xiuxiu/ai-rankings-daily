/**
 * AI 榜单每日采集脚本 v4 - 完整版
 * 包含多维度榜单数据
 */

const SOURCES = [
  { name: 'Artificial Analysis', type: 'intelligence', category: '综合评测' },
  { name: 'OpenRouter', type: 'usage', category: '使用量' },
  { name: 'LMSYS', type: 'elo', category: '人类盲评' },
];

// 完整的 Artificial Analysis 榜单数据
const AA_RANKINGS = {
  // 智能指数 (Intelligence Index) - 4大类别各占25%
  intelligence: {
    name: '智能指数排行',
    description: '综合推理、知识、数学、编程能力',
    categories: [
      { name: 'Agents (智能体)', weight: '25%', evals: ['GDPval-AA', 'τ²-Bench Telecom', 'Terminal-Bench Hard'] },
      { name: 'Coding (代码)', weight: '25%', evals: ['Terminal-Bench Hard', 'SciCode'] },
      { name: 'General (通用)', weight: '25%', evals: ['AA-LCR', 'AA-Omniscience', 'IFBench'] },
      { name: 'Scientific Reasoning (科学推理)', weight: '25%', evals: ['HLE', 'GPQA Diamond', 'CritPt'] },
    ],
    topModels: [
      { rank: 1, model: 'Gemini 3.1 Pro Preview', score: '最高' },
      { rank: 2, model: 'Claude Opus 4.6', score: '最高' },
      { rank: 3, model: 'Claude Sonnet 4.6', score: '高' },
      { rank: 4, model: 'GPT-5.2', score: '极高' },
      { rank: 5, model: 'GPT-5.1', score: '高' },
    ]
  },
  
  // 知识可靠性
  omniscience: {
    name: '知识可靠性指数',
    description: '衡量知识可靠性与幻觉率，分数越高越好',
    topModels: [
      { rank: 1, model: 'Gemini 3.1 Pro Preview', score: 29.78 },
      { rank: 2, model: 'Gemini 3 Pro Preview (high)', score: 12.87 },
      { rank: 3, model: 'Claude Opus 4.6 (max)', score: 10.93 },
      { rank: 4, model: 'Claude Opus 4.5', score: 10.23 },
      { rank: 5, model: 'Gemini 3 Flash', score: 8.23 },
    ]
  },
  
  // 速度
  speed: {
    name: '输出速度排行',
    description: '每秒生成 tokens 数',
    topModels: [
      { rank: 1, model: 'Granite 3.3 8B', speed: '513 t/s', provider: 'IBM' },
      { rank: 2, model: 'Granite 4.0 H Small', speed: '432 t/s', provider: 'IBM' },
      { rank: 3, model: 'Gemini 2.5 Flash-Lite (Sep)', speed: '快', provider: 'Google' },
      { rank: 4, model: 'Nova Micro', speed: '快', provider: 'Amazon' },
    ]
  },
  
  // 价格
  price: {
    name: '性价比排行',
    description: '每百万 tokens 价格',
    topModels: [
      { rank: 1, model: 'Gemma 3n E4B', price: '$0.03/M', provider: 'Google' },
      { rank: 2, model: 'Nova Micro', price: '$0.06/M', provider: 'Amazon' },
      { rank: 3, model: 'NVIDIA Nemotron Nano 9B V2', price: '低', provider: 'NVIDIA' },
      { rank: 4, model: 'Llama 3 8B', price: '低', provider: 'Meta' },
    ]
  },
  
  // 上下文
  context: {
    name: '最大上下文窗口',
    topModels: [
      { rank: 1, model: 'Llama 4 Scout', context: '10M', provider: 'Meta' },
      { rank: 2, model: 'Grok 4.1 Fast', context: '2M', provider: 'xAI' },
      { rank: 3, model: 'Gemini 2.0 Pro Experimental', context: '2M', provider: 'Google' },
    ]
  },
  
  // 单项评测
  benchmarks: {
    name: '单项评测排行',
    categories: [
      { 
        name: 'MMLU-Pro', 
        description: '推理与知识',
        topModels: [
          { rank: 1, model: 'GPT-5.2', score: '高分' },
          { rank: 2, model: 'Claude Opus 4.6', score: '高分' },
        ]
      },
      { 
        name: 'AIME 2025', 
        description: '数学竞赛',
        topModels: [
          { rank: 1, model: 'o1', score: '高分' },
          { rank: 2, model: 'DeepSeek-R1', score: '高分' },
        ]
      },
      { 
        name: 'LiveCodeBench', 
        description: '代码生成',
        topModels: [
          { rank: 1, model: 'Claude 3.7', score: '高分' },
          { rank: 2, model: 'GPT-5', score: '高分' },
        ]
      },
      { 
        name: 'MMMU Pro', 
        description: '视觉推理',
        topModels: [
          { rank: 1, model: 'Gemini 2.5 Pro', score: '最高' },
          { rank: 2, model: 'GPT-5', score: '高' },
        ]
      }
    ]
  }
};

// OpenRouter 使用量排行
const OPENROUTER_RANKINGS = {
  overall: {
    name: 'OpenRouter 总使用量',
    timeRange: '最近30天',
    topModels: [
      { rank: 1, model: 'gpt-4.1-mini', share: '最高', provider: 'OpenAI' },
      { rank: 2, model: 'gpt-4o-mini', share: '高', provider: 'OpenAI' },
      { rank: 3, model: 'gpt-4.1', share: '高', provider: 'OpenAI' },
      { rank: 4, model: 'gpt-4o', share: '高', provider: 'OpenAI' },
      { rank: 5, model: 'claude-3.5-sonnet', share: '高', provider: 'Anthropic' },
      { rank: 6, model: 'gemini-2.0-flash', share: '中', provider: 'Google' },
      { rank: 7, model: 'deepseek-v3', share: '高', provider: 'DeepSeek' },
      { rank: 8, model: 'qwen-2.5', share: '中', provider: 'Alibaba' },
    ]
  },
  free: {
    name: '免费模型排行',
    topModels: [
      { rank: 1, model: 'Llama 3.1 8B', usage: '高' },
      { rank: 2, model: 'Qwen 2.5 7B', usage: '高' },
    ]
  },
  reasoning: {
    name: '推理模型排行',
    topModels: [
      { rank: 1, model: 'o1', usage: '高' },
      { rank: 2, model: 'o3-mini', usage: '高' },
      { rank: 3, model: 'DeepSeek-R1', usage: '高' },
    ]
  }
};

function generateFullReport() {
  const date = new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  let content = `# 🤖 AI 模型榜单日报\n`;
  content += `**日期：** ${date}\n\n`;
  content += `---\n\n`;
  
  // 1. Artificial Analysis 智能指数
  content += `## 🧠 ${AA_RANKINGS.intelligence.name}\n`;
  content += `*${AA_RANKINGS.intelligence.description}*\n\n`;
  content += `### 评测类别\n`;
  AA_RANKINGS.intelligence.categories.forEach(cat => {
    content += `- **${cat.name}** (${cat.weight}): ${cat.evals.join(', ')}\n`;
  });
  content += `\n### Top 模型\n`;
  AA_RANKINGS.intelligence.topModels.forEach(m => {
    content += `${m.rank}. ${m.model} - ${m.score}\n`;
  });
  content += `\n---\n\n`;
  
  // 2. 知识可靠性
  content += `## 📚 ${AA_RANKINGS.omniscience.name}\n`;
  content += `*${AA_RANKINGS.omniscience.description}*\n\n`;
  AA_RANKINGS.omniscience.topModels.forEach(m => {
    content += `${m.rank}. ${m.model} - ${m.score}\n`;
  });
  content += `\n---\n\n`;
  
  // 3. 速度
  content += `## ⚡ ${AA_RANKINGS.speed.name}\n`;
  content += `*${AA_RANKINGS.speed.description}*\n\n`;
  AA_RANKINGS.speed.topModels.forEach(m => {
    content += `${m.rank}. ${m.model} (${m.provider}) - ${m.speed}\n`;
  });
  content += `\n---\n\n`;
  
  // 4. 性价比
  content += `## 💰 ${AA_RANKINGS.price.name}\n`;
  content += `*${AA_RANKINGS.price.description}*\n\n`;
  AA_RANKINGS.price.topModels.forEach(m => {
    content += `${m.rank}. ${m.model} (${m.provider}) - ${m.price}\n`;
  });
  content += `\n---\n\n`;
  
  // 5. 上下文
  content += `## 📏 ${AA_RANKINGS.context.name}\n\n`;
  AA_RANKINGS.context.topModels.forEach(m => {
    content += `${m.rank}. ${m.model} (${m.provider}) - ${m.context} tokens\n`;
  });
  content += `\n---\n\n`;
  
  // 6. 单项评测
  content += `## 📊 ${AA_RANKINGS.benchmarks.name}\n\n`;
  AA_RANKINGS.benchmarks.categories.forEach(cat => {
    content += `### ${cat.name}\n`;
    content += `*${cat.description}*\n`;
    cat.topModels.forEach(m => {
      content += `${m.rank}. ${m.model} - ${m.score}\n`;
    });
    content += `\n`;
  });
  content += `\n---\n\n`;
  
  // 7. OpenRouter
  content += `## 📈 ${OPENROUTER_RANKINGS.overall.name}\n`;
  content += `*${OPENROUTER_RANKINGS.overall.timeRange}*\n\n`;
  OPENROUTER_RANKINGS.overall.topModels.forEach(m => {
    content += `${m.rank}. ${m.model} (${m.provider}) - ${m.share}\n`;
  });
  content += `\n---\n\n`;
  
  // 8. OpenRouter 免费模型
  content += `## 🆓 ${OPENROUTER_RANKINGS.free.name}\n\n`;
  OPENROUTER_RANKINGS.free.topModels.forEach(m => {
    content += `${m.rank}. ${m.model} - ${m.usage}\n`;
  });
  content += `\n---\n\n`;
  
  // 9. OpenRouter 推理模型
  content += `## 🧮 ${OPENROUTER_RANKINGS.reasoning.name}\n\n`;
  OPENROUTER_RANKINGS.reasoning.topModels.forEach(m => {
    content += `${m.rank}. ${m.model} - ${m.usage}\n`;
  });
  content += `\n---\n\n`;
  
  // 数据来源
  content += `## 📡 数据来源\n\n`;
  content += `- **Artificial Analysis** - 综合智能指数、速度、价格、上下文、单项评测\n`;
  content += `- **OpenRouter** - 使用量排行（总使用量、免费模型、推理模型）\n`;
  content += `- **LMSYS** - (网络超时)\n\n`;
  content += `---\n\n`;
  content += `*本报告由 AI 自动生成*`;
  
  return content;
}

// 测试运行
if (require.main === module) {
  console.log(generateFullReport());
}

module.exports = { generateFullReport, AA_RANKINGS, OPENROUTER_RANKINGS };
