require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = 3000;

// Initialize OpenAI with error handling
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Get AI workout recommendations
app.post('/api/recommendations', async (req, res) => {
  const { goals, fitnessLevel, preferences, bodyMetrics } = req.body;
  
  try {
    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      throw new Error('Invalid OpenAI API key');
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "You are a professional fitness trainer providing workout recommendations."
      }, {
        role: "user",
        content: `Create a workout plan for someone with the following details:
          Goals: ${goals}
          Fitness Level: ${fitnessLevel}
          Preferences: ${preferences}
          Height: ${bodyMetrics.height}cm
          Weight: ${bodyMetrics.weight}kg
          BMI: ${bodyMetrics.bmi}
          
          Please provide a structured weekly plan with specific exercises, considering their body metrics and BMI.`
      }]
    });

    res.json({ recommendation: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    res.status(500).json({ 
      error: 'Error generating recommendation',
      details: error.message 
    });
  }
});

// Track workout
app.post('/api/track-workout', async (req, res) => {
  const { workout } = req.body;
  
  try {
    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      throw new Error('Invalid OpenAI API key');
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "You are a fitness analysis AI providing feedback on workouts."
      }, {
        role: "user",
        content: `Analyze this workout and provide feedback:
          ${workout}
          Please provide specific tips for improvement and form suggestions.`
      }]
    });

    res.json({ feedback: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    res.status(500).json({ 
      error: 'Error analyzing workout',
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});