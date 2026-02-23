# AI 榜单日报

每日自动采集 AI 模型榜单数据，生成分析报告并存入飞书文档。

## 功能

- 🤖 自动采集多个 AI 榜单数据
- 📊 生成智能指数、性价比、速度等排行
- 📝 支持写入飞书文档
- ⏰ 可配置定时任务

## 数据来源

- **Artificial Analysis** - 智能指数、速度、价格、上下文窗口
- **OpenRouter** - 模型使用量/热度排行

## 快速开始

```bash
# 安装依赖
npm install

# 运行采集脚本
node ai-rankings-daily.js
```

## 飞书集成

首次使用需要配置飞书应用权限：
1. 在飞书开放平台创建应用
2. 添加 `docx:document` 权限
3. 配置 appId 和 appSecret

## 目录结构

```
.
├── ai-rankings-daily.js   # 主脚本
├── ai-rankings-v2.js      # 增强版
├── ai-rankings-v3.js      # 分析版
├── sync-feishu.js         # 飞书同步
├── LICENSE                # MIT 许可证
└── README.md
```

## 使用建议

| 场景 | 推荐模型 |
|------|----------|
| 追求最高智能 | Gemini 3.1 Pro Preview |
| 预算有限 | Gemma 3n E4B ($0.03/M) |
| 长文本处理 | Llama 4 Scout (10M tokens) |
| 快速响应 | Granite 3.3 8B (513 t/s) |

## License

MIT License - see [LICENSE](LICENSE)
