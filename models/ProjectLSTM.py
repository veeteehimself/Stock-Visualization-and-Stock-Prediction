#!/usr/bin/env python
# coding: utf-8
import pandas as pd
import numpy as np
import pandas as pd
import tensorflow as tf
import ssl
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
import math
from sklearn.metrics import mean_squared_error
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import LSTM


ssl._create_default_https_context = ssl._create_unverified_context
# df = pd.read_csv("https://raw.githubusercontent.com/LyJacky/stocks/4802f4e0f139ee0568afbad309086d90c78a53b7/all_stocks_5yr.csv")

from preprocessing import apiCall
import sys

# Access the command-line arguments
if len(sys.argv) > 0:
    print(sys.argv[1] )
    arg1 = sys.argv[1] 
    df1 = apiCall(arg1)
    df1 = df1.reset_index()['close']
else:
    df1 = apiCall("IBM")
    df1 = df1.reset_index()['close']


df1 = df1.reset_index()['close']
# only for AAL stock
df1 = df1[0:1259]


# scales the close values between the values 0 and 1
scaler=MinMaxScaler(feature_range=(0,1))
df1=scaler.fit_transform(np.array(df1).reshape(-1,1))

# training size is the number of data we are going to use for the traning data
training_size=int(len(df1)*0.65)
# test_size is just the complement of training size.
test_size=len(df1)-training_size
# makes 2 new lists train_data and test_data which are both subsets of the df1
# train_data is going to be df1 from 0 to training size, and tet_data will be from training size to the rest of the data
train_data,test_data=df1[0:training_size,:],df1[training_size:len(df1),:1]

time_step = 100
X_train, y_train = [], []
for i in range(len(train_data)-time_step-1):
    a = train_data[i:(i+time_step), 0]   
    X_train.append(a)
    y_train.append(train_data[i + time_step, 0])


X_test, ytest = [], []
for i in range(len(test_data)-time_step-1):
    a = test_data[i:(i+time_step), 0]   
    X_test.append(a)
    ytest.append(test_data[i + time_step, 0])

X_train = np.array(X_train)
y_train = np.array(y_train)
X_test = np.array(X_test)
ytest = np.array(ytest)

# last one says one feature, reshapes features so its a 3 dim and the last dim is the number of features
X_train = X_train.reshape(X_train.shape[0],X_train.shape[1] , 1)
X_test = X_test.reshape(X_test.shape[0],X_test.shape[1] , 1)


# Building the LSTM model using keras
# input node is a sequence since LSTM accept sequences
model=Sequential()
# goes to a layer of 50 LSTM nodes which return a sequence
model.add(LSTM(50,return_sequences=True,input_shape=(100,1)))
# goes to another layer of 50 LSTM nodes which return a sequence
model.add(LSTM(50,return_sequences=True))
# goes to the last layer of 50 LSTM node, and does not return a sequence since the next layer will be one node
model.add(LSTM(50))
model.add(Dense(1))
model.compile(loss='mean_squared_error',optimizer='adam')
# TEMP 10 EPOCH
model.fit(X_train,y_train,validation_data=(X_test,ytest),epochs=50,batch_size=64,verbose=1)

# train_predict=model.predict(X_train)
# test_predict=model.predict(X_test)

# train_predict=scaler.inverse_transform(train_predict)
# test_predict=scaler.inverse_transform(test_predict)

# y_train=scaler.inverse_transform(np.transpose([y_train]))
# ytest=scaler.inverse_transform(np.transpose([ytest]))

# look_back=100
# trainPredictPlot = np.empty_like(df1)
# trainPredictPlot[:, :] = np.nan
# trainPredictPlot[look_back:len(train_predict)+look_back, :] = train_predict

# testPredictPlot = np.empty_like(df1)
# testPredictPlot[:, :] = np.nan
# testPredictPlot[len(train_predict)+(look_back*2)+1:len(df1)-1, :] = test_predict

# plt.plot(scaler.inverse_transform(df1),label = "Actual values")
# plt.plot(trainPredictPlot,label = "Training Prediction")
# plt.plot(testPredictPlot, label = "Testing Prediction")
# plt.legend()
# plt.show()


# model.save("models/LSTMTEST2")

import pickle
if arg1:
    print('I WENT INSIDE THIS!')
    with open('models/LSTMHistory'+arg1+'.pickle', 'wb') as file_pi:
        pickle.dump(model, file_pi)
else:
    print('I DIDNT GO INSIDE OF IT')
    with open('models/LSTMHistoryFAILED.pickle', 'wb') as file_pi:
        pickle.dump(model, file_pi)

print('I REACHED THE END!')
# with open('./LSTMHistory.pickle', 'rb') as file_pi:
#     pickled_history = pickle.load(file_pi)
# pickled_history.predict(X_test)

