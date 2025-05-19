const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();  

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials are missing. Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;