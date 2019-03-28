import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

FILENAME = "newiris.csv"
HEADERS = ['a','b','c','d','class'] 

df = pd.read_csv(FILENAME, names=HEADERS)

X=df['b']
y=df['c']

def linear_regression(X, y, m_current=0, b_current=0, epochs=20, learning_rate=0.0001):
     N = float(len(y))
     print(done)
     for i in range(epochs):
          y_current = (m_current * X) + b_current
          cost = sum([data**2 for data in (y-y_current)]) / N
          m_gradient = -(2/N) * sum(X * (y - y_current))
          b_gradient = -(2/N) * sum(y - y_current)
          m_current = m_current - (learning_rate * m_gradient)
          b_current = b_current - (learning_rate * b_gradient)
     print(m_current, b_current, cost)
