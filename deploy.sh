#!/bin/bash

echo $DEPLOYMENT_SOURCE
echo $DEPLOYMENT_TARGET

eval npm install -g yarn
cd $DEPLOYMENT_TARGET
eval yarn install --prod
