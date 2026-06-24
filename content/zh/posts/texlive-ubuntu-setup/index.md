---
title: "Tex Live 安装记录[Ubuntu22.04]"
_title: "Tex Live for Linux (Ubuntu)"
date: 2026-06-23T20:00:00+08:00
categories: ["tech"]
---

### 1. 进入临时目录
(或其他存储空间充足的指定目录)
```bash
cd /tmp
```

### 2. 文件下载
```bash
wget https://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz
```
或者：
```bash
curl -L -o install-tl-unx.tar.gz https://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz
```

### 3. 解压安装包
```bash
zcat < install-tl-unx.tar.gz | tar xf -
```
或者：
```bash
tar -xzf install-tl-unx.tar.gz
```
解压后会生成类似目录：`install-tl-20260622`

### 4. 进入安装目录
```bash
cd install-tl-*
```

### 5. 开始安装
非交互模式：

```bash
sudo perl ./install-tl --no-interaction
```
或者：
```bash
sudo ./install-tl --no-interaction
```

默认安装位置通常为：
```
/usr/local/texlive/2026
```

安装完整方案可能需要：
- 6~10 GB 磁盘空间
- 数十分钟到数小时（取决于网络）

### 6. 配置环境变量
安装完成后需要把 TeX Live 加入 PATH。
查看平台目录：
```bash
ls /usr/local/texlive/2026/bin/
```

通常 Linux x86_64 为：
```bash
x86_64-linux
```
编辑：
```bash
vim ~/.bashrc
```
追加：
```bash
export PATH=/usr/local/texlive/2026/bin/x86_64-linux:$PATH
```
或者直接在主目录中点击 `.bashrc` 文件，进行直接修改并保存。

### 7. 使配置生效
```bash
source ~/.bashrc
```
或者
```bash
source ~/.zshrc
```

### 8. 验证安装
```bash
which pdflatex
```
应输出：
```bash
/usr/local/texlive/2026/bin/x86_64-linux/pdflatex
```

查看版本：
```bash
pdflatex --version
```

查看 TeX Live 版本：
```bash
tlmgr --version
```

### 参考
[Linux下安装TeXLive并配置VSCode中tex编写环境](https://www.m0rtzz.com/posts/4)

[TeX Live - Quick install for Unix](https://www.tug.org/texlive/quickinstall.html)

[A Fast Guide on Writing LaTeX with LaTeX Workshop in VS Code](https://mathjiajia.github.io/vscode-and-latex/)
