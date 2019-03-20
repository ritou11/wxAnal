from functools import reduce
import numpy as np
import matplotlib.pyplot as plt
# import seaborn as seaborn
import json

with open('output/friends.json', 'r', encoding='utf-8') as f:
  friends = json.load(f)

total = len(friends)
sexResult = reduce(lambda x, y: (x[0] + y[0], x[1] + y[1], x[2] + y[2]),
                   map(lambda f: (f['Sex'] == 1, f['Sex'] == 2, f['Sex'] == 0), friends))
sexPerc = (sexResult[0] / total * 100,
            sexResult[1] / total * 100,
            sexResult[2] / total * 100)
print('男: {:.2f}%, 女: {:.2f}%, 未知: {:.2f}%'.format(*sexPerc))

fig, ax = plt.subplots(figsize=(6, 3), subplot_kw=dict(aspect="equal"))

def func(pct, allvals):
  absolute = int(pct / 100. * np.sum(allvals))
  return "{:.1f}%\n({:d})".format(pct, absolute)

wedges, texts, autotexts = ax.pie(sexResult, autopct=lambda pct: func(pct, sexResult),
                                  textprops=dict(color="w"))
ax.legend(wedges, ['男', '女', '未知'],
          title='性别',
          loc='center left',
          bbox_to_anchor=(1, 0, 0.5, 1))
plt.setp(autotexts, size=8, weight='bold')
ax.set_title('微信好友性别分布')
plt.savefig('output/gender.png', dpi=300)

import re
import jieba
siglist = []
for i in friends:
    signature = i["Signature"].strip().replace("span","").replace("class","").replace("emoji","")
    rep = re.compile("1f\d+\w*|[<>/=]")
    signature = rep.sub("", signature)
    siglist.append(signature)
text = ''.join(siglist)

wordlist = jieba.cut(text, cut_all=True)
word_space_split = ' '.join(wordlist)

from wordcloud import WordCloud, ImageColorGenerator
import numpy as np
import PIL.Image as Image
import PIL.ImageDraw as ImageDraw
import PIL.ImageFont as ImageFont

coloring = np.array(Image.open("./mask.jpg"))

my_wordcloud = WordCloud(background_color=None, max_words=2000,
                        #width=400, height=400,
                        max_font_size=60, #min_font_size=10,
                        mode='RGBA',
                        random_state=33, scale=3,
                        mask=coloring,
                        font_path="/Library/Fonts/Songti.ttc").generate(word_space_split)

my_wordcloud.to_file('output/friends.png')

background = Image.open("background.png")
img = Image.fromarray(my_wordcloud.to_array(), 'RGBA')
background.paste(img, (0, 0), img)
ttfont = ImageFont.truetype("/Library/Fonts/Songti.ttc", 100)
draw = ImageDraw.Draw(background)
draw.text((368,1360),'朋友们的个性签名', fill=(180,255,93),font=ttfont)

background.save('output/withbackground.png')
