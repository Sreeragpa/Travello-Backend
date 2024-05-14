import app from "./frameworks/configs/app";
import connectDb from "./frameworks/configs/db";

// Connect Database
connectDb();

// Start Server
const PORT = process.env.PORT || 9000;
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})

