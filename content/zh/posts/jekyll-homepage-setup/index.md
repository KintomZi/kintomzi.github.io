---
title: "Jekyll 个人主页搭建指南"
date: 2026-06-03T20:30:00+08:00
categories: ["tech"]
url: /zh/tech/2026/06/03/jekyll-blog-setup/
---

记录一下用 Jekyll + Minima 主题搭建这个个人主页的过程。

## 环境准备

需要 Ruby 和 Bundler 环境：

```bash
sudo apt install ruby-full build-essential zlib1g-dev
gem install jekyll bundler
```

## 创建站点

```bash
jekyll new my-awesome-site
cd my-awesome-site
bundle exec jekyll serve
```

访问 `http://localhost:4000` 即可看到博客。

## 编写文章

在 `_posts/` 目录下创建 `YYYY-MM-DD-title.markdown` 格式的文件即可自动发布。
