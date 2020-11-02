import React, { useEffect, useState } from 'react';
import { Container } from 'native-base';
import { AWS } from '../../lib/aws';
import Backgrounds from '../../components/backgrounds/Backgrounds';
import {styles} from '../../styles/styles'

// Components
import ConfirmAge from '../../components/login/ConfirmAge'
import ConfirmEmail from '../../components/login/ConfirmEmail'
import ForgottenPasswordForm from '../../components/login/ForgottenPasswordForm'
import LoggedIn from '../../components/login/LoggedIn'
import NotLoggedIn from '../../components/login/NotLoggedIn'
import SignInForm from '../../components/login/SignInForm'
import SignUp from '../../components/login/SignUp'
import SignUpFinish from '../../components/login/SignUpFinish'

const Login = ({ init, previousPage }) => {
  const [mode, setMode] = useState(null);
  const [params, setparams] = useState({ email: null, password: null, username: null });
  const [isOver21, setIsOver21] = useState(false);
  useEffect(() => {
    if (!mode) {
      AWS.current()
      .then(u => {
        setMode(init || !!u ? 7 : 0)
      })
      .catch(e => {
        setMode(init || 0)
      })
    }
  });

  function changeMode(n: number) {
    setMode(n);
    console.log(mode);
  }

  function onSignedUp(params, user) {
    setparams(params);
    setMode(2);
  }

  async function onConfirmed() {
    try {
      await AWS.signInAfterSignUp(params);
      setMode(3);
    } catch (error) {
      console.log(error);
    }
  }

  function onAgeConfirm(val) {
    setIsOver21(val);
    setMode(4);
  }

  const renderMode = () => {
    switch (mode) {
      case 0: // Not Logged In
        return <NotLoggedIn onChange={changeMode} />;
      case 1: // Sign up
        return <SignUp onChange={changeMode} onSignedUp={onSignedUp} />
      case 2: // Authenticate Email
        return <ConfirmEmail email={params.email} onConfirmed={onConfirmed} />
      case 3: // Confirm age on signup
        return <ConfirmAge onAgeConfirm={onAgeConfirm} />
      case 4: //Sign Up completion
        return <SignUpFinish isOver21={isOver21} />
      case 5: // Sign in form
        return <SignInForm onChange={changeMode} previousPage={previousPage} />
      case 6: // Forgotten password
        return <ForgottenPasswordForm onChange={changeMode} />
      case 7: // Logged In
        return <LoggedIn onChange={changeMode} />
      default:
        return <Container style={styles.container} />;
    }
  }

  return (
    <Backgrounds background={"Grad1"} >
      {renderMode()}
    </Backgrounds>
  )
}

export default Login