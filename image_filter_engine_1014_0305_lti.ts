// 代码生成时间: 2025-10-14 03:05:22
import express from 'express';
import multer from 'multer';
import sharp from 'sharp'; // 用于图像处理
import { Request, Response } from 'express';

// 创建Express应用
const app = express();
const port = 3000;

// 配置multer来处理上传的文件
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制文件大小为5MB
  storage: multer.memoryStorage(),
});

// 定义滤镜类型
type FilterType = 'grayscale' | 'sepia' | 'nega';

// 应用中间件来解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由：上传图像并应用滤镜
app.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  // 检查是否有文件上传
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  const buffer = req.file.buffer;
  const filterType = req.body.filter as FilterType;

  try {
    // 应用滤镜
    const output = await sharp(buffer)
      .metadata() // 获取图像元数据
      .then(({ width, height, format }) => {
        // 根据滤镜类型应用滤镜
        switch (filterType) {
          case 'grayscale':
            return sharp(buffer).grayscale().toBuffer();
          case 'sepia':
            return sharp(buffer).sepia().toBuffer();
          case 'nega':
            return sharp(buffer).negate().toBuffer();
          default:
            throw new Error('Unsupported filter type.');
        }
      });

    // 发送处理后的图像
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': output.length,
    });
    res.end(output);
  } catch (error) {
    // 错误处理
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Image filter engine is running on http://localhost:${port}`);
});