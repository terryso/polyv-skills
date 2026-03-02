# polyv-skills Project Context

> AI 助手上下文文档 - 为 AI 提供项目规则和上下文

## 项目概述

PolyV 直播平台 API Skills 集合，为 Claude Code 提供与保利威直播平台交互的能力。

**仓库地址**: https://github.com/terryso/polyv-skills

## 技术栈

| 类别 | 选择 |
|------|------|
| 语言 | JavaScript (ES2022+) |
| 运行时 | Node.js 18+ |
| 测试框架 | Mocha |
| 包管理 | npm |
| 构建工具 | 无（无需编译） |

## 项目结构

```
polyv-skills/
├── .claude-plugin/          # Claude Code 插件配置
│   ├── marketplace.json     # 市场定义
│   └── plugin.json          # 插件定义
├── skills/                  # Skills 目录
│   └── polyv-create-channel/
│       ├── SKILL.md         # Skill 定义
│       └── references/      # 参考文档
├── tools/
│   ├── clis/                # CLI 工具
│   │   └── polyv.js         # 主 CLI (配置加载)
│   ├── integrations/        # 集成文档
│   └── REGISTRY.md          # 工具注册表
├── tests/
│   ├── unit/                # 单元测试 (*.test.js)
│   └── e2e/                 # E2E 测试 (*.test.js)
├── config/
│   └── config.example.json  # 配置模板
├── README.md
├── AGENTS.md
├── LICENSE
└── package.json
```

## 开发命令

```bash
# 安装依赖
npm install

# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行 E2E 测试
npm run test:e2e

# 测试配置加载
node tools/clis/polyv.js config-test

# Debug 模式
POLYV_DEBUG=true node tools/clis/polyv.js config-test
```

## 测试规范

### 测试框架
- **Mocha** - 所有测试使用 Mocha
- **CommonJS** - 使用 `require`/`module.exports`
- **Node.js assert** - 使用内置 assert 模块

### 测试文件命名
- `*.test.js` - 测试文件后缀
- `tests/unit/*.test.js` - 单元测试
- `tests/e2e/*.test.js` - E2E 测试

### 测试组织
```javascript
describe('Feature Name', () => {
  describe('AC1: Acceptance Criteria 1', () => {
    it('should do something', () => {
      // Arrange
      // Act
      // Assert
      assert.strictEqual(actual, expected);
    });
  });
});
```

## 配置说明

### 配置来源（优先级从高到低）
1. **CLI 参数**: `--appId`, `--appSecret`
2. **环境变量**: `POLYV_APP_ID`, `POLYV_APP_SECRET`, `POLYV_DEBUG`
3. **配置文件**: `~/.polyv-skills/config.json`

### 配置文件格式
```json
{
  "appId": "your-app-id",
  "appSecret": "your-app-secret"
}
```

## API 集成

### PolyV API v4
- **Base URL**: `https://api.polyv.net`
- **认证方式**: 签名验证（MD5）
- **签名参数**: `appId`, `timestamp`, `sign`

### 签名算法
```
sign = MD5(appSecret + timestamp + appId + appSecret)
```

## 代码规范

### 命名约定
- **文件**: `kebab-case.js`
- **函数**: `camelCase`
- **常量**: `UPPER_SNAKE_CASE`
- **Skill 目录**: `polyv-{action}-{resource}`

### 错误处理
```javascript
function formatError(code, message, hint) {
  return `❌ [POLYV-${code}] ${message}\n   提示：${hint}`;
}
```

### 敏感数据处理
```javascript
function maskSensitiveData(data) {
  // appSecret 显示为 "ab****yz"
}
```

## Git 工作流

### 提交信息格式
```
type(scope): description

- feat: 新功能
- fix: 修复
- docs: 文档
- test: 测试
- chore: 杂项
```

### 提交信息示例
```
feat(cli): add config loading with priority support
fix(sign): correct MD5 signature calculation
docs(readme): update installation instructions
test(e2e): convert Playwright tests to Mocha
```

## 相关文档

- [README.md](README.md) - 项目说明和安装指南
- [AGENTS.md](AGENTS.md) - Agent/Skill 使用说明
- [tools/REGISTRY.md](tools/REGISTRY.md) - 工具注册表
- [skills/polyv-create-channel/SKILL.md](skills/polyv-create-channel/SKILL.md) - 创建频道 Skill
