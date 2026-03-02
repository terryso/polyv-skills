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
node tools/clis/polyv.js create-channel --name "<频道名称>" [--scene <场景>] [--template <模板>]
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

## 注意事项

1. 首次使用需要配置 polyv 凭据（appId 和 appSecret）
2. 频道名称为必填参数
3. 场景和模板有默认值，通常无需指定
4. 配置优先级：CLI 参数 > 环境变量 > 配置文件
