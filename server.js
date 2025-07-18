const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors({
    origin: "https://quizgame12.netlify.app/",
    methods: ["GET", "POST", "PUT", "DELETE"]
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}));

function getQuizJSON() {
    const questions = [
        {
            text: "What gas is used to extinguish fires?",
            options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
            correct: 3
        },
        {
            text: "Entomology is the science that studies:",
            options: [
                "Behavior of human beings",
                "Insects",
                "The origin and history of technical and scientific terms",
                "The formation of rocks"
            ],
            correct: 2
        },
        {
            text: "What do Koalas usually eat?",
            options: ["Bamboo", "Eucalyptus", "Aloe Vera", "Banana"],
            correct: 2
        },
        {
            text: "What is the phobia of thunder and rain?",
            options: ["Agoraphobia", "Ombrophobia", "Acrophobia", "Claustrophobia"],
            correct: 2
        },
        {
            text: "When do humans use more facial muscles?",
            options: [
                "While smiling",
                "While frowning",
                "While sleeping",
                "While talking"
            ],
            correct: 2
        },
        {
            text:"On which continent would you find the world's largest desert?",
            options: ["Antarctica", "Africa", "Europe","South America"],
            correct: 1
        },
        {
            text:" What is the tiny piece at the end of a shoelace called?",
            options: ["An aglet", "Shoetip", "Spindle","Toglet"],
            correct: 1
        },
        {
            text:" In 2009, what became the first Morse code character to be added since WWII?",
            options: ["The “@” symbol", "The “$” symbol", "The “~” symbol","The “!” symbol"],
            correct: 1
        },

        
    ];
    const jsQuestions = questions.map(q => ({
        questionText: q.text,
        options: q.options,
        correctAnswer: q.correct,
    }));

    return { questions: jsQuestions };
}

app.get('/questions', (req, res) => {
    try {
        res.json(getQuizJSON());
    } catch (err) {
        res.status(400).send(err);
    }
})

app.listen(3001, () => {
    console.log("Server started at port 3001");
})
