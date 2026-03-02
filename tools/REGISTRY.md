# 工具注册表

本注册表列出 polyv-skills 项目中所有可用的工具和 CLI。

## CLI 工具

| 工具名称 | 路径 | 描述 | 状态 |
|---------|------|------|------|
| polyv | `clis/polyv.js` | 配置加载和测试工具 | 已完成 |

### polyv CLI 用法

```bash
# 显示帮助
node tools/clis/polyv.js help

# 测试配置
node tools/clis/polyv.js config-test

# 使用参数加载配置
node tools/clis/polyv.js --appId YOUR_ID --appSecret YOUR_SECRET

# 启用调试模式
POLYV_DEBUG=true node tools/clis/polyv.js config-test
```

## 集成文档

| 文档名称 | 路径 | 描述 | 状态 |
|---------|------|------|------|
| (待添加) | `integrations/` | 集成文档将在后续 Epic 中添加 | 待开发 |

## Skills

| Skill 名称 | 路径 | 描述 | 状态 |
|-----------|------|------|------|
| polyv-create-channel | `../skills/polyv-create-channel/` | 创建保利威直播频道 | 待开发 |

## 工具开发指南

### 添加新 CLI 工具

1. 在 `clis/` 目录下创建新的 `.js` 文件
2. 文件名使用 `kebab-case` 格式
3. 在本注册表中添加工具信息

### 添加新集成文档

1. 在 `integrations/` 目录下创建新的 `.md` 文件
2. 文档应包含：使用说明、示例代码、注意事项
3. 在本注册表中添加文档信息

## 更新日志

- 2026-03-03: 添加 polyv CLI 配置工具
- 2026-03-03: 初始版本，创建注册表结构
