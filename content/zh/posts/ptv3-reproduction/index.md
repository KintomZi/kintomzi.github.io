---
title: "PointTransformer V3 复现记录"
_title: "PointTransformer V3 Reproduction Record"
date: 2026-06-10T21:30:00+08:00
categories: ["tech"]
---

> 环境搭建见：[PointTransformer V3 环境搭建记录](../ptv3-env-setup)

## 参考库

- 官方：https://github.com/Pointcept/Pointcept
- 其他：
  - https://github.com/Gofinge/Pointcept
  - https://github.com/letatanu/Pointcept 
  - https://github.com/hlylove/3D-CV 
  - [更多 fork...](https://github.com/search?q=pointcept&type=repositories&s=updated&o=desc)

## 文件名参数

所有配置文件在 `./Pointcept/configs/` 中，命名规范：

```
{task}-{model}-{version_meta}-{variant_id}-{protocol}.py
```

以 `semseg-pt-v3m1-0-base.py` 为例：

| 字段 | 说明 | 示例 |
|------|------|------|
| task | 任务类型 | `semseg`, `insseg`, `cls`, `partseg`, `pretrain`, `distill` |
| model | 模型架构 | `pt`/`ptv2`/`ptv3`, `minkunet34c`, `utonia`, ... |
| version_meta | 版本号 `v{major}m{minor}` | `v1m1`, `v3m2` |
| variant_id | 变体编号 | `-0`, `-1`, `-0a`, `-2c` |
| protocol | 训练协议 | `base`, `rpe`, `ft`, ... |

---

**>>>>>>>> 以下内容围绕 `semseg-pt-v3m1-0-base.py` 展开 <<<<<<<<**

## 现有数据集

数据集导入两种方式：

- 将数据集放到 `./Pointcept/data/` 下
- 在`./Pointcept/configs/Dataset_name/xxx.py`文件中修改 `data_root`

训练（成功运行会产生 `./Pointcept/exp`）：

```bash
sh scripts/train.sh -g 2 -d carlas2s -c semseg-pt-v3m1-0-base -n semseg-pt-v3m1-0-base
```

测试（==启动时间很长，需耐心等待==）：

```bash
sh scripts/test.sh -g 2 -d carlas2s -c semseg-pt-v3m1-0-base -n semseg-pt-v3m1-0-base -w model_best
```

### 测试爆显存解决方案

- 输入测试命令前执行：
  ```bash
  export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
  ```
- 打开 `empty_cache=True`
- 修改 `test_cfg` 下的 `aug_transform`，减少部分 fragment
- 调整 `grid_size`（==不推荐==，会导致与训练阶段不符）

## 参数微调

### 文件头

```python
_base_ = ["../_base_/default_runtime.py"]
# 继承 configs/_base_/default_runtime.py 的全部变量
```

### 训练超参

| 参数 | 说明 |
|------|------|
| `batch_size` | 所有 GPU 的总 batch size，多卡时每卡必须整除。值越大梯度越稳定，显存消耗越大 |
| `num_worker` | DataLoader 总进程数。太小 GPU 等数据，太大 CPU 内存压力大 |
| `mix_prob` | 以 mix_prob×100% 概率把两个场景的点云拼接到一起 |
| `empty_cache` | 每处理完一个 test fragment 后释放缓存，减少碎片但略慢 |
| `empty_cache_per_epoch` | 每个 epoch 结束后清理一次显存缓存 |
| `enable_amp` | 自动混合精度训练/推理 |
| `amp_dtype` | 混合精度的数据类型 |
| `clip_grad` | 梯度裁剪的最大范数值 |
| `ignore_index` | 忽略标签，标注为 -1 的点不参与损失计算 |
| `names` | 类别名称列表，`len(names)` 即为 `num_classes` |
| `grid_size` | 体素网格边长（米）。小→细节多→显存大，大→细节少→显存小 |

### 模型

除 `in_channels` 外不推荐改动，与 `semseg-pt-v3m1-0-base` 绑定：

```python
model = dict(
    type="DefaultSegmentorV2",
    num_classes=len(names),
    backbone_out_channels=64,
    backbone=dict(
        type="PT-v3m1",
        in_channels=3,  # 输入特征通道数
        order=("z", "z-trans", "hilbert", "hilbert-trans"),
        stride=(2, 2, 2, 2),
        enc_depths=(2, 2, 2, 6, 2),
        enc_channels=(32, 64, 128, 256, 512),
        enc_num_head=(2, 4, 8, 16, 32),
        enc_patch_size=(1024, 1024, 1024, 1024, 1024),
        dec_depths=(2, 2, 2, 2),
        dec_channels=(64, 64, 128, 256),
        dec_num_head=(4, 4, 8, 16),
        dec_patch_size=(1024, 1024, 1024, 1024),
        mlp_ratio=4,
        qkv_bias=True,
        qk_scale=None,
        attn_drop=0.0,
        proj_drop=0.0,
        drop_path=0.3,
        shuffle_orders=True,
        pre_norm=True,
        enable_rpe=False,
        enable_flash=True,  # 是否使用 Flash Attention
        upcast_attention=False,
        upcast_softmax=False,
        enc_mode=False,
        pdnorm_bn=False,
        pdnorm_ln=False,
        pdnorm_decouple=True,
        pdnorm_adaptive=False,
        pdnorm_affine=True,
        pdnorm_conditions=("ScanNet", "S3DIS", "Structured3D"),
        # PDNorm 根据数据集名称动态适配，不在列表中则退化回普通 Norm
    ),
    criteria=[
        dict(type="CrossEntropyLoss", loss_weight=1.0, ignore_index=-1),
        dict(type="LovaszLoss", mode="multiclass", loss_weight=1.0, ignore_index=-1),
    ],
)
```

### 优化器与学习率

```python
epoch = 300
optimizer = dict(type="AdamW", lr=0.006, weight_decay=0.05)
scheduler = dict(
    type="OneCycleLR",
    max_lr=[0.006, 0.0006],
    pct_start=0.05,
    anneal_strategy="cos",
    div_factor=10.0,
    final_div_factor=1000.0,
)
param_dicts = [dict(keyword="block", lr=0.00006)]
```

### 数据集配置

```python
dataset_type = "数据集的 Python 类名"  # @DATASETS.register_module() 注册的类
data_root = "数据根目录"               # DefaultDataset 自动找 train/test 子目录
```

如果 `in_channels` 需要更多输入特征，需分别修改 train/val/test 下 `Collect` 的 `feat_keys`：

```python
data = dict(
    num_classes=len(names),
    ignore_index=ignore_index,
    names=names,
    train=dict(type=dataset_type, split="train", data_root=data_root,
               transform=[...], test_mode=False),
    val=dict(type=dataset_type, split="test", data_root=data_root,
             transform=[...], test_mode=False),
    test=dict(type=dataset_type, split="test", data_root=data_root,
              transform=[...], test_mode=True, test_cfg=dict(...)),
)
```

### Transform 参考

train.transform 数据增强链：`CenterShift` → `RandomDropout` → `RandomRotate`(z/x/y) → `RandomScale` → `RandomFlip` → `RandomJitter` → `ChromaticAutoContrast` → `ChromaticTranslation` → `ChromaticJitter` → `GridSample` → `SphereCrop` → `CenterShift` → `NormalizeColor` → `ToTensor` → `Collect`

test.test_cfg 测试增强：`GridSample` + 多组 `aug_transform`（多尺度 + flip 组合），每组独立测试后合并投票。

### aug_transform
同一个场景，做多种不同的几何扰动（缩放、旋转、翻转），分别输入模型得到多份预测，最后投票/平均取 argmax

==虽然这样的精度更加准确，但代价是推理时间 ×N 和内存 ×N，推理时完全可以用 aug_transform 中只保留最原始那一条（不做任何变换）==
```python
aug_transform=[
    [dict(type="RandomScale", scale=[0.9, 0.9])],
    [dict(type="RandomScale", scale=[0.95, 0.95])],
    [dict(type="RandomScale", scale=[1, 1])],
    [dict(type="RandomScale", scale=[1.05, 1.05])],
    [dict(type="RandomScale", scale=[1.1, 1.1])],
    [dict(type="RandomScale", scale=[0.9, 0.9]), dict(type="RandomFlip", p=1)],
    [dict(type="RandomScale", scale=[0.95, 0.95]), dict(type="RandomFlip", p=1)],
    [dict(type="RandomScale", scale=[1, 1]), dict(type="RandomFlip", p=1)],
    [dict(type="RandomScale", scale=[1.05, 1.05]), dict(type="RandomFlip", p=1)],
    [dict(type="RandomScale", scale=[1.1, 1.1]), dict(type="RandomFlip", p=1)],
],
```

## 自定义数据集

需要添加或调整 4 个文件/目录：

| 文件                                                                            | 用途 |
|-------------------------------------------------------------------------------|------|
| `./Pointcept/pointcept/datasets/preprocessing/DatasetName/preprocess_name.py` | 数据预处理 |
| `./Pointcept/pointcept/datasets/DatasetName.py`                                         | 模型数据加载逻辑 |
| `./Pointcept/pointcept/datasets/__init__.py`                                            | 数据集导入声明 |
| `./Pointcept/configs/DatasetName/model_param.py`                                        | 模型参数配置 |

通过`preprocess_name.py`处理后的文件会将属性分开，例如`coords`、`semantic`、`intensity`...

`DatasetName.py`用来加载标签（e.g. 控制标签范围），属性操作等逻辑