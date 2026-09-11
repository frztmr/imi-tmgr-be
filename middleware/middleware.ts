

import {
    authRouter,
    uiRouter
    // you can add more. please add here first
} from '../routes/' // this router is connected to index.ts


import express from 'express';
export const middleware =
    (App: express.Application): void => {
        App.use('/auth', authRouter);
        App.use('/ui', uiRouter);
        // you can add more. 

    }