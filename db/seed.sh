#!/bin/bash

for collection in collections/*.json; do
    [ -e "$collection" ] || continue
    
    file=`basename "$collection"`
    filename=$(echo $file | sed s/.json//g)

    mongoimport --uri "$MONGODB_URL" --collection "$filename" --type json --file "./collections/$filename.json" --jsonArray
done