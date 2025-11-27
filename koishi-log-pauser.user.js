// ==UserScript==
// @name         Koishi 日志滚动控制
// @namespace    https://github.com/CookSleep
// @version      1.1
// @description  控制 Koishi 控制台日志滚动
// @author       Cook Sleep
// @match        http://localhost:5140/logs*
// @icon         https://koishi.chat/logo.png
// @grant        GM_addStyle
// @license      GPLv3
// @downloadURL  https://github.com/CookSleep/koishi-log-pauser/raw/main/koishi-log-pauser.user.js
// @updateURL    https://github.com/CookSleep/koishi-log-pauser/raw/main/koishi-log-pauser.user.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    const SELECTORS = {
        SCROLL_WRAP: '.el-scrollbar__wrap',
        HEADER: '.layout-header',
        TITLE: '.layout-header .left' // 定位标题区域
    };

    const TARGET_TITLE = '日志'; // 目标标题文本

    // 提取 Koishi 风格的 CSS 变量和样式
    const STYLES = `
        #koishi-log-toggle-btn {
            /* 基础布局 */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 28px;
            padding: 0 12px;
            margin-left: auto;
            margin-right: 16px;
            /* 字体 */
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            /* 默认外观 (暗色模式/默认) */
            background-color: transparent;
            border: 1px solid var(--k-border, #4c4c4c);
            border-radius: 6px;
            color: var(--k-text-light, #a0a0a0);
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
            box-sizing: border-box;
            z-index: 1000;
        }

        /* 悬停效果 */
        #koishi-log-toggle-btn:hover {
            border-color: var(--k-primary, #a48eff);
            color: var(--k-primary, #a48eff);
            background-color: rgba(164, 142, 255, 0.05);
        }

        /* 暂停状态 */
        #koishi-log-toggle-btn.paused {
            border-color: #ff6b6b;
            color: #ff6b6b;
            background-color: rgba(255, 107, 107, 0.05);
        }

        #koishi-log-toggle-btn.paused:hover {
            background-color: rgba(255, 107, 107, 0.1);
            box-shadow: 0 0 8px rgba(255, 107, 107, 0.2);
        }

        /* 图标微调 */
        #koishi-log-toggle-btn svg {
            margin-right: 6px;
            fill: currentColor;
            width: 14px;
            height: 14px;
        }

        /* 适配浅色模式 - 跟随浏览器系统设置 */
        @media (prefers-color-scheme: light) {
            #koishi-log-toggle-btn {
                border-color: #dcdfe6; /* 浅灰边框 */
                color: #606266;       /* 深灰文字 */
            }
            #koishi-log-toggle-btn:hover {
                background-color: rgba(164, 142, 255, 0.1);
            }
            #koishi-log-toggle-btn.paused {
                border-color: #f56c6c;
                color: #f56c6c;
                background-color: rgba(245, 108, 108, 0.1);
            }
        }
    `;

    const ICONS = {
        PAUSE: `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`,
        PLAY: `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`
    };

    // ================= 状态变量 =================
    let isTracking = true;
    let scrollWrap = null;
    let toggleBtn = null;
    let currentScrollTop = 0;
    let originalScrollTopDescriptor = null;
    let initTimer = null;

    // ================= 核心逻辑 =================
    function injectStyles() {
        if (document.getElementById('koishi-log-style')) return;
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(STYLES);
        } else {
            const style = document.createElement('style');
            style.id = 'koishi-log-style';
            style.textContent = STYLES;
            document.head.appendChild(style);
        }
    }

    function init() {
        // 防止重复运行定时器
        if (initTimer) clearInterval(initTimer);

        injectStyles();

        initTimer = setInterval(() => {
            const header = document.querySelector(SELECTORS.HEADER);
            const titleEl = document.querySelector(SELECTORS.TITLE);
            scrollWrap = document.querySelector(SELECTORS.SCROLL_WRAP);

            // 核心检测逻辑：Header存在 + 滚动容器存在 + 标题文字是“日志”
            const isLogPage = titleEl && titleEl.textContent.trim() === TARGET_TITLE;

            if (header && scrollWrap && isLogPage) {
                // 只有当按钮不存在时才创建
                if (!document.getElementById('koishi-log-toggle-btn')) {
                    clearInterval(initTimer); // 找到了就停止轮询
                    createButton(header);
                    hijackScrollProperty();

                    // 监听手动滚动，用于暂停时记录位置
                    scrollWrap.addEventListener('scroll', (e) => {
                        if (!isTracking) {
                            currentScrollTop = scrollWrap.scrollTop;
                        }
                    });
                    console.log('[Koishi Log Pauser] 注入成功');
                }
            }
        }, 500);
    }

    function createButton(header) {
        toggleBtn = document.createElement('div');
        toggleBtn.id = 'koishi-log-toggle-btn';
        updateButtonState();
        toggleBtn.onclick = toggleState;

        // 确保 header 布局能容纳按钮
        header.style.display = 'flex';
        header.style.alignItems = 'center';

        // 插入到 header 中
        header.appendChild(toggleBtn);
    }

    function toggleState() {
        isTracking = !isTracking;
        if (isTracking) {
            updateButtonState();
            // 恢复跟踪时，立即滚动到底部
            if (scrollWrap) scrollWrap.scrollTop = scrollWrap.scrollHeight;
        } else {
            // 暂停时，记录当前位置
            if (scrollWrap) currentScrollTop = scrollWrap.scrollTop;
            updateButtonState();
        }
    }

    function updateButtonState() {
        if (isTracking) {
            toggleBtn.innerHTML = `${ICONS.PAUSE} 跟踪中`;
            toggleBtn.className = '';
        } else {
            toggleBtn.innerHTML = `${ICONS.PLAY} 已暂停`;
            toggleBtn.className = 'paused';
        }
    }

    function hijackScrollProperty() {
        if (!scrollWrap) return;

        const proto = Element.prototype;
        // 如果已经劫持过，就不再重复劫持，防止死循环或报错
        if (scrollWrap.hasOwnProperty('scrollTop')) return;

        originalScrollTopDescriptor = Object.getOwnPropertyDescriptor(proto, 'scrollTop');

        if (!originalScrollTopDescriptor || !originalScrollTopDescriptor.set) return;

        Object.defineProperty(scrollWrap, 'scrollTop', {
            get: function() {
                return originalScrollTopDescriptor.get.call(this);
            },
            set: function(value) {
                if (isTracking) {
                    // 跟踪模式：允许 Koishi 随意设置滚动条（通常是设到底部）
                    originalScrollTopDescriptor.set.call(this, value);
                } else {
                    // 暂停模式：忽略 Koishi 的自动滚动请求，强制保持在当前位置
                    originalScrollTopDescriptor.set.call(this, currentScrollTop);
                }
            },
            configurable: true
        });
    }

    // ================= 启动与路由监听 =================
    // 初始运行
    init();

    // 路由变化监听 (SPA 适配)
    let lastUrl = location.href;

    const observer = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // URL 变了，重新尝试初始化，因为 DOM 可能被重绘了
            // 依靠 init 内部的“日志”文字判断
            init();
        } else {
            // 即使 URL 没变，如果 DOM 变动导致按钮丢失（例如组件重载），也需要检查
            // 这里做一个轻量检查，如果我们在日志页但按钮没了，就重新 init
            const titleEl = document.querySelector(SELECTORS.TITLE);
            const isLogPage = titleEl && titleEl.textContent.trim() === TARGET_TITLE;
            const btn = document.getElementById('koishi-log-toggle-btn');

            if (isLogPage && !btn) {
                init();
            }
        }
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true
    });

})();
