export const CoachingOptions = [
    {
      name: 'Topic Base Lecture',
      icon: '/lecture.png',
      prompt:
        'You are a helpful lecture voice assistant delivering structured talks on {user_topic}. Keep responses friendly, clear, and engaging. Maintain a conversational tone and keep answers under 120 characters. Ask only one follow-up question at a time.',
  
      summeryPrompt: `
  Generate a clear, structured lecture summary based on the conversation.
  
  STRICT RULES:
  - Plain text only (NO markdown, NO tables)
  - NO "|" vertical lines
  - NO decorative symbols, dots, or separators
  - Short paragraphs and simple bullet points only
  - Professional and educational tone
  
  STRUCTURE:
  Title
  Overview
  Key Concepts Explained
  Important Takeaways
  Practical Examples or Tips
  Final Conclusion
  `,
  
      abstract: '/ab1.png'
    },
  
    {
      name: 'Mock Interview',
      icon: '/interview.png',
      prompt:
        'You are a friendly AI voice interviewer simulating real interview scenarios for {user_topic}. Ask structured, industry-relevant questions and give concise feedback. Keep responses under 120 characters.',
  
      summeryPrompt: `
  Generate a structured interview feedback summary based on the conversation.
  
  STRICT RULES:
  - Plain text only
  - NO tables or vertical lines
  - NO unnecessary symbols or formatting
  - Use short bullet points where helpful
  - Clear, professional interview tone
  
  STRUCTURE:
  Interview Topic
  Overall Performance Summary
  Strengths Observed
  Areas for Improvement
  Suggested Practice Questions
  Final Interview Advice
  `,
  
      abstract: '/ab2.png'
    },
  
    {
      name: 'Ques Ans Prep',
      icon: '/qa.png',
      prompt:
        'You are a conversational AI tutor helping users practice question and answer sessions for {user_topic}. Ask clear questions and give focused feedback. Keep responses concise and under 120 characters.',
  
      summeryPrompt: `
  Generate a structured Q&A practice summary based on the conversation.
  
  STRICT RULES:
  - Plain text output only
  - NO tables, pipes, or special formatting
  - Clear bullet points only where necessary
  - Simple, learner-friendly language
  
  STRUCTURE:
  Practice Topic
  Key Questions Discussed
  User Response Evaluation
  Knowledge Gaps Identified
  Improvement Suggestions
  Practice Recommendation
  `,
  
      abstract: '/ab3.png'
    },
  
    {
      name: 'Learn Language',
      icon: '/language.png',
      prompt:
        'You are a helpful AI voice coach assisting users in learning {user_topic}. Provide pronunciation guidance, vocabulary tips, and simple exercises. Keep responses friendly and under 120 characters.',
  
      summeryPrompt: `
  Generate a structured language learning summary based on the conversation.
  
  STRICT RULES:
  - Plain text only
  - NO tables or symbols
  - NO decorative separators
  - Clear and simple educational tone
  
  STRUCTURE:
  Language Focus
  Vocabulary Learned
  Pronunciation Notes
  Grammar or Usage Tips
  Practice Exercises
  Next Learning Steps
  `,
  
      abstract: '/ab4.png'
    },
  
    {
      name: 'Meditation',
      icon: '/meditation.png',
      prompt:
        'You are a calming AI voice guide leading meditation sessions on {user_topic}. Maintain a soothing tone and keep responses gentle and under 120 characters.',
  
      summeryPrompt: `
  Generate a calm and structured meditation session summary.
  
  STRICT RULES:
  - Plain text only
  - NO bullets overload
  - NO symbols or decorative formatting
  - Soft, peaceful language
  
  STRUCTURE:
  Meditation Theme
  Session Overview
  Breathing or Focus Techniques
  Mindfulness Guidance
  Benefits Experienced
  Closing Reflection
  `,
  
      abstract: '/ab5.png'
    }
  ];
  



export const CoachingExpert = [
    {
        name: 'Joanna',
        avatar: '/t1.avif',
        pro: false
    },
    {
        name: 'Salli',
        avatar: '/t2.jpg',
        pro: false
    },
    {
        name: 'Joey',
        avatar: '/t3.jpg',
        pro: false
    },
    // {
    //     name: 'Rachel',
    //     avatar: '/t4.png',
    //     pro: true
    // },
]