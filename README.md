# polyv-skills

polyv直播平台 API Skills 集合，为 Claude Code 提供与保利威直播平台交互的能力。

## 功能特性

- 创建直播频道
- 管理直播配置
- 获取频道信息
- 更多功能开发中...

## 安装方式

### 方式一：Claude Code 插件市场（推荐）

```bash
/plugin marketplace add your-org/polyv-skills
/plugin install polyv-skills
```

### 方式二：npx skills

```bash
npx skills add your-org/polyv-skills
```

### 方式三：Git Submodule

```bash
git submodule add https://github.com/your-org/polyv-skills.git .agents/polyv-skills
```

### 方式四：Clone & Copy

```bash
git clone https://github.com/your-org/polyv-skills.git
cp -r polyv-skills/skills/* .agents/skills/
```

## 配置

1. 复制配置模板到用户配置目录：

```bash
mkdir -p ~/.polyv-skills
cp config/config.example.json ~/.polyv-skills/config.json
```

2. 编辑配置文件，填入您的保利威 API 凭证：

```json
{
  "appId": "您的appId",
  "appSecret": "您的appSecret"
}
```

## 项目结构

```
polyv-skills/
├── .claude-plugin/          # Claude Code 插件配置
│   ├── marketplace.json     # 市场定义
│   └── plugin.json          # 插件定义
├── skills/                  # Skills 目录
│   └── polyv-create-channel/  # 创建频道 Skill
│       ├── SKILL.md         # Skill 定义
│       └── references/      # 参考文档
├── tools/                   # 工具目录
│   ├── clis/                # CLI 工具脚本
│   ├── integrations/        # 集成参考文档
│   └── REGISTRY.md          # 工具注册表
├── config/                  # 配置模板
│   └── config.example.json  # 配置示例
├── README.md                # 本文件
├── AGENTS.md                # Agent 使用说明
├── LICENSE                  # MIT License
└── .gitignore               # Git 忽略规则
```

## 技术栈

- 纯 JavaScript（ES2022+）
- Node.js 18+
- 无需编译步骤
- 遵循 [Agent Skills 规范](https://agentskills.io)

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

- 项目地址：https://github.com/your-org/polyv-skills
- 问题反馈：https://github.com/your-org/polyv-skills/issues
