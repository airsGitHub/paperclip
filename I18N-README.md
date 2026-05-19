# Paperclip 多语言增强 (i18n Fork)

本分支基于官方 Paperclip CLI，增加了中文（zh-CN）和日文（ja-JP）支持，便于中日混合团队内部使用。

## 快速开始

```bash
# 安装依赖
pnpm install

# 中文运行
PAPERCLIP_LANG=zh-CN pnpm paperclipai onboard

# 日文运行
PAPERCLIP_LANG=ja-JP pnpm paperclipai doctor

# 默认英文（未设置时回退）
pnpm paperclipai doctor
```

## 已覆盖范围

| 模块 | 状态 | 说明 |
|------|------|------|
| CLI Banner | ✅ | 标语已翻译 |
| CLI 命令描述 | ✅ | `onboard`, `doctor`, `run` 等所有一级命令 |
| 诊断检查 (doctor) | ✅ | 检查名称、结果消息、修复提示 |
| 数据库配置向导 | ✅ | `prompts/database.ts` 全部交互文本 |
| 其他 prompts / checks | 🔄 | 需继续扩展（见下方“如何扩展”） |
| React UI (`ui/`) | ⏳ | 尚未改造，建议用 `react-i18next` 类似方案 |

## 如何扩展更多翻译

1. **提取新文本**：找到你想翻译的硬编码英文（如 `cli/src/prompts/llm.ts`）
2. **添加词条**：在三个 locale 文件中添加同一 key：
   - `cli/src/i18n/locales/en.ts`（英文原文）
   - `cli/src/i18n/locales/zh-CN.ts`（中文）
   - `cli/src/i18n/locales/ja-JP.ts`（日文）
3. **替换代码**：将原字符串改为 `t("your_key")` 或 `t("your_key", { var: value })`
4. **运行检查**：
   ```bash
   pnpm run typecheck
   ```

## 与上游同步

```bash
./sync-upstream.sh
```

此脚本会：
1. `fetch` 官方最新代码
2. 合并到本地 `main`
3. 再将 `main` 合并到当前 `custom/i18n` 分支

若出现冲突，手动解决后提交即可。因为我们只新增了 `cli/src/i18n/` 目录并少量修改现有文件，冲突通常很少。

## 最小侵入原则

为降低长期维护成本，请遵循：
- **尽量只新增文件**：翻译库独立在 `cli/src/i18n/`
- **修改现有文件时只做字符串替换**：不动业务逻辑，不改函数签名
- **如需新增 hook**：优先在独立文件里做，再通过 import 接入

## Git 工作流

```bash
# 日常开发在自己的分支
git checkout custom/i18n

# 获取上游更新
./sync-upstream.sh

# 提交内部修改
git add .
git commit -m "i18n: add xxx translations"
git push origin custom/i18n
```
