import { PythonShell } from 'python-shell';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const predict = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imagePath = req.file.path;
    const pythonScriptPath = path.join(__dirname, '../../python_ai/inference.py');

    let options = {
      mode: 'text',
      pythonPath: 'python',
      pythonOptions: ['-u'], // get print results in real-time
      scriptPath: path.dirname(pythonScriptPath),
      args: [imagePath]
    };

    PythonShell.run('inference.py', options).then(async (messages) => {
      // Find the JSON output
      let result = null;
      for (const msg of messages) {
        try {
          result = JSON.parse(msg);
          if (result.prediction) break;
        } catch (e) {
          // ignore non-json messages (logs from python)
        }
      }

      if (!result || result.error) {
        return res.status(500).json({ error: result?.error || 'Failed to process image' });
      }

      // Save to database
      const predictionRecord = await prisma.prediction.create({
        data: {
          userId: req.user.id,
          imagePath: req.file.filename,
          prediction: result.prediction,
          confidence: result.confidence,
          camImage: path.basename(result.cam || imagePath),
        }
      });

      res.json({
        id: predictionRecord.id,
        ...result,
        imagePath: req.file.filename,
        camImage: path.basename(result.cam || imagePath)
      });
    }).catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error executing AI model' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during prediction' });
  }
};
