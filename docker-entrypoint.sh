#!/bin/sh
nginx &
exec java -jar /app/app.jar
