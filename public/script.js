// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// BMI Calculator
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const bmiResult = document.getElementById('bmi-result').querySelector('span');

function calculateBMI() {
    const height = heightInput.value / 100; // convert cm to meters
    const weight = weightInput.value;
    
    if (height && weight) {
        const bmi = (weight / (height * height)).toFixed(1);
        bmiResult.textContent = bmi;
    } else {
        bmiResult.textContent = '-';
    }
}

heightInput.addEventListener('input', calculateBMI);
weightInput.addEventListener('input', calculateBMI);

// Workout Recommendations
document.getElementById('recommendation-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const goals = document.getElementById('goals').value;
    const fitnessLevel = document.getElementById('fitness-level').value;
    const preferences = document.getElementById('preferences').value;
    const height = heightInput.value;
    const weight = weightInput.value;
    const bmi = bmiResult.textContent;
    const resultBox = document.getElementById('recommendation-result');

    try {
        resultBox.innerHTML = 'Getting recommendations...';
        resultBox.classList.add('active');

        const response = await fetch('/api/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                goals, 
                fitnessLevel, 
                preferences,
                bodyMetrics: {
                    height,
                    weight,
                    bmi
                }
            }),
        });

        const data = await response.json();
        resultBox.innerHTML = data.recommendation.replace(/\n/g, '<br>');
    } catch (error) {
        resultBox.innerHTML = 'Error getting recommendations. Please try again.';
    }
});

// Workout Tracker
document.getElementById('tracker-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const workout = document.getElementById('workout').value;
    const resultBox = document.getElementById('feedback-result');

    try {
        resultBox.innerHTML = 'Analyzing workout...';
        resultBox.classList.add('active');

        const response = await fetch('/api/track-workout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ workout }),
        });

        const data = await response.json();
        resultBox.innerHTML = data.feedback.replace(/\n/g, '<br>');
    } catch (error) {
        resultBox.innerHTML = 'Error analyzing workout. Please try again.';
    }
});