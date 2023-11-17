const { PythonShell } = require('python-shell');



const runFile = async (req, res) => {
  const pythonScript = '../../../models/ProjectLSTM.py';
  const { params } = req;
  console.log(params)
  const pythonArguments = [params.stock];
  console.log(pythonArguments)

  const options = {
    mode: 'text',
    pythonPath: '/usr/local/bin/python3', // Replace with your Anaconda Python path
    pythonOptions: ['-u'], // Unbuffered output
    scriptPath: __dirname, // Current directory,
    args: pythonArguments
  };

//   try {
//     const results = await runPythonScript(pythonScript, options);
//     const output = results.join('\n');
//     console.log(Python script output: ${output});
//     res.status(200).json({success:'File made!'});
//   } catch (err) {
//     console.error(Error running Python script: ${err});
//     res.status(500).json({error:'Internal Server Error'});
//   }
// };
  try{
    PythonShell.run(pythonScript, options).then(messages =>{
      console.log(`Python script output: ${messages}`);
      res.status(200).json(`{success:'File made!'}`);
    });
  } catch(err){
    console.error(`Error running Python script: ${err}`);
    res.status(500).json({error:'Internal Server Error'});
  }
}

// const runPythonScript = (pythonScript, options) => {
//   return new Promise((resolve, reject) => {
//     PythonShell.run(pythonScript, options, (err, results) => {
//       if (err) {
//         console.log('I MADE IT INSIDE THE ERROR')
//         reject(err);
//       } else {
//         console.log('I MADE IT INTO THE CORRECT ONE!')
//         resolve(results);
//       }
//     });
//   });
// }

module.exports = {runFile};