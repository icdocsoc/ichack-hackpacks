# Django Backend HackPack

This guide walks you through setting up a local **Django** backend for a simple hackathon project (in this case, it's a notes app). You'll learn how to install Python and Django on Windows/Mac/Linux, create a Django project and app, configure the built-in **SQLite** database, and use the **Django REST Framework (DRF)** to build a basic CRUD API.

- **What is Django?** Django is *"a high-level Python web framework that encourages rapid development and clean, pragmatic design"*. It lets you build web applications quickly, handling many common tasks (like database access and routing) for you.
- **What is Django REST Framework?** DRF is *"a powerful and flexible toolkit for building Web APIs"*. It makes it easy to expose your data (e.g. notes) as JSON over HTTP so that any frontend (mobile app, web UI, etc.) can use it.
- **Local deployment:** All steps below target running Django on your own machine. We'll use **SQLite** (the default database), which requires no extra installation. No cloud or complex servers are needed.

## Prerequisites & Setup

1. **Install Python (3.8+).**

    - **Windows:** Download from [python.org](https://www.python.org/). Run the installer and check *"Add Python to PATH"*.
    - **macOS:** Python 3 is often pre-installed. If not, use *Homebrew* (`brew install python3`) or download from python.org.
    - **Linux (Ubuntu/Debian):** Use your package manager. For example:

    ```bash
        sudo apt update
        sudo apt install python3 python3-pip
    ```

2. **Verify installation** by running `python3 --version` and `pip3 --version` (should show Python 3.x).

3. **Create a virtual environment.** This keeps project dependencies isolated, so packages you install for this project won't conflict with other Python projects on your machine. From your project folder, run:

    ```bash
        python3 -m venv venv
        # Activate it:
        # Windows: 
        venv\Scripts\activate
        # macOS/Linux:
        source venv/bin/activate
    ```

4. **Install Django and DRF.** With Python ready, install the required packages via `pip`:

    ```bash
    pip install django djangorestframework
    ```

## Creating a Django Project and App

In Django, a **project** is your entire web application, while an **app** is a self-contained module that handles one specific feature (like notes, user accounts, etc.). A project can contain multiple apps.

1. **Start a new project.** In your terminal, choose an empty folder for the project and run:

    ```bash
    django-admin startproject myproject
    # Change to the created directory 
    cd myproject  
    ```

2. **Start a new app.** Inside the project directory, run:

    ```bash
        python manage.py startapp notesapp
    ```

3. **Register the app.** Django needs to know about your app before it can use it. Open `myproject/settings.py` and add your new app (and DRF) to the `INSTALLED_APPS` list:

    ```python
        INSTALLED_APPS = [
            ...,
            'rest_framework',   # enable Django REST Framework
            'notesapp',         # our app (replace with your app name)
            ...
        ]
    ```

## Database Setup (SQLite)

Django uses SQLite by default for simple projects. To create the database and tables, run migrations. **Migrations** are Django's way of syncing your Python code with the database structure. They translate your models into actual database tables:

```bash
    python manage.py migrate
```

> ✅ **Checkpoint:** After running this, you should see a new `db.sqlite3` file in your project folder. This is your database!

## Building a Simple CRUD API (Notes)

**CRUD** stands for **C**reate, **R**ead, **U**pdate, **D**elete—the four basic operations you can do with data. A **REST API** lets other applications (like a mobile app or website) perform these operations over HTTP by sending requests to specific URLs (called *endpoints*).

Let's create a simple **Notes app** with `title` and `content` fields, exposed via a REST API.

1. **Define the model.** A *model* defines the structure of your data—think of it as a blueprint for a database table. Each field becomes a column. In `notesapp/models.py`, add a `Note` model:

    ```python
        from django.db import models

        class Note(models.Model):
            title = models.CharField(max_length=100)
            content = models.TextField()
            created_at = models.DateTimeField(auto_now_add=True)

            def __str__(self):
                return self.title
    ```

    This creates a `notesapp_note` table (after migrating) with `id`, `title`, `content`, and `created_at` columns.

2. **Create and apply migrations.** After saving the model, you need to tell Django to update the database. `makemigrations` creates a migration file describing the changes, and `migrate` applies them:

    ```bash
        python manage.py makemigrations
        python manage.py migrate
    ```

    > ✅ **Checkpoint:** You should see output mentioning the creation of the `Note` model.

3. **Register in Admin.** Django comes with a built-in admin panel where you can view and edit your data without writing any frontend code. Register the model in `notesapp/admin.py`:

    ```python
        from django.contrib import admin
        from .models import Note
        admin.site.register(Note)
    ```

4. **Create a serializer.** When your API sends data to a browser or app, it needs to be in a format they can understand (usually **JSON**). A *serializer* handles this conversion. It turns Python objects into JSON (and vice versa). In `notesapp` folder create a file `serializers.py` and add:

    ```python
    from rest_framework import serializers
    from .models import Note

    class NoteSerializer(serializers.ModelSerializer):
        class Meta:
            model = Note
            fields = ['id', 'title', 'content', 'created_at']
    ```

5. **Create a ViewSet.** A *view* handles incoming requests and returns responses. A `ViewSet` bundles all the CRUD operations together, so you don't have to write separate functions for listing, creating, updating, and deleting. In `notesapp/views.py`, add:

    ```python
        from rest_framework import viewsets
        from .models import Note
        from .serializers import NoteSerializer

        class NoteViewSet(viewsets.ModelViewSet):
            queryset = Note.objects.all()
            serializer_class = NoteSerializer
    ```

    A `ModelViewSet` provides all CRUD operations (list, retrieve, create, update, delete) automatically.

6. **Configure URLs.** URLs define the *endpoints* of your API—the addresses where clients send requests. A *router* automatically generates standard REST URLs for your ViewSet (like `/api/notes/` for listing and `/api/notes/1/` for a specific note). Create `notesapp/urls.py` and set up a router:

    ```python
        from django.urls import path, include
        from rest_framework.routers import DefaultRouter
        from .views import NoteViewSet

        router = DefaultRouter()
        router.register(r'notes', NoteViewSet)

        urlpatterns = [
            path('api/', include(router.urls)),
        ]
    ```

    Then include this in the project's `urls.py` (`myproject/urls.py`):

    ```python
        from django.contrib import admin
        from django.urls import path, include

        urlpatterns = [
            path('admin/', admin.site.urls),
            path('', include('notesapp.urls')),  # include our app's URLs
        ]
    ```

    Now the API will be accessible under `/api/notes/`.

7. **Run the server.** Start Django's development server:

    ```bash
        python manage.py runserver
    ```

    Go to [http://127.0.0.1:8000/api/notes/](http://127.0.0.1:8000/api/notes/) in your browser. You should see a list (likely empty) and a form to create new notes.

    > ✅ **Checkpoint:** Try creating a note using the form at the bottom of the page! Fill in a title and content, then click POST. Your note should appear in the list above.

    It should look as follows:
    ![webpage image](images/image.png)
