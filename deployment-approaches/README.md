# Deployment

## Why do we need deployment?

During development, your project will typically run on a **local port** of your computer: **`localhost`** (e.g. `http://localhost:5173`).
But this setup works **only on your own machine**.

Other people:

- cannot see your website,
- cannot test it,
- cannot judge your project properly.

**Deployment makes your app, website, or other environment public** — accessible via a real URL that anyone can open.

If your project is not deployed, it might seem to the judges that your project is unfinished.

## Deployment approaches (in increasing difficulty)

We will cover three common approaches, from easiest to hardest:

- Local hosting (temporary, fastest)
- 3rd-party deployment services (still fast , long-term)
- Personal server with NGINX (advanced, long-term)

## Local hosting

This approach runs your app on your own laptop and exposes it to the internet.

> [!WARNING]  
> This is not production-grade, but very useful for quick demos!

Assume you have a website running on your `http://localhost:3000`, it doesn't matter whether this is a DEV version of your
server, `DOCKER EXPOSE` or something else.

Now you can use *Tunneling Tools* to create a *temporary public URL* that forwards traffic to your local machine.

![img.png](assets/img.png)
Popular options are:

- Ngrok [NGrok website](https://ngrok.com/)
- Cloudflare tunnel [CF tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/)

To use NGrok , first you need to set up an account by the link above. Then install it using:

```bash
brew install ngrok
```

Run the following command to add your authtoken to the default ngrok.yml configuration file.

```bash
ngrok config add-authtoken 1fmR26pVL0b5HM7AAYenEfavBE8_2X5Y6pvELCH7ezvu9R6r5
```

Deploy the app (3000 is port you want to make public):

```bash
ngrok http 3000
```

After the command you will see a terminal status window with current connections and your website link!
![img.png](assets/ngrok-status.png)

> [!CAUTION]
> If you close your laptop, the site goes down  
> If your internet disconnects, the site goes down  
> URLs may change on restart

## 3rd-party deployment services

The workflow looks like this:
You push code → service builds → service hosts → you get a stable public URL.

### **Vercel**

[Vercel](https://vercel.com/) is a platform for deploying **frontend web applications** and **static sites**.
It is one of the easiest ways to make a project publicly accessible.

![img.png](assets/vercel.png)
Vercel can deploy:

- **Static frontend builds** (HTML, CSS, JavaScript)
- **Single-page applications** (React, Vue, Svelte, etc.)
- Frontend projects that produce a **build output directory**

Vercel is **not meant** for heavy backend logic or long-running servers.

---

#### Prerequisites

- A Vercel account (GitHub login works)
- Your project can be **built locally** (i.e. it produces static files)

---

#### Deploy using `vercel --yes` (fastest way)

From your **frontend project directory** (where `package.json` is located):

```bash
npm install -g vercel
vercel login
vercel --yes
```

This command automatically generates a new project which:

- detect a frontend project
- run build command
- deploys static files
- Generates a public URL

You'll see output similar to

```bash
https://your-project-name.vercel.app
```

No configuration files required.

If you want to make a change to the project, just run the command again:

```bash
vercel --yes
```

### Render

[Render](https://render.com/) is a hosted platform that can run your backend as a **web service**
(API) or host a **static site**. It supports **native runtimes** (like Python) and **Docker-based deployments**.

---

Render’s **Free web services spin down after ~15 minutes with no inbound traffic**,
then “wake up” on the next request (cold start delay).

Render will ask for:

- **Build Command** (install deps)
- **Start Command** (run server)

For something like Python it will look like:

#### Typical Build Command

```bash
pip install -r requirements.txt
```

#### Typical Start Command

```bash
pip install -r requirements.txt
```

- FastAPI:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

> [!TIP]
> Use environment variables for secrets, redeploy after changes, and always assume free-tier services can restart or sleep at any time.

> [!WARNING]
> Some 3rd party services might charge you money depending on the plan you choose! Check autoscaling rules before advertising your project!
