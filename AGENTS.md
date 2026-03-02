# Agent 使用说明

本文档说明如何在 Claude Code 中使用 polyv-skills。

## 什么是 Skills？

Skills 是 Claude Code 的能力扩展机制，允许 Claude 与外部 API 和服务进行交互。polyv-skills 提供了与保利威直播平台交互的能力。

## 可用 Skills

### polyv-create-channel

创建新的直播频道。

**使用方式：**

```
使用 polyv-create-channel skill 创建一个名为"测试频道"的直播频道
```

**参数：**
- `name`: 频道名称（必需）
- `password`: 频道密码（可选）
- `channelPasswd`: 频道密码，用于观看认证（可选）
- `scene`: 频道场景类型（可选，默认为 "alone"）

## 配置说明

### 配置文件位置

配置文件位于 `~/.polyv-skills/config.json`

### 配置格式

```json
{
  "appId": "您的保利威 appId",
  "appSecret": "您的保利威 appSecret",
  "apiBaseUrl": "https://api.polyv.net" // 可选，默认值
}
```

### 获取 API 凭证

1. 登录保利威后台：https://www.polyv.net/
2. 进入「设置」→「API设置」
3. 获取 `appId` 和 `appSecret`

## 调试模式

启用调试模式可以看到更详细的 API 请求信息：

```json
{
  "appId": "您的appId",
  "appSecret": "您的appSecret",
  "debug": true
}
```

## 错误处理

当 Skill 执行失败时，Claude 会提供详细的错误信息：

- **配置错误**：检查配置文件是否存在且格式正确
- **认证错误**：检查 appId 和 appSecret 是否正确
- **API 错误**：查看错误消息中的具体原因

## 最佳实践

1. **安全存储**：不要将包含凭证的配置文件提交到版本控制
2. **最小权限**：仅配置必要的 API 凭证
3. **测试优先**：在生产环境使用前，先在测试环境验证

## 常见问题

### Q: 配置文件找不到？

A: 确保配置文件位于 `~/.polyv-skills/config.json`

### Q: API 调用返回认证失败？

A: 检查 appId 和 appSecret 是否正确，注意大小写

### Q: 如何查看详细的请求日志？

A: 在配置文件中设置 `"debug": true`
