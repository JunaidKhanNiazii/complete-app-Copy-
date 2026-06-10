const { spawn } = require('child_process');
const path = require('path');

/**
 * Bridge function to call Python RAG service
 * @param {string} query - The user's message
 * @param {number} topK - Number of results to retrieve
 */
async function retrieveExercises(query, topK = 3) {
    return new Promise((resolve, reject) => {
        const pythonPath = path.join(__dirname, '../venv/bin/python'); // Path to venv python
        const scriptPath = path.join(__dirname, 'ragService.py');

        // Use a small wrapper to call only the retrieve function if needed, 
        // or just parse the output of the existing test script if formatted.
        // For reliability, we'll use a one-liner to call the class directly.
        const pythonCommand = `
import sys
import json
import os
sys.path.append('${path.dirname(scriptPath)}')
from ragService import ExerciseRAG

# Suppress stderr to avoid trash in output
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

try:
    BASE_DIR = os.path.dirname(os.path.dirname('${scriptPath}'))
    DATA_PATH = os.path.join(BASE_DIR, "data/gym_exercises.csv")
    rag = ExerciseRAG(DATA_PATH)
    results = rag.retrieve("${query.replace(/"/g, '\\"')}", top_k=${topK})
    print(json.dumps(results))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`;

        const pyProcess = spawn(pythonPath, ['-c', pythonCommand]);

        let output = '';
        let errorOutput = '';

        pyProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pyProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pyProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('[RAG Helper] Python process failed:', errorOutput);
                return resolve([]); // Return empty on error to keep app running
            }
            try {
                const results = JSON.parse(output.trim());
                if (results.error) {
                    console.error('[RAG Helper] Python error:', results.error);
                    return resolve([]);
                }
                resolve(results);
            } catch (e) {
                console.error('[RAG Helper] Failed to parse output:', output);
                resolve([]);
            }
        });
    });
}

module.exports = { retrieveExercises };
