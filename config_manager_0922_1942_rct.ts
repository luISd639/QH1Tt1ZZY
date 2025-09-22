// 代码生成时间: 2025-09-22 19:42:49
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Define the interface for the configuration object
interface IConfiguration {
  [key: string]: any;
}

class ConfigManager {
  private config: IConfiguration;

  constructor(private configFilePath: string) {
    this.loadConfig();
  }

  // Load configuration from the specified JSON file
  private loadConfig(): void {
    try {
      // Read the configuration file
      const data = fs.readFileSync(this.configFilePath, 'utf8');
      // Parse the JSON data
      this.config = JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  // Get the value from the configuration by key
  public getValue(key: string): any {
    return this.config[key];
  }

  // Set the value in the configuration by key
  public setValue(key: string, value: any): void {
    this.config[key] = value;
    // Optionally, save the updated configuration back to the file
    this.saveConfig();
  }

  // Save the current configuration to the file
  private saveConfig(): void {
    try {
      const data = JSON.stringify(this.config, null, 2);
      fs.writeFileSync(this.configFilePath, data, 'utf8');
    } catch (error) {
      throw new Error(`Failed to save configuration: ${error.message}`);
    }
  }
}

// Express app setup
const app = express();
const configManager = new ConfigManager(path.join(__dirname, 'config.json'));

// Route to get a configuration value
app.get('/config/:key', (req: Request, res: Response) => {
  const { key } = req.params;
  const value = configManager.getValue(key);
  if (value === undefined) {
    return res.status(404).json({ message: 'Configuration key not found' });
  }
  res.json({ key, value });
});

// Route to set a configuration value
app.put('/config/:key', (req: Request, res: Response) => {
  const { key } = req.params;
  const { value } = req.body;
  configManager.setValue(key, value);
  res.status(200).json({ message: 'Configuration updated' });
});

// Start the server
const PORT = configManager.getValue('port') || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});