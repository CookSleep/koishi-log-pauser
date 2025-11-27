# Koishi 日志滚动控制

![Version](https://img.shields.io/badge/version-1.0-blue) ![License](https://img.shields.io/badge/license-GPLv3-brightgreen)

为 Koishi 控制台 (Console) 的日志界面添加一个 **暂停/继续** 自动滚动按钮。

当你试图向上滚动查看历史报错或调试信息时，不再会被新进来的日志强制拉回底部。

## ✨ 功能特性

- **⏯️ 一键暂停/跟踪**：点击按钮即可在“自动跟踪最新日志”和“暂停滚动查看历史”之间切换。
- **🖱️ 智能交互**：暂停模式下支持手动滚动，脚本会自动记录并锁定你当前停留的位置。

## 📸 效果预览

<img width="450" height="60" alt="跟踪状态" src="https://github.com/user-attachments/assets/1af37dfb-85bd-4102-a0a1-0addb8b84652" />

<img width="450" height="60" alt="暂停状态" src="https://github.com/user-attachments/assets/60b24148-ddc2-4a27-bfa2-4a816121c492" />

## 🚀 安装方法

你需要先在浏览器中安装脚本管理器，如 **Tampermonkey** (篡改猴)。

1. 安装 Tampermonkey 插件 ([Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) / [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) / [Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/))。

2. 点击下方链接直接安装脚本：
   
   👉 **[点击安装 Koishi Log Pauser](https://github.com/CookSleep/koishi-log-pauser/raw/main/koishi-log-pauser.user.js)** 

3. 打开你的 Koishi 控制台日志页面，按钮将自动出现在顶部标题栏右侧。
> 如果你是在自定义端口或域名反代上查看日志，按钮可能不会出现，请参考下文修改匹配设置

## 🛠️ 匹配设置

脚本默认匹配了 Koishi 的常用端口。如需编辑，请在 Tampermonkey 编辑器中修改脚本头部的 `@match` 规则：

```javascript
// @match        http://localhost:5140/logs*
// @match        https://你的域名.com/logs*
```

## 📝 原理说明

Koishi 的前端界面会在接收到新日志 socket 消息时，强制设置滚动容器的 `scrollTop`。

本脚本通过 `Object.defineProperty` **劫持**了滚动容器的 `scrollTop` 属性 setter。当处于“暂停”状态时，脚本会拦截所有试图改变滚动位置的原生指令，并将其强制重置为用户当前停留的位置，从而实现“锁止”效果。

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来改进代码！
