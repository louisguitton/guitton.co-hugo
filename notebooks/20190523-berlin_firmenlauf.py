#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd


# In[11]:


df = pd.read_csv('../data/berlin_firmenlauf.csv', sep=';', names=['place', 'place_men', 'place_women', 'jersey_number', 'first_name', 'last_name', 'place_age_group', 'age_group', 'team', 'time', 'company'], skiprows=1)
df.sample(5)


# In[ ]:




