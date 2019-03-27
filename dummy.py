#!/usr/bin/env python
""" Generate dummy data to render """
import random

headers = "a,b,MSE,rSq\n"
n = 30

with open("dummy.csv", 'w') as f:
    f.write(headers)
    
    for i in range(n):
        l = [str(random.random()) for n in range(4)]
        f.write(",".join(l) + "\n")

print("Data generated")
