---
title: "Jekyll Homepage Setup Record"
_title: "Jekyll 个人主页搭建指南"
date: 2026-06-03T20:30:00+08:00
categories: ["tech"]
url: /en/tech/2026/06/03/jekyll-blog-setup/
---

A quick note on setting up this personal homepage with Jekyll + Minima theme.

## Prerequisites

Ruby and Bundler are required:

```bash
sudo apt install ruby-full build-essential zlib1g-dev
gem install jekyll bundler
```

## Create Site

```bash
jekyll new my-awesome-site
cd my-awesome-site
bundle exec jekyll serve
```

Visit `http://localhost:4000` to see the blog.

## Writing Posts

Create files in `_posts/` using the `YYYY-MM-DD-title.markdown` naming convention to auto-publish.
