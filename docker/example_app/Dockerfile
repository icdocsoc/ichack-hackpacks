FROM python:latest

WORKDIR /var/app/

COPY main.py ./

RUN pip install gunicorn flask

EXPOSE 8000

CMD ["gunicorn", "main:app", "-b", "0.0.0.0:8000"]
