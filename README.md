# HanDoeLu

這是一個用手機取代鍵盤滑鼠的系統，目的是給每次使用開發板時總是缺乏鍵盤滑鼠可以用的問題。

## 開始

### 定義env.json

把`_env.json`改成`env.json`並依照自己的環境編輯。

### 自定義操作檔

在`src/configs`中複製`RemoteControl.js`，就可以開始建造自己的操作模式。

### 運行Server

```bash
npm install
node index.js
```

再用手機連上同網段的website(建議使用firefox)，開始操作滑鼠。

### Windows

windoes基於win32 api來模擬硬體操作，因為是使用C#呼叫，會執行一個exe檔，如果你不放心也可以在`code/C#`中自己編譯執行檔，並放置於`src/controller/windows`中。

[windows 鍵盤對照表(十進位制值)](https://www.itread01.com/content/1545905367.html)

### Linux

必須安裝 xdotool

```bash
sudo apt-get install xdotool
```

[xdotool 對應表](https://gitlab.com/cunidev/gestures/wikis/xdotool-list-of-key-codes)

還要前往`src/controller/linux`中下以下指令：

```bash
npm install
```

### Mac

我買不起QQ
