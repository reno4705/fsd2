const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes/route");

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api",router);

// app.post("/test", async (req, res) => {
//   const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     try {
//         //const hashedPassword = await bcrypt.hash(password, 10);
//         const { data, error } = await supabase
//             .from('Users')
//             .insert([{ email, name, password}]);
        
//         if (error) {
//             return res.status(400).json({ error: error.message });
//         }

//         res.status(201).json({ message: 'User registered successfully', user: data });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: error });
//     }
// });

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});