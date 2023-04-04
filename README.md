# PdfAsk

使用pdfjs解析PDF，将PDF内容向量化存储。对用户提问和PDF内容向量化对比之后，通过gpt3.5 对话模式回答用户的提问。

## 功能
- 导入PDF并解析 (done)
- 根据PDF内容回答提问 (done)
-  提供回答内容所在PDF的位置 (TODO)
-  回答同提问的语言 (TODO)
-  支持导出对话内容 (TODO)
-  提供分享链接 (TODO)
-  支持客户端使用(Tauri/Electron) (TODO)

## 如何启动
你需要在项目根目录下，新建一个 .env 文件，用于存储必要的apiKey，包括 openai 和 pinecone数据库
```javascript
OPENAI_API_KEY="sk-************************************************"
OPENAI_ORGANIZATION="org-************************"

PINECONE_ENV = "**-********-***"
PINECONE_API_KEY = "********-****-****-****-************"
PINECONE_PRJ_NAME = "*******"
```

之后可以npm install, npm run start

打开页面 http://localhost:3008/ 进行尝试

##

### AI菜鸡互助小组
<img src="/assets/images/wx_qcode.jpg" alt="wechat group" width="200px" height="255px">
