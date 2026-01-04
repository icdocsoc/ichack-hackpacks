# Git & Github

In this guide, we wlll cover the basics for git, useful features on github, and some advice for using them as a team.

## What is Git? What is the point?

Git is a popular version control system. Git is often used to work on code with others. Git also allows you to save an entire history of your codebase, go back to points in history, selectively undo changes and more. Git stores this information in the `.git` folder.

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

You can download Git for free from [git-scm.com](git-scm.com). You will need to enter your email after installation.

Afterwards, you will be able to use Git from your terminal or command prompt.

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
### 2. Make a commit

After you have cloned the repo, make some changes. You can then stage these changes using `git add .` which will stage all your changes. Then you can run `git commit -m "example commit message"` which will save your changes locally.

If you do not want to commit all your changes, `git add` can be used selectively to add only files you are interested in. You can also add certain file extensions and folders to a `.gitignore` file to ensure they are never tracked.

You can use `git status` at any time to check the state of your working directory and see which files are modified, staged, or untracked.

### 3. Pushing and pulling

Before working with a remote repository, it’s important to ensure that your local clone is up to date. Running `git pull` updates your current local branch by fetching and merging the latest commits from the corresponding remote branch on GitHub.

After you have implemented a feature or fixed a bug, you should upload your local commits to the remote repository. Running `git push` sends all commits from your local branch to the corresponding branch on the remote.

> **Top Tip:**
> Make sure to run `git pull` everytime before you run `git push` to ensure your local branch is up to date and most importantly to avoid merge conflicts!

### 4. Checkout and Branch
Branches allow you to work on new features or bug fixes without affecting the main codebase. This makes collaboration safer and more organized.

To see all available branches, you can run `git branch`. Branches name will be shown and the one you are checking out right now will be highlighted with an asterisk (`*`)

To create and switch to a new branch, run `git checkout -b branch-name` to create a new branch and immediately checks it out. If you only wants to create a new branch without switching to it, run `git branch branch-name` instead.

If you want to switch to any existing branch, run `git checkout branch-name`. 

Sometimes git might block your checkout if you have uncommitted changes that would be overwritten and shows 

```bash
error: Your local changes to the following files would be overwritten by checkout
```
If you want to switch branches and recieved this error, you can:

**1. Commit your change**
This is straightforward as you just commit all your changes to remote. 
```bash
git add .
git commit -m "your commit message"
```
**2. Stash your changes**
If you don't want to commit your changes yet but still want to save your progress, you can stash your change. **Stashing** means git saves your changes on a stack and temporally revert all the changes so that you can switch branches or do other changes safely. 
```bash
git stash #This will save your progress
git checkout branch-name
git stash pop #If you want to retrieve your progress, you can pop it out from the stack
```

**3. Discard your change (irreversible)**
If you somehow wants to discard all the changes you made, you can:
```bash
git reset --hard
```

### 5. Merge branches
Once your work on a branch is complete and tested, you can merge it back into another branch (usually main or master).

![Diagram of merging branch.](assets\merging.png)

```bash
git checkout main                   #First, switch to the branch you want to merge into
git pull                            #Make sure it is up to date before merging
git merge feature-branch-name       #Then merge your feature branch into main
```
If there are no conflicts, Git will automatically complete the merge. If conflicts occur, Git will prompt you to resolve them manually before completing the merge. If you are using any IDE like VS code, they usually provide a conflict editor.
After all conflicts are resolved, your branch will now be successfully merged into main.
After a successful merge, you can optionally delete the feature branch:
```bash
git branch -d feature-branch-name
```

Alternatively, you can use **Pull Requests** on GitHub to merge branches into main. This is considered best practice, as it allows teammates to review the changes, provide feedback, and approve the merge before it is completed.

## Useful Features

## How to use Git as a team?

## Useful links

- [dangitgit](https://dangitgit.com/en) and [Oh Shit, Git!?!](https://ohshitgit.com/) are good places to go if something has gone terribly wrong.
- [Learn Git Branching](https://learngitbranching.js.org/) is a visual gamified way to learn git.
- [Setting up an SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) is a way to make authentication easier when pushing commits.
