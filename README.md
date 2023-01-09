# TJTS5901 Course Template Project

This is the template for 2023 TJTS5901 Continuous Software Engineering -course.

Sisu: <https://sisu.jyu.fi/student/courseunit/otm-38b7f26b-1cf9-4d2d-a29b-e1dcb5c87f00>
Moodle: <https://moodle.jyu.fi/course/view.php?id=20888>

## Start the app

Repository provides an `docker-compose` file to start the app:

```sh
docker-compose up --build tjts5901
```

App can be also started from `Dockerfile`, with flask debug turned on, and current folder in editable mode. It has the benefit of automatically reflecting code changes in the app.

```sh
docker build -t tjts5901 .
docker run -it -p 5001:5001 -e "FLASK_DEBUG=1" -v "${PWD}:/app" tjts5901
```

Please see the `docs/tjts5901` folder for more complete documentation.
