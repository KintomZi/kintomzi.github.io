# Kintom's Blog

基于 Hugo 的个人博客，部署于 GitHub Pages (`kintomzi.github.io`)。

## 项目结构

### 构建与配置

| 文件 | 作用 |
|------|------|
| `hugo.toml` | 站点全局配置：标题、URL、多语言设置、分类 taxonomy |
| `.github/workflows/hugo.yml` | GitHub Actions 自动构建部署 |
| `.gitignore` | 排除 `public/`、`resources/`、`.hugo_build.lock`、`.idea/` |

### 页面内容

| 路径 | URL | 说明 |
|------|-----|------|
| `content/en/_index.md` | `/en/` | 英文首页 |
| `content/zh/_index.md` | `/zh/` | 中文首页 |
| `content/en/projects/_index.md` | `/en/projects/` | 项目页面 |
| `content/zh/projects/_index.md` | `/zh/projects/` | 项目页面 |

### 布局模板 `layouts/`

| 文件 | 说明 |
|------|------|
| `_default/baseof.html` | 全局基础框架 |
| `_default/single.html` | 文章详情页 |
| `_default/list.html` | 列表页（posts、projects 等 section） |
| `_default/terms.html` | 分类汇总页（按 category 分组的笔记列表） |
| `_default/term.html` | 单个分类下的文章列表 |
| `index.html` | 首页布局（自我介绍卡片 + 文章列表 + 出版物） |
| `404.html` | 自定义 404 页面（中英双语） |

### 组件 `layouts/partials/`

| 文件 | 说明 |
|------|------|
| `header.html` | 导航栏：主页、项目、笔记、语言切换 |
| `head.html` | HTML head：meta、CSS、hreflang |
| `footer.html` | 页脚 |

### 数据 `data/`

| 文件 | 说明 |
|------|------|
| `cat_names.yml` | 分类英文 slug → 中英文显示名的映射表 |

### 静态资源 `assets/css/`

| 文件 | 说明 |
|------|------|
| `main.css` | 全局样式（Hugo 构建时自动 minify + fingerprint） |

### 文章 `content/<lang>/posts/`

每篇文章是 Hugo page bundle（独立目录含 `index.md`），中英文各自独立：

| 目录 | 标题 | 分类 |
|------|------|------|
| `hello-world/` | Hello World | misc |
| `jekyll-homepage-setup/` | Jekyll 博客搭建指南 / Setup Guide | tech |
| `markdown-cheatsheet/` | Markdown 常用语法速查 / Quick Reference | tech |
| `pointnet/` | PointNet 论文 | paper |

## 架构说明

### 多语言机制

利用 Hugo 原生多语言支持，无需插件：

- 中英文内容分别放在 `content/zh/` 和 `content/en/` 下
- `defaultContentLanguageInSubdir = true` 确保所有语言都带前缀（`/en/`、`/zh/`）
- 根路径 `/` 自动重定向到 `/en/`
- 导航栏语言切换按钮链接到另一语言的首页

### 分类系统

- 文章 front matter 中使用 `categories: ["tech"]`（英文 slug）
- `data/cat_names.yml` 定义每个 slug 的中英文显示名称
- Hugo 自动生成 `/en/categories/` 和 `/zh/categories/` taxonomy 页面
- `layouts/_default/terms.html` 渲染分类汇总，`layouts/_default/term.html` 渲染单个分类下的文章列表

### 新增分类

1. 在 `data/cat_names.yml` 中添加 slug 的中英文名称
2. 文章 front matter 中使用 `categories: ["new-slug"]`

## 快速开始

```bash
# 安装 Hugo（macOS）
brew install hugo

# 安装 Hugo（Linux snap）
sudo snap install hugo

# 本地预览
hugo server

# 访问 http://localhost:1313/en/（英文）
# 访问 http://localhost:1313/zh/（中文）
```

## 编写新文章

```bash
# 创建英文文章
mkdir -p content/en/posts/my-post
# 编辑 content/en/posts/my-post/index.md

# 创建中文文章
mkdir -p content/zh/posts/my-post
# 编辑 content/zh/posts/my-post/index.md
```

文章 front matter 示例：

```markdown
---
title: "文章标题"
date: 2026-06-03T20:00:00+08:00
categories: ["tech"]
---

正文...
```

## 部署

推送 `master` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。
