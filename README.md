# Kintom's Homepage

基于 Hugo 的个人主页，部署于 GitHub Pages (`kintomzi.github.io`)[[Link](https://kintomzi.github.io/)]。

---
## 1.项目结构/Project structure

```
.
├── hugo.toml                          # 站点全局配置：标题、URL、多语言设置、分类 taxonomy
├── .github/
│   └── workflows/
│       └── hugo.yml                   # GitHub Actions 自动构建部署
├── .gitignore                         # 排除 public/、resources/、.hugo_build.lock、.idea/
├── content/
│   ├── en/
│   │   ├── _index.md                  # 英文首页 → /en/
│   │   ├── projects/
│   │   │   └── _index.md              # 项目页面 → /en/projects/
│   │   └── posts/
│   │       ├── post_name_0/           # 文章名称（英文简写）
│   │       │   └── index.md           # 文章内容
│   │        ...
│   │       └── post_name_i/           # 文章名称（英文简写）
│   │           └── index.md           # 文章内容
│   └── zh/
│       ├── _index.md                  # 中文首页 → /zh/
│       ├── projects/
│       │   └── _index.md              # 项目页面 → /zh/projects/
│       └── posts/
│           ├── post_name_0/           # 文章名称（英文简写）
│           │   └── index.md           # 文章内容
│            ...
│           └── post_name_i/           # 文章名称（英文简写）
│               └── index.md           # 文章内容
├── layouts/
│   ├── _default/
│   │   ├── baseof.html               # 全局基础框架
│   │   ├── single.html               # 文章详情页
│   │   ├── list.html                 # 列表页（posts、projects 等 section）
│   │   ├── terms.html                # 分类汇总页（按 category 分组的笔记列表）
│   │   └── term.html                 # 单个分类下的文章列表
│   ├── index.html                    # 首页布局（自我介绍卡片 + 文章列表 + 出版物）
│   ├── 404.html                      # 自定义 404 页面（中英双语）
│   └── partials/
│       ├── header.html               # 导航栏：主页、项目、笔记、语言切换
│       ├── head.html                 # HTML head：meta、CSS、hreflang
│       └── footer.html               # 页脚
├── data/
│   └── cat_names.yml                 # 分类英文 slug → 中英文显示名的映射表
└── assets/
    └── css/
        └── main.css                  # 全局样式（Hugo 构建时自动 minify + fingerprint）
```
---
## 2.架构说明/Framework explanation

### 多语言机制

利用 Hugo 原生多语言支持，无需插件：

- 中英文内容分别放在 `content/zh/` 和 `content/en/` 下
- `defaultContentLanguageInSubdir = true` 确保所有语言都带前缀（`/en/`、`/zh/`）
- 根路径 `/` 自动重定向到 `/en/`，在 hugo.toml 中 defaultContentLanguage 字段可设置重定向语言
- 导航栏语言切换按钮链接到另一语言的首页

### 分类系统

- 文章 front matter 中使用 `categories: ["tech"]`（英文 slug）
- `data/cat_names.yml` 定义每个 slug 的中英文显示名称
- Hugo 自动生成 `/en/categories/` 和 `/zh/categories/` taxonomy 页面
- `layouts/_default/terms.html` 渲染分类汇总，`layouts/_default/term.html` 渲染单个分类下的文章列表

### 新增分类

1. 在 `data/cat_names.yml` 中添加 slug 的中英文名称
2. 文章 front matter 中使用 `categories: ["new-slug"]`

---
## 3.首次部署/First deployment

### 3.1 Fork 仓库

点击仓库右上角 **Fork** 按钮，将本项目复制到你的 GitHub 账号下。建议仓库命名为 `<用户名>.github.io`，以便通过 `https://<用户名>.github.io` 直接访问。

### 3.2 修改配置

编辑 `hugo.toml`，将以下字段改为你自己的信息：

```toml
baseURL = 'https://<用户名>.github.io/'
title = '<用户名>.github.io'

[params]
  github_username = '<用户名>'
  interests = ['兴趣1', '兴趣2', '兴趣3']
```

### 3.3 启用 GitHub Pages 和 Actions 权限

1. 进入仓库 **Settings** → **Pages**
2. **Source** 选择 **GitHub Actions**
3. 进入 **Settings** → **Actions** → **General**
4. **Workflow permissions** 选择 **Read and write permissions**
5. 勾选 **Allow GitHub Actions to create and approve pull requests**

### 3.4 触发首次构建

推送代码到 `main` 分支后，GitHub Actions 自动构建并部署：

```bash
git add . && git commit -m "init deploy" && git push origin main
```

部署完成后，在 **Settings** → **Pages** 中可看到站点地址。

### 3.5 本地预览（可选）

```bash
# 安装 Hugo（macOS）
brew install hugo
# 安装 Hugo（Linux）
sudo snap install hugo

# 启动本地预览
hugo server
# 访问 http://localhost:1313/en/（英文）、http://localhost:1313/zh/（中文）
```

---

## 4.内容更新/Content update

### 4.1 网页代码更新

修改站点样式、布局、配置等代码文件（如 `hugo.toml`、`layouts/`、`assets/css/`）：

#### 本地上传

```bash
git clone git@github.com:<用户名>/<用户名>.github.io.git
cd <用户名>.github.io
# 编辑代码...
git add . && git commit -m "update: xxx" && git push origin main
```

#### GitHub 网页端

1. 在仓库页面按 `.` 键（或将 URL 中 `github.com` 改为 `github.dev`），进入在线编辑器
2. 直接编辑代码文件，保存后提交到 `main` 分支
3. GitHub Actions 自动触发构建部署

---

### 4.2 文章更新

添加或修改博客文章（`content/` 目录下的 `.md` 文件）：

#### 本地上传（推荐）

```bash
# 创建新文章（英文）
mkdir -p content/en/posts/my-post
# 编辑 content/en/posts/my-post/index.md

# 创建新文章（中文）
mkdir -p content/zh/posts/my-post
# 编辑 content/zh/posts/my-post/index.md

# 推送触发部署
git add . && git commit -m "new post: my-post" && git push origin main
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

#### GitHub 网页端

1. 在仓库页面按 `.` 键进入在线编辑器，或使用 **Add file** → **Create new file** / **Upload files**
2. 在 `content/en/posts/` 或 `content/zh/posts/` 下创建新目录和 `index.md`
3. 编辑内容，保存后提交到 `main` 分支
4. GitHub Actions 自动触发构建部署
