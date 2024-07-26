import React from 'react';
import { QueryClientProvider, QueryClient, useQuery } from 'react-query';
import ChatList from './components/ChatList';

const queryClient = new QueryClient();

function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
      <ChatList/>
    </QueryClientProvider>
  );
}

export default App;