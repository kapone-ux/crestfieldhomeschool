import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI Analysis for Applications
export const analyzeApplication = async (applicationData) => {
  try {
    const prompt = `
      Analyze this application for Crestfield International Academy and provide:
      1. Suitability score (1-10)
      2. Recommended category/level
      3. Strengths
      4. Areas of concern
      5. Interview recommendation (yes/no/maybe)
      6. Suggested next steps

      Application Details:
      - Type: ${applicationData.type}
      - Name: ${applicationData.fullName}
      - Email: ${applicationData.email}
      - Phone: ${applicationData.phone}
      - Program/Position: ${applicationData.program || applicationData.position}
      - Experience: ${applicationData.experience || 'N/A'}
      - Qualifications: ${applicationData.qualifications || applicationData.message || 'N/A'}
      - Cover Letter/Message: ${applicationData.coverLetter || applicationData.message || 'N/A'}

      Please provide a detailed analysis in JSON format.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert educational consultant and HR specialist analyzing applications for Crestfield International Academy. Provide objective, fair, and detailed analysis to help with admissions and hiring decisions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    return { success: true, analysis };
  } catch (error) {
    console.error('OpenAI Analysis Error:', error);
    return { 
      success: false, 
      error: error.message,
      fallbackAnalysis: generateFallbackAnalysis(applicationData)
    };
  }
};

// Categorize applicants automatically
export const categorizeApplicant = async (applicationData) => {
  try {
    const prompt = `
      Based on this application, categorize the applicant into the most suitable program or position at Crestfield International Academy.

      Available Categories:
      - For Students: Cambridge Primary, Cambridge Checkpoints, IGCSE, Pearson Edexcel, AS & A Levels, Homeschool
      - For Teachers: Mathematics, English, Science, ICT/Coding, Cambridge IGCSE, A-Level, Homeschooling Tutor, Online Learning Facilitator
      - For Coding Courses: Web Development, Python Programming, Cyber Security, AI & Emerging Technologies, Graphic Design, Digital Marketing

      Application:
      - Type: ${applicationData.type}
      - Age/Grade: ${applicationData.age || applicationData.grade || 'N/A'}
      - Current Level: ${applicationData.currentLevel || 'N/A'}
      - Interests: ${applicationData.interests || applicationData.specialization || 'N/A'}
      - Goals: ${applicationData.goals || applicationData.coverLetter?.substring(0, 200) || 'N/A'}

      Provide the recommended category and brief reasoning in JSON format.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an academic advisor categorizing applicants into the most suitable programs at Crestfield International Academy."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    const categorization = JSON.parse(completion.choices[0].message.content);
    return { success: true, categorization };
  } catch (error) {
    console.error('OpenAI Categorization Error:', error);
    return { 
      success: false, 
      error: error.message,
      fallbackCategory: 'General'
    };
  }
};

// Generate interview questions
export const generateInterviewQuestions = async (applicationData) => {
  try {
    const prompt = `
      Generate 5 targeted interview questions for this applicant based on their application.

      Application:
      - Position/Program: ${applicationData.position || applicationData.program}
      - Experience: ${applicationData.experience || 'N/A'}
      - Qualifications: ${applicationData.qualifications || 'N/A'}
      - Special Skills: ${applicationData.certifications || applicationData.skills || 'N/A'}
      - Cover Letter Highlights: ${applicationData.coverLetter?.substring(0, 300) || 'N/A'}

      Provide questions that will help assess their suitability and fit for Crestfield International Academy.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert interviewer creating targeted questions for educational institution applicants."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const questions = completion.choices[0].message.content.split('\n').filter(q => q.trim());
    return { success: true, questions };
  } catch (error) {
    console.error('OpenAI Question Generation Error:', error);
    return { 
      success: false, 
      error: error.message,
      fallbackQuestions: [
        "Tell us about your educational philosophy.",
        "How do you handle diverse learning needs?",
        "Describe your experience with international curricula.",
        "How do you integrate technology in teaching?",
        "What are your long-term career goals?"
      ]
    };
  }
};

// Fallback analysis when OpenAI fails
const generateFallbackAnalysis = (applicationData) => {
  return {
    suitabilityScore: 6,
    recommendedCategory: applicationData.type === 'teacher' ? 'General Teaching' : 'Standard Program',
    strengths: ['Complete application', 'Clear communication'],
    concerns: ['Requires manual review'],
    interviewRecommendation: 'maybe',
    nextSteps: ['Schedule initial screening', 'Verify qualifications', 'Request additional documents if needed']
  };
};

// Course recommendation for students
export const recommendCourses = async (studentData) => {
  try {
    const prompt = `
      Based on this student's profile, recommend the most suitable courses and learning path at Crestfield International Academy.

      Student Profile:
      - Current Grade: ${studentData.grade || 'N/A'}
      - Age: ${studentData.age || 'N/A'}
      - Academic Strengths: ${studentData.strengths || 'N/A'}
      - Areas for Improvement: ${studentData.weaknesses || 'N/A'}
      - Career Interests: ${studentData.interests || 'N/A'}
      - Learning Goals: ${studentData.goals || 'N/A'}

      Consider:
      1. Cambridge pathways (Primary, Checkpoints, IGCSE, A Levels)
      2. Pearson Edexcel options
      3. Homeschool programs
      4. Coding and technology courses
      5. Additional support needed

      Provide personalized recommendations in JSON format.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an academic counselor providing personalized course recommendations for students."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 1000,
    });

    const recommendations = JSON.parse(completion.choices[0].message.content);
    return { success: true, recommendations };
  } catch (error) {
    console.error('OpenAI Course Recommendation Error:', error);
    return { 
      success: false, 
      error: error.message,
      fallbackRecommendations: {
        primaryRecommendation: 'Cambridge IGCSE Program',
        alternatives: ['Pearson Edexcel', 'Homeschool Program'],
        additionalSupport: ['Regular tuition sessions', 'Exam preparation classes']
      }
    };
  }
};

// Application priority scoring
export const calculatePriorityScore = async (applicationData) => {
  try {
    const prompt = `
      Calculate a priority score (1-100) for this application based on:
      - Completeness of application
      - Qualifications match
      - Experience relevance
      - Urgency indicators
      - Fit with Crestfield International Academy values

      Application Data:
      ${JSON.stringify(applicationData, null, 2)}

      Provide a score and brief justification in JSON format.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an admissions specialist calculating priority scores for applications."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const scoring = JSON.parse(completion.choices[0].message.content);
    return { success: true, scoring };
  } catch (error) {
    console.error('OpenAI Priority Scoring Error:', error);
    return { 
      success: false, 
      error: error.message,
      fallbackScore: 50
    };
  }
};

export default {
  analyzeApplication,
  categorizeApplicant,
  generateInterviewQuestions,
  recommendCourses,
  calculatePriorityScore
};