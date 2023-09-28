const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const uri = "mongodb+srv://chetrachann:kucp23cc025@aupp-exam.qorqlbq.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const EmployeeSchema = new mongoose.Schema({
  empid: Number,
  name: String,
  emailid: { type: String, unique: true },
  password: String
});

const Employee = mongoose.model('Employee', EmployeeSchema);

app.post('/add', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.json({ message: "Record added successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "EMAILID ALREADY REGISTERED" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});
app.post('/login', async (req, res) => {
    try {
        const user = await Employee.findOne({ emailid: req.body.emailid });
        if (!user) {
            return res.status(400).json({ message: "INVALID UID OR PASSWORD" });
        }

        if (req.body.password !== user.password) {
            return res.status(400).json({ message: "INVALID UID OR PASSWORD" });
        }

        res.json({ message: `WELCOME ${user.name.toUpperCase()}` });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/viewall', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = 5005;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
