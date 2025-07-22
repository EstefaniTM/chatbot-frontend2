import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const typing = keyframes`
  0%, 60%, 100% { transform: scale(1); }
  30% { transform: scale(1.3); }
`;

export const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  height: 70vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

export const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: white;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
`;

export const Message = styled.div`
  display: flex;
  justify-content: ${props => props.sender === 'user' ? 'flex-end' : 'flex-start'};
  margin-bottom: 15px;
  animation: ${fadeIn} 0.3s ease-in;
`;

export const UserMessage = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 18px;
  border-radius: 20px 20px 5px 20px;
  max-width: 70%;
  word-wrap: break-word;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
`;

export const BotMessage = styled.div`
  background: #f0f0f0;
  color: #333;
  padding: 12px 18px;
  border-radius: 20px 20px 20px 5px;
  max-width: 70%;
  word-wrap: break-word;
  border-left: 4px solid #667eea;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const InputContainer = styled.div`
  display: flex;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  gap: 10px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 15px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  &::placeholder {
    color: #999;
  }
`;

export const SendButton = styled.button`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const TypingIndicator = styled.div`
  background: #f0f0f0;
  padding: 15px 20px;
  border-radius: 20px 20px 20px 5px;
  border-left: 4px solid #667eea;
  display: flex;
  gap: 5px;
  
  span {
    width: 8px;
    height: 8px;
    background: #999;
    border-radius: 50%;
    animation: ${typing} 1.4s infinite;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;
