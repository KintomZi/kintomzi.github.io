# Kintom's Blog

基于 Jekyll + Minima 主题的个人博客，部署于 GitHub Pages (`kintomzi.github.io`)。

## 项目结构

### 构建与配置

| 文件 | 作用 |
|------|------|
| `_config.yml` | 站点全局配置：标题、URL、主题 (minima)、插件 (jekyll-feed, jekyll-polyglot)、多语言设置 |
| `Gemfile` | Ruby 依赖：Jekyll 4.4.1、minima 2.5、jekyll-feed 0.12、jekyll-polyglot 1.9 |
| `.gitignore` | 排除 `_site/`、`.jekyll-cache/`、`vendor/`、`.idea/` |

### 页面内容（中英文独立文件）

| 中文 (默认) | 英文 | URL | 说明 |
|------|------|------|------|
| `index.zh.markdown` | `index.en.markdown` | `/` `/en/` | 首页，展示自我介绍、文章列表、出版物 |
| `projects.zh.markdown` | `projects.en.markdown` | `/projects/` `/en/projects/` | 项目页面 |
| `categories.zh.markdown` | `categories.en.markdown` | `/categories/` `/en/categories/` | 笔记总览页 |
| `404.zh.html` | `404.en.html` | `/404.html` `/en/404.html` | 自定义 404 错误页 |

### 布局模板 `_layouts/`（覆盖 minima 主题）

| 文件 | 说明 |
|------|------|
| `default.html` | 全局基础框架，根据 `page.lang` 设置 `<html>` 语言属性 |
| `home.html` | 首页布局，包含自我介绍卡片和当前语言的文章列表 |
| `post.html` | 文章详情页，显示标题、日期、版块标签 |

### 包含组件 `_includes/`

| 文件 | 说明 |
|------|------|
| `header.html` | 导航栏：主页、项目、笔记、语言切换 |
| `head.html` | HTML head，含 SEO、CSS、RSS feed meta |

### 数据 `_data/`

| 文件 | 说明 |
|------|------|
| `cat_names.yml` | 版块英文 slug → 中英文显示名的映射表 |

### 文章 `_posts/`

| 文件 | 标题 | 版块 |
|------|------|------|
| `2026-06-03-hello-world.zh/en.markdown` | Hello World | misc |
| `2026-06-03-jekyll-blog-setup.zh/en.markdown` | Jekyll 博客搭建指南 / Setup Guide | tech |
| `2026-06-03-markdown-cheatsheet.zh/en.markdown` | Markdown 常用语法速查 / Quick Reference | tech |

## 架构说明

### 多语言机制

采用 [jekyll-polyglot](https://github.com/untra/polyglot) 插件实现中英双语言独立页面：

- 每篇文章和页面有独立的 `.zh.markdown` / `.en.markdown` 文件，内容各自硬编码，不再使用 JavaScript 动态切换
- 中文为默认跳转语言（`redirect_default: zh`），访问根路径自动跳转到 `/zh/`
- 英文挂载在 `/en/` 前缀下
- 导航栏底部显示语言切换链接，点击跳转到对应语言版本

### 分类系统

- 文章 `categories` 使用英文 slug（`tech`、`misc`、`paper`）
- `_data/cat_names.yml` 定义每个 slug 的中英文显示名称
- 各语言页面通过 `site.data.cat_names[slug][page.lang]` 查找对应显示名

### 新增版块

1. 在 `_data/cat_names.yml` 中添加 slug 的中英文名称
2. 文章 front matter 中使用 `categories: your-slug`

## 快速开始

```bash
# 安装依赖
bundle install

# 本地预览（中文默认在 /）
bundle exec jekyll serve

# 访问 http://localhost:4000（中文）
# 访问 http://localhost:4000/en/（英文）
```

## 编写新文章

在 `_posts/` 下创建中英文两个版本：

```markdown
---
layout: post
lang: zh
title: "文章标题"
date: 2026-06-03 20:00:00 +0800
categories: tech
permalink: /tech/2026/06/03/your-slug/
---

中文正文...
```
