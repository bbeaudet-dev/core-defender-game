import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedBackground from '../ui/AnimatedBackground';
import GlitchText from '../ui/GlitchText';
import LoginForm from './LoginForm';

interface LoginScreenProps {
  onLoginSuccess: (type: 'signup' | 'signin' | 'guest', username?: string) => void;
}

// Generate random guest username
const generateGuestUsername = () => {
  const prefixes = ['USER', 'AGENT', 'OPERATOR', 'SYSTEM', 'CORE'];
  const suffixes = ['001', '007', '1337', '404', '777', '999'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}_${suffix}`;
};

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  
  const { signIn, signUp, isLoading } = useAuth();

  const handleSubmit = async () => {
    setError('');
    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all fields');
      return;
    }
    try {
      if (isSignUp) {
        await signUp(email, password, name);
        onLoginSuccess('signup');
      } else {
        await signIn(email, password);
        onLoginSuccess('signin');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    }
  };

  const handleGuestMode = () => {
    const username = generateGuestUsername();
    onLoginSuccess('guest', username);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setError('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setError('');
  };

  const handleNameChange = (text: string) => {
    setName(text);
    setError('');
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  return (
    <AnimatedBackground 
      source={require('../../../assets/images/glowing-green-neon-with-stars-29-09-2024-1727679307-hd-wallpaper.jpg')}
      opacity={isGlitching ? 0.7 : 1.0}
      isVideo={false}
      shouldLoop={false}
      shouldPlay={false}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            paddingHorizontal: 50,
            paddingTop: 20
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginBottom: 70, marginTop: -20 }}>
            <View style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.8,
              shadowRadius: 8,
              elevation: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* CORE text */}
              <GlitchText 
                text="CORE"
                fontSize={35}
                width={300}
                height={56}
                animationSpeed={50}
                animationInterval={1250}
                animationInterval2={1250}
                primaryColor="#E5484D"
                secondaryColor="#12A594"
                baseColor="white"
                opacity={0.9}
                textAlign="center"
                baseWord="CORE"
                wordList={['SYSTEM']}
                wordColors={{
                  'CORE': 'white',
                  'SYSTEM': 'white',
                }}
                onAnimationStart={() => setIsGlitching(true)}
                onAnimationEnd={() => setIsGlitching(false)}
              />
              {/* DEFENDER text */}
              <GlitchText 
                text="DEFENDER"
                fontSize={35}
                width={300}
                height={56}
                animationSpeed={50}
                animationInterval={1190}
                animationInterval2={60}
                primaryColor="#E5484D"
                secondaryColor="#12A594"
                baseColor="white"
                opacity={0.9}
                textAlign="center"
                baseWord="DEFENDER"
                wordList={['PROTOCOL', 'GUARDIAN']}
                wordColors={{
                  'DEFENDER': 'white',
                  'PROTOCOL': '#4ECDC4',
                  'GUARDIAN': '#45B7D1',
                }}
                onAnimationStart={() => setIsGlitching(true)}
                onAnimationEnd={() => setIsGlitching(false)}
              />
            </View>
          </View>
          
          <LoginForm
            email={email}
            password={password}
            name={name}
            isSignUp={isSignUp}
            isLoading={isLoading}
            error={error}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onNameChange={handleNameChange}
            onSubmit={handleSubmit}
            onToggleMode={handleToggleMode}
            onGuestMode={handleGuestMode}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedBackground>
  );
} 