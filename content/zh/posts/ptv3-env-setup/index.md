---
title: "PointTransformer v3 环境搭建记录"
_title: "PointTransformer V3 Environment Setup"
date: 2026-06-06T20:00:00+08:00
categories: ["tech"]
---

环境配置（AutoDL）：
  - RTX 4090
  - PyTorch 2.0.0 · 
  - Python 3.8 (Ubuntu 20.04) 
  - CUDA 11.8

## 一、基础环境安装

```bash
conda create -n pointcept python=3.8 -y
conda activate pointcept
conda install ninja -y
```

官方 PyTorch 安装需要长时间进行环境搜索，pip 能够直接安装：

```bash
# conda install pytorch==2.1.0 torchvision==0.16.0 torchaudio==2.1.0 pytorch-cuda=11.8 -c pytorch -c nvidia

pip install torch==2.1.0 torchvision==0.16.0 torchaudio==2.1.0 --index-url https://download.pytorch.org/whl/cu118
```

同理，官方的基础包 Conda 安装亦是如此，pip 更快：

```bash
# conda install h5py pyyaml -c anaconda -y
# conda install sharedarray tensorboard tensorboardx yapf addict einops scipy plyfile termcolor timm -c conda-forge -y

pip install h5py pyyaml scipy einops tensorboard tensorboardx \
plyfile termcolor timm addict yapf sharedarray
```

避免官方的 conda pyg channel，采用更为稳定的方式：

```bash
# conda install pytorch-cluster pytorch-scatter pytorch-sparse -c pyg -y
# pip install torch-geometric

pip install pyg-lib torch-scatter torch-sparse torch-cluster torch-geometric \
-f https://data.pyg.org/whl/torch-2.1.0+cu118.html
```

剩下部分照旧：

```bash
cd libs/pointops
python setup.py install   # 此处可能遇到问题，见下方"可能出现的问题"

cd ../..

# spconv (SparseUNet)
# 参考 https://github.com/traveller59/spconv
pip install spconv-cu118     # 选择与本地 CUDA 版本匹配的

# Open3D (visualization, optional)
pip install open3d
```

---
## 二、安装 Flash Attention

Flash Attention 用于加速 Transformer 中注意力机制计算（可选，不装也能跑，但建议安装）。

官方仓库: https://github.com/Dao-AILab/flash-attention

基于环境配置选用 flash attention v2.5.8。

直接安装：

```bash
pip install flash-attn==2.5.8 --no-build-isolation
```

本地下载并安装（本文采用浏览器下载）：

```bash
wget https://github.com/Dao-AILab/flash-attention/releases/download/v2.5.8/flash_attn-2.5.8+cu118torch2.1cxx11abiFALSE-cp38-cp38-linux_x86_64.whl
#本地下载，也可直接输入链接进行浏览器下载

# 下载后安装
pip install flash_attn-2.5.8+cu118torch2.1cxx11abiFALSE-cp38-cp38-linux_x86_64.whl
```

---
## 三、补充安装

```bash
pip install wandb
pip install peft
```

---
## Tips
- **关闭 wandb**（实验管理与可视化），避免反复登录，但仍然可以使用本地 tensorboard 可视化：

    将 `./Pointcept/configs/_base_/default_runtime.py` 第 24 行的 `enable_wandb = True` 改为 `False`。


---
## 可能出现的问题

### ImportError: cannot import name 'packaging' from 'pkg_resources'

详细报错：

```
Traceback (most recent call last):
  File "setup.py", line 3, in <module> from torch.utils.cpp_extension import BuildExtension, CUDAExtension
  File "/root/miniconda3/envs/pointcept/lib/python3.8/site-packages/torch/utils/cpp_extension.py", line 28, in <module>
  from pkg_resources import packaging  # type: ignore[attr-defined]
  ImportError: cannot import name 'packaging' from 'pkg_resources'
  (/root/miniconda3/envs/pointcept/lib/python3.8/site-packages/pkg_resources/__init__.py)
```

解决方法：安装/更新 setuptools 等相关包

```bash
pip install -U pip setuptools wheel packaging
```

### ModuleNotFoundError: No module named 'pointrope'

能够运行但速度会下降。

详细报错：

```
(ModuleNotFoundError: No module named 'pointrope'). Using slower Pytorch fallback.
```

解决方法：重新编译

```bash
cd ./Pointcept/libs/pointrope
pip install -e .
```
