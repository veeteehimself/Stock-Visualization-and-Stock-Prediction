#!/usr/bin/env python
# coding: utf-8

# ## Importing needed required libraries, also using Tensorflow which is not included in conda you will need to pip install it prior to running this notebook
# ### creating df from github repositiory we have created

# In[1]:


import pandas as pd
import numpy as np
import pandas as pd
import tensorflow as tf
import ssl
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
import math
from sklearn.metrics import mean_squared_error



ssl._create_default_https_context = ssl._create_unverified_context
df = pd.read_csv("https://raw.githubusercontent.com/LyJacky/stocks/4802f4e0f139ee0568afbad309086d90c78a53b7/all_stocks_5yr.csv")


# ### In the dataset each stock has 1259 days of stocks which is why we have picked the first 1259 days.
# 
# 

# In[2]:


df1 = df.reset_index()['close']
# only for AAL stock
df1 = df1[0:1259]
df1


# ### Plotting the graph of the closing price vs the date(implied)
# ### Only using the closing price to predict the price, the x axis represents the days

# In[3]:


plt.plot(df1)


# ## Normalizing the data using MinMaxScaler to values between 0 and 1

# In[4]:


# scales the close values between the values 0 and 1
scaler=MinMaxScaler(feature_range=(0,1))
df1=scaler.fit_transform(np.array(df1).reshape(-1,1))
df1


# ## Making training and testing data, since we are dealing with stocks we must split them in a sequential way having the training data have data all before one of the testing data. 
# ### The data will basically be partitioned into the first .65% being training and the other testing 

# In[5]:


# training size is the number of data we are going to use for the traning data
training_size=int(len(df1)*0.65)
# test_size is just the complement of training size.
test_size=len(df1)-training_size
# makes 2 new lists train_data and test_data which are both subsets of the df1
# train_data is going to be df1 from 0 to training size, and tet_data will be from training size to the rest of the data
train_data,test_data=df1[0:training_size,:],df1[training_size:len(df1),:1]


# ## Since we are going to deal with LSTM's the input must be a sequence. Hence all of our X_train and X_test will be a sequence of the price 100 days prior the current day
# ### The y train and test will jus tbe the stock of the day of

# In[6]:


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


# ### Converting all of the lists intp np arrays in order to reshape the list in a later stage so that the keras libary has the proper inputs for the necessary functions

# In[7]:


X_train = np.array(X_train)
y_train = np.array(y_train)
X_test = np.array(X_test)
ytest = np.array(ytest)


# In[8]:


X_train


# ## Reshaping the list thanks to np arrays where the 3rd dim is the number of features

# In[9]:


# last one says one feature, reshapes features so its a 3 dim and the last dim is the number of features
X_train = X_train.reshape(X_train.shape[0],X_train.shape[1] , 1)
X_test = X_test.reshape(X_test.shape[0],X_test.shape[1] , 1)


# ## Importing proper libraries for LSTM and neural networks

# In[10]:


from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import LSTM


# ### Creating LSTM Model with one input layer, another 3 layers of 50 LSTM nodes (whenever we have an LSTM layer we must do return sequence since LSTM require sequences), hence for the last layer we must put return sequence false which is the default
# ### Training the LSTM Model with 100 epochs which represents the 100 days

# In[11]:


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
model.fit(X_train,y_train,validation_data=(X_test,ytest),epochs=100,batch_size=64,verbose=1)


# ### Predicting based on the trained model

# In[12]:


train_predict=model.predict(X_train)
test_predict=model.predict(X_test)


# In[13]:


test_predict


# ### Scaling the results back to the original

# In[14]:


#  tranforms the scaled values back to the original
train_predict=scaler.inverse_transform(train_predict)
test_predict=scaler.inverse_transform(test_predict)
# y_train=scaler.inverse_transform(y_train)
# ytest=scaler.inverse_transform(ytest)



# In[15]:


ytest


# In[16]:


# changes the y_train and ytest values back to the original values, I had to transpose [y_train] and [x_train] so it
# would be the same dimensions as the test_predict and train_predict
y_train=scaler.inverse_transform(np.transpose([y_train]))
ytest=scaler.inverse_transform(np.transpose([ytest]))


# In[17]:


print(ytest.shape)
print(test_predict.shape)
print(y_train.shape)
print(train_predict.shape)


# ## Displaying RMSE of testing and training data

# In[18]:


math.sqrt(mean_squared_error(y_train,train_predict))


# In[19]:


math.sqrt(mean_squared_error(ytest,test_predict))


# ### Plotting the predictions along with the original graph of the closing cost

# In[20]:


look_back=100

trainPredictPlot = np.empty_like(df1)
trainPredictPlot[:, :] = np.nan
trainPredictPlot[look_back:len(train_predict)+look_back, :] = train_predict

testPredictPlot = np.empty_like(df1)
testPredictPlot[:, :] = np.nan
testPredictPlot[len(train_predict)+(look_back*2)+1:len(df1)-1, :] = test_predict

plt.plot(scaler.inverse_transform(df1),label = "Actual values")
plt.plot(trainPredictPlot,label = "Training Prediction")
plt.plot(testPredictPlot, label = "Testing Prediction")
plt.legend()
plt.show()


# In[23]:


model.save("models/LSTM")


# In[32]:


import pickle
with open('./LSTMHistory.pickle', 'wb') as file_pi:
    pickle.dump(model, file_pi)


# In[33]:


with open('./LSTMHistory.pickle', 'rb') as file_pi:
    pickled_history = pickle.load(file_pi)


# In[35]:


pickled_history.predict(X_test)


# In[36]:


from preprocessing import apiCall

apiCall("IMB")

