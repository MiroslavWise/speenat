const asyncPause = (time = 1000) => new Promise<void>(resolve => setTimeout(() => resolve(), time));

export default asyncPause;
