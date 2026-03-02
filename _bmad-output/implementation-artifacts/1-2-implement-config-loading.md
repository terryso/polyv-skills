# Story 1.2: 实现配置加载功能

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a polyv-skills 用户,
I want 通过环境变量或配置文件设置 polyv 凭据,
So that 我可以灵活地配置工具而无需每次输入凭据。

## Acceptance Criteria

1. **AC1: 环境变量配置支持**
   - Given 用户需要配置 polyv API 凭据
   - When 使用环境变量配置
   - Then 支持 `POLYV_APP_ID` 和 `POLYV_APP_SECRET` 环境变量

2. **AC2: 配置文件支持**
   - Given 用户需要配置 polyv API 凭据
   - When 使用配置文件配置
   - Then 支持 `~/.polyv-skills/config.json` 配置文件
   - And 配置文件格式为 `{ "appId": "...", "appSecret": "..." }`

3. **AC3: 参数传入支持**
   - Given 用户需要在调用时传入凭据
   - When 使用命令行参数
   - Then 支持 `--appId` 和 `--appSecret` 参数覆盖

4. **AC4: 配置优先级**
   - Given 用户同时设置了多种配置方式
   - When 加载配置
   - Then 按优先级加载：参数 > 环境变量 > 配置文件

5. **AC5: 凭据缺失错误提示**
   - Given 用户未配置任何凭据
   - When 调用需要凭据的功能
   - Then 返回清晰的中文错误信息，提示如何配置

## Tasks / Subtasks

- [ ] Task 1: 创建配置加载模块 (AC: 1, 2, 3, 4)
  - [ ] 1.1 在 `tools/clis/polyv.js` 中创建 `loadConfig()` 函数
  - [ ] 1.2 实现环境变量读取逻辑 (`process.env.POLYV_APP_ID`, `process.env.POLYV_APP_SECRET`)
  - [ ] 1.3 实现配置文件读取逻辑 (`~/.polyv-skills/config.json`)
  - [ ] 1.4 实现命令行参数解析逻辑
  - [ ] 1.5 实现配置优先级合并逻辑

- [ ] Task 2: 创建配置文件模板 (AC: 2)
  - [ ] 2.1 创建 `config/config.example.json` 文件
  - [ ] 2.2 包含 `appId` 和 `appSecret` 字段说明

- [ ] Task 3: 实现错误处理 (AC: 5)
  - [ ] 3.1 创建 `formatError()` 函数用于格式化错误消息
  - [ ] 3.2 实现凭据缺失的错误提示（中文，包含配置指引）
  - [ ] 3.3 实现配置文件读取失败的错误处理

- [ ] Task 4: 添加 Debug 模式支持
  - [ ] 4.1 创建 `debug()` 函数用于调试输出
  - [ ] 4.2 通过 `POLYV_DEBUG` 环境变量控制
  - [ ] 4.3 在 debug 模式下输出配置加载详情（脱敏 appSecret）

- [ ] Task 5: 测试配置加载功能
  - [ ] 5.1 测试仅环境变量配置
  - [ ] 5.2 测试仅配置文件配置
  - [ ] 5.3 测试参数覆盖
  - [ ] 5.4 测试凭据缺失错误提示
  - [ ] 5.5 测试 debug 模式输出

## Dev Notes

### Architecture Patterns and Constraints

**技术栈:**
- 纯 JavaScript (ES2022+) + Node.js 18+
- 无需编译，直接通过 `node` 执行
- 使用 Node.js 内置模块：`fs`, `path`, `os`, `process`

**配置存储位置:**
- 配置文件路径：`~/.polyv-skills/config.json`（使用 `os.homedir()` 获取用户目录）
- 配置文件格式：JSON `{ "appId": "xxx", "appSecret": "xxx" }`

**配置优先级（从高到低）:**
1. 命令行参数 (`--appId`, `--appSecret`)
2. 环境变量 (`POLYV_APP_ID`, `POLYV_APP_SECRET`)
3. 配置文件 (`~/.polyv-skills/config.json`)

### Source Tree Components to Touch

```
polyv-skills/
├── tools/
│   └── clis/
│       └── polyv.js           # 主要修改：添加配置加载逻辑
└── config/
    └── config.example.json    # 创建：配置文件模板
```

### Testing Standards

**手动测试命令:**
```bash
# 测试环境变量配置
POLYV_APP_ID=test POLYV_APP_SECRET=secret node tools/clis/polyv.js config-test

# 测试 debug 模式
POLYV_DEBUG=true POLYV_APP_ID=test node tools/clis/polyv.js config-test

# 测试凭据缺失
node tools/clis/polyv.js config-test
```

### Project Structure Notes

- 项目已在 Story 1.1 中创建基础结构
- `tools/clis/polyv.js` 文件已存在，需要扩展配置加载功能
- 配置文件目录 `config/` 已存在
- 遵循统一的项目结构（paths, modules, naming）

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR1-FR4] - 配置管理功能需求
- [Source: _bmad-output/planning-artifacts/architecture.md#配置加载模式] - 配置加载代码模式
- [Source: _bmad-output/planning-artifacts/architecture.md#错误处理模式] - 错误处理代码模式
- [Source: _bmad-output/planning-artifacts/architecture.md#Debug模式] - Debug 模式代码模式

### Previous Story Intelligence (Story 1.1)

**已完成的工作:**
- 项目基础结构已创建（`.claude-plugin/`, `skills/`, `tools/` 等）
- `tools/clis/polyv.js` 文件已创建（基础框架）
- `config/config.example.json` 文件已创建（模板）
- 插件配置文件已创建（`marketplace.json`, `plugin.json`）
- Git 忽略规则已配置（`.gitignore`）

**代码模式:**
- 使用纯 JavaScript，无需 TypeScript 编译
- 错误消息使用中文格式：`❌ [POLYV-{CODE}] {中文错误描述}`
- Debug 输出通过 `POLYV_DEBUG` 环境变量控制

**注意事项:**
- 确保 `~/.polyv-skills/` 目录存在，不存在时自动创建
- 配置文件读取时处理 JSON 解析错误
- 不要在日志中输出 appSecret 明文

### Git Intelligence

**最近的提交:**
```
1697d8e feat(story-1.1): 创建项目结构和插件配置
66479d4 chore: initial commit with project structure
```

**已建立的代码模式:**
- 提交消息格式：`feat(story-X.Y): 描述`
- 项目使用 Git 进行版本控制

### Latest Technical Information

**Node.js 18+ 特性可用:**
- `fetch` API 原生支持
- `fs/promises` 模块用于异步文件操作
- `os.homedir()` 获取用户主目录

**配置文件最佳实践:**
- 建议用户设置配置文件权限为 600（仅所有者可读写）
- 配置文件不存在时不报错，返回空对象
- JSON 解析失败时返回友好的错误信息

## Dev Agent Record

### Agent Model Used
GLM-5

### Debug Log References


### Completion Notes List

### File List

- [ ] Task 1: 创建配置加载模块 (AC: 1, 2, 3, 4)
  - [x] 1.1 在 `tools/clis/polyv.js` 中创建 `loadConfig()` 函数
  - "x] 1.2 实现环境变量读取逻辑 (`process.env.POLYV_APP_ID`, `process.env.POLYV_APP_SECRET`)
  - "x] 1.3 实现配置文件读取逻辑 (`~/.polyv-skills/config.json`)
      - "x] 1.4 实现命令行参数解析逻辑
      - "x] 1.5 实现配置优先级合并逻辑

      - "x] 1.6 添加 Debug 模式支持 (通过 `POLYV_DEBUG` 环境变量控制)
      - "x] 1.7 在 debug 模式下输出配置加载详情（脱敏 appSecret）

      - "x] 4.1 创建配置文件模板 (AC: 2)
  - "x] 2.1 创建 `config/config.example.json` 文件
  - "x] 2.2 实现 `formatError()` 函数用于格式化错误消息
  - "x] 2.3 实现凭据缺失的错误提示（中文，包含配置指引）
      - "x] 2.4 添加 Debug 模式支持 (通过 `POLYV_DEBUG` 环境变量控制)
      - "x] 2.5 测试配置加载功能

      - "x] 3.1 手动运行 `node tools/clis/polyv.js config-test` 埥看错误信息

      - "x] 5.1 手动运行完整测试套件
        - `node tools/clis/polyv.js config-test`
        - 当有配置时:
          console.log('✅ Configuration loaded successfully');
          console.log(JSON.stringify({ appId: 'te****', appSecret: 'se****' }, null, {
          appId: 'te***',
            appSecret: 'se****',
          });
          process.exit(0);
        }
        console.log('❌ [POLYV-CONFIG_MISSING] 缺少 appId 和 appSecret 配置');
      console.log('请设置 POLYV_APP_ID 和 POLYV_APP_SECRET 环境变量');
      console.log('或创建配置文件 ~/.polyv-skills/config.json');
      console.log('  Format: { "appId": "YOUR_POLYv_app_id", "appSecret": "YOUR_polyv_app_secret" }');
      process.exit(1);
    } else {
      console.log('❌ [POLYV-CONFIG_MISSING] 缺少 appSecret 配置');
      console.log('请设置 POLYV_APP_SECRET 环境变量');
      console.log('或创建配置文件 ~/.polyv-skills/config.json');
      console.log('  Format: { "appId": "YOUR_POLYV_APP_ID", "appSecret": "YOUR_polyv_app_secret" }');
      process.exit(1);
    }
  });

  console.log(`\npolyv-skills CLI Tool

Usage:
  node polyv.js config-test [--appId <id>] [--appSecret <secret>]

Commands:
  config-test    Test configuration loading

Environment Variables:
  POLYV_APP_ID      Polyv application ID
  POLYV_APP_SECRET  Polyv application secret
  POLYV_DEBUG       Set to 'true' for debug output

Config File:
  ~/.polyv-skills/config.json
  Format: { "appId": "...", "appSecret": "..." }
`);
