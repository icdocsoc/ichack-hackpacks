# Git & Github

In this guide, we wlll cover the basics for git, useful features on github, and some advice for using them as a team.

## What is Git?

Git is a popular version control system that is often used to work with others. 

### Key Git Concepts

- **Repository**: A folder where Git tracks your project and its history.
- **Clone**: Make a copy of a remote repository on your computer.
- **Stage**: Tell Git which changes you want to save next.
- **Commit**: Save a snapshot of your staged changes.
- **Branch**: Work on different versions or features at the same time.
- **Merge**: Combine changes from different branches.
- **Pull**: Get the latest changes from a remote repository.
- **Push**: Send your changes to a remote repository.

### How to Install

You can download Git for free from [git-scm.com](git-scm.com).

After installation, you will be able to use Git from your terminal or command prompt.

## Git Basics

This section covers the most common Git commands you’ll use during the hackathon. You don’t need to know everything—just enough to collaborate smoothly.

### 1. Create or Clone a Repository

To start off, you can create a new repository on github and share it with your teammates.

1. Go onto the main page of the repository and click `<> Code`. Then, copy the url for the repository.
![Screenshot of <>Code.](assets\https-url-clone-cli.png)

2. Open Git Bash.

3. Change the current working directory to the location where you want the cloned directory.

4. Type git clone, and then paste the URL you copied earlier.

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
```
5. Press Enter to create your local clone.
```bash
$ git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
> Cloning into `Spoon-Knife`...
> remote: Counting objects: 10, done.
> remote: Compressing objects: 100% (8/8), done.
> remove: Total 10 (delta 1), reused 10 (delta 1)
> Unpacking objects: 100% (10/10), done.
```
### 2. Check Repository Status

## Useful Features

## How to use Git as a team?