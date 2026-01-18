# Machine Learning

## Mindset

It is important to go into ML with the correct mindset, here are some key tips:

- Measure performance early.
- Use pretrained models wherever possible.
- Start with a simple model then build upon that.
- Prioritise a reliable working model over getting a few higher accuracy points.
- You don't always have to use Neural Networks! LightGMB and Linear Regression 

This tutorial focuses on Deep Learning.

## Setting up

We recommend using Google colab for any ML work since it offers you free access to a GPU.

1. Go to google colab and open a new notebook.
2. Click the arrow in the top right corner, press change runtime type and choose the T4 GPU as your hardware accelerator.


### Import the required libraries

```python
import torch, pandas, numpy as np, matplotlib.pyplot as plt, scikit-learn
```

If there are any errors with the import then just use ```!pip install <your library> ```


## PyTorch

### Why use PyTorch

PyTorch is a machine learning framework widely used across both industry and academia. Some perks of PyTorch are as follows:
- Simple.
- Automatically handles differentiation for you with autograd.
- Can take advantage of GPU in 1 line of code.
- PyTorch `Tensor` compatible with numpy arrays, using `.numpy()`.
- Comes with pre-trained models.

### Autograd explained
.backward() and zeroing gradients, 4 key attributes of nodes in the computation graph.

### Basic datatypes in PyTorch
Tensors, Module, etc.

## Where to find Datasets

You can find and download many datasets from Kaggle. For Reinforcement Learning, you can find environments from [gymnasium](https://gymnasium.farama.org/index.html).

## Help, I don't know ML
For those interested in the maths behind Neural Networks, 3B1B has some explainers [here](https://www.3blue1brown.com/topics/neural-networks).

For those who want to use gradient-boosted decision trees instead of Neural Networks, here are LightGBM tutorials: [here](https://lightgbm.readthedocs.io/en/stable/Python-Intro.html) and [here](https://medium.com/@machine.learning.insights/getting-start-with-lightgbm-and-forecasting-91cc501e8a71).

Below are some common choices for metrics and layers.

### Testing metrics

### Training Loop

### Evaluation metrics

### Optimizers

## Pretrained models
links to YOLO, resnet, etc.
