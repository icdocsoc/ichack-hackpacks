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
import torch, pandas, numpy as np, matplotlib.pyplot as plt, sklearn
from torchvision import datasets, transforms
from torch.utils.data import DataLoader,random_split
```

If there are any errors with the import then just use ```!pip install <your library> ```

### Using the GPU

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
```
## Loading the dataset

We sourced these images from previous IC Hacks

First we need to define how to transform a given image

This resizes the images, converts them to pytorch tensors and then normalises the pixel values to have a mean of 0.5 and a standard deviation of 0.5 for each channel

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
Now we will write the code to load the dataset

This loads the data from our images folder, which stores 4 subfolders named: 

- LECTURE_THEATRE
- QUEENS_TOWER_ROOMS
- MAIN_ENTRANCE
- JCR_SCR

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

```python
train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True, num_workers=2)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False, num_workers=2)
```

Test that it is working:

```python
images, labels = next(iter(train_loader))
images.shape, labels[:5]
```
## Model definition

Always use pretrained models whenever possible.
This is why we will use resnet18, since it is already trained on image classification
The next step is very important. We freeze the original parameters of resnet18.
This is because it detects shapes, parts and higher level patterns already. We only allow the final layer to learn the very specific stuff.
This is not necessarily always done.

```python
import torch.nn as nn
import torch.optim as optim
from torchvision.models import resnet18, ResNet18_Weights
```
Defining the model:
We create a resnet18 model
Freeze the initial parameters.

```python
weights = ResNet18_Weights.DEFAULT
model = resnet18(weights=weights)

for param in model.parameters():
    param.requires_grad = False

NUM_CLASSES = 4
model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)

model = model.to(device)
```
## Loss function and optimiser

We use cross entropy loss because it is the one that is used for multi-class classification. 
We use Stochastic Gradient Descent (SGD) as our optimiser. It is a one-size-fits-all optimiser, and it will do for this project.
We set the learning rate to 0.01 for now, since it is quite a high one, allowing our model to quickly learn the general patterns.
Later on, for fine-tuning, we can set the learning rate to 0.001 or even lower.

```python
loss_fn = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(),lr=0.01,)
```

Test that it works
```python
images, labels = next(iter(train_loader))
images, labels = images.to(device), labels.to(device)
outputs = model(images)
loss = loss_fn(outputs, labels)
loss.item()
```

## Training Loop

Each epoch is one "learning step"
Within each epoch, we:

- Show the model all our training data
- Get its predictions
- Compare it to the ground truth using the loss function
- Backpropogate the loss
- Change the gradients
We also do some testing (known as validation)
- Very important to set the model to evaluation mode
- Show the model our validation data
- Compare it to ground truth using loss function and maybe an accuracy calculation
Finally:
- Print the results of the epoch, to see the model's development

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

Executing the training:

```python
EPOCHS = 5
train(model, train_loader, val_loader, loss_fn, optimizer, EPOCHS)
```

### Evaluation

Probably the most useful tool for this is a confusion matrix. This will show us what classes the model will confuse for another class.
```python
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
```

Getting the predictions and the ground truth into an easy to use form:

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
Getting the confusion matrix:

```python
class_names = train_dataset.dataset.classes 

cm = confusion_matrix(test_labels, test_preds)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=class_names)

disp.plot(cmap="Blues", xticks_rotation=45)
plt.title("Confusion Matrix")
plt.show()
```

The results for our trained model:


### Accuracy: 80.7%

### Confusion matrix:

<img width="957" height="582" alt="image" src="https://github.com/user-attachments/assets/100f9269-a1e6-47f1-9a5b-70eafa5cf499" />

This shows that it is very good at identifying a lecture theatre, the Queen's Tower Rooms and the main entrance but bad at identifying the JCR/SCR, often confusing it with the Queen's Tower Rooms, which makes sense because they look quite similar, even to humans.
These images are also quite blurry since we have limited their size, making it even more difficult to distinguish between them.
Here are a couple of the images that it got wrong:

<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/4f53b228-1944-45ed-9ff6-885355b448c9" />
<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/91821377-5abc-442a-a592-12f2e4b7e6cf" />

And here a couple of the images of the actual Queen's Tower Rooms:

<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/dddda511-a19e-4d2f-9611-0a096db6da6d" />
<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/ade0bd65-274b-42af-990c-5b6042a1e8dd" />

Clearly it is quite difficult, even for humans to distinguish between the two, so it makes sense that our model would also have trouble dealing with this.

## Saving and Loading models

### Saving
It is important to save models once you're done so as to not lose them:

```python
import os
os.makedirs("models", exist_ok=True)

torch.save(model.state_dict(), "models/campus_classifier.pt")
print("Model saved to models/campus_classifier.pt")
```
### Loading
First define an empty model of the same class. Everything has to be the exact same except the actual weights and biases.
Then load the model:

```python
model = resnet18(weights=None)
model.fc = torch.nn.Linear(model.fc.in_features, 4)
model.load_state_dict(torch.load("models/campus_classifier.pt"))
model.to(device)
print("Model loaded!")
```

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
