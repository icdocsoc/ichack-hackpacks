from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    with open("/etc/hostname") as file:
        return "Hello! Running on " + file.read()
