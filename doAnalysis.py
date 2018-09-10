from functools import reduce
import numpy as np
import matplotlib.pyplot as plt
# import seaborn as seaborn
import json
jsonfile = open('friends.json', 'r')
friends = json.load(jsonfile)

total = len(friends)
sexResult = reduce(lambda x, y: (x[0] + y[0], x[1] + y[1], x[2] + y[2]),
                   map(lambda f: (f['Sex'] == 1, f['Sex'] == 2, f['Sex'] == 0), friends))
sexPerc = (sexResult[0] / total, sexResult[1] / total, sexResult[2] / total)
print(sexPerc)

fig, ax = plt.subplots(figsize=(6, 3), subplot_kw=dict(aspect="equal"))


def func(pct, allvals):
  absolute = int(pct / 100. * np.sum(allvals))
  return "{:.1f}%\n({:d})".format(pct, absolute)


wedges, texts, autotexts = ax.pie(sexResult, autopct=lambda pct: func(pct, sexResult),
                                  textprops=dict(color="w"))
ax.legend(wedges, ['Male', 'Female', 'N/A'],
          title="Gender",
          loc="center left",
          bbox_to_anchor=(1, 0, 0.5, 1))
plt.setp(autotexts, size=8, weight="bold")
ax.set_title("Gender distribution")

plt.show()
