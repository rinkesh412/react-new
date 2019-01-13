import React from 'react';

const DSPContext = React.createContext({});

export const DSPProvider = DSPContext.Provider;
export const DSPConsumer = DSPContext.Consumer;