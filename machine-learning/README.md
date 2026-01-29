# Machine Learning

**Machine Learning** (ML) is a branch of artificial intelligence where computers learn patterns from data rather than following explicit programmed instructions.

There are three main types of ML:

- **Supervised Learning**: Learning from labeled examples (e.g., training a model to classify images by showing it labeled photos)
- **Unsupervised Learning**: Finding patterns in unlabeled data (e.g., grouping similar customers together)
- **Reinforcement Learning**: Learning through trial and error with rewards (e.g., teaching an AI to play a game)

This HackPack focuses on supervised learning with **Deep Learning** (neural networks), which is particularly good at tasks like image recognition, natural language processing, and more.

## Mindset

Here are some key tips for the general mindset that you should approach ML problems with:

- Measure performance early.
- Use **pretrained models** wherever possible.
- Start with a simple model then build upon that.
- Prioritise a **reliable working model** over getting a few higher accuracy points.
- You don't always have to use Neural Networks! LightGMB and Linear Regression exist.

## Setting up

We recommend using **Google Colab** for any ML work since it offers you free access to a GPU.

### What is Google Colab?

Google Colab is a free cloud-based environment that lets you write and run Python code in your browser. It uses **Jupyter notebooks** (.ipynb files), which are different from regular Python scripts (.py files):

- **.py files** (Python scripts): Traditional code files that run from top to bottom. You execute the entire file at once.
- **.ipynb files** (Jupyter notebooks): Interactive documents divided into **cells** that you can run individually, in any order.

Think of notebooks as an interactive coding playground where you can test ideas quickly and document your work as you go.

### Getting started

1. Go to Google Colab and open a new notebook.
2. Click the arrow in the top right corner, press change runtime type and choose the **T4 GPU** as your hardware accelerator.

### Import the required libraries

```python
import torch, pandas, numpy as np, matplotlib.pyplot as plt, sklearn
from torchvision import datasets, transforms
from torch.utils.data import DataLoader,random_split
```

If there are any errors with the import then just run `!pip install <your library>`.

### Using the GPU

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
```

This allows us to take advantage of the significantly more powerful **GPU** (Graphical Processing Unit) available to us within our notebook.

## PyTorch Basics

Now that you have your environment set up, let's understand the framework we'll be using. PyTorch is a machine learning framework widely used across both industry and academia.

### Why use PyTorch

Some key advantages of PyTorch:

- Simple and intuitive API
- Automatically handles differentiation for you with autograd
- Can take advantage of GPU in 1 line of code
- PyTorch `Tensor` is compatible with NumPy arrays using `.numpy()`
- Comes with pre-trained models

### Basic datatypes in PyTorch

**`Tensor`s** are like numpy arrays. The main difference being *autograd* (automatic differentiation).

**`Module`** is a datatype that represents your neural network and provides useful abstractions. You should know about [torch.nn.Sequential](https://docs.pytorch.org/docs/stable/generated/torch.nn.Sequential.html#torch.nn.Sequential).

**`Optimizer`** is an algorithm that adjusts model parameters to minimize loss (we'll cover this in detail in the project).

### Autograd explained

Behind the scenes, PyTorch dynamically builds up a graph of all the computations that have happened so far. Autograd will track gradients for all tensors which have their `requires_grad` flag set to `True`.

To trigger backpropagation, compute the loss tensor (must be a scalar) and then call `loss.backward()`. Gradients will then accumulate in leaf nodes in the computation graph. PyTorch considers a node to be a leaf if it is not the result of a tensor operation with at least one input having `requires_grad=True`. The gradients accumulate in the `grad` attribute of leaf nodes.

The `Module` and `Optimizer` classes provide a convenient wrapper of this functionality.

If you want to find out more, see [the PyTorch autograd tutorial](https://docs.pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html).

Now that you understand the basics of PyTorch, let's put it into practice by building a real image classification model!

## The Project: IC Hack Location Classifier

In this tutorial, we'll build an **image classification model** that can identify which location at IC Hack a photo was taken in. Given an image from the event, our model will predict whether it's from:

- **Lecture Theatre** - where talks and presentations happen
- **Queen's Tower Rooms (QTR)** - one of the hackspaces
- **JCR/SCR** - the Junior and Senior Common Rooms (another two hackspaces)
- **Main Entrance** - the entry area of the venue

This is a practical example of **supervised learning** - we'll train our model on labeled photos from previous IC Hacks, and it will learn to recognize the distinctive features of each location.

You can refer to the code throughout by checking out [our sample notebook](/machine-learning/imperial_classification.ipynb).

### Transforming images

Before we can feed images into our model, we need to *transform* them. Raw images come in different sizes, formats, and pixel value ranges - we need to standardize them so our model can process them consistently.

First, we need to define how to *transform* a given image.

This transformation does three things:

1. **Resizes** all images to the same dimensions (500x500 pixels) - neural networks need consistent input sizes
2. **Converts** images to PyTorch tensors - the data format PyTorch understands
3. **Normalizes** pixel values to have specific means and standard deviations - this helps the model train more effectively by keeping values in a reasonable range

```python
transform = transforms.Compose([
    transforms.Resize((500, 500)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])
```

### Loading the dataset

We sourced these images ourselves from previous IC Hacks! (Shout-out to Chkn Media.)

The code below loads the data from our images folder, which stores each image into one of four subfolders named:

- `LECTURE_THEATRE`
- `QUEENS_TOWER_ROOMS`
- `MAIN_ENTRANCE`
- `JCR_SCR`

```python
dataset = datasets.ImageFolder(
    root="/content/images", 
    transform=transform
)
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size
train_dataset, val_dataset = random_split(dataset, [train_size, val_size])
```

### Prepare data for processing

Now we need to create **DataLoaders**, which are tools that feed data to our model in small batches. Instead of loading all images at once (which would overwhelm memory), DataLoaders serve up bite-sized groups of images for the model to process.

Key parameters:

- `batch_size=32`: Process 32 images at a time
- `shuffle=True` (training): Randomize the order to prevent the model from memorizing patterns in the sequence
- `shuffle=False` (validation): Keep validation data in consistent order for reliable testing
- `num_workers=2`: Use parallel processing to load data faster

```python
train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True, num_workers=2)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False, num_workers=2)
```

We now test our DataLoaders are working by returning the shape of a batch of images and the first five labels:

```python
images, labels = next(iter(train_loader))
images.shape, labels[:5]
```

### Defining our model

Always use **pretrained models** whenever possible, as they significantly speed up the training process.

This is why we will use `resnet18`, since it is already trained on image classification

The next step is very important. We freeze the original parameters of `resnet18`.

This is because it detects shapes, parts and higher level patterns already. We only allow the final layer to learn the specific features of our problem.

> [!NOTE]
> Freezing parameters isn't always necessary - sometimes you might want to fine-tune the entire model or just some layers. For this tutorial, freezing saves training time and works well with our limited dataset.

```python
import torch.nn as nn
import torch.optim as optim
from torchvision.models import resnet18, ResNet18_Weights

weights = ResNet18_Weights.DEFAULT
model = resnet18(weights=weights)

for param in model.parameters():
    param.requires_grad = False

NUM_CLASSES = 4
model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)

model = model.to(device)
```

### Loss function and optimiser

To train our model, we need two key components:

**Loss Function**: This measures how wrong the model's predictions are. Think of it as a score that tells the model "you're this far off from the correct answer." The goal of training is to minimize this loss. Lower loss = better predictions.

**Optimizer**: This is the algorithm that adjusts the model's parameters (weights) to reduce the loss. It figures out which direction to "nudge" each parameter to improve performance. The optimizer uses the loss to determine how to update the model.

#### Our choices

We use **cross entropy loss** because it is the most-suited for multi-class classification, and **Stochastic Gradient Descent** (SGD) as our optimiser. It is a one-size-fits-all optimiser, and it will do for this project.

We set the **learning rate** to 0.01 for now (this is relatively high), allowing our model to quickly learn the general patterns of our data.

Later on, for fine-tuning, we can set the learning rate to 0.001 or even lower.

```python
loss_fn = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(),lr=0.01,)
```

Once again, testing that this incremental change works:

```python
images, labels = next(iter(train_loader))
images, labels = images.to(device), labels.to(device)
outputs = model(images)
loss = loss_fn(outputs, labels)
loss.item()
```

### Training Loop

Each epoch while training our model is one "learning step".

Within each epoch, we perform three main stages:

#### 1. Training Phase

- Show the model all our training data
- Get its predictions
- Compare predictions to the ground truth using the loss function
- Backpropagate the loss (calculate how to adjust weights)
- Update the model's parameters (gradients)

#### 2. Validation Phase

- Set the model to evaluation mode (important!)
- Show the model our validation data
- Compare predictions to ground truth using the loss function and accuracy metrics

#### 3. Results

- Print the epoch's training and validation metrics to track the model's development

```python
def train(model, train_loader, val_loader, loss_fn, optimizer, epochs):
    for epoch in range(epochs):
        model.train()
        train_loss = 0.0
        train_correct = 0
        train_total = 0

        for images, labels in train_loader:
            images = images.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            logits = model(images)
            loss = loss_fn(logits, labels)
            loss.backward()
            optimizer.step()

            train_loss += loss.item() * images.size(0)
            preds = logits.argmax(dim=1)
            train_correct += (preds == labels).sum().item()
            train_total += labels.size(0)

        train_loss /= train_total
        train_acc = train_correct / train_total

        # validation
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images = images.to(device)
                labels = labels.to(device)

                outputs = model(images)
                loss = loss_fn(outputs, labels)

                val_loss += loss.item() * images.size(0)
                preds = outputs.argmax(dim=1)
                val_correct += (preds == labels).sum().item()
                val_total += labels.size(0)

        val_loss /= val_total
        val_acc = val_correct / val_total

        print(
            f"Epoch [{epoch+1}/{epochs}] | "
            f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.3f} | "
            f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.3f}"
        )
```

We now **execute our training function**:

```python
EPOCHS = 5
train(model, train_loader, val_loader, loss_fn, optimizer, EPOCHS)
```

### Evaluation

The most useful *visual tool* for evaluating our network is a **confusion matrix**. This will show us what classes the model will confuse for another class.

```python
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
```

First, we run our model on the **validation set** and collect all predictions and actual labels as [`NumPy`](https://numpy.org/) arrays:

```python
model.eval() 
test_preds = []
test_labels = []

with torch.no_grad():
    for images, labels in val_loader:
        images = images.to(device)
        labels = labels.to(device)

        outputs = model(images)
        preds = outputs.argmax(dim=1)

        test_preds.extend(preds.cpu().numpy())
        test_labels.extend(labels.cpu().numpy())

test_preds = np.array(test_preds)
test_labels = np.array(test_preds)
```

We can now finally plot our confusion matrix:

```python
class_names = train_dataset.dataset.classes 

cm = confusion_matrix(test_labels, test_preds)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=class_names)

disp.plot(cmap="Blues", xticks_rotation=45)
plt.title("Confusion Matrix")
plt.show()
```

### Results

> [!IMPORTANT]
> Our trained model achieved an accuracy of **80.7%**!

#### Confusion matrix

![Confusion matrix.](https://github.com/user-attachments/assets/100f9269-a1e6-47f1-9a5b-70eafa5cf499)

##### Analysis

The confusion matrix shows that it is very good at identifying a lecture theatre, the Queen's Tower Rooms and the main entrance but bad at identifying the JCR/SCR, often confusing it with the Queen's Tower Rooms, which makes sense because they look quite similar, even to humans.

These images are also quite blurry since we have limited their size, making it even more difficult to distinguish between them.

Here are a couple of the images that it got wrong:

![First incorrect image.](https://github.com/user-attachments/assets/4f53b228-1944-45ed-9ff6-885355b448c9)

![Second incorrect image.](https://github.com/user-attachments/assets/91821377-5abc-442a-a592-12f2e4b7e6cf)

And here a couple of the images of the actual Queen's Tower Rooms:

[First QTR image.](https://github.com/user-attachments/assets/dddda511-a19e-4d2f-9611-0a096db6da6d)

[Second QTR image.](https://github.com/user-attachments/assets/ade0bd65-274b-42af-990c-5b6042a1e8dd)

Clearly it is quite difficult, even for humans to distinguish between the two, so it makes sense that our model would also have trouble dealing with this.

### Saving and Loading models

#### Saving

It is important to save models once you're done so we can reuse them later:

```python
import os
os.makedirs("models", exist_ok=True)

torch.save(model.state_dict(), "models/campus_classifier.pt")
print("Model saved to models/campus_classifier.pt")
```

#### Loading

First define an empty model of the same class. Everything has to be the exact same except the actual weights and biases.
Then load the model:

```python
model = resnet18(weights=None)
model.fc = torch.nn.Linear(model.fc.in_features, 4)
model.load_state_dict(torch.load("models/campus_classifier.pt"))
model.to(device)
print("Model loaded!")
```

### Limitations of our project

Our accuracy is quite good, but there are several limitations to be aware of:

- A **small dataset**.
- An **imbalanced training set**. Ideally, you have a balanced training set to prevent model from simply taking guesses at the class with the highest population of images.
- JCR/SCR and Queen's Tower Rooms look similar, leading to common misclassifications.
- Low image resolution tradeoff. We used a low image resolution, which allows for faster compute and therefore more possible experimentation. But it comes at the cost of potentially lower performance

## Going Further

Now that you've completed a full ML project, you're ready to build your own! The best way to learn is by working on problems you're genuinely excited about. Below you'll find resources for finding datasets and deepening your ML knowledge.

### Where to find Datasets

You can find and download many datasets from Kaggle. For Reinforcement Learning, you can find environments from [gymnasium](https://gymnasium.farama.org/index.html).

### "*Help, I don't know ML!*"

For those interested in the maths behind Neural Networks, 3B1B has [some explainers](https://www.3blue1brown.com/topics/neural-networks).

For those who want to use gradient-boosted decision trees instead of Neural Networks, here are a few LightGBM tutorials:

- [Official docs](https://lightgbm.readthedocs.io/en/stable/Python-Intro.html).
- [Getting started with LightGBM and Forecasting](https://medium.com/@machine.learning.insights/getting-start-with-lightgbm-and-forecasting-91cc501e8a71).

You can also take a look at [the full list of building blocks for neural nets](https://docs.pytorch.org/docs/stable/nn.html) to explore more options.
