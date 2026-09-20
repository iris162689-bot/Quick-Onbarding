# KnowQuick · 领域知识速通助手

输入任意领域关键词，AI 自动生成知识文档、思维导图和互动测验，帮你快速入门新领域。

## ✨ 功能特性

- 📖 **知识文档** — 结构化生成定义、核心理念、关键流程、核心工具
- 🧠 **思维导图** — 可视化知识脉络，一图掌握核心概念
- ✅ **互动测验** — 选择题检验理解程度，即时反馈答案解析
- 🎯 **任意领域** — 基于豆包大模型，支持任何领域关键词
- 🔒 **隐私安全** — API Key 保存在服务器环境变量中，前端不暴露

## 🚀 一键部署到 Vercel

### 准备工作

1. **注册火山引擎账号并开通豆包 API**
   - 访问：https://console.volcengine.com/ark
   - 开通「火山方舟」服务
   - 创建一个推理接入点（Endpoint），模型选择 `doubao-seed-1-6-250715`
   - 复制你的 API Key

2. **注册 GitHub + Vercel 账号**
   - GitHub: https://github.com/signup
   - Vercel: https://vercel.com/signup（用 GitHub 登录）

### 部署步骤

#### 第一步：上传代码到 GitHub

1. 在 GitHub 新建一个仓库，名字随便取（比如 `knowquick`）
2. 把本项目的所有文件上传到仓库里
3. 确保文件结构如下：
   ```
   knowquick/
   ├── index.html
   ├── vercel.json
   ├── package.json
   ├── api/
   │   └── generate.js
   └── README.md
   ```

#### 第二步：在 Vercel 导入项目

1. 登录 Vercel，点击「Add New...」→「Project」
2. 选择你刚才创建的 GitHub 仓库，点击「Import」
3. 在配置页面：
   - **Framework Preset**: 选 `Other`
   - **Root Directory**: 保持默认（就是根目录）
   - **Build Command**: 留空
   - **Output Directory**: 留空
4. 点击「Environment Variables」，添加一个环境变量：
   - Name: `DOUBAO_API_KEY`
   - Value: 你的豆包 API Key
5. 点击「Deploy」开始部署

#### 第三步：访问你的网站

大约 30 秒到 1 分钟就能部署完成，Vercel 会给你一个链接，比如：
`https://knowquick-xxx.vercel.app`

点击链接就能打开使用了！🎉

## 💡 使用方式

1. 打开网站
2. 在顶部输入你的豆包 API Key（如果配置了环境变量，这一步可以跳过）
3. 输入想了解的领域关键词（比如「B2B获客」「跨境电商广告投放」）
4. 点击「生成知识」，等待 10-20 秒
5. 在三个标签页之间切换：知识文档 / 思维导图 / 知识测验

## 🔧 技术栈

- **前端**: 原生 HTML + CSS + JavaScript（零框架，超快加载）
- **后端**: Vercel Serverless Functions (Node.js)
- **AI 模型**: 字节跳动豆包大模型（doubao-seed-1-6）
- **部署**: Vercel

## 📁 项目结构

```
knowquick/
├── index.html          # 主页面（前端）
├── vercel.json         # Vercel 配置
├── package.json        # 项目配置
├── api/
│   └── generate.js     # 后端 API（调用豆包大模型）
└── README.md           # 部署说明
```

## 🔮 后续可扩展方向

- 📄 **PDF 导出** — 一键导出知识文档为 PDF
- 📚 **知识库上传** — 支持上传 PDF/文档，基于你的私有知识库生成内容（RAG）
- 👤 **用户系统** — 注册登录，保存学习记录
- 📊 **学习进度** — 追踪学习过的领域和测验成绩
- 🌍 **多语言** — 支持中英文切换
- 📱 **移动端优化** — 更好的手机端体验

## ⚠️ 注意事项

- 本项目仅用于学习和演示目的
- 豆包 API 调用会产生费用，请关注你的用量
- 建议在 Vercel 环境变量中配置 API Key，不要把 Key 硬编码在代码里

---

Made with ❤️ by KnowQuick
