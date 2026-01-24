# Machine Learning

## Mindset

It is important to go into ML with the correct mindset, here are some key tips:

- Measure performance early.
- Use pretrained models wherever possible.
- Start with a simple model then build upon that.
- Prioritise a reliable working model over getting a few higher accuracy points.
- You don't always have to use Neural Networks! LightGMB and Linear Regression exist.

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
- 
### Basic datatypes in PyTorch
`Tensor`s are like numpy arrays. The main difference being autograd.

A `Module` is a datatype that basically represents your neural net and provides useful abstractions. You should know about [torch.nn.Sequential](https://docs.pytorch.org/docs/stable/generated/torch.nn.Sequential.html#torch.nn.Sequential).

An `Optimizer` is ...

### Autograd explained
Behind the scenes, PyTorch dynamically builds up a graph of all the computations that have happened so far. Autograd will track gradients for all tensors which have their `requires_grad` flag set to `True`.

To trigger backpropogation, compute the loss tensor (must be a scalar) and then call `loss.backward()`. Gradients will then accumulate in leaf nodes in the computation graph. PyTorch considers a node to be a leaf if it is not the result of a tensor operation with at least one input having `requires_grad=True`. The gradients accumulate in the `grad` attribute of leaf nodes.

The `Module` and `Optimizer` classes provide a convenient wrapper of this functionality. (...)

If you want to find out more, see [the docs](https://docs.pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html).

## Where to find Datasets

You can find and download many datasets from Kaggle. For Reinforcement Learning, you can find environments from [gymnasium](https://gymnasium.farama.org/index.html).

## Help, I don't know ML
For those interested in the maths behind Neural Networks, 3B1B has some explainers [here](https://www.3blue1brown.com/topics/neural-networks).

For those who want to use gradient-boosted decision trees instead of Neural Networks, here are LightGBM tutorials: [here](https://lightgbm.readthedocs.io/en/stable/Python-Intro.html) and [here](https://medium.com/@machine.learning.insights/getting-start-with-lightgbm-and-forecasting-91cc501e8a71).

Below are some common choices for metrics and layers. The full list of building blocks for neural nets can be found [here](https://docs.pytorch.org/docs/stable/nn.html). 

### Layers

### Testing metrics

### Training Loop

### Evaluation metrics

### Optimizers

## Pretrained models
links to YOLO, resnet, etc.
