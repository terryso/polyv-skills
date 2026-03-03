# 高级参数指南

本文档介绍 `polyv-create-channel` skill 的高级参数，用于需要更多控制的场景。

## 基础参数（常用）

这些参数在 SKILL.md 中已有说明，大多数情况下只需要这些：

| 参数 | 必选 | 说明 | 默认值 |
|------|------|------|--------|
| name | ✅ | 频道名称 | - |
| scene | ❌ | 直播场景 | topclass |
| template | ❌ | 直播模板 | ppt |

## 高级参数

当需要更多控制时，可以使用以下高级参数：

### channelPasswd - 讲师密码

自定义讲师登录密码。

```bash
node scripts/polyv.js create-channel --name "培训直播" --channelPasswd "abc123456"
```

- 格式：6-16 位字符
- 不指定时系统自动生成

### pureRtcEnabled - 延迟模式

控制直播延迟。

```bash
node scripts/polyv.js create-channel --name "低延迟直播" --pureRtcEnabled Y
```

| 值 | 说明 | 适用场景 |
|----|------|----------|
| Y | 无延迟 | 互动直播、在线教育 |
| N | 普通延迟 | 大规模观看、活动直播 |

### type - 转播类型

设置频道转播模式。

```bash
node scripts/polyv.js create-channel --name "转播频道" --type transmit
```

| 值 | 说明 |
|----|------|
| normal | 普通直播（默认） |
| transmit | 转播源 |
| receive | 转播接收 |

### linkMicLimit - 连麦人数

限制连麦互动的人数。

```bash
node scripts/polyv.js create-channel --name "互动直播" --linkMicLimit 8
```

- 范围：1-16
- 默认：根据套餐配置

### categoryId - 分类 ID

将频道归类到指定分类。

```bash
node scripts/polyv.js create-channel --name "产品直播" --categoryId 12345
```

需要先通过 PolyV 后台创建分类获取 ID。

### startTime / endTime - 时间安排

设置直播开始和结束时间（仅作展示用）。

```bash
node scripts/polyv.js create-channel --name "定档直播" \
  --startTime 1699000000000 \
  --endTime 1699003600000
```

- 格式：13 位毫秒时间戳
- 注意：不会自动开始/结束直播，仅作显示

### labelData - 标签

为频道添加标签。

```bash
node scripts/polyv.js create-channel --name "带标签直播" --labelData "1,2,3"
```

- 格式：逗号分隔的标签 ID
- 需要先通过 PolyV 后台创建标签

## 场景类型 (scene)

| 值 | 说明 | 备注 |
|----|------|------|
| topclass | 大班课 | 默认，适合大多数场景 |
| double | 双师课 | 需开通权限 |
| train | 企业培训 | 适合内部培训 |
| alone | 活动营销 | 适合营销活动 |
| seminar | 研讨会 | 需开通权限 |
| guide | 导播 | 需开通权限 |

## 模板类型 (template)

| 值 | 说明 | 适用场景 |
|----|------|----------|
| ppt | 三分屏-横屏 | 默认，适合课件直播 |
| portrait_ppt | 三分屏-竖屏 | 移动端优先 |
| alone | 纯视频-横屏 | 纯摄像头直播 |
| portrait_alone | 纯视频-竖屏 | 移动端纯视频 |
| topclass | 纯视频极速-横屏 | 大班课极速模式 |
| portrait_topclass | 纯视频极速-竖屏 | 大班课极速模式 |
| seminar | 研讨会 | 研讨会专用 |

## 完整示例

```bash
# 创建一个功能完整的直播频道
node scripts/polyv.js create-channel \
  --name "新产品发布会" \
  --scene alone \
  --template alone \
  --pureRtcEnabled Y \
  --linkMicLimit 6 \
  --channelPasswd "live2024" \
  --categoryId 100 \
  --startTime 1699000000000 \
  --endTime 1699007200000 \
  --labelData "10,20,30"
```

## 注意事项

1. **权限限制**：部分场景和功能需要开通相应权限
2. **参数组合**：某些模板只适用于特定场景，请参考上表
3. **调试模式**：使用 `POLYV_DEBUG=true` 可以查看完整的请求参数
