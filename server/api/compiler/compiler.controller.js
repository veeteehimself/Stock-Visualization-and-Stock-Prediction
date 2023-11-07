const { PythonShell } = require('python-shell');



const runFile = async (req, res) => {
  const pythonScript = '../../../models/ProjectLSTM.py';
  
  const options = {
    mode: 'text',
    pythonPath: '/usr/local/bin/python3', // Replace with your Anaconda Python path
    pythonOptions: ['-u'], // Unbuffered output
    scriptPath: __dirname, // Current directory
  };

  PythonShell.run(pythonScript, options, (err, results) => {
    if (err) {
      console.error(`Error running Python script: ${err}`);
      return res.status(500).send('Internal Server Error');
    }

    const output = results.join('\n');
    console.log(`Python script output: ${output}`);
    res.send(`Python script output: ${output}`);
  });
}


  
module.exports = {runFile};
