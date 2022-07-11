#!/usr/bin/env node
import inquirer from 'inquirer';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import * as fs from 'fs';

let fileType = undefined;
let currentDirectory = process.cwd();
let filePath = '';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function getFileType() {
    const answers = await inquirer.prompt({
        name: 'fileType',
        type: 'input',
        message: 'File extension type to insert',
        default() {
            return 'py';
        },
    }); 
    fileType = answers.fileType;
}

async function getPathToWrite() {
    const answers = await inquirer.prompt({
        name: 'pathToWrite',
        type: 'input',
        message: 'Path to write file',
        default() {
            return './__init__.py';
        }
    });
    if (answers.pathToWrite === './__init__.py') {
        filePath = currentDirectory + '/__init__.py';
    } else {
        filePath = currentDirectory + '/' + answers.pathToWrite;
    }
}

await getFileType();
await getPathToWrite();

let init_code = `from pprint import pprint as print
def override(cls):
    def check_override(method):
        if method.__name__ not in dir(cls):
            raise OverrideError("{} does not override any method of {}".format(method, cls))
        return method
    return check_override

class console:
    def log(x):
        print(x)

    @override 
    def log(x, y):
        print(x, y)

    @override 
    def log(x, y, z):
        print(x, y, z)
`

async function writeCode()  {
    if ((fileType == 'py') || (fileType == 'python')) {
        fs.writeFile(filePath, init_code, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log('File created!');
        })
    } else {
        throw new Error('File type not supported (yet)');
    }
}

const spinner = createSpinner('Initializing...').start();

setTimeout(() => {
    spinner.success()
}, await writeCode())
