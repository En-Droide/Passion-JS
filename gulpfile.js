import {spawn} from 'node:child_process';
import gulp from 'gulp';

const {watch, series} = gulp;

let mainProcess = null;

const start = async () => {
    mainProcess = spawn('node', ['./Messi_data.js'], {stdio: 'inherit'});
};

const stop = async () => {
    if (mainProcess) {
        await mainProcess.kill();
        mainProcess = null;
    }
};

const watcher = async () => {
    watch(['./**/*.js', './**/*.json', '!./data/*'], series(stop, start));
};

const defaultRun = series(start, watcher);

export default defaultRun;
export {watcher, defaultRun};