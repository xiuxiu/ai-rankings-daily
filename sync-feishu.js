/**
 * 飞书文档同步脚本
 * 将 AI 榜单日报同步到飞书云文档
 */

const { main } = require('./ai-rankings-daily.js');

async function syncToFeishu() {
  const { Tool } = require('@openclaw/feishu-tools');
  
  // 生成报告
  const content = await main();
  
  // 尝试获取已有文档或创建新文档
  // 注：实际使用时需要通过 feishu_doc 工具创建
  
  console.log('\n📤 准备同步到飞书...');
  console.log('内容长度:', content.length, '字符');
  
  return content;
}

if (require.main === module) {
  syncToFeichu().catch(console.error);
}
