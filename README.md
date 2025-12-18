# Koishi 控制台日志增强

![Version](https://img.shields.io/badge/version-1.3-blue) ![License](https://img.shields.io/badge/license-GPLv3-brightgreen)

为 Koishi 控制台 (Console) 的日志界面添加 **滚动控制**、**一键复制** 和 **多控制台支持** 功能，大幅提升调试体验。

## ✨ 功能特性

### 1. 📜 滚动控制
- **一键暂停/跟踪**：点击顶部标题栏右侧的按钮，即可在“自动跟踪最新日志”和“暂停滚动查看历史”之间切换。
- **智能交互**：
  - **跟踪模式**：有新日志时自动滚动到底部。
  - **暂停模式**：锁定当前视图位置，不再被新日志强制拉回底部，方便安心查看历史报错。

### 2. 📋 一键复制
- **悬停显示**：鼠标悬停在任意日志行上时，右侧会自动出现复制工具栏。
- **双模式支持**：
  - **`T` (Text)**：仅复制日志的正文内容（自动去除时间戳、日志等级前缀），适合粘贴到搜索框或问答。
  - **`All`**：复制该行的完整原始文本。
- **视觉反馈**：复制成功后按钮会变色提示。

### 3. ⚙️ 多控制台支持
- **自定义 URL**：支持配置多个 Koishi 控制台地址，适用于本地、服务器或自定义域名。
- **篡改猴菜单设置**：通过篡改猴扩展菜单打开设置弹窗，随时修改控制台地址。
- **智能匹配**：自动识别当前页面是否为已配置的 Koishi 控制台，仅在匹配时激活功能。
- **URL 自动处理**：自动移除输入 URL 的路径部分和末尾斜杠。

## 📸 效果预览

### 滚动控制

<img width="450" height="60" alt="image" src="https://github.com/user-attachments/assets/43295882-34fd-4ab9-88bb-b17a7e5cf607" />

<img width="450" height="60" alt="image" src="https://github.com/user-attachments/assets/e39113df-8f06-4ac3-aa9d-7da9fbc85ef5" />

<img width="450" height="60" alt="image" src="https://github.com/user-attachments/assets/f0df49ef-1143-49ab-b8eb-4027c90567d8" />

<img width="450" height="60" alt="image" src="https://github.com/user-attachments/assets/f2e4faa3-6e2a-4681-94a2-e20614949522" />

## 一键复制

<img width="410" height="130" alt="image" src="https://github.com/user-attachments/assets/f1195b61-c973-431a-b94d-1ef6eb2ba06e" />

<img width="410" height="130" alt="image" src="https://github.com/user-attachments/assets/511bc894-a290-4c54-928e-2324ac911183" />

- **`T` (Text)**

```
Detected GIF image, which is not supported by most models. Please install chatluna-image-service plugin to parse GIF animations.
```

- **`All`**

```
2025-12-18 23:47:54 [W] chatluna Detected GIF image, which is not supported by most models. Please install chatluna-image-service plugin to parse GIF animations.
```

## 🚀 安装方法

你需要先在浏览器中安装脚本管理器，如 **Tampermonkey** (篡改猴)。

1. 安装 Tampermonkey 插件 ([Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) / [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) / [Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/))。

2. 点击下方链接直接安装脚本：
   
   👉 **[点击安装 Koishi Console Log Enhanced](https://github.com/CookSleep/koishi-log-enhanced/raw/main/koishi-log-enhanced.user.js)**

3. **参考下方“设置说明”**，完成设置

4. 打开/刷新你的 Koishi 控制台日志页面，功能将自动生效。

## 🛠️ 设置说明

脚本默认使用 `http://127.0.0.1:5140` 作为 Koishi 控制台地址，若默认地址与你使用的不同，请参考下方内容进行修改。

**配置方式：**
1. 点击浏览器工具栏中的篡改猴图标，选择「⚙️ 设置控制台地址」打开设置弹窗进行修改。
2. 支持添加多个控制台地址，适用于同时管理多个 Koishi 实例。
3. 留空保存则使用默认值 `http://127.0.0.1:5140`。

**注意事项：**
- 输入完整的控制台地址（如 `https://koishi.example.com`），脚本会自动移除路径部分。
- 删除地址时需要点击两次确认，防止误删。

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来改进代码！
