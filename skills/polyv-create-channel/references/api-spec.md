# polyv 创建频道 API 规范

> 参考：https://doc.polyv.net/live/v4/api/channel/create.html

## 接口信息

| 属性 | 值 |
|------|-----|
| URL | `https://api.polyv.net/live/v4/channel/create` |
| 方法 | POST |
| Content-Type | application/json |
| 协议 | HTTPS（推荐）、HTTP |

## 签名认证

### 签名参数（URL Query）

| 参数 | 必选 | 类型 | 说明 |
|------|------|------|------|
| appId | ✅ | String | 账号 appId |
| timestamp | ✅ | Long | 13位毫秒级时间戳，**3分钟内有效** |
| sign | ✅ | String | 32位大写 MD5 签名 |

### 签名生成规则

1. 收集所有参与签名的参数（appId, timestamp）
2. 按 key 字典序（ASCII 码）排序
3. 拼接为 `key1value1key2value2...` 格式
4. 在末尾追加 appSecret
5. 计算 MD5 值，转为大写

**示例：**
```
参数: appId=frlr1zazn3, timestamp=1629445373947
appSecret: secret123

拼接串: appIdfrlr1zazn3timestamp1629445373947secret123
MD5: E3F501CFEF5FCCF2DF9BFDCE9C91F48C
```

**JavaScript 实现：**
```javascript
const crypto = require('crypto');

function generateSignature(params, appSecret) {
  // 1. 按 key 字典序排序
  const sortedKeys = Object.keys(params).sort();

  // 2. 拼接 keyvalue
  const str = sortedKeys.map(key => `${key}${params[key]}`).join('');

  // 3. 追加 appSecret
  const signStr = str + appSecret;

  // 4. MD5 并转大写
  return crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();
}
```

## 请求体参数

| 参数 | 必选 | 类型 | 说明 |
|------|------|------|------|
| name | ✅ | String | 直播名称，最大长度 100 |
| newScene | ✅ | String | 直播场景（见下方枚举） |
| template | ✅ | String | 直播模板（见下方枚举） |
| channelPasswd | ❌ | String | 讲师登录密码，6-16位，不传则系统生成 |
| pureRtcEnabled | ❌ | String | 直播延迟：Y=无延时，N=普通延迟 |
| type | ❌ | String | 转播类型：normal/transmit/receive |
| linkMicLimit | ❌ | Integer | 连麦人数限制，最多 16 人 |
| categoryId | ❌ | Integer | 分类 ID |
| startTime | ❌ | Long | 开始时间戳（仅做显示用） |
| endTime | ❌ | Long | 结束时间戳（仅做显示用） |
| labelData | ❌ | Array | 标签 ID 数组 |

### 直播场景 (newScene) 枚举

| 值 | 说明 | 备注 |
|------|------|------|
| topclass | 大班课 | |
| double | 双师课 | 需开通 |
| train | 企业培训 | |
| alone | 活动营销 | |
| seminar | 研讨会 | |
| guide | 导播 | 需开通 |

### 直播模板 (template) 枚举

| 值 | 说明 | 适用场景 |
|------|------|----------|
| ppt | 三分屏-横屏 | topclass, train, alone, double |
| portrait_ppt | 三分屏-竖屏 | topclass, train, alone |
| alone | 纯视频-横屏 | topclass, train, alone, double, guide |
| portrait_alone | 纯视频-竖屏 | topclass, train, alone, guide |
| topclass | 纯视频极速-横屏 | topclass |
| portrait_topclass | 纯视频极速-竖屏 | topclass |
| seminar | 研讨会 | seminar |

## 请求示例

**URL:**
```
https://api.polyv.net/live/v4/channel/create?appId=frlr1zazn3&sign=E3F501CFEF5FCCF2DF9BFDCE9C91F48C&timestamp=1629445373947
```

**Body:**
```json
{
  "name": "我的直播频道",
  "newScene": "topclass",
  "template": "ppt",
  "pureRtcEnabled": "Y",
  "linkMicLimit": 6
}
```

## 响应格式

### 成功响应

```json
{
  "code": 200,
  "status": "success",
  "success": true,
  "requestId": "847f0716fa76461baf8979aaa4415dc3.67.16342672396023837",
  "data": {
    "channelId": 2614804,
    "userId": "1b448be323",
    "channelPasswd": "jvO3RbFTKE61A",
    "seminarHostPassword": null,
    "seminarAttendeePassword": null
  }
}
```

### 错误响应

```json
{
  "code": 400,
  "status": "error",
  "success": false,
  "requestId": "4081dbac03e6441e8bdd301d8feee5a2.124.16360831818611581",
  "error": {
    "code": 20001,
    "desc": "application not found."
  }
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| code | Integer | HTTP 状态码，200=成功 |
| status | String | success 或 error |
| success | Boolean | 是否成功 |
| requestId | String | 请求 ID，用于调试 |
| data.channelId | Integer | 频道 ID |
| data.userId | String | POLYV 用户 ID |
| data.channelPasswd | String | 讲师登录密码 |
| error.code | Integer | 业务错误码 |
| error.desc | String | 错误描述 |

## 常见错误码

| code | error.code | 说明 | 解决方案 |
|------|------------|------|----------|
| 400 | 20001 | application not found | 检查 appId 是否正确 |
| 400 | 20002 | sign error | 检查签名算法和 appSecret |
| 400 | 20003 | timestamp expired | 时间戳超过3分钟，重新生成 |
| 400 | 20004 | channel name required | 缺少频道名称 |
| 400 | 20005 | invalid scene | 无效的直播场景 |

## CLI 调用示例

```bash
# 设置环境变量
export POLYV_APP_ID=your_app_id
export POLYV_APP_SECRET=your_app_secret

# 创建频道
node tools/clis/polyv.js channel create \
  --name "我的直播" \
  --scene "topclass" \
  --template "ppt"

# Debug 模式
POLYV_DEBUG=true node tools/clis/polyv.js channel create --name "测试" --scene topclass --template ppt
```

## 注意事项

1. **签名安全**：appSecret 严禁暴露在客户端，所有 API 调用必须通过服务端中转
2. **时间戳有效期**：3分钟，注意服务器时间同步
3. **内容类型**：必须设置 `Content-Type: application/json`
4. **新版本差异**：新版 API 只能设置基本信息，观看条件等需在默认模板中预设
