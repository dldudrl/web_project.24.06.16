import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://172.30.1.56:8081/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: id,
          user_pw: password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        // 사용자 정보를 로컬스토리지에 저장
        localStorage.setItem('user_info', JSON.stringify(data));
        // sessionStorage.setItem('user_id', data.id);
        navigate('/main');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || '로그인 실패');
      }
    } catch (error) {
      setError('서버와 통신 중 오류가 발생했습니다. 로컬 저장소로 로그인 시도 중...');
      handleLocalLogin();
    }
  };
  

  const handleLocalLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem(`user_${id}`));
    if (storedUser && storedUser.user_pw === password) {
      sessionStorage.setItem('user_id', id);
      navigate('/main');
    } else {
      setError('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <EntranceContainer>
      <IntroducingContainer>
        <Logo src="/images/CattleBell_logo.png" alt="Logo" />
        <h1>어서오세요!</h1>
      </IntroducingContainer>
      <LoginContainer>
        <h2>로그인</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <Label htmlFor="id">아이디:</Label>
          <Input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">비밀번호:</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <ButtonGroup>
          <Button onClick={handleLogin}>로그인</Button>
          <Button onClick={handleSignup}>회원가입</Button>
        </ButtonGroup>
      </LoginContainer>
    </EntranceContainer>
    
  );
}

export default Login;

const EntranceContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100vh;

  @media (max-aspect-ratio: 1/1){
    flex-direction: column;
  }
`;

const IntroducingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;

  @media (max-width:768px){
    padding: 0px;
    font-size: 10px;
  }
`;

const Logo = styled.img`
  width: 400px;

  @media (max-width:768px){
    width: 200px;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  padding: 50px 120px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width:950px){
    padding: 20px 50px 30px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  width: calc(100% - 16px);
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Button = styled.button`
  width: 100%;
  font-size: 15px;
  font-weight: bold;
  padding: 10px;
  margin: 5px 0;
  border: none;
  border-radius: 4px;
  background-color: black;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #404040;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;
