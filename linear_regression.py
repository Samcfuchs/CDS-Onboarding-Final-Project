import numpy as np
import pandas as pd

# Get data
data = pd.read_csv('iris.csv')
X = data['SepalLengthCm']
Y = data['SepalWidthCm']

X_data = X.to_numpy()
Y_data = Y.to_numpy()

# calculate means and n
x_mean = sum(X_data) / len(X_data)
y_mean = sum(Y_data) / len(Y_data)
n = min(np.size(X_data), np.size(Y_data))

# initialize weights and set hyperparameters
a, b = 0, 0
iterations = 2000
learning_rate = 0.005

# clear output file
with open('data.csv', mode = 'w') as f:
    f.write('a,b,MSE\n')

# run gradient descent
with open('data.csv', mode = 'a') as f:
    for i in range(iterations):
        # calculate gradients
        a_gradient = (sum(-2 * X_data * (Y_data - (a * X_data + b)))) / n
        b_gradient = (sum(-2 * (Y_data - (a * X_data + b)))) / n

        # update weights
        a -= a_gradient * learning_rate
        b -= b_gradient * learning_rate

        # calculate cost
        MSE = (sum(Y_data - (a * X_data + b)) ** 2) / n

        # write data to file
        line = ','.join([str(b), str(a), str(MSE)]) + '\n'
        f.write(line)
