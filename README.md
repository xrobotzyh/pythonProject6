# Movies ranking web JustStreamIt
[![logo_of_just_stream_it]https://user.oc-static.com/upload/2020/09/18/16004298163529_P5.png "logo_of_just_stream_it")](https://user.oc-static.com/upload/2020/09/18/16004298163529_P5.png "logo_of_just_stream_it")

## Introduction
The objective of this project is to assist an association in creating a website of movie ratings. The association envisions a web platform that showcases movie ratings sourced from a their API. The website's design and layout will be modeled after the popular streaming service, netflix.


## Quick start
### 1.Get the projet codes

Create a new virtual environment
```bash
python -m venv env
```
Clone scripts from the repository

```bash
git clone https://github.com/xrobotzyh/pythonProject6.git
```

Change to the folder
```bash
cd pythonProject6
```

### Get the OCMovies-API
Clone this repository
```bash
git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git
````
Move to the ocmovies-api root folder
```bash
cd ocmovies-api-en
````
Create a virtual environment for the project
```bash
python3 -m venv env
````
Activate the virtual environment
```bash
source env/bin/activate
````
Install project dependencies
```bash
pip install -r requirements.txt
````
Create and populate the project database with 
```bash
python manage.py create_db
````
Run the server
```bash
python manage.py runserver`
````
