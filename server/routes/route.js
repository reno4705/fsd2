const { Router } = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const route = Router();

const JWT_SECRET = 'reno4705'; 

route.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error } = await supabase
            .from('Users')
            .insert([{ name, email, password: hashedPassword }]);
        
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ message: 'User registered successfully', user: data });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

route.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const { data, error } = await supabase
            .from('Users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) {
            return res.status(401).json({ error: 'Email not found' });
        }

        const isMatch = await bcrypt.compare(password, data.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: data.id, name: data.name, email: data.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('userToken', token, { httpOnly: true });

        res.status(200).json({ message: 'Login successful', user: { id: data.id, name: data.name, email: data.email } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


route.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
});

route.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("Tasks")
      .select("*")
      .eq("user_id", req.userId)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

route.post("/tasks", authMiddleware, async (req, res) => {
  const { text, reminder_date } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Task text is required" });
  }

  try {
    const { data, error } = await supabase
      .from("Tasks")
      .insert([
        {
          text,
          reminder_date,
          user_id: req.userId,
        },
      ]);

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({message: "Task Added"});
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log(error);
  }
});

route.put("/tasks/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { text, reminder_date } = req.body;

  try {
    const { data, error } = await supabase
      .from("Tasks")
      .update({ text, reminder_date })
      .eq("id", id)
      .eq("user_id", req.userId)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    if (!data.length) return res.status(404).json({ error: "Task not found" });

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
});


route.delete("/tasks/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("Tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", req.userId);

    if (error) return res.status(500).json({ error: error.message });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = route;