import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import { Download } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

const ModelMetricsComparison = () => {
  const conditions = ['Anxiety', 'Bipolar', 'Depression', 'Suicide', 'None'];
  const metrics: Array<'Precision' | 'Recall' | 'F1-Score'> = ['Precision', 'Recall', 'F1-Score'];

  const modelData = {
    BERT: {
      Precision: [0.78, 0.86, 0.68, 0.65, 0.68],
      Recall: [0.79, 0.75, 0.70, 0.68, 0.65],
      'F1-Score': [0.79, 0.80, 0.69, 0.67, 0.67],
    },
    RoBERTa: {
      Precision: [0.81, 0.85, 0.68, 0.66, 0.71],
      Recall: [0.81, 0.78, 0.71, 0.71, 0.62],
      'F1-Score': [0.81, 0.81, 0.69, 0.68, 0.67],
    },
    'Phi-2': {
      Precision: [0.88, 0.91, 0.63, 0.76, 0.78],
      Recall: [0.85, 0.82, 0.68, 0.80, 0.74],
      'F1-Score': [0.87, 0.86, 0.65, 0.78, 0.76],
    },
  };

  const createDataset = (metric: 'Precision' | 'Recall' | 'F1-Score') => {
    return conditions.map((condition, i) => ({
      condition,
      BERT: modelData.BERT[metric][i],
      RoBERTa: modelData.RoBERTa[metric][i],
      'Phi-2': modelData['Phi-2'][metric][i],
    }));
  };

  const handleDownload = async (metric: 'Precision' | 'Recall' | 'F1-Score') => {
    const chartElement = document.querySelector(`#chart-${metric}`) as HTMLElement;
    if (!chartElement) {
      console.error(`Chart for ${metric} not found.`);
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(chartElement);
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `${metric}-comparison.png`;
      downloadLink.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  return (
    <div className="space-y-8 w-full p-4">
      {metrics.map((metric) => (
        <Card key={metric} className="w-full">
          <CardHeader
            title={<Typography variant="h6">{`${metric} Comparison Across Mental Health Conditions`}</Typography>}
            action={
              <button
                onClick={() => handleDownload(metric)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            }
          />
          <CardContent>
            <div id={`chart-${metric}`} style={{ background: 'white', padding: '16px' }}>
              <LineChart
                width={800}
                height={300}
                data={createDataset(metric)}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="condition" interval={0} padding={{ left: 30, right: 30 }} />
                <YAxis
                  domain={[0.6, 0.95]}
                  label={{ value: metric, angle: -90, position: 'insideLeft', offset: 10 }}
                />
                <Tooltip formatter={(value: number) => (value * 100).toFixed(1) + '%'} />
                <Legend
                  layout="vertical"
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #d5d5d5',
                    borderRadius: 3,
                    padding: 5,
                    top: 0,
                    right: 0,
                  }}
                />
                <Line type="monotone" dataKey="BERT" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="RoBERTa" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Phi-2" stroke="#ffc658" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModelMetricsComparison;
