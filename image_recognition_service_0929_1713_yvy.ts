// 代码生成时间: 2025-09-29 17:13:14
import express, { Request, Response } from 'express';
import { createServer } from 'vite';
import { Tesseract } from 'tesseract.js'; // 引入Tesseract.js库用于OCR识别

// 定义接口文档类型
interface ImageData {
  image: Buffer;
}

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 设置静态文件目录
app.use(express.static('public'));

// 启动Vite服务器
createServer({ preview: true }).then((server) => {
  server.middlewares.use(app);
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});

// 路由：处理图像识别请求
app.post('/recognize-image', async (req: Request, res: Response) => {
  try {
    // 从请求中提取图像数据
    const imageData: ImageData = req.body;
    // 检查图像数据是否有效
    if (!imageData.image) {
      throw new Error('No image data provided.');
    }

    // 使用Tesseract.js进行OCR识别
    const { data: { text } } = await Tesseract.recognize(imageData.image, 'eng', { logger: m => console.log(m) });

    // 返回识别结果
    res.status(200).json({ text });
  } catch (error) {
    // 错误处理
    res.status(500).json({ error: error.message });
  }
});

// 错误处理中间件
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 导出app以便测试
export default app;