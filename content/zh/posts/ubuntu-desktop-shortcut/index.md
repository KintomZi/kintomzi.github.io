---
title: "Ubuntu 22.04 创建桌面快捷方式(.desktop)"
date: 2025-07-31T13:21:53+08:00
categories: ["tech"]
---

`.desktop` 文件是 Linux（主要是基于 freedesktop.org 规范的桌面环境，如 GNOME、KDE 等）中用于描述一个**图形界面应用的启动方式**的配置文件。其本质是一个类似 INI 的文本文件，定义了该程序的**图标、启动命令、类别、行为等元信息**。

优先查找 `.desktop` 的官方文件，一般在 `/home/你的用户名/.local/share/applications`。

## 1. `.desktop` 文件的基本结构

通常位于：
- `~/.local/share/applications/`（用户级别）
- `/usr/share/applications/`（系统级别）

常用字段（变量）及其含义：

```
[Desktop Entry]
Name=程序的名称，会显示在菜单、标题栏等
GenericName=程序的通用名称，如"文字编辑器"、"终端"等
Comment=简短的描述，用于悬停提示等
Exec=启动程序的命令（可带参数）
TryExec=如果指定的可执行文件不存在，则不显示该启动项
Icon=图标路径或图标名称（不加后缀），GNOME 会从 icon theme 中查找
Terminal=是否在终端中运行（true/false）
Type=启动项类型，常用为 Application（还有 Link、Directory）
Categories=应用类别，用于归类菜单，如 Utility;Development;
MimeType=声明应用可打开的文件类型，如 text/plain;application/pdf;
StartupNotify=是否显示"正在启动"的提示（true/false）
StartupWMClass=用于窗口匹配 Dock 图标，尤其是 AppImage 等非标准程序
Path=执行命令的工作目录
NoDisplay=是否隐藏该项（适用于辅助项）
Hidden=设置为 true 表示该项被禁用（不会显示）
OnlyShowIn=限定在哪些桌面环境下显示（如 GNOME;KDE;）
NotShowIn=限定在哪些桌面环境下不显示
Actions=定义额外的菜单项（如右键功能）
Keywords=提供关键词，方便启动器搜索到此应用
```

## 2. 手动创建 `.desktop` 文件

### 2.1 进入桌面目录

在桌面右键打开终端，或者打开终端输入：

```bash
cd ~/Desktop
```

### 2.2 创建 `.desktop` 文件

```bash
gedit App_name.desktop
```

### 2.3 填写内容

```
[Desktop Entry]
Name=Obsidian
Comment=Knowledge base and note-taking app
Exec=/home/你的用户名/Applications/软件运行（.sh/.AppImage/...）
Icon=/home/你的用户名/.local/share/icons/软件图标(.png/.icon/.svg)
Terminal=false
Type=Application
Categories=Utility;
StartupNotify=true
```

### 2.4 赋予执行权限

```bash
chmod +x ~/Desktop/App_name.desktop
```

### 2.5 允许桌面图标启动

右键桌面图标 → 属性 → 权限 → 勾选"允许作为程序执行文件/允许运行"

## 3. 收藏夹栏显示正常图标

成功运行后，底下的收藏夹栏可能不显示正常图标。

### 3.1 在 applications 目录中再创建一个 desktop 文件

```bash
gedit ~/.local/share/applications/App_name.desktop
```

### 3.2 内容和桌面的一样

### 3.3 赋予执行权限

```bash
chmod +x ~/.local/share/applications/App_name.desktop
```

### 3.4 刷新 GNOME 菜单缓存

```bash
update-desktop-database ~/.local/share/applications
```

这样开始菜单里面会出现你的软件图标，然后运行后底下的收藏夹栏显示正常图标。
