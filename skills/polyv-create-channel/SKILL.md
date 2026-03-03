---
name: polyv-create-channel
description: 创建保利威直播频道。当用户想要创建直播、新建频道、开直播间时使用。
---

## 功能说明

创建一个新的保利威直播频道，返回频道 ID 和基本信息。

## 参数

| 参数 | 必填 | 类型 | 说明 | 默认值 |
|------|------|------|------|--------|
| name | 是 | string | 频道名称，最大 100 字符 | - |
| scene | 否 | string | 直播场景：topclass(大班课), train(企业培训), alone(活动营销) | topclass |
| template | 否 | string | 直播模板：ppt(三分屏), alone(纯视频) | ppt |

## 示例

**示例 1：简单创建**
用户：帮我创建一个直播频道叫"产品发布会"

**示例 2：指定场景**
用户：创建一个企业培训直播，名称是"新员工入职培训"
参数：name="新员工入职培训", scene="train"

**示例 3：完整参数**
用户：创建一个纯视频直播，名称是"年会直播"，使用纯视频模板
参数：name="年会直播", scene="alone", template="alone"

## CLI 调用

```bash
node scripts/polyv.js create-channel --name "<频道名称>" [--scene <场景>] [--template <模板>]
```

## 输出格式

**成功响应：**
```
✅ 频道创建成功！
频道 ID: 3151318
用户 ID: xxx
```

**错误响应：**
```
❌ [POLYV-CONFIG_MISSING] 缺少 appId 配置
   提示：请设置 POLYV_APP_ID 环境变量，或创建配置文件 ~/.polyv-skills/config.json
```

## 错误处理

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| CONFIG_MISSING | 凭据未配置 | 设置环境变量或创建配置文件 |
| API_ERROR | API 调用失败 | 检查网络和凭据有效性 |
| NETWORK_ERROR | 网络错误 | 检查网络连接 |
| 400 | 请求参数错误 | 检查请求参数是否正确 |
| 401 | 签名验证失败 | 检查 appId 和 appSecret 是否正确 |
| 403 | 无权限访问 | 检查账号权限 |
| 429 | 请求过于频繁 | 请稍后重试 |
| 500 | 服务器内部错误 | 请稍后重试或联系技术支持 |

### 网络错误类型

| 错误类型 | 说明 | 解决方案 |
|----------|------|----------|
| DNS 解析失败 | 无法解析 API 域名 | 检查网络连接或 DNS 配置 |
| 连接被拒绝 | 服务器无法连接 | 服务器无法连接，请稍后重试 |
| 请求超时 | 服务器响应超时 | 服务器响应超时，请稍后重试 |

## Debug 模式

当需要排查问题时，可以启用 Debug 模式获取详细的调试信息：

```bash
# 启用 Debug 模式
export POLYV_DEBUG=true
node scripts/polyv.js create-channel --name "测试频道"
```

Debug 模式会输出：
- 请求 URL 和端点
- 请求参数（appSecret 会自动脱敏显示为 `ab****yz` 格式）
- API 响应内容
- 时间戳信息

**安全说明：** Debug 模式下 appSecret 会被脱敏处理，不会在日志中显示完整密钥。

## 注意事项

1. 首次使用需要配置 polyv 凭据（appId 和 appSecret）
2. 频道名称为必填参数
3. 场景和模板有默认值，通常无需指定
4. 配置优先级：CLI 参数 > 环境变量 > 配置文件

## 高级用法

当需要更多控制时（如设置讲师密码、延迟模式、连麦人数等），请参阅 [高级参数指南](references/advanced-parameters.md)。

**常见高级场景：**

- **低延迟直播**：`--pureRtcEnabled Y`
- **自定义密码**：`--channelPasswd "abc123456"`
- **连麦人数**：`--linkMicLimit 8`
