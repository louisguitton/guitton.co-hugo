#!/usr/bin/env python
# coding: utf-8

# # Yesterday, I ran the Berliner Firmenlauf
# 
# {{< instagram BxxtOXDIJ2X >}}
# 
# Data can be found at https://www.davengo.com/event/result/18-ikk-bb-berliner-firmenlauf-2019/

# In[1]:


import pandas as pd
from matplotlib import pyplot as plt
import seaborn as sns
sns.set()
get_ipython().run_line_magic('matplotlib', 'inline')


# In[2]:


def time_convert(x):
    h, m, s = map(int, x.split(':'))
    return (h * 60 + m) * 60 + s


# In[3]:


df = pd.read_csv(
    '../data/berlin_firmenlauf.csv', 
    sep=';', 
    names=['place', 'place_men', 'place_women', 'jersey_number', 'first_name', 'last_name', 'place_age_group', 'age_group', 'team', 'time', 'company'], 
    skiprows=1, 
)
df['time_in_sec'] = df.time.apply(time_convert)
df.sample(5)


# In[4]:


me = df.loc[(df.first_name=='Louis') & (df.last_name=='Guitton')]
me


# In[5]:


k = df.loc[df.time_in_sec == df.loc[df.team=='Onefootball'].time_in_sec.min(), :]
k


# In[6]:


plt.figure(figsize=(16, 6))
ax = sns.scatterplot('place', 'time_in_sec', hue='team', data=df)
ax.set(xscale="log")
ax.invert_xaxis()
ax.invert_yaxis()
ax.set_title('Final rankings of Onefootballers relative to time')
yticks = ax.get_yticks()
ax.set_yticklabels([pd.to_datetime(tm, unit='s').strftime('%H:%M:%S') for tm in yticks])
ax.annotate('me', xy=(me['place'], me['time_in_sec']), xytext=(3000, 1760),
            arrowprops=dict(facecolor='black', shrink=0.05),
            )
ax.annotate('fastest onefootballer', xy=(k['place'], k['time_in_sec']), xytext=(800, 1550),
            arrowprops=dict(facecolor='black', shrink=0.05),
            )
plt.legend(loc='lower right')

