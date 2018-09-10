import json
import itchat
itchat.login(enableCmdQR=2)

friends = itchat.get_friends(update=True)[0:]

file = open('friends.json','w', encoding='utf-8');
file.write(json.dumps(friends, ensure_ascii=False, indent=2))
file.close()
