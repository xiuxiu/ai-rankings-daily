# AI 榜单日报 - 每日自动采集

## 功能
- 每日自动采集 AI 模型榜单数据
- 生成聚合报告
- 保存到飞书文档

## 使用方式

### 1. 手动运行测试
```bash
node ai-rankings-daily.js
```

### 2. 设置每日定时任务 (OpenClaw Cron)

```bash
# 每天早上 9 点执行
openclaw cron add "0 9 * * *" "node $WORKSPACE/ai-rankings-daily.js"
```

### 3. 查看定时任务
```bash
openclaw cron list
```

## 输出
- 控制台输出报告内容
- JSON 格式供其他工具调用
