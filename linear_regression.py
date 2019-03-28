import numpy as np
import pandas as pd

# Get data
data = pd.read_csv('kc_house_data.csv')
data.dropna()
X = data['sqft_living']
Y = data['price']

X_data = X.to_numpy()
Y_data = Y.to_numpy()

X_data = X_data / 1000.0
Y_data = Y_data / 1000.0

# calculate means and n
x_mean = sum(X_data) / len(X_data)
y_mean = sum(Y_data) / len(Y_data)
n = min(np.size(X_data), np.size(Y_data))

# initialize weights and set hyperparameters
a, b = 0, 0
iterations = 1000
learning_rate = 0.015

# clear output file
with open('data.csv', mode = 'w') as f:
    f.write('a,b,MSE\n')

# run gradient descent
with open('data.csv', mode = 'a') as f:
    for i in range(iterations):

        pred = a + b * X_data
        errors = Y_data - pred

        # calculate cost
        errorsSq = np.square(errors)
        MSE = errorsSq.mean()

        # write data to file
        line = ','.join([str(a), str(b), str(MSE)]) + '\n'
        f.write(line)

        # calculate gradients
        a_gradient = (-2/n) * sum(errors)
        b_gradient = (-2/n) * sum(X_data * errors)

        # update weights
        a -= a_gradient * learning_rate
        b -= b_gradient * learning_rate
