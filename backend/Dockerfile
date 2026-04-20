FROM python:3.13-slim
# Creates and positionates inside the newly created /backend folder
WORKDIR /backend
# Prevents python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE=1
# Forces python to send logs and errors directly to the console
ENV PYTHONUNBUFFERED=1

RUN pip install --upgrade pip

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /backend/entrypoint.sh

EXPOSE 8001

# CMD ["python",  "manage.py", "runserver", "0.0.0.0:8001"]
