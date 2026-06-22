---
title: "MinkowskiEngine0.5.3安装记录(Linux/Ubuntu)"
_title: "MinkowskiEngine 0.5.3 Setup Record (Linux/Ubuntu)"
date: 2025-07-21T00:00:00+08:00
categories: ["tech"]
url: 
---
由于MinkowskiEngine对环境搭配要求较高，优先创建一个新的conda环境，再配置项目所需要的其他包。

# 官方信息
Github 项目：[GitHub - NVIDIA/MinkowskiEngine: Minkowski Engine is an auto-diff neural network library for high-dimensional sparse tensors](https://github.com/NVIDIA/MinkowskiEngine)

开发文档：[Welcome to MinkowskiEngine’s documentation! — MinkowskiEngine 0.5.3 documentation](https://nvidia.github.io/MinkowskiEngine/)

# 准备阶段
## CUDA安装
==官方使用11.1 （cuda_11.1.0_455.23.05_linux.run）==
【文末有其他CUDA版本的搭配】

历代CUDA下载链接：https://developer.nvidia.com/cuda-toolkit-archive

## 系统环境修改
在.bashrc文件内添加
```
# <<<<CUDA environment>>>>
export PATH="/usr/local/cuda-11.1/bin:$PATH"
export LD_LIBRARY_PATH="/usr/local/cuda-11.1/lib64:$LD_LIBRARY_PATH"
export CUDA_HOME="/usr/local/cuda-11.1"
export CUDA_TOOLKIT_ROOT_DIR=$CUDA_HOME
export LD_LIBRARY_PATH="$CUDA_HOME/extras/CUPTI/lib64:$LD_LIBRARY_PATH"
export LIBRARY_PATH=$CUDA_HOME/lib64:$LIBRARY_PATH
export CFLAGS="-I$CUDA_HOME/include $CFLAGS"
# <<<<CUDA environment>>>>
```
在bash中激活环境变量
```bash
source ~/.bashrc
```

# 正式安装
## Conda环境搭建
（官方为3.8版本。可以更改版本，但前提是已知成功的版本）
```bash
conda create -n py3-mink python==3.8 #创建环境

conda activate py3-mink #激活环境
```
## GNU 编译
！！！由于ME库长时间未维护从而无法编译,官方要求版本>=7.4.0。gcc/g++的版本不能过高，更重要的是两者的版本一定要和CUDA契合。
```bash
conda install -c conda-forge gcc_linux-64=7.5.0

conda install -c conda-forge gxx_linux-64=7.5.0
```
安装验证：
```bash
conda list gcc

conda list gxx
```
## Pytorch安装
pytorch不是越新越好，同时还需要注意pytorch与cudatoolkit的搭配（建议采用已验证后的搭配）。官方是1.9.0+cu111
```bash
conda install pytorch=1.9.0 torchvision cudatoolkit=11.1 -c pytorch -c nvidia

pip install ninja  

conda install openblas-devel -c anaconda
```
安装验证：
```bash
python -c "import torch; print(torch.cuda.is_available())"
```
## MinkowskiEngine安装
```bash
git clone https://github.com/NVIDIA/MinkowskiEngine.git  # 将安装在当前文件夹

cd MinkowskiEngine # 进入文件目录

python setup.py install --blas_include_dirs=${CONDA_PREFIX}/include --blas=openblas
```
安装验证：
```bash
python -c "import MinkowskiEngine as ME; print(ME.__version__)"
```

注意：
- MinkowskiEngine在安装成功后，若是在Pycharm中大量标黄是正常的。
- MinkowskiEngine在安装成功后，在Pycharm中的MinkowskiEngine文件不要管他。虽然在Pycharm中出现标红。

下面是来源官方代码修改调试后的可运行的测试项目，成功运行说明Minkowski Engine安装大概率不存在问题。
```python
import torch.nn as nn
import MinkowskiEngine as ME
import torch


def data_loader():
    batch_size = 100
    coords = torch.randint(0, 100, (batch_size, 200, 3)).int()  
    features = torch.rand((batch_size, 200, 3))  
    labels = torch.randint(0, 5, (batch_size,))  
    return coords, features, labels


###########################################################################
# Creating a Network
class ExampleNetwork(ME.MinkowskiNetwork):

    def __init__(self, in_feat, out_feat, D):
        super(ExampleNetwork, self).__init__(D)
        self.conv1 = nn.Sequential(
            ME.MinkowskiConvolution(in_channels=in_feat,
                                    out_channels=64,
                                    kernel_size=3,
                                    stride=2,
                                    dilation=1,
                                    bias=False,
                                    dimension=D),
            ME.MinkowskiBatchNorm(64),
            ME.MinkowskiReLU())
        self.conv2 = nn.Sequential(
            ME.MinkowskiConvolution(in_channels=64,
                                    out_channels=128,
                                    kernel_size=3,
                                    stride=2,
                                    dimension=D),
            ME.MinkowskiBatchNorm(128),
            ME.MinkowskiReLU())
        self.pooling = ME.MinkowskiGlobalPooling()
        self.linear = ME.MinkowskiLinear(128, out_feat)

    def forward(self, x):
        out = self.conv1(x)
        out = self.conv2(out)
        out = self.pooling(out)
        return self.linear(out)


###########################################################################
# loss and network
criterion = nn.CrossEntropyLoss()
net = ExampleNetwork(in_feat=3, out_feat=5, D=2)
print(net)

# a data loader must return a tuple of coords, features, and labels.
coords, feat, label = data_loader()
iinput = ME.SparseTensor(feat.view(-1, 3), coordinates=coords.view(-1, 3))  
# 调整维度以适配SparseTensor

# Forward
output = net(iinput)

# Loss
loss = criterion(output.F, label)
print("Loss:", loss.item())

```
运行结果（随机生成的数据，长得差不多就行）
```
.../py3-mink/lib/python3.8/site-packages/MinkowskiEngine-0.5.4-py3.8-linux-x86_64.egg/MinkowskiEngine/__init__.py:36: UserWarning: The environment variable `OMP_NUM_THREADS` not set. MinkowskiEngine will automatically set `OMP_NUM_THREADS=16`. If you want to set `OMP_NUM_THREADS` manually, please export it on the command line before running a python script. e.g. `export OMP_NUM_THREADS=12; python your_program.py`. It is recommended to set it below 24.
  warnings.warn(
ExampleNetwork(
  (conv1): Sequential(
    (0): MinkowskiConvolution(in=3, out=64, kernel_size=[3, 3], stride=[2, 2], dilation=[1, 1])
    (1): MinkowskiBatchNorm(64, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
    (2): MinkowskiReLU()
  )
  (conv2): Sequential(
    (0): MinkowskiConvolution(in=64, out=128, kernel_size=[3, 3], stride=[2, 2], dilation=[1, 1])
    (1): MinkowskiBatchNorm(128, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
    (2): MinkowskiReLU()
  )
  (pooling): MinkowskiGlobalPooling(mode=PoolingMode.GLOBAL_AVG_POOLING_PYTORCH_INDEX)
  (linear): MinkowskiLinear(in_features=128, out_features=5, bias=True)
)
Loss: 1.6283994913101196

Process finished with exit code 0

```

已成功验证的版本：

<2024.10.14> python3.8+torch1.9.0+cuda11.1.0+gcc/gxx7.5.0【官方】

<2024.10.18> python3.10+torch2.0.1+cuda11.8.0+gcc/gxx11.2.0（安装ME前加装pybind11库）

<2024.11.06>python3.8+torch1.10.2+cuda11.3.1+gcc/gxx7.5.0

......